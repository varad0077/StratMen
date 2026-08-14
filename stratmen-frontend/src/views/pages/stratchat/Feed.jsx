import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { PostCreator } from '@/components/feed/PostCreator';
import { FilterBar } from '@/components/feed/FilterBar';
import { PostCard } from '@/components/feed/PostCard';
import { NoRecords } from '@/components/NoRecords';
import { Loader } from '@/components/Loader';
import { usePosts } from '@/hooks/usePosts';

export const Feed = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const { posts, loading, refetch } = usePosts(activeFilter);
  const { user, profile, isAdmin } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Create Post Widget */}
      <PostCreator
        onPostCreated={refetch}
        currentUser={user}
        currentProfile={profile}
      />

      {/* Filter Bar */}
      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Feed List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader size="lg" text="Fetching social feed updates..." />
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={user}
              isAdmin={isAdmin}
              onPostDeleted={refetch}
            />
          ))
        ) : (
          <NoRecords
            title="No posts found"
            description={
              activeFilter === 'saved'
                ? "You haven't bookmarked any posts yet."
                : activeFilter === 'mine'
                ? "You haven't published any posts yet. Share something above!"
                : 'No community updates published yet.'
            }
          />
        )}
      </div>
    </div>
  );
};
