import React, { useState } from 'react';
import {
  FileText,
  Download,
  Share2,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Eye,
  Type,
  Palette,
  Layout,
  Clock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnalysisReport, SlideAnalysisItem } from '../types/analysis';
import { ScoreRing } from './ScoreRing';
import { CategoryScoreCard } from './CategoryScoreCard';
import { SlideCard } from './SlideCard';
import { SlideDetailModal } from './SlideDetailModal';
import { RecommendationCard } from './RecommendationCard';

interface DashboardProps {
  report: AnalysisReport;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ report, onReset }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'slides' | 'content' | 'design' | 'readability' | 'grammar' | 'recommendations'>('overview');
  const [selectedSlide, setSelectedSlide] = useState<SlideAnalysisItem | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Trigger celebration confetti for high-performing presentations
  React.useEffect(() => {
    if (report.overallScore >= 80) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366F1', '#8B5CF6', '#10B981'],
      });
    }
  }, [report.overallScore]);

  const handlePrintPdf = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 200);
  };

  const handleNavigateSlide = (direction: 'prev' | 'next') => {
    if (!selectedSlide) return;
    const currentIndex = report.slides.findIndex((s) => s.slideNumber === selectedSlide.slideNumber);
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedSlide(report.slides[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < report.slides.length - 1) {
      setSelectedSlide(report.slides[currentIndex + 1]);
    }
  };

  const currentSlideIndex = selectedSlide
    ? report.slides.findIndex((s) => s.slideNumber === selectedSlide.slideNumber)
    : -1;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in print:p-0">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Quality Analysis Complete</span>
            <span>•</span>
            <span className="text-slate-400">{report.analyzedAt}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            {report.fileName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {report.slideCount} Slides Analyzed • File Size {(report.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 print:hidden">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </button>

          <button
            onClick={handlePrintPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shadow-indigo-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Preparing PDF...' : 'Export PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Hero Score Showcase */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Overall Score Circle Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm flex flex-col items-center justify-center text-center">
          <ScoreRing score={report.overallScore} size={200} strokeWidth={16} label="Overall Presentation Score" />
          <p className="mt-4 text-xs text-slate-500 max-w-xs leading-relaxed">
            Calculated across content quality, design balance, readability density, and grammar accuracy.
          </p>
        </div>

        {/* Executive Summary & Readiness Banner */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Executive Synthesis
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{report.presentationReadiness}% Ready to Present</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">
              {report.overallScore >= 80 ? 'Ready for High-Stakes Stakeholder Review' : 'Polish Required Before Executive Delivery'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {report.summary}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">Presentation Readiness Verdict</h4>
              <p className="text-xs text-slate-600 mt-0.5">{report.readinessVerdict}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Scores Grid */}
      <div className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
          Core Dimension Scorecard
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <CategoryScoreCard
            title="Content"
            score={report.contentScore}
            iconName="content"
            description="Clarity & substance"
          />
          <CategoryScoreCard
            title="Design"
            score={report.designScore}
            iconName="design"
            description="Visual hierarchy"
          />
          <CategoryScoreCard
            title="Readability"
            score={report.readabilityScore}
            iconName="readability"
            description="Density & wording"
          />
          <CategoryScoreCard
            title="Consistency"
            score={report.consistencyScore}
            iconName="consistency"
            description="Theme & styling"
          />
          <CategoryScoreCard
            title="Grammar"
            score={report.grammarScore}
            iconName="grammar"
            description="Syntax & phrasing"
          />
          <CategoryScoreCard
            title="Structure"
            score={report.structureScore}
            iconName="structure"
            description="Logical flow"
          />
        </div>
      </div>

      {/* Navigation Tabs for Deep Dive Sections */}
      <div className="mt-10 border-b border-slate-200 print:hidden">
        <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto pb-px" aria-label="Tabs">
          {[
            { id: 'overview', label: 'Slide-by-Slide' },
            { id: 'content', label: 'Content Analysis' },
            { id: 'design', label: 'Design Score' },
            { id: 'readability', label: 'Readability' },
            { id: 'grammar', label: 'Grammar' },
            { id: 'recommendations', label: 'AI Recommendations' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-xs sm:text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="mt-8">
        {/* TAB 1: Slide-by-Slide Analysis */}
        {activeTab === 'overview' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Slide-by-Slide Analysis</h3>
                <p className="text-xs text-slate-500">
                  Click any slide card to inspect detailed text, problems, and specific enhancements.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {report.slides.length} slides examined
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {report.slides.map((s) => (
                <SlideCard
                  key={s.slideNumber}
                  slide={s}
                  isSelected={selectedSlide?.slideNumber === s.slideNumber}
                  onSelect={() => setSelectedSlide(s)}
                />
              ))}
            </div>
          </section>
        )}

        {/* TAB 2: Content Analysis */}
        {activeTab === 'content' && (
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display mb-1">Content Analysis</h3>
              <p className="text-xs text-slate-500">
                Audited for content clarity, logical narrative flow, relevance, density, and key takeaway presence.
              </p>
            </div>

            <div className="space-y-3">
              {report.contentFindings.map((finding, idx) => {
                const getIcon = () => {
                  if (finding.type === 'good') return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
                  if (finding.type === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
                  return <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
                };

                const getBg = () => {
                  if (finding.type === 'good') return 'bg-emerald-50/50 border-emerald-100 text-emerald-950';
                  if (finding.type === 'warning') return 'bg-amber-50/50 border-amber-100 text-amber-950';
                  return 'bg-rose-50/50 border-rose-100 text-rose-950';
                };

                return (
                  <div key={idx} className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${getBg()}`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getIcon()}</div>
                      <div>
                        <h4 className="text-sm font-bold">{finding.title}</h4>
                        <p className="text-xs mt-0.5 opacity-90">{finding.description}</p>
                      </div>
                    </div>
                    {finding.slideRef && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/80 border border-slate-200 shrink-0">
                        Slide {finding.slideRef}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TAB 3: Design Analysis */}
        {activeTab === 'design' && (
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Design & Layout Analysis</h3>
                <p className="text-xs text-slate-500">
                  Evaluates typography consistency, layout harmony, contrast, and visual hierarchy.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-indigo-600 tabular-nums font-display">
                  {report.designMetrics.designScore}
                </span>
                <span className="text-xs text-slate-400">/100 Design Score</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Font Consistency</span>
                <h4 className="text-base font-extrabold text-slate-900 mt-1">{report.designMetrics.fontConsistencyRating}</h4>
                <div className="mt-2 text-xs text-slate-600">
                  Fonts detected:{' '}
                  <span className="font-semibold">{report.designMetrics.fontFamiliesDetected.join(', ')}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Color Harmony</span>
                <h4 className="text-base font-extrabold text-slate-900 mt-1">{report.designMetrics.colorPaletteConsistency}</h4>
                <p className="mt-2 text-xs text-slate-600">Palette adheres to corporate primary & secondary guidelines.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visual Hierarchy</span>
                <h4 className="text-base font-extrabold text-slate-900 mt-1">{report.designMetrics.visualHierarchyRating}</h4>
                <p className="mt-2 text-xs text-slate-600">Title scale vs body content separation is distinct.</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Image & Graphic Usage</h5>
                <p className="text-xs text-slate-600 leading-relaxed">{report.designMetrics.imageUsageAssessment}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Alignment & Spacing</h5>
                <p className="text-xs text-slate-600 leading-relaxed">{report.designMetrics.alignmentAndSpacing}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Layout Variety</h5>
                <p className="text-xs text-slate-600 leading-relaxed">{report.designMetrics.layoutVariety}</p>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: Readability Analysis */}
        {activeTab === 'readability' && (
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Readability & Text Density</h3>
                <p className="text-xs text-slate-500">
                  Measures audience cognitive load, reading duration, and word count distribution.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-blue-600 tabular-nums font-display">
                  {report.readabilityMetrics.readabilityScore}
                </span>
                <span className="text-xs text-slate-400">/100 Readability</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Avg Words per Slide</span>
                <div className="text-3xl font-black text-slate-900 mt-1 font-display">
                  {report.readabilityMetrics.averageWordsPerSlide}
                </div>
                <span className="text-xs text-slate-500">Benchmark: 25-45 words</span>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Est. Reading Time</span>
                <div className="text-3xl font-black text-slate-900 mt-1 font-display flex items-baseline gap-1">
                  <span>{report.readabilityMetrics.estimatedReadingTimeMinutes}</span>
                  <span className="text-sm font-semibold text-slate-500">mins</span>
                </div>
                <span className="text-xs text-slate-500">At standard 130 WPM scan pace</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Density Rating</span>
                <div className="text-xl font-black text-slate-900 mt-2 font-display">
                  {report.readabilityMetrics.textDensityRating}
                </div>
                <span className="text-xs text-slate-500">Cognitive load evaluation</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Specific Word Count Warnings</h4>
              {report.readabilityMetrics.wordCountWarnings.map((warning, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{warning}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Bullet Length & Formatting Best Practice: </span>
              <span>{report.readabilityMetrics.bulletPointGuidance}</span>
            </div>
          </section>
        )}

        {/* TAB 5: Grammar Analysis */}
        {activeTab === 'grammar' && (
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Grammar & Spelling Audit</h3>
                <p className="text-xs text-slate-500">
                  Detects spelling errors, subject-verb disagreements, and awkward sentence phrasing.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-teal-600 tabular-nums font-display">
                  {report.grammarScore}
                </span>
                <span className="text-xs text-slate-400">/100 Grammar</span>
              </div>
            </div>

            {report.grammarIssues.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-emerald-50/50 border border-emerald-100">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-emerald-900">No Grammar or Spelling Flaws Detected</h4>
                <p className="text-xs text-emerald-700 mt-1">All examined slide text passed spelling and grammatical consistency checks.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {report.grammarIssues.map((issue, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                        Slide {issue.slideNumber}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">Issue #{idx + 1}</span>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-800 font-mono">
                        <span className="font-bold text-rose-900 mr-2">Original:</span>
                        "{issue.original}"
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 font-mono">
                        <span className="font-bold text-emerald-900 mr-2">Suggested:</span>
                        "{issue.suggested}"
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 italic mt-1">{issue.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 6: AI Recommendations */}
        {activeTab === 'recommendations' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Prioritized Recommendations</h3>
                <p className="text-xs text-slate-500">
                  Categorized by urgency: Critical fixes, Important upgrades, and polishing improvements.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.recommendations.map((item, idx) => (
                <RecommendationCard key={idx} item={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Presentation Readiness Final Action Block */}
      <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Presentation Readiness Summary</span>
          </div>
          <h3 className="text-2xl font-extrabold font-display">
            {report.presentationReadiness}% Ready for Executive Delivery
          </h3>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            {report.readinessVerdict}
          </p>
        </div>

        <button
          onClick={handlePrintPdf}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-sm font-bold shadow-lg shadow-black/20 shrink-0 transition-transform hover:scale-[1.02]"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          <span>Generate Improvement Report (PDF)</span>
        </button>
      </div>

      {/* Slide Detail Modal Popup */}
      <SlideDetailModal
        slide={selectedSlide}
        onClose={() => setSelectedSlide(null)}
        onNavigateSlide={handleNavigateSlide}
        hasPrev={currentSlideIndex > 0}
        hasNext={currentSlideIndex < report.slides.length - 1}
      />
    </div>
  );
};
