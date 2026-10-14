import React from 'react';
import { AlertCircle, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { RecommendationItem } from '../types/analysis';

interface RecommendationCardProps {
  item: RecommendationItem;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ item }) => {
  const getBadge = () => {
    switch (item.priority) {
      case 'critical':
        return {
          icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
          label: 'CRITICAL',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
          borderClass: 'border-l-4 border-l-rose-500 bg-rose-50/20',
        };
      case 'important':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
          label: 'IMPORTANT',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
          borderClass: 'border-l-4 border-l-amber-500 bg-amber-50/20',
        };
      case 'improve':
        return {
          icon: <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0" />,
          label: 'IMPROVE',
          badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          borderClass: 'border-l-4 border-l-indigo-500 bg-indigo-50/20',
        };
      case 'good':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
          label: 'GOOD',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          borderClass: 'border-l-4 border-l-emerald-500 bg-emerald-50/20',
        };
    }
  };

  const badge = getBadge();

  return (
    <div className={`p-4 rounded-xl border border-slate-200/90 bg-white shadow-xs ${badge.borderClass}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {badge.icon}
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border tracking-wide uppercase ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <span className="text-xs font-semibold text-slate-500">• {item.category}</span>
        </div>
        {item.slideRef && (
          <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
            Slide {item.slideRef}
          </span>
        )}
      </div>

      <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
    </div>
  );
};
