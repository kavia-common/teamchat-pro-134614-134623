import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';

// PUBLIC_INTERFACE
export default function Composer({ channelId }) {
  /** Input area to compose and send messages. Shift+Enter for newline, Enter to send. */
  const { sendMessage } = useChat();
  const [text, setText] = useState('');

  const submit = async () => {
    const t = text.trim();
    if (!t) return;
    await sendMessage(channelId, t);
    setText('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="composer">
      <div className="composer-inner">
        <button className="btn-ghost" title="Add">➕</button>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={`Message #${channelId}`}
          aria-label="Message input"
        />
        <button className="btn-primary" onClick={submit} aria-label="Send message">Send ➤</button>
      </div>
    </div>
  );
}
