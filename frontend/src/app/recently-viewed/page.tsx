'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { HiArrowLeft, HiClock, HiOutlineEye } from 'react-icons/hi';

export default function RecentlyViewedPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load recently viewed recipes from LocalStorage
    const loadHistory = () => {
      try {
        const storageKey = user ? `recently-viewed-${user.id}` : 'recently-viewed-guest';
        const rawData = localStorage.getItem(storageKey);
        const list = rawData ? JSON.parse(rawData) : [];
        setRecipes(list);
      } catch (err) {
        console.error('Failed to load recently viewed history:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [user]);

  // Helper to format relative time in Vietnamese
  const formatRelativeTime = (dateString: string) => {
    try {
      const now = new Date();
      const date = new Date(dateString);
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (isNaN(date.getTime())) return 'Không rõ thời gian';
      if (diffSec < 60) return 'Vừa xong';
      if (diffMin < 60) return `${diffMin} phút trước`;
      if (diffHour < 24) return `${diffHour} giờ trước`;
      if (diffDay === 1) return 'Hôm qua';
      return `${diffDay} ngày trước`;
    } catch {
      return 'Không rõ thời gian';
    }
  };

  const handleClearHistory = () => {
    if (!confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử xem gần đây?')) return;
    try {
      const storageKey = user ? `recently-viewed-${user.id}` : 'recently-viewed-guest';
      localStorage.removeItem(storageKey);
      setRecipes([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light-bg py-8">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-primary transition uppercase tracking-wider mb-2">
              <HiArrowLeft /> Trang chủ
            </Link>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <HiOutlineEye className="text-brand-primary" /> Món Ăn Xem Gần Đây
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Lưu trữ tối đa 20 công thức bạn đã truy cập gần nhất</p>
          </div>

          {recipes.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 border border-brand-danger/20 hover:border-brand-danger/40 hover:bg-red-50 text-brand-danger font-bold text-xs rounded-brand-sm transition cursor-pointer self-start sm:self-auto"
            >
              Xóa tất cả lịch sử
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-brand-md border border-brand-light-border h-60 animate-pulse" />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="card-dashboard bg-white text-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-2xl">
              🕒
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900">Lịch sử trống</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Bạn chưa xem công thức nào gần đây. Hãy truy cập trang khám phá để tìm món ăn ưa thích nhé!
              </p>
            </div>
            <Link href="/recipes" className="btn-primary inline-flex">Khám phá ngay</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recipes.map((item) => (
              <div 
                key={item.id} 
                className="card-dashboard bg-white border border-brand-light-border hover:border-brand-primary/30 transition duration-300 flex flex-col justify-between overflow-hidden p-0 group"
              >
                {/* Recipe Cover Image */}
                <Link href={`/recipes/${item.id}`} className="block relative h-40 w-full overflow-hidden bg-slate-50 border-b border-brand-light-border">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:3001${item.imageUrl}`} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-emerald/10 to-brand-teal/10 flex items-center justify-center text-4xl group-hover:scale-105 transition duration-500">
                      🍲
                    </div>
                  )}
                </Link>

                {/* Recipe Details */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-brand-primary transition line-clamp-1">
                      <Link href={`/recipes/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                      <HiClock /> {formatRelativeTime(item.viewedAt)}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-50 flex justify-end">
                    <Link 
                      href={`/recipes/${item.id}`} 
                      className="text-[10px] font-bold text-brand-primary hover:text-brand-primary-hover hover:underline"
                    >
                      Xem công thức →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
