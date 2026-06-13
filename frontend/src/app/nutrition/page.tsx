'use client';

import { useCallback, useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { mealPlanAPI, recommendationAPI } from '@/lib/api';
import {
  getMealPlanUpdateDetailFromEvent,
  getStoredMealPlanUpdateVersion,
  MEAL_PLAN_UPDATED_EVENT,
  MEAL_PLAN_UPDATE_STORAGE_KEY,
  parseMealPlanUpdateVersion,
} from '@/lib/mealPlanEvents';
import { NutrientByDayChart, WeeklyCaloriesChart } from '@/components/NutritionCharts';
import NutritionTabs, { type NutritionTab } from '@/components/nutrition/NutritionTabs';
import {
  HiArrowLeft,
  HiChartBar,
  HiCheckCircle,
  HiExclamationCircle,
  HiLightBulb,
  HiSparkles,
  HiTrendingUp,
} from 'react-icons/hi';

type DailyNutrition = {
  day: number;
  label: string;
  date?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  dishCount: number;
};

type NutritionData = {
  daily: DailyNutrition[];
  weeklyAvg: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  macroDistribution: {
    proteinPercent?: number;
    carbsPercent?: number;
    fatPercent?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  calorieTarget: number;
  totalDishes: number;
};

type AIAnalysis = {
  score?: number;
  nutritionScore?: number;
  strengths?: string[];
  warnings?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  analysis?: string;
};

const TAB_STORAGE_KEY = 'mealai-nutrition-active-tab';

const formatDateInput = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const getMonday = () => {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return formatDateInput(date);
};

const formatNumber = (value?: number | string) =>
  Math.round(Number(value) || 0).toLocaleString('vi-VN');

const hasNutritionData = (data: NutritionData | null) => {
  if (!data) return false;
  const totalDishes =
    Number(data.totalDishes) ||
    data.daily.reduce((sum, day) => sum + (Number(day.dishCount) || 0), 0);
  return totalDishes > 0;
};

export default function NutritionPage() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [nutrition, setNutrition] = useState<NutritionData | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [weekStart] = useState(() => getMonday());
  const [activeTab, setActiveTab] = useState<NutritionTab>(() => {
    if (typeof window === 'undefined') return 'nutrition-data';
    const savedTab = window.localStorage.getItem(TAB_STORAGE_KEY) as NutritionTab | null;
    return savedTab === 'nutrition-data' || savedTab === 'ai-insights' ? savedTab : 'nutrition-data';
  });
  const nutritionRef = useRef<NutritionData | null>(null);
  const lastMealPlanVersionRef = useRef<string | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    nutritionRef.current = nutrition;
  }, [nutrition]);

  const fetchNutritionData = useCallback(async ({ showLoading = true } = {}) => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (showLoading) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError(null);
    setAnalysisError(null);

    try {
      let nextNutrition: NutritionData | null = null;
      const mealPlanResponse = await mealPlanAPI.get(weekStart);
      const currentPlan = mealPlanResponse.data;

      if (currentPlan?.id) {
        const nutritionResponse = await mealPlanAPI.getNutrition(currentPlan.id);
        nextNutrition = nutritionResponse.data;
      }

      setNutrition(hasNutritionData(nextNutrition) ? nextNutrition : null);

      try {
        const aiAnalysisResponse = await recommendationAPI.getNutritionAnalysis(weekStart);
        setAnalysis(aiAnalysisResponse.data);
      } catch (analysisFetchError) {
        console.error('Error fetching AI nutrition analysis:', analysisFetchError);
        setAnalysis(null);
        setAnalysisError('Không thể tải phân tích AI cho thực đơn hiện tại. Vui lòng thử lại.');
      }

      lastMealPlanVersionRef.current = getStoredMealPlanUpdateVersion();
    } catch (fetchError) {
      console.error('Error fetching nutrition data:', fetchError);
      setNutrition(null);
      setAnalysis(null);
      setError('Không thể tải dữ liệu dinh dưỡng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, weekStart]);

  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      fetchNutritionData();
    }, 0);

    return () => clearTimeout(timer);
  }, [user, fetchNutritionData]);

  const scheduleNutritionRefresh = useCallback((showLoading = false) => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    refreshTimerRef.current = setTimeout(() => {
      fetchNutritionData({ showLoading });
    }, 150);
  }, [fetchNutritionData]);

  useEffect(() => {
    if (!user) return;

    const shouldRefreshForWeek = (eventWeekStart?: string) =>
      !eventWeekStart || eventWeekStart === weekStart;

    const handleMealPlanUpdated = (event: Event) => {
      const detail = getMealPlanUpdateDetailFromEvent(event);
      if (!shouldRefreshForWeek(detail?.weekStart)) return;
      scheduleNutritionRefresh(!nutritionRef.current);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== MEAL_PLAN_UPDATE_STORAGE_KEY) return;
      const detail = parseMealPlanUpdateVersion(event.newValue);
      if (!shouldRefreshForWeek(detail?.weekStart)) return;
      scheduleNutritionRefresh(!nutritionRef.current);
    };

    const refreshIfStoredVersionChanged = () => {
      const nextVersion = getStoredMealPlanUpdateVersion();
      if (!nextVersion || nextVersion === lastMealPlanVersionRef.current) return;

      const detail = parseMealPlanUpdateVersion(nextVersion);
      if (!shouldRefreshForWeek(detail?.weekStart)) return;
      scheduleNutritionRefresh(!nutritionRef.current);
    };

    window.addEventListener(MEAL_PLAN_UPDATED_EVENT, handleMealPlanUpdated);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', refreshIfStoredVersionChanged);
    window.addEventListener('pageshow', refreshIfStoredVersionChanged);
    document.addEventListener('visibilitychange', refreshIfStoredVersionChanged);

    return () => {
      window.removeEventListener(MEAL_PLAN_UPDATED_EVENT, handleMealPlanUpdated);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', refreshIfStoredVersionChanged);
      window.removeEventListener('pageshow', refreshIfStoredVersionChanged);
      document.removeEventListener('visibilitychange', refreshIfStoredVersionChanged);
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, [user, weekStart, scheduleNutritionRefresh]);

  useEffect(() => {
    if (!user || pathname !== '/nutrition') return;

    const nextVersion = getStoredMealPlanUpdateVersion();
    if (!nextVersion || nextVersion === lastMealPlanVersionRef.current) return;

    const detail = parseMealPlanUpdateVersion(nextVersion);
    if (detail?.weekStart && detail.weekStart !== weekStart) return;
    scheduleNutritionRefresh(!nutritionRef.current);
  }, [pathname, user, weekStart, scheduleNutritionRefresh]);

  const handleTabChange = (tab: NutritionTab) => {
    setActiveTab(tab);
    localStorage.setItem(TAB_STORAGE_KEY, tab);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl border border-gray-100 bg-white p-10 shadow-sm">
            <HiChartBar className="mx-auto mb-4 h-14 w-14 text-brand-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Dinh dưỡng & AI Insights</h1>
            <p className="mt-3 text-gray-600">
              Vui lòng đăng nhập để xem dữ liệu dinh dưỡng và phân tích AI theo thực đơn của bạn.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex rounded-xl bg-brand-primary px-5 py-3 font-semibold text-white hover:bg-brand-primary-hover"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const trendInsights = nutrition
    ? buildTrendInsights(nutrition.daily, nutrition.weeklyAvg, nutrition.calorieTarget)
    : [];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <PageHeader />
      <NutritionTabs activeTab={activeTab} onChange={handleTabChange} />

      {loading ? (
        <LoadingPanel activeTab={activeTab} />
      ) : error ? (
        <NutritionErrorState message={error} onRetry={() => fetchNutritionData()} />
      ) : activeTab === 'nutrition-data' ? (
        nutrition ? (
          <NutritionDataDashboard
            daily={nutrition.daily}
            weeklyAvg={nutrition.weeklyAvg}
            calorieTarget={nutrition.calorieTarget}
            totalDishes={nutrition.totalDishes}
          />
        ) : (
          <NutritionDataEmptyState />
        )
      ) : analysisError ? (
        <NutritionErrorState message={analysisError} onRetry={() => fetchNutritionData()} />
      ) : (
        <AIInsightsDashboard
          analysis={analysis}
          trendInsights={trendInsights}
          hasNutritionData={Boolean(nutrition)}
        />
      )}

      {refreshing && !loading && (
        <div className="fixed bottom-6 right-6 rounded-full border border-brand-primary/20 bg-white px-4 py-2 text-sm font-semibold text-brand-primary shadow-lg">
          Đang đồng bộ dữ liệu dinh dưỡng...
        </div>
      )}
    </div>
  );
}

function PageHeader() {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary p-6 text-white shadow-lg md:p-8">
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white"
      >
        <HiArrowLeft className="h-4 w-4" />
        Về trang chủ
      </Link>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
            MealAI Health Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">Dinh dưỡng & AI Insights</h1>
          <p className="mt-3 max-w-3xl text-white/90">
            Theo dõi chỉ số dinh dưỡng theo tuần và xem phân tích AI từ thực đơn cá nhân.
          </p>
        </div>
        <div className="rounded-2xl bg-white/15 px-5 py-4 text-sm backdrop-blur">
          <div className="font-semibold">Cập nhật theo thực đơn tuần</div>
          <div className="text-white/80">Dữ liệu lấy từ Meal Planner hiện tại</div>
        </div>
      </div>
    </div>
  );
}

function LoadingPanel({ activeTab }: { activeTab: NutritionTab }) {
  return (
    <section className="space-y-6">
      <div className="h-16 animate-pulse rounded-2xl bg-gray-100" />
      {activeTab === 'nutrition-data' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-80 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-44 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      )}
    </section>
  );
}

function NutritionDataDashboard({
  daily,
  weeklyAvg,
  calorieTarget,
  totalDishes,
}: {
  daily: DailyNutrition[];
  weeklyAvg: NutritionData['weeklyAvg'];
  calorieTarget: number;
  totalDishes: number;
}) {
  return (
    <section className="space-y-6">
      <SectionTitle
        icon={HiChartBar}
        title="Dữ liệu dinh dưỡng"
        description="Các chỉ số bên dưới là số liệu thực tế được tổng hợp từ thực đơn trong tuần."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard
          label="Calories trung bình/ngày"
          value={formatNumber(weeklyAvg.calories)}
          unit="kcal"
          color="bg-orange-50 text-orange-600"
        />
        <MetricCard
          label="Protein"
          value={formatNumber(weeklyAvg.protein)}
          unit="g/ngày"
          color="bg-emerald-50 text-emerald-600"
        />
        <MetricCard
          label="Carbs"
          value={formatNumber(weeklyAvg.carbs)}
          unit="g/ngày"
          color="bg-sky-50 text-sky-600"
        />
        <MetricCard
          label="Fat"
          value={formatNumber(weeklyAvg.fat)}
          unit="g/ngày"
          color="bg-purple-50 text-purple-600"
        />
        <MetricCard
          label="Tổng số món"
          value={formatNumber(totalDishes)}
          unit="món"
          color="bg-slate-50 text-slate-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Calories theo tuần">
          <WeeklyCaloriesChart daily={daily} calorieTarget={calorieTarget} />
        </ChartCard>
        <ChartCard title="Protein theo tuần">
          <NutrientByDayChart daily={daily} nutrient="protein" label="Protein" color="#10b981" />
        </ChartCard>
        <ChartCard title="Carbs theo tuần">
          <NutrientByDayChart daily={daily} nutrient="carbs" label="Carbs" color="#0ea5e9" />
        </ChartCard>
        <ChartCard title="Fat theo tuần">
          <NutrientByDayChart daily={daily} nutrient="fat" label="Fat" color="#8b5cf6" />
        </ChartCard>
      </div>

      <NutritionTable data={daily} target={calorieTarget} />
    </section>
  );
}

function NutritionDataEmptyState() {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
      <HiChartBar className="mx-auto mb-4 h-14 w-14 text-gray-300" />
      <h2 className="text-xl font-bold text-gray-900">Chưa có dữ liệu dinh dưỡng</h2>
      <p className="mx-auto mt-2 max-w-2xl text-gray-600">
        Tab này chỉ hiển thị số liệu thực tế từ Meal Planner. Hãy tạo thực đơn tuần để hệ thống tổng hợp calories, protein, carbs và fat.
      </p>
      <Link
        href="/meal-planner"
        className="mt-6 inline-flex rounded-xl bg-brand-primary px-5 py-3 font-semibold text-white hover:bg-brand-primary-hover"
      >
        Tạo thực đơn
      </Link>
    </section>
  );
}

function NutritionErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <section className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">
      <HiExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-400" />
      <h2 className="text-xl font-bold text-gray-900">Không thể đồng bộ dữ liệu</h2>
      <p className="mx-auto mt-2 max-w-2xl text-gray-600">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex rounded-xl bg-brand-primary px-5 py-3 font-semibold text-white hover:bg-brand-primary-hover"
      >
        Thử lại
      </button>
    </section>
  );
}

function AIInsightsDashboard({
  analysis,
  trendInsights,
  hasNutritionData,
}: {
  analysis: AIAnalysis | null;
  trendInsights: string[];
  hasNutritionData: boolean;
}) {
  const score = analysis?.score ?? analysis?.nutritionScore ?? 0;
  const strengths = analysis?.strengths ?? [];
  const warnings = analysis?.warnings ?? analysis?.weaknesses ?? [];
  const recommendations = analysis?.recommendations ?? [];

  return (
    <section className="space-y-6">
      <SectionTitle
        icon={HiSparkles}
        title="AI Insights"
        description="Phân tích AI tập trung vào điểm mạnh, cảnh báo sức khỏe, xu hướng và đề xuất cải thiện."
      />

      {!analysis ? (
        <AIInsightsEmptyState hasNutritionData={hasNutritionData} />
      ) : (
        <>
          <ScoreCard score={score} summary={analysis.analysis} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <InsightCard
              icon={HiCheckCircle}
              title="Điểm mạnh thực đơn"
              items={strengths}
              emptyText="Chưa phát hiện điểm mạnh nổi bật."
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
            <InsightCard
              icon={HiExclamationCircle}
              title="Cảnh báo sức khỏe"
              items={warnings}
              emptyText="Không có cảnh báo nghiêm trọng."
              color="text-amber-600"
              bg="bg-amber-50"
            />
            <InsightCard
              icon={HiTrendingUp}
              title="Phân tích xu hướng ăn uống"
              items={trendInsights}
              emptyText="Chưa đủ dữ liệu để phân tích xu hướng."
              color="text-sky-600"
              bg="bg-sky-50"
            />
            <InsightCard
              icon={HiLightBulb}
              title="Đề xuất cải thiện từ AI"
              items={recommendations}
              emptyText="Thực đơn hiện tại chưa cần khuyến nghị bổ sung."
              color="text-purple-600"
              bg="bg-purple-50"
            />
          </div>
        </>
      )}
    </section>
  );
}

function AIInsightsEmptyState({ hasNutritionData }: { hasNutritionData: boolean }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
      <HiSparkles className="mx-auto mb-4 h-14 w-14 text-gray-300" />
      <h2 className="text-xl font-bold text-gray-900">Chưa có phân tích AI</h2>
      <p className="mx-auto mt-2 max-w-2xl text-gray-600">
        {hasNutritionData
          ? 'Hệ thống chưa tạo được báo cáo AI cho tuần này. Vui lòng thử lại sau khi Meal Planner có đủ món ăn trong tuần.'
          : 'Tab này cần dữ liệu Meal Planner để AI đánh giá điểm dinh dưỡng, cảnh báo sức khỏe và đề xuất cải thiện.'}
      </p>
      {!hasNutritionData && (
        <Link
          href="/meal-planner"
          className="mt-6 inline-flex rounded-xl bg-brand-primary px-5 py-3 font-semibold text-white hover:bg-brand-primary-hover"
        >
          Tạo thực đơn
        </Link>
      )}
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-2xl bg-brand-primary/10 p-3 text-brand-primary">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="mt-1 text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className={`mb-4 inline-flex rounded-xl px-3 py-2 text-sm font-bold ${color}`}>
        {label}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <span className="pb-1 text-sm font-semibold text-gray-500">{unit}</span>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">{title}</h3>
      <div className="relative h-[300px] w-full">
        {children}
      </div>
    </div>
  );
}

function NutritionTable({ data, target }: { data: DailyNutrition[]; target: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-5">
        <h3 className="text-lg font-bold text-gray-900">Bảng chi tiết dinh dưỡng</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {['Ngày', 'Số món', 'Calories', 'Protein', 'Carbs', 'Fat', 'Đánh giá'].map((heading) => (
                <th
                  key={heading}
                  className="whitespace-nowrap px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {data.map((day) => {
              const evaluation = getDailyEvaluation(day, target);
              return (
                <tr key={day.date || day.day}>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-900">
                    {day.date
                      ? new Date(day.date).toLocaleDateString('vi-VN', {
                          weekday: 'short',
                          day: '2-digit',
                          month: '2-digit',
                        })
                      : day.label}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">{formatNumber(day.dishCount)} món</td>
                  <td className="whitespace-nowrap px-5 py-4">{formatNumber(day.calories)} kcal</td>
                  <td className="whitespace-nowrap px-5 py-4">{formatNumber(day.protein)} g</td>
                  <td className="whitespace-nowrap px-5 py-4">{formatNumber(day.carbs)} g</td>
                  <td className="whitespace-nowrap px-5 py-4">{formatNumber(day.fat)} g</td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${evaluation.className}`}>
                      {evaluation.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getDailyEvaluation(day: DailyNutrition, target: number) {
  const calories = Number(day.calories) || 0;
  const ratio = target > 0 ? calories / target : 0;
  if (ratio < 0.8) {
    return { label: 'Thiếu năng lượng', className: 'bg-amber-50 text-amber-700' };
  }
  if (ratio > 1.15) {
    return { label: 'Cao hơn mục tiêu', className: 'bg-red-50 text-red-700' };
  }
  if ((Number(day.protein) || 0) < 45) {
    return { label: 'Cần tăng đạm', className: 'bg-sky-50 text-sky-700' };
  }
  return { label: 'Cân đối', className: 'bg-emerald-50 text-emerald-700' };
}

function ScoreCard({ score, summary }: { score: number; summary?: string }) {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));

  return (
    <div className="rounded-2xl border border-brand-primary/20 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-primary">
            Điểm dinh dưỡng tổng thể
          </p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-5xl font-black text-gray-900">{normalizedScore}</span>
            <span className="pb-2 text-xl font-bold text-gray-500">/100</span>
          </div>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100 md:max-w-sm">
          <div
            className="h-full rounded-full bg-brand-primary transition-all"
            style={{ width: `${normalizedScore}%` }}
          />
        </div>
      </div>
      {summary && <p className="mt-5 rounded-xl bg-gray-50 p-4 text-gray-700">{summary}</p>}
    </div>
  );
}

function InsightCard({
  icon: Icon,
  title,
  items,
  emptyText,
  color,
  bg,
}: {
  icon: ElementType;
  title: string;
  items: string[];
  emptyText: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className={`rounded-xl p-2 ${bg} ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={`${item}-${index}`} className="rounded-xl bg-gray-50 px-4 py-3 text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl bg-gray-50 px-4 py-3 text-gray-500">{emptyText}</p>
      )}
    </div>
  );
}

function buildTrendInsights(
  daily: DailyNutrition[],
  weeklyAvg: NutritionData['weeklyAvg'],
  calorieTarget: number,
) {
  const insights: string[] = [];
  const lowCalorieDays = daily.filter((day) => Number(day.calories) < calorieTarget * 0.8).length;
  const highFatDays = daily.filter((day) => Number(day.fat) > 75).length;
  const stableProteinDays = daily.filter((day) => Number(day.protein) >= 45).length;

  if (lowCalorieDays >= 3) {
    insights.push(`Ăn thiếu năng lượng trong ${lowCalorieDays} ngày của tuần.`);
  }
  if (highFatDays >= 2) {
    insights.push(`Tiêu thụ chất béo cao hơn mức khuyến nghị trong ${highFatDays} ngày.`);
  }
  if (stableProteinDays >= 5) {
    insights.push('Lượng protein ổn định trong phần lớn các ngày.');
  }
  if ((Number(weeklyAvg.calories) || 0) > calorieTarget * 1.1) {
    insights.push('Calories trung bình tuần đang cao hơn mục tiêu cá nhân.');
  }
  if (insights.length === 0) {
    insights.push('Xu hướng ăn uống tuần này tương đối ổn định so với mục tiêu.');
  }

  return insights;
}
