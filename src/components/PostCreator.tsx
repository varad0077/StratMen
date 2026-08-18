import React, { useState, useRef } from 'react';
import { Image, X, Send } from 'lucide-react';
import { User, Post } from '../types';

interface PostCreatorProps {
  currentUser: User;
  onAddPost: (newPost: Omit<Post, 'id' | 'timestamp' | 'likesCount' | 'comments'>) => void;
}

const MAX_CHARS = 300;

export const PostCreator: React.FC<PostCreatorProps> = ({ currentUser, onAddPost }) => {
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charCount = content.length;
  const charsRemaining = MAX_CHARS - charCount;
  const progressPercent = Math.min(100, (charCount / MAX_CHARS) * 100);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || charCount > MAX_CHARS) return;

    onAddPost({
      author: currentUser,
      content: content.trim(),
      imageUrl: imagePreview || undefined
    });

    setContent('');
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`post-creator-card ${isFocused ? 'focused' : ''}`}>
      <div className="creator-header">
        <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar" />
        <div className="creator-info">
          <span className="creator-name">{currentUser.name}</span>
          <span className="creator-subtitle">{currentUser.role} • Share an update with your network</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Textarea Input */}
        <div className="textarea-wrapper">
          <textarea
            className="post-textarea"
            placeholder="Start a 1-paragraph update, idea, or achievement..."
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={3}
          />
          {/* Progress Bar */}
          <div className="char-progress-bar">
            <div
              className={`char-progress-fill ${charsRemaining < 30 ? 'warning' : ''}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Image Preview Box */}
        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Attached preview" />
            <button
              type="button"
              className="remove-img-btn"
              onClick={() => setImagePreview(null)}
              title="Remove photo attachment"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Bottom Bar Tools */}
        <div className="creator-bottom-bar">
          <div className="creator-tools">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <button
              type="button"
              className="tool-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image size={17} style={{ color: 'var(--brand-lime)' }} />
              <span>{imagePreview ? 'Photo Attached' : 'Add Photo / Media'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: charsRemaining < 30 ? '#f59e0b' : 'var(--text-muted)'
              }}
            >
              {charsRemaining} chars left
            </span>

            <button
              type="submit"
              className="btn btn-primary post-publish-btn"
              disabled={!content.trim() || charCount > MAX_CHARS}
            >
              <Send size={15} />
              <span>Post Update</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
