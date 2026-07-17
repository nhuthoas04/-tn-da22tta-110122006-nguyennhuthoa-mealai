const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const sourceDir = 'D:\\khoa_luan_tn\\baocao\\docs\\poster';
const sourceHtml = path.join(sourceDir, 'poster_A1_chu_lon.html');

const repoPosterDir = path.join(root, 'docs', 'poster');
const repoHtml = path.join(repoPosterDir, 'poster_A1_chinh_sua.html');
const repoPdf = path.join(root, 'docs', 'poster.pdf');
const repoPng = path.join(root, 'docs', 'poster.png');
const namedPdf = path.join(root, 'docs', 'poster_A1_CO_ICON.pdf');
const namedPng = path.join(root, 'docs', 'poster_A1_CO_ICON.png');
const readablePdf = path.join(root, 'docs', 'poster_A1_CHU_TO_ANH_CROP.pdf');
const readablePng = path.join(root, 'docs', 'poster_A1_CHU_TO_ANH_CROP.png');

const exportTargets = [
  { pdf: repoPdf, png: repoPng },
  { pdf: 'D:\\khoa_luan_tn\\baocao\\docs\\poster.pdf', png: 'D:\\khoa_luan_tn\\baocao\\docs\\poster.png' },
  { pdf: 'D:\\khoa_luan_tn\\baocao\\poster\\poster.pdf', png: 'D:\\khoa_luan_tn\\baocao\\poster\\poster.png' },
  { pdf: 'D:\\khoa_luan_tn\\tn-da22tta-110122006-nguyennhuthoa-mealai\\docs\\poster.pdf', png: 'D:\\khoa_luan_tn\\tn-da22tta-110122006-nguyennhuthoa-mealai\\docs\\poster.png' },
];

const chromeCandidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
];

const chrome = chromeCandidates.find((file) => fs.existsSync(file));
if (!chrome) {
  throw new Error('Không tìm thấy Chrome hoặc Edge để xuất poster PDF/PNG.');
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

copyRecursive(sourceDir, repoPosterDir);

let html = fs.readFileSync(sourceHtml, 'utf8');
html = html.replace('.shot img {', '.shot > img {');

html = html
  .replace('<title>Poster A1 MealAI - Nguyễn Nhựt Hóa</title>', '<title>Poster A1 MealAI - Nguyễn Nhựt Hóa - Chỉnh sửa in A1</title>')
  .replace(/\.poster \{\s+width: 594mm;\s+height: 841mm;\s+padding: 7mm 10mm 0;/, `.poster {
      width: 594mm;
      height: 841mm;
      padding: 7mm 10mm 0;`)
  .replace(/gap: 4mm;\s+overflow: hidden;/, `gap: 2.6mm;
      overflow: hidden;
      break-inside: avoid;
      page-break-inside: avoid;`)
  .replace(/\.number \{[\s\S]*?font-size: 12pt;\s+\}/, `.number {
      display: none;
    }`)
  .replace(/\.section-title \{([\s\S]*?)gap: 2\.2mm;([\s\S]*?)padding: 1\.7mm 4mm;([\s\S]*?)font-size: 18pt;/, `.section-title {$1gap: 0;$2padding: 2mm 5.2mm;$3font-size: 21pt;`)
  .replace(/\.header \{([\s\S]*?)height: 69mm;/, `.header {$1height: 63mm;`)
  .replace(/\.info-strip \{([\s\S]*?)height: 17mm;([\s\S]*?)font-size: 13\.2pt;/, `.info-strip {$1height: 16.5mm;$2font-size: 15.2pt;`)
  .replace(/font-size: 14\.3pt;/, 'font-size: 15.8pt;')
  .replace(/\.function h3 \{([\s\S]*?)font-size: 13\.2pt;/, `.function h3 {$1font-size: 14.8pt;`)
  .replace(/\.function p \{([\s\S]*?)font-size: 10\.5pt;/, `.function p {$1font-size: 11.8pt;`)
  .replace(/\.flow-box \{([\s\S]*?)font-size: 10\.5pt;/, `.flow-box {$1font-size: 11.8pt;`)
  .replace(/\.note \{([\s\S]*?)font-size: 10\.5pt;/, `.note {$1font-size: 11.6pt;`)
  .replace(/\.tier strong \{([\s\S]*?)font-size: 11\.5pt;/, `.tier strong {$1font-size: 12.8pt;`)
  .replace(/\.tier span \{([\s\S]*?)font-size: 10\.3pt;/, `.tier span {$1font-size: 11.5pt;`)
  .replace(/\.tech b \{([\s\S]*?)font-size: 10\.8pt;/, `.tech b {$1font-size: 12.2pt;`)
  .replace(/\.tech span \{([\s\S]*?)font-size: 9\.7pt;/, `.tech span {$1font-size: 10.9pt;`)
  .replace(/\.overview \{([\s\S]*?)height: 82mm;/, `.overview {$1height: 78mm;`)
  .replace(/\.system-row \{([\s\S]*?)height: 68mm;/, `.system-row {$1height: 62mm;`)
  .replace(/\.demo \{([\s\S]*?)height: 530mm;/, `.demo {$1height: 532mm;`)
  .replace(/grid-template-rows: 177mm 155mm 155mm;([\s\S]*?)gap: 3mm;/, `grid-template-rows: 192mm 158mm 158mm;$1gap: .9mm;`)
  .replace(/\.bottom \{([\s\S]*?)height: 73mm;([\s\S]*?)gap: 4mm;/, `.bottom {$1height: 45mm;$2gap: 2.5mm;`)
  .replace(/\.bottom \.panel \{ padding: 4mm 4\.5mm; \}/, `.bottom .panel { padding: 2.6mm 4.5mm; }`)
  .replace(/\.footer \{([\s\S]*?)height: 8mm;([\s\S]*?)font-size: 8\.8pt;([\s\S]*?)font-weight: 600;/, `.footer {$1height: 9mm;$2font-size: 10.2pt;$3font-weight: 700;`);

html = html
  .replace(/\.demo-card \{([\s\S]*?)background: #fff;\s+\}/, `.demo-card {$1background: #fff;
      position: relative;
      box-shadow: 0 1.2mm 4mm rgba(5, 75, 48, .06);
    }
    .demo-card::before {
      content: attr(data-demo-icon) "  " attr(data-demo-label);
      position: absolute;
      z-index: 3;
      left: 3mm;
      top: 3mm;
      display: inline-flex;
      align-items: center;
      gap: 1.2mm;
      padding: 1.3mm 2.6mm;
      border-radius: 999px;
      background: rgba(0, 128, 82, .94);
      color: #fff;
      border: .25mm solid rgba(255, 255, 255, .78);
      box-shadow: 0 1mm 3mm rgba(0, 76, 48, .18);
      font-size: 10.8pt;
      line-height: 1;
      font-weight: 900;
      letter-spacing: .01em;
      white-space: nowrap;
    }`)
  .replace(/\.caption \{([\s\S]*?)font-size: 11\.5pt;([\s\S]*?)font-weight: 600;/, `.caption {$1font-size: 13.5pt;$2font-weight: 700;
    }
    .demo-card:nth-child(1) .shot img {
      transform: scale(1.16);
      transform-origin: 50% 68%;
    }
    .demo-card:nth-child(2) .shot img {
      transform: scale(1.08);
      transform-origin: 50% 30%;
    }
    .demo-card:nth-child(3) .shot img {
      transform: scale(1.22);
      transform-origin: 52% 30%;
    }
    .demo-card:nth-child(5) .shot img {
      transform: scale(1.15);
      transform-origin: 68% 32%;
    }
    .demo-card:nth-child(6) .shot img {
      transform: scale(1.16);
      transform-origin: 50% 32%;
    }
    .demo-card:nth-child(7) .shot img {
      transform: scale(1.72);
      transform-origin: 50% 18%;`);

html = html
  .replace(/\.demo-head p \{([\s\S]*?)font-size: 11pt;/, `.demo-head p {$1font-size: 12.5pt;`)
  .replace(/\.bottom ul\.clean \{([\s\S]*?)font-size: 11\.8pt;/, `.bottom ul.clean {$1font-size: 13.2pt;`)
  .replace(/\.qr strong \{([\s\S]*?)font-size: 9pt;/, `.qr strong {$1font-size: 9.8pt;`)
  .replace(/\.qr img \{ width: 32mm; height: 32mm; margin-top: 2mm;/, `.qr img { width: 28mm; height: 28mm; margin-top: 1.4mm;`);

html = html.replace(
  /<div class="shot"><img src="_scratch_report_media\/image42\.png" alt="[^"]*" \/><\/div>/,
  `<div class="shot">
    <svg viewBox="420 55 1050 360" preserveAspectRatio="none" width="100%" height="100%" aria-label="Tủ lạnh">
      <image href="_scratch_report_media/image42.png" width="1872" height="883" />
    </svg>
  </div>`,
);

const functionIcons = ['👤', '📖', '🤖', '📅', '🧊', '🛒', '📊', '🛡'];
let functionIndex = 0;
html = html.replace(/<span class="function-icon">[^<]*<\/span>/g, () => {
  const icon = functionIcons[functionIndex] || '✓';
  functionIndex += 1;
  return `<span class="function-icon">${icon}</span>`;
});

const demoBadges = [
  ['📅', 'Thực đơn tuần'],
  ['📊', 'Dinh dưỡng'],
  ['🛒', 'Mua sắm'],
  ['🧊', 'Tủ lạnh'],
  ['🎯', 'TDEE cá nhân'],
  ['🍲', 'Công thức'],
  ['🛡', 'Quản trị'],
];
let demoIndex = 0;
html = html.replace(/<figure class="demo-card( span-2)?">/g, (match, span = '') => {
  const [icon, label] = demoBadges[demoIndex] || ['AI', 'MealAI'];
  demoIndex += 1;
  return `<figure class="demo-card${span}" data-demo-icon="${icon}" data-demo-label="${label}">`;
});

fs.mkdirSync(repoPosterDir, { recursive: true });
fs.writeFileSync(repoHtml, html, 'utf8');

const fileUrl = `file:///${repoHtml.replace(/\\/g, '/')}`;

function runChrome(args) {
  const result = spawnSync(chrome, args, { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`Chrome export failed:\n${result.stdout}\n${result.stderr}`);
  }
}

for (const target of exportTargets) {
  fs.mkdirSync(path.dirname(target.pdf), { recursive: true });
  fs.mkdirSync(path.dirname(target.png), { recursive: true });

  runChrome([
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=5000',
    '--no-pdf-header-footer',
    `--print-to-pdf=${target.pdf}`,
    fileUrl,
  ]);

  runChrome([
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=5000',
    '--hide-scrollbars',
    '--window-size=2245,3179',
    `--screenshot=${target.png}`,
    fileUrl,
  ]);
}

fs.copyFileSync(repoPdf, namedPdf);
fs.copyFileSync(repoPng, namedPng);
fs.copyFileSync(repoPdf, readablePdf);
fs.copyFileSync(repoPng, readablePng);

console.log(`Poster exported from clean HTML source:\n- ${repoPdf}\n- ${repoPng}\n- ${namedPdf}\n- ${namedPng}\n- ${readablePdf}\n- ${readablePng}`);
