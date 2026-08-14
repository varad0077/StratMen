import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Link2, Sparkles, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { UserAvatar } from '@/components/ui/avatar';
import { getTeamMembers } from '@/services/contentService';
import { PageLoader } from '@/components/Loader';

export const AboutUs = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await getTeamMembers(true);
        setTeam(data);
      } catch (error) {
        console.error('Error fetching team:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) return <PageLoader text="Loading About Us..." />;

  const fallbackTeam = [
    {
      id: 1,
      name: 'Varad Pimpalkhare',
      role: 'Founder & Lead',
      bio: 'Visionary behind StratMen Foundation. Passionate about building strategic leaders and fostering community-driven growth.',
      linkedin_url: 'https://linkedin.com',
    },
    {
      id: 2,
      name: 'Nikhil Sharma',
      role: 'Co-Lead',
      bio: 'Strategic thinker and operations expert. Drives weekly meeting agendas and industry visit planning.',
      linkedin_url: 'https://linkedin.com',
    },
    {
      id: 3,
      name: 'Tejasvi Intern',
      role: 'Tech Lead',
      bio: 'Full-stack developer responsible for building and maintaining the StratMen digital ecosystem.',
      linkedin_url: 'https://linkedin.com',
    },
  ];

  const teamList = team.length > 0 ? team : fallbackTeam;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Background Story Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Our Story</span>
        </div>
        <h1 className="text-4xl font-extrabold text-text-primary tracking-tight">About StratMen Foundation</h1>
        <p className="text-text-secondary text-base leading-relaxed">
          StratMen Foundation was created with a single focused vision: to bridge the gap between theoretical knowledge and real-world strategic decision-making. We bring together ambitious leaders, founders, and professionals through structured weekly meets, industry exposure, and a private digital community.
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-border bg-surface-dark space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">Strategic Growth</h3>
          <p className="text-sm text-text-secondary">Developing critical thinking, business acumen, and long-term vision in every session.</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface-dark space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Award className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">Real-World Exposure</h3>
          <p className="text-sm text-text-secondary">On-site industry visits and interactive talks with established founders and executives.</p>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface-dark space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">Peer Ecosystem</h3>
          <p className="text-sm text-text-secondary">A trusted, curated network of leaders collaborating in our private StratChat portal.</p>
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary">Leadership Team</h2>
          <p className="text-sm text-text-secondary mt-1">The minds behind StratMen Foundation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamList.map((member, idx) => (
            <motion.div
              key={member.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card className="glass h-full hover:border-accent/40 transition-all text-center p-6 space-y-4">
                <UserAvatar
                  src={member.photo_url}
                  name={member.name}
                  size="xl"
                  className="mx-auto border-2 border-accent/40"
                />
                <div>
                  <h3 className="text-lg font-bold text-text-primary">{member.name}</h3>
                  <p className="text-xs font-semibold text-accent mt-0.5">{member.role}</p>
                </div>
                {member.bio && (
                  <p className="text-sm text-text-secondary line-clamp-3">{member.bio}</p>
                )}
                {member.linkedin_url && (
                  <div className="pt-2">
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors"
                    >
                      <Link2 className="h-4 w-4" />
                      <span>Connect on LinkedIn</span>
                    </a>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
