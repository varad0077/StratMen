import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Building2, MessageCircle, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getActivities } from '@/services/contentService';
import { PageLoader } from '@/components/Loader';

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
      description: 'Weekly strategic thinking sessions where members discuss industry trends, case studies, and personal development goals. Each session is led by a different member to build leadership skills.',
      impact_summary: '30+ sessions completed',
    },
    {
      id: 2,
      title: 'Industry Visits',
      frequency: 'Monthly',
      description: 'On-site visits to leading companies and startups to understand real-world business operations, culture, and strategic decision-making processes.',
      impact_summary: '5+ top companies visited',
    },
    {
      id: 3,
      title: 'Talks & Meets',
      frequency: 'Bi-monthly',
      description: 'Guest speaker events featuring industry leaders, entrepreneurs, and professionals who share their experiences and insights on strategy, leadership, and innovation.',
      impact_summary: 'Interactive Q&A sessions',
    },
  ];

  const displayList = activities.length > 0 ? activities : fallbackActivities;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Core Initiatives</span>
        </div>
        <h1 className="text-4xl font-extrabold text-text-primary tracking-tight">Our Activities</h1>
        <p className="text-text-secondary text-base">
          From weekly strategic discussions to hands-on industry visits, explore how StratMen Foundation builds strategic leaders.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayList.map((act, idx) => {
          const Icon = iconMap[idx % 3] || Calendar;
          return (
            <motion.div
              key={act.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card className="glass h-full hover:border-accent/40 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent border border-accent/30">
                        <Icon className="h-6 w-6" />
                      </div>
                      {act.frequency && (
                        <Badge variant="default" className="text-xs">
                          {act.frequency}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold text-text-primary">{act.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-text-secondary text-sm leading-relaxed">{act.description}</p>
                    {act.impact_summary && (
                      <p className="text-xs font-semibold text-accent border-t border-border/40 pt-3">
                        Impact: {act.impact_summary}
                      </p>
                    )}
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
