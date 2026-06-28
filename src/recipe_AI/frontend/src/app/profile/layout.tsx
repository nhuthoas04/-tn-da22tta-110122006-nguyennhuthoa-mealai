'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiUser, HiHeart, HiBookOpen } from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">👤</p>
        <p className="text-gray-500">Vui lòng <Link href="/login" className="text-emerald-600 underline font-medium">đăng nhập</Link> để tiếp tục.</p>
      </div>
    );
  }

  const menuItems = [
    {
      name: 'Hồ sơ & Thống kê',
      path: '/profile',
      icon: HiUser,
      exact: true,
    },
    {
      name: 'Món ăn yêu thích',
      path: '/profile/favorites',
      icon: HiHeart,
      exact: false,
    },
    {
      name: 'Bài đăng của tôi',
      path: '/profile/my-recipes',
      icon: HiBookOpen,
      exact: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-2 lg:sticky lg:top-6">
            <div className="px-3 py-2.5 border-b border-gray-100 hidden lg:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Trung tâm Cá nhân</p>
              <h3 className="font-bold text-gray-800 text-lg mt-1 truncate">{user.fullName || 'Thành viên MealAI'}</h3>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-thin mt-2 select-none">
              {menuItems.map((item) => {
                const isActive = item.exact 
                  ? pathname === item.path 
                  : pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition shrink-0 whitespace-nowrap ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                    }`}
                  >
                    <Icon className={`text-lg ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
