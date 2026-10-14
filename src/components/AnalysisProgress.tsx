import React from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface AnalysisProgressProps {
  currentStepIndex: number;
  fileName: string;
  slideCount: number;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  currentStepIndex,
  fileName,
  slideCount,
}) => {
  const steps = [
    'Extracting slide content',
    'Checking readability',
    'Analyzing structure',
    'Evaluating design',
    'Checking consistency',
    'Generating recommendations',
  ];

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xl shadow-slate-100 text-center animate-fade-in">
      <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
        <Sparkles className="w-8 h-8 animate-pulse" />
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-1 font-display">
        Analyzing your presentation…
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Evaluating <span className="font-semibold text-slate-700">{fileName}</span> ({slideCount} slides)
      </p>

      {/* Progress Bars */}
      <div className="space-y-3 text-left mb-6 max-w-md mx-auto">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={step}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-200/70 text-emerald-900'
                  : isCurrent
                  ? 'bg-indigo-50/60 border-indigo-200 text-indigo-950 shadow-sm'
                  : 'bg-slate-50/40 border-slate-100 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-indigo-600 animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                )}
                <span className="text-xs sm:text-sm font-medium">{step}</span>
              </div>

              <span className="text-xs font-semibold">
                {isDone ? 'Complete' : isCurrent ? 'Analyzing...' : 'Waiting'}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400">
        SlideCheck AI examines typography hierarchy, text density, color harmony, and logical flow.
      </p>
    </div>
  );
};
