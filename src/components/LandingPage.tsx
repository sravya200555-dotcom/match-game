import React from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Palette,
  Lightbulb,
  UploadCloud,
  Cpu,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface LandingPageProps {
  onAnalyzeClick: () => void;
  onHowItWorksClick: () => void;
  onSampleDemoClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onAnalyzeClick,
  onHowItWorksClick,
  onSampleDemoClick,
}) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Soft background ambient gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-200/40 via-purple-100/30 to-blue-200/30 blur-3xl pointer-events-none rounded-full -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-bold mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI-Powered PowerPoint Quality Analyzer</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] font-display">
            Is Your Presentation <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
              Actually Good?
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload your PPT and let AI analyze its content, design, readability, and presentation quality in seconds.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onAnalyzeClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]"
            >
              <span>Analyze My PPT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onHowItWorksClick}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-base shadow-xs transition-colors"
            >
              See How It Works
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Supports .pptx files • Instant deep analysis • No signup required
          </p>

          <div className="mt-6">
            <button
              onClick={onSampleDemoClick}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-4"
            >
              Or explore with our sample executive deck (Q3 Review.pptx) →
            </button>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Comprehensive Multi-Dimensional Audit
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              SlideCheck AI examines 12 critical pillars of presentation excellence, from typographic rhythm to takeaway clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">
                Content & Narrative Analysis
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Evaluates opening hooks, information density, conclusion impact, and logical flow across every slide in your deck.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-500 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Audience tone suitability</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Missing takeaway alerts</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-purple-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">
                Design & Typography Scoring
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Scans font consistency, color harmonies, whitespace balance, and layout hierarchy so your slides look board-ready.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-500 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Font family drift detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Contrast & alignment audits</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">
                Actionable AI Recommendations
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive prioritized recommendations: Critical fixes, Important upgrades, and polishing enhancements ready to implement.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-500 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Word count reduction targets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Grammar & phrasing fixes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step "How It Works" Section */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3 font-display">
              From File to Executive Dashboard
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm text-center relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-4 font-display">
                1
              </div>
              <div className="w-12 h-12 mx-auto mb-3 text-indigo-600 flex items-center justify-center bg-indigo-50 rounded-xl">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1 font-display">Upload PPT</h4>
              <p className="text-xs text-slate-500">
                Drag and drop your PowerPoint (.pptx) file. All parsing is handled securely.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm text-center relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-4 font-display">
                2
              </div>
              <div className="w-12 h-12 mx-auto mb-3 text-purple-600 flex items-center justify-center bg-purple-50 rounded-xl">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1 font-display">AI Analyzes Slides</h4>
              <p className="text-xs text-slate-500">
                Gemini reviews each slide for clarity, design consistency, grammar, and density.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm text-center relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-4 font-display">
                3
              </div>
              <div className="w-12 h-12 mx-auto mb-3 text-emerald-600 flex items-center justify-center bg-emerald-50 rounded-xl">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1 font-display">Get Quality Report</h4>
              <p className="text-xs text-slate-500">
                Receive overall scores (0-100), slide-by-slide suggestions, and exportable PDF audit.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={onAnalyzeClick}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-colors"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
