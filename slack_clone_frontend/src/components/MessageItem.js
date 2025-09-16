import React from 'react';

// PUBLIC_INTERFACE
export default function MessageItem({ msg }) {
  /** Renders a message with avatar, author name, time, and text. */
  const dt = new Date(msg.createdAt);
  const time = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const initials = (msg.authorName || '?')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="message-row">
      <div className="avatar" aria-hidden>
        {msg.authorAvatar ? (
          <img src={msg.authorAvatar} alt={`${msg.authorName} avatar`} />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      <div className="msg-bubble">
        <div className="msg-meta">
          <span className="msg-author">{msg.authorName}</span>
          <span className="msg-time">{time}</span>
        </div>
        <div className="msg-text">{msg.text}</div>
      </div>
    </div>
  );
}
