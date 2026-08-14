import React, { useState, useEffect } from 'react';
import { Users, Activity, MessageSquare, Calendar } from 'lucide-react';
import { UserAvatar } from '@/components/ui/avatar';
import { getAllowlist } from '@/services/allowlistService';
import { getDashboardStats } from '@/services/adminService';

export const RightSidebar = () => {
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersData, statsData] = await Promise.all([
          getAllowlist().catch(() => []),
          getDashboardStats().catch(() => null),
        ]);
        setMembers(membersData.slice(0, 8)); // Top 8 members
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <aside className="hidden xl:block w-72 shrink-0 p-4 border-l border-border min-h-[calc(100vh-4rem)] space-y-6">
      {/* Verified Members List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-accent" />
            Verified Members
          </h4>
          <span className="text-[11px] text-accent font-semibold">{members.length} Active</span>
        </div>

        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-dark/50 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-border" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-24 bg-border rounded" />
                  <div className="h-2 w-16 bg-border/60 rounded" />
                </div>
              </div>
            ))
          ) : members.length > 0 ? (
            members.map((member) => (
              <div
                key={member.email}
                className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-dark border border-border/40 hover:border-border transition-colors"
              >
                <UserAvatar name={member.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">{member.name}</p>
                  <p className="text-[10px] text-text-muted truncate">{member.role}</p>
                </div>
                {member.is_admin && (
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" title="Admin" />
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-text-muted italic">No members found.</p>
          )}
        </div>
      </div>

      {/* Community Impact Stats */}
      <div className="p-4 rounded-xl border border-border bg-surface-dark space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-accent" />
          Community Stats
        </h4>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 rounded-lg bg-surface-elevated">
            <p className="text-lg font-bold text-accent">{stats?.totalPosts || 0}</p>
            <p className="text-[10px] text-text-muted">Posts Created</p>
          </div>
          <div className="p-2 rounded-lg bg-surface-elevated">
            <p className="text-lg font-bold text-accent">{stats?.totalAllowlisted || members.length}</p>
            <p className="text-[10px] text-text-muted">Members</p>
          </div>
          <div className="p-2 rounded-lg bg-surface-elevated">
            <p className="text-lg font-bold text-accent">{stats?.totalChatMessages || 0}</p>
            <p className="text-[10px] text-text-muted">Chat Msgs</p>
          </div>
          <div className="p-2 rounded-lg bg-surface-elevated">
            <p className="text-lg font-bold text-accent">{stats?.totalActivities || 3}</p>
            <p className="text-[10px] text-text-muted">Activities</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
