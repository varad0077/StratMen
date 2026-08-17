import React, { useState, useRef } from 'react';
import { Image, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserAvatar } from '@/components/ui/avatar';
import { validateAndUploadImage } from '@/config/cloudinary';
import { createPost } from '@/services/postService';
import { toast } from 'sonner';

export const PostCreator = ({ onPostCreated, currentUser, currentProfile }) => {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) {
      toast.error('Please write something or upload an image.');
      return;
    }

    try {
      setLoading(true);
      let imageUrl = null;

      if (imageFile) {
        toast.info('Uploading & compressing image to WebP...');
        imageUrl = await validateAndUploadImage(imageFile);
      }

      await createPost(content.trim(), imageUrl);
      toast.success('Post published!');
      setContent('');
      removeImage();
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error('Create post error:', error);
      toast.error(error.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const displayName = currentProfile?.full_name || currentUser?.user_metadata?.full_name || currentUser?.email;

  return (
    <div className="p-4 rounded-xl border border-border-subtle bg-bg-white shadow-card">
      <div className="flex items-start gap-3">
        <UserAvatar
          src={currentProfile?.avatar_url || currentUser?.user_metadata?.avatar_url}
          name={displayName}
        />
        <div className="flex-1 space-y-3">
          <Textarea
            rows={3}
            placeholder="Share an update, insight, or milestone with StratMen leaders..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />

          {/* Image Preview Container */}
          {imagePreview && (
            <div className="relative inline-block rounded-lg overflow-hidden border border-border-subtle">
              <img src={imagePreview} alt="Preview" className="max-h-48 object-cover rounded-lg" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 rounded-full bg-text-dark/70 text-white hover:bg-text-dark transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                id="post-image-input"
              />
              <label htmlFor="post-image-input">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-text-muted hover:text-green-deep cursor-pointer"
                >
                  <Image className="h-4 w-4 mr-1.5" />
                  <span>Photo</span>
                </Button>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-text-muted">
                {content.length}/1000
              </span>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading || (!content.trim() && !imageFile)}
                size="sm"
                className="font-semibold"
              >
                <Send className="h-3.5 w-3.5" />
                {loading ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
