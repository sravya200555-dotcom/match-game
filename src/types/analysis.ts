export interface SlideAnalysisItem {
  slideNumber: number;
  title: string;
  score: number;
  wordCount: number;
  bulletCount: number;
  extractedSnippet: string;
  strengths: string[];
  issues: string[];
  recommendations: string[];
  grammarAlerts?: {
    original: string;
    suggested: string;
    explanation?: string;
  }[];
  designNotes?: string;
}

export interface ContentFinding {
  type: 'good' | 'warning' | 'critical';
  title: string;
  description: string;
  slideRef?: number;
}

export interface GrammarIssue {
  slideNumber: number;
  original: string;
  suggested: string;
  explanation: string;
}

export interface RecommendationItem {
  priority: 'critical' | 'important' | 'improve' | 'good';
  title: string;
  description: string;
  category: 'Content' | 'Design' | 'Readability' | 'Grammar' | 'Structure';
  slideRef?: number;
}

export interface DesignAnalysisMetrics {
  designScore: number;
  fontConsistencyRating: 'Excellent' | 'Good' | 'Needs Improvement' | 'Poor';
  fontFamiliesDetected: string[];
  colorPaletteConsistency: 'High' | 'Moderate' | 'Inconsistent';
  visualHierarchyRating: 'Strong' | 'Average' | 'Weak';
  imageUsageAssessment: string;
  alignmentAndSpacing: string;
  layoutVariety: string;
}

export interface ReadabilityMetrics {
  readabilityScore: number;
  averageWordsPerSlide: number;
  estimatedReadingTimeMinutes: number;
  textDensityRating: 'Optimal' | 'Slightly High' | 'Overcrowded' | 'Light';
  wordCountWarnings: string[];
  bulletPointGuidance: string;
}

export interface AnalysisReport {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  slideCount: number;
  analyzedAt: string;

  // Key Scores (0 - 100)
  overallScore: number;
  contentScore: number;
  designScore: number;
  readabilityScore: number;
  consistencyScore: number;
  grammarScore: number;
  structureScore: number;
  presentationReadiness: number; // 0 - 100 percentage

  summary: string;
  readinessVerdict: string;

  // Specific Deep Dive Sections
  contentFindings: ContentFinding[];
  designMetrics: DesignAnalysisMetrics;
  readabilityMetrics: ReadabilityMetrics;
  grammarIssues: GrammarIssue[];
  recommendations: RecommendationItem[];
  slides: SlideAnalysisItem[];
}

export interface ExtractedSlide {
  slideNumber: number;
  title: string;
  fullText: string;
  paragraphs: string[];
  wordCount: number;
  bulletCount: number;
  hasImages: boolean;
  imageCount: number;
  rawXml?: string;
}

export interface ExtractedPresentation {
  fileName: string;
  fileSizeBytes: number;
  slideCount: number;
  slides: ExtractedSlide[];
}
