import { User } from '../auth/entities/user.entity';

export type ProfileCompletionStatus = 'incomplete' | 'partial' | 'complete';

export interface ProfileCompletionResult {
  status: ProfileCompletionStatus;
  canPersonalizeCalories: boolean;
  missingFields: string[];
  completedFields: string[];
  promptInstruction: string;
}

export interface ProfileAction {
  label: string;
  route: string;
}

const PROFILE_ACTION: ProfileAction = {
  label: 'Cập nhật hồ sơ cá nhân',
  route: '/profile',
};

function hasValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return Number.isFinite(value) && value > 0;
  return value !== null && value !== undefined;
}

function hasExplicitArray(value: unknown): boolean {
  return Array.isArray(value);
}

function hasValidServings(user?: User | null): boolean {
  const servings = Number(user?.preferences?.servings);
  return Number.isInteger(servings) && servings >= 1 && servings <= 20;
}

function hasNutritionGoal(user?: User | null): boolean {
  const preferences = user?.preferences;
  const dietType = String(preferences?.dietType || '').trim().toLowerCase();
  const hasSpecificDietType =
    dietType.length > 0 && !['normal', 'binh thuong', 'bình thường'].includes(dietType);

  return (
    hasValue(user?.dailyCalorieTarget) ||
    hasSpecificDietType ||
    hasValue(preferences?.healthConditions) ||
    hasValue(preferences?.minProteinPerMeal) ||
    hasValue(preferences?.maxSugarPerMeal) ||
    hasValue(preferences?.maxSodiumPerMeal)
  );
}

export function getProfileUpdateAction(): ProfileAction {
  return PROFILE_ACTION;
}

export function getProfileCompletion(user?: User | null): ProfileCompletionResult {
  const checks = [
    { label: 'chieu cao', ok: hasValue(user?.height) },
    { label: 'can nang', ok: hasValue(user?.weight) },
    { label: 'gioi tinh', ok: hasValue(user?.gender) },
    { label: 'ngay sinh', ok: hasValue(user?.dateOfBirth) },
    { label: 'muc do van dong', ok: hasValue(user?.activityLevel) },
    { label: 'muc tieu suc khoe/dinh duong', ok: hasNutritionGoal(user) },
    { label: 'so nguoi an', ok: hasValidServings(user) },
    { label: 'di ung thuc pham', ok: hasExplicitArray(user?.preferences?.allergies) },
    {
      label: 'mon hoac nguyen lieu khong thich',
      ok: hasExplicitArray(user?.preferences?.dislikedIngredients),
    },
  ];

  const coreChecks = checks.slice(0, 7);
  const completedFields = checks.filter((item) => item.ok).map((item) => item.label);
  const missingFields = checks.filter((item) => !item.ok).map((item) => item.label);
  const completedCoreCount = coreChecks.filter((item) => item.ok).length;
  const status: ProfileCompletionStatus =
    completedCoreCount === coreChecks.length
      ? 'complete'
      : completedCoreCount >= 4
        ? 'partial'
        : 'incomplete';

  const promptInstruction =
    status === 'complete'
      ? 'Nguoi dung da cap nhat day du ho so. Duoc phep ca nhan hoa goi y dua tren chieu cao, can nang, gioi tinh, muc do van dong, muc tieu suc khoe, di ung, khau vi va so nguoi an.'
      : status === 'partial'
        ? 'Ho so nguoi dung moi chi co mot phan thong tin. Chi duoc dua ra goi y tham khao, khong khang dinh chinh xac ve TDEE, BMR, muc tieu calo hay macro ca nhan.'
        : 'Nguoi dung chua cap nhat day du thong tin ca nhan. Khong duoc dua ra ket luan ca nhan hoa ve calo, TDEE, BMR hoac muc tieu dinh duong. Chi goi y mon an pho thong, an toan, de nau va nhac nguoi dung cap nhat ho so de nhan goi y chinh xac hon.';

  return {
    status,
    canPersonalizeCalories: status === 'complete',
    missingFields,
    completedFields,
    promptInstruction,
  };
}
