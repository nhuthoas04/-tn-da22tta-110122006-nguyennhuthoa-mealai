'use client';
import { useState } from 'react';
import { authAPI } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { HiSparkles, HiInformationCircle } from 'react-icons/hi';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fallbackOtp, setFallbackOtp] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);
    setFallbackOtp(null);
    setLoading(true);

    try {
      const res = await authAPI.forgotPassword(email);
      toast.success(res.data.message || 'Mã OTP đã được gửi!');
      
      // If the backend runs in SMTP fallback mode, it returns the OTP in the response
      if (res.data.otp) {
        setFallbackOtp(res.data.otp);
      } else {
        // Normal SMTP mode: redirect to reset password page directly
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 2000);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Email không tồn tại hoặc lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <HiSparkles className="text-5xl text-emerald-600 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Meal<span className="text-emerald-600">AI</span>
          </h1>
          <p className="text-gray-500 mt-2">Quên mật khẩu? Không sao, hãy khôi phục lại tài khoản</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email của bạn</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              placeholder="example@email.com"
            />
          </div>

          {fallbackOtp && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <HiInformationCircle className="text-lg" />
                <span>Chế độ kiểm thử (Fallback):</span>
              </div>
              <p>Hệ thống không tìm thấy cấu hình Mail SMTP nên đã lưu OTP trong log và gửi kèm phản hồi này:</p>
              <div className="text-center py-2 bg-white border border-amber-200 rounded-lg text-2xl font-bold tracking-widest text-amber-900">
                {fallbackOtp}
              </div>
              <p className="text-xs text-amber-600">Hãy sao chép mã OTP ở trên và bấm nút "Tiếp tục đặt lại" bên dưới.</p>
            </div>
          )}

          {!fallbackOtp ? (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {loading ? 'Đang xử lý...' : 'Gửi yêu cầu OTP'}
            </button>
          ) : (
            <Link
              href={`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(fallbackOtp)}`}
              className="block w-full py-3 bg-emerald-600 text-white text-center rounded-xl font-medium hover:bg-emerald-700 transition"
            >
              Tiếp tục đặt lại mật khẩu
            </Link>
          )}

          <p className="text-center text-sm text-gray-500">
            Quay lại{' '}
            <Link href="/login" className="text-emerald-600 font-medium hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
