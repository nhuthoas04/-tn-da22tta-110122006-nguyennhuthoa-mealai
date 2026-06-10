'use client';
import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  HiCheckCircle, HiXCircle, HiClock, HiFire, HiUser, HiEye,
} from 'react-icons/hi';

export default function AdminPendingPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [viewRecipe, setViewRecipe] = useState<any>(null);

  const [auditData, setAuditData] = useState<Record<string, any>>({});
  const [loadingAudit, setLoadingAudit] = useState<Record<string, boolean>>({});

  const toggleViewRecipe = async (recipe: any) => {
    if (viewRecipe?.id === recipe.id) {
      setViewRecipe(null);
      return;
    }
    setViewRecipe(recipe);
    if (!auditData[recipe.id]) {
      setLoadingAudit(prev => ({ ...prev, [recipe.id]: true }));
      try {
        const res = await adminAPI.getAudit(recipe.id);
        setAuditData(prev => ({ ...prev, [recipe.id]: res.data }));
      } catch (err) {
        console.error('Failed to fetch AI recipe audit:', err);
      } finally {
        setLoadingAudit(prev => ({ ...prev, [recipe.id]: false }));
      }
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getPending();
      setRecipes(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await adminAPI.approve(id);
      toast.success('Đã duyệt công thức!');
      loadPending();
    } catch (err) {
      toast.error('Lỗi khi duyệt');
    }
  };

  const handleReject = async () => {
    if (!rejectingId || !rejectReason.trim()) return;
    try {
      await adminAPI.reject(rejectingId, rejectReason);
      toast.success('Đã từ chối công thức');
      setRejectingId(null);
      setRejectReason('');
      loadPending();
    } catch (err) {
      toast.error('Lỗi khi từ chối');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Bài đăng chờ duyệt</h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bài đăng chờ duyệt</h1>
        <p className="text-gray-500 mt-1">
          {recipes.length > 0 ? `${recipes.length} bài đang chờ xem xét` : 'Không có bài nào chờ duyệt'}
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <p className="text-5xl mb-4">✅</p>
          <p className="text-lg font-medium text-gray-700">Tất cả đã được xử lý!</p>
          <p className="text-gray-500 mt-1">Không có bài đăng nào chờ duyệt</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900">{recipe.name}</h3>
                  {recipe.description && (
                    <p className="text-gray-500 mt-1 text-sm line-clamp-2">{recipe.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><HiUser className="text-purple-500" /> {recipe.submitterName}</span>
                    <span className="flex items-center gap-1"><HiClock /> {recipe.cookingTime}p</span>
                    <span className="flex items-center gap-1"><HiFire /> {recipe.calories} kcal</span>
                    {recipe.difficulty && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        recipe.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        recipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {recipe.difficulty === 'easy' ? 'Dễ' : recipe.difficulty === 'medium' ? 'TB' : 'Khó'}
                      </span>
                    )}
                  </div>

                  {/* Steps preview */}
                  {recipe.steps?.length > 0 && (
                    <div className="mt-3">
                      <button
                        onClick={() => toggleViewRecipe(recipe)}
                        className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        <HiEye /> {viewRecipe?.id === recipe.id ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                      </button>
                      {viewRecipe?.id === recipe.id && (
                        <div className="mt-4 space-y-4">
                          {/* Recipe steps */}
                          <div className="pl-4 border-l-2 border-purple-200 space-y-1">
                            {recipe.steps.map((s: any, i: number) => (
                              <p key={i} className="text-sm text-gray-600">
                                <span className="font-medium text-purple-600">Bước {s.step}:</span> {s.description}
                              </p>
                            ))}
                          </div>

                          {/* AI Audit Block */}
                          {loadingAudit[recipe.id] ? (
                            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50 animate-pulse text-xs text-emerald-800 font-medium">
                              🤖 Trợ lý AI đang thẩm định công thức...
                            </div>
                          ) : auditData[recipe.id] && (
                            <div className="p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/50 space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                                  🤖 Đánh giá kiểm duyệt từ AI
                                </h4>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                  auditData[recipe.id].qualityScore >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                }`}>
                                  AI Score: {auditData[recipe.id].qualityScore}/100
                                </span>
                              </div>

                              {auditData[recipe.id].isDuplicateDetected && (
                                <div className="bg-red-50 text-red-700 p-2.5 rounded-xl text-xs border border-red-100">
                                  ⚠️ <strong>Phát hiện trùng lặp:</strong> Công thức có tên trùng khớp với một công thức đã duyệt trên hệ thống.
                                </div>
                              )}

                              {auditData[recipe.id].missingIngredients?.length > 0 && (
                                <div className="space-y-1">
                                  <span className="text-[10px] text-gray-500 font-bold uppercase">Thiếu nguyên liệu:</span>
                                  <ul className="text-xs text-red-600 list-disc pl-4 space-y-0.5">
                                    {auditData[recipe.id].missingIngredients.map((item: string, idx: number) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {auditData[recipe.id].missingSteps?.length > 0 && (
                                <div className="space-y-1">
                                  <span className="text-[10px] text-gray-500 font-bold uppercase">Cảnh báo bước nấu:</span>
                                  <ul className="text-xs text-red-600 list-disc pl-4 space-y-0.5">
                                    {auditData[recipe.id].missingSteps.map((item: string, idx: number) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div className="text-xs text-gray-700 space-y-1 pt-1 border-t border-emerald-100/40">
                                <div>
                                  <span className="font-bold text-gray-500">Độ chuẩn xác Calo:</span> {auditData[recipe.id].nutritionValidityNotes}
                                </div>
                                <div>
                                  <span className="font-bold text-gray-500">Nhận xét chi tiết:</span> {auditData[recipe.id].rawAIFeedback}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <button
                    onClick={() => handleApprove(recipe.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition"
                  >
                    <HiCheckCircle className="text-lg" /> Duyệt
                  </button>
                  <button
                    onClick={() => { setRejectingId(recipe.id); setRejectReason(''); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-medium hover:bg-red-100 transition"
                  >
                    <HiXCircle className="text-lg" /> Từ chối
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setRejectingId(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Từ chối công thức</h3>
            <p className="text-sm text-gray-500 mb-4">Vui lòng nhập lý do từ chối để người dùng biết</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="VD: Công thức chưa đủ chi tiết, thiếu bước thực hiện..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none resize-none"
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setRejectingId(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
