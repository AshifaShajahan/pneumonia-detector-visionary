
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export interface PredictionResult {
  prediction: 'Normal' | 'Pneumonia';
  confidence: number;
  success: boolean;
  error?: string;
}

interface ResultCardProps {
  result: PredictionResult | null;
  isProcessing: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, isProcessing }) => {
  if (!result && !isProcessing) return null;

  return (
    <AnimatePresence mode="wait">
      {isProcessing && (
        <motion.div
          key="processing"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xl mx-auto my-8"
        >
          <div className="bg-secondary/80 backdrop-blur rounded-xl p-8 shadow-sm border border-border">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-4 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-100 rounded-full opacity-50 animate-pulse-light"></div>
                <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyzing X-ray Image</h3>
              <p className="text-muted-foreground text-center">
                Our AI model is examining the X-ray for signs of pneumonia...
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {result && !isProcessing && (
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xl mx-auto my-8"
        >
          <div className={`backdrop-blur rounded-xl p-8 shadow-sm border ${
            result.success
              ? result.prediction === 'Normal'
                ? 'bg-green-50/80 border-green-100'
                : 'bg-amber-50/80 border-amber-100'
              : 'bg-red-50/80 border-red-100'
          }`}>
            {result.success ? (
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  {result.prediction === 'Normal' ? (
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-16 h-16 text-amber-500" />
                  )}
                </div>
                
                <h3 className="text-xl font-semibold mb-2">
                  {result.prediction === 'Normal' 
                    ? 'No Pneumonia Detected' 
                    : 'Pneumonia Detected'}
                </h3>
                
                <p className="text-muted-foreground text-center mb-6">
                  {result.prediction === 'Normal'
                    ? 'The X-ray appears normal with no signs of pneumonia.'
                    : 'The X-ray shows characteristics consistent with pneumonia.'}
                </p>
                
                <div className="w-full max-w-sm bg-white/80 rounded-lg p-4 border border-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Confidence</span>
                    <span className="text-sm font-medium">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${
                        result.prediction === 'Normal' ? 'bg-green-500' : 'bg-amber-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-8 text-center max-w-md">
                  <strong>Important:</strong> This is an AI-based assessment and should not replace professional medical advice. 
                  Please consult with a healthcare provider for proper diagnosis.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <AlertTriangle className="w-16 h-16 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Analysis Error</h3>
                <p className="text-muted-foreground text-center">
                  {result.error || 'There was an error analyzing the image. Please try again with a different image.'}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultCard;
