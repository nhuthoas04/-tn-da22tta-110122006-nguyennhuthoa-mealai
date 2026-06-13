'use client';
import { useEffect, useState } from 'react';
import { adminAPI, uploadAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  HiCheckCircle, HiXCircle, HiClock, HiFire, HiUser, HiEye, HiPencil, HiTrash, HiPlus, HiUpload
} from 'react-icons/hi';

export default function AdminPendingPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [viewRecipe, setViewRecipe] = useState<any>(null);

  const [auditData, setAuditData] = useState<Record<string, any>>({});
  const [loadingAudit, setLoadingAudit] = useState<Record<string, boolean>>({});

  // Editing state
  const [editingRecipe, setEditingRecipe] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    imageUrl: '',
    ingredients: [] as { name: string; quantity: number; unit: string; isOptional?: boolean }[],
    steps: [] as { step: number; description: string }[],
  });
  const [uploading, setUploading] = useState(false);

  const toggleViewRecipe = async (recipe: any) => {
    if (viewRecipe?.id === recipe.id) {
      setViewRecipe(null);
      return;
    }
    setViewRecipe(recipe);
    if (!auditData[recipe.id]) {
      await fetchAudit(recipe.id);
    }
  };

  const fetchAudit = async (recipeId: string) => {
    setLoadingAudit(prev => ({ ...prev, [recipeId]: true }));
    try {
      const res = await adminAPI.getAudit(recipeId);
      setAuditData(prev => ({ ...prev, [recipeId]: res.data }));
    } catch (err) {
      console.error('Failed to fetch AI recipe audit:', err);
    } finally {
      setLoadingAudit(prev => ({ ...prev, [recipeId]: false }));
    }
  };

  const handleRetryAudit = async (recipeId: string) => {
    setLoadingAudit(prev => ({ ...prev, [recipeId]: true }));
    try {
      const res = await adminAPI.retryAudit(recipeId);
      setAuditData(prev => ({ ...prev, [recipeId]: res.data }));
      toast.success('Đã kích hoạt đánh giá lại bằng AI!');
    } catch (err) {
      console.error('Failed to retry AI recipe audit:', err);
      toast.error('Thử lại đánh giá AI thất bại.');
    } finally {
      setLoadingAudit(prev => ({ ...prev, [recipeId]: false }));
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

  // Edit Handlers
  const handleEditClick = (recipe: any) => {
    setEditingRecipe(recipe);
    setEditForm({
      name: recipe.name || '',
      description: recipe.description || '',
      calories: recipe.calories || 0,
      protein: Number(recipe.protein || 0),
      carbs: Number(recipe.carbs || 0),
      fat: Number(recipe.fat || 0),
      imageUrl: recipe.imageUrl || '',
      ingredients: recipe.recipeIngredients?.map((ri: any) => ({
        name: ri.ingredient?.name || '',
        quantity: Number(ri.quantity || 0),
        unit: ri.unit || '',
        isOptional: !!ri.isOptional,
      })) || [],
      steps: recipe.steps?.map((s: any) => ({
        step: s.step,
        description: s.description || '',
      })) || [],
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAPI.uploadImage(file);
      setEditForm(prev => ({ ...prev, imageUrl: res.data.url }));
      toast.success('Tải ảnh lên thành công!');
    } catch (err) {
      toast.error('Tải ảnh lên thất bại');
    } finally {
      setUploading(false);
    }
  };

  const addIngredient = () => {
    setEditForm(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: 0, unit: 'g', isOptional: false }]
    }));
  };

  const removeIngredient = (idx: number) => {
    setEditForm(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== idx)
    }));
  };

  const updateIngredient = (idx: number, field: string, value: any) => {
    setEditForm(prev => {
      const list = [...prev.ingredients];
      list[idx] = { ...list[idx], [field]: value };
      return { ...prev, ingredients: list };
    });
  };

  const addStep = () => {
    setEditForm(prev => ({
      ...prev,
      steps: [...prev.steps, { step: prev.steps.length + 1, description: '' }]
    }));
  };

  const removeStep = (idx: number) => {
    setEditForm(prev => {
      const filtered = prev.steps.filter((_, i) => i !== idx);
      const renumbered = filtered.map((s, i) => ({ ...s, step: i + 1 }));
      return { ...prev, steps: renumbered };
    });
  };

  const updateStep = (idx: number, description: string) => {
    setEditForm(prev => {
      const list = [...prev.steps];
      list[idx] = { ...list[idx], description };
      return { ...prev, steps: list };
    });
  };

  const handleSaveEdit = async () => {
    if (!editingRecipe) return;
    try {
      await adminAPI.editPending(editingRecipe.id, editForm);
      toast.success('Đã lưu chỉnh sửa thành công!');
      setEditingRecipe(null);
      loadPending();
      // Clear audit cache for this recipe so it forces reload
      setAuditData(prev => {
        const copy = { ...prev };
        delete copy[editingRecipe.id];
        return copy;
      });
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi lưu chỉnh sửa');
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
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{recipe.name}</h3>
                    {recipe.hasBeenEditedByAdmin && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        Đã chỉnh sửa bởi Admin
                      </span>
                    )}
                  </div>
                  {recipe.description && (
                    <p className="text-gray-500 mt-1 text-sm line-clamp-2">{recipe.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
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
                        className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                      >
                        <HiEye /> {viewRecipe?.id === recipe.id ? 'Ẩn chi tiết & AI Audit' : 'Xem chi tiết & AI Audit'}
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
                                <div className="flex items-center gap-2">
                                  {auditData[recipe.id].qualityScore === -1 && (
                                    <button
                                      onClick={() => handleRetryAudit(recipe.id)}
                                      className="px-2 py-0.5 bg-amber-100 text-amber-800 hover:bg-amber-250 transition rounded-full text-[10px] font-bold border-none cursor-pointer"
                                    >
                                      Thử lại AI Review
                                    </button>
                                  )}
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                    auditData[recipe.id].qualityScore === -1 ? 'bg-gray-150 text-gray-650' :
                                    auditData[recipe.id].qualityScore >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                  }`}>
                                    AI Score: {auditData[recipe.id].qualityScore === -1 ? 'N/A' : `${auditData[recipe.id].qualityScore}/100`}
                                  </span>
                                </div>
                              </div>

                              {auditData[recipe.id].qualityScore === -1 && (
                                <div className="bg-amber-50 text-amber-700 p-2.5 rounded-xl text-xs border border-amber-100">
                                  ⚠️ <strong>Lỗi đánh giá AI:</strong> Không thể đánh giá bằng AI lúc này
                                </div>
                              )}

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
                                  <span className="font-bold text-gray-500">Đo lường Calo:</span> {auditData[recipe.id].nutritionValidityNotes}
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

                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto lg:justify-end mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                  <button
                    onClick={() => handleEditClick(recipe)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition cursor-pointer"
                  >
                    <HiPencil className="text-base" /> Sửa bài viết
                  </button>
                  <button
                    onClick={() => handleApprove(recipe.id)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition cursor-pointer"
                  >
                    <HiCheckCircle className="text-lg" /> Duyệt
                  </button>
                  <button
                    onClick={() => { setRejectingId(recipe.id); setRejectReason(''); }}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-medium hover:bg-red-100 transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm" onClick={() => setRejectingId(null)}>
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-md mx-4 max-h-[90vh] flex flex-col overflow-y-auto shadow-xl border border-gray-200 animate-scale-up" onClick={(e) => e.stopPropagation()}>
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
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer font-bold"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50 cursor-pointer font-bold"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Edit Modal */}
      {editingRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-4 sm:p-6 shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between border-b pb-4 flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-900">Sửa bài viết trước khi duyệt</h3>
              <button
                onClick={() => setEditingRecipe(null)}
                className="text-gray-400 hover:text-gray-650 text-xl font-bold border-none bg-transparent cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 my-4 pr-1">

            {/* Basic fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Tên món</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Mô tả</label>
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>

            {/* Nutrition fields */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Calories (kcal)</label>
                <input
                  type="number"
                  value={editForm.calories}
                  onChange={(e) => setEditForm(prev => ({ ...prev, calories: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Protein (g)</label>
                <input
                  type="number"
                  value={editForm.protein}
                  onChange={(e) => setEditForm(prev => ({ ...prev, protein: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Carbs (g)</label>
                <input
                  type="number"
                  value={editForm.carbs}
                  onChange={(e) => setEditForm(prev => ({ ...prev, carbs: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Fat (g)</label>
                <input
                  type="number"
                  value={editForm.fat}
                  onChange={(e) => setEditForm(prev => ({ ...prev, fat: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
            </div>

            {/* Image */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 uppercase block">Ảnh món ăn</label>
              <div className="flex items-center gap-4">
                {editForm.imageUrl && (
                  <img src={editForm.imageUrl} alt="preview" className="w-16 h-16 rounded-lg object-cover border" />
                )}
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="URL ảnh hoặc tải ảnh lên"
                    value={editForm.imageUrl}
                    onChange={(e) => setEditForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-pointer transition">
                      <HiUpload className="text-sm" />
                      <span>{uploading ? 'Đang tải lên...' : 'Tải tệp lên'}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-t pt-4">
                <h4 className="text-sm font-bold text-gray-800">Nguyên liệu</h4>
                <button
                  onClick={addIngredient}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 border-none bg-transparent cursor-pointer"
                >
                  <HiPlus /> Thêm nguyên liệu
                </button>
              </div>
              <div className="space-y-2">
                {editForm.ingredients.map((ing, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Tên nguyên liệu"
                        value={ing.name}
                        onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Số lượng"
                        value={ing.quantity || ''}
                        onChange={(e) => updateIngredient(i, 'quantity', Number(e.target.value))}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="Đơn vị (g, ml...)"
                        value={ing.unit}
                        onChange={(e) => updateIngredient(i, 'unit', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <label className="inline-flex items-center cursor-pointer" title="Tùy chọn">
                        <input
                          type="checkbox"
                          checked={ing.isOptional || false}
                          onChange={(e) => updateIngredient(i, 'isOptional', e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                        />
                      </label>
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => removeIngredient(i)}
                        className="text-red-500 hover:text-red-700 text-sm border-none bg-transparent cursor-pointer"
                        title="Xóa"
                      >
                        <HiTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-800">Các bước thực hiện</h4>
                <button
                  onClick={addStep}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 border-none bg-transparent cursor-pointer"
                >
                  <HiPlus /> Thêm bước
                </button>
              </div>
              <div className="space-y-3">
                {editForm.steps.map((step, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-xs font-bold text-gray-500 w-16 pt-2 shrink-0">Bước {step.step}:</span>
                    <textarea
                      value={step.description}
                      onChange={(e) => updateStep(i, e.target.value)}
                      rows={2}
                      placeholder="Mô tả công đoạn nấu..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs resize-none"
                    />
                    <button
                      onClick={() => removeStep(i)}
                      className="text-red-500 hover:text-red-700 text-base pt-2 border-none bg-transparent cursor-pointer"
                      title="Xóa bước này"
                    >
                      <HiTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            </div>

            {/* Modal actions */}
            <div className="flex justify-end gap-3 border-t pt-4 flex-shrink-0">
              <button
                onClick={() => setEditingRecipe(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer text-xs font-bold"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editForm.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer text-xs font-bold"
              >
                Lưu chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
