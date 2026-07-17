import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, FunctionDeclaration } from '@google/generative-ai';
import { ChatMessage } from './entities/chat-message.entity';
import { UserActionLog } from './entities/user-action-log.entity';
import { ChatbotActionHandler } from './chatbot-action.handler';
import { User } from '../auth/entities/user.entity';
import {
  getProfileCompletion,
  getProfileUpdateAction,
  ProfileCompletionResult,
  ProfileCompletionStatus,
} from './profile-completion.util';

@Injectable()
export class ChatbotAIService implements OnModuleInit {
  private readonly logger = new Logger(ChatbotAIService.name);
  private genAI: GoogleGenerativeAI | null = null;
  private modelName = 'gemini-2.5-flash';

  constructor(
    private readonly configService: ConfigService,
    private readonly actionHandler: ChatbotActionHandler,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepo: Repository<ChatMessage>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserActionLog)
    private readonly actionLogRepo: Repository<UserActionLog>,
  ) {}

  isAIAvailable(): boolean {
    return this.genAI !== null;
  }

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    const isPlaceholder =
      !apiKey ||
      apiKey.trim() === '' ||
      apiKey.includes('YOUR_') ||
      apiKey.includes('your_');
    if (isPlaceholder) {
      this.logger.warn(
        'GEMINI_API_KEY is not defined or is a placeholder in environment variables. Chatbot will run in fallback/mock mode.',
      );
      this.genAI = null;
      return;
    }
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.logger.log('Google Generative AI successfully initialized.');
    } catch (err: any) {
      this.logger.error(
        'Failed to initialize Google Generative AI:',
        err.message,
      );
      this.genAI = null;
    }
  }

  // Define Function Declarations for Gemini Function Calling
  private getFunctions(): FunctionDeclaration[] {
    return [
      {
        name: 'search_recipes',
        description:
          'TÃ¬m kiáº¿m cÃ´ng thá»©c náº¥u Äƒn trong cÆ¡ sá»Ÿ dá»¯ liá»‡u vá»›i cÃ¡c bá»™ lá»c nhÆ° tÃªn, loáº¡i bá»¯a Äƒn, thá»i gian náº¥u, lÆ°á»£ng calo, vÃ¹ng miá»n.',
        parameters: {
          type: 'OBJECT' as any,
          properties: {
            search: {
              type: 'STRING' as any,
              description:
                'Tá»« khÃ³a tÃ¬m kiáº¿m tÃªn cÃ´ng thá»©c mÃ³n Äƒn (vÃ­ dá»¥: phá»Ÿ, gÃ , cÃ¡...)',
            },
            mealType: {
              type: 'STRING' as any,
              description:
                'Loáº¡i bá»¯a Äƒn: breakfast (bá»¯a sÃ¡ng), lunch (bá»¯a trÆ°a), dinner (bá»¯a tá»‘i)',
            },
            maxCookingTime: {
              type: 'NUMBER' as any,
              description: 'Thá»i gian náº¥u tá»‘i Ä‘a báº±ng phÃºt',
            },
            minCalories: {
              type: 'NUMBER' as any,
              description: 'LÆ°á»£ng calo tá»‘i thiá»ƒu',
            },
            maxCalories: {
              type: 'NUMBER' as any,
              description: 'LÆ°á»£ng calo tá»‘i Ä‘a',
            },
            region: {
              type: 'STRING' as any,
              description:
                'VÃ¹ng miá»n áº©m thá»±c (vÃ­ dá»¥: miá»n Báº¯c, miá»n Trung, miá»n Nam)',
            },
            limit: {
              type: 'NUMBER' as any,
              description: 'Sá»‘ lÆ°á»£ng cÃ´ng thá»©c muá»‘n láº¥y (máº·c Ä‘á»‹nh 5)',
            },
          },
        },
      },
      {
        name: 'get_recipe_detail',
        description:
          'Xem chi tiáº¿t má»™t cÃ´ng thá»©c cá»¥ thá»ƒ bao gá»“m mÃ´ táº£, nguyÃªn liá»‡u chi tiáº¿t, cÃ¡c bÆ°á»›c thá»±c hiá»‡n vÃ  dinh dÆ°á»¡ng.',
        parameters: {
          type: 'OBJECT' as any,
          properties: {
            recipeId: {
              type: 'STRING' as any,
              description: 'ID duy nháº¥t cá»§a cÃ´ng thá»©c mÃ³n Äƒn',
            },
          },
          required: ['recipeId'],
        },
      },
      {
        name: 'get_recommendations',
        description:
          'Gá»£i Ã½ mÃ³n Äƒn cÃ¡ nhÃ¢n hÃ³a tá»« AI dá»±a trÃªn sá»Ÿ thÃ­ch, dá»‹ á»©ng, má»¥c tiÃªu dinh dÆ°á»¡ng hoáº·c sá»­ dá»¥ng nguyÃªn liá»‡u thÃ´ng minh (chá»‘ng lÃ£ng phÃ­).',
        parameters: {
          type: 'OBJECT' as any,
          properties: {
            mealType: {
              type: 'STRING' as any,
              description: 'Loáº¡i bá»¯a Äƒn: breakfast, lunch, dinner',
            },
            limit: {
              type: 'NUMBER' as any,
              description: 'Sá»‘ lÆ°á»£ng gá»£i Ã½ (máº·c Ä‘á»‹nh 5)',
            },
            useAntiWaste: {
              type: 'BOOLEAN' as any,
              description:
                'CÃ³ Æ°u tiÃªn sá»­ dá»¥ng nguyÃªn liá»‡u sáº¯p háº¿t háº¡n trong tá»§ láº¡nh khÃ´ng (máº·c Ä‘á»‹nh true)',
            },
            excludeIds: {
              type: 'ARRAY' as any,
              items: { type: 'STRING' as any },
              description:
                'Danh sÃ¡ch ID cÃ¡c mÃ³n Äƒn muá»‘n loáº¡i trá»« khÃ´ng gá»£i Ã½ trÃ¹ng láº·p (vÃ­ dá»¥: cÃ¡c mÃ³n Ä‘Ã£ cÃ³ trong thá»±c Ä‘Æ¡n).',
            },
          },
        },
      },
      {
        name: 'get_inventory',
        description:
          'Xem toÃ n bá»™ cÃ¡c nguyÃªn liá»‡u Ä‘ang cÃ³ sáºµn trong tá»§ láº¡nh (inventory) cá»§a ngÆ°á»i dÃ¹ng.',
        parameters: { type: 'OBJECT' as any, properties: {} },
      },
      {
        name: 'get_expiring_items',
        description:
          'Kiá»ƒm tra vÃ  tÃ¬m cÃ¡c nguyÃªn liá»‡u trong tá»§ láº¡nh cá»§a ngÆ°á»i dÃ¹ng sáº¯p háº¿t háº¡n sá»­ dá»¥ng (trong vÃ²ng 7 ngÃ y tá»›i) hoáº·c á»Ÿ má»©c cáº£nh bÃ¡o.',
        parameters: { type: 'OBJECT' as any, properties: {} },
      },
      {
        name: 'search_ingredients',
        description:
          'TÃ¬m kiáº¿m nguyÃªn liá»‡u trong danh má»¥c há»‡ thá»‘ng Ä‘á»ƒ láº¥y ID chÃ­nh xÃ¡c khi muá»‘n thÃªm vÃ o tá»§ láº¡nh.',
        parameters: {
          type: 'OBJECT' as any,
          properties: {
            query: {
              type: 'STRING' as any,
              description:
                'TÃªn nguyÃªn liá»‡u cáº§n tÃ¬m (vÃ­ dá»¥: trá»©ng, sá»¯a, thá»‹t bÃ²...)',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'add_to_inventory',
        description:
          'ThÃªm má»™t nguyÃªn liá»‡u má»›i vÃ o tá»§ láº¡nh cá»§a ngÆ°á»i dÃ¹ng Ä‘á»ƒ theo dÃµi háº¡n sá»­ dá»¥ng.',
        parameters: {
          type: 'OBJECT' as any,
          properties: {
            ingredientId: {
              type: 'STRING' as any,
              description: 'ID cá»§a nguyÃªn liá»‡u trong há»‡ thá»‘ng',
            },
            quantity: {
              type: 'NUMBER' as any,
              description: 'Sá»‘ lÆ°á»£ng nguyÃªn liá»‡u',
            },
            unit: {
              type: 'STRING' as any,
              description: 'ÄÆ¡n vá»‹ tÃ­nh (vÃ­ dá»¥: g, quáº£, há»™p, lÃ­t...)',
            },
            expirationDate: {
              type: 'STRING' as any,
              description: 'NgÃ y háº¿t háº¡n Ä‘á»‹nh dáº¡ng YYYY-MM-DD (náº¿u cÃ³)',
            },
            notes: { type: 'STRING' as any, description: 'Ghi chÃº thÃªm' },
          },
          required: ['ingredientId', 'quantity', 'unit'],
        },
      },
      {
        name: 'generate_meal_plan',
        description:
          'Tá»± Ä‘á»™ng lÃªn thá»±c Ä‘Æ¡n/káº¿ hoáº¡ch Äƒn uá»‘ng thÃ´ng minh cho cáº£ tuáº§n dá»±a trÃªn sá»Ÿ thÃ­ch vÃ  dinh dÆ°á»¡ng. KhÃ´ng táº¡o mÃ³n cho ngÃ y Ä‘Ã£ qua; náº¿u lÃ  tuáº§n hiá»‡n táº¡i thÃ¬ chá»‰ táº¡o tá»« hÃ´m nay trá»Ÿ Ä‘i.',
        parameters: {
          type: 'OBJECT' as any,
          properties: {
            weekStart: {
              type: 'STRING' as any,
              description:
                'NgÃ y báº¯t Ä‘áº§u cá»§a tuáº§n Ä‘á»‹nh dáº¡ng YYYY-MM-DD (pháº£i lÃ  ngÃ y Thá»© Hai, khÃ´ng thuá»™c tuáº§n Ä‘Ã£ qua)',
            },
            useAntiWaste: {
              type: 'BOOLEAN' as any,
              description:
                'CÃ³ Æ°u tiÃªn náº¥u cÃ¡c nguyÃªn liá»‡u Ä‘ang sáº¯p háº¿t háº¡n trong tá»§ láº¡nh khÃ´ng (máº·c Ä‘á»‹nh true)',
            },
            overwrite: {
              type: 'BOOLEAN' as any,
              description:
                'Äáº·t lÃ  true náº¿u muá»‘n táº¡o láº¡i/thiáº¿t láº­p láº¡i toÃ n bá»™ thá»±c Ä‘Æ¡n tuáº§n má»›i (ghi Ä‘Ã¨ cÃ¡c mÃ³n cÅ© khÃ´ng bá»‹ khÃ³a).',
            },
          },
        },
      },
      {
        name: 'get_meal_plan',
        description:
          'Xem thá»±c Ä‘Æ¡n / káº¿ hoáº¡ch Äƒn uá»‘ng hiá»‡n táº¡i cá»§a ngÆ°á»i dÃ¹ng cho má»™t tuáº§n cá»¥ thá»ƒ.',
        parameters: {
          type: 'OBJECT' as any,
          properties: {
            weekStart: {
              type: 'STRING' as any,
              description:
                'NgÃ y báº¯t Ä‘áº§u cá»§a tuáº§n Ä‘á»‹nh dáº¡ng YYYY-MM-DD (Thá»© Hai)',
            },
          },
        },
      },
      {
        name: 'get_shopping_lists',
        description: 'Xem cÃ¡c danh sÃ¡ch mua sáº¯m hiá»‡n cÃ³ cá»§a ngÆ°á»i dÃ¹ng.',
        parameters: { type: 'OBJECT' as any, properties: {} },
      },
      {
        name: 'generate_shopping_list',
        description:
          'Táº¡o danh sÃ¡ch mua sáº¯m nguyÃªn liá»‡u tá»± Ä‘á»™ng tá»« má»™t káº¿ hoáº¡ch thá»±c Ä‘Æ¡n (meal plan) cá»¥ thá»ƒ, tá»± Ä‘á»™ng trá»« Ä‘i nguyÃªn liá»‡u Ä‘Ã£ cÃ³ trong tá»§ láº¡nh. CÃ³ thá»ƒ tÃ¹y chá»n táº¡o cho cÃ¡c ngÃ y cá»¥ thá»ƒ.',
        parameters: {
          type: 'OBJECT' as any,
          properties: {
            mealPlanId: {
              type: 'STRING' as any,
              description: 'ID cá»§a thá»±c Ä‘Æ¡n tuáº§n cáº§n táº¡o danh sÃ¡ch mua sáº¯m',
            },
            days: {
              type: 'ARRAY' as any,
              items: { type: 'NUMBER' as any },
              description:
                'Máº£ng sá»‘ nguyÃªn Ä‘áº¡i diá»‡n cho cÃ¡c ngÃ y cá»¥ thá»ƒ trong tuáº§n muá»‘n táº¡o nguyÃªn liá»‡u Ä‘i chá»£ (1: Thá»© Hai, 2: Thá»© Ba, ..., 7: Chá»§ Nháº­t). Äá»ƒ trá»‘ng náº¿u muá»‘n xuáº¥t cáº£ tuáº§n.',
            },
          },
          required: ['mealPlanId'],
        },
      },
      {
        name: 'add_to_meal_plan',
        description:
          'ThÃªm hoáº·c cáº­p nháº­t má»™t mÃ³n Äƒn cá»¥ thá»ƒ vÃ o má»™t ngÃ y vÃ  buá»•i Äƒn xÃ¡c Ä‘á»‹nh trong thá»±c Ä‘Æ¡n tuáº§n cá»§a ngÆ°á»i dÃ¹ng. Chá»‰ chá»n ngÃ y hÃ´m nay hoáº·c tÆ°Æ¡ng lai.',
        parameters: {
          type: 'OBJECT' as any,
          properties: {
            recipeId: {
              type: 'STRING' as any,
              description:
                'ID cá»§a cÃ´ng thá»©c mÃ³n Äƒn muá»‘n thÃªm. Náº¿u khÃ´ng cÃ³ ID nhÆ°ng cÃ³ tÃªn mÃ³n Äƒn cá»¥ thá»ƒ, hÃ£y bá» trá»‘ng recipeId vÃ  Ä‘iá»n recipeName.',
            },
            recipeName: {
              type: 'STRING' as any,
              description:
                'TÃªn mÃ³n Äƒn muá»‘n thÃªm (vÃ­ dá»¥: phá»Ÿ bÃ², chÃ¡o gÃ ) náº¿u chÆ°a cÃ³ recipeId.',
            },
            mealDate: {
              type: 'STRING' as any,
              description:
                'NgÃ y cá»¥ thá»ƒ muá»‘n thÃªm mÃ³n Äƒn, Ä‘á»‹nh dáº¡ng YYYY-MM-DD (vÃ­ dá»¥: 2026-06-08)',
            },
            mealType: {
              type: 'STRING' as any,
              description:
                'Loáº¡i bá»¯a Äƒn: breakfast (SÃ¡ng), lunch (TrÆ°a), dinner (Tá»‘i)',
            },
            dayOfWeek: {
              type: 'NUMBER' as any,
              description:
                'NgÃ y trong tuáº§n (1: Thá»© Hai, 2: Thá»© Ba, ..., 7: Chá»§ Nháº­t) - Fallback náº¿u khÃ´ng cÃ³ mealDate',
            },
            weekStart: {
              type: 'STRING' as any,
              description:
                'NgÃ y báº¯t Ä‘áº§u cá»§a tuáº§n YYYY-MM-DD - Fallback náº¿u khÃ´ng cÃ³ mealDate',
            },
            overwrite: {
              type: 'BOOLEAN' as any,
              description:
                'Äáº·t lÃ  true náº¿u Ä‘Ã¢y lÃ  yÃªu cáº§u thay Ä‘á»•i, Ä‘á»•i mÃ³n, hoáº·c thay tháº¿ mÃ³n Äƒn Ä‘Ã£ cÃ³ sáºµn trong bá»¯a Äƒn.',
            },
          },
          required: ['mealDate', 'mealType'],
        },
      },
      {
        name: 'remove_from_meal_plan',
        description:
          'XÃ³a hoáº·c há»§y má»™t mÃ³n Äƒn khá»i bá»¯a Äƒn cá»¥ thá»ƒ (SÃ¡ng, TrÆ°a, Tá»‘i) trong thá»±c Ä‘Æ¡n tuáº§n cá»§a ngÆ°á»i dÃ¹ng.',
        parameters: {
          type: 'OBJECT' as any,
          properties: {
            mealDate: {
              type: 'STRING' as any,
              description:
                'NgÃ y cá»¥ thá»ƒ muá»‘n xÃ³a mÃ³n Äƒn, Ä‘á»‹nh dáº¡ng YYYY-MM-DD (vÃ­ dá»¥: 2026-06-08)',
            },
            mealType: {
              type: 'STRING' as any,
              description:
                'Loáº¡i bá»¯a Äƒn muá»‘n xÃ³a: breakfast (SÃ¡ng), lunch (TrÆ°a), dinner (Tá»‘i)',
            },
            dayOfWeek: {
              type: 'NUMBER' as any,
              description:
                'NgÃ y trong tuáº§n muá»‘n xÃ³a (1-7) - Fallback náº¿u khÃ´ng cÃ³ mealDate',
            },
            weekStart: {
              type: 'STRING' as any,
              description:
                'NgÃ y báº¯t Ä‘áº§u cá»§a tuáº§n YYYY-MM-DD - Fallback náº¿u khÃ´ng cÃ³ mealDate',
            },
            recipeId: {
              type: 'STRING' as any,
              description:
                'ID cá»§a cÃ´ng thá»©c mÃ³n Äƒn muá»‘n xÃ³a cá»¥ thá»ƒ. Náº¿u Ä‘á»ƒ trá»‘ng, há»‡ thá»‘ng sáº½ xÃ³a toÃ n bá»™ cÃ¡c mÃ³n Äƒn trong bá»¯a Äƒn nÃ y.',
            },
          },
          required: ['mealDate', 'mealType'],
        },
      },
      {
        name: 'delete_meal_plan',
        description: 'XÃ³a hoÃ n toÃ n thá»±c Ä‘Æ¡n tuáº§n hiá»‡n táº¡i cá»§a ngÆ°á»i dÃ¹ng.',
        parameters: {
          type: 'OBJECT' as any,
          properties: {
            weekStart: {
              type: 'STRING' as any,
              description:
                'NgÃ y báº¯t Ä‘áº§u cá»§a tuáº§n YYYY-MM-DD cáº§n xÃ³a. Äá»ƒ trá»‘ng náº¿u lÃ  tuáº§n hiá»‡n táº¡i.',
            },
          },
        },
      },
      {
        name: 'generate_meal_plan_for_days',
        description:
          'Tá»± Ä‘á»™ng táº¡o hoáº·c cáº­p nháº­t thá»±c Ä‘Æ¡n tuáº§n chá»‰ dÃ nh cho má»™t hoáº·c má»™t vÃ i ngÃ y Ä‘Æ°á»£c chá»n (giá»¯ nguyÃªn cÃ¡c ngÃ y khÃ¡c). Chá»‰ táº¡o cho hÃ´m nay hoáº·c ngÃ y tÆ°Æ¡ng lai.',
        parameters: {
          type: 'OBJECT' as any,
          properties: {
            mealDates: {
              type: 'ARRAY' as any,
              items: { type: 'STRING' as any },
              description:
                'Máº£ng chuá»—i cÃ¡c ngÃ y cá»¥ thá»ƒ cáº§n táº¡o thá»±c Ä‘Æ¡n, Ä‘á»‹nh dáº¡ng YYYY-MM-DD (vÃ­ dá»¥: ["2026-06-08", "2026-06-09"]).',
            },
            days: {
              type: 'ARRAY' as any,
              items: { type: 'NUMBER' as any },
              description:
                'Máº£ng sá»‘ nguyÃªn cÃ¡c ngÃ y (1-7) - Fallback náº¿u khÃ´ng cÃ³ mealDates.',
            },
            weekStart: {
              type: 'STRING' as any,
              description:
                'NgÃ y báº¯t Ä‘áº§u cá»§a tuáº§n YYYY-MM-DD - Fallback náº¿u khÃ´ng cÃ³ mealDates.',
            },
            useAntiWaste: {
              type: 'BOOLEAN' as any,
              description:
                'CÃ³ Æ°u tiÃªn sá»­ dá»¥ng nguyÃªn liá»‡u sáº¯p háº¿t háº¡n trong tá»§ láº¡nh khÃ´ng.',
            },
            mealType: {
              type: 'STRING' as any,
              description:
                'Loáº¡i bá»¯a Äƒn muá»‘n táº¡o: breakfast (SÃ¡ng), lunch (TrÆ°a), dinner (Tá»‘i). Äá»ƒ trá»‘ng náº¿u muá»‘n táº¡o cáº£ ngÃ y.',
            },
            overwrite: {
              type: 'BOOLEAN' as any,
              description:
                'Äáº·t lÃ  true náº¿u ngÆ°á»i dÃ¹ng yÃªu cáº§u lÃ m má»›i hoáº·c táº¡o láº¡i thá»±c Ä‘Æ¡n cá»§a ngÃ y hÃ´m nay/ngÃ y cá»¥ thá»ƒ (ghi Ä‘Ã¨ mÃ³n cÅ© khÃ´ng bá»‹ khÃ³a). Máº·c Ä‘á»‹nh false chá»‰ gá»£i Ã½ mÃ³n cÃ²n thiáº¿u.',
            },
          },
          required: ['mealDates'],
        },
      },
      {
        name: 'get_recipe_ratings',
        description:
          'Láº¥y danh sÃ¡ch cÃ¡c Ä‘Ã¡nh giÃ¡, bÃ¬nh luáº­n vÃ  Ä‘iá»ƒm sá»‘ trung bÃ¬nh cá»§a mÃ³n Äƒn cá»¥ thá»ƒ.',
        parameters: {
          type: 'OBJECT' as any,
          properties: {
            recipeId: {
              type: 'STRING' as any,
              description: 'ID duy nháº¥t cá»§a cÃ´ng thá»©c mÃ³n Äƒn (náº¿u cÃ³)',
            },
            recipeName: {
              type: 'STRING' as any,
              description:
                'TÃªn mÃ³n Äƒn (vÃ­ dá»¥: Phá»Ÿ bÃ², Canh chua) Ä‘á»ƒ tÃ¬m kiáº¿m náº¿u chÆ°a cÃ³ ID',
            },
          },
        },
      },
      {
        name: 'calculate_calories',
        description:
          'TÃ­nh toÃ¡n chá»‰ sá»‘ nÄƒng lÆ°á»£ng hÃ ng ngÃ y (TDEE) vÃ  phÃ¢n bá»• calo lÃ½ tÆ°á»Ÿng cho cÃ¡c bá»¯a Äƒn dá»±a trÃªn cÃ¢n náº·ng, chiá»u cao, giá»›i tÃ­nh, tuá»•i tÃ¡c vÃ  má»©c Ä‘á»™ váº­n Ä‘á»™ng.',
        parameters: { type: 'OBJECT' as any, properties: {} },
      },
      {
        name: 'navigate_to',
        description:
          'Äiá»u hÆ°á»›ng ngÆ°á»i dÃ¹ng Ä‘áº¿n má»™t trang cá»¥ thá»ƒ trÃªn á»©ng dá»¥ng MealAI (nhÆ° Tá»§ láº¡nh, Láº­p thá»±c Ä‘Æ¡n, Danh sÃ¡ch mua sáº¯m, CÃ´ng thá»©c, Dinh dÆ°á»¡ng, Trang cÃ¡ nhÃ¢n).',
        parameters: {
          type: 'OBJECT' as any,
          properties: {
            page: {
              type: 'STRING' as any,
              description:
                'TÃªn trang cáº§n Ä‘áº¿n: "inventory" (Tá»§ láº¡nh/Kho nguyÃªn liá»‡u), "meal-planner" (Láº­p thá»±c Ä‘Æ¡n), "shopping-list" (Danh sÃ¡ch mua sáº¯m), "recipes" (CÃ´ng thá»©c náº¥u Äƒn), "profile" (Trang cÃ¡ nhÃ¢n / cáº¥u hÃ¬nh sá»©c khá»e), "nutrition" (Dinh dÆ°á»¡ng / calories), "home" (Trang chá»§)',
            },
          },
          required: ['page'],
        },
      },
      {
        name: 'update_user_preferences',
        description:
          'Cáº­p nháº­t há»“ sÆ¡ sá»©c khá»e vÃ  cháº¿ Ä‘á»™ Äƒn uá»‘ng cá»§a ngÆ°á»i dÃ¹ng dá»±a trÃªn yÃªu cáº§u cá»§a há» (vÃ­ dá»¥: chuyá»ƒn sang giáº£m cÃ¢n, tÄƒng cÆ¡, tiá»ƒu Ä‘Æ°á»ng, cao huyáº¿t Ã¡p, Äƒn chay).',
        parameters: {
          type: 'OBJECT' as any,
          properties: {
            healthConditions: {
              type: 'STRING' as any,
              description:
                'CÃ¡c bá»‡nh lÃ½ phÃ¢n tÃ¡ch bá»Ÿi dáº¥u pháº©y: "diabetes" (tiá»ƒu Ä‘Æ°á»ng), "hypertension" (cao huyáº¿t Ã¡p), "weight_loss" (giáº£m cÃ¢n), "muscle_gain" (tÄƒng cÆ¡), hoáº·c "none" Ä‘á»ƒ xÃ³a bá».',
            },
            dietType: {
              type: 'STRING' as any,
              description:
                'Cháº¿ Ä‘á»™ Äƒn kiÃªng: "vegetarian" (Äƒn chay), "keto" (keto), "lowcarb" (lowcarb), hoáº·c "none" Ä‘á»ƒ xÃ³a bá».',
            },
            maxSugarPerMeal: {
              type: 'NUMBER' as any,
              description: 'LÆ°á»£ng Ä‘Æ°á»ng tá»‘i Ä‘a má»—i bá»¯a Äƒn (g)',
            },
            maxSodiumPerMeal: {
              type: 'NUMBER' as any,
              description: 'LÆ°á»£ng natri/muá»‘i tá»‘i Ä‘a má»—i bá»¯a Äƒn (mg)',
            },
            minProteinPerMeal: {
              type: 'NUMBER' as any,
              description: 'LÆ°á»£ng protein/Ä‘áº¡m tá»‘i thiá»ƒu má»—i bá»¯a Äƒn (g)',
            },
          },
        },
      },
    ];
  }

  async getHistory(userId: string): Promise<ChatMessage[]> {
    return await this.chatMessageRepo.find({
      where: { userId },
      order: { createdAt: 'ASC' },
      take: 50, // Limit to recent 50 messages to keep chat light
    });
  }

  async clearHistory(userId: string): Promise<void> {
    await this.chatMessageRepo.delete({ userId });
  }

  async logUserAction(userId: string, data: any): Promise<UserActionLog> {
    const log = this.actionLogRepo.create({
      userId,
      actionType: data.actionType,
      recipeId: data.recipeId,
      mealType: data.mealType,
      metaData: {
        reason: data.reason,
        cookingTime: data.cookingTime,
        calories: data.calories,
      },
    });
    return await this.actionLogRepo.save(log);
  }

  async sendMessage(
    userId: string,
    content: string,
    profileCompletion?: ProfileCompletionResult,
  ): Promise<{
    text: string;
    actionTaken?: any;
    profileCompletionStatus?: ProfileCompletionStatus;
    profileAction?: { label: string; route: string };
  }> {
    // 1. Save user message to database
    const userMsg = this.chatMessageRepo.create({
      userId,
      role: 'user',
      content,
    });
    await this.chatMessageRepo.save(userMsg);

    // Fetch user context (name, allergies, dietType, servings)
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['preferences'],
    });
    const profileStatus = profileCompletion || getProfileCompletion(user);
    const profileAction =
      profileStatus.status !== 'complete' ? getProfileUpdateAction() : undefined;
    const fullName = user?.fullName || 'NgÆ°á»i dÃ¹ng';
    const allergies = user?.preferences?.allergies || [];
    const dietType = user?.preferences?.dietType || 'BÃ¬nh thÆ°á»ng';
    const savedServings = Number(user?.preferences?.servings);
    const servings = Number.isInteger(savedServings) && savedServings >= 1 && savedServings <= 20
      ? savedServings
      : null;
    const servingsLabel = servings ? `${servings} ngÆ°á»i` : 'chÆ°a cáº­p nháº­t';
    const servingsRule = servings
      ? `   - Khi gá»£i Ã½ mÃ³n Äƒn, cung cáº¥p cÃ´ng thá»©c hoáº·c liá»‡t kÃª nguyÃªn liá»‡u chi tiáº¿t, báº¡n PHáº¢I dá»±a vÃ o thÃ´ng tin "Kháº©u pháº§n Äƒn (Sá»‘ ngÆ°á»i Äƒn)" cá»§a ngÆ°á»i dÃ¹ng (${servings} ngÆ°á»i) Ä‘á»ƒ tÃ­nh toÃ¡n, nhÃ¢n/chia vÃ  hiá»ƒn thá»‹ Ä‘á»‹nh lÆ°á»£ng nguyÃªn liá»‡u chÃ­nh xÃ¡c, Ä‘á»§ cho sá»‘ lÆ°á»£ng ngÆ°á»i Ä‘Ã³.`
      : '   - Há»“ sÆ¡ ngÆ°á»i dÃ¹ng chÆ°a cÃ³ sá»‘ ngÆ°á»i Äƒn. Náº¿u ngÆ°á»i dÃ¹ng yÃªu cáº§u gá»£i Ã½ kháº©u pháº§n, láº­p thá»±c Ä‘Æ¡n hoáº·c tÃ­nh nguyÃªn liá»‡u, hÃ£y yÃªu cáº§u há» cáº­p nháº­t sá»‘ ngÆ°á»i Äƒn trong há»“ sÆ¡ trÆ°á»›c.';
    const servingsNote = servings
      ? `   - HÃ£y ghi chÃº rÃµ trong cÃ¢u tráº£ lá»i: "Äá»‹nh lÆ°á»£ng nguyÃªn liá»‡u dÆ°á»›i Ä‘Ã¢y Ä‘Ã£ Ä‘Æ°á»£c tá»± Ä‘á»™ng quy Ä‘á»•i cho ${servings} ngÆ°á»i theo há»“ sÆ¡ cá»§a báº¡n."`
      : '   - KhÃ´ng tá»± giáº£ Ä‘á»‹nh kháº©u pháº§n máº·c Ä‘á»‹nh 4 ngÆ°á»i khi há»“ sÆ¡ chÆ°a cÃ³ sá»‘ ngÆ°á»i Äƒn.';
    const todayValue = this.formatDateInput(new Date());
    const currentWeekStart = this.getMondayString(new Date());
    const profilePromptBlock = `
TRANG THAI HO SO CA NHAN:
- Muc do hoan thien: ${profileStatus.status}
- Thong tin con thieu: ${profileStatus.missingFields.length > 0 ? profileStatus.missingFields.join(', ') : 'khong co'}
- Huong dan bat buoc: ${profileStatus.promptInstruction}

QUY TAC CA NHAN HOA CALO:
- Chi duoc noi "dua tren muc tieu calo cua ban", "theo ho so dinh duong cua ban", "theo nhu cau calo ca nhan" hoac cac cau tuong tu khi muc do hoan thien la complete.
- Neu muc do hoan thien la partial, chi duoc noi day la goi y tham khao va khong khang dinh chinh xac ve TDEE/BMR/macro.
- Neu muc do hoan thien la incomplete, khong duoc tinh hay khang dinh calo ca nhan hoa; hay goi y mon pho thong, de nau, tuong doi can bang va nhac nguoi dung cap nhat ho so.
`;

    // Load current week's meal plan to inject as context
    let mealPlanContext = 'Hiá»‡n táº¡i chÆ°a cÃ³ thá»±c Ä‘Æ¡n nÃ o cho tuáº§n nÃ y.';
    try {
      const currentPlan = await this.actionHandler.mealPlanService.findByWeek(
        userId,
        currentWeekStart,
      );
      if (currentPlan && currentPlan.items && currentPlan.items.length > 0) {
        const activeItems = currentPlan.items.filter(
          (item: any) => item.recipe,
        );
        if (activeItems.length > 0) {
          mealPlanContext = activeItems
            .map(
              (item: any) =>
                `- ${item.dayLabel} (Bá»¯a ${item.mealType === 'breakfast' ? 'SÃ¡ng' : item.mealType === 'lunch' ? 'TrÆ°a' : 'Tá»‘i'}): ${item.recipe.name} [ID: ${item.recipe.id}]`,
            )
            .join('\n');
        }
      }
    } catch (e: any) {
      this.logger.error(
        `Failed to load meal plan context for chatbot: ${e.message}`,
      );
    }

    // If Gemini key is missing, respond with mock rule-based fallback
    if (!this.genAI) {
      return this.handleFallback(userId, content);
    }

    try {
      // 2. Fetch history for context
      const history = await this.getHistory(userId);
      const contents = history.map((h) => ({
        role: h.role,
        parts: [{ text: h.content }],
      }));

      // 3. Initialize model with tools and personalized instructions
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: { temperature: 0.2 },
        systemInstruction: `Báº¡n lÃ  MealAI Assistant - Trá»£ lÃ½ áº©m thá»±c vÃ  dinh dÆ°á»¡ng thÃ´ng minh dÃ nh cho ngÆ°á»i Viá»‡t Nam.
Nhiá»‡m vá»¥ cá»§a báº¡n lÃ  tÆ° váº¥n áº©m thá»±c, gá»£i Ã½ mÃ³n Äƒn, lÃªn thá»±c Ä‘Æ¡n tuáº§n, kiá»ƒm tra tá»§ láº¡nh, tÃ­nh toÃ¡n calo vÃ  danh sÃ¡ch mua sáº¯m.

THÃ”NG TIN NGÆ¯á»œI DÃ™NG HIá»†N Táº I:
- TÃªn: ${fullName}
- Dá»‹ á»©ng thá»±c pháº©m: ${allergies.length > 0 ? allergies.join(', ') : 'KhÃ´ng cÃ³'}
- Cháº¿ Ä‘á»™ Äƒn: ${dietType}
- Kháº©u pháº§n Äƒn (Sá»‘ ngÆ°á»i Äƒn): ${servingsLabel}
- HÃ´m nay: ${todayValue}
- Tuáº§n hiá»‡n táº¡i báº¯t Ä‘áº§u vÃ o: ${currentWeekStart}

${profilePromptBlock}

THá»°C ÄÆ N HIá»†N Táº I TUáº¦N NÃ€Y Cá»¦A NGÆ¯á»œI DÃ™NG:
${mealPlanContext}

QUY Táº®C Ráº¤T QUAN TRá»ŒNG:
1. Báº¡n CÃ“ THá»‚ THAO TÃC trá»±c tiáº¿p vá»›i dá»¯ liá»‡u cá»§a ngÆ°á»i dÃ¹ng thÃ´ng qua cÃ¡c cÃ´ng cá»¥ (tools) Ä‘Æ°á»£c cung cáº¥p. HÃ£y gá»i tool thÃ­ch há»£p ngay khi ngÆ°á»i dÃ¹ng yÃªu cáº§u hÃ nh Ä‘á»™ng.
2. LuÃ´n pháº£n há»“i báº±ng tiáº¿ng Viá»‡t thÃ¢n thiá»‡n, lá»‹ch sá»±, chuyÃªn nghiá»‡p.
3. Tuyá»‡t Ä‘á»‘i chá»‰ gá»£i Ã½ hoáº·c cung cáº¥p cÃ¡c mÃ³n Äƒn thá»±c táº¿ cÃ³ trÃªn há»‡ thá»‘ng báº±ng cÃ¡ch tÃ¬m kiáº¿m qua cÃ´ng cá»¥ search_recipes hoáº·c gá»£i Ã½ qua get_recommendations. KhÃ´ng tá»± bá»‹a ra cÃ´ng thá»©c hay mÃ³n Äƒn láº¡ khÃ´ng cÃ³ trong cÆ¡ sá»Ÿ dá»¯ liá»‡u.
4. Náº¿u thá»±c hiá»‡n hÃ nh Ä‘á»™ng thÃ nh cÃ´ng (nhÆ° thÃªm nguyÃªn liá»‡u, táº¡o thá»±c Ä‘Æ¡n, v.v.), hÃ£y bÃ¡o cÃ¡o rÃµ rÃ ng káº¿t quáº£ cho ngÆ°á»i dÃ¹ng.
5. KhÃ´ng Ä‘Æ°á»£c táº¡o, thÃªm, hoáº·c cáº­p nháº­t thá»±c Ä‘Æ¡n cho ngÃ y Ä‘Ã£ qua. Náº¿u ngÆ°á»i dÃ¹ng nÃ³i "hÃ´m nay", "ngÃ y mai", "ngÃ y kia", hoáº·c chá»‰ Ä‘á»‹nh má»™t ngÃ y cá»¥ thá»ƒ (vÃ­ dá»¥: "Ä‘á»•i ngÃ y 8/6/2026"), hÃ£y tÃ­nh ngÃ y tháº­t chÃ­nh xÃ¡c Ä‘á»‹nh dáº¡ng YYYY-MM-DD dá»±a trÃªn thÃ´ng tin HÃ´m nay á»Ÿ trÃªn vÃ  truyá»n vÃ o Ä‘á»‘i sá»‘ \`mealDate\` hoáº·c \`mealDates\`. TUYá»†T Äá»I khÃ´ng tá»± Ã½ dá»‹ch chuyá»ƒn sang ngÃ y káº¿ tiáº¿p, ngÃ y trÆ°á»›c Ä‘Ã³ hoáº·c tuáº§n khÃ¡c. Máº·c Ä‘á»‹nh báº¡n KHÃ”NG ÄÆ¯á»¢C PHÃ‰P thay tháº¿, ghi Ä‘Ã¨, hoáº·c xÃ³a cÃ¡c mÃ³n Äƒn Ä‘Ã£ cÃ³ trong thá»±c Ä‘Æ¡n (luÃ´n truyá»n \`overwrite: false\` hoáº·c khÃ´ng truyá»n). Chá»‰ truyá»n \`overwrite: true\` khi ngÆ°á»i dÃ¹ng chá»‰ Ä‘á»‹nh rÃµ rÃ ng yÃªu cáº§u thay Ä‘á»•i, Ä‘á»•i mÃ³n, hoáº·c thay tháº¿ mÃ³n Äƒn (vÃ­ dá»¥: "Äá»•i mÃ³n bá»¯a trÆ°a", "Thay tháº¿ mÃ³n Äƒn ngÃ y mai").
6. QUY Táº®C AN TOÃ€N Dá»Š á»¨NG (Cá»°C Ká»² QUAN TRá»ŒNG):
   - Tuyá»‡t Ä‘á»‘i khÃ´ng Ä‘Æ°á»£c gá»£i Ã½ hay thiáº¿t káº¿ thá»±c Ä‘Æ¡n chá»©a cÃ¡c nguyÃªn liá»‡u mÃ  ngÆ°á»i dÃ¹ng bá»‹ dá»‹ á»©ng (${allergies.join(', ')}).
   - Náº¿u ngÆ°á»i dÃ¹ng há»i xin cÃ´ng thá»©c hoáº·c há»i xem cÃ³ Äƒn Ä‘Æ°á»£c mÃ³n Äƒn chá»©a cháº¥t dá»‹ á»©ng cá»§a há» hay khÃ´ng, báº¡n PHáº¦I cáº£nh bÃ¡o kháº©n cáº¥p báº±ng biá»ƒu tÆ°á»£ng âš ï¸ vÃ  giáº£i thÃ­ch chi tiáº¿t cháº¥t gÃ¢y dá»‹ á»©ng trong mÃ³n Ä‘Ã³ Ä‘á»ƒ báº£o vá»‡ an toÃ n cho há».
7. QUY Táº®C KHáº¨U PHáº¦N Ä‚N (Sá» NGÆ¯á»œI Ä‚N) & Sá» LÆ¯á»¢NG MÃ“N Ä‚N:
${servingsRule}
${servingsNote}
   - Khi thiáº¿t káº¿ mÃ¢m cÆ¡m cho bá»¯a trÆ°a (lunch) hoáº·c bá»¯a tá»‘i (dinner), hÃ£y cÃ¢n nháº¯c quy mÃ´ gia Ä‘Ã¬nh cá»§a há»:
     - Gia Ä‘Ã¬nh tá»« 1-2 ngÆ°á»i Äƒn: Chá»‰ gá»£i Ã½ 1 mÃ³n Äƒn Ä‘Æ¡n giáº£n/bá»¯a.
     - Gia Ä‘Ã¬nh tá»« 3-5 ngÆ°á»i Äƒn: Gá»£i Ã½ mÃ¢m cÆ¡m 2 mÃ³n gá»“m 1 mÃ³n chÃ­nh (thá»‹t/cÃ¡/tÃ´m/Ä‘áº­u...) + 1 mÃ³n canh hoáº·c rau xÃ o.
     - Gia Ä‘Ã¬nh tá»« 6 ngÆ°á»i Äƒn trá»Ÿ lÃªn: Gá»£i Ã½ mÃ¢m cÆ¡m Ä‘áº§y Ä‘á»§ 3 mÃ³n gá»“m 1 mÃ³n chÃ­nh + 1 mÃ³n xÃ o/rau + 1 mÃ³n canh.
8. QUY Táº®C Gá»ŒI CÃ”NG Cá»¤ THá»°C ÄÆ N:
   - Khi gá»i cÃ¡c tool \`add_to_meal_plan\`, \`remove_from_meal_plan\`, \`generate_meal_plan_for_days\`, hÃ£y luÃ´n truyá»n ngÃ y cá»¥ thá»ƒ dÆ°á»›i dáº¡ng chuá»—i \`YYYY-MM-DD\` vÃ o Ä‘á»‘i sá»‘ \`mealDate\` / \`mealDates\`.
   - Náº¿u ngÆ°á»i dÃ¹ng muá»‘n thÃªm mÃ³n Äƒn nhÆ°ng báº¡n chÆ°a biáº¿t ID cá»§a mÃ³n Ä‘Ã³ trong cÆ¡ sá»Ÿ dá»¯ liá»‡u, hÃ£y Ä‘iá»n tÃªn mÃ³n Äƒn vÃ o Ä‘á»‘i sá»‘ \`recipeName\` trong tool \`add_to_meal_plan\` (Ä‘á»ƒ trá»‘ng Ä‘á»‘i sá»‘ \`recipeId\`), há»‡ thá»‘ng sáº½ tá»± Ä‘á»™ng tÃ¬m kiáº¿m mÃ³n khá»›p nháº¥t Ä‘á»ƒ thÃªm.
   - Náº¿u ngÆ°á»i dÃ¹ng muá»‘n xÃ³a mÃ³n Äƒn cá»¥ thá»ƒ khá»i lá»‹ch Äƒn, hÃ£y gá»i tool \`remove_from_meal_plan\`.
   - TrÃ¡nh gá»£i Ã½ trÃ¹ng láº·p cÃ¡c mÃ³n Äƒn Ä‘Ã£ cÃ³ trong tuáº§n nÃ y. Khi gá»i tool \`get_recommendations\`, hÃ£y truyá»n máº£ng cÃ¡c ID mÃ³n Äƒn Ä‘Ã£ cÃ³ á»Ÿ trÃªn vÃ o Ä‘á»‘i sá»‘ \`excludeIds\`.
   - Khi pháº£n há»“i ngÆ°á»i dÃ¹ng vá» thá»±c Ä‘Æ¡n Ä‘Æ°á»£c Ä‘á» xuáº¥t hoáº·c cáº­p nháº­t, hÃ£y hiá»ƒn thá»‹ Ä‘á»‹nh dáº¡ng chÃ­nh xÃ¡c nhá»¯ng bá»¯a nÃ o Ä‘Ã£ Ä‘Æ°á»£c giá»¯ nguyÃªn vÃ  nhá»¯ng bá»¯a nÃ o Ä‘Ã£ Ä‘Æ°á»£c thÃªm má»›i theo Ä‘á»‹nh dáº¡ng sau:
     ÄÃ£ giá»¯ nguyÃªn:
     âœ“ Bá»¯a sÃ¡ng
     âœ“ Bá»¯a tá»‘i

     ÄÃ£ thÃªm:
     âœ“ Bá»¯a trÆ°a

     KhÃ´ng cÃ³ mÃ³n nÃ o bá»‹ thay tháº¿.
9. QUY Táº®C GIáº¢I THÃCH Gá»¢I Ã (EXPLAINABLE AI):
   - Khi gá»£i Ã½ mÃ³n Äƒn hoáº·c láº­p thá»±c Ä‘Æ¡n, báº¡n pháº£i giáº£i thÃ­ch rÃµ lÃ½ do dá»±a trÃªn: nguyÃªn liá»‡u sáºµn cÃ³, Ä‘á»“ sáº¯p háº¿t háº¡n trong tá»§ láº¡nh, calo phÃ¹ há»£p má»¥c tiÃªu, thá»i gian náº¥u, vÃ  sá»Ÿ thÃ­ch Äƒn uá»‘ng. TrÃ­ch xuáº¥t thÃ´ng tin nÃ y tá»« trÆ°á»ng \`reasons\` trong káº¿t quáº£ cá»§a tool vÃ  Ä‘á»‹nh dáº¡ng cÃ¢u tráº£ lá»i thÃ¢n thiá»‡n, dá»… hiá»ƒu.
10. QUY Táº®C XUáº¤T FILE PDF:
    - Khi ngÆ°á»i dÃ¹ng muá»‘n xuáº¥t/táº£i file PDF thá»±c Ä‘Æ¡n tuáº§n nÃ y, hÃ£y cung cáº¥p chÃ­nh xÃ¡c Ä‘Æ°á»ng dáº«n markdown dáº¡ng: \`[Táº£i xuá»‘ng file PDF Thá»±c Ä‘Æ¡n tuáº§n nÃ y cá»§a báº¡n táº¡i Ä‘Ã¢y](/api/v1/meal-plans/current/pdf)\`.
    - Khi ngÆ°á»i dÃ¹ng muá»‘n xuáº¥t/táº£i file PDF danh sÃ¡ch mua sáº¯m, báº¡n hÃ£y gá»i tool \`get_shopping_lists\` Ä‘á»ƒ láº¥y danh sÃ¡ch. Náº¿u cÃ³, hÃ£y tÃ¬m ID cá»§a danh sÃ¡ch mua sáº¯m gáº§n Ä‘Ã¢y nháº¥t vÃ  tráº£ vá» Ä‘Æ°á»ng dáº«n markdown dáº¡ng: \`[Táº£i xuá»‘ng file PDF Danh sÃ¡ch mua sáº¯m cá»§a báº¡n táº¡i Ä‘Ã¢y](/api/v1/shopping-lists/<ID_DANH_SACH_MUA_SAM>/pdf)\` (thay tháº¿ <ID_DANH_SACH_MUA_SAM> báº±ng ID thá»±c táº¿). Náº¿u chÆ°a cÃ³ danh sÃ¡ch nÃ o, hÃ£y gá»i tool \`generate_shopping_list\` Ä‘á»ƒ táº¡o trÆ°á»›c rá»“i tráº£ vá» link PDF cá»§a danh sÃ¡ch vá»«a táº¡o.
11. QUY Táº®C XEM ÄÃNH GIÃ/BÃŒNH LUáº¬N MÃ“N Ä‚N:
    - Khi ngÆ°á»i dÃ¹ng há»i xem Ä‘Ã¡nh giÃ¡, bÃ¬nh luáº­n hoáº·c sao cá»§a má»™t mÃ³n Äƒn cá»¥ thá»ƒ (vÃ­ dá»¥: "Cho tÃ´i xem Ä‘Ã¡nh giÃ¡ mÃ³n Phá»Ÿ bÃ²"), hÃ£y gá»i tool \`get_recipe_ratings\` vá»›i \`recipeName\` tÆ°Æ¡ng á»©ng.
    - Tá»« káº¿t quáº£ cá»§a cÃ´ng cá»¥ tráº£ vá», hÃ£y tá»•ng há»£p Ä‘iá»ƒm sá»‘ trung bÃ¬nh (sao), tá»•ng sá»‘ lÆ°á»£t Ä‘Ã¡nh giÃ¡, vÃ  liá»‡t kÃª tÃ³m táº¯t cÃ¡c nháº­n xÃ©t/bÃ¬nh luáº­n tiÃªu biá»ƒu cá»§a ngÆ°á»i dÃ¹ng khÃ¡c má»™t cÃ¡ch ngáº¯n gá»n, sinh Ä‘á»™ng.`,
      });

      // 4. Start chat session
      const chat = model.startChat({
        history: contents.slice(0, -1), // Exclude the newly saved message since we will send it in sendMessage
        tools: [{ functionDeclarations: this.getFunctions() }],
      });

      // 5. Send message (with 30s timeout to avoid hanging)
      const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
        return Promise.race([
          promise,
          new Promise<T>((_, reject) =>
            setTimeout(
              () => reject(new Error(`Gemini API timeout after ${ms / 1000}s`)),
              ms,
            ),
          ),
        ]);
      };

      const getFunctionCalls = (response: any) => {
        if (!response) return [];
        if (typeof response.functionCalls === 'function') {
          return response.functionCalls() || [];
        }
        return response.functionCalls || [];
      };

      const result = await withTimeout(chat.sendMessage(content), 30000);
      let responseText = result.response.text();
      let functionCalls = getFunctionCalls(result.response);
      let actionResult: any = null;

      // If Gemini returned empty text with no function calls, it likely failed silently
      // (e.g., invalid API key that doesn't throw). Fall back to rule-based handler.
      if (!responseText && (!functionCalls || functionCalls.length === 0)) {
        this.logger.warn(
          'Gemini tráº£ vá» káº¿t quáº£ rá»—ng (cÃ³ thá»ƒ do API key khÃ´ng há»£p lá»‡). Chuyá»ƒn sang fallback...',
        );
        return this.handleFallback(userId, content);
      }

      // Force fallback if the user is asking to change/modify/add/remove/create dates and Gemini didn't call any tools
      const lowerContent = content.toLowerCase();
      if (
        (functionCalls || []).length === 0 &&
        (lowerContent.includes('Ä‘á»•i ngÃ y') ||
          lowerContent.includes('Ä‘á»•i thá»±c Ä‘Æ¡n') ||
          lowerContent.includes('thay Ä‘á»•i thá»±c Ä‘Æ¡n') ||
          lowerContent.includes('láº­p thá»±c Ä‘Æ¡n') ||
          lowerContent.includes('táº¡o thá»±c Ä‘Æ¡n') ||
          lowerContent.includes('xÃ³a thá»±c Ä‘Æ¡n') ||
          lowerContent.includes('xÃ³a ngÃ y'))
      ) {
        this.logger.warn(
          'Gemini khÃ´ng gá»i tool cho yÃªu cáº§u thá»±c Ä‘Æ¡n. Tá»± Ä‘á»™ng chuyá»ƒn sang fallback.',
        );
        return this.handleFallback(userId, content);
      }

      // 6. Handle Multi-Step Function Calls (Autonomous Agent Loop)
      const maxSteps = 5;
      let stepCount = 0;
      const executedSteps = [];

      while (
        functionCalls &&
        functionCalls.length > 0 &&
        stepCount < maxSteps
      ) {
        stepCount++;
        const stepCalls = functionCalls;
        const stepResponses = [];

        for (const call of stepCalls) {
          this.logger.log(
            `[Agent Step ${stepCount}] Gemini decided to call function: ${call.name} with args: ${JSON.stringify(call.args)}`,
          );

          const args = { ...call.args };
          // context-threading: if mealPlanId is missing for generating a shopping list, look up previous generated plan
          if (call.name === 'generate_shopping_list' && !args.mealPlanId) {
            const prevPlanStep = executedSteps.find(
              (s) =>
                s.name === 'generate_meal_plan' ||
                s.name === 'generate_meal_plan_for_days',
            );
            if (prevPlanStep && prevPlanStep.result && prevPlanStep.result.id) {
              args.mealPlanId = prevPlanStep.result.id;
            }
          }

          // Execute action on real services
          actionResult = await this.actionHandler.handleAction(
            call.name,
            args,
            userId,
          );

          executedSteps.push({
            name: call.name,
            args,
            result: actionResult,
          });

          stepResponses.push({
            functionResponse: {
              name: call.name,
              response: { result: actionResult },
            },
          });
        }

        // Send function results back to Gemini to request next step or final response
        const nextResult = await withTimeout(
          chat.sendMessage(stepResponses),
          30000,
        );

        responseText = nextResult.response.text();
        functionCalls = getFunctionCalls(nextResult.response);
      }

      // If response text is empty (no final summary produced), build one from executed steps
      if (!responseText) {
        if (executedSteps.length > 0) {
          responseText =
            `âœ… ÄÃ£ thá»±c hiá»‡n hoÃ n táº¥t chuá»—i thao tÃ¡c tá»± Ä‘á»™ng:\n` +
            executedSteps
              .map(
                (s, idx) => `${idx + 1}. Cháº¡y lá»‡nh **${s.name}** thÃ nh cÃ´ng.`,
              )
              .join('\n');
        } else {
          responseText = `TÃ´i Ä‘Ã£ nháº­n yÃªu cáº§u nhÆ°ng chÆ°a thá»ƒ hoÃ n thÃ nh thao tÃ¡c tá»± Ä‘á»™ng lÃºc nÃ y.`;
        }
      }

      // 7. Save assistant message to database
      const assistantMsg = this.chatMessageRepo.create({
        userId,
        role: 'model',
        content: responseText,
        metadata: {
          ...(executedSteps.length > 0 ? { steps: executedSteps } : {}),
          profileCompletionStatus: profileStatus.status,
          profileAction,
        },
      });
      await this.chatMessageRepo.save(assistantMsg);

      return {
        text: responseText,
        actionTaken:
          executedSteps.length > 0
            ? executedSteps[executedSteps.length - 1]
            : undefined,
        profileCompletionStatus: profileStatus.status,
        profileAction,
      };
    } catch (err: any) {
      this.logger.error(
        `Error communicating with Gemini: ${err.message}`,
        err.stack,
      );
      this.logger.warn(
        'Gemini gáº·p lá»—i, chuyá»ƒn sang rule-based fallback Ä‘á»ƒ xá»­ lÃ½ yÃªu cáº§u ngÆ°á»i dÃ¹ng...',
      );

      // When Gemini fails at runtime (bad API key, network error, quota exceeded, etc.),
      // fall back to the rule-based handler so the user still gets meaningful actions performed.
      return this.handleFallback(userId, content);
    }
  }

  // Custom high-fidelity rule-based fallback if GEMINI_API_KEY is not defined
  private async handleFallback(
    userId: string,
    content: string,
    profileCompletion?: ProfileCompletionResult,
  ): Promise<{
    text: string;
    actionTaken?: any;
    profileCompletionStatus?: ProfileCompletionStatus;
    profileAction?: { label: string; route: string };
  }> {
    const text = content.toLowerCase();
    let responseText = '';
    let actionTaken: any = null;

    // Load user allergies to trigger proactive safety warnings
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['preferences'],
    });
    const profileStatus = profileCompletion || getProfileCompletion(user);
    const profileAction =
      profileStatus.status !== 'complete' ? getProfileUpdateAction() : undefined;
    const allergies = user?.preferences?.allergies || [];
    const dateSelections = this.parseDateSelections(text);
    const requestedMealType = this.parseMealTypeFromText(text);

    // â”€â”€ NEW: Lá»‡nh Ä‘iá»u hÆ°á»›ng giao diá»‡n (UI Navigation Commands)
    const isInventoryPage =
      text.includes('má»Ÿ tá»§ láº¡nh') ||
      text.includes('Ä‘i tá»›i tá»§ láº¡nh') ||
      text.includes('xem tá»§ láº¡nh') ||
      text.includes('vÃ o tá»§ láº¡nh') ||
      text.includes('kho nguyÃªn liá»‡u') ||
      text.trim() === 'tá»§ láº¡nh';
    const isMealPlannerPage =
      text.includes('má»Ÿ thá»±c Ä‘Æ¡n') ||
      text.includes('Ä‘i tá»›i thá»±c Ä‘Æ¡n') ||
      text.includes('lá»‹ch Äƒn') ||
      text.includes('káº¿ hoáº¡ch Äƒn') ||
      text.includes('trang thá»±c Ä‘Æ¡n') ||
      text.trim() === 'thá»±c Ä‘Æ¡n';
    const isShoppingListPage =
      text.includes('má»Ÿ danh sÃ¡ch mua sáº¯m') ||
      text.includes('má»Ÿ danh sÃ¡ch Ä‘i chá»£') ||
      text.includes('Ä‘i tá»›i danh sÃ¡ch mua sáº¯m') ||
      text.includes('trang mua sáº¯m') ||
      text.includes('trang Ä‘i chá»£');
    const isRecipesPage =
      text.includes('má»Ÿ trang cÃ´ng thá»©c') ||
      text.includes('Ä‘i tá»›i cÃ´ng thá»©c') ||
      text.includes('tÃ¬m mÃ³n Äƒn') ||
      text.includes('trang cÃ´ng thá»©c');
    const isProfilePage =
      text.includes('má»Ÿ trang cÃ¡ nhÃ¢n') ||
      text.includes('Ä‘i tá»›i trang cÃ¡ nhÃ¢n') ||
      text.includes('há»“ sÆ¡ cÃ¡ nhÃ¢n') ||
      text.includes('má»Ÿ há»“ sÆ¡') ||
      text.includes('trang cÃ¡ nhÃ¢n');
    const isNutritionPage =
      text.includes('má»Ÿ trang dinh dÆ°á»¡ng') ||
      text.includes('Ä‘i tá»›i trang dinh dÆ°á»¡ng') ||
      text.includes('xem dinh dÆ°á»¡ng') ||
      text.includes('biá»ƒu Ä‘á»“ dinh dÆ°á»¡ng') ||
      text.includes('trang dinh dÆ°á»¡ng');
    const isHomePage =
      text.includes('vá» trang chá»§') ||
      text.includes('Ä‘i tá»›i trang chá»§') ||
      text.trim() === 'trang chá»§';

    if (isInventoryPage) {
      actionTaken = { name: 'navigate_to', args: { page: 'inventory' } };
      responseText = 'Äang má»Ÿ tá»§ láº¡nh cá»§a báº¡n.';
    } else if (isMealPlannerPage) {
      actionTaken = { name: 'navigate_to', args: { page: 'meal-planner' } };
      responseText = 'Äang má»Ÿ trang láº­p thá»±c Ä‘Æ¡n vÃ  lá»‹ch Äƒn.';
    } else if (isShoppingListPage) {
      actionTaken = { name: 'navigate_to', args: { page: 'shopping-list' } };
      responseText = 'Äang má»Ÿ danh sÃ¡ch Ä‘i chá»£ cá»§a báº¡n.';
    } else if (isRecipesPage) {
      actionTaken = { name: 'navigate_to', args: { page: 'recipes' } };
      responseText = 'Äang má»Ÿ danh má»¥c cÃ´ng thá»©c náº¥u Äƒn.';
    } else if (isProfilePage) {
      actionTaken = { name: 'navigate_to', args: { page: 'profile' } };
      responseText = 'Äang má»Ÿ há»“ sÆ¡ sá»©c khá»e cÃ¡ nhÃ¢n.';
    } else if (isNutritionPage) {
      actionTaken = { name: 'navigate_to', args: { page: 'nutrition' } };
      responseText = 'Äang má»Ÿ trang thá»‘ng kÃª dinh dÆ°á»¡ng.';
    } else if (isHomePage) {
      actionTaken = { name: 'navigate_to', args: { page: 'home' } };
      responseText = 'Äang quay vá» trang chá»§ MealAI.';
    }

    if (actionTaken && actionTaken.name === 'navigate_to') {
      const assistantMsg = this.chatMessageRepo.create({
        userId,
        role: 'model',
        content: responseText,
      });
      await this.chatMessageRepo.save(assistantMsg);
      return { text: responseText, actionTaken };
    }

    // â”€â”€ NEW: Lá»‡nh cáº­p nháº­t cáº¥u hÃ¬nh sá»©c khá»e (Update Preferences Commands)
    const isDiabetesReq =
      text.includes('tiá»ƒu Ä‘Æ°á»ng') || text.includes('Ä‘Ã¡i thÃ¡o Ä‘Æ°á»ng');
    const isHypertensionReq =
      text.includes('cao huyáº¿t Ã¡p') || text.includes('tÄƒng huyáº¿t Ã¡p');
    const isWeightLossReq =
      text.includes('giáº£m cÃ¢n') || text.includes('giáº£m bÃ©o');
    const isMuscleGainReq =
      text.includes('tÄƒng cÆ¡') || text.includes('phÃ¡t triá»ƒn cÆ¡');
    const isVegetarianReq =
      text.includes('Äƒn chay') ||
      text.includes('thá»±c Ä‘Æ¡n chay') ||
      text.includes('mÃ³n chay');
    const isKetoReq = text.includes('Äƒn keto') || text.includes('cháº¿ Ä‘á»™ keto');
    const isLowcarbReq =
      text.includes('Äƒn lowcarb') ||
      text.includes('cháº¿ Ä‘á»™ lowcarb') ||
      text.includes('low carb');

    let updateArgs: any = null;
    let updateResponse = '';

    if (isDiabetesReq) {
      updateArgs = { healthConditions: 'diabetes' };
      updateResponse =
        'ÄÃ£ cáº­p nháº­t há»“ sÆ¡ sá»©c khá»e: Æ¯u tiÃªn cháº¿ Ä‘á»™ Äƒn cho ngÆ°á»i tiá»ƒu Ä‘Æ°á»ng (kiá»ƒm soÃ¡t Ä‘Æ°á»ng huyáº¿t).';
    } else if (isHypertensionReq) {
      updateArgs = { healthConditions: 'hypertension' };
      updateResponse =
        'ÄÃ£ cáº­p nháº­t há»“ sÆ¡ sá»©c khá»e: Æ¯u tiÃªn cháº¿ Ä‘á»™ Äƒn giáº£m muá»‘i/natri cho ngÆ°á»i cao huyáº¿t Ã¡p.';
    } else if (isWeightLossReq) {
      updateArgs = { healthConditions: 'weight_loss', dietType: 'weight_loss' };
      updateResponse =
        'ÄÃ£ chuyá»ƒn cháº¿ Ä‘á»™ Äƒn cá»§a báº¡n sang: Giáº£m cÃ¢n (kiá»ƒm soÃ¡t cháº·t cháº½ calo bá»¯a Äƒn).';
    } else if (isMuscleGainReq) {
      updateArgs = { healthConditions: 'muscle_gain' };
      updateResponse =
        'ÄÃ£ chuyá»ƒn cháº¿ Ä‘á»™ Äƒn cá»§a báº¡n sang: TÄƒng cÆ¡ (Æ°u tiÃªn hÃ m lÆ°á»£ng protein cao).';
    } else if (isVegetarianReq) {
      updateArgs = { dietType: 'vegetarian' };
      updateResponse = 'ÄÃ£ cáº­p nháº­t cháº¿ Ä‘á»™ Äƒn uá»‘ng cá»§a báº¡n sang: Ä‚n chay.';
    } else if (isKetoReq) {
      updateArgs = { dietType: 'keto' };
      updateResponse = 'ÄÃ£ cáº­p nháº­t cháº¿ Ä‘á»™ Äƒn uá»‘ng cá»§a báº¡n sang: Keto.';
    } else if (isLowcarbReq) {
      updateArgs = { dietType: 'lowcarb' };
      updateResponse = 'ÄÃ£ cáº­p nháº­t cháº¿ Ä‘á»™ Äƒn uá»‘ng cá»§a báº¡n sang: Lowcarb.';
    }

    if (updateArgs) {
      actionTaken = { name: 'update_user_preferences', args: updateArgs };
      const res = await this.actionHandler.handleAction(
        'update_user_preferences',
        updateArgs,
        userId,
      );
      actionTaken.result = res;
      responseText = updateResponse;

      const assistantMsg = this.chatMessageRepo.create({
        userId,
        role: 'model',
        content: responseText,
      });
      await this.chatMessageRepo.save(assistantMsg);
      return { text: responseText, actionTaken };
    }

    // Check if the user mentioned any of their allergens
    const matchedAllergen = allergies.find((allergy) => {
      const trimmed = allergy.toLowerCase().trim();
      return trimmed && text.includes(trimmed);
    });

    if (matchedAllergen) {
      responseText =
        `âš ï¸ **Cáº¢NH BÃO NGUY HIá»‚M (Dá»Š á»¨NG THá»°C PHáº¨M):**\n\n` +
        `ChÃ o báº¡n, há»‡ thá»‘ng ghi nháº­n há»“ sÆ¡ sá»©c khá»e cá»§a báº¡n dá»‹ á»©ng vá»›i **"${matchedAllergen.toUpperCase()}"**.\n` +
        `CÃ¢u há»i hoáº·c mÃ³n Äƒn báº¡n vá»«a nháº¯c tá»›i cÃ³ thá»ƒ chá»©a thÃ nh pháº§n gÃ¢y nguy hiá»ƒm cho sá»©c khá»e cá»§a báº¡n! ` +
        `Äá»ƒ Ä‘áº£m báº£o an toÃ n tuyá»‡t Ä‘á»‘i, vui lÃ²ng trÃ¡nh xa mÃ³n nÃ y vÃ  Æ°u tiÃªn cÃ¡c nguyÃªn liá»‡u lÃ nh tÃ­nh khÃ¡c nhÃ©!`;

      const assistantMsg = this.chatMessageRepo.create({
        userId,
        role: 'model',
        content: responseText,
      });
      await this.chatMessageRepo.save(assistantMsg);
      return { text: responseText };
    }

    // â”€â”€ NEW: "cáº£ 3 bá»¯a luÃ´n" / "cÃ  3 bá»¯a" / "3 bá»¯a hÃ´m nay"
    const isChangePlanRequest =
      text.includes('Ä‘á»•i thá»±c Ä‘Æ¡n') ||
      text.includes('thay Ä‘á»•i thá»±c Ä‘Æ¡n') ||
      text.includes('táº¡o thá»±c Ä‘Æ¡n má»›i') ||
      text.includes('lÃªn thá»±c Ä‘Æ¡n má»›i') ||
      text.includes('lÃ m má»›i thá»±c Ä‘Æ¡n');

    const isAllMealsToday =
      text.includes('cáº£ 3 bá»¯a') ||
      text.includes('cÃ  3 bá»¯a') ||
      (text.includes('3 bá»¯a') &&
        (text.includes('luÃ´n') ||
          text.includes('hÃ´m nay') ||
          text.includes('hm nay'))) ||
      text.includes('táº¥t cáº£ bá»¯a') ||
      text.includes('háº¿t bá»¯a') ||
      (text.includes('Ä‘á»§ bá»¯a') && text.includes('hÃ´m'));

    // â”€â”€ "thÃªm vÃ i mÃ³n ná»¯a" / "thÃªm vÃ´" / "thÃªm vÃ o" (without a specific dish name)
    const isAddMultipleVague =
      text.includes('thÃªm vÃ i') ||
      text.includes('thÃªm nhiá»u') ||
      text.includes('thÃªm thÃªm') ||
      text.includes('thÃªm ná»¯a') ||
      text.includes('mÃ³n ná»¯a') ||
      // "thÃªm vÃ´" = Southern Vietnamese dialect for "thÃªm vÃ o"
      (text.includes('thÃªm') &&
        text.includes('vÃ´') &&
        !text.includes('thá»±c Ä‘Æ¡n')) ||
      // "thÃªm vÃ o" without specifying a dish
      (text.includes('thÃªm') &&
        (text.includes('vÃ o') || text.includes('vÃ´')) &&
        !text.includes('thá»±c Ä‘Æ¡n') &&
        this.cleanRecipeQuery(text) === '');

    // â”€â”€ "sÃ¡ng" / "trÆ°a" / "tá»‘i" as a standalone reply â†’ add recommendation for that meal today
    const isSingleMealTime =
      text === 'sÃ¡ng' ||
      text === 'trÆ°a' ||
      text === 'tá»‘i' ||
      text === 'bá»¯a sÃ¡ng' ||
      text === 'bá»¯a trÆ°a' ||
      text === 'bá»¯a tá»‘i' ||
      text === 'buá»•i sÃ¡ng' ||
      text === 'buá»•i trÆ°a' ||
      text === 'buá»•i tá»‘i';

    // â”€â”€ NEW: "healthy" / "lÃ nh máº¡nh" / "Ã­t calo"
    const isHealthyRequest =
      text.includes('healthy') ||
      text.includes('lÃ nh máº¡nh') ||
      text.includes('Ã­t calo') ||
      text.includes('Ã­t bÃ©o') ||
      text.includes('eat clean') ||
      text.includes('Äƒn sáº¡ch') ||
      text.includes('giáº£m cÃ¢n') ||
      text.includes('diet');

    if (isSingleMealTime) {
      // User replied with just a meal time â†’ add AI recommendation for that meal today
      const today = this.dateOnly(new Date());
      const weekStart = this.getMondayString(today);
      const dayOfWeek = this.getMealPlanDay(today);
      const mealType = this.parseMealTypeFromText(text);
      const mealLabel =
        mealType === 'breakfast'
          ? 'SÃ¡ng'
          : mealType === 'lunch'
            ? 'TrÆ°a'
            : 'Tá»‘i';

      const recRes = await this.actionHandler.handleAction(
        'get_recommendations',
        { mealType, limit: 1, useAntiWaste: true },
        userId,
      );
      const recipe = recRes.recommendations?.[0]?.recipe;
      if (!recipe?.id) {
        responseText = `KhÃ´ng tÃ¬m Ä‘Æ°á»£c mÃ³n phÃ¹ há»£p cho bá»¯a ${mealLabel} hÃ´m nay. HÃ£y thá»­ "gá»£i Ã½ ${mealLabel.toLowerCase()} nay" nhÃ©!`;
      } else {
        actionTaken = {
          name: 'add_to_meal_plan',
          args: { recipeId: recipe.id, dayOfWeek, mealType, weekStart },
        };
        const addRes = await this.actionHandler.handleAction(
          'add_to_meal_plan',
          actionTaken.args,
          userId,
        );
        actionTaken.result = addRes;
        if (addRes.error) {
          responseText = `KhÃ´ng thá»ƒ thÃªm mÃ³n: ${addRes.error}`;
        } else {
          responseText = `âœ… ÄÃ£ thÃªm **${recipe.name}** vÃ o Bá»¯a **${mealLabel}** hÃ´m nay!\n(${recipe.calories} kcal, náº¥u trong ${recipe.cookingTime} phÃºt)`;
        }
      }
    } else if (isAllMealsToday) {
      // Generate all 3 meals for today
      const today = this.dateOnly(new Date());
      const weekStart = this.getMondayString(today);
      const dayOfWeek = this.getMealPlanDay(today);
      actionTaken = {
        name: 'generate_meal_plan_for_days',
        args: { weekStart, days: [dayOfWeek], useAntiWaste: true },
      };
      const res = await this.actionHandler.handleAction(
        'generate_meal_plan_for_days',
        { weekStart, days: [dayOfWeek], useAntiWaste: true },
        userId,
      );
      actionTaken.result = res;
      if (res.error) {
        responseText = `âš ï¸ KhÃ´ng thá»ƒ táº¡o thá»±c Ä‘Æ¡n: ${res.error}`;
      } else {
        const todayItems = (res.items || []).filter(
          (i: any) => i.dayOfWeek === dayOfWeek,
        );
        responseText =
          `ðŸŽ‰ **ÄÃ£ lÃªn thá»±c Ä‘Æ¡n cáº£ 3 bá»¯a hÃ´m nay!**\n\n` +
          (todayItems.length > 0
            ? todayItems
                .map(
                  (i: any) =>
                    `- **Bá»¯a ${i.mealType === 'breakfast' ? 'SÃ¡ng' : i.mealType === 'lunch' ? 'TrÆ°a' : 'Tá»‘i'}**: ${i.recipe ? i.recipe.name : 'ChÆ°a cÃ³ mÃ³n'}`,
                )
                .join('\n')
            : '- Thá»±c Ä‘Æ¡n Ä‘Ã£ Ä‘Æ°á»£c cáº­p nháº­t!') +
          `\n\nBáº¡n cÃ³ thá»ƒ xem chi tiáº¿t á»Ÿ trang Lá»‹ch Ä‚n nhÃ©! ðŸ“…`;
      }
    } else if (isAddMultipleVague) {
      // Auto-fill empty meal slots for today using AI recommendations
      const today = this.dateOnly(new Date());
      const weekStart = this.getMondayString(today);
      const dayOfWeek = this.getMealPlanDay(today);
      const existingPlan = await this.actionHandler.mealPlanService.findByWeek(
        userId,
        weekStart,
      );
      const filledSlots =
        existingPlan?.items
          ?.filter((i: any) => i.dayOfWeek === dayOfWeek && i.recipe)
          .map((i: any) => i.mealType) || [];
      const emptyMeals = ['breakfast', 'lunch', 'dinner'].filter(
        (m) => !filledSlots.includes(m),
      );

      if (emptyMeals.length === 0) {
        responseText = `âœ… HÃ´m nay báº¡n Ä‘Ã£ cÃ³ Ä‘á»§ 3 bá»¯a rá»“i! ðŸŽ‰ Báº¡n cÃ³ muá»‘n xem thá»±c Ä‘Æ¡n khÃ´ng?`;
      } else {
        const addedMeals: string[] = [];
        for (const mealType of emptyMeals) {
          const recRes = await this.actionHandler.handleAction(
            'get_recommendations',
            { mealType, limit: 1, useAntiWaste: true },
            userId,
          );
          const recipe = recRes.recommendations?.[0]?.recipe;
          if (recipe?.id) {
            await this.actionHandler.handleAction(
              'add_to_meal_plan',
              { recipeId: recipe.id, dayOfWeek, mealType, weekStart },
              userId,
            );
            addedMeals.push(
              `Bá»¯a ${mealType === 'breakfast' ? 'SÃ¡ng' : mealType === 'lunch' ? 'TrÆ°a' : 'Tá»‘i'}: **${recipe.name}**`,
            );
          }
        }
        actionTaken = {
          name: 'generate_meal_plan_for_days',
          args: { weekStart, days: [dayOfWeek] },
          result: existingPlan,
        };
        if (addedMeals.length > 0) {
          responseText =
            `âœ… **ÄÃ£ thÃªm cÃ¡c mÃ³n cho hÃ´m nay:**\n\n` +
            addedMeals.map((m) => `- ${m}`).join('\n') +
            `\n\nThá»±c Ä‘Æ¡n Ä‘Ã£ Ä‘Æ°á»£c cáº­p nháº­t! Báº¡n cÃ³ thá»ƒ xem á»Ÿ trang Lá»‹ch Ä‚n.`;
        } else {
          responseText = `KhÃ´ng tÃ¬m Ä‘Æ°á»£c mÃ³n phÃ¹ há»£p Ä‘á»ƒ thÃªm. HÃ£y thá»­ lá»‡nh **"gá»£i Ã½ mÃ³n Äƒn"** Ä‘á»ƒ xem cÃ¡c lá»±a chá»n nhÃ©!`;
        }
      }
    } else if (isHealthyRequest) {
      // Healthy/low-cal recommendations
      const healthArgs = { maxCalories: 400, limit: 5 };
      actionTaken = { name: 'search_recipes', args: healthArgs };
      const res = await this.actionHandler.handleAction(
        'search_recipes',
        healthArgs,
        userId,
      );
      actionTaken.result = res;
      if (!res.data || res.data.length === 0) {
        responseText = `ðŸ¥— Hiá»‡n chÆ°a tÃ¬m Ä‘Æ°á»£c mÃ³n Äƒn lÃ nh máº¡nh (dÆ°á»›i 400 kcal) phÃ¹ há»£p. HÃ£y thÃªm nhiá»u cÃ´ng thá»©c healthy vÃ o há»‡ thá»‘ng nhÃ©!`;
      } else {
        responseText =
          `ðŸ¥— **Gá»£i Ã½ mÃ³n Äƒn lÃ nh máº¡nh (dÆ°á»›i 400 kcal):**\n\n` +
          res.data
            .slice(0, 5)
            .map(
              (r: any) =>
                `- **${r.name}** \u2013 ${r.calories} kcal | ${r.cookingTime} phÃºt`,
            )
            .join('\n') +
          `\n\nBáº¡n muá»‘n thÃªm mÃ³n nÃ o vÃ o thá»±c Ä‘Æ¡n khÃ´ng?`;
      }
    } else if (
      text === 'cÃ³' ||
      text === 'Ä‘á»“ng Ã½' ||
      text === 'ok' ||
      text === 'Ä‘Ãºng' ||
      text === 'dung' ||
      text === 'báº¡n Ä‘Ãºng' ||
      text === 'ban dung' ||
      isChangePlanRequest ||
      ((text.includes('lÃªn thá»±c Ä‘Æ¡n') || text.includes('táº¡o thá»±c Ä‘Æ¡n')) &&
        dateSelections.length === 0)
    ) {
      let isDayContext = false;
      let targetDays: number[] = [];
      const today = new Date();
      const currentDayOfWeek = today.getDay() === 0 ? 7 : today.getDay();

      if (
        text === 'ok' ||
        text === 'Ä‘á»“ng Ã½' ||
        text === 'cÃ³' ||
        text === 'Ä‘Ãºng' ||
        text === 'dung' ||
        text === 'báº¡n Ä‘Ãºng' ||
        text === 'ban dung'
      ) {
        const lastModelMsg = await this.chatMessageRepo.findOne({
          where: { userId, role: 'model' },
          order: { createdAt: 'DESC' },
        });
        if (lastModelMsg) {
          const lastContent = lastModelMsg.content.toLowerCase();

          // Parse date and weekStart
          let confirmDayOfWeek = currentDayOfWeek;
          let confirmWeekStart = this.getMondayString(new Date());
          let parsedDay = false;

          const dateMatch = /(\d{2})[-/](\d{2})[-/](\d{4})/.exec(lastContent);
          if (dateMatch) {
            const day = Number(dateMatch[1]);
            const month = Number(dateMatch[2]) - 1;
            const year = Number(dateMatch[3]);
            const parsedDate = new Date(year, month, day);
            if (!isNaN(parsedDate.getTime())) {
              confirmDayOfWeek =
                parsedDate.getDay() === 0 ? 7 : parsedDate.getDay();
              confirmWeekStart = this.getMondayString(parsedDate);
              parsedDay = true;
            }
          }

          if (!parsedDay) {
            if (lastContent.includes('ngÃ y mai')) {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              confirmDayOfWeek =
                tomorrow.getDay() === 0 ? 7 : tomorrow.getDay();
              confirmWeekStart = this.getMondayString(tomorrow);
              parsedDay = true;
            } else if (
              lastContent.includes('hÃ´m nay') ||
              lastContent.includes('ngÃ y hÃ´m nay')
            ) {
              confirmDayOfWeek = currentDayOfWeek;
              confirmWeekStart = this.getMondayString(new Date());
              parsedDay = true;
            } else {
              const dayMap: Record<string, number> = {
                'thá»© hai': 1,
                'thá»© 2': 1,
                'thá»© ba': 2,
                'thá»© 3': 2,
                'thá»© tÆ°': 3,
                'thá»© 4': 3,
                'thá»© nÄƒm': 4,
                'thá»© 5': 4,
                'thá»© sÃ¡u': 5,
                'thá»© 6': 5,
                'thá»© báº£y': 6,
                'thá»© 7': 6,
                'chá»§ nháº­t': 7,
                cn: 7,
              };
              for (const [key, val] of Object.entries(dayMap)) {
                if (lastContent.includes(key)) {
                  confirmDayOfWeek = val;
                  confirmWeekStart = this.getMondayString(new Date());
                  parsedDay = true;
                }
              }
            }
          }

          const isDeleteConfirmation =
            lastContent.includes('muá»‘n xÃ³a') ||
            (lastContent.includes('xÃ³a') &&
              (lastContent.includes('pháº£i khÃ´ng') ||
                lastContent.includes('khÃ´ng?')));

          if (isDeleteConfirmation && parsedDay) {
            // Parse meal type from the last message context
            let confirmMealType = 'lunch';
            if (
              lastContent.includes('sÃ¡ng') ||
              lastContent.includes('breakfast')
            )
              confirmMealType = 'breakfast';
            else if (
              lastContent.includes('tá»‘i') ||
              lastContent.includes('dinner')
            )
              confirmMealType = 'dinner';
            else if (
              lastContent.includes('phá»¥') ||
              lastContent.includes('snack')
            )
              confirmMealType = 'snack';

            let recipeId = undefined;
            if (
              lastModelMsg.metadata &&
              lastModelMsg.metadata.args &&
              lastModelMsg.metadata.args.recipeId
            ) {
              recipeId = lastModelMsg.metadata.args.recipeId;
            }

            actionTaken = {
              name: 'remove_from_meal_plan',
              args: {
                weekStart: confirmWeekStart,
                dayOfWeek: confirmDayOfWeek,
                mealType: confirmMealType,
                recipeId: recipeId,
              },
            };
            const res = await this.actionHandler.handleAction(
              'remove_from_meal_plan',
              actionTaken.args,
              userId,
            );
            actionTaken.result = res;
            if (res.error) {
              responseText = `âš ï¸ KhÃ´ng thá»ƒ xÃ³a mÃ³n Äƒn: ${res.error}`;
            } else {
              responseText = `âœ… **ThÃ nh cÃ´ng!** ${res.message || 'ÄÃ£ xÃ³a mÃ³n Äƒn khá»i thá»±c Ä‘Æ¡n.'}`;
            }

            const assistantMsg = this.chatMessageRepo.create({
              userId,
              role: 'model',
              content: responseText,
              metadata: actionTaken
                ? {
                    action: actionTaken.name,
                    result: actionTaken.result,
                    args: actionTaken.args,
                  }
                : null,
            });
            await this.chatMessageRepo.save(assistantMsg);
            return { text: responseText, actionTaken };
          }

          if (
            lastContent.includes('hÃ´m nay') ||
            lastContent.includes('ngÃ y hÃ´m nay')
          ) {
            isDayContext = true;
            targetDays = [currentDayOfWeek];
          } else {
            const dayMap: Record<string, number> = {
              'thá»© hai': 1,
              'thá»© 2': 1,
              'thá»© ba': 2,
              'thá»© 3': 2,
              'thá»© tÆ°': 3,
              'thá»© 4': 3,
              'thá»© nÄƒm': 4,
              'thá»© 5': 4,
              'thá»© sÃ¡u': 5,
              'thá»© 6': 5,
              'thá»© báº£y': 6,
              'thá»© 7': 6,
              'chá»§ nháº­t': 7,
              cn: 7,
            };
            for (const [key, val] of Object.entries(dayMap)) {
              if (lastContent.includes(key)) {
                isDayContext = true;
                targetDays.push(val);
              }
            }
          }
        }
      }

      if (isDayContext && targetDays.length > 0) {
        const todayDate = this.dateOnly(new Date());
        const weekStart = this.getMondayString(todayDate);
        actionTaken = {
          name: 'generate_meal_plan_for_days',
          args: { weekStart, days: targetDays, useAntiWaste: true },
        };
        const res = await this.actionHandler.handleAction(
          'generate_meal_plan_for_days',
          { weekStart, days: targetDays, useAntiWaste: true },
          userId,
        );
        actionTaken.result = res;
        if (res.error) {
          responseText = `âš ï¸ KhÃ´ng thá»ƒ táº¡o thá»±c Ä‘Æ¡n: ${res.error}`;
        } else {
          const dayLabelsMap = [
            '',
            'Thá»© Hai',
            'Thá»© Ba',
            'Thá»© TÆ°',
            'Thá»© NÄƒm',
            'Thá»© SÃ¡u',
            'Thá»© Báº£y',
            'Chá»§ Nháº­t',
          ];
          const todayItems = (res.items || []).filter((i: any) =>
            targetDays.includes(i.dayOfWeek),
          );
          const dayLabels = targetDays.map((d) => dayLabelsMap[d]).join(', ');
          responseText =
            `ðŸŽ‰ **ÄÃ£ lÃªn thá»±c Ä‘Æ¡n cho ${dayLabels} thÃ nh cÃ´ng!**\n\n` +
            (todayItems.length > 0
              ? todayItems
                  .map(
                    (i: any) =>
                      `- **${i.dayLabel} - Bá»¯a ${i.mealType === 'breakfast' ? 'SÃ¡ng' : i.mealType === 'lunch' ? 'TrÆ°a' : 'Tá»‘i'}**: ${i.recipe ? i.recipe.name : 'ChÆ°a cÃ³ mÃ³n'}`,
                  )
                  .join('\n')
              : '- Thá»±c Ä‘Æ¡n Ä‘Ã£ Ä‘Æ°á»£c cáº­p nháº­t!') +
            `\n\nBáº¡n cÃ³ thá»ƒ xem lá»‹ch Äƒn chi tiáº¿t á»Ÿ trang Lá»‹ch Ä‚n nhÃ©! ðŸ“…`;
        }
      } else {
        actionTaken = {
          name: 'generate_meal_plan',
          args: { useAntiWaste: true },
        };
        const res = await this.actionHandler.handleAction(
          'generate_meal_plan',
          { useAntiWaste: true },
          userId,
        );
        actionTaken.result = res;
        if (res.error) {
          responseText = `KhÃ´ng thá»ƒ táº¡o thá»±c Ä‘Æ¡n tá»± Ä‘á»™ng: ${res.error}`;
        } else {
          responseText =
            `ðŸŽ‰ Tuyá»‡t vá»i! TÃ´i Ä‘Ã£ tá»± Ä‘á»™ng thiáº¿t káº¿ má»™t thá»±c Ä‘Æ¡n tuáº§n dinh dÆ°á»¡ng, cÃ¢n Ä‘á»‘i calo vÃ  tá»‘i Æ°u hÃ³a nguyÃªn liá»‡u trong tá»§ láº¡nh cá»§a báº¡n thÃ nh cÃ´ng!\n\n` +
            `**Chi tiáº¿t thá»±c Ä‘Æ¡n:**\n` +
            res.items
              .slice(0, 7)
              .map(
                (i: any) =>
                  `- **${i.dayLabel}** (${i.mealType === 'breakfast' ? 'SÃ¡ng' : i.mealType === 'lunch' ? 'TrÆ°a' : 'Tá»‘i'}): ${i.recipe ? i.recipe.name : 'ChÆ°a lÃªn mÃ³n'}`,
              )
              .join('\n') +
            `\n\nTá»•ng lÆ°á»£ng calo tiÃªu thá»¥ cáº£ tuáº§n khoáº£ng **${res.totalCalories} kcal** (Trung bÃ¬nh **${res.dailyAvgCalories} kcal/ngÃ y**). Báº¡n cÃ³ thá»ƒ xem lá»‹ch Äƒn chi tiáº¿t á»Ÿ tháº» bÃªn dÆ°á»›i hoáº·c trang Thá»±c Ä‘Æ¡n nhÃ©!`;
        }
      }
    } else if (
      text.includes('gá»£i Ã½') ||
      text.includes('Äƒn gÃ¬') ||
      text.includes('náº¥u gÃ¬')
    ) {
      const currentWeekStart = this.getMondayString(new Date());
      const currentPlan = await this.actionHandler.mealPlanService.findByWeek(
        userId,
        currentWeekStart,
      );
      const excludeIds =
        currentPlan?.items
          ?.filter((i: any) => i.recipe)
          .map((i: any) => i.recipe.id) || [];

      actionTaken = {
        name: 'get_recommendations',
        args: {
          mealType: requestedMealType,
          limit: 3,
          useAntiWaste: true,
          excludeIds,
        },
      };
      const res = await this.actionHandler.handleAction(
        'get_recommendations',
        actionTaken.args,
        userId,
      );
      actionTaken.result = res;
      responseText =
        `Dá»±a trÃªn sá»Ÿ thÃ­ch cá»§a báº¡n, Ä‘Ã¢y lÃ  3 mÃ³n Äƒn gá»£i Ã½ tá»« MealAI:\n` +
        res.recommendations
          .map(
            (r: any) =>
              `- **${r.recipe.name}** (${r.recipe.calories} kcal, náº¥u trong ${r.recipe.cookingTime} phÃºt)`,
          )
          .join('\n') +
        `\n\nBáº¡n cÃ³ muá»‘n tÃ´i giÃºp lÃªn thá»±c Ä‘Æ¡n cáº£ tuáº§n khÃ´ng?`;
    } else if (
      text.includes('tá»§ láº¡nh') ||
      text.includes('nguyÃªn liá»‡u') ||
      text.includes('inventory')
    ) {
      actionTaken = { name: 'get_inventory', args: {} };
      const res = await this.actionHandler.handleAction(
        'get_inventory',
        {},
        userId,
      );
      actionTaken.result = res;
      if (res.data?.length === 0) {
        responseText = `Tá»§ láº¡nh cá»§a báº¡n hiá»‡n táº¡i Ä‘ang trá»‘ng rá»—ng! HÃ£y thÃªm nguyÃªn liá»‡u má»›i hoáº·c táº¡o danh sÃ¡ch mua sáº¯m nhÃ©.`;
      } else {
        responseText =
          `Trong tá»§ láº¡nh cá»§a báº¡n Ä‘ang cÃ³:\n` +
          res.data
            .slice(0, 5)
            .map(
              (i: any) =>
                `- **${i.ingredient.name}**: ${i.quantity} ${i.unit} (Háº¡n dÃ¹ng: ${i.expirationDate ? new Date(i.expirationDate).toLocaleDateString('vi-VN') : 'KhÃ´ng háº¡n'})`,
            )
            .join('\n') +
          (res.data.length > 5
            ? `\n... vÃ  ${res.data.length - 5} nguyÃªn liá»‡u khÃ¡c.`
            : '') +
          `\n\nChá»‰ sá»‘ tá»§ láº¡nh: ${res.summary.critical} nguyÃªn liá»‡u cá»±c ká»³ kháº©n cáº¥p.`;
      }
    } else if (
      text.includes('mua sáº¯m') ||
      text.includes('Ä‘i chá»£') ||
      text.includes('mua Ä‘á»“')
    ) {
      const currentWeekStart = this.actionHandler.getMondayString(new Date());
      const shoppingWeekStart =
        dateSelections[0]?.weekStart || currentWeekStart;
      const plan = await this.actionHandler.mealPlanService.findByWeek(
        userId,
        shoppingWeekStart,
      );
      if (!plan) {
        responseText = `âš ï¸ Báº¡n chÆ°a cÃ³ thá»±c Ä‘Æ¡n cho tuáº§n cáº§n mua sáº¯m nÃªn tÃ´i chÆ°a thá»ƒ láº­p danh sÃ¡ch. HÃ£y gÃµ **"táº¡o thá»±c Ä‘Æ¡n hÃ´m nay"** hoáº·c chá»n ngÃ y tÆ°Æ¡ng lai trÆ°á»›c nhÃ©!`;
      } else {
        const parsedDays = dateSelections
          .filter((selection) => selection.weekStart === shoppingWeekStart)
          .map((selection) => selection.dayOfWeek);

        actionTaken = {
          name: 'generate_shopping_list',
          args: {
            mealPlanId: plan.id,
            days: parsedDays.length > 0 ? parsedDays : undefined,
          },
        };
        const res = await this.actionHandler.handleAction(
          'generate_shopping_list',
          actionTaken.args,
          userId,
        );
        actionTaken.result = res;

        if (res.error) {
          responseText = `KhÃ´ng thá»ƒ láº­p danh sÃ¡ch mua sáº¯m: ${res.error}`;
        } else if (res.toBuy.length === 0) {
          responseText = `ðŸŽ‰ Tuyá»‡t vá»i! Táº¥t cáº£ nguyÃªn liá»‡u cáº§n thiáº¿t cho thá»±c Ä‘Æ¡n cá»§a cÃ¡c ngÃ y Ä‘Æ°á»£c chá»n Ä‘Ã£ cÃ³ Ä‘áº§y Ä‘á»§ trong tá»§ láº¡nh cá»§a báº¡n! Báº¡n khÃ´ng cáº§n mua thÃªm gÃ¬ cáº£.`;
        } else {
          responseText =
            `ðŸ›’ **ÄÃ£ tá»± Ä‘á»™ng láº­p danh sÃ¡ch mua sáº¯m thÃ nh cÃ´ng!**\n` +
            `**TÃªn danh sÃ¡ch:** ${res.name}\n` +
            `**Sá»‘ lÆ°á»£ng máº·t hÃ ng cáº§n mua:** ${res.totalItems} mÃ³n\n` +
            (res.estimatedTotal && res.estimatedTotal > 0
              ? `**Tá»•ng chi phÃ­ dá»± kiáº¿n:** ${res.estimatedTotal.toLocaleString('vi-VN')} Ä‘\n\n`
              : `\n`) +
            `**Chi tiáº¿t nguyÃªn liá»‡u cáº§n mua:**\n` +
            res.toBuy
              .map(
                (item: any) =>
                  `- **${item.name}**: ${item.quantity} ${item.unit} (${item.category})` +
                  (item.estimatedPrice && item.estimatedPrice > 0
                    ? ` - Dá»± tÃ­nh: ${item.estimatedPrice.toLocaleString('vi-VN')}Ä‘`
                    : ''),
              )
              .join('\n') +
            `\n\n*Há»‡ thá»‘ng Ä‘Ã£ tá»± Ä‘á»™ng Ä‘á»‘i chiáº¿u vá»›i tá»§ láº¡nh vÃ  lÆ°á»£c bá» ${res.alreadyHave.length} nguyÃªn liá»‡u báº¡n Ä‘Ã£ cÃ³ sáºµn!*`;
        }
      }
    } else if (
      text.includes('thÃªm mÃ³n') ||
      text.includes('thÃªm vÃ o thá»±c Ä‘Æ¡n') ||
      (text.includes('thÃªm') && text.includes('thá»±c Ä‘Æ¡n')) ||
      text.includes('lÃªn mÃ³n') ||
      text.includes('chá»n mÃ³n')
    ) {
      const target = dateSelections[0] || {
        date: new Date(),
        weekStart: this.actionHandler.getMondayString(new Date()),
        dayOfWeek: this.getMealPlanDay(new Date()),
        label: 'hÃ´m nay',
      };
      const day = target.dayOfWeek;
      const mealType = requestedMealType;
      const query = this.cleanRecipeQuery(text);

      if (!query) {
        responseText = `Báº¡n muá»‘n tÃ´i thÃªm mÃ³n Äƒn gÃ¬ vÃ o thá»±c Ä‘Æ¡n? HÃ£y gÃµ vÃ­ dá»¥: **"ThÃªm mÃ³n phá»Ÿ bÃ² vÃ o bá»¯a sÃ¡ng ngÃ y mai"** nhÃ©!`;
      } else {
        const searchRes = await this.actionHandler.handleAction(
          'search_recipes',
          { search: query, limit: 1 },
          userId,
        );
        if (!searchRes.data || searchRes.data.length === 0) {
          responseText = `TÃ´i khÃ´ng tÃ¬m tháº¥y mÃ³n Äƒn nÃ o khá»›p vá»›i tÃªn **"${query}"** trong há»‡ thá»‘ng. HÃ£y thá»­ tÃ¬m tá»« khÃ¡c xem sao nhÃ©!`;
        } else {
          const recipe = searchRes.data[0];
          const shouldOverwrite = text.includes('Ä‘á»•i') || text.includes('thay');
          actionTaken = {
            name: 'add_to_meal_plan',
            args: {
              recipeId: recipe.id,
              dayOfWeek: day,
              mealType,
              weekStart: target.weekStart,
              overwrite: shouldOverwrite,
            },
          };
          const res = await this.actionHandler.handleAction(
            'add_to_meal_plan',
            actionTaken.args,
            userId,
          );
          actionTaken.result = res;
          if (res.skipped) {
            responseText = `âš ï¸ **KhÃ´ng thá»ƒ ghi Ä‘Ã¨:** ${res.message}`;
          } else if (res.error) {
            responseText = `KhÃ´ng thá»ƒ thÃªm mÃ³n Äƒn: ${res.error}`;
          } else {
            const mealLabel =
              mealType === 'breakfast'
                ? 'SÃ¡ng'
                : mealType === 'lunch'
                  ? 'TrÆ°a'
                  : mealType === 'dinner'
                    ? 'Tá»‘i'
                    : 'Phá»¥';
            responseText = `ðŸŽ‰ **ThÃ nh cÃ´ng!** TÃ´i Ä‘Ã£ tá»± Ä‘á»™ng lÃªn mÃ³n **"${recipe.name}"** vÃ o **Bá»¯a ${mealLabel} - ${target.label}** trong thá»±c Ä‘Æ¡n cá»§a báº¡n.`;
          }
        }
      }
    } else if (
      text.includes('xÃ³a') ||
      text.includes('há»§y') ||
      text.includes('bá»') ||
      text.includes('delete') ||
      text.includes('remove')
    ) {
      const isDeletePlanKeyword =
        text.includes('tuáº§n') ||
        text.includes('cáº£ tuáº§n') ||
        text.includes('háº¿t thá»±c Ä‘Æ¡n') ||
        text.includes('táº¥t cáº£ thá»±c Ä‘Æ¡n') ||
        text.includes('meal plan') ||
        text.includes('toÃ n bá»™ thá»±c Ä‘Æ¡n');

      if (
        isDeletePlanKeyword &&
        dateSelections.length === 0 &&
        !text.includes('sÃ¡ng') &&
        !text.includes('trÆ°a') &&
        !text.includes('tá»‘i')
      ) {
        const currentWeekStart = this.actionHandler.getMondayString(new Date());
        actionTaken = {
          name: 'delete_meal_plan',
          args: { weekStart: currentWeekStart },
        };
        const res = await this.actionHandler.handleAction(
          'delete_meal_plan',
          actionTaken.args,
          userId,
        );
        actionTaken.result = res;
        responseText = res.message || 'ÄÃ£ xÃ³a thá»±c Ä‘Æ¡n tuáº§n thÃ nh cÃ´ng!';
      } else {
        const target = dateSelections[0] || {
          date: new Date(),
          weekStart: this.actionHandler.getMondayString(new Date()),
          dayOfWeek: this.getMealPlanDay(new Date()),
          label: 'hÃ´m nay',
        };
        const mealType = requestedMealType;
        const mealLabel =
          mealType === 'breakfast'
            ? 'sÃ¡ng'
            : mealType === 'lunch'
              ? 'trÆ°a'
              : mealType === 'dinner'
                ? 'tá»‘i'
                : 'phá»¥';
        const dayLabelsMap = [
          '',
          'Thá»© Hai',
          'Thá»© Ba',
          'Thá»© TÆ°',
          'Thá»© NÄƒm',
          'Thá»© SÃ¡u',
          'Thá»© Báº£y',
          'Chá»§ Nháº­t',
        ];
        const dayLabel = dayLabelsMap[target.dayOfWeek];
        const dateStr = target.date.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

        // Check if user specified a recipe to delete
        let recipeQuery = text;
        const deleteWords = [
          /xÃ³a/gi,
          /há»§y/gi,
          /bá»/gi,
          /delete/gi,
          /remove/gi,
          /Ä‘i/gi,
          /mÃ³n/gi,
          /bá»¯a/gi,
          /buá»•i/gi,
          /sÃ¡ng/gi,
          /trÆ°a/gi,
          /tá»‘i/gi,
          /phá»¥/gi,
          /hÃ´m nay/gi,
          /ngÃ y mai/gi,
          /ngÃ y kia/gi,
          /má»‘t/gi,
        ];
        for (const word of deleteWords) {
          recipeQuery = recipeQuery.replace(word, '');
        }
        recipeQuery = recipeQuery.trim();

        if (recipeQuery.length > 2) {
          const plan = await this.actionHandler.mealPlanService.findByWeek(
            userId,
            target.weekStart,
          );
          const matchedItem = plan?.items?.find(
            (item: any) =>
              item.recipe &&
              item.recipe.name
                .toLowerCase()
                .includes(recipeQuery.toLowerCase()),
          );

          if (matchedItem) {
            const itemMealLabel =
              matchedItem.mealType === 'breakfast'
                ? 'sÃ¡ng'
                : matchedItem.mealType === 'lunch'
                  ? 'trÆ°a'
                  : matchedItem.mealType === 'dinner'
                    ? 'tá»‘i'
                    : 'phá»¥';
            const itemDayLabel = dayLabelsMap[matchedItem.dayOfWeek];
            const itemDate = this.parseDateInput(target.weekStart);
            itemDate.setDate(itemDate.getDate() + matchedItem.dayOfWeek - 1);
            const itemDateStr = itemDate.toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });

            responseText = `Báº¡n muá»‘n tÃ´i xÃ³a mÃ³n **${matchedItem.recipe.name}** trong bá»¯a ${itemMealLabel} ${itemDayLabel} (${itemDateStr}) pháº£i khÃ´ng?`;
            actionTaken = {
              name: 'remove_from_meal_plan',
              args: {
                weekStart: target.weekStart,
                dayOfWeek: matchedItem.dayOfWeek,
                mealType: matchedItem.mealType,
                recipeId: matchedItem.recipe.id,
              },
            };
          } else {
            responseText = `TÃ´i khÃ´ng tÃ¬m tháº¥y mÃ³n Äƒn nÃ o cÃ³ tÃªn giá»‘ng **"${recipeQuery}"** trong thá»±c Ä‘Æ¡n tuáº§n nÃ y Ä‘á»ƒ xÃ³a.`;
          }
        } else {
          responseText = `Báº¡n muá»‘n tÃ´i xÃ³a toÃ n bá»™ cÃ¡c mÃ³n Äƒn trong bá»¯a ${mealLabel} ${target.label} (${dayLabel}, ${dateStr}) pháº£i khÃ´ng?`;
          actionTaken = {
            name: 'remove_from_meal_plan',
            args: {
              weekStart: target.weekStart,
              dayOfWeek: target.dayOfWeek,
              mealType: mealType,
            },
          };
        }
      }
    } else if (
      (text.includes('thá»±c Ä‘Æ¡n') ||
        text.includes('meal plan') ||
        text.includes('lÃªn thá»±c Ä‘Æ¡n') ||
        text.includes('táº¡o thá»±c Ä‘Æ¡n') ||
        text.includes('Ä‘á»•i ngÃ y') ||
        text.includes('Ä‘á»•i thá»±c Ä‘Æ¡n') ||
        text.includes('thay Ä‘á»•i')) &&
      dateSelections.length > 0
    ) {
      const groupedSelections = dateSelections.reduce((groups, selection) => {
        const current = groups.get(selection.weekStart) || [];
        current.push(selection);
        groups.set(selection.weekStart, current);
        return groups;
      }, new Map<string, typeof dateSelections>());

      const hasBreakfast = text.includes('sÃ¡ng') || text.includes('breakfast');
      const hasLunch = text.includes('trÆ°a') || text.includes('lunch');
      const hasDinner = text.includes('tá»‘i') || text.includes('dinner');
      const hasSnack = text.includes('phá»¥') || text.includes('snack');

      const specificMealType =
        hasBreakfast && !hasLunch && !hasDinner && !hasSnack
          ? 'breakfast'
          : !hasBreakfast && hasLunch && !hasDinner && !hasSnack
            ? 'lunch'
            : !hasBreakfast && !hasLunch && hasDinner && !hasSnack
              ? 'dinner'
              : !hasBreakfast && !hasLunch && !hasDinner && hasSnack
                ? 'snack'
                : undefined;

      if (groupedSelections.size === 0) {
        responseText = `Báº¡n muá»‘n tÃ´i táº¡o thá»±c Ä‘Æ¡n cho ngÃ y nÃ o cá»¥ thá»ƒ? HÃ£y gÃµ vÃ­ dá»¥: **"Táº¡o thá»±c Ä‘Æ¡n cho ngÃ y mai"** nhÃ©!`;
      } else {
        const results: any[] = [];
        const firstWeekStart =
          dateSelections[0]?.weekStart ||
          this.actionHandler.getMondayString(new Date());
        const beforePlan = await this.actionHandler.mealPlanService.findByWeek(
          userId,
          firstWeekStart,
        );
        const shouldOverwrite = text.includes('Ä‘á»•i') || text.includes('thay');

        for (const [weekStart, selections] of groupedSelections.entries()) {
          const mealDates = selections.map((selection) =>
            this.formatDateInput(selection.date),
          );
          const res = await this.actionHandler.handleAction(
            'generate_meal_plan_for_days',
            {
              weekStart,
              mealDates,
              useAntiWaste: true,
              mealType: specificMealType,
              userRequest: content,
              overwrite: shouldOverwrite,
            },
            userId,
          );
          results.push({
            weekStart,
            mealDates,
            labels: selections.map((selection) => selection.label),
            result: res,
          });
        }
        const firstResult = results[0];
        actionTaken = {
          name: 'generate_meal_plan_for_days',
          args: {
            weekStart: firstResult.weekStart,
            mealDates: firstResult.mealDates,
            useAntiWaste: true,
            mealType: specificMealType,
            userRequest: content,
            overwrite: shouldOverwrite,
          },
          result: firstResult.result,
        };

        const dayNames = results.flatMap((item) => item.labels).join(', ');
        if (results.some((item) => item.result?.error)) {
          responseText = `KhÃ´ng thá»ƒ táº¡o thá»±c Ä‘Æ¡n cho má»™t sá»‘ ngÃ y: ${results.find((item) => item.result?.error)?.result?.error}`;
        } else {
          const mealNamesMap: Record<string, string> = {
            breakfast: 'Bá»¯a sÃ¡ng',
            lunch: 'Bá»¯a trÆ°a',
            dinner: 'Bá»¯a tá»‘i',
            snack: 'Bá»¯a phá»¥',
          };
          const keptMeals = new Set<string>();
          const addedMeals = new Set<string>();

          const allMealDates = results.flatMap((item) => item.mealDates);
          const afterPlan = results[0]?.result;

          if (afterPlan && afterPlan.items) {
            for (const mDate of allMealDates) {
              const dateItemsBefore = (beforePlan?.items || []).filter(
                (item: any) => item.mealDate === mDate,
              );
              const dateItemsAfter = (afterPlan.items || []).filter(
                (item: any) => item.mealDate === mDate,
              );

              for (const mealType of ['breakfast', 'lunch', 'dinner']) {
                if (specificMealType && mealType !== specificMealType) continue;

                const beforeItem = dateItemsBefore.find(
                  (i: any) => i.mealType === mealType && i.recipe,
                );
                const afterItem = dateItemsAfter.find(
                  (i: any) => i.mealType === mealType && i.recipe,
                );

                if (
                  beforeItem &&
                  afterItem &&
                  beforeItem.recipe.id === afterItem.recipe.id
                ) {
                  keptMeals.add(`âœ“ ${mealNamesMap[mealType]}`);
                } else if (!beforeItem && afterItem) {
                  addedMeals.add(`âœ“ ${mealNamesMap[mealType]}`);
                }
              }
            }
          }

          responseText = `ðŸŽ‰ **ThÃ nh cÃ´ng!** TÃ´i Ä‘Ã£ tá»± Ä‘á»™ng lÃªn thá»±c Ä‘Æ¡n cho cÃ¡c ngÃ y: ${dayNames}.\n\n`;
          if (keptMeals.size > 0) {
            responseText += `ÄÃ£ giá»¯ nguyÃªn:\n${Array.from(keptMeals)
              .map((m) => `- ${m}`)
              .join('\n')}\n\n`;
          }
          if (addedMeals.size > 0) {
            responseText += `ÄÃ£ thÃªm:\n${Array.from(addedMeals)
              .map((m) => `- ${m}`)
              .join('\n')}\n\n`;
          }
          responseText += `KhÃ´ng cÃ³ mÃ³n nÃ o bá»‹ thay tháº¿. Báº¡n cÃ³ thá»ƒ xem chi tiáº¿t á»Ÿ trang Lá»‹ch Ä‚n nhÃ©! ðŸ“…`;
        }
      }
    } else if (
      text.includes('calo') ||
      text.includes('tdee') ||
      text.includes('cÆ¡ thá»ƒ')
    ) {
      actionTaken = { name: 'calculate_calories', args: {} };
      const res = await this.actionHandler.handleAction(
        'calculate_calories',
        {},
        userId,
      );
      actionTaken.result = res;
      responseText = res.message || 'KhÃ´ng thá»ƒ tÃ­nh toÃ¡n calo';
    } else if (text.includes('thá»±c Ä‘Æ¡n') || text.includes('meal plan')) {
      actionTaken = { name: 'get_meal_plan', args: {} };
      const res = await this.actionHandler.handleAction(
        'get_meal_plan',
        {},
        userId,
      );
      actionTaken.result = res;
      if (res.message) {
        responseText = res.message;
      } else {
        responseText =
          `Thá»±c Ä‘Æ¡n tuáº§n nÃ y cá»§a báº¡n:\n` +
          res.items
            .slice(0, 6)
            .map(
              (i: any) =>
                `- **${i.dayLabel}** (${i.mealType === 'breakfast' ? 'SÃ¡ng' : i.mealType === 'lunch' ? 'TrÆ°a' : 'Tá»‘i'}): ${i.recipe ? i.recipe.name : 'ChÆ°a lÃªn mÃ³n'}`,
            )
            .join('\n') +
          `\n\nTá»•ng calo cáº£ tuáº§n: ${res.totalCalories} kcal.`;
      }
    } else {
      responseText =
        `ðŸ¤– **Xin chÃ o! TÃ´i lÃ  MealAI Assistant.** DÆ°á»›i Ä‘Ã¢y lÃ  cÃ¡c lá»‡nh tÃ´i hiá»ƒu:\n\n` +
        `ðŸ—“ï¸ **Thá»±c Ä‘Æ¡n:**\n` +
        `- "Táº¡o thá»±c Ä‘Æ¡n cho hÃ´m nay" â€” táº¡o thá»±c Ä‘Æ¡n má»™t ngÃ y\n` +
        `- "Táº¡o cáº£ 3 bá»¯a hÃ´m nay" â€” Ä‘áº·t Ä‘á»§ sÃ¡ng, trÆ°a, tá»‘i\n` +
        `- "Táº¡o thá»±c Ä‘Æ¡n cáº£ tuáº§n" â€” láº­p káº¿ hoáº¡ch tuáº§n\n` +
        `- "Xem thá»±c Ä‘Æ¡n" â€” hiá»ƒn thá»‹ lá»‹ch Äƒn hiá»‡n táº¡i\n\n` +
        `ðŸ² **MÃ³n Äƒn:**\n` +
        `- "Gá»£i Ã½ bá»¯a trÆ°a" / "Gá»£i Ã½ sÃ¡ng nay" â€” nháº­n gá»£i Ã½ mÃ³n Äƒn\n` +
        `- "ThÃªm vÃ i mÃ³n vÃ´" / "ThÃªm ná»¯a" â€” tá»± Ä‘á»™ng Ä‘iá»n cÃ¡c bá»¯a cÃ²n trá»‘ng\n` +
        `- "sÃ¡ng" / "trÆ°a" / "tá»‘i" â€” thÃªm mÃ³n AI gá»£i Ã½ vÃ o bá»¯a Ä‘Ã³ hÃ´m nay\n` +
        `- "MÃ³n Äƒn lÃ nh máº¡nh" / "Healthy" / "Ã­t calo" â€” gá»£i Ã½ < 400 kcal\n` +
        `- "ThÃªm mÃ³n [tÃªn mÃ³n] bá»¯a sÃ¡ng" â€” thÃªm mÃ³n cá»¥ thá»ƒ\n\n` +
        `ðŸ§€ **NguyÃªn liá»‡u & Mua sáº¯m:**\n` +
        `- "Tá»§ láº¡nh cÃ²n gÃ¬" â€” kiá»ƒm tra kho nguyÃªn liá»‡u\n` +
        `- "Láº­p danh sÃ¡ch Ä‘i chá»£" / "Mua sáº¯m" â€” táº¡o shopping list\n\n` +
        `âš–ï¸ **Sá»©c khá»e:**\n` +
        `- "TÃ­nh calo / TDEE" â€” tÃ­nh nhu cáº§u nÄƒng lÆ°á»£ng hÃ ng ngÃ y`;
    }

    const assistantMsg = this.chatMessageRepo.create({
      userId,
      role: 'model',
      content: responseText,
      metadata: actionTaken
        ? {
            action: actionTaken.name,
            result: actionTaken.result,
            args: actionTaken.args,
            profileCompletionStatus: profileStatus.status,
            profileAction,
          }
        : {
            profileCompletionStatus: profileStatus.status,
            profileAction,
          },
    });
    await this.chatMessageRepo.save(assistantMsg);

    return {
      text: responseText,
      actionTaken,
      profileCompletionStatus: profileStatus.status,
      profileAction,
    };
  }

  private parseMealTypeFromText(text: string): string {
    if (text.includes('sÃ¡ng') || text.includes('breakfast')) return 'breakfast';
    if (text.includes('tá»‘i') || text.includes('dinner')) return 'dinner';
    if (text.includes('phá»¥') || text.includes('snack')) return 'snack';
    return 'lunch';
  }

  private parseDateSelections(text: string): Array<{
    date: Date;
    weekStart: string;
    dayOfWeek: number;
    label: string;
  }> {
    const selections: Array<{
      date: Date;
      weekStart: string;
      dayOfWeek: number;
      label: string;
    }> = [];
    const addSelection = (date: Date, label: string) => {
      const value = this.formatDateInput(date);
      if (selections.some((item) => this.formatDateInput(item.date) === value))
        return;
      selections.push({
        date,
        weekStart: this.getMondayString(date),
        dayOfWeek: this.getMealPlanDay(date),
        label,
      });
    };

    // Parse concrete date like DD/MM/YYYY or DD-MM-YYYY
    const concreteDateMatch = /(\d{1,2})[-/](\d{1,2})[-/](\d{4})/.exec(text);
    if (concreteDateMatch) {
      const day = Number(concreteDateMatch[1]);
      const month = Number(concreteDateMatch[2]) - 1;
      const year = Number(concreteDateMatch[3]);
      const parsedDate = new Date(year, month, day);
      if (!isNaN(parsedDate.getTime())) {
        addSelection(
          parsedDate,
          `ngÃ y ${concreteDateMatch[1]}-${concreteDateMatch[2]}-${concreteDateMatch[3]}`,
        );
      }
    }

    const today = this.dateOnly(new Date());
    if (text.includes('hÃ´m nay') || /\bnay\b/.test(text)) {
      addSelection(today, 'hÃ´m nay');
    }
    if (text.includes('ngÃ y mai') || /\bmai\b/.test(text)) {
      const tomorrow = this.addDays(today, 1);
      addSelection(tomorrow, 'ngÃ y mai');
    }
    if (text.includes('ngÃ y kia') || text.includes('má»‘t')) {
      const nextTwoDays = this.addDays(today, 2);
      addSelection(nextTwoDays, 'ngÃ y kia');
    }

    const weekdays = [
      { day: 1, label: 'Thá»© Hai', patterns: ['thá»© hai', 'thá»© 2', 't2'] },
      { day: 2, label: 'Thá»© Ba', patterns: ['thá»© ba', 'thá»© 3', 't3'] },
      { day: 3, label: 'Thá»© TÆ°', patterns: ['thá»© tÆ°', 'thá»© 4', 't4'] },
      { day: 4, label: 'Thá»© NÄƒm', patterns: ['thá»© nÄƒm', 'thá»© 5', 't5'] },
      { day: 5, label: 'Thá»© SÃ¡u', patterns: ['thá»© sÃ¡u', 'thá»© 6', 't6'] },
      { day: 6, label: 'Thá»© Báº£y', patterns: ['thá»© báº£y', 'thá»© 7', 't7'] },
      { day: 7, label: 'Chá»§ Nháº­t', patterns: ['chá»§ nháº­t', 'cn'] },
    ];
    const forceNextWeek = text.includes('tuáº§n sau');
    const currentWeekStart = this.parseDateInput(this.getMondayString(today));

    for (const weekday of weekdays) {
      if (!weekday.patterns.some((pattern) => text.includes(pattern))) continue;

      let date = this.addDays(currentWeekStart, weekday.day - 1);
      if (date < today || forceNextWeek) {
        date = this.addDays(date, 7);
      }
      addSelection(
        date,
        forceNextWeek ? `${weekday.label} tuáº§n sau` : weekday.label,
      );
    }

    return selections.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private cleanRecipeQuery(text: string): string {
    return text
      .replace(/thÃªm mÃ³n/gi, '')
      .replace(/thÃªm vÃ o thá»±c Ä‘Æ¡n/gi, '')
      .replace(/lÃªn mÃ³n/gi, '')
      .replace(/chá»n mÃ³n/gi, '')
      .replace(/thÃªm/gi, '')
      .replace(/vÃ o/gi, '')
      .replace(/thá»±c Ä‘Æ¡n/gi, '')
      .replace(/bá»¯a/gi, '')
      .replace(/sÃ¡ng|trÆ°a|tá»‘i|phá»¥/gi, '')
      .replace(/hÃ´m nay|ngÃ y mai|ngÃ y kia|tuáº§n sau|mai|má»‘t/gi, '')
      .replace(/thá»©\s+\w+/gi, '')
      .replace(/thá»©\s+\d+/gi, '')
      .replace(/chá»§ nháº­t/gi, '')
      .replace(/\bt\d+\b/gi, '')
      .replace(/\bcn\b/gi, '')
      .replace(/cho/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private getMealPlanDay(date: Date): number {
    const day = date.getDay();
    return day === 0 ? 7 : day;
  }

  private getMondayString(d: Date): string {
    const target = this.dateOnly(d);
    const day = target.getDay();
    const diff = target.getDate() - day + (day === 0 ? -6 : 1);
    target.setDate(diff);
    return this.formatDateInput(target);
  }

  private addDays(date: Date, days: number): Date {
    const next = this.dateOnly(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  private parseDateInput(value: string): Date {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (!match) return this.dateOnly(new Date(value));
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }

  private dateOnly(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private formatDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
