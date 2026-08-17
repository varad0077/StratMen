import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { getJourneyMilestones } from '@/services/contentService';
import { formatDate } from '@/lib/utils';
import { PageLoader } from '@/components/Loader';
import { toast } from 'sonner';

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
        toast.error('Failed to load journey data. Showing defaults.');
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
    <div className="bg-bg-warm min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">

        {/* Page Header */}
        <div className="text-center space-y-4">
          <span className="editorial-label">Milestones</span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-text-dark tracking-tight">
            Our <span className="text-green-mint">Journey</span>
          </h1>
          <p className="text-text-mid text-base max-w-xl mx-auto leading-relaxed">
            Trace the growth of StratMen Foundation from a vision to a thriving strategic leadership community.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l-2 border-border-subtle pl-8 ml-4 sm:ml-36 space-y-10">
          {list.map((m, idx) => (
            <motion.div
              key={m.id || idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="relative group"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[41px] top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-green-deep border-2 border-bg-warm shadow-sm group-hover:scale-110 transition-transform duration-200">
                <div className="h-2.5 w-2.5 rounded-full bg-white" />
              </div>

              {/* Date Tag */}
              <div className="sm:absolute sm:-left-44 sm:top-2 sm:text-right mb-3 sm:mb-0">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-mid">
                  <Calendar className="h-3 w-3 sm:hidden" />
                  {formatDate(m.milestone_date)}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6 rounded-xl border border-border-subtle bg-bg-white shadow-card hover:shadow-card-hover transition-all duration-300 space-y-2">
                <h3 className="text-base font-bold text-text-dark font-heading">{m.title}</h3>
                <p className="text-sm text-text-mid leading-relaxed">{m.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
