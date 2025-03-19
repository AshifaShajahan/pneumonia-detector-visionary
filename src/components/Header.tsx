
import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header 
      className="w-full py-6 px-4 sm:px-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
        <motion.div 
          className="inline-flex items-center justify-center px-3 py-1 mb-3 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          Medical Imaging AI
        </motion.div>
        
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Pneumonia Detection
        </motion.h1>
        
        <motion.p 
          className="text-lg text-muted-foreground max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Upload a chest X-ray image to detect pneumonia using advanced deep learning technology.
        </motion.p>
      </div>
    </motion.header>
  );
};

export default Header;
