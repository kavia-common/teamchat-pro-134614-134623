import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import { ChatProvider, useChat } from './context/ChatContext';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Profile from './pages/Profile';

// PUBLIC_INTERFACE
function TopBar() {
  /** The fixed top bar containing the app logo and global search. */
  const { globalQuery, setGlobalQuery, searchResults } = useChat();

  return (
    <div className="topbar">
      <div className="logo" aria-label="TeamChat logo" />
      <div className="searchbar" role="search">
        <span>🔎</span>
        <input
          value={globalQuery}
          onChange={(e) => setGlobalQuery(e.target.value)}
          placeholder="Search all messages..."
          aria-label="Search all messages"
        />
        <span className="pill">{searchResults.length} results</span>
      </div>
      <Link to="/profile" className="btn">Profile</Link>
    </div>
  );
}

// PUBLIC_INTERFACE
function Layout() {
  /** The main app layout with a fixed sidebar and main content area. */
  return (
    <div className="app-shell">
      <TopBar />
      <div className="content">
        <Sidebar />
        <div className="main">
          <Routes>
            <Route path="/" element={<Navigate to="/channel/general" replace />} />
            <Route path="/channel/:channelId" element={<ChatWindow />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<div style={{padding: 16}}>Not Found</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root application. Wraps providers and router. */
  return (
    <ChatProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ChatProvider>
  );
}

export default App;
