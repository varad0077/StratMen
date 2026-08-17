import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Link2, Award, Users } from 'lucide-react';
import { UserAvatar } from '@/components/ui/avatar';
import { getTeamMembers } from '@/services/contentService';
import { PageLoader } from '@/components/Loader';
import { toast } from 'sonner';

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
        toast.error('Failed to load team data. Showing defaults.');
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

  const values = [
    {
      Icon: Shield,
      title: 'Strategic Growth',
      description: 'Developing critical thinking, business acumen, and long-term vision in every session.',
    },
    {
      Icon: Award,
      title: 'Real-World Exposure',
      description: 'On-site industry visits and interactive talks with established founders and executives.',
    },
    {
      Icon: Users,
      title: 'Peer Ecosystem',
      description: 'A trusted, curated network of leaders collaborating in our private StratChat portal.',
    },
  ];

  return (
    <div className="bg-bg-warm min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* ── Story Header ── */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <span className="editorial-label">Our Story</span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-text-dark tracking-tight">
            About <span className="text-green-mint">StratMen Foundation</span>
          </h1>
          <p className="text-text-mid text-base leading-relaxed">
            StratMen Foundation was created with a single focused vision: to bridge the gap between theoretical knowledge and real-world strategic decision-making. We bring together ambitious leaders, founders, and professionals through structured weekly meets, industry exposure, and a private digital community.
          </p>
        </div>

        {/* ── Core Values ── */}
        <div className="space-y-8">
          <div className="text-center">
            <span className="editorial-label">What We Believe</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-heading font-bold text-text-dark">
              Our Core <span className="text-green-mint">Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map(({ Icon, title, description }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-7 rounded-xl border border-border-subtle bg-bg-white shadow-card space-y-4"
              >
                <div className="p-2.5 rounded-lg bg-green-soft w-fit">
                  <Icon className="h-5 w-5 text-green-deep" />
                </div>
                <h3 className="text-base font-bold text-text-dark font-heading">{title}</h3>
                <p className="text-sm text-text-mid leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Leadership Team ── */}
        <div className="space-y-10">
          <div className="text-center">
            <span className="editorial-label">The Team</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-heading font-bold text-text-dark">
              Leadership <span className="text-green-mint">Team</span>
            </h2>
            <p className="text-sm text-text-mid mt-1.5">The minds behind StratMen Foundation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamList.map((member, idx) => (
              <motion.div
                key={member.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-8 rounded-xl border border-border-subtle bg-bg-white shadow-card hover:shadow-card-hover transition-all duration-300 text-center space-y-4"
              >
                <UserAvatar
                  src={member.photo_url}
                  name={member.name}
                  size="xl"
                  className="mx-auto border-2 border-green-soft"
                />
                <div>
                  <h3 className="text-base font-bold text-text-dark font-heading">{member.name}</h3>
                  <p className="text-xs font-semibold text-green-deep mt-0.5">{member.role}</p>
                </div>
                {member.bio && (
                  <p className="text-sm text-text-mid line-clamp-3 leading-relaxed">{member.bio}</p>
                )}
                {member.linkedin_url && (
                  <div className="pt-2 border-t border-border-subtle">
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-green-deep transition-colors"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                      <span>Connect on LinkedIn</span>
                    </a>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
