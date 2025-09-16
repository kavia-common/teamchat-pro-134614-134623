import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../context/ChatContext';

// PUBLIC_INTERFACE
export default function Profile() {
  /** Profile page to edit display name and upload avatar (via mock Convex storage). */
  const { user, updateProfile } = useChat();
  const [displayName, setDisplayName] = useState(user.displayName);
  const [preview, setPreview] = useState(user.avatarUrl);
  const [pendingFile, setPendingFile] = useState(null);
  const inputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const initials = (user.displayName || '?').split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase();

  const pickFile = () => inputRef.current?.click();

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPendingFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const submit = async () => {
    setSaving(true);
    try {
      await updateProfile({ displayName, avatarFile: pendingFile });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="main">
      <div className="channel-header">
        <strong>Profile</strong>
        <span className="pill">account</span>
        <div style={{marginLeft:'auto'}}><Link className="btn" to="/">← Back</Link></div>
      </div>

      <div className="profile-card">
        <div className="profile-avatar" role="img" aria-label="Profile avatar">
          {preview ? <img src={preview} alt="avatar preview" style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <span>{initials}</span>}
        </div>
        <div>
          <div className="form-field">
            <label>Display name</label>
            <input className="input" value={displayName} onChange={(e)=>setDisplayName(e.target.value)} />
            <div className="helper">Shown next to your messages.</div>
          </div>

          <div className="form-field">
            <label>Avatar</label>
            <div style={{display:'flex', gap:8}}>
              <button className="btn" onClick={pickFile}>Upload photo</button>
              <input ref={inputRef} type="file" accept="image/*" onChange={onFile} hidden />
              {preview && <button className="btn-ghost" onClick={()=>{ setPreview(''); setPendingFile(null); }}>Remove</button>}
            </div>
            <div className="helper">We use a Convex-like storage mock. Replace in services/mockStorage.js when backend is ready.</div>
          </div>

          <div style={{display:'flex', gap:8}}>
            <button disabled={saving} className="btn-primary" onClick={submit}>{saving ? 'Saving...' : 'Save changes'}</button>
            <button className="btn" onClick={()=>{ setDisplayName(user.displayName); setPreview(user.avatarUrl); setPendingFile(null); }}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}
