import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/config/supabaseClient';
import { getMessages } from '@/services/chatService';
import { toast } from 'sonner';

/**
 * Custom hook for group chat with Supabase Realtime subscription.
 * Manages messages, auto-scrolling, and realtime CDC updates.
 */
export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMessages(100);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching chat messages:', error.message);
      toast.error('Failed to load chat messages.');
    } finally {
      setLoading(false);
    }
  }, [scrollToBottom]);

  useEffect(() => {
    fetchMessages();

    const chatChannel = supabase
      .channel('public:chat_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        async (payload) => {
          const { data } = await supabase
            .from('chat_messages')
            .select(`*, author:profiles!author_id(id, full_name, avatar_url)`)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setMessages((prev) => {
              const exists = prev.some((m) => m.id === data.id);
              if (exists) return prev;
              return [...prev, data];
            });
            scrollToBottom();
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'chat_messages' },
        (payload) => {
          setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [fetchMessages, scrollToBottom]);

  return { messages, loading, messagesEndRef, refetch: fetchMessages };
};
