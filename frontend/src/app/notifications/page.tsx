'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { notificationsAPI, recipesAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { HiBell, HiCheck, HiOutlineInbox, HiChevronLeft, HiChevronRight, HiEye } from 'react-icons/hi';
import Link from 'next/link';

export default function NotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Edit history modal
  const [historyModal, setHistoryModal] = useState<{ isOpen: boolean; recipeId: string; histories: any[] }>({
    isOpen: false,
    recipeId: '',
    histories: [],
  });

  const loadNotifications = async (targetPage = 1) => {
    setLoading(true);
    try {
      const res = await notificationsAPI.getAll({ page: targetPage, limit: 10 });
      setNotifications(res.data.data || []);
      setTotalPages(res.data.meta?.totalPages || 1);
      setTotal(res.data.meta?.total || 0);
      setPage(targetPage);
    } catch {
      toast.error('Không thể tải danh sách thông báo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadNotifications(1);
    }
  }, [user]);

  const handleNotificationClick = async (notif: any) => {
    try {
      if (!notif.isRead) {
        await notificationsAPI.markAsRead(notif.id);
        // Dispatch window event to refresh navbar count
        window.dispatchEvent(new Event('update-personal-notifications-count'));
      }
      if (notif.type === 'EDITED') {
        // For edited notifications, open changes details
        if (notif.postId) {
          handleViewChanges(notif.postId);
        }
      } else if (notif.post?.id) {
        router.push(`/recipes/${notif.post.id}`);
      } else {
        // Refresh list
        loadNotifications(page);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      toast.success('Đã đánh dấu đọc tất cả thông báo!');
      window.dispatchEvent(new Event('update-personal-notifications-count'));
      loadNotifications(1);
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra.');
    }
  };

  const handleViewChanges = async (recipeId: string) => {
    try {
      const res = await recipesAPI.getEditHistory(recipeId);
      setHistoryModal({
        isOpen: true,
        recipeId,
        histories: res.data || [],
      });
    } catch (err) {
      toast.error('Không thể tải lịch sử chỉnh sửa.');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'APPROVED': return '✅';
      case 'REJECTED': return '❌';
      case 'EDITED': return '📝';
      case 'RATE_POST': return '⭐';
      case 'COMMENT_POST': return '💬';
      case 'REPLY_COMMENT': return '↩️';
      case 'SAVE_RECIPE': return '❤️';
      case 'COMMENT': return '💬';
      case 'LIKE': return '❤️';
      default: return '🔔';
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Vừa xong';
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHour < 24) return `${diffHour} giờ trước`;
    if (diffDay === 1) return 'Hôm qua';
    return `${diffDay} ngày trước`;
  };

  if (!user) {
    return (
      <div className="text-center py-20 bg-brand-light-bg min-h-screen flex flex-col justify-center items-center">
        <p className="text-5xl mb-4 animate-brand-float">🔔</p>
        <p className="text-slate-500">Vui lòng <Link href="/login" className="text-brand-primary font-bold underline hover:text-brand-primary-hover">đăng nhập</Link> để xem thông báo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-6 bg-brand-light-bg min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-light-border pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HiBell className="text-brand-primary" /> Thông báo cá nhân
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Theo dõi kiểm duyệt, lượt thích, đánh giá và tương tác về công thức món ăn của bạn ({total})
          </p>
        </div>
        {notifications.some(n => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center justify-center gap-1.5 px-4 py-2 border border-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-brand-sm transition-all cursor-pointer shadow-brand-sm"
          >
            <HiCheck className="text-base" /> Đánh dấu đọc tất cả
          </button>
        )}
      </div>

      {loading && notifications.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border border-brand-light-border rounded-brand-md p-5 h-20 animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white border border-brand-light-border rounded-brand-lg p-16 text-center shadow-brand-sm flex flex-col justify-center items-center">
          <HiOutlineInbox className="text-6xl text-slate-300 mb-3" />
          <h3 className="font-bold text-slate-800 text-lg">Hộp thư thông báo trống</h3>
          <p className="text-slate-400 text-sm mt-1">Bạn chưa nhận được bất kỳ tương tác nào từ hệ thống.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-white border border-brand-light-border rounded-brand-lg divide-y divide-brand-light-border overflow-hidden shadow-brand-sm">
            {notifications.map((notif) => (
              <button
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`w-full text-left p-5 flex items-start gap-4 hover:bg-slate-50 transition-all cursor-pointer border-none bg-transparent ${
                  !notif.isRead ? 'bg-brand-primary/5' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 text-lg font-bold text-brand-primary overflow-hidden shadow-brand-sm">
                  {notif.actor?.avatarUrl && notif.type !== 'APPROVED' && notif.type !== 'REJECTED' && notif.type !== 'EDITED' ? (
                    <img src={notif.actor.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <span>{getNotificationIcon(notif.type)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1">
                      <p className="text-sm text-slate-700 font-semibold leading-relaxed break-words">
                        {notif.message}
                      </p>
                      {notif.type === 'EDITED' && notif.postId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewChanges(notif.postId);
                          }}
                          className="mt-2.5 flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-250 text-blue-700 text-xs font-bold rounded-lg transition-all cursor-pointer"
                        >
                          <HiEye className="text-sm" /> Xem chi tiết thay đổi
                        </button>
                      )}
                    </div>
                    {!notif.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-primary shrink-0 mt-1.5" title="Chưa đọc" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 font-semibold">
                    <span>{formatRelativeTime(notif.createdAt)}</span>
                    {notif.post && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-brand-primary font-bold">{notif.post.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => loadNotifications(page - 1)}
                disabled={page === 1}
                className="p-2 border border-brand-light-border bg-white rounded-brand-sm hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Trang trước"
              >
                <HiChevronLeft className="text-lg" />
              </button>
              <span className="text-xs font-bold text-slate-600 px-3">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => loadNotifications(page + 1)}
                disabled={page === totalPages}
                className="p-2 border border-brand-light-border bg-white rounded-brand-sm hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Trang sau"
              >
                <HiChevronRight className="text-lg" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit History Modal */}
      {historyModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-4 sm:p-6 shadow-2xl border border-gray-250 max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between border-b pb-3 flex-shrink-0">
              <h3 className="text-base font-bold text-slate-800">Lịch sử thay đổi nội dung từ Admin</h3>
              <button
                onClick={() => setHistoryModal(prev => ({ ...prev, isOpen: false }))}
                className="text-gray-400 hover:text-gray-655 font-bold border-none bg-transparent cursor-pointer text-xl"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-1">
              {historyModal.histories.length === 0 ? (
                <p className="text-sm text-slate-455 italic text-center py-6">Không tìm thấy lịch sử chỉnh sửa nào.</p>
              ) : (
                <div className="space-y-6">
                  <p className="text-xs font-bold text-brand-primary uppercase bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                    Bài viết đã được chỉnh sửa bởi Quản trị viên
                  </p>
                  <div className="divide-y divide-gray-100">
                    {historyModal.histories.map((hist, i) => (
                      <div key={hist.id} className={`py-4 ${i > 0 ? 'mt-4' : ''}`}>
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                          <span className="font-semibold text-gray-700">Người sửa: {hist.editor?.fullName || 'Admin'}</span>
                          <span>Thời gian: {new Date(hist.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                        <div className="space-y-3">
                          {hist.changes?.map((change: any, idx: number) => (
                            <div key={idx} className="space-y-1">
                              <span className="text-xs font-bold text-slate-600 block">{change.field}:</span>
                              <div className="text-xs font-medium space-y-1">
                                <pre className="bg-red-50 text-red-700 p-2.5 rounded-xl border border-red-150/40 font-mono whitespace-pre-wrap leading-relaxed">
                                  - {change.oldValue}
                                </pre>
                                <pre className="bg-green-50 text-green-700 p-2.5 rounded-xl border border-green-150/40 font-mono whitespace-pre-wrap leading-relaxed">
                                  + {change.newValue}
                                </pre>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t flex-shrink-0">
              <button
                onClick={() => setHistoryModal(prev => ({ ...prev, isOpen: false }))}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
