# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (see `pnpm-workspace.yaml` / `pnpm-lock.yaml`).

- `pnpm dev` — start the dev server (http://localhost:3000)
- `pnpm build` — production build (`output: "standalone"`)
- `pnpm start` — run the production build
- `pnpm lint` — Biome check (lint + import organization)
- `pnpm format` — Biome format with `--write`

Linting/formatting is **Biome**, not ESLint/Prettier. Config in `biome.json`: 2-space indent, recommended rules plus Next.js and React domains. There is no test suite configured.

Docker: `docker compose up --build` builds via the `Dockerfile`, which uses pnpm (`corepack enable` + `pnpm install --frozen-lockfile`) to match local dev.

## Architecture

Single-page personal portfolio built on **Next.js 16 (App Router) + React 19**, TypeScript strict, Tailwind CSS v4 (via `@tailwindcss/postcss`), Framer Motion for animation. The React Compiler is enabled (`reactCompiler: true` in `next.config.ts`) — do not hand-add `useMemo`/`useCallback` purely for memoization; the compiler handles it.

Path alias: `@/*` → `src/*`.

### Content flow (the central abstraction)

All page content (name, hero text, experiences, projects, certifications, organizations, contact) flows through a single `Content` type (`src/types/content.ts`). There are **three layers**, and which one you touch matters:

1. **`src/constants/index.ts`** — the hardcoded default content. `src/lib/content.ts#getDefaultContent()` assembles a `Content` object from these constants. This is **client-safe** (no Node APIs) and is the fallback/seed.
2. **`data/content.json`** — runtime-editable content. `src/lib/content-server.ts#readContent()` reads this file (falling back to `getDefaultContent()` if missing/invalid). This is **server-only** (`fs`) — import it **only in API routes**.
3. **`src/contexts/ContentContext.tsx`** — client provider that seeds with `getDefaultContent()`, then `fetch`es `/api/content` on mount and swaps in the live data. Components read content via the `useContent` hook (`src/hooks/`), never by importing constants directly.

So: editing constants changes the build-time default; editing `data/content.json` (or via the admin UI) changes the live runtime content without a rebuild.

### Admin / editing

`src/app/admin/page.tsx` is a client-side content editor. It saves edited content by POSTing to `/api/content` (which writes `data/content.json`) and uploads images via `/api/upload` (writes to `public/uploads/`, returns a URL). In Docker these two paths are persisted as named volumes (`content_data`, `content_uploads`) so admin edits survive restarts.

### Chatbot

`src/components/chatbot.tsx` calls `/api/chat`, which proxies to **DeepInfra** (`openai/gpt-oss-20b`) with **streaming SSE**. The system prompt is built server-side from the live `Content` (via `readContent()`), so the bot only answers from the portfolio data. Requires `DEEPINFRA_API_KEY` (see `.env.example`). `/api/chat/status` reports whether the key is configured so the UI can hide the chatbot when it isn't.

### Page composition

`src/app/page.tsx` renders the fixed background + `Navbar` + a single `<main>` stacking the section components (`Hero`, `Technologies`, `Experience`, `Projects`, `Certification`, `Organization`, `Contact`) + `Chatbot`. `src/app/layout.tsx` wraps everything in `ContentProvider` and Geist fonts, and mounts Vercel Analytics. `src/components/section.tsx` is the shared scroll-animated section wrapper.
