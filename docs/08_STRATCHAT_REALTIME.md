# StratChat Realtime & Group Chat Specification (Supabase Realtime)
**Version**: 2.0.0

---

## 1. Supabase Realtime Architecture

Supabase provides built-in WebSockets out of the box via PostgreSQL Change Data Capture (CDC) and Broadcast channels. No custom WebSocket server is required.

---

## 2. StratChat Feed Realtime (Posts Subscription)

Listen to database inserts/deletes on the `posts` table using `supabase.channel()`:

```javascript
// hooks/usePosts.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/config/supabaseClient';

export const usePosts = (filter = 'all') => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles(id, full_name, avatar_url, role),
          likes(user_id),
          comments(id),
          bookmarks(user_id)
        `)
        .order('created_at', { ascending: false });

      if (filter === 'mine') {
        const { data: { user } } = await supabase.auth.getUser();
        query = query.eq('author_id', user.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchPosts();

    // Subscribe to realtime post insertions & deletions
    const postsChannel = supabase
      .channel('public:posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          // Re-fetch or prepending new post
          fetchPosts();
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'posts' },
        (payload) => {
          setPosts((prev) => prev.filter((p) => p.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
    };
  }, [fetchPosts]);

  return { posts, loading, refetch: fetchPosts };
};
```

---

## 3. Group Chat Realtime (Chat Messages Subscription)

Listen to database inserts on the `chat_messages` table for instant messaging:

```javascript
// hooks/useChat.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/config/supabaseClient';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          author:profiles(id, full_name, avatar_url)
        `)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      setMessages(data || []);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error('Error fetching chat messages:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = async (content) => {
    if (!content.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('chat_messages')
      .insert([
        {
          author_id: user.id,
          content: content.trim()
        }
      ]);

    if (error) throw error;
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to realtime new chat messages
    const chatChannel = supabase
      .channel('public:chat_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        async (payload) => {
          // Fetch full message with author info
          const { data } = await supabase
            .from('chat_messages')
            .select(`*, author:profiles(id, full_name, avatar_url)`)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setMessages((prev) => [...prev, data]);
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
  }, [fetchMessages]);

  return { messages, loading, sendMessage, messagesEndRef };
};
```

---

## 4. Enabling Realtime Replication in Supabase SQL

To enable Realtime for `posts` and `chat_messages`, execute the following SQL:

```sql
-- Enable Realtime publication for tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
```
