# Deployment guide

## Frontend-only demo

Build:

```bash
npm install
npm run build
```

Upload the `dist` folder to a static host such as Vercel, Netlify, Cloudflare Pages or Firebase Hosting.

The offline demo AI works without a backend.

## Live AI deployment

Deploy the `server/index.mjs` service to a Node.js host and add these environment variables:

```env
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.5
PORT=8787
```

Then configure the frontend host to proxy `/api/ai` to the Node server, or change the request URL in `src/services/ai.ts`.

Never expose `OPENAI_API_KEY` in browser environment variables, source files, GitHub, or CodeSandbox public frontend code.

## Full real messaging backend

For multi-user production messaging, add:

- Authentication
- User and contact database
- Real-time message subscriptions
- Cloud file storage
- Server-side authorization rules
- Push notification service
- WebRTC signaling for calls
- Rate limits, abuse prevention and moderation
- Backup, logging and privacy controls
