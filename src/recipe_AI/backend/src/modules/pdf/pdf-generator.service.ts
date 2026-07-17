import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';

import * as path from 'path';

@Injectable()
export class PdfGeneratorService {
  private isSupportedFontFile(fontPath: string): boolean {
    try {
      const header = Buffer.alloc(4);
      const fd = fs.openSync(fontPath, 'r');
      fs.readSync(fd, header, 0, 4, 0);
      fs.closeSync(fd);

      const signature = header.toString('latin1');
      return (
        header.equals(Buffer.from([0x00, 0x01, 0x00, 0x00])) ||
        signature === 'OTTO' ||
        signature === 'ttcf'
      );
    } catch {
      return false;
    }
  }

  private getVietnameseFont(isBold = false): string | null {
    const filename = isBold ? 'Roboto-Bold.ttf' : 'Roboto-Regular.ttf';
    
    // 1. Try relative to process.cwd() (where assets/fonts is located)
    const cwdPath = path.join(process.cwd(), 'assets', 'fonts', filename);
    if (fs.existsSync(cwdPath)) {
      return cwdPath;
    }

    // 2. Try relative to __dirname (compiled JS file location)
    const relativePath = path.join(__dirname, '..', '..', '..', 'assets', 'fonts', filename);
    if (fs.existsSync(relativePath)) {
      return relativePath;
    }

    // 3. Fallback to system fonts
    const windir = process.env.WINDIR || 'C:\\Windows';
    const systemFontName = isBold ? 'arialbd.ttf' : 'arial.ttf';
    const pathsToTry = [
      path.join(windir, 'Fonts', systemFontName),
      `C:\\Windows\\Fonts\\${systemFontName}`,
    ];

    for (const p of pathsToTry) {
      if (fs.existsSync(p)) {
        return p;
      }
    }
    return null;
  }

  private setupFonts(doc: PDFKit.PDFDocument) {
    const fontPath = this.getVietnameseFont(false);
    const fontPathBold = this.getVietnameseFont(true);

    let hasRegular = false;
    let hasBold = false;

    if (fontPath && this.isSupportedFontFile(fontPath)) {
      try {
        doc.registerFont('CustomFont', fontPath);
        doc.font('CustomFont');
        hasRegular = true;
      } catch {
        hasRegular = false;
      }
    }

    if (fontPathBold && this.isSupportedFontFile(fontPathBold)) {
      try {
        doc.registerFont('CustomFontBold', fontPathBold);
        hasBold = true;
      } catch {
        hasBold = false;
      }
    }

    return (fontName: string) => {
      if (fontName === 'Bold' && hasBold) {
        doc.font('CustomFontBold');
      } else if (hasRegular) {
        doc.font('CustomFont');
      } else {
        doc.font(fontName === 'Bold' ? 'Helvetica-Bold' : 'Helvetica');
      }
    };
  }

  async generateMealPlanPdf(planData: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // Font registration for Vietnamese unicode support
      const useFont = this.setupFonts(doc);

      // Title & Header Style
      useFont('Bold');
      doc
        .fillColor('#10b981')
        .fontSize(26)
        .text('THỰC ĐƠN DINH DƯỠNG TUẦN', { align: 'center' });
      
      useFont('Regular');
      doc
        .fillColor('#6b7280')
        .fontSize(11)
        .text(
          `Thời gian: ${new Date(planData.weekStart).toLocaleDateString('vi-VN')} - ${new Date(planData.weekEnd).toLocaleDateString('vi-VN')}`,
          { align: 'center' },
        );
      doc.moveDown(1.5);

      // Nutrition Summary Box
      doc.fillColor('#f3f4f6').rect(40, doc.y, 515, 60).fill();
      doc.fillColor('#1f2937');
      const startY = doc.y + 12;
      
      useFont('Bold');
      doc.fontSize(12).text('Tóm tắt dinh dưỡng cả tuần:', 55, startY);
      
      useFont('Regular');
      doc
        .fontSize(11)
        .text(
          `Tổng Calo: ${planData.totalCalories || 0} kcal`,
          55,
          startY + 20,
        );
      doc.text(
        `Calo trung bình ngày: ${planData.dailyAvgCalories || 0} kcal`,
        250,
        startY + 20,
      );

      doc.y = startY + 55;
      doc.moveDown(1);

      // Group plan items by day
      const dayLabels = [
        '',
        'Thứ Hai',
        'Thứ Ba',
        'Thứ Tư',
        'Thứ Năm',
        'Thứ Sáu',
        'Thứ Bảy',
        'Chủ Nhật',
      ];
      const mealTypesVn: { [key: string]: string } = {
        breakfast: 'Bữa Sáng',
        lunch: 'Bữa Trưa',
        dinner: 'Bữa Tối',
      };

      for (let day = 1; day <= 7; day++) {
        const dayItems = planData.items.filter(
          (item: any) => item.dayOfWeek === day,
        );

        // Draw day header
        useFont('Bold');
        doc
          .fillColor('#047857')
          .fontSize(14)
          .text(`• ${dayLabels[day]}`, { underline: true });
        doc.moveDown(0.3);

        if (dayItems.length === 0) {
          useFont('Regular');
          doc
            .fillColor('#9ca3af')
            .fontSize(10)
            .text('   Không có thực đơn được lập.');
          doc.moveDown(0.8);
          continue;
        }

        // Draw meals in day
        for (const item of dayItems) {
          const mealName = mealTypesVn[item.mealType] || item.mealType;
          const recipeName = item.recipe ? item.recipe.name : 'Chưa chọn món';
          const cal = item.calories || (item.recipe ? item.recipe.calories : 0);
          const time = item.recipe ? item.recipe.cookingTime : null;

          useFont('Regular');
          doc
            .fillColor('#1f2937')
            .fontSize(11)
            .text(`   - [${mealName}] `, { continued: true });
          
          useFont('Bold');
          doc.fillColor('#111827').text(`${recipeName}`, { continued: true });

          let details = ` (${cal} kcal`;
          if (time) details += `, ${time} phút`;
          details += `)`;

          useFont('Regular');
          doc.fillColor('#4b5563').fontSize(10).text(details);
        }
        doc.moveDown(0.8);

        // Check if page overflow
        if (doc.y > 720 && day < 7) {
          doc.addPage();
        }
      }

      // Footer
      doc.moveDown(2);
      useFont('Regular');
      doc
        .fillColor('#9ca3af')
        .fontSize(9)
        .text(
          'Được tạo tự động bởi Hệ thống AI Meal Planner - Ăn ngon, sống khỏe, tránh lãng phí thực phẩm.',
          { align: 'center' },
        );

      doc.end();
    });
  }

  async generateShoppingListPdf(listData: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const useFont = this.setupFonts(doc);

      // Header
      useFont('Bold');
      doc
        .fillColor('#10b981')
        .fontSize(26)
        .text('DANH SÁCH MUA SẮM', { align: 'center' });
      
      useFont('Regular');
      doc
        .fillColor('#6b7280')
        .fontSize(11)
        .text(
          `Thực đơn: ${listData.name || 'Danh sách mua sắm'} | Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`,
          { align: 'center' },
        );
      doc.moveDown(1.5);

      // Info Block
      doc.fillColor('#f3f4f6').rect(40, doc.y, 515, 35).fill();
      doc.fillColor('#1f2937');
      const startY = doc.y + 10;
      doc
        .fontSize(11)
        .text(
          `Trạng thái: ${listData.status === 'completed' ? 'Đã hoàn thành' : 'Đang chuẩn bị'} | Ngày in: ${new Date().toLocaleDateString('vi-VN')}`,
          55,
          startY,
        );

      doc.y = startY + 25;
      doc.moveDown(1.5);

      // Section: DANH SÁCH NGUYÊN LIỆU CẦN MUA
      useFont('Bold');
      doc
        .fillColor('#10b981')
        .fontSize(14)
        .text('DANH SÁCH NGUYÊN LIỆU CẦN MUA', { underline: true });
      doc.moveDown(0.5);

      // Filter groups to only include items with quantity > 0
      const sourceGroups =
        Array.isArray(listData.groups) && listData.groups.length > 0
          ? listData.groups
          : [{ category: 'Khác', items: Array.isArray(listData.items) ? listData.items : [] }];

      const activeGroups = sourceGroups
        .map((group: any) => {
          const items = Array.isArray(group?.items) ? group.items : [];
          return {
            category: group?.category || 'Khác',
            items: items.filter((item: any) => Number(item?.quantity ?? 0) > 0),
          };
        })
        .filter((group: any) => group.items.length > 0);

      if (activeGroups.length === 0) {
        useFont('Regular');
        doc
          .fillColor('#9ca3af')
          .fontSize(11)
          .text('   (Không có nguyên liệu cần mua)', { oblique: true });
        doc.moveDown(1);
      } else {
        for (const group of activeGroups) {
          useFont('Bold');
          doc
            .fillColor('#059669')
            .fontSize(12)
            .text(`- ${String(group.category || 'Khác').toUpperCase()}`);
          doc.moveDown(0.3);

          for (const item of group.items) {
            const purchasedCheck = item.isPurchased ? '[x]' : '[  ]';
            const name = item.ingredient?.name || item.name || 'Nguyên liệu không xác định';
            const qty = Number(item.quantity ?? item.needToBuyQuantity ?? 0);
            const unit = item.unit || '';
            let itemText = `   ${purchasedCheck}   ${name}: ${qty} ${unit}`;
            if (item.quantitySourced && item.quantitySourced > 0) {
              itemText += ` (Đã trừ ${Number(item.quantitySourced)} ${unit} từ tủ lạnh)`;
            }

            useFont('Regular');
            doc
              .fillColor(item.isPurchased ? '#9ca3af' : '#1f2937')
              .fontSize(11);
            doc.text(itemText);
          }
          doc.moveDown(0.8);

          // Check page boundary
          if (doc.y > 720) {
            doc.addPage();
          }
        }
      }

      // Footer
      doc.moveDown(2);
      useFont('Regular');
      doc
        .fillColor('#9ca3af')
        .fontSize(9)
        .text(
          'Chúc bạn mua sắm vui vẻ! Tiết kiệm và chống lãng phí cùng AI Meal Planner.',
          { align: 'center' },
        );

      doc.end();
    });
  }
}
