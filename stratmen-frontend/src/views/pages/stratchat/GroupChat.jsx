import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Send, Image, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { useChat } from '@/hooks/useChat';
import { sendMessage, deleteMessage } from '@/services/chatService';
import { validateAndUploadImage } from '@/config/cloudinary';
import { Loader } from '@/components/Loader';
import { toast } from 'sonner';

export const GroupChat = () => {
  const { messages, loading, messagesEndRef } = useChat();
  const { user, isAdmin } = useSelector((state) => state.auth);
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) return;

    try {
      setSending(true);
      let imageUrl = null;

      if (imageFile) {
        toast.info('Uploading chat attachment...');
        imageUrl = await validateAndUploadImage(imageFile);
      }

      await sendMessage(content.trim(), imageUrl);
      setContent('');
      removeImage();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await deleteMessage(messageId);
      toast.success('Message deleted');
    } catch (error) {
      console.error('Delete message error:', error);
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-3xl mx-auto rounded-xl border border-border-subtle bg-bg-white shadow-card overflow-hidden">
      {/* Chat Window Header */}
      <div className="p-4 border-b border-border-subtle flex items-center gap-3 bg-bg-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-soft">
          <MessageSquare className="h-5 w-5 text-green-deep" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-dark font-heading">StratChat Group Room</h3>
          <p className="text-xs text-text-muted flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success inline-block" />
            Realtime WebSocket Feed Enabled
          </p>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-bg-warm">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader text="Connecting to Realtime Group Chat..." />
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isOwn={msg.author_id === user?.id}
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-text-muted space-y-2">
            <MessageSquare className="h-10 w-10 text-border-mid" />
            <p className="text-sm">No messages sent yet in Group Chat.</p>
            <p className="text-xs">Be the first leader to say hello!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 border-t border-border-subtle bg-bg-white space-y-2">
        {/* Attachment preview */}
        {imagePreview && (
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview" className="h-20 rounded-lg border border-border-subtle object-cover" />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 p-1 rounded-full bg-text-dark text-white hover:bg-danger transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            id="chat-file-input"
          />
          <label htmlFor="chat-file-input">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="text-text-muted hover:text-green-deep cursor-pointer"
            >
              <Image className="h-5 w-5" />
            </Button>
          </label>

          <Input
            placeholder="Type a message to StratMen group..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={sending}
            className="flex-1 h-11 text-sm"
          />

          <Button
            type="submit"
            disabled={sending || (!content.trim() && !imageFile)}
            className="h-11 px-5 font-semibold"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
