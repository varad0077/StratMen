import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Users, UserCheck, FileText, Activity, Check, X, Trash2, Plus, Edit2, ShieldAlert } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/ui/avatar';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { Loader } from '@/components/Loader';
import { getRequests, updateRequestStatus } from '@/services/joinRequestService';
import { getAllowlist, addMember, revokeMember, updateMember } from '@/services/allowlistService';
import { getUsers, suspendUser, unsuspendUser, deleteUser, getDashboardStats, getAuditLogs } from '@/services/adminService';
import {
  getActivities, createActivity, updateActivity, deleteActivity,
  getJourneyMilestones, createMilestone, updateMilestone, deleteMilestone,
  getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember,
} from '@/services/contentService';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [stats, setStats] = useState(null);

  // 1. Join Requests state
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  // 2. Allowlist state
  const [allowlist, setAllowlist] = useState([]);
  const [allowlistSearch, setAllowlistSearch] = useState('');
  const [allowlistLoading, setAllowlistLoading] = useState(true);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('StratMen Member');
  const [newMemberIsAdmin, setNewMemberIsAdmin] = useState(false);

  // 3. User Management state
  const [users, setUsers] = useState([]);
  const [usersSearch, setUsersSearch] = useState('');
  const [usersLoading, setUsersLoading] = useState(true);

  // 4. Content Editor state (Activities, Journey, Team)
  const [contentSubTab, setContentSubTab] = useState('activities');
  const [activities, setActivities] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [contentLoading, setContentLoading] = useState(true);

  // New Activity Form Modal state
  const [newActTitle, setNewActTitle] = useState('');
  const [newActDesc, setNewActDesc] = useState('');
  const [newActFreq, setNewActFreq] = useState('Weekly');
  const [showActModal, setShowActModal] = useState(false);

  // 5. Audit Logs state
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);

  // Modal dialog confirm state
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', description: '', onConfirm: null });

  // Load stats
  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {});
  }, []);

  // Fetch Join Requests
  const fetchRequestsData = useCallback(async () => {
    try {
      setRequestsLoading(true);
      const data = await getRequests();
      setRequests(data);
    } catch (error) {
      toast.error('Failed to load join requests');
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  // Fetch Allowlist
  const fetchAllowlistData = useCallback(async () => {
    try {
      setAllowlistLoading(true);
      const data = await getAllowlist(allowlistSearch);
      setAllowlist(data);
    } catch (error) {
      toast.error('Failed to load allowlist');
    } finally {
      setAllowlistLoading(false);
    }
  }, [allowlistSearch]);

  // Fetch Users
  const fetchUsersData = useCallback(async () => {
    try {
      setUsersLoading(true);
      const data = await getUsers(usersSearch);
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  }, [usersSearch]);

  // Fetch Content
  const fetchContentData = useCallback(async () => {
    try {
      setContentLoading(true);
      const [acts, jm, tm] = await Promise.all([
        getActivities(false),
        getJourneyMilestones(false),
        getTeamMembers(false),
      ]);
      setActivities(acts);
      setMilestones(jm);
      setTeamMembers(tm);
    } catch (error) {
      toast.error('Failed to load website content');
    } finally {
      setContentLoading(false);
    }
  }, []);

  // Fetch Audit Logs
  const fetchLogsData = useCallback(async () => {
    try {
      setLogsLoading(true);
      const { logs: logData } = await getAuditLogs();
      setLogs(logData);
    } catch (error) {
      toast.error('Failed to load audit logs');
    } finally {
      setLogsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'requests') fetchRequestsData();
    if (activeTab === 'allowlist') fetchAllowlistData();
    if (activeTab === 'users') fetchUsersData();
    if (activeTab === 'content') fetchContentData();
    if (activeTab === 'logs') fetchLogsData();
  }, [activeTab, fetchRequestsData, fetchAllowlistData, fetchUsersData, fetchContentData, fetchLogsData]);

  // Handle Approve/Reject Join Request
  const handleReviewRequest = async (id, status) => {
    try {
      await updateRequestStatus(id, status);
      toast.success(`Request ${status} successfully!`);
      fetchRequestsData();
    } catch (error) {
      toast.error('Failed to update request status');
    }
  };

  // Handle Add Member to Allowlist
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail || !newMemberName) {
      toast.error('Email and Name are required.');
      return;
    }
    try {
      await addMember({
        email: newMemberEmail,
        name: newMemberName,
        role: newMemberRole,
        is_admin: newMemberIsAdmin,
      });
      toast.success('Member added to allowlist!');
      setNewMemberEmail('');
      setNewMemberName('');
      fetchAllowlistData();
    } catch (error) {
      toast.error(error.message || 'Failed to add member to allowlist');
    }
  };

  // Handle Revoke Member
  const handleRevokeMember = (email) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Revoke Member Access',
      description: `Are you sure you want to revoke access for ${email}? They will no longer be able to access StratChat.`,
      onConfirm: async () => {
        try {
          await revokeMember(email);
          toast.success('Member access revoked');
          fetchAllowlistData();
        } catch (error) {
          toast.error('Failed to revoke access');
        } finally {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  // Handle Suspend/Unsuspend User
  const handleToggleSuspend = async (userObj) => {
    try {
      if (userObj.is_suspended) {
        await unsuspendUser(userObj.id);
        toast.success('User unsuspended');
      } else {
        await suspendUser(userObj.id);
        toast.success('User suspended');
      }
      fetchUsersData();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  // Handle Create Activity
  const handleCreateActivity = async (e) => {
    e.preventDefault();
    if (!newActTitle || !newActDesc) {
      toast.error('Title and description are required.');
      return;
    }
    try {
      await createActivity({
        title: newActTitle,
        description: newActDesc,
        frequency: newActFreq,
        is_published: true,
      });
      toast.success('New Activity published to website landing page!');
      setNewActTitle('');
      setNewActDesc('');
      setShowActModal(false);
      fetchContentData();
    } catch (error) {
      toast.error('Failed to create activity');
    }
  };

  // Handle Delete Activity
  const handleDeleteActivity = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Activity',
      description: 'Are you sure you want to remove this activity from the public website?',
      onConfirm: async () => {
        try {
          await deleteActivity(id);
          toast.success('Activity deleted');
          fetchContentData();
        } catch (error) {
          toast.error('Failed to delete activity');
        } finally {
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-xl border border-accent/30 bg-surface-dark space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent border border-accent/40">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">StratChat Integrated Admin Portal</h2>
            <p className="text-xs text-text-secondary">Administrative control center for membership allowlist, join applications, user management, and public website content.</p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2 border-t border-border-light text-center">
          <div className="p-2 rounded bg-surface-elevated">
            <p className="text-sm font-bold text-accent">{stats?.totalPendingRequests || 0}</p>
            <p className="text-[10px] text-text-muted">Pending Requests</p>
          </div>
          <div className="p-2 rounded bg-surface-elevated">
            <p className="text-sm font-bold text-accent">{stats?.totalAllowlisted || 0}</p>
            <p className="text-[10px] text-text-muted">Allowlisted</p>
          </div>
          <div className="p-2 rounded bg-surface-elevated">
            <p className="text-sm font-bold text-accent">{stats?.totalProfiles || 0}</p>
            <p className="text-[10px] text-text-muted">Total Users</p>
          </div>
          <div className="p-2 rounded bg-surface-elevated">
            <p className="text-sm font-bold text-accent">{stats?.totalPosts || 0}</p>
            <p className="text-[10px] text-text-muted">Feed Posts</p>
          </div>
          <div className="p-2 rounded bg-surface-elevated">
            <p className="text-sm font-bold text-accent">{stats?.totalChatMessages || 0}</p>
            <p className="text-[10px] text-text-muted">Chat Msgs</p>
          </div>
          <div className="p-2 rounded bg-surface-elevated">
            <p className="text-sm font-bold text-accent">{stats?.totalActivities || 0}</p>
            <p className="text-[10px] text-text-muted">Activities</p>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full flex">
          <TabsTrigger value="requests" active={activeTab === 'requests'} className="flex-1">
            <UserCheck className="h-4 w-4 mr-1.5" />
            Join Requests ({requests.filter(r => r.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="allowlist" active={activeTab === 'allowlist'} className="flex-1">
            <Users className="h-4 w-4 mr-1.5" />
            Allowlist ({allowlist.length})
          </TabsTrigger>
          <TabsTrigger value="users" active={activeTab === 'users'} className="flex-1">
            <ShieldAlert className="h-4 w-4 mr-1.5" />
            User Mgmt
          </TabsTrigger>
          <TabsTrigger value="content" active={activeTab === 'content'} className="flex-1">
            <FileText className="h-4 w-4 mr-1.5" />
            Content Editor
          </TabsTrigger>
          <TabsTrigger value="logs" active={activeTab === 'logs'} className="flex-1">
            <Activity className="h-4 w-4 mr-1.5" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: JOIN REQUESTS */}
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pending Join Applications</CardTitle>
              <CardDescription className="text-xs">Review applications submitted from the StratChat Entry Gate.</CardDescription>
            </CardHeader>
            <CardContent>
              {requestsLoading ? (
                <Loader text="Loading requests..." />
              ) : requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <div key={req.id} className="p-4 rounded-xl border border-border bg-surface-elevated space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-text-primary">{req.full_name}</h4>
                          <p className="text-xs text-text-muted">{req.email} • {req.phone}</p>
                        </div>
                        <Badge variant={req.status === 'pending' ? 'warning' : req.status === 'approved' ? 'success' : 'destructive'}>
                          {req.status}
                        </Badge>
                      </div>

                      <div className="text-xs text-text-secondary bg-surface-dark p-3 rounded-lg border border-border/50">
                        <span className="font-semibold text-text-primary block mb-1">Reason for joining:</span>
                        {req.reason}
                      </div>

                      {req.linkedin_url && (
                        <a href={req.linkedin_url} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline inline-block">
                          View LinkedIn Profile →
                        </a>
                      )}

                      {req.status === 'pending' && (
                        <div className="flex items-center gap-2 pt-2">
                          <Button size="sm" onClick={() => handleReviewRequest(req.id, 'approved')} className="font-semibold">
                            <Check className="h-4 w-4 mr-1" /> Approve & Add to Allowlist
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleReviewRequest(req.id, 'rejected')}>
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted text-center py-6">No join requests found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: ALLOWLIST MANAGEMENT */}
        <TabsContent value="allowlist">
          <Card className="space-y-6 p-6">
            <div>
              <h3 className="text-base font-bold text-text-primary mb-1">Add Member to Allowlist</h3>
              <form onSubmit={handleAddMember} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Input placeholder="Email Address" value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} />
                <Input placeholder="Full Name" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} />
                <Input placeholder="Role (e.g. Member)" value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)} />
                <Button type="submit" className="font-semibold">
                  <Plus className="h-4 w-4 mr-1" /> Add Member
                </Button>
              </form>
            </div>

            <div>
              <h3 className="text-base font-bold text-text-primary mb-3">Allowlisted Members ({allowlist.length})</h3>
              <Input
                placeholder="Search allowlist by name or email..."
                value={allowlistSearch}
                onChange={(e) => setAllowlistSearch(e.target.value)}
                className="mb-4"
              />

              {allowlistLoading ? (
                <Loader text="Loading allowlist..." />
              ) : (
                <div className="space-y-2">
                  {allowlist.map((mem) => (
                    <div key={mem.email} className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-elevated">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{mem.name} {mem.is_admin && <span className="text-xs text-accent">(Admin)</span>}</p>
                        <p className="text-xs text-text-muted">{mem.email} • {mem.role}</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleRevokeMember(mem.email)} className="text-danger hover:bg-danger/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* TAB 3: USER MANAGEMENT */}
        <TabsContent value="users">
          <Card className="p-6 space-y-4">
            <Input
              placeholder="Search users by name or email..."
              value={usersSearch}
              onChange={(e) => setUsersSearch(e.target.value)}
            />

            {usersLoading ? (
              <Loader text="Loading users..." />
            ) : (
              <div className="space-y-3">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-elevated">
                    <div className="flex items-center gap-3">
                      <UserAvatar src={u.avatar_url} name={u.full_name} />
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{u.full_name}</p>
                        <p className="text-xs text-text-muted">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={u.is_suspended ? 'default' : 'outline'}
                        onClick={() => handleToggleSuspend(u)}
                      >
                        {u.is_suspended ? 'Unsuspend' : 'Suspend'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* TAB 4: WEBSITE CONTENT EDITOR */}
        <TabsContent value="content">
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-text-primary">Manage Public Website Content</h3>
                <p className="text-xs text-text-muted">Edit landing page activities, journey milestones, and team cards.</p>
              </div>
              <Button size="sm" onClick={() => setShowActModal(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add New Activity
              </Button>
            </div>

            {/* Modal for New Activity */}
            {showActModal && (
              <form onSubmit={handleCreateActivity} className="p-4 rounded-xl border border-accent/40 bg-surface-elevated space-y-3">
                <h4 className="text-sm font-bold text-accent">Add New Website Activity</h4>
                <Input placeholder="Title (e.g. Workshop Series)" value={newActTitle} onChange={(e) => setNewActTitle(e.target.value)} />
                <Textarea placeholder="Description..." value={newActDesc} onChange={(e) => setNewActDesc(e.target.value)} rows={2} />
                <Input placeholder="Frequency (e.g. Monthly)" value={newActFreq} onChange={(e) => setNewActFreq(e.target.value)} />
                <div className="flex gap-2">
                  <Button type="submit" size="sm">Publish Activity</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowActModal(false)}>Cancel</Button>
                </div>
              </form>
            )}

            {/* Activities List */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-text-primary">Existing Activities ({activities.length})</h4>
              {activities.map((act) => (
                <div key={act.id} className="flex items-start justify-between p-3 rounded-lg border border-border bg-surface-elevated">
                  <div>
                    <h5 className="text-sm font-semibold text-text-primary">{act.title} <span className="text-xs text-accent">({act.frequency})</span></h5>
                    <p className="text-xs text-text-secondary mt-1">{act.description}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteActivity(act.id)} className="text-danger">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* TAB 5: AUDIT LOGS */}
        <TabsContent value="logs">
          <Card className="p-6">
            <h3 className="text-base font-bold text-text-primary mb-4">Admin Audit Logs</h3>
            {logsLoading ? (
              <Loader text="Loading logs..." />
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 rounded-lg border border-border bg-surface-elevated text-xs flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-text-primary">{log.admin?.full_name || 'Admin'}</span>: {log.action}
                      {log.target_table && <span className="text-text-muted"> ({log.target_table})</span>}
                    </div>
                    <span className="text-text-muted">{formatDate(log.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
      />
    </div>
  );
};
