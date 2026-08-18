import React from 'react';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { AdminModal } from './components/AdminModal';
import { PostCreator } from './components/PostCreator';
import { FeedList } from './components/FeedList';
import { ImageModal } from './components/ImageModal';
import { FilterBar } from './components/FilterBar';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { Toast } from './components/Toast';
import { useStratChatState } from './hooks/useStratChatState';
import './styles/main.css';
import './styles/components.css';

export const App: React.FC = () => {
  const {
    allowlist,
    user,
    isAdmin,
    theme,
    setTheme,
    activeFilter,
    setActiveFilter,
    isAdminModalOpen,
    setIsAdminModalOpen,
    activeModalImage,
    setActiveModalImage,
    toasts,
    handleDismissToast,
    posts,
    filteredPosts,
    userPostsCount,
    userLikesReceived,
    bookmarkedCount,
    handleLoginSuccess,
    handleLogout,
    handleAddAllowedUser,
    handleRemoveAllowedUser,
    handleAddPost,
    handleToggleLike,
    handleToggleBookmark,
    handleDeletePost,
    handleCopyLink,
    handleAddComment,
    handleDeleteComment
  } = useStratChatState();

  // If Not Authenticated -> Show Dedicated Full-Screen Login Page
  if (!user) {
    return (
      <>
        <Toast toasts={toasts} onDismiss={handleDismissToast} />
        <LoginPage
          allowlist={allowlist}
          onLoginSuccess={handleLoginSuccess}
          onRegisterUser={handleAddAllowedUser}
        />
      </>
    );
  }

  return (
    <div className="app-container">
      {/* Interactive Toast Notifications */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Main Header / Navigation */}
      <Header
        isAdmin={isAdmin}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenLogoModal={() => setActiveModalImage('/logo.png')}
        onLogout={handleLogout}
      />

      {/* 3-Column Modular Dashboard Grid */}
      <div className="main-content">
        {/* Left Navigation & User Profile Sidebar */}
        <LeftSidebar
          currentUser={user}
          postsCount={userPostsCount}
          likesReceived={userLikesReceived}
          bookmarkedCount={bookmarkedCount}
          activeFilter={activeFilter}
          onSelectFilter={(f) => setActiveFilter(f)}
        />

        {/* Center Primary Feed Column */}
        <main className="feed-column">
          <PostCreator currentUser={user} onAddPost={handleAddPost} />

          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            totalFiltered={filteredPosts.length}
          />

          <FeedList
            posts={filteredPosts}
            currentUser={user}
            isAdmin={isAdmin}
            activeFilter={activeFilter}
            onToggleLike={handleToggleLike}
            onToggleBookmark={handleToggleBookmark}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onDeletePost={handleDeletePost}
            onCopyLink={handleCopyLink}
            onOpenImageModal={(url) => setActiveModalImage(url)}
          />
        </main>

        {/* Right Verified Members Sidebar */}
        <RightSidebar
          allowlist={allowlist}
          totalPostsCount={posts.length}
          currentUser={user}
        />
      </div>

      {/* Admin Access Control Modal Component */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        allowlist={allowlist}
        onAddUser={handleAddAllowedUser}
        onRemoveUser={handleRemoveAllowedUser}
      />

      {/* Lightbox Image Modal Component */}
      <ImageModal
        imageUrl={activeModalImage}
        onClose={() => setActiveModalImage(null)}
      />
    </div>
  );
};

export default App;
