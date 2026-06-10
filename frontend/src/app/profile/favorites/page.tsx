'use client';
import { useEffect, useState } from 'react';
import { recipesAPI, mealPlanAPI, shoppingListAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { 
  HiHeart, HiEye, HiCalendar, HiShoppingBag, 
  HiSearch, HiChevronLeft, HiChevronRight, HiFilter
} from 'react-icons/hi';

export default function FavoritesPage() {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Search and Filter States
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  // Meal Planner Modal States
  const [plannerModal, setPlannerModal] = useState({
    isOpen: false,
    recipeId: '',
    recipeName: '',
    week: 'this_week',
    day: 1, // Monday
    mealType: 'breakfast'
  });

  // Load favorites
  useEffect(() => {
    loadFavorites();
  }, [page, activeSearch, selectedCategory]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await recipesAPI.getFavorites({
        page,
        limit: 6,
        search: activeSearch || undefined,
        category: selectedCategory || undefined,
      });
      setFavorites(res.data.data);
      setTotalCount(res.data.totalFavorites);
      setCategoryStats(res.data.categoryStats);
      setTotalPages(res.data.meta.totalPages || 1);
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setActiveSearch(search);
  };

  const handleCategorySelect = (category: string) => {
    setPage(1);
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const handleUnfavorite = async (id: string) => {
    try {
      await recipesAPI.toggleFavorite(id);
      toast.success('Đã bỏ yêu thích món ăn');
      // If we are on the last page and it becomes empty, go to previous page
      if (favorites.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        loadFavorites();
      }
    } catch (err) {
      toast.error('Không thể bỏ yêu thích');
    }
  };

  // Add to Shopping List
  const handleAddToShoppingList = async (id: string) => {
    const loadingToast = toast.loading('Đang tạo danh sách mua sắm...');
    try {
      const res = await shoppingListAPI.addRecipeToList(id);
      toast.dismiss(loadingToast);
      toast.success(
        <div>
          Đã tạo danh sách mua sắm từ nguyên liệu món ăn!{' '}
          <Link href="/shopping-list" className="underline font-semibold text-emerald-700">
            Xem đi chợ
          </Link>
        </div>,
        { duration: 5000 }
      );
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Không thể tạo danh sách mua sắm');
    }
  };

  // Helper: get week start string
  const getWeekStartString = (offsetWeeks = 0) => {
    const temp = new Date();
    // Offset weeks if needed
    temp.setDate(temp.getDate() + offsetWeeks * 7);
    const day = temp.getDay();
    const diff = temp.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(temp.setDate(diff));
    return monday.toISOString().split('T')[0];
  };

  // Add to Meal Plan
  const handleAddToMealPlan = async () => {
    const weekStart = getWeekStartString(plannerModal.week === 'next_week' ? 1 : 0);
    try {
      await mealPlanAPI.setMealSlot({
        weekStart,
        dayOfWeek: plannerModal.day,
        mealType: plannerModal.mealType,
        recipeId: plannerModal.recipeId
      });
      toast.success('Đã thêm món ăn vào thực đơn tuần của bạn!');
      setPlannerModal({ ...plannerModal, isOpen: false });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể thêm vào thực đơn');
    }
  };

  const getDayLabel = (dayNum: number) => {
    const labels: Record<number, string> = {
      1: 'Thứ Hai',
      2: 'Thứ Ba',
      3: 'Thứ Tư',
      4: 'Thứ Năm',
      5: 'Thứ Sáu',
      6: 'Thứ Bảy',
      7: 'Chủ Nhật',
    };
    return labels[dayNum] || `Thứ ${dayNum}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Món ăn yêu thích ❤️</h1>
          <p className="text-gray-500 mt-1">Lưu trữ các món ăn yêu thích và lên kế hoạch đi chợ nấu nướng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-white border border-gray-250 rounded-2xl p-4 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <HiFilter className="text-gray-400" /> Phân loại ẩm thực
            </h3>
            
            <div className="space-y-1">
              <button
                onClick={() => handleCategorySelect('')}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition flex justify-between items-center ${
                  !selectedCategory 
                    ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>Tất cả</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {totalCount}
                </span>
              </button>

              {Object.entries(categoryStats).map(([cat, count]) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition flex justify-between items-center ${
                    selectedCategory === cat 
                      ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate">{cat}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Tìm món ăn yêu thích..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition text-sm shrink-0"
            >
              Tìm kiếm
            </button>
          </form>

          {/* Favorites List Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm animate-pulse flex flex-col justify-between h-72" />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl p-6">
              <p className="text-5xl mb-4">❤️</p>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Chưa có món ăn yêu thích</h3>
              <p className="text-gray-500 max-w-sm mx-auto text-sm mb-6">
                Hãy khám phá hàng trăm công thức món ăn hấp dẫn của MealAI và nhấn nút yêu thích để lưu trữ tại đây.
              </p>
              <Link
                href="/recipes"
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition text-sm inline-flex items-center gap-2"
              >
                Khám phá món ăn
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favorites.map((fav) => (
                  <div key={fav.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div className="relative h-40 bg-gray-100 shrink-0">
                      {fav.imageUrl ? (
                        <img 
                          src={fav.imageUrl} 
                          alt={fav.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl bg-emerald-50 text-emerald-600">
                          🍳
                        </div>
                      )}
                      
                      <button 
                        onClick={() => handleUnfavorite(fav.id)}
                        className="absolute top-3 right-3 p-2 bg-white/95 rounded-full shadow-md text-rose-500 hover:text-rose-600 hover:scale-105 active:scale-95 transition"
                        title="Bỏ yêu thích"
                      >
                        <HiHeart className="text-xl" />
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          {fav.cuisineRegion || 'Ẩm thực'}
                        </span>
                        <h3 className="font-bold text-gray-950 text-base line-clamp-1 hover:text-emerald-700">
                          <Link href={`/recipes/${fav.id}`}>{fav.name}</Link>
                        </h3>
                        <div className="flex gap-4 text-xs text-gray-500 mt-2">
                          <span>🔥 {fav.calories} kcal</span>
                          <span>⏱️ {fav.cookingTime} phút</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Đã thích: {new Date(fav.favoritedAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100 shrink-0">
                        <Link 
                          href={`/recipes/${fav.id}`}
                          className="flex items-center justify-center gap-1.5 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition"
                        >
                          <HiEye /> Chi tiết
                        </Link>
                        <button 
                          onClick={() => setPlannerModal({ 
                            isOpen: true, 
                            recipeId: fav.id, 
                            recipeName: fav.name,
                            week: 'this_week',
                            day: 1,
                            mealType: 'breakfast'
                          })}
                          className="flex items-center justify-center gap-1.5 py-2 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/70 transition"
                        >
                          <HiCalendar /> Thực đơn
                        </button>
                        <button 
                          onClick={() => handleAddToShoppingList(fav.id)}
                          className="flex items-center justify-center gap-1.5 py-2 border border-blue-200 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100/70 transition"
                        >
                          <HiShoppingBag /> Đi chợ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition"
                  >
                    <HiChevronLeft className="text-lg" />
                  </button>
                  <span className="text-sm font-medium text-gray-600">
                    Trang {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition"
                  >
                    <HiChevronRight className="text-lg" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Planner Slot Selection Modal */}
      {plannerModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Thêm vào thực đơn tuần</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-1">Món ăn: <span className="font-semibold text-emerald-700">{plannerModal.recipeName}</span></p>
            </div>

            <div className="space-y-3">
              {/* Select Week */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Chọn tuần</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPlannerModal({ ...plannerModal, week: 'this_week' })}
                    className={`py-2 px-3 border rounded-xl text-xs font-semibold transition ${
                      plannerModal.week === 'this_week'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Tuần này ({getWeekStartString(0)})
                  </button>
                  <button
                    onClick={() => setPlannerModal({ ...plannerModal, week: 'next_week' })}
                    className={`py-2 px-3 border rounded-xl text-xs font-semibold transition ${
                      plannerModal.week === 'next_week'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Tuần sau ({getWeekStartString(1)})
                  </button>
                </div>
              </div>

              {/* Select Day */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Chọn ngày</label>
                <select
                  value={plannerModal.day}
                  onChange={(e) => setPlannerModal({ ...plannerModal, day: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(d => (
                    <option key={d} value={d}>{getDayLabel(d)}</option>
                  ))}
                </select>
              </div>

              {/* Select Meal Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Bữa ăn</label>
                <select
                  value={plannerModal.mealType}
                  onChange={(e) => setPlannerModal({ ...plannerModal, mealType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="breakfast">Bữa sáng</option>
                  <option value="lunch">Bữa trưa</option>
                  <option value="dinner">Bữa tối</option>
                  <option value="snack">Bữa phụ</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPlannerModal({ ...plannerModal, isOpen: false })}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleAddToMealPlan}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
