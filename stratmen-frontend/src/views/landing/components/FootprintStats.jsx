import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MessageSquare, Building2 } from 'lucide-react';

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
    <section className="py-16 bg-bg-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="editorial-label">Our Impact</span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-heading font-bold text-text-dark">
            StratMen <span className="text-green-mint">Footprint</span>
          </h2>
          <p className="text-sm text-text-mid mt-2">
            Measurable growth driven by community dedication.
          </p>
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
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 rounded-xl border border-border-subtle bg-bg-white shadow-card hover:shadow-card-hover transition-all duration-300 text-center group"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-2.5 rounded-lg bg-green-soft group-hover:scale-105 transition-transform duration-200">
                    <IconComponent className="h-5 w-5 text-green-deep" />
                  </div>
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-text-dark font-heading">
                  {stat.stat_value}
                </h3>
                <p className="text-sm font-medium text-text-mid mt-1">{stat.stat_label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
