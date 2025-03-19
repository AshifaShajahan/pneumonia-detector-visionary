
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import UploadArea from '../components/UploadArea';
import ResultCard, { PredictionResult } from '../components/ResultCard';
import Footer from '../components/Footer';
import { pneumoniaDetector } from '../lib/tensorflow-model';

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    // Load the model on component mount
    const loadModel = async () => {
      try {
        const loaded = await pneumoniaDetector.loadModel();
        setModelLoaded(loaded);
        if (!loaded) {
          toast.error("Failed to load the pneumonia detection model");
        }
      } catch (error) {
        console.error("Error loading model:", error);
        toast.error("Failed to load the pneumonia detection model");
      }
    };

    loadModel();
  }, []);

  const handleImageUpload = async (file: File) => {
    setIsProcessing(true);
    setResult(null);
    
    try {
      // Artificial delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Make prediction
      const predictionResult = await pneumoniaDetector.predict(file);
      
      setResult(predictionResult);
      
      if (predictionResult.success) {
        toast.success(`Analysis complete: ${predictionResult.prediction}`);
      } else {
        toast.error(predictionResult.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Prediction error:", error);
      setResult({
        prediction: 'Normal',
        confidence: 0,
        success: false,
        error: 'An error occurred during the analysis.'
      });
      toast.error("Failed to analyze the image");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4">
        <UploadArea onImageUpload={handleImageUpload} isProcessing={isProcessing} />
        <ResultCard result={result} isProcessing={isProcessing} />
        
        <motion.section 
          id="about"
          className="my-16 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">About Pneumonia Detection</h2>
            <p className="text-muted-foreground mb-4">
              Pneumonia is an inflammatory condition of the lung affecting primarily the small air 
              sacs known as alveoli. Early detection of pneumonia is crucial for effective treatment
              and improved patient outcomes.
            </p>
            <p className="text-muted-foreground">
              This system uses deep learning technology to analyze chest X-ray images and detect
              patterns associated with pneumonia, providing healthcare professionals with an additional
              tool for diagnosis.
            </p>
          </div>
        </motion.section>
        
        <motion.section 
          id="how-it-works"
          className="my-16 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Upload X-ray</h3>
                <p className="text-muted-foreground text-sm">
                  Upload a chest X-ray image through the intuitive interface.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <h3 className="text-lg font-medium mb-2">AI Analysis</h3>
                <p className="text-muted-foreground text-sm">
                  Our deep learning model analyzes the image to identify patterns of pneumonia.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Get Results</h3>
                <p className="text-muted-foreground text-sm">
                  Receive an instant assessment with confidence score indicating the likelihood of pneumonia.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
        
        <motion.section 
          id="disclaimer"
          className="my-16 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="max-w-3xl mx-auto bg-white rounded-xl p-8 shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">Medical Disclaimer</h2>
            <p className="text-muted-foreground text-sm mb-4">
              This Pneumonia Detection System is designed as a supplementary tool for healthcare professionals and should not be used as the sole basis for diagnosis or treatment decisions.
            </p>
            <p className="text-muted-foreground text-sm">
              The system's predictions are based on machine learning algorithms trained on X-ray image datasets and may not account for all clinical factors. Always consult with qualified healthcare providers for proper medical advice, diagnosis, and treatment.
            </p>
          </div>
        </motion.section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
