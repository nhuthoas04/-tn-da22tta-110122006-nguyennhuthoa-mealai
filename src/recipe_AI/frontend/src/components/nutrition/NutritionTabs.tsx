'use client';

import { HiChartBar, HiSparkles } from 'react-icons/hi';

export type NutritionTab = 'nutrition-data' | 'ai-insights';

interface NutritionTabsProps {
  activeTab: NutritionTab;
  onChange: (tab: NutritionTab) => void;
}

const tabs = [
  {
    id: 'nutrition-data' as const,
    label: 'Dữ liệu dinh dưỡng',
    icon: HiChartBar,
  },
  {
    id: 'ai-insights' as const,
    label: 'AI Insights',
    icon: HiSparkles,
  },
];

export default function NutritionTabs({ activeTab, onChange }: NutritionTabsProps) {
  return (
    <div className="rounded-2xl border border-brand-light-border bg-white p-2 shadow-brand-sm">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(tab.id)}
              className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-extrabold transition-all sm:text-base ${
                isActive
                  ? 'border-brand-primary bg-brand-primary text-white shadow-brand-glow'
                  : 'border-brand-light-border bg-white text-slate-700 hover:border-brand-primary/30 hover:bg-brand-primary/5 hover:text-brand-primary'
              }`}
            >
              <Icon className="text-lg" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
