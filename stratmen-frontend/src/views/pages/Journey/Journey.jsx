import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flag, Sparkles } from 'lucide-react';
import { getJourneyMilestones } from '@/services/contentService';
import { formatDate } from '@/lib/utils';
import { PageLoader } from '@/components/Loader';

export const Journey = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const data = await getJourneyMilestones(true);
        setMilestones(data);
      } catch (error) {
        console.error('Error fetching journey:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJourney();
  }, []);

  if (loading) return <PageLoader text="Loading journey timeline..." />;

  const fallbackMilestones = [
    { id: 1, title: 'StratMen Founded', milestone_date: '2025-01-15', description: 'The idea of StratMen was born — a community for strategic thinkers and future leaders.' },
    { id: 2, title: 'First Sunday Meeting', milestone_date: '2025-01-22', description: 'Our inaugural Sunday meeting with founding members discussing the vision and roadmap.' },
    { id: 3, title: '10th Member Joined', milestone_date: '2025-03-10', description: 'Our community reached double digits — a milestone validating our core vision.' },
    { id: 4, title: 'First Industry Visit', milestone_date: '2025-04-20', description: 'Members visited a leading tech enterprise to understand corporate strategy firsthand.' },
    { id: 5, title: 'StratChat Launched', milestone_date: '2025-06-01', description: 'Our private community portal went live, enabling members to connect digitally.' },
    { id: 6, title: '40+ Active Members', milestone_date: '2025-12-15', description: 'StratMen grew to over 40 active leaders across multiple domains.' },
  ];

  const list = milestones.length > 0 ? milestones : fallbackMilestones;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Milestones</span>
        </div>
        <h1 className="text-4xl font-extrabold text-text-primary tracking-tight">Our Journey</h1>
        <p className="text-text-secondary text-base max-w-xl mx-auto">
          Trace the growth of StratMen Foundation from a vision to a thriving strategic leadership community.
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative border-l-2 border-border-light pl-6 ml-4 sm:ml-32 space-y-10">
        {list.map((m, idx) => (
          <motion.div
            key={m.id || idx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="relative group"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[33px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-surface-dark border-2 border-accent text-accent shadow-glow group-hover:scale-110 transition-transform">
              <Flag className="h-4 w-4" />
            </div>

            {/* Date Tag */}
            <div className="sm:absolute sm:-left-36 sm:top-1.5 sm:text-right mb-2 sm:mb-0">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full sm:bg-transparent sm:p-0">
                <Calendar className="h-3 w-3 sm:hidden" />
                {formatDate(m.milestone_date)}
              </span>
            </div>

            {/* Card Content */}
            <div className="p-6 rounded-xl border border-border bg-surface-dark hover:border-accent/40 transition-all duration-300 space-y-2">
              <h3 className="text-lg font-bold text-text-primary">{m.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{m.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
