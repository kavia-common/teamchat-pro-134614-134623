import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useChat } from '../context/ChatContext';

// PUBLIC_INTERFACE
export default function Sidebar() {
  /** Fixed sidebar with channel management and navigation. */
  const { channels, createChannel } = useChat();
  const location = useLocation();
  const [newChannel, setNewChannel] = useState('');

  const activePath = location.pathname;

  const handleCreate = () => {
    if (!newChannel.trim()) return;
    createChannel(newChannel.trim());
    setNewChannel('');
  };

  return (
    <aside className="sidebar" role="navigation" aria-label="Channels sidebar">
      <div className="sidebar-header">
        <strong>TeamChat</strong>
        <span className="pill">beta</span>
      </div>
      <div className="sidebar-scroll">
        <div className="section-title">Channels</div>
        <div>
          {channels.map((ch) => {
            const to = `/channel/${ch.id}`;
            const active = activePath === to;
            return (
              <Link key={ch.id} to={to} className={`channel-item ${active ? 'active' : ''}`}>
                <span>#</span>
                <span>{ch.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="channel-actions">
        <input
          className="input"
          placeholder="new-channel"
          value={newChannel}
          onChange={(e) => setNewChannel(e.target.value)}
          aria-label="New channel name"
        />
        <button className="btn-primary" onClick={handleCreate}>Create</button>
      </div>
    </aside>
  );
}
