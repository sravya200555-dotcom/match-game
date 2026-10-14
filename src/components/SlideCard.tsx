import React from 'react';
import { AlertCircle, AlertTriangle, Lightbulb, CheckCircle, ChevronRight, Eye } from 'lucide-react';
import { SlideAnalysisItem } from '../types/analysis';

interface SlideCardProps {
  slide: SlideAnalysisItem;
  isSelected: boolean;
  onSelect: () => void;
}

export const SlideCard: React.FC<SlideCardProps> = ({ slide, isSelected, onSelect }) => {
  const getBadgeColor = (val: number) => {
    if (val >= 85) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (val >= 75) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    if (val >= 60) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-rose-100 text-rose-800 border-rose-200';
  };

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border transition-all duration-200 p-5 cursor-pointer text-left ${
        isSelected
          ? 'bg-indigo-50/50 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
          : 'bg-white border-slate-200/90 hover:border-indigo-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          {/* Slide Thumbnail Preview Container */}
          <div className="w-12 h-9 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between p-1.5 shadow-xs shrink-0 text-[7px] text-slate-300 font-mono select-none overflow-hidden">
            <div className="h-1 bg-indigo-400 rounded-xs w-3/4" />
            <div className="space-y-0.5">
              <div className="h-0.5 bg-slate-600 rounded-xs w-full" />
              <div className="h-0.5 bg-slate-700 rounded-xs w-2/3" />
            </div>
            <div className="text-[6px] text-slate-400 font-bold self-end">#{slide.slideNumber}</div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{slide.title}</h4>
            <span className="text-xs text-slate-400 font-medium">
              Slide {slide.slideNumber} • {slide.wordCount} words
            </span>
          </div>
        </div>

        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border tabular-nums ${getBadgeColor(slide.score)}`}>
          {slide.score}/100
        </span>
      </div>

      {/* Snippet preview */}
      <p className="text-xs text-slate-500 line-clamp-2 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono">
        {slide.extractedSnippet || 'No text extracted on this slide.'}
      </p>

      {/* Problems & Recommendations Preview */}
      <div className="space-y-1.5 text-xs">
        {slide.issues.length > 0 && (
          <div className="flex items-center gap-1.5 text-rose-700 font-medium line-clamp-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
            <span className="truncate">{slide.issues[0]}</span>
          </div>
        )}
        {slide.recommendations.length > 0 && (
          <div className="flex items-center gap-1.5 text-indigo-700 font-medium line-clamp-1">
            <Lightbulb className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
            <span className="truncate">{slide.recommendations[0]}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          <span>Inspect details</span>
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
      </div>
    </div>
  );
};
