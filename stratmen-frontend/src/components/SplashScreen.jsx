import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';

export const SplashScreen = ({ duration = 2000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-warm"
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center gap-5 text-center"
          >
            {/* Logo mark */}
            <div className="p-5 rounded-2xl bg-green-soft border border-border-subtle shadow-card">
              <Shield className="h-14 w-14 text-green-deep" />
            </div>

            {/* Wordmark */}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight font-manrope text-text-dark">
                Strat<span className="text-green-deep">Men</span>
              </h1>
              <p className="text-xs uppercase tracking-widest text-text-muted mt-1.5 font-semibold">
                Foundation
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
