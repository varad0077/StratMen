import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MessageSquare, Building2, Award } from 'lucide-react';

const iconMap = {
  calendar: Calendar,
  users: Users,
  'message-circle': MessageSquare,
  building: Building2,
};

export const FootprintStats = ({ footprints = [] }) => {
  const defaultFootprints = [
    { stat_key: 'months', stat_value: '12+', stat_label: 'Months Active', icon: 'calendar' },
    { stat_key: 'members', stat_value: '40+', stat_label: 'Active Members', icon: 'users' },
    { stat_key: 'meetings', stat_value: '30+', stat_label: 'Sunday Sessions', icon: 'message-circle' },
    { stat_key: 'visits', stat_value: '5+', stat_label: 'Industry Visits', icon: 'building' },
  ];

  const statsToDisplay = footprints.length > 0 ? footprints : defaultFootprints;

  return (
    <section className="py-16 bg-surface-dark/50 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-3">
            <Award className="h-3.5 w-3.5" />
            <span>Our Impact</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">StratMen Footprint</h2>
          <p className="text-sm text-text-muted mt-2">Measurable growth driven by community dedication.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statsToDisplay.map((stat, idx) => {
            const IconComponent = iconMap[stat.icon] || Calendar;
            return (
              <motion.div
                key={stat.stat_key || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-6 rounded-xl border border-border bg-surface-dark text-center hover:border-accent/40 transition-all duration-300 group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-elevated text-accent mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-accent">{stat.stat_value}</h3>
                <p className="text-sm font-medium text-text-secondary mt-1">{stat.stat_label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
