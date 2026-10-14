import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { ExtractedPresentation } from '../types/analysis';
import { parsePptxFile } from '../utils/pptxParser';

interface FileUploaderProps {
  onPresentationReady: (presentation: ExtractedPresentation) => void;
  onStartSampleDemo: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onPresentationReady,
  onStartSampleDemo,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [parsedInfo, setParsedInfo] = useState<ExtractedPresentation | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = async (file: File) => {
    setErrorMessage(null);
    setParsedInfo(null);

    // Validate file type
    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith('.pptx')) {
      setErrorMessage('Please upload a valid PowerPoint presentation (.pptx) file.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('File size exceeds 50MB. Please upload a smaller presentation.');
      return;
    }

    try {
      setIsParsing(true);
      const extracted = await parsePptxFile(file);
      setParsedInfo(extracted);
    } catch (err: any) {
      console.error('Failed to parse PPTX file:', err);
      setErrorMessage('Unable to extract presentation content. Ensure the file is not corrupted or password-protected.');
    } finally {
      setIsParsing(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/70 shadow-sm'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 shadow-sm">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-semibold text-slate-800 mb-1">
          Drop your presentation here
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          or <span className="text-indigo-600 font-semibold hover:underline">browse files</span> from your computer
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span>Supported format: .pptx</span>
          <span>•</span>
          <span>Up to 50MB</span>
        </div>
      </div>

      {/* Parsing indicator */}
      {isParsing && (
        <div className="mt-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-center">
          <div className="inline-block animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full mr-2" />
          <span className="text-sm font-medium text-indigo-900">
            Extracting slides, layouts, and typography...
          </span>
        </div>
      )}

      {/* Error State */}
      {errorMessage && (
        <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-rose-900">Upload Issue</h4>
            <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Uploaded File Confirmation Card */}
      {parsedInfo && !isParsing && (
        <div className="mt-6 p-5 rounded-xl bg-white border border-slate-200/90 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">{parsedInfo.fileName}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="font-semibold text-slate-700">{parsedInfo.slideCount} slides detected</span>
                  <span>•</span>
                  <span>{formatFileSize(parsedInfo.fileSizeBytes)}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">Ready to analyze</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setParsedInfo(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Replace
            </button>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 text-left">
              Our AI engine will evaluate content, readability, design consistency, and slide-by-slide structure.
            </div>
            <button
              onClick={() => onPresentationReady(parsedInfo)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm shadow-indigo-200 transition-colors"
            >
              <span>Start AI Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Demo Deck Shortcut */}
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-400">
          Don't have a PPT file handy?{' '}
          <button
            onClick={onStartSampleDemo}
            className="text-indigo-600 hover:text-indigo-700 font-semibold underline underline-offset-2 ml-1"
          >
            Try with Sample Executive Deck (Q3 Review.pptx)
          </button>
        </p>
      </div>
    </div>
  );
};
