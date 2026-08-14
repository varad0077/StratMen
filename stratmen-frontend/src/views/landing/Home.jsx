import React, { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { MissionVision } from './components/MissionVision';
import { FootprintStats } from './components/FootprintStats';
import { getHomepageContent, getFootprints, getActivities } from '@/services/contentService';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Building2, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="space-y-12">
      <HeroSection content={content} />
      <MissionVision content={content} />
      <FootprintStats footprints={footprints} />

      {/* Featured Activities Preview */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">Core Activities</h2>
            <p className="text-sm text-text-secondary mt-1">What we do week in, week out.</p>
          </div>
          <Link to="/activities" className="mt-4 md:mt-0">
            <Button variant="ghost" className="text-accent hover:text-accent group">
              View All Activities <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.length > 0 ? (
            activities.map((act) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl border border-border bg-surface-dark space-y-4 hover:border-accent/40 transition-all"
              >
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent">
                  {act.frequency || 'Weekly'}
                </span>
                <h3 className="text-lg font-bold text-text-primary">{act.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-3">{act.description}</p>
              </motion.div>
            ))
          ) : (
            <>
              <div className="p-6 rounded-xl border border-border bg-surface-dark space-y-3">
                <Calendar className="h-8 w-8 text-accent" />
                <h3 className="text-lg font-bold text-text-primary">Sunday Meetings</h3>
                <p className="text-sm text-text-secondary">Weekly strategic thinking sessions discussing industry trends and case studies.</p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-surface-dark space-y-3">
                <Building2 className="h-8 w-8 text-accent" />
                <h3 className="text-lg font-bold text-text-primary">Industry Visits</h3>
                <p className="text-sm text-text-secondary">On-site visits to leading companies and startups for real-world exposure.</p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-surface-dark space-y-3">
                <MessageCircle className="h-8 w-8 text-accent" />
                <h3 className="text-lg font-bold text-text-primary">Talks & Meets</h3>
                <p className="text-sm text-text-secondary">Guest speaker sessions with industry founders and strategic leaders.</p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Join Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="p-8 sm:p-12 rounded-2xl border border-accent/30 bg-gradient-to-r from-surface-dark via-surface-elevated to-surface-dark text-center space-y-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary">Ready to Elevate Your Strategic Skills?</h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Apply to join StratMen Foundation today and get access to our private member feed, group chat, and weekly sessions.
          </p>
          <div>
            <Link to="/stratchat">
              <Button size="lg" className="rounded-full font-semibold px-8 shadow-glow">
                Apply to Join StratChat
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
