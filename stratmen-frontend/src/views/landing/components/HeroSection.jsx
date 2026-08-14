import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HeroSection = ({ content }) => {
  const title = content?.hero_title?.title || "Building Tomorrow's Strategic Leaders";
  const subtitle = content?.hero_title?.content || "A community of founders, leads, and thinkers dedicated to strategic growth and professional excellence.";

  return (
    <section className="relative overflow-hidden py-20 lg:py-32 gradient-hero">
      {/* Background glowing ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-semibold"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>StratMen Foundation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight leading-tight"
          >
            {title.split('Strategic Leaders')[0]}
            <span className="text-accent block sm:inline"> Strategic Leaders</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-text-secondary leading-relaxed"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/stratchat">
              <Button size="lg" className="rounded-full font-semibold shadow-glow hover:shadow-glow-strong text-base px-8">
                Join StratChat
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/activities">
              <Button size="lg" variant="outline" className="rounded-full text-base px-8">
                Explore Activities
              </Button>
            </Link>
          </motion.div>

          {/* Quick Pillar badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-12 grid grid-cols-3 gap-4 max-w-xl mx-auto border-t border-border/50 text-left"
          >
            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-dark/60 border border-border/40">
              <Calendar className="h-5 w-5 text-accent shrink-0" />
              <div>
                <p className="text-xs font-semibold text-text-primary">Sunday Sessions</p>
                <p className="text-[10px] text-text-muted">Weekly meets</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-dark/60 border border-border/40">
              <Shield className="h-5 w-5 text-accent shrink-0" />
              <div>
                <p className="text-xs font-semibold text-text-primary">Industry Visits</p>
                <p className="text-[10px] text-text-muted">On-site exposure</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-dark/60 border border-border/40">
              <Users className="h-5 w-5 text-accent shrink-0" />
              <div>
                <p className="text-xs font-semibold text-text-primary">Peer Network</p>
                <p className="text-[10px] text-text-muted">40+ Members</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
