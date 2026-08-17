import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass } from 'lucide-react';

export const MissionVision = ({ content }) => {
  const missionTitle = content?.mission?.title || 'Our Mission';
  const missionText =
    content?.mission?.content ||
    'To create a collaborative environment where aspiring leaders develop strategic thinking, industry awareness, and professional skills through weekly sessions, industry visits, and peer-to-peer learning.';

  const visionTitle = content?.vision?.title || 'Our Vision';
  const visionText =
    content?.vision?.content ||
    'To build a network of 1000+ strategic leaders who drive positive change in their industries and communities, fostering innovation and ethical leadership across all sectors.';

  return (
    <section className="py-16 bg-bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="text-center mb-12">
          <span className="editorial-label">What We Stand For</span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-heading font-bold text-text-dark">
            Purpose &amp; <span className="text-green-mint">Direction</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="p-8 rounded-xl border border-border-subtle bg-bg-white shadow-card hover:shadow-card-hover transition-shadow duration-300"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-soft">
                <Target className="h-5 w-5 text-green-deep" />
              </div>
              <h3 className="text-lg font-bold text-text-dark font-heading">{missionTitle}</h3>
            </div>
            <p className="text-text-mid leading-relaxed">{missionText}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="p-8 rounded-xl border border-border-subtle bg-bg-white shadow-card hover:shadow-card-hover transition-shadow duration-300"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-soft">
                <Compass className="h-5 w-5 text-green-deep" />
              </div>
              <h3 className="text-lg font-bold text-text-dark font-heading">{visionTitle}</h3>
            </div>
            <p className="text-text-mid leading-relaxed">{visionText}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
