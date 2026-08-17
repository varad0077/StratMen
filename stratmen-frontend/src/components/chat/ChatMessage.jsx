import React from 'react';
import { UserAvatar } from '@/components/ui/avatar';
import { formatRelativeTime } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

export const ChatMessage = ({ message, isOwn, isAdmin, onDelete }) => {
  const authorName = message.author?.full_name || 'Member';

  return (
    <div className={`flex items-start gap-3 group ${isOwn ? 'flex-row-reverse' : ''}`}>
      {!isOwn && (
        <UserAvatar
          src={message.author?.avatar_url}
          name={authorName}
          size="sm"
        />
      )}

      <div className={`flex flex-col space-y-1 max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && (
          <span className="text-[11px] font-semibold text-text-muted px-1">
            {authorName}
          </span>
        )}

        <div
          className={`relative p-3 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? 'bg-green-deep text-white font-medium rounded-tr-none shadow-sm'
              : 'bg-bg-white text-text-dark rounded-tl-none border border-border-subtle shadow-sm'
          }`}
        >
          {message.image_url && (
            <img
              src={message.image_url}
              alt="Attachment"
              className="max-h-60 rounded-lg mb-2 object-cover"
            />
          )}

          <p className="whitespace-pre-wrap break-words">{message.content}</p>

          <span
            className={`block text-[10px] mt-1 text-right ${
              isOwn ? 'text-white/60' : 'text-text-muted'
            }`}
          >
            {formatRelativeTime(message.created_at)}
          </span>
        </div>
      </div>

      {(isOwn || isAdmin) && onDelete && (
        <button
          onClick={() => onDelete(message.id)}
          className="opacity-0 group-hover:opacity-100 self-center text-text-muted hover:text-danger p-1 transition-opacity cursor-pointer"
          title="Delete message"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
