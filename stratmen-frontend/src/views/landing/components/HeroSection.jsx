import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HeroSection = ({ content }) => {
  const subtitle =
    content?.hero_title?.content ||
    'A professional community of founders, leaders, and thinkers dedicated to strategic growth, meaningful collaboration, and professional excellence.';

  return (
    <section className="relative overflow-hidden hero-pattern pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Subtle gradient vignette over the dot grid — edges only */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(247,247,242,0) 40%, rgba(247,247,242,0.7) 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-8">

          {/* Editorial label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex items-center justify-center gap-2"
          >
            <span className="inline-block w-5 h-[2px] bg-green-deep rounded-full" />
            <span className="editorial-label text-text-mid tracking-[0.12em]">
              StratMen Foundation
            </span>
            <span className="inline-block w-5 h-[2px] bg-green-deep rounded-full" />
          </motion.div>

          {/* Hero Heading — editorial two-line split */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="font-heading font-extrabold text-[3rem] sm:text-[3.75rem] lg:text-[4.5rem] leading-[1.08] tracking-tight"
          >
            <span className="block text-text-dark">Building Tomorrow's</span>
            <span className="block text-green-mint">Strategic Leaders.</span>
          </motion.h1>

          {/* Supporting subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-lg sm:text-xl text-text-mid leading-relaxed max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <Link to="/stratchat">
              <Button size="lg" className="font-semibold px-8 text-base">
                Join StratChat
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/activities">
              <Button size="lg" variant="outline" className="font-medium px-8 text-base">
                Explore Activities
              </Button>
            </Link>
          </motion.div>

          {/* Community pillars — clean, text-based */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="pt-10 border-t border-border-subtle"
          >
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto text-center">
              <div className="space-y-1.5">
                <div className="flex justify-center">
                  <div className="p-2 rounded-lg bg-green-soft">
                    <Calendar className="h-4 w-4 text-green-deep" />
                  </div>
                </div>
                <p className="text-xs font-semibold text-text-dark">Sunday Sessions</p>
                <p className="text-[11px] text-text-muted">Weekly meets</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-center">
                  <div className="p-2 rounded-lg bg-green-soft">
                    <Building2 className="h-4 w-4 text-green-deep" />
                  </div>
                </div>
                <p className="text-xs font-semibold text-text-dark">Industry Visits</p>
                <p className="text-[11px] text-text-muted">On-site exposure</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-center">
                  <div className="p-2 rounded-lg bg-green-soft">
                    <Users className="h-4 w-4 text-green-deep" />
                  </div>
                </div>
                <p className="text-xs font-semibold text-text-dark">Peer Network</p>
                <p className="text-[11px] text-text-muted">40+ Members</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
