import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Server-side Gemini initialization following @google/genai skill standards
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * POST /api/analyze-presentation
 * Analyzes extracted PowerPoint content using gemini-3.8-flash with structured JSON response
 */
app.post('/api/analyze-presentation', async (req, res) => {
  try {
    const { presentation } = req.body;

    if (!presentation || !Array.isArray(presentation.slides) || presentation.slides.length === 0) {
      return res.status(400).json({ error: 'Invalid presentation payload or empty slides list' });
    }

    // Prepare slide summary context for prompt
    const slidesContext = presentation.slides.map((s: any) => ({
      slideNumber: s.slideNumber,
      title: s.title,
      text: s.fullText,
      wordCount: s.wordCount,
      bulletCount: s.bulletCount,
      hasImages: s.hasImages,
    }));

    const prompt = `You are an elite executive presentation coach and design critic.
Analyze this uploaded PowerPoint presentation deck titled "${presentation.fileName}" with ${presentation.slides.length} slides.

Evaluate all 12 key dimensions:
1. Content quality
2. Slide structure
3. Grammar and spelling
4. Readability
5. Visual consistency
6. Text density
7. Slide design
8. Typography
9. Color usage
10. Content clarity
11. Audience suitability
12. Overall presentation quality

Slides content:
${JSON.stringify(slidesContext, null, 2)}

Provide a rigorous, structured quality evaluation. Scores should be realistic and honest (typically 60-95 for standard business decks, not inflated to 100). Identify real grammar flaws, high text density warnings, and concrete actionable suggestions.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are SlideCheck AI, an executive presentation quality analysis system. Output ONLY valid JSON adhering exactly to the requested schema. Do not include markdown code block backticks if possible, return raw json.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER, description: 'Overall presentation quality score 0-100' },
            contentScore: { type: Type.INTEGER, description: 'Content quality score 0-100' },
            designScore: { type: Type.INTEGER, description: 'Visual design & layout score 0-100' },
            readabilityScore: { type: Type.INTEGER, description: 'Readability & density score 0-100' },
            consistencyScore: { type: Type.INTEGER, description: 'Visual & tonal consistency score 0-100' },
            grammarScore: { type: Type.INTEGER, description: 'Grammar and spelling score 0-100' },
            structureScore: { type: Type.INTEGER, description: 'Narrative structure and logical flow score 0-100' },
            presentationReadiness: { type: Type.INTEGER, description: 'Presentation readiness percentage 0-100' },
            summary: { type: Type.STRING, description: 'Executive summary of the presentation strengths and flaws' },
            readinessVerdict: { type: Type.STRING, description: 'Specific sentence on presenter readiness' },
            contentFindings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: 'good, warning, or critical' },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  slideRef: { type: Type.INTEGER },
                },
                required: ['type', 'title', 'description'],
              },
            },
            designMetrics: {
              type: Type.OBJECT,
              properties: {
                designScore: { type: Type.INTEGER },
                fontConsistencyRating: { type: Type.STRING },
                fontFamiliesDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
                colorPaletteConsistency: { type: Type.STRING },
                visualHierarchyRating: { type: Type.STRING },
                imageUsageAssessment: { type: Type.STRING },
                alignmentAndSpacing: { type: Type.STRING },
                layoutVariety: { type: Type.STRING },
              },
              required: ['designScore', 'fontConsistencyRating', 'colorPaletteConsistency', 'visualHierarchyRating', 'imageUsageAssessment', 'alignmentAndSpacing', 'layoutVariety'],
            },
            readabilityMetrics: {
              type: Type.OBJECT,
              properties: {
                readabilityScore: { type: Type.INTEGER },
                averageWordsPerSlide: { type: Type.INTEGER },
                estimatedReadingTimeMinutes: { type: Type.INTEGER },
                textDensityRating: { type: Type.STRING },
                wordCountWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                bulletPointGuidance: { type: Type.STRING },
              },
              required: ['readabilityScore', 'averageWordsPerSlide', 'estimatedReadingTimeMinutes', 'textDensityRating', 'wordCountWarnings', 'bulletPointGuidance'],
            },
            grammarIssues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  slideNumber: { type: Type.INTEGER },
                  original: { type: Type.STRING },
                  suggested: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['slideNumber', 'original', 'suggested', 'explanation'],
              },
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  priority: { type: Type.STRING, description: 'critical, important, improve, or good' },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING },
                  slideRef: { type: Type.INTEGER },
                },
                required: ['priority', 'title', 'description', 'category'],
              },
            },
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  slideNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  score: { type: Type.INTEGER },
                  wordCount: { type: Type.INTEGER },
                  bulletCount: { type: Type.INTEGER },
                  extractedSnippet: { type: Type.STRING },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  issues: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                  designNotes: { type: Type.STRING },
                },
                required: ['slideNumber', 'score', 'strengths', 'issues', 'recommendations'],
              },
            },
          },
          required: [
            'overallScore',
            'contentScore',
            'designScore',
            'readabilityScore',
            'consistencyScore',
            'grammarScore',
            'structureScore',
            'presentationReadiness',
            'summary',
            'readinessVerdict',
            'contentFindings',
            'designMetrics',
            'readabilityMetrics',
            'grammarIssues',
            'recommendations',
            'slides',
          ],
        },
      },
    });

    const rawText = response.text || '';
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      // Clean possible wrapper markdown
      const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    // Attach presentation metadata
    const finalReport = {
      id: 'report_' + Date.now(),
      fileName: presentation.fileName,
      fileSizeBytes: presentation.fileSizeBytes,
      slideCount: presentation.slideCount,
      analyzedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      ...parsedData,
    };

    return res.json({ success: true, report: finalReport });
  } catch (error: any) {
    console.error('Gemini presentation analysis error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to analyze presentation with Gemini',
      isGeminiError: true,
    });
  }
});

// Endpoint to download the project zip archive directly
app.get('/api/download-zip', (_req, res) => {
  const zipPath = path.resolve(process.cwd(), 'dist', 'memory-match-project.zip');
  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Disposition', 'attachment; filename="memory-match-project.zip"');
    res.setHeader('Content-Type', 'application/zip');
    res.sendFile(zipPath);
  } else {
    res.status(404).json({ error: 'Zip archive not found' });
  }
});

// Determine dist directory: if running from /dist/server.js or root server.ts
const distDir = path.resolve(process.cwd(), 'dist');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
} else {
  // In dev, check if Vite middleware or dist exists
  import('vite').then(async ({ createServer }) => {
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }).catch(() => {
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  });
}

app.listen(PORT, () => {
  console.log(`SlideCheck AI server listening on port ${PORT}`);
});
