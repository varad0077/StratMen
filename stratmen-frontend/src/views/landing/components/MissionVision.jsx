import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const MissionVision = ({ content }) => {
  const missionTitle = content?.mission?.title || 'Our Mission';
  const missionText = content?.mission?.content || 'To create a collaborative environment where aspiring leaders develop strategic thinking, industry awareness, and professional skills through weekly sessions, industry visits, and peer-to-peer learning.';

  const visionTitle = content?.vision?.title || 'Our Vision';
  const visionText = content?.vision?.content || 'To build a network of 1000+ strategic leaders who drive positive change in their industries and communities, fostering innovation and ethical leadership across all sectors.';

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass hover:border-accent/40 transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent border border-accent/30">
                <Target className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold text-text-primary">{missionTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary leading-relaxed">{missionText}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass hover:border-accent/40 transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent border border-accent/30">
                <Compass className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold text-text-primary">{visionTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary leading-relaxed">{visionText}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
