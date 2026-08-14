import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Calendar, Layers, Heart, Bookmark, Mail, Phone, Edit2, Check } from 'lucide-react';
import { UserAvatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PostCard } from '@/components/feed/PostCard';
import { getFeedPosts } from '@/services/postService';
import { updateUserProfile } from '@/services/authService';
import { formatDate } from '@/lib/utils';
import { Loader } from '@/components/Loader';
import { toast } from 'sonner';

export const Profile = () => {
  const { user, profile, isAdmin } = useSelector((state) => state.auth);
  const [myPosts, setMyPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user?.id) return;
      try {
        setLoadingPosts(true);
        const posts = await getFeedPosts('mine', user.id);
        setMyPosts(posts);
      } catch (error) {
        console.error('Error loading my posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchUserPosts();
  }, [user?.id]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Full name cannot be empty.');
      return;
    }

    try {
      setUpdating(true);
      await updateUserProfile(user.id, {
        full_name: fullName.trim(),
        phone: phone.trim() || null,
      });
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email;
  const roleTitle = isAdmin ? 'Founder / Admin' : 'StratMen Member';

  // Compute stats
  const totalLikes = myPosts.reduce((acc, curr) => acc + (curr.like_count || 0), 0);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Profile Header Card */}
      <div className="p-6 rounded-xl border border-border bg-surface-dark space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <UserAvatar
            src={profile?.avatar_url || user?.user_metadata?.avatar_url}
            name={displayName}
            size="xl"
            className="border-2 border-accent/40"
          />

          <div className="flex-1 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
              <h2 className="text-2xl font-bold text-text-primary">{displayName}</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(!editing)}
                className="self-center sm:self-auto"
              >
                <Edit2 className="h-3.5 w-3.5 mr-1" />
                {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            <p className="text-xs font-semibold text-accent">{roleTitle}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-text-muted pt-2">
              <div className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-text-secondary" />
                <span>{user?.email}</span>
              </div>
              {profile?.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-text-secondary" />
                  <span>{profile.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-text-secondary" />
                <span>Joined {formatDate(profile?.created_at || user?.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {editing && (
          <form onSubmit={handleUpdateProfile} className="pt-4 border-t border-border-light space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">Full Name</label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">Phone Number</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" />
              </div>
            </div>
            <Button type="submit" size="sm" disabled={updating} className="font-semibold shadow-glow">
              <Check className="h-4 w-4 mr-1" />
              {updating ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        )}

        {/* User Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-light text-center">
          <div className="p-3 rounded-lg bg-surface-elevated">
            <div className="flex items-center justify-center gap-1 text-accent mb-1">
              <Layers className="h-4 w-4" />
              <span className="text-lg font-bold">{myPosts.length}</span>
            </div>
            <p className="text-[11px] text-text-muted">Total Posts</p>
          </div>

          <div className="p-3 rounded-lg bg-surface-elevated">
            <div className="flex items-center justify-center gap-1 text-danger mb-1">
              <Heart className="h-4 w-4 fill-danger" />
              <span className="text-lg font-bold">{totalLikes}</span>
            </div>
            <p className="text-[11px] text-text-muted">Likes Received</p>
          </div>

          <div className="p-3 rounded-lg bg-surface-elevated">
            <div className="flex items-center justify-center gap-1 text-accent mb-1">
              <Bookmark className="h-4 w-4" />
              <span className="text-lg font-bold">Member</span>
            </div>
            <p className="text-[11px] text-text-muted">Status</p>
          </div>
        </div>
      </div>

      {/* User Posts Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-text-primary">My Post Activity</h3>

        {loadingPosts ? (
          <div className="py-8 flex justify-center">
            <Loader text="Loading your posts..." />
          </div>
        ) : myPosts.length > 0 ? (
          myPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={user}
              isAdmin={isAdmin}
              onPostDeleted={() => setMyPosts((prev) => prev.filter((p) => p.id !== post.id))}
            />
          ))
        ) : (
          <div className="p-8 text-center bg-surface-dark rounded-xl border border-border">
            <p className="text-sm text-text-muted">You haven't created any posts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
