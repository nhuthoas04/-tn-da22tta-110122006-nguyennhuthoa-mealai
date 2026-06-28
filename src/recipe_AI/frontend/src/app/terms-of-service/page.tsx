import Link from 'next/link';
import {
  HiArrowLeft,
  HiChatAlt2,
  HiClipboardCheck,
  HiExclamation,
  HiPencilAlt,
  HiScale,
  HiShieldCheck,
} from 'react-icons/hi';

const termsSections = [
  {
    title: 'Điều kiện sử dụng hệ thống MealAI',
    icon: HiClipboardCheck,
    content:
      'Khi truy cập và sử dụng MealAI, người dùng đồng ý tuân thủ các điều khoản sử dụng của hệ thống. Người dùng cần cung cấp thông tin chính xác khi đăng ký, đăng nhập và cập nhật hồ sơ để các chức năng gợi ý, lập thực đơn và phân tích dinh dưỡng hoạt động đúng mục đích.',
  },
  {
    title: 'Trách nhiệm người dùng',
    icon: HiShieldCheck,
    content:
      'Người dùng chịu trách nhiệm bảo mật tài khoản, mật khẩu và các thao tác được thực hiện từ tài khoản của mình. Người dùng cần tự kiểm tra tính phù hợp của món ăn, nguyên liệu và khuyến nghị dinh dưỡng trước khi áp dụng vào thực tế.',
  },
  {
    title: 'Quy định về nội dung cộng đồng',
    icon: HiChatAlt2,
    content:
      'Người dùng có thể gửi công thức, đánh giá và phản hồi trong cộng đồng MealAI. Nội dung không được chứa thông tin xúc phạm, quấy rối, phân biệt đối xử, spam, quảng cáo không phù hợp hoặc nội dung vi phạm pháp luật.',
  },
  {
    title: 'Quy định về đánh giá và bình luận',
    icon: HiPencilAlt,
    content:
      'Các đánh giá và bình luận cần phản ánh trải nghiệm thực tế, có ngôn ngữ lịch sự và không cố ý gây hiểu lầm. MealAI có quyền kiểm duyệt, ẩn, từ chối hoặc xóa các bình luận vi phạm. Tài khoản vi phạm nhiều lần có thể bị hạn chế quyền bình luận.',
  },
  {
    title: 'Giới hạn trách nhiệm',
    icon: HiExclamation,
    content:
      'MealAI cung cấp công cụ hỗ trợ gợi ý thực đơn và dinh dưỡng dựa trên dữ liệu người dùng nhập và dữ liệu công thức trong hệ thống. MealAI không chịu trách nhiệm cho các quyết định sử dụng thực phẩm, dị ứng, bệnh lý hoặc hậu quả phát sinh khi người dùng áp dụng khuyến nghị mà không kiểm tra lại.',
  },
  {
    title: 'Quyền sửa đổi dịch vụ',
    icon: HiScale,
    content:
      'MealAI có quyền cập nhật, thay đổi hoặc tạm ngừng một phần chức năng nhằm cải thiện chất lượng dịch vụ, bảo trì hệ thống hoặc đáp ứng yêu cầu kỹ thuật. Các thay đổi quan trọng sẽ được cập nhật trong nội dung điều khoản khi cần thiết.',
  },
];

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-50/70 via-white to-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-teal-100 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-teal-200 hover:text-brand-primary"
        >
          <HiArrowLeft className="text-base" />
          Về trang chủ
        </Link>

        <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-primary">MealAI Legal</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Điều khoản sử dụng
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                Điều khoản này quy định trách nhiệm, phạm vi sử dụng và các nguyên tắc cộng đồng khi người dùng truy cập hệ thống MealAI.
              </p>
            </div>
            <div className="rounded-xl bg-teal-50 px-4 py-3 text-sm font-bold text-brand-primary">
              Cập nhật lần cuối: 11/06/2026
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {termsSections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-200 hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-brand-primary">
                  <section.icon className="text-xl" />
                </div>
                <h2 className="text-base font-extrabold text-slate-900">{section.title}</h2>
              </div>
              <p className="text-sm leading-7 text-slate-600">{section.content}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600 shadow-sm">
          Việc tiếp tục sử dụng MealAI sau khi điều khoản được cập nhật được hiểu là người dùng đã đọc, hiểu và đồng ý với các thay đổi liên quan.
        </div>
      </section>
    </main>
  );
}
