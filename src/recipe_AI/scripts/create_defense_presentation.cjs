const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const pptxgen = require('pptxgenjs');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'slides');
const pptxPath = path.join(outDir, 'MealAI_BaoVe_DoAn_NguyenNhutHoa.pptx');
const pdfPath = path.join(outDir, 'MealAI_BaoVe_DoAn_NguyenNhutHoa.pdf');
const media = path.join(root, 'docs', 'poster', '_scratch_report_media');

const img = {
  school: path.join(root, 'docs', 'poster', 'logo_dai_hoc_tra_vinh.png'),
  qr: path.join(root, 'docs', 'poster', 'qrcode web demo.png'),
  erd: path.join(root, 'assets', 'slide7_database_erd.png'),
  planner: path.join(media, 'image43.png'),
  shopping: path.join(media, 'image44.png'),
  nutrition: path.join(media, 'image45.png'),
  fridge: path.join(media, 'image42.png'),
  tdee: path.join(media, 'image49.png'),
  recipe: path.join(media, 'image41.png'),
  admin: path.join(media, 'image35.png'),
  architecture: path.join(root, 'assets', 'kien-truc-tong-the-he-thong-mealai.png'),
  recommend: path.join(root, 'assets', 'quy-trinh-goi-y-mon-an-mealai.png'),
};

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Nguyen Nhut Hoa';
pptx.company = 'Tra Vinh University';
pptx.subject = 'Bao ve do an tot nghiep MealAI';
pptx.title = 'MealAI - Bao ve do an tot nghiep';
pptx.lang = 'vi-VN';
pptx.theme = {
  headFontFace: 'Arial',
  bodyFontFace: 'Arial',
  lang: 'vi-VN',
};
pptx.defineLayout({ name: 'LAYOUT_WIDE', width: 13.333, height: 7.5 });

const W = 13.333;
const H = 7.5;
const C = {
  green: '007A4D',
  dark: '075B38',
  mint: 'EAF8F1',
  mint2: 'F5FCF8',
  border: '9BD9BC',
  blue: '145692',
  text: '17372D',
  muted: '5B7169',
  orange: 'F5A623',
  white: 'FFFFFF',
};

function addNotes(slide, text) {
  if (typeof slide.addNotes === 'function') slide.addNotes(text);
}

function pngSize(file) {
  const b = fs.readFileSync(file);
  if (b.slice(1, 4).toString() === 'PNG') {
    return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  }
  return { w: 1600, h: 900 };
}

function addImageContain(slide, file, x, y, w, h, opts = {}) {
  const s = pngSize(file);
  const scale = Math.min(w / s.w, h / s.h);
  const iw = s.w * scale;
  const ih = s.h * scale;
  const ix = x + (w - iw) / 2;
  const iy = y + (h - ih) / 2;
  slide.addImage({ path: file, x: ix, y: iy, w: iw, h: ih, ...opts });
}

function addImageCover(slide, file, x, y, w, h, opts = {}) {
  const s = pngSize(file);
  // Keep screenshots inside their frame. A manual "cover" crop would overflow
  // in PowerPoint exports, so this uses a clean contain fit for demo screens.
  const scale = Math.min(w / s.w, h / s.h);
  const iw = s.w * scale;
  const ih = s.h * scale;
  const ix = x + (w - iw) / 2;
  const iy = y + (h - ih) / 2;
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h, fill: { color: C.white }, line: { color: C.border, transparency: 100 } });
  slide.addImage({ path: file, x: ix, y: iy, w: iw, h: ih, ...opts });
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h, fill: { color: C.white, transparency: 100 }, line: { color: C.border, width: 1 } });
}

function addHeader(slide, no, title, subtitle = '') {
  slide.background = { color: 'FBFEFC' };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.13, fill: { color: C.green }, line: { color: C.green } });
  slide.addText(String(no).padStart(2, '0'), {
    x: 0.35, y: 0.25, w: 0.55, h: 0.38,
    fontFace: 'Arial', fontSize: 12, bold: true, color: C.white,
    align: 'center', valign: 'mid',
    fill: { color: C.green }, margin: 0.03,
    radius: 0.1,
  });
  slide.addText(title, {
    x: 1.0, y: 0.2, w: 10.4, h: 0.42,
    fontFace: 'Arial', fontSize: 24, bold: true, color: C.dark,
    margin: 0,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 1.02, y: 0.67, w: 11.2, h: 0.28,
      fontFace: 'Arial', fontSize: 9.5, color: C.muted, margin: 0,
    });
  }
  slide.addText('MealAI', {
    x: 11.9, y: 0.22, w: 1.1, h: 0.35,
    fontFace: 'Arial', fontSize: 15, bold: true, color: C.green,
    margin: 0,
  });
  slide.addShape(pptx.ShapeType.line, { x: 0.35, y: 1.05, w: 12.6, h: 0, line: { color: C.border, width: 1 } });
}

function addFooter(slide, page) {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 7.25, w: W, h: 0.25, fill: { color: C.green }, line: { color: C.green } });
  slide.addText('Đồ án tốt nghiệp ngành Công nghệ thông tin - 2026', {
    x: 0.35, y: 7.31, w: 4.2, h: 0.12, fontSize: 6.5, color: C.white, bold: true, margin: 0,
  });
  slide.addText('Nguyễn Nhựt Hóa - MSSV 110122006', {
    x: 5.2, y: 7.31, w: 3.2, h: 0.12, fontSize: 6.5, color: C.white, bold: true, align: 'center', margin: 0,
  });
  slide.addText(`MealAI | ${page}`, {
    x: 11.2, y: 7.31, w: 1.8, h: 0.12, fontSize: 6.5, color: C.white, bold: true, align: 'right', margin: 0,
  });
}

function card(slide, x, y, w, h, title, opts = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.08,
    fill: { color: opts.fill || C.white },
    line: { color: opts.line || C.border, width: opts.width || 1 },
    shadow: opts.shadow === false ? undefined : { type: 'outer', color: 'D9EDE3', opacity: 0.22, blur: 1.2, angle: 45, distance: 1 },
  });
  if (title) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.18, y: y + 0.14, w: Math.min(w - 0.36, Math.max(1.4, title.length * 0.12)), h: 0.32,
      rectRadius: 0.07, fill: { color: C.green }, line: { color: C.green },
    });
    slide.addText(title, {
      x: x + 0.28, y: y + 0.2, w: w - 0.55, h: 0.18,
      fontSize: 11, bold: true, color: C.white, margin: 0,
    });
  }
}

function bulletList(slide, items, x, y, w, h, opts = {}) {
  const text = items.map(t => `• ${t}`).join('\n');
  slide.addText(text, {
    x, y, w, h,
    fontFace: 'Arial',
    fontSize: opts.size || 14,
    color: opts.color || C.text,
    breakLine: false,
    fit: 'shrink',
    margin: opts.margin ?? 0.02,
    paraSpaceAfterPt: opts.space ?? 6,
    valign: 'top',
    bold: opts.bold || false,
  });
}

function metric(slide, x, y, w, h, label, value, color = C.green) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.06, fill: { color: 'F2FBF7' }, line: { color: C.border, width: 0.8 } });
  slide.addText(value, { x, y: y + 0.11, w, h: 0.22, fontSize: 14, bold: true, color, align: 'center', margin: 0 });
  slide.addText(label, { x, y: y + 0.39, w, h: 0.16, fontSize: 7.2, bold: true, color: C.muted, align: 'center', margin: 0 });
}

function titleSlide() {
  const s = pptx.addSlide();
  s.background = { color: 'FBFEFC' };
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.16, fill: { color: C.green }, line: { color: C.green } });
  addImageContain(s, img.school, 0.35, 0.45, 1.2, 1.2);
  s.addText('ĐỒ ÁN TỐT NGHIỆP - NGÀNH CÔNG NGHỆ THÔNG TIN', { x: 2.0, y: 0.35, w: 9.3, h: 0.25, fontSize: 10, bold: true, color: C.blue, align: 'center', margin: 0 });
  s.addText('XÂY DỰNG HỆ THỐNG GỢI Ý LẬP THỰC ĐƠN\nVÀ NẤU ĂN CHO GIA ĐÌNH TÍCH HỢP AI', {
    x: 1.35, y: 0.9, w: 10.8, h: 1.1,
    fontSize: 28, bold: true, color: C.dark, align: 'center', margin: 0,
    fit: 'shrink',
  });
  s.addText('Hệ thống hỗ trợ lập thực đơn, quản lý nguyên liệu, tạo danh sách mua sắm và phân tích dinh dưỡng bằng AI.', {
    x: 2.0, y: 2.08, w: 9.4, h: 0.25, fontSize: 12, color: C.muted, align: 'center', margin: 0,
  });
  s.addShape(pptx.ShapeType.line, { x: 0.8, y: 2.55, w: 11.7, h: 0, line: { color: C.green, width: 1.5 } });
  card(s, 1.15, 2.85, 11.0, 2.2, '', { fill: C.mint2 });
  const info = [
    ['Sinh viên thực hiện', 'Nguyễn Nhựt Hóa'],
    ['MSSV', '110122006'],
    ['Lớp', 'DA22TTA'],
    ['GVHD', 'ThS. Dương Ngọc Vân Khanh'],
    ['Đơn vị', 'Đại học Trà Vinh – Trường Kỹ thuật và Công nghệ'],
  ];
  info.forEach((r, i) => {
    const yy = 3.1 + i * 0.36;
    s.addText(r[0] + ':', { x: 2.2, y: yy, w: 2.2, h: 0.2, fontSize: 12, bold: true, color: C.green, margin: 0 });
    s.addText(r[1], { x: 4.05, y: yy, w: 6.2, h: 0.2, fontSize: 12, color: C.text, margin: 0 });
  });
  metric(s, 1.5, 5.55, 2.2, 0.66, 'nhóm chức năng', '8');
  metric(s, 4.0, 5.55, 2.2, 0.66, 'tầng gợi ý món', '2');
  metric(s, 6.5, 5.55, 2.2, 0.66, 'triển khai web', 'Online');
  metric(s, 9.0, 5.55, 2.2, 0.66, 'AI hỗ trợ', 'Gemini');
  addFooter(s, 1);
  addNotes(s, 'Em xin kính chào quý thầy cô. Em là Nguyễn Nhựt Hóa, thực hiện đề tài MealAI. Phần trình bày tập trung vào bài toán, giải pháp, kiến trúc, chức năng chính và demo hệ thống.');
}

function standardSlide(no, title, subtitle, build, notes) {
  const s = pptx.addSlide();
  addHeader(s, no, title, subtitle);
  build(s);
  addFooter(s, no);
  addNotes(s, notes);
}

titleSlide();

standardSlide(2, 'Bài toán đặt ra', 'Gia đình cần công cụ hỗ trợ chọn món, quản lý nguyên liệu và dinh dưỡng hằng ngày.', s => {
  const problems = [
    ['Khó chọn món ăn', 'Mỗi ngày phải cân nhắc khẩu vị, thời gian và dinh dưỡng.'],
    ['Lãng phí nguyên liệu', 'Nguyên liệu dễ dư thừa nếu không theo dõi hạn dùng.'],
    ['Khó cân bằng kcal', 'Người dùng khó tự theo dõi calories và macro.'],
    ['Thiếu cá nhân hóa', 'Ít công cụ gợi ý theo sức khỏe, sở thích và TDEE.'],
  ];
  problems.forEach((p, i) => {
    const x = 0.7 + (i % 2) * 6.1;
    const y = 1.45 + Math.floor(i / 2) * 1.55;
    card(s, x, y, 5.55, 1.15, '');
    s.addShape(pptx.ShapeType.ellipse, { x: x + 0.25, y: y + 0.3, w: 0.44, h: 0.44, fill: { color: C.mint }, line: { color: C.border } });
    s.addText(String(i + 1), { x: x + 0.25, y: y + 0.41, w: 0.44, h: 0.12, fontSize: 9, bold: true, color: C.green, align: 'center', margin: 0 });
    s.addText(p[0], { x: x + 0.85, y: y + 0.25, w: 4.2, h: 0.22, fontSize: 15, bold: true, color: C.dark, margin: 0 });
    s.addText(p[1], { x: x + 0.85, y: y + 0.58, w: 4.2, h: 0.3, fontSize: 10.5, color: C.muted, margin: 0, fit: 'shrink' });
  });
  card(s, 1.4, 5.05, 10.5, 0.85, '');
  s.addText('MealAI hỗ trợ lập thực đơn, quản lý nguyên liệu và gợi ý món ăn thông minh.', { x: 1.7, y: 5.34, w: 9.9, h: 0.2, fontSize: 15, bold: true, color: C.green, align: 'center', margin: 0 });
}, 'Slide này nêu vấn đề thực tế trong bữa ăn gia đình. Người dùng không chỉ cần công thức, mà cần một quy trình từ chọn món, kiểm soát nguyên liệu đến theo dõi dinh dưỡng. MealAI được xây dựng để giải quyết chuỗi nhu cầu đó.');

standardSlide(3, 'Mục tiêu đề tài', 'Xây dựng website MealAI phục vụ người dùng gia đình và quản trị nội dung.', s => {
  const goals = [
    ['Website lập thực đơn', 'Hỗ trợ tạo thực đơn ngày/tuần theo nhu cầu gia đình.'],
    ['AI gợi ý món ăn', 'Kết hợp Gemini và thuật toán xếp hạng món phù hợp.'],
    ['Quản lý quy trình ăn uống', 'Liên kết công thức, tủ lạnh và danh sách mua sắm.'],
    ['Theo dõi dinh dưỡng', 'Tính TDEE cá nhân và mục tiêu kcal theo bữa.'],
  ];
  goals.forEach((g, i) => {
    const x = 0.75 + (i % 2) * 6.0;
    const y = 1.55 + Math.floor(i / 2) * 1.7;
    card(s, x, y, 5.45, 1.25, '');
    s.addText(`${i + 1}`, { x: x + 0.25, y: y + 0.22, w: 0.48, h: 0.48, fontSize: 16, bold: true, color: C.white, align: 'center', valign: 'mid', fill: { color: C.green }, margin: 0 });
    s.addText(g[0], { x: x + 0.9, y: y + 0.27, w: 4.1, h: 0.25, fontSize: 15, bold: true, color: C.dark, margin: 0 });
    s.addText(g[1], { x: x + 0.9, y: y + 0.65, w: 4.2, h: 0.28, fontSize: 10.5, color: C.muted, margin: 0 });
  });
  s.addText('Điểm nhấn: MealAI không chỉ lưu công thức mà kết nối thực đơn, tủ lạnh, mua sắm, TDEE và chatbot AI trong một quy trình thống nhất.', { x: 1.0, y: 5.45, w: 11.3, h: 0.44, fontSize: 13, bold: true, color: C.green, align: 'center', margin: 0 });
}, 'Mục tiêu chính là xây dựng một hệ thống web hoàn chỉnh. Điểm khác biệt là các chức năng không tách rời mà kết nối với nhau: hồ sơ người dùng ảnh hưởng gợi ý món, thực đơn sinh danh sách mua sắm, và dinh dưỡng được theo dõi theo TDEE.');

standardSlide(4, 'Phạm vi và đối tượng sử dụng', 'Hệ thống tập trung vào người dùng gia đình và tài khoản quản trị.', s => {
  card(s, 0.7, 1.45, 5.85, 4.5, 'Người dùng gia đình');
  bulletList(s, ['Đăng ký, đăng nhập và xác thực email.', 'Cập nhật hồ sơ, TDEE, số người ăn.', 'Lập thực đơn, quản lý tủ lạnh, mua sắm.', 'Đánh giá và yêu thích công thức.'], 1.0, 2.05, 5.25, 3.2, { size: 15 });
  card(s, 6.8, 1.45, 5.85, 4.5, 'Quản trị viên');
  bulletList(s, ['Quản lý người dùng.', 'Duyệt công thức chia sẻ.', 'Kiểm duyệt nội dung vi phạm.', 'Theo dõi cảnh báo hệ thống.'], 7.1, 2.05, 5.25, 3.2, { size: 15 });
}, 'Phạm vi hệ thống gồm hai nhóm người dùng. Người dùng gia đình sử dụng các chức năng chính hằng ngày. Quản trị viên có giao diện riêng để quản lý dữ liệu, duyệt công thức và xử lý cảnh báo nội dung.');

standardSlide(5, 'Chức năng chính', '8 nhóm chức năng phục vụ quy trình từ chọn món đến mua sắm và kiểm duyệt.', s => {
  const funcs = [
    ['ND', 'Quản lý người dùng', 'Tài khoản, hồ sơ và phân quyền.'],
    ['CT', 'Quản lý công thức', 'Tìm kiếm, đánh giá và chia sẻ.'],
    ['AI', 'AI Assistant', 'Gợi ý món và chatbot MealAI.'],
    ['TD', 'Lập thực đơn', 'Theo ngày/tuần và từng bữa.'],
    ['TL', 'Tủ lạnh thông minh', 'Số lượng và hạn sử dụng.'],
    ['MS', 'Danh sách mua sắm', 'Tự động tổng hợp nguyên liệu.'],
    ['DD', 'Dinh dưỡng & AI Insights', 'TDEE, calories và macro.'],
    ['QT', 'Quản trị hệ thống', 'Duyệt nội dung và cảnh báo.'],
  ];
  funcs.forEach((f, i) => {
    const x = 0.55 + (i % 4) * 3.15;
    const y = 1.35 + Math.floor(i / 4) * 1.42;
    card(s, x, y, 2.95, 1.05, '');
    s.addText(f[0], { x: x + 0.16, y: y + 0.32, w: 0.42, h: 0.24, fontSize: 8.5, bold: true, color: C.green, align: 'center', margin: 0, fill: { color: C.mint } });
    s.addText(f[1], { x: x + 0.72, y: y + 0.24, w: 2.05, h: 0.2, fontSize: 11.3, bold: true, color: C.dark, margin: 0 });
    s.addText(f[2], { x: x + 0.72, y: y + 0.54, w: 2.05, h: 0.22, fontSize: 8.5, color: C.muted, margin: 0, fit: 'shrink' });
  });
  card(s, 1.0, 5.0, 11.3, 0.75, '');
  s.addText('Hồ sơ → Gợi ý món → Thực đơn → Mua sắm → Dinh dưỡng → Quản trị', { x: 1.2, y: 5.28, w: 10.9, h: 0.16, fontSize: 15, bold: true, color: C.green, align: 'center', margin: 0 });
}, 'Slide này tóm tắt các nhóm chức năng chính. Khi demo em sẽ đi theo luồng: cập nhật hồ sơ, lập thực đơn, dùng AI gợi ý, tạo mua sắm, xem dinh dưỡng và cuối cùng là quản trị.');

standardSlide(6, 'Kiến trúc hệ thống', 'Frontend Next.js giao tiếp Backend NestJS API, lưu dữ liệu PostgreSQL và tích hợp AI.', s => {
  const blocks = [
    ['Người dùng', 'Web / Mobile'],
    ['Frontend', 'Next.js / React'],
    ['Backend API', 'NestJS / JWT'],
    ['Database', 'PostgreSQL'],
    ['AI Service', 'Gemini / Recommendation'],
  ];
  blocks.forEach((b, i) => {
    const x = 0.65 + i * 2.48;
    card(s, x, 2.1, 2.0, 1.15, '');
    s.addText(b[0], { x: x + 0.1, y: 2.37, w: 1.8, h: 0.18, fontSize: 13, bold: true, color: C.dark, align: 'center', margin: 0 });
    s.addText(b[1], { x: x + 0.1, y: 2.72, w: 1.8, h: 0.18, fontSize: 9, color: C.muted, align: 'center', margin: 0 });
    if (i < blocks.length - 1) s.addText('›', { x: x + 2.02, y: 2.42, w: 0.3, h: 0.24, fontSize: 22, bold: true, color: C.green, margin: 0 });
  });
  card(s, 1.05, 4.25, 11.25, 1.08, 'Triển khai');
  bulletList(s, ['Frontend triển khai trên Vercel.', 'Backend và PostgreSQL triển khai trên Render.', 'Email sử dụng Resend API; AI sử dụng Gemini API.'], 1.4, 4.78, 10.6, 0.42, { size: 12.5 });
}, 'Kiến trúc hệ thống được chia theo các lớp rõ ràng. Frontend Next.js gọi API NestJS, backend xử lý nghiệp vụ và lưu PostgreSQL. Phần AI gồm Gemini và Recommendation Service để gợi ý món ăn.');

standardSlide(7, 'Cơ sở dữ liệu ERD', 'Các bảng chính phục vụ người dùng, công thức, tủ lạnh, thực đơn, mua sắm và đánh giá.', s => {
  card(s, 0.55, 1.25, 8.35, 5.55, '');
  addImageContain(s, img.erd, 0.7, 1.42, 8.05, 5.25);
  card(s, 9.15, 1.25, 3.55, 5.55, 'Các bảng chính');
  bulletList(s, ['Users: tài khoản và hồ sơ.', 'Recipes: công thức món ăn.', 'Meal Plans: thực đơn ngày/tuần.', 'Inventory: nguyên liệu tủ lạnh.', 'Shopping Lists: danh sách mua sắm.', 'Ratings: đánh giá và bình luận.'], 9.45, 1.9, 3.0, 4.5, { size: 12.7, space: 5 });
}, 'ERD thể hiện các nhóm bảng cốt lõi của hệ thống. Users liên kết với hồ sơ, tủ lạnh, thực đơn, mua sắm và đánh giá. Các bảng trung gian như Recipe Ingredients và Meal Plan Items giúp chuẩn hóa quan hệ nhiều nhiều.');

standardSlide(8, 'Thuật toán gợi ý món ăn', 'Kết hợp lọc luật nghiệp vụ và chấm điểm để chọn món phù hợp nhất.', s => {
  card(s, 0.8, 1.35, 5.6, 2.35, 'Tầng 1 - Rule-Based Filtering');
  bulletList(s, ['Lọc dị ứng và hồ sơ sức khỏe.', 'Không gợi ý bữa/ngày đã qua.', 'Tránh trùng món trong cùng bữa/ngày.', 'Lọc theo thời gian nấu và nguyên liệu.'], 1.1, 1.95, 5.0, 1.25, { size: 12.4 });
  card(s, 6.95, 1.35, 5.6, 2.35, 'Tầng 2 - Scoring-Based Ranking');
  bulletList(s, ['Ingredient Match.', 'Nutrition/TDEE Fit.', 'Preference Match.', 'Waste Reduction.'], 7.25, 1.95, 5.0, 1.25, { size: 12.4 });
  card(s, 1.15, 4.45, 11.0, 0.85, '');
  s.addText('Final Score = w1×Ingredient + w2×Nutrition + w3×Preference + w4×Waste Reduction − Penalty', { x: 1.4, y: 4.76, w: 10.5, h: 0.17, fontSize: 14, bold: true, color: C.dark, align: 'center', margin: 0, fit: 'shrink' });
}, 'Recommendation Engine có hai tầng. Tầng đầu lọc những món không phù hợp như dị ứng, sức khỏe, bữa đã qua hoặc món trùng. Tầng hai chấm điểm để ưu tiên món phù hợp nguyên liệu, TDEE, sở thích và giảm lãng phí.');

standardSlide(9, 'Meal Planner', 'Lập thực đơn ngày/tuần, theo dõi kcal từng bữa và khóa thao tác với bữa đã qua.', s => {
  card(s, 0.55, 1.25, 8.15, 5.55, '');
  addImageCover(s, img.planner, 0.72, 1.43, 7.8, 5.15);
  card(s, 9.0, 1.25, 3.65, 5.55, 'Nghiệp vụ chính');
  bulletList(s, ['Lập thực đơn theo ngày/tuần.', 'AI gợi ý món theo bữa.', 'Hiển thị kcal từng bữa và cả ngày.', 'Khóa bữa/ngày đã qua, chỉ xem lại.'], 9.3, 1.9, 3.05, 2.1, { size: 12.8 });
  s.addShape(pptx.ShapeType.roundRect, { x: 9.3, y: 4.45, w: 3.05, h: 1.2, rectRadius: 0.08, fill: { color: 'FFF8E8' }, line: { color: 'F3C46D' } });
  s.addText('Calories so sánh theo 1 khẩu phần/người.\nSố người ăn dùng để quy đổi nguyên liệu và mua sắm.', { x: 9.48, y: 4.74, w: 2.72, h: 0.48, fontSize: 10.2, bold: true, color: '7A5100', margin: 0, fit: 'shrink' });
}, 'Ở Meal Planner, người dùng xem thực đơn theo ngày và từng bữa. AI gợi ý món dựa trên hồ sơ và mục tiêu năng lượng. Một điểm quan trọng là TDEE là mục tiêu cá nhân, còn số người ăn chỉ dùng để quy đổi nguyên liệu.');

standardSlide(10, 'Chatbot MealAI', 'Chatbot hỗ trợ thao tác nhanh và đồng bộ lại giao diện sau khi thêm, xóa, đổi món.', s => {
  card(s, 0.55, 1.25, 7.7, 5.55, '');
  addImageCover(s, img.planner, 0.72, 1.43, 7.35, 5.15);
  // Chatbot overlay to make the workflow visible even when the source capture has no open panel.
  s.addShape(pptx.ShapeType.roundRect, { x: 5.55, y: 2.05, w: 2.25, h: 3.35, rectRadius: 0.12, fill: { color: '102033' }, line: { color: C.green, width: 1.2 } });
  s.addText('Trợ lý MealAI', { x: 5.72, y: 2.25, w: 1.9, h: 0.18, fontSize: 10, bold: true, color: C.white, margin: 0 });
  s.addShape(pptx.ShapeType.roundRect, { x: 5.72, y: 2.68, w: 1.7, h: 0.42, rectRadius: 0.06, fill: { color: '183B5C' }, line: { color: '183B5C' } });
  s.addText('xóa các món tối mai', { x: 5.85, y: 2.82, w: 1.44, h: 0.1, fontSize: 6.5, color: C.white, margin: 0 });
  s.addShape(pptx.ShapeType.roundRect, { x: 5.72, y: 3.28, w: 1.9, h: 0.68, rectRadius: 0.06, fill: { color: 'EAF8F1' }, line: { color: 'EAF8F1' } });
  s.addText('Đã xóa 2 món khỏi bữa Tối ngày Thứ Sáu.', { x: 5.86, y: 3.45, w: 1.62, h: 0.25, fontSize: 6.2, color: C.text, margin: 0, fit: 'shrink' });
  card(s, 8.6, 1.25, 4.1, 5.55, 'Khả năng hỗ trợ');
  bulletList(s, ['Nhận yêu cầu tiếng Việt.', 'Thêm, xóa, đổi món.', 'Tạo thực đơn và mua sắm.', 'Đồng bộ Meal Planner sau thao tác.'], 8.9, 1.9, 3.45, 1.9, { size: 12.8 });
  s.addShape(pptx.ShapeType.roundRect, { x: 8.9, y: 4.5, w: 3.45, h: 0.75, rectRadius: 0.08, fill: { color: C.mint }, line: { color: C.border } });
  s.addText('Ví dụ: “Đã xóa 2 món khỏi bữa Tối ngày Thứ Sáu.”', { x: 9.08, y: 4.77, w: 3.08, h: 0.12, fontSize: 9.5, bold: true, color: C.green, margin: 0, fit: 'shrink' });
}, 'Chatbot giúp thao tác nhanh bằng tiếng Việt, ví dụ xóa toàn bộ món trong một bữa hoặc tạo thực đơn. Sau khi chatbot thực hiện hành động, Meal Planner được cập nhật lại ngay nên người dùng không cần tải lại trang.');

standardSlide(11, 'Tủ lạnh và danh sách mua sắm', 'Nguyên liệu có sẵn được trừ khi tạo danh sách mua sắm từ thực đơn.', s => {
  card(s, 0.55, 1.25, 6.1, 4.35, 'Danh sách mua sắm');
  addImageCover(s, img.shopping, 0.75, 1.82, 5.7, 3.45);
  card(s, 6.9, 1.25, 5.85, 4.35, 'Tủ lạnh thông minh');
  addImageCover(s, img.fridge, 7.1, 1.82, 5.45, 3.45);
  bulletList(s, ['Quản lý nguyên liệu, số lượng và hạn sử dụng.', 'Tự động tổng hợp nguyên liệu từ thực đơn.', 'Trừ nguyên liệu đã có trong tủ lạnh.', 'Quy đổi nguyên liệu theo số người ăn.'], 1.0, 5.93, 11.5, 0.7, { size: 12.4 });
}, 'Hai chức năng này liên kết trực tiếp với thực đơn. Khi tạo danh sách mua sắm, hệ thống tổng hợp nguyên liệu cần nấu, nhân theo số người ăn và trừ phần đã có trong tủ lạnh.');

standardSlide(12, 'Dinh dưỡng & AI Insights', 'Theo dõi calories và macro theo tuần, có mục tiêu từ TDEE của người dùng.', s => {
  card(s, 0.55, 1.25, 8.2, 5.55, '');
  addImageCover(s, img.nutrition, 0.75, 1.43, 7.8, 5.15);
  card(s, 9.05, 1.25, 3.65, 5.55, 'Theo dõi');
  bulletList(s, ['Calories, protein, carbs, fat.', 'So sánh với TDEE cá nhân.', 'Mục tiêu theo ngày/tuần.', 'AI Insights cảnh báo và đề xuất.'], 9.35, 1.9, 3.0, 1.9, { size: 12.8 });
  s.addShape(pptx.ShapeType.roundRect, { x: 9.35, y: 4.42, w: 3.0, h: 1.15, rectRadius: 0.08, fill: { color: C.mint }, line: { color: C.border } });
  s.addText('Protein = TDEE×15%/4\nCarbs = TDEE×55%/4\nFat = TDEE×30%/9', { x: 9.55, y: 4.65, w: 2.6, h: 0.45, fontSize: 9.7, bold: true, color: C.dark, margin: 0, fit: 'shrink' });
}, 'Trang dinh dưỡng giúp người dùng thấy mức ăn trong tuần so với mục tiêu. Calories và macro được tính từ TDEE cá nhân. AI Insights hỗ trợ cảnh báo khi thiếu hoặc vượt mục tiêu.');

standardSlide(13, 'Quản trị hệ thống', 'Admin sử dụng giao diện riêng để quản lý dữ liệu, duyệt công thức và xử lý cảnh báo.', s => {
  card(s, 0.55, 1.25, 8.35, 5.55, '');
  addImageCover(s, img.admin, 0.75, 1.43, 7.95, 5.15);
  card(s, 9.2, 1.25, 3.5, 5.55, 'Chức năng admin');
  bulletList(s, ['Giao diện quản trị riêng.', 'Quản lý người dùng và công thức.', 'Duyệt công thức chia sẻ.', 'Xử lý cảnh báo đánh giá/bình luận.'], 9.5, 1.9, 2.85, 1.9, { size: 12.7 });
  s.addShape(pptx.ShapeType.roundRect, { x: 9.5, y: 4.4, w: 2.85, h: 1.1, rectRadius: 0.08, fill: { color: 'FFF1F1' }, line: { color: 'F4B3B3' } });
  s.addText('Nội dung vi phạm được che thành “Nội dung không phù hợp”. Admin xem nội dung gốc để xóa hoặc bỏ qua.', { x: 9.68, y: 4.65, w: 2.48, h: 0.42, fontSize: 9.4, bold: true, color: '8A2020', margin: 0, fit: 'shrink' });
}, 'Admin có giao diện riêng và không dùng menu của người dùng thường. Ngoài quản lý user và công thức, admin còn xử lý các cảnh báo nội dung. Nội dung vi phạm không hiển thị công khai mà được che lại.');

standardSlide(14, 'Kết quả đạt được và hướng phát triển', 'Hệ thống đã hoàn thiện các chức năng chính và triển khai web thực tế.', s => {
  card(s, 0.7, 1.35, 5.9, 4.8, 'Kết quả đạt được');
  bulletList(s, ['Hoàn thiện website MealAI và triển khai online.', 'Có AI gợi ý, chatbot và Recommendation Engine.', 'Hỗ trợ thực đơn, tủ lạnh, mua sắm, dinh dưỡng.', 'Có quản trị, duyệt công thức và cảnh báo nội dung.'], 1.0, 1.98, 5.25, 2.25, { size: 13.2 });
  metric(s, 1.05, 4.95, 1.5, 0.55, 'chức năng', '8');
  metric(s, 2.85, 4.95, 1.5, 0.55, 'gợi ý món', '2 tầng');
  metric(s, 4.65, 4.95, 1.5, 0.55, 'triển khai', 'Online');
  card(s, 6.9, 1.35, 5.75, 4.8, 'Hướng phát triển');
  bulletList(s, ['Phát triển mobile app.', 'OCR nhận diện nguyên liệu từ hình ảnh.', 'Mở rộng dữ liệu món ăn, dinh dưỡng Việt Nam.', 'Cải tiến thuật toán bằng Machine Learning.'], 7.2, 1.98, 5.1, 2.25, { size: 13.2 });
  s.addText('Chuyển sang demo hệ thống MealAI', { x: 3.0, y: 6.55, w: 7.4, h: 0.25, fontSize: 17, bold: true, color: C.green, align: 'center', margin: 0 });
}, 'Phần này tổng kết kết quả chính: hệ thống đã triển khai online và có đầy đủ các chức năng cốt lõi. Hướng phát triển tập trung vào mobile, OCR, dữ liệu dinh dưỡng Việt Nam và cải tiến thuật toán AI.');

standardSlide(15, 'Demo hệ thống MealAI', 'Chuyển từ phần trình bày sang thao tác trực tiếp trên website MealAI.', s => {
  card(s, 0.9, 1.35, 8.1, 4.95, 'Kịch bản demo');
  bulletList(s, ['Đăng nhập và hồ sơ TDEE.', 'Lập thực đơn và AI gợi ý.', 'Chatbot MealAI.', 'Tủ lạnh và danh sách mua sắm.', 'Dinh dưỡng & AI Insights.', 'Quản trị hệ thống.'], 1.25, 2.05, 6.8, 3.4, { size: 16, space: 7 });
  card(s, 9.55, 1.35, 2.65, 4.95, 'Quét demo');
  addImageContain(s, img.qr, 10.08, 2.25, 1.55, 1.55);
  s.addText('mealai-two.vercel.app', { x: 9.85, y: 4.2, w: 2.0, h: 0.2, fontSize: 9, bold: true, color: C.green, align: 'center', margin: 0 });
  s.addText('Em xin cảm ơn quý thầy cô đã lắng nghe!', { x: 2.2, y: 6.55, w: 8.9, h: 0.28, fontSize: 18, bold: true, color: C.dark, align: 'center', margin: 0 });
}, 'Đến phần demo, em sẽ thao tác trực tiếp trên website. Em đi theo luồng từ đăng nhập, hồ sơ TDEE, lập thực đơn, chatbot, mua sắm, dinh dưỡng và cuối cùng là trang admin. Em xin cảm ơn thầy cô.');

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  if (fs.existsSync(pptxPath)) {
    const backup = path.join(outDir, `MealAI_BaoVe_DoAn_NguyenNhutHoa.backup-${Date.now()}.pptx`);
    fs.copyFileSync(pptxPath, backup);
    console.log(`Backup created: ${backup}`);
  }

  await pptx.writeFile({ fileName: pptxPath });

  // Best-effort PDF export through PowerPoint if it is installed on Windows.
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
  if (pdf.status !== 0) {
    console.warn(`PDF export skipped or failed:\n${pdf.stdout}\n${pdf.stderr}`);
  } else {
    console.log(`PDF exported: ${pdfPath}`);
  }

  console.log(`PPTX exported: ${pptxPath}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
