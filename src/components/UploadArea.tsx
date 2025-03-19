
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface UploadAreaProps {
  onImageUpload: (file: File) => void;
  isProcessing: boolean;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onImageUpload, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      toast.error('Please upload a valid image file (JPEG or PNG)');
      return false;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return false;
    }
    
    return true;
  };

  const processFile = (file: File) => {
    if (!validateFile(file)) return;
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Pass file to parent component
    onImageUpload(file);
    
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      className="my-8 w-full max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div
        className={`relative rounded-xl ${dragActive 
          ? 'border-2 border-primary border-dashed bg-primary/5' 
          : 'border border-border bg-secondary/50'
        } p-8 transition-all duration-200 ease-in-out`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <img 
                src={previewUrl} 
                alt="X-ray preview" 
                className="w-full h-auto max-h-[400px] rounded-lg object-contain mx-auto image-transition"
              />
              {!isProcessing && (
                <button 
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              )}
            </motion.div>
          </div>
        ) : (
          <motion.div 
            className="flex flex-col items-center justify-center py-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-4 p-4 rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Upload X-ray Image</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-xs">
              Drag & drop your X-ray image or click to browse
            </p>
            <button
              onClick={handleButtonClick}
              disabled={isProcessing}
              className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Browse Files
            </button>
            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: JPEG, PNG (Max 5MB)
            </p>
          </motion.div>
        )}
      </div>

      <input
        ref={fileInputRef}
        onChange={handleChange}
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/png, image/jpeg"
        disabled={isProcessing}
      />
    </motion.div>
  );
};

export default UploadArea;
