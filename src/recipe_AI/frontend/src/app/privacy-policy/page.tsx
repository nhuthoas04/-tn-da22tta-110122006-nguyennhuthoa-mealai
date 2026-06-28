import Link from 'next/link';
import {
  HiArrowLeft,
  HiDatabase,
  HiGlobeAlt,
  HiLockClosed,
  HiMail,
  HiShieldCheck,
  HiUser,
} from 'react-icons/hi';

const privacySections = [
  {
    title: 'Mục đích thu thập dữ liệu',
    icon: HiDatabase,
    content:
      'MealAI thu thập dữ liệu cần thiết để vận hành các chức năng gợi ý món ăn, lập thực đơn, quản lý tủ lạnh, tạo danh sách mua sắm và phân tích dinh dưỡng. Dữ liệu được sử dụng nhằm cá nhân hóa trải nghiệm, cải thiện chất lượng gợi ý và hỗ trợ người dùng quản lý bữa ăn hiệu quả hơn.',
  },
  {
    title: 'Thông tin tài khoản người dùng',
    icon: HiUser,
    content:
      'Hệ thống có thể lưu các thông tin như họ tên, email, mật khẩu đã được mã hóa, vai trò tài khoản, ảnh đại diện và các thông tin hồ sơ do người dùng tự cung cấp. Các thông tin về cân nặng, chiều cao, giới tính, ngày sinh và mức độ vận động được dùng để tính nhu cầu năng lượng hằng ngày.',
  },
  {
    title: 'Dữ liệu thực đơn và dinh dưỡng',
    icon: HiShieldCheck,
    content:
      'MealAI lưu dữ liệu về sở thích ăn uống, dị ứng, chế độ ăn, nguyên liệu trong tủ lạnh, công thức yêu thích, thực đơn tuần, danh sách mua sắm và kết quả phân tích dinh dưỡng. Các dữ liệu này phục vụ Recommendation Engine, Meal Planner và các báo cáo dinh dưỡng trong hệ thống.',
  },
  {
    title: 'Cookies',
    icon: HiGlobeAlt,
    content:
      'MealAI có thể sử dụng cookies hoặc bộ nhớ trình duyệt để duy trì phiên đăng nhập, lưu token xác thực và ghi nhớ một số trạng thái giao diện. Người dùng có thể xóa cookies trong trình duyệt, tuy nhiên một số chức năng đăng nhập hoặc cá nhân hóa có thể bị ảnh hưởng.',
  },
  {
    title: 'Bảo mật thông tin',
    icon: HiLockClosed,
    content:
      'Mật khẩu người dùng được lưu dưới dạng mã hóa một chiều. Các API quan trọng được bảo vệ bằng cơ chế xác thực JWT và phân quyền. MealAI không chủ động chia sẻ dữ liệu cá nhân cho bên thứ ba ngoài các dịch vụ kỹ thuật cần thiết để vận hành hệ thống, như xử lý AI, gửi email hoặc lưu trữ dữ liệu.',
  },
  {
    title: 'Quyền của người dùng',
    icon: HiUser,
    content:
      'Người dùng có quyền xem, cập nhật hoặc yêu cầu điều chỉnh thông tin cá nhân đã cung cấp. Người dùng cũng có thể quản lý dữ liệu tủ lạnh, thực đơn, đánh giá, món yêu thích và thông báo của mình trong phạm vi các chức năng mà MealAI cung cấp.',
  },
  {
    title: 'Thông tin liên hệ',
    icon: HiMail,
    content:
      'Nếu có câu hỏi về chính sách bảo mật hoặc cần hỗ trợ liên quan đến dữ liệu cá nhân, người dùng có thể liên hệ qua email: nhuthoas04@gmail.com.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/70 via-white to-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-emerald-100 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-emerald-200 hover:text-brand-primary"
        >
          <HiArrowLeft className="text-base" />
          Về trang chủ
        </Link>

        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-primary">MealAI Legal</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Chính sách bảo mật
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                Chính sách này giải thích cách MealAI thu thập, sử dụng và bảo vệ dữ liệu trong quá trình người dùng sử dụng hệ thống gợi ý thực đơn và dinh dưỡng thông minh.
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-brand-primary">
              Cập nhật lần cuối: 11/06/2026
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {privacySections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-brand-primary">
                  <section.icon className="text-xl" />
                </div>
                <h2 className="text-base font-extrabold text-slate-900">{section.title}</h2>
              </div>
              <p className="text-sm leading-7 text-slate-600">{section.content}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
          <strong>Lưu ý:</strong> MealAI là hệ thống hỗ trợ lập thực đơn và theo dõi dinh dưỡng, không thay thế tư vấn y tế chuyên môn. Người dùng có bệnh lý đặc biệt nên tham khảo ý kiến bác sĩ hoặc chuyên gia dinh dưỡng.
        </div>
      </section>
    </main>
  );
}
