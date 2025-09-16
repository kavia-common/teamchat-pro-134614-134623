# Integration Notes

This frontend implements a Slack-inspired UI with mock services for real-time messaging and storage. Replace the mock services with your backend as needed.

## Architecture

- src/context/ChatContext.js: Central state management for user, channels, messages, global search, and profile updates. Integration points:
  - sendMessage(channelId, text): Replace MockRealtime with your WebSocket/Convex mutations to broadcast and persist messages.
  - createChannel(name): Replace with a backend call to persist channels.
  - updateProfile({ displayName, avatarFile }): Replace MockStorage with Convex storage (or your storage service).

- src/services/mockRealtime.js: A simple event bus to simulate realtime. Replace with WebSocket/Convex live queries.

- src/services/mockStorage.js: Creates a local blob URL to simulate uploads. Replace with Convex storage client.

## Realtime

The mock realtime service exposes:
- subscribe(cb)
- emit(evt)

Production should:
- Connect to your websocket
- On new messages, update state
- Persist messages server-side

## Storage

Replace `MockStorage.upload(file, key)` with your Convex function that returns a public URL.

## Routing

- /channel/:channelId for chat view
- /profile for profile page

## Auto-scroll

The ChatWindow auto-scrolls when new messages arrive or user is near the bottom.

## Search

Global search filters across all messages in-memory. Replace with a backend search API for large datasets.
