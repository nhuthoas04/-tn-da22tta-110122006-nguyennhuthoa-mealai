'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { HiCheck, HiShare, HiShoppingCart, HiTrash } from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';
import api, { shoppingListAPI } from '@/lib/api';
import MealAIShareSheetModal from './MealAIShareSheetModal';

type ShoppingSummary = {
  totalItems: number;
  totalIngredients?: number;
  needToBuyItems: number;
  availableItems?: number;
  alreadyInInventoryItems?: number;
  inventoryCoveredItems?: number;
  purchasedItems: number;
  autoDeductedItems?: number;
};

type ShoppingItem = {
  id: string;
  name?: string;
  ingredient?: {
    id: string;
    name: string;
    category?: string;
  };
  category?: string;
  requiredQuantity?: number;
  quantityNeeded?: number;
  availableQuantity?: number;
  quantitySourced?: number;
  needToBuyQuantity?: number;
  quantity?: number;
  unit?: string;
  isPurchased?: boolean;
  isEnoughFromInventory?: boolean;
  note?: string;
  allocations?: Array<{
    id: string;
    quantity: number;
    unit: string;
    destination?: string;
    note?: string;
  }>;
};

type ShoppingGroup = {
  category: string;
  items: ShoppingItem[];
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Đang chờ',
  in_progress: 'Đang mua',
  completed: 'Hoàn tất',
  cancelled: 'Đã hủy',
  PENDING: 'Đang chờ',
  IN_PROGRESS: 'Đang mua',
  COMPLETED: 'Hoàn tất',
  CANCELLED: 'Đã hủy',
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200',
};

function numberValue(value: unknown) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatQuantity(value: unknown, unit?: string) {
  const numeric = numberValue(value);
  const formatted = Number.isInteger(numeric)
    ? String(numeric)
    : numeric.toLocaleString('vi-VN', { maximumFractionDigits: 2 });
  return `${formatted}${unit ? ` ${unit}` : ''}`;
}

function formatDateTime(value?: string | Date) {
  if (!value) return 'Chưa xác định thời gian';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa xác định thời gian';

  return `${date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })} - ${date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })}`;
}

function formatShoppingListTitle(value?: string) {
  const title = (value || 'Danh sách mua sắm').trim();
  const cleanedTitle = title
    .replace(/\s*-\s*\d{1,2}\/\d{1,2}\/\d{4}\s+lúc\s+\d{1,2}:\d{2}\s*$/i, '')
    .trim();

  return cleanedTitle || title;
}

function getItemName(item: ShoppingItem) {
  return item.name || item.ingredient?.name || 'Nguyên liệu';
}

function getSummary(list: any): ShoppingSummary {
  const summary = list?.summary || {};
  const totalItems = numberValue(
    summary.totalItems ?? summary.totalIngredients ?? list?.totalItems ?? list?.totalIngredients,
  );
  const needToBuyItems = numberValue(
    summary.needToBuyItems ?? list?.needToBuyItems ?? list?.needToBuyCount,
  );
  const availableItems = numberValue(
    summary.availableItems ??
      summary.alreadyInInventoryItems ??
      summary.inventoryCoveredItems ??
      list?.availableItems ??
      list?.inventoryCoveredItems,
  );
  const purchasedItems = numberValue(summary.purchasedItems ?? list?.purchasedItems);

  return {
    totalItems,
    totalIngredients: totalItems,
    needToBuyItems,
    availableItems,
    alreadyInInventoryItems: availableItems,
    inventoryCoveredItems: availableItems,
    purchasedItems,
    autoDeductedItems: numberValue(summary.autoDeductedItems),
  };
}

export default function ShoppingListPage() {
  const { user } = useAuth();
  const [lists, setLists] = useState<any[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedList, setSelectedList] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const loadLists = useCallback(async () => {
    try {
      const res = await shoppingListAPI.getAll();
      const nextLists = res.data.data || [];
      setLists(nextLists);

      if (nextLists.length === 0) {
        setSelectedListId(null);
        setSelectedList(null);
        return;
      }

      if (!selectedListId || !nextLists.some((list: any) => list.id === selectedListId)) {
        setSelectedListId(nextLists[0].id);
      }
    } catch {
      toast.error('Không thể tải danh sách mua sắm');
    } finally {
      setLoading(false);
    }
  }, [selectedListId]);

  const loadListDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    try {
      const res = await shoppingListAPI.getById(id);
      setSelectedList(res.data);
    } catch {
      toast.error('Không thể tải chi tiết danh sách');
      setSelectedList(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadLists();
    } else {
      setLoading(false);
    }
  }, [user, loadLists]);

  useEffect(() => {
    if (!selectedListId) return;
    loadListDetail(selectedListId);
  }, [selectedListId, loadListDetail]);

  useEffect(() => {
    if (!user) return;
    const handler = () => {
      loadLists();
      if (selectedListId) {
        loadListDetail(selectedListId);
      }
    };

    window.addEventListener('shopping-list-updated', handler);
    return () => window.removeEventListener('shopping-list-updated', handler);
  }, [user, selectedListId, loadLists, loadListDetail]);

  const selectedSummary = useMemo(() => getSummary(selectedList), [selectedList]);

  const togglePurchased = async (itemId: string, isPurchased: boolean) => {
    if (!selectedList) return;
    try {
      await shoppingListAPI.markPurchased(selectedList.id, itemId, !isPurchased);
      await Promise.all([loadListDetail(selectedList.id), loadLists()]);
    } catch {
      toast.error('Không thể cập nhật trạng thái nguyên liệu');
    }
  };

  const deleteList = async (id: string) => {
    if (!confirm('Xóa danh sách mua sắm này?')) return;
    try {
      await shoppingListAPI.delete(id);
      toast.success('Đã xóa danh sách mua sắm');
      if (selectedListId === id) {
        setSelectedListId(null);
        setSelectedList(null);
      }
      await loadLists();
    } catch {
      toast.error('Có lỗi xảy ra khi xóa danh sách');
    }
  };

  const handleExportPDF = async () => {
    if (!selectedList) {
      toast.error('Chưa chọn danh sách để xuất PDF');
      return;
    }

    const toastId = toast.loading('Đang chuẩn bị file PDF...');
    try {
      const res = await api.get(`/shopping-lists/${selectedList.id}/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `danh_sach_mua_sam_${selectedList.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Đã tải file PDF', { id: toastId });
    } catch {
      toast.error('Có lỗi khi tải file PDF', { id: toastId });
    }
  };

  const renderStatusBadge = (status?: string) => (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${
        STATUS_STYLES[status || 'pending'] || STATUS_STYLES.pending
      }`}
    >
      {STATUS_LABELS[status || 'pending'] || status || 'Đang chờ'}
    </span>
  );

  const renderItemCard = (item: ShoppingItem, canToggle: boolean) => {
    const required = numberValue(item.requiredQuantity ?? item.quantityNeeded);
    const available = numberValue(item.availableQuantity ?? item.quantitySourced);
    const needToBuy = numberValue(item.needToBuyQuantity ?? item.quantity);
    const unit = item.unit || '';
    const itemName = getItemName(item);

    return (
      <div
        key={item.id}
        className={`rounded-brand-md border p-3 shadow-brand-sm transition-all ${
          item.isPurchased
            ? 'bg-slate-50 border-slate-200'
            : canToggle
              ? 'bg-white border-amber-100'
              : 'bg-emerald-50/50 border-emerald-100'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              {canToggle ? (
                <button
                  type="button"
                  onClick={() => togglePurchased(item.id, !!item.isPurchased)}
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-brand-sm border transition-all ${
                    item.isPurchased
                      ? 'bg-gradient-to-r from-brand-primary to-brand-secondary border-transparent text-white'
                      : 'border-slate-300 bg-white hover:border-brand-primary hover:bg-brand-primary/5'
                  }`}
                  aria-label={item.isPurchased ? 'Bỏ đánh dấu đã mua' : 'Đánh dấu đã mua'}
                >
                  {item.isPurchased && <HiCheck className="text-sm" />}
                </button>
              ) : (
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-brand-sm bg-emerald-100 text-emerald-700">
                  <HiCheck className="text-sm" />
                </div>
              )}

              <div className="min-w-0">
                <p
                  className={`text-sm font-bold ${
                    item.isPurchased ? 'line-through text-slate-400' : 'text-slate-900'
                  }`}
                >
                  {itemName}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">{item.category || 'Khác'}</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
              <div className="rounded-brand-sm bg-slate-50 px-2.5 py-2">
                <p className="text-slate-400">Cần cho thực đơn</p>
                <p className="font-bold text-slate-700">{formatQuantity(required, unit)}</p>
              </div>
              <div className="rounded-brand-sm bg-emerald-50 px-2.5 py-2">
                <p className="text-emerald-600">Đã có trong tủ lạnh</p>
                <p className="font-bold text-emerald-700">{formatQuantity(available, unit)}</p>
              </div>
              <div className="rounded-brand-sm bg-amber-50 px-2.5 py-2">
                <p className="text-amber-600">Cần mua thêm</p>
                <p className="font-bold text-amber-700">{formatQuantity(needToBuy, unit)}</p>
              </div>
            </div>

            {item.note && (
              <p className="mt-2 rounded-brand-sm bg-brand-primary/5 px-2.5 py-2 text-xs text-slate-600">
                Ghi chú: {item.note}
              </p>
            )}
          </div>

          <div className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-brand-sm border border-slate-100">
            {formatQuantity(canToggle ? needToBuy : available || required, unit)}
          </div>
        </div>

        {item.allocations?.length ? (
          <div className="mt-3 space-y-1 border-t border-dashed border-slate-200 pt-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Đã trừ từ tủ lạnh
            </p>
            {item.allocations.map((alloc) => (
              <p key={alloc.id} className="text-[11px] text-slate-500">
                {formatQuantity(alloc.quantity, alloc.unit)} - {alloc.destination || alloc.note}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  const renderGroupSection = (
    title: string,
    description: string,
    groups: ShoppingGroup[] | undefined,
    canToggle: boolean,
    emptyMessage: string,
  ) => (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
            {title}
          </h4>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>

      {groups?.length ? (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.category} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-100" />
                <p className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
                  {group.category}
                </p>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
              <div className="grid grid-cols-1 gap-3">
                {group.items.map((item) => renderItemCard(item, canToggle))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-brand-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          {emptyMessage}
        </div>
      )}
    </section>
  );

  if (!user) {
    return (
      <div className="text-center py-20 bg-brand-light-bg min-h-screen flex flex-col justify-center items-center">
        <HiShoppingCart className="mb-4 text-5xl text-brand-primary/50" />
        <p className="text-slate-500">
          Vui lòng{' '}
          <Link
            href="/login"
            className="text-brand-primary font-bold underline hover:text-brand-primary-hover"
          >
            đăng nhập
          </Link>{' '}
          để xem danh sách mua sắm.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light-bg px-4 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900">Danh sách mua sắm</h1>
            <div className="badge-ai">AI tự động</div>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Tự động trừ nguyên liệu còn hạn trong tủ lạnh và hiển thị rõ phần cần mua thêm.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
              Danh sách
            </h2>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-36 animate-pulse rounded-brand-md border border-brand-light-border bg-white shadow-brand-sm"
                  />
                ))}
              </div>
            ) : lists.length === 0 ? (
              <div className="card-dashboard bg-white p-8 text-center">
                <p className="text-sm font-medium text-slate-500">
                  Chưa có danh sách nào. Hãy lên thực đơn tuần trước.
                </p>
                <Link
                  href="/meal-planner"
                  className="mt-2 inline-block text-sm font-bold text-brand-primary hover:underline"
                >
                  Đi tới Thực đơn →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {lists.map((list) => {
                  const summary = getSummary(list);
                  const isSelected = selectedListId === list.id;

                  return (
                    <button
                      key={list.id}
                      type="button"
                      onClick={() => setSelectedListId(list.id)}
                      className={`w-full rounded-brand-md border bg-white p-4 text-left transition-all ${
                        isSelected
                          ? 'border-brand-primary bg-emerald-50/60 shadow-brand-glow ring-2 ring-brand-primary/10'
                          : 'border-brand-light-border shadow-brand-sm hover:border-brand-primary/40 hover:shadow-brand-md'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-bold leading-snug text-slate-900">
                            {formatShoppingListTitle(list.name)}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Tạo lúc {formatDateTime(list.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-brand-sm bg-slate-50 p-2">
                          <p className="text-slate-400">Tổng</p>
                          <p className="font-bold text-slate-800">{summary.totalItems} mục</p>
                        </div>
                        <div className="rounded-brand-sm bg-amber-50 p-2">
                          <p className="text-amber-600">Cần mua</p>
                          <p className="font-bold text-amber-700">
                            {summary.needToBuyItems} mục
                          </p>
                        </div>
                        <div className="rounded-brand-sm bg-emerald-50 p-2">
                          <p className="text-emerald-600">Đã có sẵn</p>
                          <p className="font-bold text-emerald-700">
                            {summary.availableItems} mục
                          </p>
                        </div>
                        <div className="rounded-brand-sm bg-brand-primary/5 p-2">
                          <p className="text-brand-primary">Đã mua</p>
                          <p className="font-bold text-brand-primary">
                            {summary.purchasedItems}/{summary.needToBuyItems}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          <main>
            {detailLoading ? (
              <div className="card-dashboard space-y-4 bg-white p-6">
                <div className="h-7 w-64 animate-pulse rounded bg-slate-100" />
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 animate-pulse rounded-brand-md bg-slate-100" />
                  ))}
                </div>
                <div className="h-72 animate-pulse rounded-brand-md bg-slate-100" />
              </div>
            ) : !selectedList ? (
              <div className="card-dashboard bg-white p-16 text-center">
                <HiShoppingCart className="mx-auto mb-3 text-5xl text-brand-primary/45" />
                <p className="font-medium text-slate-500">
                  Chọn một danh sách ở cột bên trái để xem chi tiết.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-brand-lg border border-brand-light-border bg-white shadow-brand-sm">
                <div className="flex flex-col gap-4 border-b border-brand-light-border p-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-extrabold text-slate-900">
                        {formatShoppingListTitle(selectedList.title || selectedList.name)}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Tạo lúc {formatDateTime(selectedList.createdAt)}
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-brand-primary">
                      * Tích chọn vào ô để đánh dấu là đã mua rồi.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setShareOpen(true)}
                      className="btn-outline-sm gap-1.5 border-emerald-200 font-bold text-emerald-600 hover:bg-emerald-50"
                    >
                      <HiShare className="text-base" />
                      <span>Chia sẻ</span>
                    </button>
                    <button
                      onClick={() => deleteList(selectedList.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-brand-sm border border-brand-danger/30 bg-white text-brand-danger transition-all hover:bg-brand-danger/10"
                      title="Xóa danh sách"
                    >
                      <HiTrash className="text-base" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6 p-5">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div className="rounded-brand-md border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-medium text-slate-500">Tổng nguyên liệu cần dùng</p>
                      <p className="mt-1 text-2xl font-extrabold text-slate-900">
                        {selectedSummary.totalItems}
                      </p>
                    </div>
                    <div className="rounded-brand-md border border-amber-200 bg-amber-50 p-3">
                      <p className="text-xs font-medium text-amber-700">Cần mua thêm</p>
                      <p className="mt-1 text-2xl font-extrabold text-amber-700">
                        {selectedSummary.needToBuyItems}
                      </p>
                    </div>
                    <div className="rounded-brand-md border border-emerald-200 bg-emerald-50 p-3">
                      <p className="text-xs font-medium text-emerald-700">
                        Đã có trong tủ lạnh
                      </p>
                      <p className="mt-1 text-2xl font-extrabold text-emerald-700">
                        {selectedSummary.availableItems}
                      </p>
                    </div>
                    <div className="rounded-brand-md border border-brand-primary/20 bg-brand-primary/5 p-3">
                      <p className="text-xs font-medium text-brand-primary">Đã mua</p>
                      <p className="mt-1 text-2xl font-extrabold text-brand-primary">
                        {selectedSummary.purchasedItems}/{selectedSummary.needToBuyItems}
                      </p>
                    </div>
                  </div>

                  {selectedList.items?.length === 0 ? (
                    <div className="rounded-brand-md border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                      Danh sách này chưa có nguyên liệu.
                    </div>
                  ) : (
                    <>
                      {renderGroupSection(
                        'Cần mua',
                        'Các nguyên liệu còn thiếu sau khi đã trừ phần có sẵn trong tủ lạnh. Tích chọn vào ô là đã mua rồi.',
                        selectedList.purchaseGroups,
                        true,
                        'Không có nguyên liệu nào cần mua thêm.',
                      )}

                      {renderGroupSection(
                        'Đã có trong tủ lạnh',
                        'Các nguyên liệu đã đủ, không cần mua thêm.',
                        selectedList.inventoryGroups,
                        false,
                        'Chưa có mục nào được đáp ứng hoàn toàn từ tủ lạnh.',
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>

        <MealAIShareSheetModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          shoppingList={selectedList}
          onExportPDF={handleExportPDF}
        />
      </div>
    </div>
  );
}
