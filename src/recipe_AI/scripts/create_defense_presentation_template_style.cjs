const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const pptxgen = require('pptxgenjs');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'slides');
const media = path.join(root, 'docs', 'poster', '_scratch_report_media');
const pptxPath = path.join(outDir, 'MealAI_BaoVe_DoAn_NguyenNhutHoa_template_style.pptx');
const pdfPath = path.join(outDir, 'MealAI_BaoVe_DoAn_NguyenNhutHoa_template_style.pdf');

const img = {
  school: path.join(root, 'docs', 'poster', 'logo_dai_hoc_tra_vinh.png'),
  qr: path.join(root, 'docs', 'poster', 'qrcode web demo.png'),
  erd: path.join(root, 'assets', 'slide7_database_erd.png'),
  arch: path.join(root, 'assets', 'mealai-system-architecture.png'),
  planner: path.join(media, 'image43.png'),
  shopping: path.join(media, 'image44.png'),
  nutrition: path.join(media, 'image45.png'),
  fridge: path.join(media, 'image42.png'),
  recipe: path.join(media, 'image41.png'),
  admin: path.join(media, 'image35.png'),
};

const C = {
  green: '16A34A',
  dark: '082B63',
  emerald: '123D78',
  mint: 'EAF2FF',
  mint2: 'F7FAFF',
  line: 'B8C9E6',
  text: '111827',
  muted: '475569',
  white: 'FFFFFF',
  softBg: 'F5F8FC',
  warn: 'FFF7E6',
  yellow: 'F4D35E',
};

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Nguyễn Nhựt Hóa';
pptx.subject = 'MealAI defense presentation';
pptx.title = 'MealAI - Bảo vệ đồ án tốt nghiệp';
pptx.lang = 'vi-VN';
pptx.theme = { headFontFace: 'Arial', bodyFontFace: 'Arial', lang: 'vi-VN' };
pptx.defineLayout({ name: 'LAYOUT_WIDE', width: 13.333, height: 7.5 });

function addNotes(slide, text) {
  if (typeof slide.addNotes === 'function') slide.addNotes(text);
}

function pngSize(file) {
  const b = fs.readFileSync(file);
  if (b.slice(1, 4).toString() === 'PNG') return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  return { w: 1600, h: 900 };
}

function addImageContain(slide, file, x, y, w, h) {
  slide.addImage({ path: file, x, y, w, h, sizing: { type: 'contain', x, y, w, h } });
}

function addImageCover(slide, file, x, y, w, h) {
  slide.addImage({ path: file, x, y, w, h, sizing: { type: 'cover', x, y, w, h } });
}

function lineAccent(slide, y = 0.96) {
  slide.addShape(pptx.ShapeType.line, { x: 0.35, y, w: 2.15, h: 0, line: { color: C.dark, width: 3 } });
  slide.addShape(pptx.ShapeType.line, { x: 2.5, y, w: 0.85, h: 0, line: { color: C.yellow, width: 5 } });
  slide.addShape(pptx.ShapeType.line, { x: 3.35, y, w: 0.28, h: 0, line: { color: C.green, width: 5 } });
  slide.addShape(pptx.ShapeType.line, { x: 3.63, y, w: 8.37, h: 0, line: { color: C.dark, width: 3 } });
}

function footer(slide, no) {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 6.84, w: 13.333, h: 0.56, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pptx.ShapeType.parallelogram, { x: 9.55, y: 6.84, w: 0.62, h: 0.56, fill: { color: C.emerald }, line: { color: C.emerald } });
  slide.addShape(pptx.ShapeType.parallelogram, { x: 9.95, y: 6.84, w: 0.28, h: 0.56, fill: { color: C.green }, line: { color: C.green } });
  slide.addShape(pptx.ShapeType.parallelogram, { x: 10.18, y: 6.84, w: 0.22, h: 0.56, fill: { color: C.yellow }, line: { color: C.yellow } });
  slide.addText('Đồ án tốt nghiệp ngành Công nghệ thông tin - 2026', { x: 0.35, y: 7.06, w: 3.7, h: 0.12, fontSize: 7.8, color: C.white, bold: true, margin: 0 });
  slide.addText('Nguyễn Nhựt Hóa - MSSV 110122006', { x: 5.15, y: 7.06, w: 3.2, h: 0.12, fontSize: 7.8, color: C.white, bold: true, align: 'center', margin: 0 });
  slide.addText(`MealAI | ${no}`, { x: 11.8, y: 7.06, w: 1.1, h: 0.12, fontSize: 7.8, color: C.white, bold: true, align: 'right', margin: 0 });
}

function addFrame(slide, title, no) {
  slide.background = { color: C.white };
  slide.addText(title.toUpperCase(), {
    x: 0.75, y: 0.25, w: 11.85, h: 0.48,
    fontSize: 26, bold: true, color: C.dark, align: 'center', margin: 0,
  });
  lineAccent(slide);
  slide.addText('MealAI', { x: 11.85, y: 0.68, w: 0.9, h: 0.14, fontSize: 8, bold: true, color: C.green, align: 'center', margin: 0 });
  slide.addShape(pptx.ShapeType.chevron, { x: 12.75, y: 0.61, w: 0.25, h: 0.35, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pptx.ShapeType.chevron, { x: 12.9, y: 0.61, w: 0.25, h: 0.35, fill: { color: C.green }, line: { color: C.green } });
  slide.addShape(pptx.ShapeType.chevron, { x: 13.05, y: 0.61, w: 0.25, h: 0.35, fill: { color: C.yellow }, line: { color: C.yellow } });
  footer(slide, no);
}

function sectionSlide(no, title, build, notes) {
  const s = pptx.addSlide();
  addFrame(s, title, no);
  build(s);
  addNotes(s, notes);
}

function card(slide, x, y, w, h, title = '', icon = '') {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.06, fill: { color: C.white }, line: { color: C.line, width: 1.2 } });
  if (title) {
    slide.addShape(pptx.ShapeType.rect, { x, y, w, h: 0.38, fill: { color: C.dark }, line: { color: C.dark } });
    slide.addText(`${icon ? icon + '  ' : ''}${title}`, { x: x + 0.16, y: y + 0.1, w: w - 0.32, h: 0.13, fontSize: 12.2, bold: true, color: C.white, margin: 0, fit: 'shrink' });
  }
}

function addGlyph(slide, label, x, y, size = 0.34) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w: size, h: size, rectRadius: 0.05, fill: { color: C.mint }, line: { color: C.line } });
  slide.addText(label, { x, y: y + size * 0.35, w: size, h: size * 0.18, fontSize: size * 21, bold: true, color: C.green, align: 'center', margin: 0 });
}

function circleIcon(slide, label, x, y, size = 0.7, accent = C.dark) {
  const fill = accent === C.green ? 'ECFDF5' : 'EFF6FF';
  slide.addShape(pptx.ShapeType.ellipse, {
    x, y, w: size, h: size,
    fill: { color: fill },
    line: { color: C.line, width: 1.1 },
  });
  slide.addText(label, {
    x,
    y: y + size * 0.31,
    w: size,
    h: size * 0.24,
    fontSize: size * 18,
    bold: true,
    color: accent,
    align: 'center',
    margin: 0,
    fit: 'shrink',
  });
}

function bigInfoCard(slide, x, y, w, h) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.06,
    fill: { color: C.white },
    line: { color: C.line, width: 1.1 },
    shadow: { type: 'outer', color: 'D8E2F3', opacity: 0.18, blur: 1.5, angle: 45, distance: 1 },
  });
}

function topMark(slide) {
  slide.addText('MealAI', { x: 11.54, y: 0.55, w: 0.82, h: 0.16, fontSize: 10.5, bold: true, color: C.green, align: 'right', margin: 0 });
  slide.addShape(pptx.ShapeType.chevron, { x: 12.35, y: 0.48, w: 0.27, h: 0.38, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addShape(pptx.ShapeType.chevron, { x: 12.52, y: 0.48, w: 0.27, h: 0.38, fill: { color: C.green }, line: { color: C.green } });
  slide.addShape(pptx.ShapeType.chevron, { x: 12.69, y: 0.48, w: 0.27, h: 0.38, fill: { color: C.yellow }, line: { color: C.yellow } });
}

function bullets(slide, items, x, y, w, opts = {}) {
  const fs = opts.fontSize || 15;
  const gap = opts.gap || 0.42;
  items.forEach((item, i) => {
    slide.addText('•', { x, y: y + i * gap, w: 0.18, h: 0.2, fontSize: fs, bold: true, color: opts.color || C.green, margin: 0 });
    slide.addText(item, { x: x + 0.25, y: y + i * gap + 0.02, w, h: 0.25, fontSize: fs, color: C.text, margin: 0, fit: 'shrink' });
  });
}

function featureCard(slide, x, y, w, h, icon, title, desc) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: C.mint2 }, line: { color: C.line, width: 1.1 } });
  addGlyph(slide, icon, x + 0.2, y + 0.22, 0.44);
  slide.addText(title, { x: x + 0.82, y: y + 0.25, w: w - 1.0, h: 0.14, fontSize: 12.3, bold: true, color: C.dark, margin: 0, fit: 'shrink' });
  slide.addText(desc, { x: x + 0.82, y: y + 0.5, w: w - 1.0, h: 0.15, fontSize: 8.8, color: C.muted, margin: 0, fit: 'shrink' });
}

function imageCard(slide, x, y, w, h, label, file, caption, cover = false) {
  card(slide, x, y, w, h);
  slide.addShape(pptx.ShapeType.roundRect, { x: x + 0.12, y: y + 0.12, w: 1.55, h: 0.28, rectRadius: 0.05, fill: { color: C.dark }, line: { color: C.dark } });
  slide.addText(label, { x: x + 0.2, y: y + 0.22, w: 1.38, h: 0.08, fontSize: 7.8, bold: true, color: C.white, align: 'center', margin: 0, fit: 'shrink' });
  if (cover) addImageCover(slide, file, x + 0.16, y + 0.46, w - 0.32, h - 0.94);
  else addImageContain(slide, file, x + 0.16, y + 0.46, w - 0.32, h - 0.94);
  slide.addText(caption, { x: x + 0.18, y: y + h - 0.32, w: w - 0.36, h: 0.1, fontSize: 7.6, bold: true, color: C.dark, margin: 0, fit: 'shrink' });
}

// 1. Cover
{
  const s = pptx.addSlide();
  s.background = { color: C.white };
  addImageContain(s, img.school, 0.55, 0.35, 1.18, 1.18);
  s.addText('✦ Meal', { x: 10.75, y: 0.45, w: 1.0, h: 0.24, fontSize: 20, bold: true, color: C.dark, align: 'right', margin: 0, fit: 'shrink' });
  s.addText('AI', { x: 11.73, y: 0.45, w: 0.34, h: 0.24, fontSize: 20, bold: true, color: C.green, margin: 0, fit: 'shrink' });
  s.addText('ĐỒ ÁN TỐT NGHIỆP - NGÀNH CÔNG NGHỆ THÔNG TIN', { x: 3.4, y: 0.56, w: 6.5, h: 0.18, fontSize: 12.5, bold: true, color: C.dark, align: 'center', margin: 0 });
  s.addText('XÂY DỰNG HỆ THỐNG GỢI Ý LẬP THỰC ĐƠN\nVÀ NẤU ĂN CHO GIA ĐÌNH TÍCH HỢP AI', {
    x: 1.45, y: 1.38, w: 10.45, h: 0.88,
    fontSize: 28.5, bold: true, color: C.dark, align: 'center', margin: 0, breakLine: false, fit: 'shrink',
  });
  s.addText('Hệ thống hỗ trợ lập thực đơn, quản lý nguyên liệu, mua sắm và phân tích dinh dưỡng.', {
    x: 2.2, y: 2.54, w: 8.95, h: 0.18,
    fontSize: 13.5, color: C.muted, align: 'center', margin: 0,
  });
  lineAccent(s, 3.02);
  bigInfoCard(s, 0.9, 3.5, 11.55, 2.42);
  s.addShape(pptx.ShapeType.line, { x: 6.55, y: 3.75, w: 0, h: 1.88, line: { color: C.line, width: 1.1 } });

  const left = [
    ['SV', 'Sinh viên:', 'Nguyễn Nhựt Hóa'],
    ['ID', 'MSSV:', '110122006'],
    ['LP', 'Lớp:', 'DA22TTA'],
  ];
  left.forEach((it, i) => {
    const y = 3.82 + i * 0.62;
    circleIcon(s, it[0], 1.55, y - 0.08, 0.42, C.dark);
    s.addText(it[1], { x: 2.2, y, w: 1.2, h: 0.13, fontSize: 12.2, color: C.text, margin: 0 });
    s.addText(it[2], { x: 2.2, y: y + 0.2, w: 3.2, h: 0.16, fontSize: 15.2, bold: true, color: C.dark, margin: 0, fit: 'shrink' });
  });

  const right = [
    ['GV', 'Giảng viên hướng dẫn:', 'ThS. Dương Ngọc Vân Khanh'],
    ['DV', 'Đơn vị:', 'Đại học Trà Vinh'],
    ['K', '', 'Trường Kỹ thuật và Công nghệ'],
  ];
  right.forEach((it, i) => {
    const y = 3.82 + i * 0.62;
    circleIcon(s, it[0], 7.25, y - 0.08, 0.42, C.dark);
    if (it[1]) s.addText(it[1], { x: 7.9, y, w: 2.1, h: 0.13, fontSize: 12.2, color: C.text, margin: 0 });
    s.addText(it[2], { x: 7.9, y: y + (it[1] ? 0.2 : 0.1), w: 3.85, h: 0.16, fontSize: 15, bold: true, color: C.dark, margin: 0, fit: 'shrink' });
  });
  footer(s, 1);
  addNotes(s, 'Kính thưa quý thầy cô, em là Nguyễn Nhựt Hóa. Đề tài của em là xây dựng hệ thống MealAI, hỗ trợ lập thực đơn và nấu ăn cho gia đình có tích hợp AI. Em xin trình bày ngắn gọn bài trong khoảng 7 đến 10 phút.');
}

// 2. Agenda
sectionSlide(2, 'Mục lục', s => {
  const rows = [
    ['01', 'Bài toán, mục tiêu và phạm vi'],
    ['02', 'Chức năng, kiến trúc và cơ sở dữ liệu'],
    ['03', 'Thuật toán gợi ý và các màn hình chính'],
    ['04', 'Kết quả, hướng phát triển và demo'],
  ];
  rows.forEach((r, i) => {
    const x = 1.0 + (i % 2) * 5.75;
    const y = 1.55 + Math.floor(i / 2) * 1.65;
    card(s, x, y, 5.15, 1.1);
    addGlyph(s, r[0], x + 0.33, y + 0.32, 0.44);
    s.addText(`${i + 1}. ${r[1]}`, { x: x + 0.95, y: y + 0.37, w: 3.95, h: 0.18, fontSize: 18, bold: true, color: C.dark, margin: 0, fit: 'shrink' });
  });
}, 'Slide này giới thiệu bố cục phần trình bày. Em sẽ đi từ bài toán, mục tiêu, kiến trúc, cơ sở dữ liệu, thuật toán gợi ý, các màn hình chính và cuối cùng là demo hệ thống.');

// 3. Problem
sectionSlide(3, 'Bài toán đặt ra', s => {
  [
    ['?', 'Khó chọn món', 'Khó lên món ăn phù hợp mỗi ngày.'],
    ['!', 'Lãng phí', 'Nguyên liệu dễ dư thừa, hết hạn.'],
    ['▥', 'Dinh dưỡng', 'Khó cân bằng calories và macro.'],
    ['◎', 'Cá nhân hóa', 'Thiếu gợi ý theo sở thích, sức khỏe, TDEE.'],
  ].forEach((d, i) => {
    const x = 1.35 + (i % 2) * 5.45;
    const y = 1.52 + Math.floor(i / 2) * 1.66;
    bigInfoCard(s, x, y, 5.05, 1.22);
    circleIcon(s, d[0], x + 0.32, y + 0.22, 0.78, i % 2 === 0 ? C.dark : C.green);
    s.addText(d[1], { x: x + 1.32, y: y + 0.34, w: 3.25, h: 0.17, fontSize: 17, bold: true, color: C.dark, margin: 0 });
    s.addText(d[2], { x: x + 1.32, y: y + 0.72, w: 3.25, h: 0.15, fontSize: 13.2, color: C.muted, margin: 0, fit: 'shrink' });
  });
  s.addShape(pptx.ShapeType.roundRect, { x: 1.5, y: 5.45, w: 10.35, h: 0.58, rectRadius: 0.06, fill: { color: C.mint }, line: { color: C.line } });
  s.addText('MealAI hỗ trợ lập thực đơn, quản lý nguyên liệu và gợi ý món ăn thông minh.', { x: 2.0, y: 5.65, w: 9.4, h: 0.16, fontSize: 17.2, bold: true, color: C.dark, align: 'center', margin: 0 });
}, 'Bài toán xuất phát từ nhu cầu thực tế trong gia đình: chọn món, cân bằng dinh dưỡng và dùng nguyên liệu sao cho không lãng phí. Vì vậy MealAI được xây dựng để hỗ trợ quá trình này theo hướng cá nhân hóa.');

// 4. Goals
sectionSlide(4, 'Mục tiêu và phạm vi', s => {
  card(s, 0.75, 1.35, 5.8, 4.65, 'Mục tiêu đề tài');
  bullets(s, ['Xây dựng website MealAI hỗ trợ lập thực đơn.', 'Gợi ý món ăn bằng AI và thuật toán xếp hạng.', 'Quản lý công thức, tủ lạnh và danh sách mua sắm.', 'Theo dõi dinh dưỡng dựa trên TDEE cá nhân.'], 1.05, 2.0, 4.95, { fontSize: 15.2, gap: 0.48 });
  card(s, 6.8, 1.35, 5.8, 4.65, 'Đối tượng sử dụng');
  bullets(s, ['Người dùng gia đình: hồ sơ, thực đơn, tủ lạnh, mua sắm.', 'Quản trị viên: quản lý người dùng và công thức.', 'Admin duyệt công thức và xử lý nội dung vi phạm.', 'Hệ thống triển khai web thực tế trên Vercel và Render.'], 7.1, 2.0, 4.95, { fontSize: 15.2, gap: 0.48 });
}, 'Mục tiêu chính là xây dựng một website hoàn chỉnh, không chỉ lưu công thức mà còn hỗ trợ gợi ý thực đơn, mua sắm, tủ lạnh và dinh dưỡng. Phạm vi gồm người dùng gia đình và quản trị viên.');

// 5. Features
sectionSlide(5, 'Chức năng chính', s => {
  const items = [
    ['ND', 'Người dùng', 'Hồ sơ, TDEE, số người ăn.'],
    ['CT', 'Công thức', 'Tìm kiếm, đánh giá, chia sẻ.'],
    ['AI', 'AI Assistant', 'Gợi ý món và chatbot MealAI.'],
    ['TD', 'Thực đơn', 'Theo ngày/tuần và từng bữa.'],
    ['TL', 'Tủ lạnh', 'Số lượng và hạn sử dụng.'],
    ['MS', 'Mua sắm', 'Tổng hợp phần còn thiếu.'],
    ['DD', 'Dinh dưỡng', 'Calories và macro theo tuần.'],
    ['QT', 'Quản trị', 'Duyệt nội dung và cảnh báo.'],
  ];
  items.forEach((it, i) => {
    const x = 0.65 + (i % 4) * 3.18;
    const y = 1.38 + Math.floor(i / 4) * 1.38;
    bigInfoCard(s, x, y, 2.9, 1.12);
    circleIcon(s, it[0], x + 0.22, y + 0.25, 0.58, i % 2 === 0 ? C.dark : C.green);
    s.addText(it[1], { x: x + 0.95, y: y + 0.28, w: 1.55, h: 0.15, fontSize: 13.5, bold: true, color: C.dark, margin: 0, fit: 'shrink' });
    s.addText(it[2], { x: x + 0.95, y: y + 0.58, w: 1.55, h: 0.22, fontSize: 10.2, color: C.muted, margin: 0, fit: 'shrink' });
  });
  s.addShape(pptx.ShapeType.roundRect, { x: 0.7, y: 5.12, w: 11.95, h: 1.0, rectRadius: 0.06, fill: { color: 'F1F7FF' }, line: { color: C.line } });
  const flow = [
    ['HS', 'Hồ sơ'],
    ['GM', 'Gợi ý món'],
    ['TD', 'Thực đơn'],
    ['MS', 'Mua sắm'],
    ['DD', 'Dinh dưỡng'],
    ['QT', 'Quản trị'],
  ];
  flow.forEach((it, i) => {
    const x = 1.55 + i * 1.95;
    circleIcon(s, it[0], x, 5.32, 0.43, i % 2 === 0 ? C.dark : C.green);
    s.addText(it[1], { x: x - 0.25, y: 5.86, w: 0.95, h: 0.1, fontSize: 11.5, bold: true, color: C.dark, align: 'center', margin: 0, fit: 'shrink' });
    if (i < flow.length - 1) s.addText('›', { x: x + 1.0, y: 5.42, w: 0.22, h: 0.16, fontSize: 20, bold: true, color: C.dark, align: 'center', margin: 0 });
  });
}, 'MealAI được chia thành 8 nhóm chức năng chính. Các chức năng liên kết với nhau: hồ sơ người dùng ảnh hưởng đến gợi ý món, thực đơn tạo danh sách mua sắm, và dữ liệu ăn uống dùng để phân tích dinh dưỡng.');

// 6. Architecture
sectionSlide(6, 'Kiến trúc hệ thống', s => {
  const nodes = [
    ['ND', 'Người dùng', 'Web / Mobile'],
    ['FE', 'Frontend', 'Next.js / React'],
    ['API', 'Backend API', 'NestJS / JWT'],
    ['DB', 'PostgreSQL', 'TypeORM'],
    ['AI', 'AI & Email', 'Gemini / Resend'],
  ];
  nodes.forEach((n, i) => {
    const x = 0.82 + i * 2.45;
    bigInfoCard(s, x, 1.48, 1.88, 2.16);
    s.addShape(pptx.ShapeType.ellipse, { x: x + 1.42, y: 1.58, w: 0.34, h: 0.34, fill: { color: C.white }, line: { color: C.line } });
    s.addText(String(i + 1), { x: x + 1.42, y: 1.68, w: 0.34, h: 0.08, fontSize: 10.5, bold: true, color: C.green, align: 'center', margin: 0 });
    s.addShape(pptx.ShapeType.roundRect, { x: x + 0.28, y: 1.78, w: 1.32, h: 0.8, rectRadius: 0.06, fill: { color: 'F1F7FF' }, line: { color: C.line } });
    circleIcon(s, n[0], x + 0.62, 1.94, 0.44, i % 2 === 0 ? C.dark : C.green);
    s.addText(n[1], { x: x + 0.16, y: 2.8, w: 1.56, h: 0.16, fontSize: 13.6, bold: true, color: C.dark, align: 'center', margin: 0, fit: 'shrink' });
    s.addText(n[2], { x: x + 0.16, y: 3.18, w: 1.56, h: 0.12, fontSize: 10.5, color: C.muted, align: 'center', margin: 0, fit: 'shrink' });
    if (i < nodes.length - 1) s.addText('→', { x: x + 1.95, y: 2.35, w: 0.35, h: 0.18, fontSize: 24, bold: true, color: C.green, align: 'center', margin: 0 });
  });
  s.addShape(pptx.ShapeType.roundRect, { x: 0.92, y: 4.35, w: 11.48, h: 0.68, rectRadius: 0.06, fill: { color: C.mint }, line: { color: C.line } });
  circleIcon(s, 'UP', 1.2, 4.5, 0.36, C.dark);
  s.addText('Deploy: Frontend trên Vercel • Backend API trên Render • PostgreSQL Database • Gemini AI gợi ý món • Resend gửi email', { x: 1.78, y: 4.6, w: 10.15, h: 0.13, fontSize: 12.4, bold: true, color: C.dark, margin: 0, fit: 'shrink' });
  s.addShape(pptx.ShapeType.roundRect, { x: 0.92, y: 5.38, w: 11.48, h: 0.68, rectRadius: 0.06, fill: { color: C.softBg }, line: { color: C.line } });
  circleIcon(s, 'EM', 1.2, 5.53, 0.36, C.dark);
  s.addText('Email Service hỗ trợ xác thực email và đặt lại mật khẩu khi cấu hình production.', { x: 1.78, y: 5.64, w: 9.8, h: 0.12, fontSize: 12.2, color: C.muted, margin: 0, fit: 'shrink' });
}, 'Kiến trúc gồm frontend Next.js, backend NestJS API, cơ sở dữ liệu PostgreSQL và các dịch vụ AI/email. Resend được dùng cho email xác thực và đặt lại mật khẩu khi cấu hình production, phù hợp hơn SMTP trên môi trường deploy.');

// 7. ERD
sectionSlide(7, 'Cơ sở dữ liệu ERD', s => {
  s.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 1.12, w: 12.35, h: 5.45,
    rectRadius: 0.06,
    fill: { color: C.white, transparency: 100 },
    line: { color: C.line, width: 1.1 },
  });
  addImageContain(s, img.erd, 0.55, 1.18, 12.25, 5.28);
}, 'Trong báo cáo em có trình bày chi tiết 3 nhóm ERD. Trên slide em sử dụng ảnh ERD tổng quan gồm nhóm nghiệp vụ chính, nhóm kiểm duyệt/phân bổ nguyên liệu và nhóm xác thực/chatbot/dinh dưỡng để thầy cô thấy cấu trúc dữ liệu đầy đủ hơn.');

// 8. Recommendation algorithm
sectionSlide(8, 'Thuật toán gợi ý món ăn', s => {
  const boxes = [
    ['ND', 'Dữ liệu người dùng', 'Sở thích, sức khỏe, TDEE,\nnguyên liệu, lịch sử món.'],
    ['RF', 'Rule-Based Filtering', 'Dị ứng/sức khỏe, bữa đã qua,\ntrùng món, thời gian nấu.'],
    ['SR', 'Scoring-Based Ranking', 'Ingredient, Nutrition/TDEE,\nPreference, Waste Reduction.'],
    ['AI', 'Món ăn đề xuất', 'Món phù hợp theo bữa\nvà mục tiêu cá nhân.'],
  ];
  boxes.forEach((b, i) => {
    const x = 0.72 + i * 3.14;
    bigInfoCard(s, x, 1.56, 2.58, 2.62);
    s.addShape(pptx.ShapeType.roundRect, { x: x + 2.2, y: 1.56, w: 0.38, h: 0.38, rectRadius: 0.04, fill: { color: i % 2 === 0 ? C.dark : C.green }, line: { color: i % 2 === 0 ? C.dark : C.green } });
    s.addText(String(i + 1), { x: x + 2.2, y: 1.69, w: 0.38, h: 0.08, fontSize: 12, bold: true, color: C.white, align: 'center', margin: 0 });
    circleIcon(s, b[0], x + 0.35, 1.92, 0.66, i % 2 === 0 ? C.dark : C.green);
    s.addText(b[1], { x: x + 0.35, y: 2.75, w: 1.85, h: 0.35, fontSize: 15.5, bold: true, color: C.dark, align: 'center', margin: 0, fit: 'shrink' });
    s.addText(b[2], { x: x + 0.35, y: 3.33, w: 1.85, h: 0.46, fontSize: 11.3, color: C.muted, align: 'center', margin: 0, fit: 'shrink' });
    if (i < 3) s.addText('→', { x: x + 2.66, y: 2.7, w: 0.35, h: 0.2, fontSize: 24, bold: true, color: C.green, margin: 0 });
  });
  s.addShape(pptx.ShapeType.roundRect, { x: 1.5, y: 5.12, w: 10.35, h: 0.72, rectRadius: 0.06, fill: { color: C.warn }, line: { color: C.line } });
  circleIcon(s, 'Σ', 1.82, 5.27, 0.42, C.dark);
  s.addText('Final Score = w1×Ingredient + w2×Nutrition + w3×Preference + w4×Waste Reduction − Penalty', { x: 2.4, y: 5.4, w: 8.95, h: 0.12, fontSize: 13.8, bold: true, color: C.text, align: 'center', margin: 0, fit: 'shrink' });
}, 'Thuật toán gợi ý gồm hai tầng. Tầng đầu lọc món không phù hợp theo luật cứng như dị ứng, sức khỏe, bữa đã qua hoặc món trùng. Tầng sau chấm điểm các món còn lại để chọn món phù hợp nhất.');

// 9. Meal Planner
sectionSlide(9, 'Meal Planner', s => {
  imageCard(s, 0.6, 1.18, 8.0, 5.1, 'Thực đơn tuần', img.planner, 'Lập thực đơn ngày/tuần, theo dõi kcal từng bữa.', true);
  card(s, 8.9, 1.18, 3.75, 5.1, 'Nghiệp vụ chính');
  bullets(s, ['Lập thực đơn ngày/tuần.', 'AI gợi ý món theo bữa.', 'Hiển thị kcal từng bữa và cả ngày.', 'Khóa bữa/ngày đã qua.'], 9.2, 1.95, 3.0, { fontSize: 15, gap: 0.5 });
  s.addShape(pptx.ShapeType.roundRect, { x: 9.15, y: 5.1, w: 3.05, h: 0.65, fill: { color: C.mint }, line: { color: C.line } });
  s.addText('Calories so sánh theo 1 khẩu phần/người; số người ăn dùng cho nguyên liệu và mua sắm.', { x: 9.35, y: 5.28, w: 2.65, h: 0.22, fontSize: 11.8, bold: true, color: C.dark, margin: 0, fit: 'shrink' });
}, 'Meal Planner là màn hình trung tâm. Người dùng xem thực đơn theo tuần, gọi AI gợi ý cho từng bữa và theo dõi calories. TDEE luôn là mục tiêu cá nhân một người, còn số người ăn dùng cho nguyên liệu và danh sách mua sắm.');

// 10. Chatbot
sectionSlide(10, 'Chatbot MealAI', s => {
  imageCard(s, 0.6, 1.18, 8.0, 5.1, 'Chatbot', img.planner, 'Chatbot hỗ trợ thao tác trực tiếp trên thực đơn.', true);
  s.addShape(pptx.ShapeType.roundRect, { x: 5.3, y: 1.88, w: 2.5, h: 3.3, fill: { color: '0D2038' }, line: { color: C.green, width: 1.5 } });
  s.addText('Trợ lý MealAI', { x: 5.62, y: 2.18, w: 1.8, h: 0.2, fontSize: 13.5, bold: true, color: C.white, margin: 0 });
  s.addText('xóa các món tối mai', { x: 5.7, y: 2.88, w: 1.55, h: 0.18, fontSize: 9.5, color: C.white, margin: 0 });
  s.addShape(pptx.ShapeType.roundRect, { x: 5.65, y: 3.55, w: 1.9, h: 0.82, fill: { color: C.mint }, line: { color: C.mint } });
  s.addText('Đã xóa 2 món khỏi bữa Tối ngày Thứ Sáu.', { x: 5.84, y: 3.84, w: 1.52, h: 0.16, fontSize: 7.7, color: C.text, margin: 0, fit: 'shrink' });
  card(s, 8.9, 1.18, 3.75, 5.1, 'Khả năng hỗ trợ');
  bullets(s, ['Nhận yêu cầu tiếng Việt.', 'Thêm, xóa, đổi món.', 'Tạo thực đơn và mua sắm.', 'Đồng bộ giao diện sau thao tác.'], 9.2, 1.95, 3.0, { fontSize: 15, gap: 0.5 });
}, 'Chatbot giúp thao tác nhanh bằng tiếng Việt. Ví dụ người dùng có thể yêu cầu xóa các món trong một bữa, tạo thực đơn hoặc tạo danh sách mua sắm. Sau khi chatbot xử lý, giao diện được cập nhật lại.');

// 11. Inventory and shopping
sectionSlide(11, 'Tủ lạnh và danh sách mua sắm', s => {
  imageCard(s, 0.55, 1.2, 6.05, 4.25, 'Mua sắm', img.shopping, 'Danh sách mua sắm tự động.', true);
  imageCard(s, 6.85, 1.2, 6.05, 4.25, 'Tủ lạnh', img.fridge, 'Quản lý tủ lạnh và hạn sử dụng.', true);
  bullets(s, ['Quy đổi nguyên liệu theo số người ăn.', 'Trừ nguyên liệu đã có trong tủ lạnh.', 'Hỗ trợ giảm lãng phí và thiếu nguyên liệu khi nấu.'], 1.2, 5.78, 10.8, { fontSize: 14.5, gap: 0.32 });
}, 'Tủ lạnh và mua sắm liên kết trực tiếp với thực đơn. Khi tạo danh sách mua sắm, hệ thống tính nguyên liệu cần nấu, nhân theo số người ăn và trừ phần đã có trong tủ lạnh.');

// 12. Nutrition
sectionSlide(12, 'Dinh dưỡng & AI Insights', s => {
  imageCard(s, 0.6, 1.18, 8.25, 5.1, 'Dinh dưỡng', img.nutrition, 'Theo dõi calories, protein, carbs, fat và mục tiêu dinh dưỡng.', true);
  card(s, 9.15, 1.18, 3.45, 5.1, 'Theo dõi');
  bullets(s, ['Calories, protein, carbs, fat.', 'So sánh với TDEE cá nhân.', 'Mục tiêu theo ngày/tuần.', 'AI Insights cảnh báo và đề xuất.'], 9.45, 1.95, 2.65, { fontSize: 14, gap: 0.45 });
  s.addText('Protein = TDEE×15%/4\nCarbs = TDEE×55%/4\nFat = TDEE×30%/9', { x: 9.45, y: 4.75, w: 2.6, h: 0.42, fontSize: 10.8, bold: true, color: C.green, margin: 0 });
}, 'Trang dinh dưỡng hiển thị calories và macro theo tuần, có đường mục tiêu từ TDEE. Người dùng có thể thấy bữa ăn đang thiếu hoặc vượt mục tiêu để điều chỉnh.');

// 13. Admin
sectionSlide(13, 'Quản trị hệ thống', s => {
  imageCard(s, 0.6, 1.18, 8.25, 5.1, 'Quản trị', img.admin, 'Giao diện quản trị riêng cho admin.', true);
  card(s, 9.15, 1.18, 3.45, 5.1, 'Chức năng admin');
  bullets(s, ['Quản lý người dùng và công thức.', 'Duyệt công thức chia sẻ.', 'Xử lý cảnh báo đánh giá vi phạm.', 'Chống đánh giá trùng bằng upsert.'], 9.45, 1.95, 2.65, { fontSize: 14, gap: 0.45 });
  s.addShape(pptx.ShapeType.roundRect, { x: 9.38, y: 4.82, w: 2.8, h: 0.52, fill: { color: C.mint }, line: { color: C.line } });
  s.addText('Nội dung vi phạm được che: “Nội dung không phù hợp”.', { x: 9.55, y: 4.98, w: 2.45, h: 0.14, fontSize: 10.5, bold: true, color: C.dark, margin: 0, fit: 'shrink' });
}, 'Admin có giao diện riêng, không dùng menu của người dùng thường. Admin có thể quản lý công thức, duyệt bài chia sẻ và xử lý cảnh báo đánh giá hoặc bình luận vi phạm.');

// 14. Result
sectionSlide(14, 'Kết quả và hướng phát triển', s => {
  card(s, 0.8, 1.35, 5.85, 4.75, 'Kết quả đạt được');
  bullets(s, ['Hoàn thiện website MealAI và triển khai online.', 'Có AI gợi ý, chatbot và Recommendation Engine.', 'Hỗ trợ thực đơn, tủ lạnh, mua sắm, dinh dưỡng.', 'Có quản trị, duyệt công thức và cảnh báo nội dung.'], 1.1, 2.05, 4.85, { fontSize: 14.7, gap: 0.5 });
  addGlyph(s, 'KQ', 3.22, 5.02, 0.72);
  s.addText('Sản phẩm đã triển khai', { x: 2.45, y: 5.72, w: 2.25, h: 0.18, fontSize: 10.5, bold: true, color: C.green, align: 'center', margin: 0 });
  card(s, 6.9, 1.35, 5.65, 4.75, 'Hướng phát triển');
  bullets(s, ['Phát triển ứng dụng mobile.', 'OCR nhận diện nguyên liệu từ hình ảnh.', 'Mở rộng dữ liệu món ăn và dinh dưỡng Việt Nam.', 'Cải tiến thuật toán bằng Machine Learning.'], 7.2, 2.05, 4.6, { fontSize: 14.7, gap: 0.5 });
  addGlyph(s, 'PT', 9.33, 5.02, 0.72);
  s.addText('Tiếp tục mở rộng', { x: 8.55, y: 5.72, w: 2.25, h: 0.18, fontSize: 10.5, bold: true, color: C.green, align: 'center', margin: 0 });
}, 'Hệ thống đã hoàn thiện các chức năng chính và triển khai online. Hướng phát triển tập trung vào mobile, OCR, mở rộng dữ liệu Việt Nam và nâng cấp thuật toán gợi ý.');

// 15. Demo
sectionSlide(15, 'Demo hệ thống MealAI', s => {
  card(s, 0.95, 1.35, 8.0, 4.8, 'Kịch bản demo');
  bullets(s, ['Đăng nhập và hồ sơ TDEE.', 'Lập thực đơn và AI gợi ý.', 'Chatbot MealAI.', 'Tủ lạnh và danh sách mua sắm.', 'Dinh dưỡng & AI Insights.', 'Quản trị hệ thống.'], 1.35, 2.05, 6.8, { fontSize: 18, gap: 0.5 });
  card(s, 9.35, 1.35, 2.55, 4.8, 'QR Demo');
  addImageContain(s, img.qr, 9.75, 2.25, 1.75, 1.75);
  s.addText('https://mealai-two.vercel.app', { x: 9.55, y: 4.35, w: 2.1, h: 0.15, fontSize: 8.8, bold: true, color: C.green, align: 'center', margin: 0 });
  s.addText('Em xin chân thành cảm ơn quý thầy cô!', { x: 2.2, y: 6.35, w: 8.8, h: 0.28, fontSize: 20, bold: true, color: C.dark, align: 'center', margin: 0 });
}, 'Đến phần demo, em sẽ thao tác trực tiếp trên website theo luồng từ hồ sơ TDEE, lập thực đơn, chatbot, tủ lạnh, mua sắm, dinh dưỡng và admin. Em xin cảm ơn quý thầy cô đã lắng nghe.');

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  await pptx.writeFile({ fileName: pptxPath });
  const ps = `
$ErrorActionPreference = 'Stop'
$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = [Microsoft.Office.Core.MsoTriState]::msoTrue
$pres = $ppt.Presentations.Open('${pptxPath.replace(/'/g, "''")}', $true, $false, $false)
$pres.SaveAs('${pdfPath.replace(/'/g, "''")}', 32)
$pres.Close()
$ppt.Quit()
`;
  const pdf = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', ps], { encoding: 'utf8' });
  if (pdf.status !== 0) console.warn(`PDF export failed:\n${pdf.stdout}\n${pdf.stderr}`);
  console.log(`PPTX exported: ${pptxPath}`);
  if (fs.existsSync(pdfPath)) console.log(`PDF exported: ${pdfPath}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
