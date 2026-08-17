import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Building2, MessageCircle } from 'lucide-react';
import { getActivities } from '@/services/contentService';
import { PageLoader } from '@/components/Loader';
import { toast } from 'sonner';

const iconMap = {
  0: Calendar,
  1: Building2,
  2: MessageCircle,
};

export const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivitiesData = async () => {
      try {
        const data = await getActivities(true);
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
        toast.error('Failed to load activities. Showing defaults.');
      } finally {
        setLoading(false);
      }
    };
    fetchActivitiesData();
  }, []);

  if (loading) return <PageLoader text="Loading activities..." />;

  const fallbackActivities = [
    {
      id: 1,
      title: 'Sunday Meetings',
      frequency: 'Every Sunday',
      description:
        'Weekly strategic thinking sessions where members discuss industry trends, case studies, and personal development goals. Each session is led by a different member to build leadership skills.',
      impact_summary: '30+ sessions completed',
    },
    {
      id: 2,
      title: 'Industry Visits',
      frequency: 'Monthly',
      description:
        'On-site visits to leading companies and startups to understand real-world business operations, culture, and strategic decision-making processes.',
      impact_summary: '5+ top companies visited',
    },
    {
      id: 3,
      title: 'Talks & Meets',
      frequency: 'Bi-monthly',
      description:
        'Guest speaker events featuring industry leaders, entrepreneurs, and professionals who share their experiences and insights on strategy, leadership, and innovation.',
      impact_summary: 'Interactive Q&A sessions',
    },
  ];

  const displayList = activities.length > 0 ? activities : fallbackActivities;

  return (
    <div className="bg-bg-warm min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-14">

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="editorial-label">Core Initiatives</span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-text-dark tracking-tight">
            Our <span className="text-green-mint">Activities</span>
          </h1>
          <p className="text-text-mid text-base leading-relaxed">
            From weekly strategic discussions to hands-on industry visits, explore how StratMen Foundation builds strategic leaders.
          </p>
        </div>

        {/* Activity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayList.map((act, idx) => {
            const Icon = iconMap[idx % 3] || Calendar;
            return (
              <motion.div
                key={act.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-8 rounded-xl border border-border-subtle bg-bg-white shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-5">
                  {/* Icon + Frequency row */}
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-green-soft">
                      <Icon className="h-6 w-6 text-green-deep" />
                    </div>
                    {act.frequency && (
                      <span className="text-[11px] font-semibold bg-green-soft text-green-deep px-2.5 py-1 rounded-md">
                        {act.frequency}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-text-dark font-heading">{act.title}</h3>
                    <p className="text-text-mid text-sm leading-relaxed">{act.description}</p>
                  </div>
                </div>

                {/* Impact summary */}
                {act.impact_summary && (
                  <div className="pt-4 border-t border-border-subtle">
                    <p className="text-xs font-semibold text-green-deep">
                      ↗ {act.impact_summary}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
