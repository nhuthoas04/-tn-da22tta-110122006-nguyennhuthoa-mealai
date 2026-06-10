'use client';
import { useState, useEffect, Suspense } from 'react';
import { authAPI } from '@/lib/api';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { HiSparkles } from 'react-icons/hi';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const qEmail = searchParams.get('email');
    const qOtp = searchParams.get('otp');
    if (qEmail) setEmail(qEmail);
    if (qOtp) setToken(qOtp);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.resetPassword({
        email,
        token,
        newPassword,
      });
      toast.success(res.data.message || 'Đặt lại mật khẩu thành công!');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Mã OTP không chính xác hoặc đã hết hạn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
          placeholder="example@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mã OTP (6 chữ số)</label>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          maxLength={10}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none tracking-wider font-semibold text-center text-lg transition"
          placeholder="Nhập mã OTP"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
          placeholder="Nhập mật khẩu mới"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
          placeholder="Nhập lại mật khẩu mới"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition disabled:opacity-50"
      >
        {loading ? 'Đang thực hiện...' : 'Đặt lại mật khẩu'}
      </button>

      <p className="text-center text-sm text-gray-500">
        Quay lại{' '}
        <Link href="/login" className="text-emerald-600 font-medium hover:underline">
          Đăng nhập
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <HiSparkles className="text-5xl text-emerald-600 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Meal<span className="text-emerald-600">AI</span>
          </h1>
          <p className="text-gray-500 mt-2">Đặt lại mật khẩu tài khoản của bạn</p>
        </div>

        <Suspense fallback={<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">Đang tải form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
