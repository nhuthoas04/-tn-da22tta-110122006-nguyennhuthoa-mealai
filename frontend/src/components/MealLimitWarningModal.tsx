import { HiExclamation } from 'react-icons/hi';

const formatNumber = (val: number) => Math.round(val).toLocaleString('vi-VN');

type MealLimitWarningModalProps = {
  servings: number;
  currentDayItemsCount: number;
  maxRecommendedItems: number;
  recipeName: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  isSubmitting?: boolean;
  warnings?: {
    exceedDishLimit: boolean;
    exceedDayCalories: boolean;
    exceedMealCalories: boolean;
    currentDishCount: number;
    newDishCount: number;
    maxDishCount: number;
    currentDayCalories: number;
    currentMealCalories: number;
    newCalories: number;
    afterAddDayCalories: number;
    afterAddMealCalories: number;
    dayTargetCalories: number;
    mealTargetCalories: number | null;
  };
};

export default function MealLimitWarningModal({
  servings,
  currentDayItemsCount,
  maxRecommendedItems,
  recipeName,
  onCancel,
  onConfirm,
  isSubmitting = false,
  warnings,
}: MealLimitWarningModalProps) {
  let subTitle = `Thực đơn hiện tại đã đạt giới hạn khẩu phần cho ${servings} người ăn.`;
  let desc = 'Việc thêm quá nhiều món ăn trong một ngày có thể gây thừa thãi dinh dưỡng hoặc tốn kém chi phí chuẩn bị. Bạn có chắc chắn muốn tiếp tục thêm?';

  if (warnings) {
    const hasDishWarn = warnings.exceedDishLimit;
    const hasCalWarn = warnings.exceedDayCalories || warnings.exceedMealCalories;

    if (hasDishWarn && hasCalWarn) {
      subTitle = `Thực đơn đã đạt giới hạn khẩu phần và vượt mục tiêu calories khuyến nghị.`;
      desc = `Việc thêm các món này có thể làm thực đơn vượt số món khuyến nghị và vượt mục tiêu calories trong ngày.`;
    } else if (hasCalWarn) {
      subTitle = `Calories trong thực đơn vượt quá mục tiêu khuyến nghị.`;
      desc = `Việc thêm món này có thể làm bữa ăn hoặc tổng calories trong ngày vượt mức khuyến nghị.`;
    } else if (hasDishWarn) {
      subTitle = `Thực đơn hiện tại đã đạt giới hạn khẩu phần cho ${servings} người ăn.`;
      desc = `Việc thêm quá nhiều món trong một ngày có thể gây thừa thức ăn, thừa dinh dưỡng hoặc tốn kém chi phí chuẩn bị.`;
    }
  }

  // Determine if we show portion box and calorie box
  const showPortionBox = !warnings || warnings.exceedDishLimit;
  const showCalorieBox = warnings && (warnings.exceedDayCalories || warnings.exceedMealCalories);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="meal-limit-warning-title"
        className="w-full max-w-md overflow-hidden rounded-brand-lg border border-amber-200 bg-white shadow-brand-lg animate-scale-up"
      >
        <div className="flex items-center gap-3 border-b border-amber-200 bg-amber-50 px-5 py-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xl text-amber-700">
            <HiExclamation aria-hidden="true" />
          </span>
          <h2 id="meal-limit-warning-title" className="text-base font-bold text-slate-900">
            Cảnh báo giới hạn thực đơn
          </h2>
        </div>

        <div className="space-y-4 p-5 text-sm text-slate-600 max-h-[75vh] overflow-y-auto">
          <p className="text-base font-semibold leading-6 text-slate-800">
            {subTitle}
          </p>

          {showPortionBox && (
            <div className="space-y-3 rounded-brand-md border border-slate-200 bg-slate-50 p-4">
              <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-1.5 mb-1">
                Thông tin khẩu phần
              </h4>
              <DetailRow label="Số người ăn" value={`${servings} người`} />
              <DetailRow label="Số món hiện tại trong ngày" value={`${currentDayItemsCount} món`} />
              <DetailRow label="Ngưỡng tối đa khuyến nghị" value={`${maxRecommendedItems} món`} />
              <DetailRow label="Món đang muốn thêm" value={recipeName} />
            </div>
          )}

          {showCalorieBox && warnings && (
            <div className="space-y-3 rounded-brand-md border border-slate-200 bg-slate-50 p-4">
              <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-1.5 mb-1">
                Thông tin calories
              </h4>
              {warnings.exceedDayCalories && (
                <div className="space-y-2">
                  <DetailRow label="Calories hiện tại trong ngày" value={`${formatNumber(warnings.currentDayCalories)} kcal`} />
                  <DetailRow label="Calories món muốn thêm" value={`${formatNumber(warnings.newCalories)} kcal`} />
                  <DetailRow label="Sau khi thêm" value={`${formatNumber(warnings.afterAddDayCalories)} kcal`} />
                  <DetailRow label="Mục tiêu ngày" value={`${formatNumber(warnings.dayTargetCalories)} kcal`} />
                  <DetailRow label="Trạng thái" value="Vượt mục tiêu kcal" valueClass="text-red-500" />
                </div>
              )}
              {warnings.exceedMealCalories && warnings.mealTargetCalories && (
                <div className="space-y-2">
                  {warnings.exceedDayCalories && <div className="border-t border-dashed border-slate-200 my-2" />}
                  <DetailRow label="Calories bữa hiện tại" value={`${formatNumber(warnings.currentMealCalories)} kcal`} />
                  <DetailRow label="Calories món muốn thêm" value={`${formatNumber(warnings.newCalories)} kcal`} />
                  <DetailRow label="Sau khi thêm vào bữa" value={`${formatNumber(warnings.afterAddMealCalories)} kcal`} />
                  <DetailRow label="Mục tiêu bữa" value={`${formatNumber(warnings.mealTargetCalories)} kcal`} />
                  <DetailRow label="Trạng thái" value="Vượt kcal bữa" valueClass="text-red-500" />
                </div>
              )}
            </div>
          )}

          <p className="text-xs leading-5 text-slate-500">
            {desc} Bạn có chắc chắn muốn tiếp tục thêm?
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full rounded-brand-sm px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={isSubmitting}
            className="w-full rounded-brand-sm bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-brand-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? 'Đang thêm...' : 'Vẫn thêm món'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-xs font-medium">
      <span className="text-slate-500">{label}:</span>
      <strong className={`max-w-[210px] text-right font-bold ${valueClass || 'text-slate-900'}`} title={value}>
        {value}
      </strong>
    </div>
  );
}
