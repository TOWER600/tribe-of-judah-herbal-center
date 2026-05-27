# Cloudflare Workers + React Template

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/TOWER600/tribe-of-judah-herbal-center)

A modern, production-ready full-stack template featuring React frontend with Vite, Cloudflare Workers backend, Durable Objects for stateful entities, and shadcn/ui components.

## Features

- **Full-Stack Architecture**: React + TypeScript frontend with Hono-powered Cloudflare Workers API
- **Stateful Backend**: Durable Objects with built-in entity management and indexing system for users, chats, and messages
- **Beautiful UI**: Pre-configured shadcn/ui components, Tailwind CSS, and dark mode support
- **Modern Tooling**: Vite, React Router, TanStack Query, Immer for state management
- **Type Safety**: End-to-end TypeScript with shared types between frontend and worker
- **Developer Experience**: Error boundaries, API client utilities, and hot reload for both client and worker
- **Deployment Ready**: Zero-config deployment to Cloudflare Workers with wrangler

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite + Cloudflare Vite plugin
- TanStack React Query
- React Router 6
- Tailwind CSS + shadcn/ui (New York style)
- Lucide icons, Sonner for toasts, Framer Motion

**Backend**
- Cloudflare Workers (Hono framework)
- Durable Objects with custom entity layer and indexes
- Shared TypeScript types and mock data

**Tooling**
- Bun package manager
- ESLint + TypeScript strict checking
- PostCSS, Autoprefixer

## Prerequisites

- Bun (recommended) or Node.js 18+
- Cloudflare account (for deployment)

## Installation

Clone the repository and install dependencies:

```bash
bun install
```

Start the development server (serves both frontend and worker):

```bash
bun run dev
```

The app will be available at `http://localhost:3000`.

## Development

- **Frontend**: Edit files in `src/` — changes hot-reload automatically.
- **Backend**: Edit `worker/user-routes.ts` to add API endpoints. The worker uses shared types from `shared/`.
- **Entities**: Customize `worker/entities.ts` to add or modify Durable Object entities (users, chats, etc.).
- **Types**: Update `shared/types.ts` for shared data models between client and worker.
- **Linting**: Run `bun run lint` to check code quality.

The template includes a working chat demo showing Durable Object entity CRUD, indexing, and messaging.

## Deployment

Deploy to Cloudflare Workers with a single command:

```bash
bun run deploy
```

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/TOWER600/tribe-of-judah-herbal-center)

The project uses `wrangler.jsonc` with Durable Object migrations and asset handling configured for SPA routing. All API routes are served by the Worker.

## Project Structure

```
src/              # React frontend (pages, components, hooks, lib)
worker/           # Cloudflare Worker (index.ts, entities, user-routes)
shared/           # Shared TypeScript types and mock data
```

For more details on architecture and extending the template, explore the inline JSDoc comments and core utilities in `worker/core-utils.ts`.