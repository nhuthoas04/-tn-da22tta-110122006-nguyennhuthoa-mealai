const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const { imageSize } = require('image-size');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'slides');
const outFile = path.join(outDir, 'MealAI_BaoVe_DoAn_NguyenNhutHoa.pptx');

const C = {
  green: '007A4D',
  greenDark: '005D3B',
  mint: 'EAFBF3',
  mint2: 'F4FFF9',
  blue: '0F5C9F',
  orange: 'F59E0B',
  gray: '52645F',
  text: '10231F',
  line: '9FE7C4',
  lightLine: 'D9F3E7',
  white: 'FFFFFF',
};

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Nguyen Nhut Hoa';
pptx.company = 'Tra Vinh University';
pptx.subject = 'MealAI thesis defense slides';
pptx.title = 'MealAI - Bao ve do an tot nghiep';
pptx.lang = 'vi-VN';
pptx.theme = {
  headFontFace: 'Arial',
  bodyFontFace: 'Arial',
  lang: 'vi-VN',
};
pptx.defineLayout({ name: 'CUSTOM_WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'CUSTOM_WIDE';
pptx.margin = 0;
pptx.slideWidth = 13.333;
pptx.slideHeight = 7.5;

const SLIDE_W = 13.333;
const SLIDE_H = 7.5;

const img = (p) => path.join(root, p);
const asset = {
  architecture: img('assets/kien-truc-tong-the-he-thong-mealai.png'),
  deploy: img('assets/mo-hinh-trien-khai-he-thong-mealai.png'),
  recommendation: img('assets/quy-trinh-goi-y-mon-an-mealai.png'),
  auth: img('assets/quy-trinh-xac-thuc-phan-quyen-mealai.png'),
  erd: img('slide7_database_erd.png'),
};

function exists(file) {
  return file && fs.existsSync(file);
}

function addBg(slide) {
  slide.background = { color: 'FFFFFF' };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: SLIDE_W, h: 0.12, fill: { color: C.green }, line: { color: C.green } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: SLIDE_H - 0.12, w: SLIDE_W, h: 0.12, fill: { color: C.greenDark }, line: { color: C.greenDark } });
  slide.addShape(pptx.ShapeType.arc, { x: 11.65, y: -0.35, w: 1.3, h: 1.3, adjustPoint: 0.35, line: { color: C.lightLine, transparency: 40, width: 1.3 } });
  slide.addShape(pptx.ShapeType.arc, { x: -0.45, y: 6.25, w: 1.3, h: 1.3, adjustPoint: 0.35, line: { color: C.lightLine, transparency: 40, width: 1.3 } });
}

function addFooter(slide, page) {
  slide.addText('Đồ án tốt nghiệp ngành Công nghệ thông tin - 2026', {
    x: 0.25, y: 7.18, w: 5.8, h: 0.18, fontSize: 6.8, color: 'E8FFF5', bold: true,
  });
  slide.addText(`MealAI - Nguyễn Nhựt Hóa  |  ${page}`, {
    x: 8.4, y: 7.18, w: 4.55, h: 0.18, fontSize: 6.8, color: 'E8FFF5', bold: true, align: 'right',
  });
}

function addHeader(slide, title, subtitle) {
  slide.addText(title, {
    x: 0.55, y: 0.34, w: 12.25, h: 0.44,
    fontSize: 22, bold: true, color: C.greenDark, margin: 0,
    breakLine: false,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.58, y: 0.84, w: 11.9, h: 0.25,
      fontSize: 9.5, color: C.gray, margin: 0,
    });
  }
  slide.addShape(pptx.ShapeType.line, { x: 0.55, y: 1.18, w: 12.25, h: 0, line: { color: C.line, width: 1.2 } });
}

function addCard(slide, x, y, w, h, title, opts = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.08,
    fill: { color: opts.fill || C.mint2 },
    line: { color: opts.line || C.line, width: opts.lineWidth || 1 },
    shadow: opts.shadow === false ? undefined : { type: 'outer', color: 'CFEFE0', opacity: 0.18, blur: 2, angle: 45, distance: 1 },
  });
  if (title) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.12, y: y + 0.12, w: Math.min(w - 0.24, Math.max(1.65, title.length * 0.12)), h: 0.32,
      fill: { color: opts.titleColor || C.green },
      line: { color: opts.titleColor || C.green },
      rectRadius: 0.06,
    });
    slide.addText(title, {
      x: x + 0.25, y: y + 0.185, w: w - 0.5, h: 0.18,
      fontSize: opts.titleSize || 10.5, bold: true, color: C.white, margin: 0,
    });
  }
}

function addBullets(slide, items, x, y, w, opts = {}) {
  const lineH = opts.lineH || 0.32;
  items.forEach((item, i) => {
    const yy = y + i * lineH;
    slide.addText(opts.marker || '•', {
      x, y: yy + 0.02, w: 0.16, h: 0.18, fontSize: opts.fontSize || 10.5,
      color: opts.markerColor || C.green, bold: true, margin: 0,
    });
    slide.addText(item, {
      x: x + 0.23, y: yy, w: w - 0.23, h: lineH,
      fontSize: opts.fontSize || 10.5, color: opts.color || C.text,
      bold: opts.bold || false, margin: 0.01, fit: 'shrink',
      breakLine: false,
    });
  });
}

function addMiniMetric(slide, x, y, w, label, value, color = C.green) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h: 0.62, fill: { color: 'F3FFF8' }, line: { color: C.lightLine }, rectRadius: 0.08,
  });
  slide.addText(value, { x, y: y + 0.09, w, h: 0.22, align: 'center', fontSize: 13, bold: true, color, margin: 0 });
  slide.addText(label, { x: x + 0.05, y: y + 0.34, w: w - 0.1, h: 0.16, align: 'center', fontSize: 6.8, bold: true, color: C.gray, margin: 0, fit: 'shrink' });
}

function addImageContain(slide, file, x, y, w, h, opts = {}) {
  if (!exists(file)) {
    slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, fill: { color: 'F5FAF7' }, line: { color: C.lightLine } });
    slide.addText('Chèn hình demo hệ thống', { x, y: y + h / 2 - 0.15, w, h: 0.3, align: 'center', color: C.gray, fontSize: 12 });
    return;
  }
  const dim = imageSize(file);
  const ratio = dim.width / dim.height;
  let iw = w;
  let ih = iw / ratio;
  if (ih > h) {
    ih = h;
    iw = ih * ratio;
  }
  const ix = x + (w - iw) / 2;
  const iy = y + (h - ih) / 2;
  if (opts.frame) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x, y, w, h,
      fill: { color: C.white },
      line: { color: opts.frameColor || C.lightLine, width: 1 },
      rectRadius: 0.08,
    });
  }
  slide.addImage({ path: file, x: ix, y: iy, w: iw, h: ih });
}

function addPill(slide, x, y, text, color = C.green) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 1.55, h: 0.3, fill: { color: 'F1FFF8' }, line: { color: C.lightLine }, rectRadius: 0.06,
  });
  slide.addText(text, { x: x + 0.04, y: y + 0.075, w: 1.47, h: 0.12, align: 'center', fontSize: 7.4, bold: true, color, margin: 0, fit: 'shrink' });
}

function newSlide(title, subtitle, page) {
  const slide = pptx.addSlide();
  addBg(slide);
  addHeader(slide, title, subtitle);
  addFooter(slide, page);
  return slide;
}

// 1. Cover
{
  const slide = pptx.addSlide();
  addBg(slide);
  slide.addText('ĐỒ ÁN TỐT NGHIỆP - NGÀNH CÔNG NGHỆ THÔNG TIN', {
    x: 0.65, y: 0.45, w: 12, h: 0.26, fontSize: 10.5, bold: true, color: C.blue, align: 'center',
  });
  slide.addText('XÂY DỰNG HỆ THỐNG GỢI Ý LẬP THỰC ĐƠN\nVÀ NẤU ĂN CHO GIA ĐÌNH TÍCH HỢP AI', {
    x: 0.75, y: 1.0, w: 11.85, h: 1.35, fontSize: 27, bold: true, color: C.greenDark, align: 'center',
    fit: 'shrink', margin: 0,
  });
  slide.addText('Hệ thống hỗ trợ lập thực đơn, quản lý nguyên liệu, tạo danh sách mua sắm và phân tích dinh dưỡng bằng AI.', {
    x: 1.1, y: 2.55, w: 11.1, h: 0.3, fontSize: 13, color: C.gray, align: 'center',
  });
  addCard(slide, 1.35, 3.25, 10.65, 1.35, '', { fill: 'F3FFF8' });
  slide.addText([
    { text: 'Sinh viên thực hiện: ', options: { bold: true } }, { text: 'Nguyễn Nhựt Hóa     ' },
    { text: 'MSSV: ', options: { bold: true } }, { text: '110122006     ' },
    { text: 'Lớp: ', options: { bold: true } }, { text: 'DA22TTA' },
  ], { x: 1.85, y: 3.55, w: 9.65, h: 0.3, fontSize: 12.5, color: C.text, align: 'center' });
  slide.addText([
    { text: 'GVHD: ', options: { bold: true } }, { text: 'ThS. Dương Ngọc Vân Khanh     ' },
    { text: 'Đơn vị: ', options: { bold: true } }, { text: 'Đại học Trà Vinh - Trường Kỹ thuật và Công nghệ' },
  ], { x: 1.85, y: 4.05, w: 9.65, h: 0.3, fontSize: 12.2, color: C.text, align: 'center', fit: 'shrink' });
  addMiniMetric(slide, 2.2, 5.15, 2.1, 'chức năng chính', '8', C.green);
  addMiniMetric(slide, 4.6, 5.15, 2.1, 'tầng gợi ý món', '2', C.orange);
  addMiniMetric(slide, 7.0, 5.15, 2.1, 'triển khai web', 'Online', C.blue);
  addMiniMetric(slide, 9.4, 5.15, 2.1, 'AI hỗ trợ', 'Gemini', C.green);
  addFooter(slide, 1);
  slide.addNotes('Kính chào quý thầy cô. Em là Nguyễn Nhựt Hóa, hôm nay em trình bày đồ án MealAI - hệ thống gợi ý lập thực đơn và nấu ăn cho gia đình tích hợp AI.');
}

// 2. Problem
{
  const slide = newSlide('1. Bài Toán Đặt Ra', 'MealAI giải quyết nhu cầu lập thực đơn gia đình theo nguyên liệu, sức khỏe và dinh dưỡng.', 2);
  addCard(slide, 0.7, 1.45, 3.85, 4.9, 'Khó khăn hiện tại');
  addBullets(slide, [
    'Khó chọn món ăn phù hợp mỗi ngày.',
    'Dễ mất cân bằng calories và dinh dưỡng.',
    'Không theo dõi tốt nguyên liệu sắp hết hạn.',
    'Danh sách mua sắm thường làm thủ công.',
    'Thiếu công cụ cá nhân hóa theo sở thích và sức khỏe.',
  ], 0.98, 2.05, 3.25, { fontSize: 12, lineH: 0.54 });
  addCard(slide, 4.8, 1.45, 3.85, 4.9, 'Giải pháp MealAI');
  addBullets(slide, [
    'Gợi ý món ăn bằng rule-based và scoring-based.',
    'Lập thực đơn ngày/tuần theo số người ăn.',
    'Tạo danh sách mua sắm tự động.',
    'Theo dõi TDEE, calories và macro.',
    'Chatbot hỗ trợ thao tác nhanh trên thực đơn.',
  ], 5.08, 2.05, 3.25, { fontSize: 12, lineH: 0.54 });
  addCard(slide, 8.9, 1.45, 3.65, 4.9, 'Giá trị mang lại');
  addMiniMetric(slide, 9.25, 2.0, 2.95, 'tiết kiệm thời gian lên thực đơn', 'Nhanh hơn', C.green);
  addMiniMetric(slide, 9.25, 2.95, 2.95, 'giảm lãng phí thực phẩm', 'Tối ưu', C.orange);
  addMiniMetric(slide, 9.25, 3.9, 2.95, 'theo dõi sức khỏe cá nhân', 'TDEE', C.blue);
  addMiniMetric(slide, 9.25, 4.85, 2.95, 'hỗ trợ gia đình sử dụng hằng ngày', 'Thực tế', C.green);
  slide.addNotes('Ở phần bài toán, em tập trung vào bốn vấn đề chính: chọn món, cân bằng dinh dưỡng, quản lý nguyên liệu và mua sắm. MealAI gom các thao tác đó vào một hệ thống web.');
}

// 3. Goals
{
  const slide = newSlide('2. Mục Tiêu Đề Tài', 'Xây dựng website MealAI phục vụ người dùng gia đình và quản trị nội dung.', 3);
  const goals = [
    ['Quản lý công thức', 'Xem, tìm kiếm, lọc, đánh giá và chia sẻ món ăn.'],
    ['Gợi ý món ăn', 'Đề xuất theo nguyên liệu, sở thích, sức khỏe và TDEE.'],
    ['Lập thực đơn', 'Tạo thực đơn ngày/tuần, tránh trùng món và khóa bữa đã qua.'],
    ['Tủ lạnh thông minh', 'Theo dõi nguyên liệu, số lượng và hạn sử dụng.'],
    ['Mua sắm tự động', 'Tổng hợp nguyên liệu còn thiếu từ thực đơn.'],
    ['Dinh dưỡng & AI Insights', 'Theo dõi calories, protein, carbs, fat và mục tiêu.'],
  ];
  goals.forEach((g, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.75 + col * 4.15;
    const y = 1.55 + row * 2.05;
    addCard(slide, x, y, 3.75, 1.45, '');
    slide.addText(String(i + 1), { x: x + 0.2, y: y + 0.28, w: 0.38, h: 0.34, fontSize: 13, bold: true, color: C.white, align: 'center', margin: 0, fill: { color: C.green }, shape: pptx.ShapeType.ellipse });
    slide.addText(g[0], { x: x + 0.75, y: y + 0.28, w: 2.75, h: 0.22, fontSize: 13, bold: true, color: C.greenDark, margin: 0 });
    slide.addText(g[1], { x: x + 0.75, y: y + 0.62, w: 2.72, h: 0.5, fontSize: 10.5, color: C.gray, fit: 'shrink' });
  });
  addCard(slide, 1.15, 5.78, 11.05, 0.68, '', { fill: 'FFF9E8', line: 'F6D986', shadow: false });
  slide.addText('Điểm nhấn: MealAI không chỉ lưu món ăn mà còn liên kết thực đơn, tủ lạnh, mua sắm, TDEE và chatbot AI vào một quy trình thống nhất.', {
    x: 1.45, y: 5.98, w: 10.45, h: 0.22, fontSize: 11.2, bold: true, color: '6B4B00', align: 'center',
  });
  slide.addNotes('Mục tiêu không dừng ở trang công thức, mà liên kết nhiều nghiệp vụ: công thức, thực đơn, tủ lạnh, mua sắm và phân tích dinh dưỡng.');
}

// 4. Scope / Users
{
  const slide = newSlide('3. Phạm Vi Và Đối Tượng Sử Dụng', 'Hệ thống tập trung vào người dùng gia đình và tài khoản quản trị.', 4);
  addCard(slide, 0.75, 1.55, 5.85, 4.95, 'Người dùng');
  addBullets(slide, [
    'Đăng ký, đăng nhập và xác thực email.',
    'Cập nhật hồ sơ sức khỏe, TDEE và số người ăn.',
    'Tạo thực đơn theo ngày/tuần.',
    'Quản lý tủ lạnh và danh sách mua sắm.',
    'Đánh giá, bình luận và yêu thích công thức.',
  ], 1.05, 2.1, 5.15, { fontSize: 12.2, lineH: 0.56 });
  addCard(slide, 6.95, 1.55, 5.65, 4.95, 'Quản trị viên');
  addBullets(slide, [
    'Quản lý người dùng và dữ liệu công thức.',
    'Duyệt công thức người dùng chia sẻ.',
    'Theo dõi cảnh báo đánh giá/bình luận vi phạm.',
    'Quản lý thông báo hệ thống.',
    'Kiểm soát nội dung để đảm bảo an toàn cộng đồng.',
  ], 7.25, 2.1, 4.95, { fontSize: 12.2, lineH: 0.56 });
  slide.addNotes('Phạm vi sử dụng gồm hai nhóm: người dùng gia đình và quản trị viên. Vì vậy hệ thống có phân quyền rõ ràng giữa giao diện user và admin.');
}

// 5. Features
{
  const slide = newSlide('4. Chức Năng Chính Của Hệ Thống', '8 nhóm chức năng chính phục vụ quy trình từ chọn món đến mua sắm và kiểm duyệt.', 5);
  const features = [
    ['Quản lý người dùng', 'Tài khoản, hồ sơ và phân quyền.'],
    ['Quản lý công thức', 'Tìm kiếm, đánh giá và chia sẻ.'],
    ['AI Assistant', 'Gợi ý món và chatbot MealAI.'],
    ['Lập thực đơn', 'Ngày/tuần, thêm đổi xóa món.'],
    ['Tủ lạnh thông minh', 'Số lượng và hạn sử dụng.'],
    ['Danh sách mua sắm', 'Tự động tổng hợp nguyên liệu.'],
    ['Dinh dưỡng & AI Insights', 'TDEE, calories và macro.'],
    ['Quản trị hệ thống', 'Duyệt nội dung và cảnh báo.'],
  ];
  features.forEach((f, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = 0.62 + col * 3.1;
    const y = 1.58 + row * 2.05;
    addCard(slide, x, y, 2.75, 1.46, '');
    slide.addText(['👤','📘','🤖','📅','🧊','🛒','📊','🛡️'][i], {
      x: x + 0.16, y: y + 0.27, w: 0.42, h: 0.28, fontSize: 18, margin: 0,
    });
    slide.addText(f[0], { x: x + 0.72, y: y + 0.28, w: 1.78, h: 0.22, fontSize: 10.7, bold: true, color: C.greenDark, margin: 0, fit: 'shrink' });
    slide.addText(f[1], { x: x + 0.72, y: y + 0.64, w: 1.72, h: 0.38, fontSize: 8.3, color: C.gray, margin: 0.01, fit: 'shrink' });
  });
  addCard(slide, 1.0, 5.65, 11.35, 0.85, '', { fill: 'F3FFF8' });
  slide.addText('Luồng chính: Hồ sơ người dùng → Gợi ý món → Lập thực đơn → Tạo mua sắm → Theo dõi dinh dưỡng → Quản trị kiểm duyệt', {
    x: 1.35, y: 5.92, w: 10.65, h: 0.26, fontSize: 12, bold: true, color: C.greenDark, align: 'center',
  });
  slide.addNotes('Đây là slide tóm tắt nhanh các module chính. Khi demo, em sẽ đi theo đúng luồng: hồ sơ, thực đơn, AI, mua sắm, dinh dưỡng và admin.');
}

// 6. Architecture
{
  const slide = newSlide('5. Kiến Trúc Hệ Thống', 'Frontend Next.js giao tiếp Backend NestJS API, lưu dữ liệu PostgreSQL và tích hợp AI.', 6);
  addImageContain(slide, exists(asset.architecture) ? asset.architecture : asset.deploy, 0.75, 1.35, 7.55, 5.25, { frame: true });
  addCard(slide, 8.55, 1.35, 4.0, 5.25, 'Thành phần chính');
  addBullets(slide, [
    'Frontend: Next.js, React, TypeScript, Tailwind CSS.',
    'Backend: NestJS, TypeORM, JWT, Passport.',
    'Database: PostgreSQL quản lý dữ liệu nghiệp vụ.',
    'AI: Gemini API và Recommendation Service.',
    'Deploy: Vercel cho frontend, Render cho backend.',
  ], 8.85, 1.95, 3.35, { fontSize: 11.4, lineH: 0.56 });
  addPill(slide, 8.95, 5.25, 'Next.js');
  addPill(slide, 10.65, 5.25, 'NestJS');
  addPill(slide, 8.95, 5.75, 'PostgreSQL');
  addPill(slide, 10.65, 5.75, 'Gemini AI');
  slide.addNotes('Kiến trúc gồm frontend Next.js, backend NestJS, cơ sở dữ liệu PostgreSQL và lớp AI. Frontend triển khai trên Vercel, backend và database trên Render.');
}

// 7. ERD
{
  const slide = newSlide('6. Cơ Sở Dữ Liệu ERD', 'Các bảng chính phục vụ người dùng, công thức, tủ lạnh, thực đơn, mua sắm và đánh giá.', 7);
  addImageContain(slide, asset.erd, 0.45, 1.32, 12.45, 5.82, { frame: true });
  slide.addNotes('Slide này trình bày ERD tổng quan. Các bảng trung tâm là Users, Recipes, Ingredients, Meal Plans, Shopping Lists, Ratings và các bảng phụ như xác thực, chatbot, phân tích dinh dưỡng.');
}

// 8. Recommendation
{
  const slide = newSlide('7. Thuật Toán Gợi Ý Món Ăn', 'Kết hợp lọc luật nghiệp vụ và chấm điểm để chọn món phù hợp nhất.', 8);
  addImageContain(slide, asset.recommendation, 0.65, 1.35, 5.8, 5.1, { frame: true });
  addCard(slide, 6.75, 1.35, 5.75, 2.05, 'Tầng 1 - Rule-Based Filtering');
  addBullets(slide, [
    'Loại món vi phạm dị ứng hoặc sức khỏe.',
    'Không gợi ý vào bữa/ngày đã qua.',
    'Tránh trùng món trong cùng bữa/ngày.',
    'Lọc theo thời gian nấu, số người ăn và nguyên liệu.',
  ], 7.05, 1.93, 5.05, { fontSize: 10.7, lineH: 0.36 });
  addCard(slide, 6.75, 3.65, 5.75, 2.05, 'Tầng 2 - Scoring-Based Ranking');
  addBullets(slide, [
    'Ingredient Match: phù hợp nguyên liệu có sẵn.',
    'Nutrition Match: phù hợp TDEE và calories bữa ăn.',
    'Preference Match: sở thích và lịch sử người dùng.',
    'Waste Reduction: ưu tiên nguyên liệu sắp hết hạn.',
  ], 7.05, 4.23, 5.05, { fontSize: 10.7, lineH: 0.36 });
  addCard(slide, 6.75, 5.95, 5.75, 0.52, '', { fill: 'FFF9E8', line: 'F2CA6B', shadow: false });
  slide.addText('Điểm cuối = w1×Nguyên liệu + w2×Dinh dưỡng + w3×Sở thích + w4×Giảm lãng phí − Điểm phạt', {
    x: 6.93, y: 6.12, w: 5.38, h: 0.16, fontSize: 8.7, bold: true, color: '6B4B00', align: 'center', fit: 'shrink',
  });
  slide.addNotes('Phần thuật toán gồm hai tầng. Tầng lọc loại món không phù hợp. Tầng chấm điểm xếp hạng các món còn lại theo nguyên liệu, dinh dưỡng, sở thích và giảm lãng phí.');
}

// 9. Meal Planner
{
  const slide = newSlide('8. Meal Planner - Lập Thực Đơn', 'Tạo thực đơn ngày/tuần, theo dõi calories từng bữa và khóa thao tác với bữa đã qua.', 9);
  addCard(slide, 0.75, 1.45, 5.95, 4.9, 'Nghiệp vụ chính');
  addBullets(slide, [
    'Tạo thực đơn theo ngày hoặc theo tuần.',
    'AI Gợi Ý theo bữa: sáng, trưa, tối.',
    'Hiển thị kcal từng bữa và tổng kcal cả ngày.',
    'Không lặp món trong cùng bữa; hạn chế lặp 7 ngày.',
    'Ngày/bữa đã qua chỉ xem lại, không sửa.',
  ], 1.05, 2.08, 5.25, { fontSize: 12.2, lineH: 0.54 });
  addCard(slide, 7.05, 1.45, 5.55, 4.9, 'Điểm cải tiến');
  addMiniMetric(slide, 7.45, 2.05, 2.0, 'mục tiêu theo TDEE/người', 'TDEE', C.green);
  addMiniMetric(slide, 9.85, 2.05, 2.0, 'khóa bữa đã qua', 'Readonly', C.orange);
  addMiniMetric(slide, 7.45, 3.2, 2.0, 'không trùng cùng bữa', 'Unique', C.blue);
  addMiniMetric(slide, 9.85, 3.2, 2.0, 'tùy chọn AI rõ ràng', 'Options', C.green);
  slide.addText('Calories dùng để so sánh với mục tiêu là kcal trên 1 khẩu phần/người; số người ăn dùng để quy đổi nguyên liệu và danh sách mua sắm.', {
    x: 7.45, y: 4.75, w: 4.6, h: 0.58, fontSize: 11, color: C.gray, align: 'center', fit: 'shrink',
  });
  slide.addNotes('Khi demo Meal Planner, em nên nhấn mạnh bữa đã qua chỉ xem lại, calories so với TDEE là theo một người, còn số người ăn dùng cho nguyên liệu và shopping list.');
}

// 10. Chatbot
{
  const slide = newSlide('9. Chatbot MealAI', 'Chatbot hỗ trợ thao tác nhanh và đồng bộ lại giao diện sau khi thêm, xóa, đổi món.', 10);
  addCard(slide, 0.75, 1.45, 4.05, 4.9, 'Lệnh hỗ trợ');
  addBullets(slide, [
    'Tạo thực đơn hôm nay/ngày mai.',
    'Xóa một món hoặc toàn bộ bữa.',
    'Xóa toàn bộ thực đơn theo ngày.',
    'Thêm nguyên liệu vào tủ lạnh.',
    'Tạo danh sách mua sắm.',
  ], 1.05, 2.05, 3.35, { fontSize: 11.8, lineH: 0.52 });
  addCard(slide, 5.05, 1.45, 3.95, 4.9, 'Quy tắc an toàn');
  addBullets(slide, [
    'Nhận diện sáng/trưa/tối và ngày cụ thể.',
    'Không sửa bữa đã qua.',
    'Không báo sai bữa trống nếu bữa cũ có món.',
    'Refetch Meal Planner ngay sau thao tác.',
  ], 5.35, 2.05, 3.25, { fontSize: 11.6, lineH: 0.52 });
  addCard(slide, 9.25, 1.45, 3.25, 4.9, 'Ví dụ phản hồi');
  slide.addText('“Đã xóa 2 món khỏi bữa Tối ngày Thứ Sáu: Thịt kho trứng, Cá thu kho.”', {
    x: 9.55, y: 2.05, w: 2.6, h: 0.95, fontSize: 12.2, bold: true, color: C.greenDark, align: 'center',
  });
  slide.addShape(pptx.ShapeType.roundRect, { x: 9.55, y: 3.35, w: 2.6, h: 1.45, fill: { color: '102236' }, line: { color: '102236' }, rectRadius: 0.12 });
  slide.addText('Trợ lý MealAI\nAI thông minh đang trực tuyến', { x: 9.8, y: 3.67, w: 2.1, h: 0.5, fontSize: 11, bold: true, color: 'DFF8EF', align: 'center' });
  slide.addText('Gợi ý | Tạo thực đơn | Xóa món', { x: 9.78, y: 4.25, w: 2.15, h: 0.18, fontSize: 8.2, color: 'C6E5DB', align: 'center' });
  slide.addNotes('Chatbot là điểm demo dễ gây ấn tượng. Em có thể nhập ví dụ: xóa các món ở bữa tối ngày mai, hoặc tạo thực đơn hôm nay.');
}

// 11. Inventory and shopping
{
  const slide = newSlide('10. Tủ Lạnh Và Danh Sách Mua Sắm', 'Nguyên liệu có sẵn được trừ khi tạo danh sách mua sắm từ thực đơn.', 11);
  addCard(slide, 0.75, 1.45, 5.85, 4.95, 'Tủ lạnh thông minh');
  addBullets(slide, [
    'Quản lý nguyên liệu theo số lượng và đơn vị.',
    'Theo dõi ngày mua và hạn sử dụng.',
    'Ưu tiên dùng nguyên liệu sắp hết hạn.',
    'Dữ liệu tủ lạnh tham gia scoring gợi ý món.',
  ], 1.05, 2.1, 5.15, { fontSize: 12.2, lineH: 0.58 });
  addCard(slide, 6.95, 1.45, 5.65, 4.95, 'Danh sách mua sắm');
  addBullets(slide, [
    'Tạo tự động từ thực đơn đã chọn.',
    'Quy đổi nguyên liệu theo số người ăn.',
    'Trừ nguyên liệu đang có trong tủ lạnh.',
    'Cho phép đánh dấu đã mua và chia sẻ danh sách.',
  ], 7.25, 2.1, 4.95, { fontSize: 12.2, lineH: 0.58 });
  slide.addNotes('Điểm chính ở slide này là số người ăn ảnh hưởng tới nguyên liệu và shopping list, không nhân mục tiêu TDEE cá nhân.');
}

// 12. Nutrition
{
  const slide = newSlide('11. Dinh Dưỡng & AI Insights', 'Theo dõi calories và macro theo tuần, có đường mục tiêu từ TDEE của người dùng.', 12);
  addCard(slide, 0.7, 1.45, 4.0, 4.95, 'Chỉ số theo dõi');
  addBullets(slide, [
    'Calories theo ngày/tuần.',
    'Protein, Carbs, Fat theo mục tiêu.',
    'TDEE và mục tiêu giảm/cân bằng cân nặng.',
    'Phân bổ mục tiêu theo bữa: 30% - 40% - 30%.',
  ], 1.0, 2.05, 3.35, { fontSize: 11.7, lineH: 0.54 });
  addCard(slide, 4.95, 1.45, 3.7, 4.95, 'Công thức mục tiêu');
  slide.addText('Protein = TDEE × 15% / 4\nCarbs = TDEE × 55% / 4\nFat = TDEE × 30% / 9', {
    x: 5.25, y: 2.25, w: 3.1, h: 1.3, fontSize: 15, bold: true, color: C.greenDark, align: 'center', fit: 'shrink',
  });
  slide.addText('TDEE luôn là mục tiêu cá nhân của người dùng đang đăng nhập.', {
    x: 5.25, y: 4.15, w: 3.1, h: 0.55, fontSize: 11.2, color: C.gray, align: 'center',
  });
  addCard(slide, 8.9, 1.45, 3.65, 4.95, 'AI Insights');
  addMiniMetric(slide, 9.25, 2.05, 2.95, 'nhận diện thiếu hoặc vượt mục tiêu', 'Cảnh báo', C.orange);
  addMiniMetric(slide, 9.25, 3.05, 2.95, 'hỗ trợ điều chỉnh thực đơn', 'Gợi ý', C.green);
  addMiniMetric(slide, 9.25, 4.05, 2.95, 'tổng hợp báo cáo tuần', 'Phân tích', C.blue);
  slide.addNotes('Nội dung slide này giải thích vì sao hệ thống cần TDEE: AI không chỉ đếm số món mà còn xét calories còn lại của từng bữa.');
}

// 13. Admin
{
  const slide = newSlide('12. Quản Trị Hệ Thống', 'Admin sử dụng giao diện riêng, không hiển thị menu của người dùng thường.', 13);
  addCard(slide, 0.75, 1.45, 4.05, 4.9, 'Phân quyền');
  addBullets(slide, [
    'JWT chứa role: user hoặc admin.',
    'Admin tự chuyển về /admin sau đăng nhập.',
    'User thường không truy cập được API admin.',
    'Admin không dùng menu thực đơn, tủ lạnh, mua sắm.',
  ], 1.05, 2.05, 3.35, { fontSize: 11.6, lineH: 0.52 });
  addCard(slide, 5.05, 1.45, 3.95, 4.9, 'Quản lý');
  addBullets(slide, [
    'Người dùng.',
    'Công thức.',
    'Công thức chờ duyệt.',
    'Thông báo hệ thống.',
    'Cảnh báo đánh giá vi phạm.',
  ], 5.35, 2.05, 3.25, { fontSize: 11.8, lineH: 0.52 });
  addCard(slide, 9.25, 1.45, 3.25, 4.9, 'Kiểm duyệt');
  slide.addText('Đánh giá bình thường hiển thị ngay.\n\nNội dung vi phạm được che thành:\n“Nội dung không phù hợp”\n\nAdmin xem nội dung gốc để xóa hoặc bỏ qua.', {
    x: 9.55, y: 2.0, w: 2.65, h: 2.2, fontSize: 11.2, color: C.text, align: 'center', fit: 'shrink',
  });
  slide.addText('An toàn nội dung', { x: 9.67, y: 4.85, w: 2.4, h: 0.35, fontSize: 14, bold: true, color: C.greenDark, align: 'center' });
  slide.addNotes('Admin là một phần quan trọng để bảo đảm hệ thống có thể vận hành thực tế, đặc biệt ở công thức chia sẻ và bình luận đánh giá.');
}

// 14. Results
{
  const slide = newSlide('13. Kết Quả Đạt Được', 'Hệ thống đã hoàn thiện các chức năng chính và triển khai web thực tế.', 14);
  addCard(slide, 0.75, 1.45, 12.0, 4.95, 'Kết quả chính');
  addBullets(slide, [
    'Hoàn thiện website MealAI và triển khai trực tuyến.',
    'Hỗ trợ lập thực đơn ngày/tuần theo nhu cầu gia đình.',
    'Gợi ý món theo nguyên liệu, sở thích, sức khỏe và TDEE.',
    'Tự động tạo danh sách mua sắm và trừ tủ lạnh.',
    'Theo dõi calories, protein, carbs, fat theo mục tiêu.',
    'Tích hợp xác thực email, quên mật khẩu bằng Resend.',
    'Quản trị người dùng, công thức và cảnh báo nội dung.',
  ], 1.1, 2.1, 5.45, { fontSize: 11.4, lineH: 0.43, marker: '✓', markerColor: C.green });
  addBullets(slide, [
    'Chatbot hỗ trợ thêm, đổi, xóa món và đồng bộ giao diện.',
    'Khóa thao tác với ngày/bữa đã qua, chỉ cho xem lại.',
    'Bộ lọc từ không phù hợp trong đánh giá và bình luận.',
    'Một người dùng chỉ có một đánh giá chính cho mỗi công thức.',
    'Shopping list quy đổi nguyên liệu theo số người ăn.',
    'Giao diện responsive trên desktop và mobile.',
  ], 6.8, 2.1, 5.45, { fontSize: 11.4, lineH: 0.43, marker: '✓', markerColor: C.green });
  addMiniMetric(slide, 2.0, 5.75, 2.2, 'nhóm chức năng', '8', C.green);
  addMiniMetric(slide, 4.85, 5.75, 2.2, 'tầng gợi ý món', '2', C.orange);
  addMiniMetric(slide, 7.7, 5.75, 2.2, 'triển khai thực tế', 'Online', C.blue);
  addMiniMetric(slide, 10.55, 5.75, 1.55, 'bảo mật', 'JWT', C.green);
  slide.addNotes('Khi trình bày kết quả, em nên nhấn mạnh hệ thống không chỉ là giao diện mẫu mà đã có backend, database, deploy, email và AI.');
}

// 15. Future / thanks
{
  const slide = newSlide('14. Hướng Phát Triển', 'Tiếp tục mở rộng dữ liệu, nâng cấp AI và cải thiện trải nghiệm người dùng.', 15);
  addCard(slide, 0.75, 1.45, 5.85, 4.95, 'Dữ liệu và AI');
  addBullets(slide, [
    'Mở rộng dữ liệu món ăn và dinh dưỡng Việt Nam.',
    'Tích hợp OCR nhận diện nguyên liệu từ hình ảnh.',
    'Nâng cấp thuật toán bằng Machine Learning.',
    'Cá nhân hóa sâu hơn theo sức khỏe và thói quen ăn uống.',
  ], 1.05, 2.1, 5.15, { fontSize: 12.2, lineH: 0.58 });
  addCard(slide, 6.95, 1.45, 5.65, 4.95, 'Nền tảng và vận hành');
  addBullets(slide, [
    'Phát triển ứng dụng mobile.',
    'Tăng cường bảo mật tài khoản và email.',
    'Tối ưu hiệu năng khi dữ liệu lớn hơn.',
    'Mở rộng khả năng chia sẻ thực đơn gia đình.',
  ], 7.25, 2.1, 4.95, { fontSize: 12.2, lineH: 0.58 });
  slide.addText('Em xin chân thành cảm ơn quý thầy cô đã lắng nghe!', {
    x: 1.25, y: 6.1, w: 10.85, h: 0.35, fontSize: 18, bold: true, color: C.greenDark, align: 'center',
  });
  slide.addNotes('Kết thúc phần trình bày, em cảm ơn thầy cô và sẵn sàng trả lời câu hỏi.');
}

fs.mkdirSync(outDir, { recursive: true });
pptx.writeFile({ fileName: outFile });

