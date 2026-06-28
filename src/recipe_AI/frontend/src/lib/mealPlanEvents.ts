export const MEAL_PLAN_UPDATED_EVENT = 'mealplan-updated';
export const MEAL_PLAN_UPDATE_STORAGE_KEY = 'mealai-meal-plan-update';

export type MealPlanUpdateDetail = {
  updatedAt: number;
  weekStart?: string;
  planId?: string;
  mutation?: string;
  source?: string;
};

export function normalizeWeekStart(value: unknown): string | undefined {
  if (!value) return undefined;
  const text = String(value);
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(text);
  return match?.[1];
}

export function getStoredMealPlanUpdateVersion(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(MEAL_PLAN_UPDATE_STORAGE_KEY);
}

export function parseMealPlanUpdateVersion(value: string | null): MealPlanUpdateDetail | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<MealPlanUpdateDetail>;
    if (!parsed || typeof parsed.updatedAt !== 'number') return null;
    return {
      updatedAt: parsed.updatedAt,
      weekStart: normalizeWeekStart(parsed.weekStart),
      planId: parsed.planId,
      mutation: parsed.mutation,
      source: parsed.source,
    };
  } catch {
    return null;
  }
}

export function notifyMealPlanChanged(detail: Partial<MealPlanUpdateDetail> = {}) {
  if (typeof window === 'undefined') return;

  const payload: MealPlanUpdateDetail = {
    updatedAt: Date.now(),
    weekStart: normalizeWeekStart(detail.weekStart),
    planId: detail.planId,
    mutation: detail.mutation,
    source: detail.source,
  };

  window.localStorage.setItem(MEAL_PLAN_UPDATE_STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent(MEAL_PLAN_UPDATED_EVENT, { detail: payload }));
}

export function getMealPlanUpdateDetailFromEvent(event: Event): MealPlanUpdateDetail | null {
  const detail = event instanceof CustomEvent ? event.detail : null;
  if (!detail) return null;

  if (typeof detail.updatedAt === 'number') {
    return {
      updatedAt: detail.updatedAt,
      weekStart: normalizeWeekStart(detail.weekStart),
      planId: detail.planId,
      mutation: detail.mutation,
      source: detail.source,
    };
  }

  const result = detail.result || detail.actionTaken?.result;
  const args = detail.args || detail.actionTaken?.args;
  return {
    updatedAt: Date.now(),
    weekStart: normalizeWeekStart(result?.weekStart || args?.weekStart),
    planId: result?.id || result?.planId || args?.planId,
    mutation: detail.name || detail.action,
    source: 'legacy-event',
  };
}
