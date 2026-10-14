import React from 'react';
import { BookOpen, Palette, Eye, ShieldCheck, CheckCircle2, GitMerge } from 'lucide-react';

interface CategoryScoreCardProps {
  title: string;
  score: number;
  iconName: 'content' | 'design' | 'readability' | 'consistency' | 'grammar' | 'structure';
  description?: string;
}

export const CategoryScoreCard: React.FC<CategoryScoreCardProps> = ({
  title,
  score,
  iconName,
  description,
}) => {
  const getIcon = () => {
    switch (iconName) {
      case 'content':
        return <BookOpen className="w-5 h-5 text-indigo-600" />;
      case 'design':
        return <Palette className="w-5 h-5 text-violet-600" />;
      case 'readability':
        return <Eye className="w-5 h-5 text-blue-600" />;
      case 'consistency':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'grammar':
        return <CheckCircle2 className="w-5 h-5 text-teal-600" />;
      case 'structure':
        return <GitMerge className="w-5 h-5 text-amber-600" />;
    }
  };

  const getBarColor = (val: number) => {
    if (val >= 85) return 'bg-emerald-500';
    if (val >= 75) return 'bg-indigo-600';
    if (val >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
            {getIcon()}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
            {description && <p className="text-xs text-slate-500">{description}</p>}
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-slate-900 tabular-nums">{score}</span>
          <span className="text-xs text-slate-400 font-medium">/100</span>
        </div>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-700 ease-out ${getBarColor(score)}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
};
