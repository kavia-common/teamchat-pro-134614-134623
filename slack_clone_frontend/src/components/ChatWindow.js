import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import MessageItem from './MessageItem';
import Composer from './Composer';

// PUBLIC_INTERFACE
export default function ChatWindow() {
  /** Main area for a channel, displays messages and a composer. Auto-scrolls on new messages. */
  const { channelId } = useParams();
  const { channels, messages } = useChat();

  const channel = useMemo(() => channels.find(c => c.id === channelId), [channels, channelId]);
  const list = messages[channelId] || [];

  const scrollRef = useRef(null);
  const prevCount = useRef(list.length);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const isNearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 120;
    // If user is near bottom or messages increased, scroll down
    if (isNearBottom || list.length > prevCount.current) {
      el.scrollTop = el.scrollHeight;
    }
    prevCount.current = list.length;
  }, [list]);

  return (
    <>
      <div className="channel-header">
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <span>#</span>
          <strong>{channel ? channel.name : channelId}</strong>
        </div>
        <span className="pill">channel</span>
      </div>
      <div className="messages" ref={scrollRef} role="log" aria-live="polite">
        {list.map((m) => (
          <MessageItem key={m.id} msg={m} />
        ))}
      </div>
      <Composer channelId={channelId} />
    </>
  );
}
