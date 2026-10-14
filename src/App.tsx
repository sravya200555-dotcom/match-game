import React, { useState } from 'react';
import {
  Gamepad2,
  FileCheck2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { MemoryMatchGame } from './components/MemoryMatchGame';
import { LandingPage } from './components/LandingPage';
import { FileUploader } from './components/FileUploader';
import { AnalysisProgress } from './components/AnalysisProgress';
import { Dashboard } from './components/Dashboard';
import { ExtractedPresentation, AnalysisReport } from './types/analysis';
import { requestPresentationAnalysis } from './services/analyzerService';
import { generateLocalMockReport } from './utils/mockData';

export function App() {
  // Navigation mode: 'game' (Memory Match browser game) or 'analyzer' (SlideCheck AI)
  const [appMode, setAppMode] = useState<'game' | 'analyzer'>('game');

  // SlideCheck AI state
  const [currentView, setCurrentView] = useState<'landing' | 'upload' | 'analyzing' | 'dashboard'>('landing');
  const [presentation, setPresentation] = useState<ExtractedPresentation | null>(null);
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);
  const [analysisStepIndex, setAnalysisStepIndex] = useState<number>(0);

  const handleStartSampleDemo = async () => {
    const samplePresentation: ExtractedPresentation = {
      fileName: 'Q3_Executive_Strategy_Review.pptx',
      fileSizeBytes: 2450000,
      slideCount: 8,
      slides: [
        {
          slideNumber: 1,
          title: 'Q3 Executive Business & Strategy Review',
          fullText: 'Q3 Executive Business & Strategy Review\nAccelerating Global Market Expansion\nPresented by Leadership Team • October 2026',
          paragraphs: [
            'Q3 Executive Business & Strategy Review',
            'Accelerating Global Market Expansion',
            'Presented by Leadership Team • October 2026',
          ],
          wordCount: 16,
          bulletCount: 0,
          hasImages: true,
          imageCount: 1,
        },
        {
          slideNumber: 2,
          title: 'Executive Summary & Key Milestones',
          fullText: 'Executive Summary\n• Net ARR expanded by 34% YoY exceeding market estimates\n• Our team have achieved rapid growth in Q3 across enterprise segments\n• Gross retention stabilized at 98.4%',
          paragraphs: [
            'Executive Summary',
            '• Net ARR expanded by 34% YoY exceeding market estimates',
            '• Our team have achieved rapid growth in Q3 across enterprise segments',
            '• Gross retention stabilized at 98.4%',
          ],
          wordCount: 26,
          bulletCount: 3,
          hasImages: false,
          imageCount: 0,
        },
        {
          slideNumber: 3,
          title: 'Market Opportunity & Competitive Moat',
          fullText: 'Market Opportunity & Total Addressable Market\n• Cloud transformation market poised to exceed $450B by 2028\n• Proprietary AI engine provides defensible data barrier\n• Enterprise client acquisition costs decreased by 18%',
          paragraphs: [
            'Market Opportunity & Total Addressable Market',
            '• Cloud transformation market poised to exceed $450B by 2028',
            '• Proprietary AI engine provides defensible data barrier',
            '• Enterprise client acquisition costs decreased by 18%',
          ],
          wordCount: 32,
          bulletCount: 3,
          hasImages: true,
          imageCount: 1,
        },
        {
          slideNumber: 4,
          title: 'Operational Challenges & Headwinds in Q3',
          fullText: 'Operational Challenges & Headwinds in Q3\nDuring the third quarter, we observed several operational bottlenecks in our supply-chain pipelines that impacted delivery speed across three geographical clusters. While our core customer base demonstrated sustained appetite, our customer onboarding time lengthened from 12 days to 28 days due to delayed security clearance protocols. Furthermore, impact on revenue are substantial across all departments requiring immediate alignment.',
          paragraphs: [
            'Operational Challenges & Headwinds in Q3',
            'During the third quarter, we observed several operational bottlenecks in our supply-chain pipelines that impacted delivery speed across three geographical clusters.',
            'While our core customer base demonstrated sustained appetite, our customer onboarding time lengthened from 12 days to 28 days due to delayed security clearance protocols.',
            'Furthermore, impact on revenue are substantial across all departments requiring immediate alignment.',
          ],
          wordCount: 68,
          bulletCount: 0,
          hasImages: false,
          imageCount: 0,
        },
        {
          slideNumber: 5,
          title: 'Financial Highlights & Cash Flow Run Rate',
          fullText: 'Financial Performance\n• Gross Margin: 78.5% (+220 bps YoY)\n• Operating Cash Flow: $42.6M positive\n• Cash and Equivalents: $184M on balance sheet',
          paragraphs: [
            'Financial Performance',
            '• Gross Margin: 78.5% (+220 bps YoY)',
            '• Operating Cash Flow: $42.6M positive',
            '• Cash and Equivalents: $184M on balance sheet',
          ],
          wordCount: 25,
          bulletCount: 3,
          hasImages: true,
          imageCount: 1,
        },
        {
          slideNumber: 6,
          title: 'Product Roadmap & Engineering Priorities',
          fullText: 'Product Roadmap\n• Deploy Gemini LLM automated reasoning pipeline\n• Enhance zero-trust enterprise compliance certification\n• Launch real-time collaborative workspace canvas',
          paragraphs: [
            'Product Roadmap',
            '• Deploy Gemini LLM automated reasoning pipeline',
            '• Enhance zero-trust enterprise compliance certification',
            '• Launch real-time collaborative workspace canvas',
          ],
          wordCount: 22,
          bulletCount: 3,
          hasImages: false,
          imageCount: 0,
        },
        {
          slideNumber: 7,
          title: 'Go-to-Market Expansion Strategy',
          fullText: 'GTM Strategy\n• Expand EMEA direct enterprise sales coverage\n• Deepen cloud hyperscaler marketplace distribution\n• Accelerate developer ecosystem integrations',
          paragraphs: [
            'GTM Strategy',
            '• Expand EMEA direct enterprise sales coverage',
            '• Deepen cloud hyperscaler marketplace distribution',
            '• Accelerate developer ecosystem integrations',
          ],
          wordCount: 19,
          bulletCount: 3,
          hasImages: true,
          imageCount: 1,
        },
        {
          slideNumber: 8,
          title: 'Conclusion & Key Executive Ask',
          fullText: 'Conclusion & Next Steps\n• Reaffirm full-year operating guidance\n• Authorize Q4 European regional expansion capital budget\n• Next board review: December 14, 2026',
          paragraphs: [
            'Conclusion & Next Steps',
            '• Reaffirm full-year operating guidance',
            '• Authorize Q4 European regional expansion capital budget',
            '• Next board review: December 14, 2026',
          ],
          wordCount: 21,
          bulletCount: 3,
          hasImages: false,
          imageCount: 0,
        },
      ],
    };

    handleStartAnalysis(samplePresentation);
  };

  const handleStartAnalysis = async (extracted: ExtractedPresentation) => {
    setPresentation(extracted);
    setCurrentView('analyzing');
    setAnalysisStepIndex(0);

    try {
      const report = await requestPresentationAnalysis(extracted, (stepIdx) => {
        setAnalysisStepIndex(stepIdx);
      });
      setAnalysisReport(report);
      setCurrentView('dashboard');
    } catch {
      const fallbackReport = generateLocalMockReport(extracted);
      setAnalysisReport(fallbackReport);
      setCurrentView('dashboard');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${appMode === 'game' ? 'bg-[#090b14] text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans`}>
      {/* Universal Top Bar with App Switcher */}
      <header className={`sticky top-0 z-40 ${appMode === 'game' ? 'bg-[#0d1124]/90 border-slate-800' : 'bg-white/90 border-slate-200/80'} backdrop-blur-md border-b px-4 sm:px-8 py-3 flex items-center justify-between`}>
        {/* Brand */}
        <div className="flex items-center gap-3">
          {appMode === 'game' ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-sky-400 flex items-center justify-center text-white shadow-sm">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight font-display bg-gradient-to-r from-white via-purple-200 to-sky-400 bg-clip-text text-transparent">
                MEMORY MATCH
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight font-display text-slate-900">
                SlideCheck AI
              </span>
            </div>
          )}
        </div>

        {/* Right Action: Download Project Zip & Mode Switcher */}
        <div className="flex items-center gap-3">
          <a
            href="/api/download-zip"
            download="memory-match-project.zip"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="hidden sm:inline">Download ZIP</span>
            <span className="sm:hidden">ZIP</span>
          </a>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs font-semibold">
            <button
              onClick={() => setAppMode('game')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                appMode === 'game'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Memory Match Game</span>
              <span className="sm:hidden">Game</span>
            </button>
            <button
              onClick={() => setAppMode('analyzer')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                appMode === 'analyzer'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PPT Analyzer</span>
              <span className="sm:hidden">PPT</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {appMode === 'game' ? (
          <MemoryMatchGame />
        ) : (
          <div className="flex-1 flex flex-col bg-slate-50 text-slate-900">
            {currentView === 'landing' && (
              <LandingPage
                onAnalyzeClick={() => setCurrentView('upload')}
                onHowItWorksClick={() => {
                  const el = document.getElementById('how-it-works');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                onSampleDemoClick={handleStartSampleDemo}
              />
            )}

            {currentView === 'upload' && (
              <section className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div className="text-center mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    Upload & Inspect
                  </span>
                  <h2 className="text-3xl font-extrabold text-slate-900 mt-2 font-display">
                    Upload Your PowerPoint File
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    We'll extract the slides and run an AI quality assessment on content, design, and structure.
                  </p>
                </div>

                <FileUploader
                  onPresentationReady={handleStartAnalysis}
                  onStartSampleDemo={handleStartSampleDemo}
                />
              </section>
            )}

            {currentView === 'analyzing' && presentation && (
              <section className="flex-1 flex flex-col items-center justify-center px-4 py-16">
                <AnalysisProgress
                  currentStepIndex={analysisStepIndex}
                  fileName={presentation.fileName}
                  slideCount={presentation.slideCount}
                />
              </section>
            )}

            {currentView === 'dashboard' && analysisReport && (
              <Dashboard
                report={analysisReport}
                onReset={() => {
                  setPresentation(null);
                  setAnalysisReport(null);
                  setCurrentView('upload');
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t ${appMode === 'game' ? 'border-slate-800/80 bg-[#090b14] text-slate-500' : 'border-slate-200/80 bg-white text-slate-400'} py-4 px-4 sm:px-8 text-center text-xs`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Gaming & AI Studio Arcade • All rights reserved</p>
          <div className="flex items-center gap-3">
            <span>Memory Match Game</span>
            <span>•</span>
            <span>SlideCheck AI Analyzer</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
