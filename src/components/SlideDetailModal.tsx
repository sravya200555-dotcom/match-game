import React from 'react';
import { X, CheckCircle2, AlertCircle, Lightbulb, Type, Palette, FileText, ArrowRight } from 'lucide-react';
import { SlideAnalysisItem } from '../types/analysis';

interface SlideDetailModalProps {
  slide: SlideAnalysisItem | null;
  onClose: () => void;
  onNavigateSlide?: (direction: 'prev' | 'next') => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const SlideDetailModal: React.FC<SlideDetailModalProps> = ({
  slide,
  onClose,
  onNavigateSlide,
  hasPrev,
  hasNext,
}) => {
  if (!slide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs uppercase tracking-wide">
              Slide {slide.slideNumber}
            </span>
            <h3 className="text-base font-bold text-slate-900 truncate max-w-sm">{slide.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-800 bg-white px-3 py-1 rounded-full border border-slate-200">
              {slide.score}/100
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Slide Text Content Card */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Extracted Slide Content</span>
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {slide.wordCount} words • {slide.bulletCount} bullet lines
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto">
              {slide.extractedSnippet}
            </div>
          </div>

          {/* Strengths */}
          {slide.strengths.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Strengths</span>
              </h4>
              <div className="space-y-1.5">
                {slide.strengths.map((str, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Identified Problems */}
          {slide.issues.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Problems Detected</span>
              </h4>
              <div className="space-y-1.5">
                {slide.issues.map((iss, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-50/60 border border-rose-100 text-xs text-rose-900 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{iss}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {slide.recommendations.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                <span>Recommendations</span>
              </h4>
              <div className="space-y-1.5">
                {slide.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950">
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grammar Alerts if any */}
          {slide.grammarAlerts && slide.grammarAlerts.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-teal-600" />
                <span>Grammar & Spelling Suggestion</span>
              </h4>
              <div className="space-y-2">
                {slide.grammarAlerts.map((g, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-teal-50/60 border border-teal-100 text-xs text-teal-950 space-y-1">
                    <div className="text-rose-700 line-through">Original: "{g.original}"</div>
                    <div className="text-emerald-800 font-semibold">Suggested: "{g.suggested}"</div>
                    {g.explanation && <div className="text-slate-500 italic mt-1">{g.explanation}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Design Notes */}
          {slide.designNotes && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
              <Palette className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700">Design Note: </span>
                <span>{slide.designNotes}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex gap-2">
            {onNavigateSlide && (
              <>
                <button
                  disabled={!hasPrev}
                  onClick={() => onNavigateSlide('prev')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                >
                  Previous Slide
                </button>
                <button
                  disabled={!hasNext}
                  onClick={() => onNavigateSlide('next')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
                >
                  Next Slide
                </button>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
