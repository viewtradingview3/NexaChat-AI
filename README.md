# NexaChat AI

A polished responsive messaging web app for Chrome on mobile and PC.

## Included features

- Premium responsive desktop and mobile interface
- Light and dark themes
- Persistent browser storage
- Contact search and in-chat search
- New conversation flow
- Profile editor and photo upload
- Settings and compact layout
- Text, image, document and voice-note messages
- Nexa AI assistant chat
- AI chat summary, smart replies, translation and draft rewriting
- Offline demo AI that works without an API key
- Optional secure OpenAI server integration
- Installable PWA setup
- Keyboard shortcut: Ctrl/Cmd + K focuses chat search

## Run in CodeSandbox

1. Import this ZIP as a new project.
2. Wait for dependencies to install.
3. Run `npm run dev`.
4. Open the preview.

The interface and offline demo AI will work immediately.

## Run on your computer

```bash
npm install
npm run dev
```

Open the URL shown by Vite.

## Enable real AI

The API key must stay on the server, never inside the React browser code.

1. Copy `.env.example` to `.env`.
2. Add your API key:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.5
PORT=8787
```

3. Run both the web app and AI server:

```bash
npm run dev:full
```

When the server is unavailable, the app automatically uses the included offline demo AI.

## Important limitation

This ZIP is a complete professional frontend demo with local browser persistence. Real accounts, cross-device synchronization, end-to-end encrypted multi-user messaging, cloud media storage, push notifications, voice/video calling and admin controls require a real backend. Firebase or Supabase can be connected in the next phase.
