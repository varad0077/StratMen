import React, { useState, useEffect } from 'react';
import { Users, Activity } from 'lucide-react';
import { UserAvatar } from '@/components/ui/avatar';
import { getAllowlist } from '@/services/allowlistService';
import { getDashboardStats } from '@/services/adminService';
import { toast } from 'sonner';

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
        setMembers(membersData.slice(0, 8));
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
        toast.error('Failed to load community data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <aside className="hidden xl:block w-64 shrink-0 p-4 border-l border-border-subtle bg-bg-white min-h-[calc(100vh-4rem)] space-y-6">

      {/* ── Verified Members ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-green-deep" />
            Verified Members
          </h4>
          <span className="text-[11px] text-green-deep font-semibold">{members.length} Active</span>
        </div>

        <div className="space-y-1.5">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-bg-warm animate-pulse">
                <div className="h-8 w-8 rounded-full bg-border-subtle" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-24 bg-border-subtle rounded" />
                  <div className="h-2 w-16 bg-border-subtle/70 rounded" />
                </div>
              </div>
            ))
          ) : members.length > 0 ? (
            members.map((member) => (
              <div
                key={member.email}
                className="flex items-center gap-2.5 p-2 rounded-lg bg-bg-warm hover:bg-green-soft transition-colors duration-150"
              >
                <UserAvatar name={member.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-dark truncate">{member.name}</p>
                  <p className="text-[10px] text-text-muted truncate">{member.role}</p>
                </div>
                {member.is_admin && (
                  <span className="h-1.5 w-1.5 rounded-full bg-green-deep shrink-0" title="Admin" />
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-text-muted italic">No members found.</p>
          )}
        </div>
      </div>

      {/* ── Community Stats ── */}
      <div className="p-4 rounded-xl border border-border-subtle bg-bg-white shadow-card space-y-4">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-green-deep" />
          Community Stats
        </h4>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-3 rounded-lg bg-bg-warm">
            <p className="text-xl font-bold text-text-dark">{stats?.totalPosts || 0}</p>
            <p className="text-[10px] text-text-muted mt-0.5">Posts</p>
          </div>
          <div className="p-3 rounded-lg bg-bg-warm">
            <p className="text-xl font-bold text-text-dark">{stats?.totalAllowlisted || members.length}</p>
            <p className="text-[10px] text-text-muted mt-0.5">Members</p>
          </div>
          <div className="p-3 rounded-lg bg-bg-warm">
            <p className="text-xl font-bold text-text-dark">{stats?.totalChatMessages || 0}</p>
            <p className="text-[10px] text-text-muted mt-0.5">Chat Msgs</p>
          </div>
          <div className="p-3 rounded-lg bg-bg-warm">
            <p className="text-xl font-bold text-text-dark">{stats?.totalActivities || 3}</p>
            <p className="text-[10px] text-text-muted mt-0.5">Activities</p>
          </div>
        </div>
      </div>

    </aside>
  );
};
