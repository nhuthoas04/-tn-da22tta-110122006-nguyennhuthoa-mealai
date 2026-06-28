'use client';
import React from 'react';
import toast from 'react-hot-toast';
import {
  HiOutlineDownload,
  HiClipboardCopy,
  HiOutlineShare,
  HiOutlineDocumentText,
} from 'react-icons/hi';
import {
  formatShoppingListShareText,
  getFilenameDateStr,
  downloadTxtFile,
} from '@/lib/shareHelper';
import api from '@/lib/api';

export default function MealAIShareSheetModal({
  open,
  onClose,
  shoppingList,
  onExportPDF,
}: {
  open: boolean;
  onClose: () => void;
  shoppingList: any;
  onExportPDF: () => void;
}) {
  if (!open || !shoppingList) return null;

  const handleCopyNote = () => {
    const text = formatShoppingListShareText(shoppingList);
    navigator.clipboard.writeText(text);
    toast.success('Đã sao chép danh sách mua sắm dạng ghi chú!');
  };

  const handleDownloadTxt = () => {
    const text = formatShoppingListShareText(shoppingList);
    const dateStr = getFilenameDateStr(shoppingList.createdAt);
    downloadTxtFile(`MealAI-Danh-sach-mua-sam-${dateStr}.txt`, text);
    toast.success('Đã tải xuống file ghi chú (.txt)!');
  };

  const handleSharePDF = async () => {
    const toastId = toast.loading('Đang chuẩn bị file PDF để chia sẻ...');
    try {
      const res = await api.get(`/shopping-lists/${shoppingList.id}/pdf`, {
        responseType: 'blob',
      });
      const dateStr = getFilenameDateStr(shoppingList.createdAt);
      const filename = `MealAI-Danh-sach-mua-sam-${dateStr}.pdf`;
      const file = new File([res.data], filename, { type: 'application/pdf' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Danh sách mua sắm - ${shoppingList.name}`,
          text: 'Chia sẻ danh sách mua sắm từ MealAI',
        });
        toast.success('Chia sẻ PDF thành công!', { id: toastId });
      } else {
        // Fallback to downloading
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(res.data);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Trình duyệt không hỗ trợ chia sẻ file. Đã tự động tải xuống PDF.', {
          id: toastId,
          duration: 4000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi chuẩn bị file chia sẻ', { id: toastId });
    }
  };

  const handleSocialShare = (platform: string, url: string) => {
    const text = formatShoppingListShareText(shoppingList);
    navigator.clipboard.writeText(text);
    toast.success(`Đã copy nội dung. Đang mở ${platform} để bạn gửi tin nhắn...`, {
      duration: 3000,
    });
    setTimeout(() => {
      window.open(url, '_blank');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-brand-lg w-full max-w-md shadow-brand-lg border border-brand-light-border overflow-hidden flex flex-col transform transition-all duration-300 scale-100 animate-slide-in">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white flex items-center justify-between shadow-brand-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">📢</span>
            <h3 className="font-bold text-base tracking-wide">Chia sẻ danh sách mua sắm</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-brand-sm flex items-center justify-center hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] bg-white">
          
          {/* PDF & Document Options */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Tài liệu & Tải về
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onExportPDF}
                className="flex items-center gap-2 p-3 border border-brand-light-border bg-white hover:bg-emerald-50 hover:border-emerald-200 rounded-brand-md text-left transition cursor-pointer shadow-brand-sm"
              >
                <div className="w-8 h-8 rounded-brand-sm bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <HiOutlineDownload className="text-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Tải PDF</p>
                  <p className="text-[10px] text-slate-400">Lưu về máy</p>
                </div>
              </button>

              <button
                onClick={handleSharePDF}
                className="flex items-center gap-2 p-3 border border-brand-light-border bg-white hover:bg-teal-50 hover:border-teal-200 rounded-brand-md text-left transition cursor-pointer shadow-brand-sm"
              >
                <div className="w-8 h-8 rounded-brand-sm bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <HiOutlineShare className="text-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Chia sẻ PDF</p>
                  <p className="text-[10px] text-slate-400">Share qua app</p>
                </div>
              </button>

              <button
                onClick={handleCopyNote}
                className="flex items-center gap-2 p-3 border border-brand-light-border bg-white hover:bg-amber-50 hover:border-amber-200 rounded-brand-md text-left transition cursor-pointer shadow-brand-sm"
              >
                <div className="w-8 h-8 rounded-brand-sm bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <HiClipboardCopy className="text-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Copy ghi chú</p>
                  <p className="text-[10px] text-slate-400">Sao chép nhanh</p>
                </div>
              </button>

              <button
                onClick={handleDownloadTxt}
                className="flex items-center gap-2 p-3 border border-brand-light-border bg-white hover:bg-blue-50 hover:border-blue-200 rounded-brand-md text-left transition cursor-pointer shadow-brand-sm"
              >
                <div className="w-8 h-8 rounded-brand-sm bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <HiOutlineDocumentText className="text-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Tải file .txt</p>
                  <p className="text-[10px] text-slate-400">Lưu note ghi chú</p>
                </div>
              </button>
            </div>
          </div>

          {/* Social Media Sharing */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Gửi qua mạng xã hội
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  handleSocialShare('Messenger', 'https://m.me')
                }
                className="flex items-center gap-2.5 p-2.5 border border-brand-light-border bg-white hover:bg-slate-50 rounded-brand-md text-left transition cursor-pointer shadow-brand-sm"
              >
                <span className="text-xl">💬</span>
                <span className="text-xs font-bold text-slate-700">Messenger</span>
              </button>

              <button
                onClick={() =>
                  handleSocialShare('Facebook', 'https://facebook.com')
                }
                className="flex items-center gap-2.5 p-2.5 border border-brand-light-border bg-white hover:bg-slate-50 rounded-brand-md text-left transition cursor-pointer shadow-brand-sm"
              >
                <span className="text-xl">👥</span>
                <span className="text-xs font-bold text-slate-700">Facebook</span>
              </button>

              <button
                onClick={() =>
                  handleSocialShare('Zalo', 'https://zalo.me')
                }
                className="flex items-center gap-2.5 p-2.5 border border-brand-light-border bg-white hover:bg-slate-50 rounded-brand-md text-left transition cursor-pointer shadow-brand-sm"
              >
                <span className="text-xl">🌀</span>
                <span className="text-xs font-bold text-slate-700">Zalo</span>
              </button>

              <button
                onClick={() =>
                  handleSocialShare('Instagram', 'https://instagram.com')
                }
                className="flex items-center gap-2.5 p-2.5 border border-brand-light-border bg-white hover:bg-slate-50 rounded-brand-md text-left transition cursor-pointer shadow-brand-sm"
              >
                <span className="text-xl">📸</span>
                <span className="text-xs font-bold text-slate-700">Instagram</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-brand-light-border flex justify-end">
          <button
            onClick={onClose}
            className="btn-ghost-sm"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
