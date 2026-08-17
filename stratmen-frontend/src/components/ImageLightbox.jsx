import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';

export const ImageLightbox = ({ isOpen, src, alt = 'Image preview', onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-text-dark/90 backdrop-blur-md"
        />

        <div className="relative z-10 max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl">
          {/* Controls */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
            <a href={src} target="_blank" rel="noopener noreferrer" download>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full bg-text-dark/70 text-white hover:bg-text-dark transition-colors cursor-pointer"
                title="Download image"
              >
                <Download className="h-4 w-4" />
              </button>
            </a>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-text-dark/70 text-white hover:bg-text-dark transition-colors cursor-pointer"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <motion.img
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.2 }}
            src={src}
            alt={alt}
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </AnimatePresence>
  );
};
