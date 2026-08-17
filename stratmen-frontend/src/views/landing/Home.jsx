import React, { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { MissionVision } from './components/MissionVision';
import { FootprintStats } from './components/FootprintStats';
import { getHomepageContent, getFootprints, getActivities } from '@/services/contentService';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Building2, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const Home = () => {
  const [content, setContent] = useState(null);
  const [footprints, setFootprints] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [contentData, footprintsData, activitiesData] = await Promise.all([
          getHomepageContent().catch(() => ({})),
          getFootprints().catch(() => []),
          getActivities(true).catch(() => []),
        ]);
        setContent(contentData);
        setFootprints(footprintsData);
        setActivities(activitiesData.slice(0, 3));
      } catch (error) {
        console.error('Error loading home data:', error);
        toast.error('Some content failed to load. Please refresh.');
      }
    };
    loadHomeData();
  }, []);

  const fallbackActivities = [
    {
      id: 'f1',
      title: 'Sunday Meetings',
      frequency: 'Every Sunday',
      description: 'Weekly strategic thinking sessions discussing industry trends and case studies.',
      Icon: Calendar,
    },
    {
      id: 'f2',
      title: 'Industry Visits',
      frequency: 'Monthly',
      description: 'On-site visits to leading companies and startups for real-world exposure.',
      Icon: Building2,
    },
    {
      id: 'f3',
      title: 'Talks & Meets',
      frequency: 'Bi-monthly',
      description: 'Guest speaker sessions with industry founders and strategic leaders.',
      Icon: MessageCircle,
    },
  ];

  const iconMap = [Calendar, Building2, MessageCircle];
  const activitiesToShow = activities.length > 0 ? activities : fallbackActivities;

  return (
    <div>
      <HeroSection content={content} />
      <MissionVision content={content} />
      <FootprintStats footprints={footprints} />

      {/* ── Featured Activities Section ── */}
      <section className="py-20 bg-bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="editorial-label">What We Do</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-heading font-bold text-text-dark">
                Core <span className="text-green-mint">Activities</span>
              </h2>
              <p className="text-sm text-text-mid mt-1.5">Week in, week out — building strategic leaders.</p>
            </div>
            <Link to="/activities" className="mt-6 md:mt-0">
              <Button variant="ghost" className="text-green-deep hover:text-green-deep group font-semibold">
                View All Activities
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activitiesToShow.map((act, idx) => {
              const Icon = act.Icon || iconMap[idx % 3] || Calendar;
              return (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-7 rounded-xl border border-border-subtle bg-bg-white shadow-card hover:shadow-card-hover transition-all duration-300 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-lg bg-green-soft">
                      <Icon className="h-5 w-5 text-green-deep" />
                    </div>
                    {act.frequency && (
                      <span className="text-[11px] font-semibold bg-green-soft text-green-deep px-2.5 py-1 rounded-md">
                        {act.frequency}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-text-dark font-heading">{act.title}</h3>
                  <p className="text-sm text-text-mid leading-relaxed line-clamp-3">{act.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Join Banner ── */}
      <section className="py-20 bg-bg-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 sm:p-14 rounded-2xl border border-border-subtle bg-bg-white shadow-card text-center space-y-6">
            <span className="editorial-label">Ready to Grow?</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-text-dark max-w-xl mx-auto leading-tight">
              Elevate Your{' '}
              <span className="text-green-mint">Strategic Thinking</span>
            </h2>
            <p className="text-text-mid max-w-lg mx-auto text-base">
              Apply to join StratMen Foundation today and get access to our private member feed, group chat, and weekly sessions.
            </p>
            <div className="pt-2">
              <Link to="/stratchat">
                <Button size="lg" className="font-semibold px-10 text-base">
                  Apply to Join StratChat
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
