import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        <div className="relative z-10 max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl">
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            <a href={src} target="_blank" rel="noopener noreferrer" download>
              <Button size="icon-sm" variant="secondary" className="rounded-full bg-surface-dark/80 backdrop-blur">
                <Download className="h-4 w-4" />
              </Button>
            </a>
            <Button size="icon-sm" variant="secondary" onClick={onClose} className="rounded-full bg-surface-dark/80 backdrop-blur">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            src={src}
            alt={alt}
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </AnimatePresence>
  );
};
