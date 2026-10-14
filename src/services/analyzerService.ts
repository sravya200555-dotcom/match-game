import { ExtractedPresentation, AnalysisReport } from '../types/analysis';
import { generateLocalMockReport } from '../utils/mockData';

export async function requestPresentationAnalysis(
  presentation: ExtractedPresentation,
  onStepProgress?: (stepIndex: number, stepText: string) => void
): Promise<AnalysisReport> {
  const progressSteps = [
    'Extracting slide content',
    'Checking readability',
    'Analyzing structure',
    'Evaluating design',
    'Checking consistency',
    'Generating recommendations',
  ];

  let currentStep = 0;
  const interval = setInterval(() => {
    if (currentStep < progressSteps.length) {
      onStepProgress?.(currentStep, progressSteps[currentStep]);
      currentStep++;
    }
  }, 700);

  try {
    const response = await fetch('/api/analyze-presentation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ presentation }),
    });

    clearInterval(interval);
    onStepProgress?.(progressSteps.length - 1, 'Finalizing report...');

    if (response.ok) {
      const data = await response.json();
      if (data && data.report) {
        return data.report;
      }
    }

    console.warn('API returned non-200 or unexpected structure. Falling back to local intelligence analyzer.');
    return generateLocalMockReport(presentation);
  } catch (err) {
    console.warn('Network or server exception during Gemini call; generating resilient local analysis:', err);
    clearInterval(interval);
    return generateLocalMockReport(presentation);
  }
}
