import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { MockRealtime } from '../services/mockRealtime';
import { MockStorage } from '../services/mockStorage';

// PUBLIC_INTERFACE
export const ChatContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * ChatProvider wraps the app and provides channels, messages, search, and user profile state.
 * It uses in-memory mock services to simulate real-time messaging and storage.
 */
export function ChatProvider({ children }) {
  const realtimeRef = useRef(null);
  const storageRef = useRef(null);

  const [user, setUser] = useState(() => ({
    id: 'u-1',
    displayName: 'Ada Lovelace',
    avatarUrl: '',
  }));

  const [channels, setChannels] = useState([
    { id: 'general', name: 'general' },
    { id: 'random', name: 'random' },
  ]);

  const [activeChannelId, setActiveChannelId] = useState('general');

  // Messages by channelId: { [channelId]: Array<Message> }
  const [messages, setMessages] = useState(() => ({
    general: seedMessages('general'),
    random: seedMessages('random'),
  }));

  const [globalQuery, setGlobalQuery] = useState('');

  useEffect(() => {
    // Initialize mock services
    realtimeRef.current = new MockRealtime();
    storageRef.current = new MockStorage();

    // Subscribe to message events
    const unsub = realtimeRef.current.subscribe((evt) => {
      if (evt.type === 'message:new') {
        setMessages((prev) => {
          const next = { ...prev };
          if (!next[evt.channelId]) next[evt.channelId] = [];
          next[evt.channelId] = [...next[evt.channelId], evt.message];
          return next;
        });
      }
    });

    return () => {
      unsub();
    };
  }, []);

  // Computed: global search across all messages
  const searchResults = useMemo(() => {
    if (!globalQuery.trim()) return [];
    const q = globalQuery.toLowerCase();
    const results = [];

    Object.entries(messages).forEach(([channelId, msgs]) => {
      msgs.forEach((m) => {
        if (
          m.text.toLowerCase().includes(q) ||
          m.authorName.toLowerCase().includes(q)
        ) {
          results.push({ ...m, channelId });
        }
      });
    });

    return results.slice(-100).reverse();
  }, [globalQuery, messages]);

  // PUBLIC_INTERFACE
  const sendMessage = async (channelId, text) => {
    /** Simulates sending a message via a real-time backend. */
    const msg = {
      id: uuid(),
      authorId: user.id,
      authorName: user.displayName,
      authorAvatar: user.avatarUrl || '',
      text,
      createdAt: Date.now(),
    };

    // Emit through realtime mock
    realtimeRef.current?.emit({
      type: 'message:new',
      channelId,
      message: msg,
    });

    return msg;
  };

  // PUBLIC_INTERFACE
  const createChannel = (name) => {
    /** Adds a new channel locally. Future integration: call backend to persist channel. */
    const id = name.trim().toLowerCase().replace(/\s+/g, '-');
    if (!id) return;
    if (channels.find((c) => c.id === id)) return;
    const ch = { id, name };
    setChannels((prev) => [...prev, ch]);
    setMessages((prev) => ({ ...prev, [id]: [] }));
    setActiveChannelId(id);
  };

  // PUBLIC_INTERFACE
  const updateProfile = async ({ displayName, avatarFile }) => {
    /**
     * Updates user profile. If avatarFile is provided, stores it using MockStorage (Convex placeholder)
     * and updates avatarUrl. Otherwise only updates displayName.
     */
    let avatarUrl = user.avatarUrl;
    if (avatarFile) {
      avatarUrl = await storageRef.current.upload(avatarFile, `avatar-${user.id}`);
    }
    setUser((prev) => ({ ...prev, displayName: displayName ?? prev.displayName, avatarUrl }));
    return { ...user, displayName, avatarUrl };
  };

  const value = {
    user,
    setUser,
    channels,
    activeChannelId,
    setActiveChannelId,
    messages,
    sendMessage,
    createChannel,
    updateProfile,
    globalQuery,
    setGlobalQuery,
    searchResults,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// PUBLIC_INTERFACE
export function useChat() {
  /** Hook to access chat context. */
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}

function seedMessages(channelId) {
  const now = Date.now();
  return [
    {
      id: uuid(),
      authorId: 'u-sys',
      authorName: 'System',
      authorAvatar: '',
      text: `Welcome to #${channelId}! 🎉`,
      createdAt: now - 1000 * 60 * 60,
    },
    {
      id: uuid(),
      authorId: 'u-1',
      authorName: 'Ada Lovelace',
      authorAvatar: '',
      text: 'Hello team! This is a sample message.',
      createdAt: now - 1000 * 60 * 12,
    },
  ];
}
