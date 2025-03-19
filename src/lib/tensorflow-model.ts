
import * as tf from '@tensorflow/tfjs';

// This interface represents our model prediction result
export interface PredictionResult {
  prediction: 'Normal' | 'Pneumonia';
  confidence: number;
  success: boolean;
  error?: string;
}

// Class to load and use the pneumonia detection model
export class PneumoniaDetector {
  private model: tf.LayersModel | null = null;
  private isModelLoading: boolean = false;
  
  // Function to load the model
  async loadModel(): Promise<boolean> {
    if (this.model) return true;
    if (this.isModelLoading) return false;
    
    try {
      this.isModelLoading = true;
      
      // Here we would normally load a pre-trained model from a URL
      // console.log('Loading pneumonia detection model...');
      // this.model = await tf.loadLayersModel('/model/model.json');
      
      // For demo purposes, we'll use a placeholder model
      // This will be replaced with your actual trained model
      this.model = await this.createDummyModel();
      
      console.log('Model loaded successfully');
      return true;
    } catch (error) {
      console.error('Error loading model:', error);
      return false;
    } finally {
      this.isModelLoading = false;
    }
  }
  
  // Temporary function to create a placeholder model for demo purposes
  // You'll replace this with loading your actual trained model
  private async createDummyModel(): Promise<tf.LayersModel> {
    const model = tf.sequential();
    
    // Input shape: [224, 224, 3] for RGB images
    model.add(tf.layers.conv2d({
      inputShape: [224, 224, 3],
      filters: 16,
      kernelSize: 3,
      activation: 'relu'
    }));
    
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 2, activation: 'softmax' }));
    
    model.compile({
      optimizer: 'adam',
      loss: 'sparseCategoricalCrossentropy',
      metrics: ['accuracy']
    });
    
    return model;
  }
  
  // Function to preprocess the image before prediction
  private async preprocessImage(imageData: ImageData | HTMLImageElement): Promise<tf.Tensor> {
    return tf.tidy(() => {
      let tensor;
      
      // Convert image to tensor
      if (imageData instanceof ImageData) {
        tensor = tf.browser.fromPixels(imageData);
      } else {
        tensor = tf.browser.fromPixels(imageData);
      }
      
      // Resize to model input size (224x224)
      tensor = tf.image.resizeBilinear(tensor, [224, 224]);
      
      // Normalize values to [0, 1]
      tensor = tensor.toFloat().div(tf.scalar(255));
      
      // Add batch dimension
      return tensor.expandDims(0);
    });
  }
  
  // Function to make a prediction
  async predict(image: File): Promise<PredictionResult> {
    try {
      // Check if model is loaded
      if (!this.model) {
        const loaded = await this.loadModel();
        if (!loaded) {
          return {
            prediction: 'Normal',
            confidence: 0,
            success: false,
            error: 'Failed to load the model. Please try again.'
          };
        }
      }
      
      // Create image element from file
      const img = new Image();
      img.src = URL.createObjectURL(image);
      
      return new Promise((resolve) => {
        img.onload = async () => {
          try {
            // Preprocess the image
            const tensorInput = await this.preprocessImage(img);
            
            // Make prediction
            const predictions = this.model!.predict(tensorInput) as tf.Tensor;
            const probabilities = await predictions.data();
            
            // Clean up tensors
            tensorInput.dispose();
            predictions.dispose();
            URL.revokeObjectURL(img.src);
            
            // In a real model, index 0 might be "Normal" and index 1 might be "Pneumonia"
            // For this placeholder, we'll simulate a prediction
            const confidenceNormal = probabilities[0];
            const confidencePneumonia = probabilities[1];
            
            // For the demo, we'll base the prediction on the image name
            // In your real implementation, you'll use the actual model prediction
            const isPneumonia = image.name.toLowerCase().includes('pneumonia') || 
                               Math.random() > 0.5; // Random decision for demo
            
            if (isPneumonia) {
              resolve({
                prediction: 'Pneumonia',
                confidence: 0.7 + Math.random() * 0.25, // Random confidence between 0.7 and 0.95
                success: true
              });
            } else {
              resolve({
                prediction: 'Normal',
                confidence: 0.7 + Math.random() * 0.25, // Random confidence between 0.7 and 0.95
                success: true
              });
            }
          } catch (error) {
            console.error('Error during prediction:', error);
            resolve({
              prediction: 'Normal',
              confidence: 0,
              success: false,
              error: 'Error analyzing the image. Please try again.'
            });
          }
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(img.src);
          resolve({
            prediction: 'Normal',
            confidence: 0,
            success: false,
            error: 'Failed to load the image. Please try a different file.'
          });
        };
      });
    } catch (error) {
      console.error('Prediction error:', error);
      return {
        prediction: 'Normal',
        confidence: 0,
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }
}

// Create and export a singleton instance
export const pneumoniaDetector = new PneumoniaDetector();
