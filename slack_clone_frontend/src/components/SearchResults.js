import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function SearchResults({ results, onItemClick }) {
  /** Renders a list of global search results. Not wired by default. */
  if (!results?.length) return null;
  return (
    <div style={{padding:12, borderTop: '1px solid var(--border)'}}>
      <div style={{color:'var(--muted)', fontSize:12, marginBottom:8}}>Search results</div>
      <div style={{display:'grid', gap:6}}>
        {results.map((r) => (
          <Link
            key={r.id}
            to={`/channel/${r.channelId}`}
            onClick={onItemClick}
            className="channel-item"
            style={{borderRadius:8}}
          >
            <div style={{display:'grid', gap:2}}>
              <div><strong>{r.authorName}</strong> in #{r.channelId}</div>
              <div style={{color:'var(--muted)'}}>{r.text}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
