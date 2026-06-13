import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Recipe } from './entities/recipe.entity';
import { RecipeModerationAudit } from './entities/recipe-moderation-audit.entity';

@Injectable()
export class RecipeModerationService implements OnModuleInit {
  private readonly logger = new Logger(RecipeModerationService.name);
  private genAI: GoogleGenerativeAI | null = null;
  private modelName = 'gemini-2.5-flash';

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Recipe)
    private readonly recipeRepo: Repository<Recipe>,
    @InjectRepository(RecipeModerationAudit)
    private readonly auditRepo: Repository<RecipeModerationAudit>,
  ) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    const isPlaceholder =
      !apiKey ||
      apiKey.trim() === '' ||
      apiKey.includes('YOUR_') ||
      apiKey.includes('your_');
    if (isPlaceholder) {
      this.logger.warn(
        'GEMINI_API_KEY is not defined or is a placeholder. Recipe AI Moderation will run in fallback/static mode.',
      );
      this.genAI = null;
    } else {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
      } catch (err: any) {
        this.logger.error(
          'Failed to initialize Gemini AI for Moderation:',
          err.message,
        );
        this.genAI = null;
      }
    }
  }

  async auditRecipe(recipeId: string): Promise<RecipeModerationAudit> {
    this.logger.log(`AI Auditing recipe ID: ${recipeId}`);

    const recipe = await this.recipeRepo.findOne({
      where: { id: recipeId },
      relations: ['recipeIngredients', 'recipeIngredients.ingredient'],
    });

    if (!recipe) {
      throw new Error(`Recipe with ID ${recipeId} not found`);
    }

    // Initialize audit log
    let audit = await this.auditRepo.findOne({ where: { recipeId } });
    if (!audit) {
      audit = new RecipeModerationAudit();
      audit.recipeId = recipeId;
    }

    // 1. Static Duplication Check (Simple name overlap)
    const possibleDuplicate = await this.recipeRepo.findOne({
      where: {
        name: ILike(`%${recipe.name}%`),
        isActive: true,
        status: 'approved',
      },
    });

    if (possibleDuplicate && possibleDuplicate.id !== recipe.id) {
      audit.isDuplicateDetected = true;
      audit.duplicateOfRecipeId = possibleDuplicate.id;
    } else {
      audit.isDuplicateDetected = false;
      audit.duplicateOfRecipeId = null;
    }

    // 2. Base static validation
    const missingIngredients: string[] = [];
    const missingSteps: string[] = [];
    let qualityScore = 100;

    const ingredientNames =
      recipe.recipeIngredients?.map(
        (ri) => ri.ingredient?.name?.toLowerCase() || '',
      ) || [];
    const stepsText =
      recipe.steps?.map((s) => s.description.toLowerCase()).join(' ') || '';

    // Check ingredients referenced in steps but missing in ingredient list
    const stepWords = stepsText.split(/[\s,.\-()]+/);
    const keywordsToCheck = [
      'tỏi',
      'hành',
      'tiêu',
      'ớt',
      'muối',
      'đường',
      'mắm',
      'dầu',
      'bơ',
      'sữa',
      'trứng',
      'thịt',
      'cá',
      'tôm',
      'gà',
    ];
    for (const kw of keywordsToCheck) {
      if (
        stepWords.includes(kw) &&
        !ingredientNames.some((ing) => ing.includes(kw))
      ) {
        missingIngredients.push(
          `Thiếu nguyên liệu có từ khóa "${kw}" mặc dù có nhắc tới ở các bước chế biến.`,
        );
      }
    }

    if (recipe.steps.length < 2) {
      missingSteps.push(
        'Các bước chế biến quá ngắn (ít hơn 2 bước). Hãy điền chi tiết hơn.',
      );
      qualityScore -= 20;
    }

    if (ingredientNames.length < 2) {
      missingIngredients.push(
        'Danh sách nguyên liệu quá nghèo nàn (ít hơn 2 loại nguyên liệu).',
      );
      qualityScore -= 20;
    }

    let rawFeedback = 'Kiểm thử tĩnh hoàn thành.';
    let nutritionValidityNotes =
      'Calo tĩnh có vẻ hợp lý dựa trên ước lượng nguyên liệu.';
    let aiEvaluationFailed = false;

    // 3. AI Powered Evaluation if Gemini is available
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({ model: this.modelName });
        const prompt = `
          Bạn là trợ lý kiểm duyệt món ăn thông minh (Recipe AI Auditor).
          Hãy phân tích công thức món ăn sau:
          
          Tên món: ${recipe.name}
          Mô tả: ${recipe.description || 'Không có'}
          Nguyên liệu: ${recipe.recipeIngredients?.map((ri) => `${ri.quantity} ${ri.unit} ${ri.ingredient?.name}`).join(', ') || 'Không có'}
          Số calo tự khai báo: ${recipe.calories} kcal/phần
          Protein: ${recipe.protein}g, Carbs: ${recipe.carbs}g, Fat: ${recipe.fat}g
          Các bước làm:
          ${recipe.steps?.map((s) => `Bước ${s.step}: ${s.description}`).join('\n') || 'Không có'}
          
          Yêu cầu:
          Đánh giá tính hợp lý của số lượng Calo và Dinh dưỡng tự khai báo dựa trên danh sách nguyên liệu. 
          Nếu lượng calo chênh lệch quá lớn so với thực tế các nguyên liệu, hãy cảnh báo.
          Vui lòng đưa ra đánh giá bằng tiếng Việt, cực kỳ ngắn gọn, định dạng JSON thô không bọc trong thẻ markdown, có cấu trúc:
          {
            "caloriesReasonable": true/false,
            "nutritionValidityNotes": "Lời khuyên/nhận xét về dinh dưỡng",
            "qualityScore": 0-100,
            "missingIngredients": ["nguyên liệu A", "nguyên liệu B"],
            "missingSteps": ["bước làm A", "bước làm B"],
            "feedback": "Nhận xét tổng quan của AI về chất lượng bài viết"
          }
        `;

        const response = await model.generateContent(prompt);
        const text = response.response.text();
        // Clean JSON formatting from markdown code blocks
        const cleanedText = text
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();
        const aiResult = JSON.parse(cleanedText);

        if (aiResult) {
          if (
            aiResult.missingIngredients &&
            Array.isArray(aiResult.missingIngredients)
          ) {
            missingIngredients.push(...aiResult.missingIngredients);
          }
          if (aiResult.missingSteps && Array.isArray(aiResult.missingSteps)) {
            missingSteps.push(...aiResult.missingSteps);
          }
          qualityScore = Number(aiResult.qualityScore || qualityScore);
          nutritionValidityNotes =
            aiResult.nutritionValidityNotes || nutritionValidityNotes;
          rawFeedback = aiResult.feedback || rawFeedback;
        }
      } catch (err: any) {
        this.logger.error(
          'Gemini AI recipe moderation failed, relying on static rules:',
          err.message,
        );
        rawFeedback = `Kiểm thử tĩnh hoàn thành. Đánh giá AI thất bại: ${err.message}`;
        aiEvaluationFailed = true;
      }
    } else {
      rawFeedback =
        'Không thể đánh giá bằng AI lúc này (API key chưa cấu hình).';
      aiEvaluationFailed = true;
    }

    // Clean up duplicate strings in arrays
    audit.missingIngredients = Array.from(new Set(missingIngredients));
    audit.missingSteps = Array.from(new Set(missingSteps));

    // Deduct score for duplicates
    if (audit.isDuplicateDetected) {
      qualityScore = Math.max(10, qualityScore - 30);
      rawFeedback = `CẢNH BÁO: Phát hiện món ăn trùng lặp có tên gần giống (${possibleDuplicate?.name}). ${rawFeedback}`;
    }

    if (aiEvaluationFailed) {
      audit.qualityScore = -1;
      audit.isApprovedByAI = false;
      audit.aiEvaluationFailed = true;
      audit.nutritionValidityNotes = 'Không thể đánh giá bằng AI lúc này';
      audit.rawAIFeedback = rawFeedback;
    } else {
      audit.qualityScore = Math.max(0, Math.min(100, qualityScore));
      audit.isApprovedByAI =
        audit.qualityScore >= 70 &&
        audit.missingIngredients.length === 0 &&
        !audit.isDuplicateDetected;
      audit.aiEvaluationFailed = false;
      audit.nutritionValidityNotes = nutritionValidityNotes;
      audit.rawAIFeedback = rawFeedback;
    }

    return await this.auditRepo.save(audit);
  }

  async getAuditByRecipeId(
    recipeId: string,
  ): Promise<RecipeModerationAudit | null> {
    return await this.auditRepo.findOne({ where: { recipeId } });
  }
}
