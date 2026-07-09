# AI Workplace Productivity Assistant

A privacy-first SaaS app with a sidebar dashboard, three AI tools, and supporting info pages. No auth, no database — all state lives in the current browser session and clears on refresh.

## Design direction

- Clean modern SaaS: white / light-grey surfaces, blue accent, soft shadows, rounded cards
- Semantic tokens defined in `src/styles.css` (light + dark), Inter-alternative distinctive type pairing (e.g. Space Grotesk headings + Inter body loaded via `<link>` in `__root.tsx`)
- Shadcn sidebar (`collapsible="icon"`) + top bar with logo, title, theme toggle
- Framer-motion for subtle transitions; AI Elements for the chat surface

## Routes (TanStack Start, file-based)

```
src/routes/
  __root.tsx            fonts, meta, providers, sidebar layout, <Outlet />
  index.tsx             Dashboard (welcome, quick actions, rotating tips)
  email.tsx             Smart Email Generator
  planner.tsx           AI Task Planner
  chat.tsx              AI Workplace Chatbot
  responsible-ai.tsx    Responsible AI page
  help.tsx              Help / FAQ
  api/chat.ts           Streaming chat server route (AI SDK)
```

Each route sets its own `head()` (title/description/og). No og:image on `__root`.

## AI wiring

- Lovable AI Gateway via `@ai-sdk/openai-compatible` helper in `src/lib/ai-gateway.server.ts`
- Model: `google/gemini-3-flash-preview` (fast, multimodal-capable, good default)
- `src/routes/api/chat.ts` — `streamText` + `toUIMessageStreamResponse` for the chatbot
- `src/lib/email.functions.ts` — `createServerFn` returning `{ subject, body }` via `Output.object` (small schema, no bounds)
- `src/lib/planner.functions.ts` — `createServerFn` returning structured plan `{ items: [{ title, priority, start, end, note }], breaks, tips, estimatedTotal }`
- System prompts as specified in the brief; disclaimer appended to outputs
- Errors surfaced to UI: 429 rate limit, 402 credits exhausted, validation

## Features

### Dashboard (`/`)
- Welcome hero with purpose blurb + privacy notice callout
- 4 quick-action cards → Email, Plan Day, Plan Week, Chat
- Rotating productivity tips (client-side interval, session-only)

### Smart Email Generator (`/email`)
- Form: recipient, subject, purpose, key points, tone (Formal/Friendly/Persuasive), length (Short/Medium/Detailed)
- Calls `generateEmail` server fn
- Editable textarea + subject field; Copy / Regenerate / Clear / Download TXT / Download PDF (jsPDF)
- Disclaimer shown above output

### AI Task Planner (`/planner`)
- Toggle Daily / Weekly
- Inputs: working hours, meeting times (list), deadlines, tasks with priority, break preference
- Calls `generatePlan` server fn
- Renders schedule cards color-coded by priority (High/Med/Low semantic tokens)
- Edit (inline), Copy, Regenerate, Clear

### AI Chatbot (`/chat`)
- AI Elements (`conversation`, `message`, `prompt-input`, `shimmer`) installed via `bunx ai-elements@latest add ...`
- `useChat` + `DefaultChatTransport({ api: "/api/chat" })`
- Suggested prompts, typing shimmer, Clear Conversation, Clear Last Response
- Session-only (React state; no persistence)

### Responsible AI (`/responsible-ai`)
- Static content: limitations, human review, privacy, ethics, security, best practices

### Help (`/help`)
- Overview, feature descriptions, FAQ accordion, prompt tips, privacy, responsible AI

## Shared components
- `AppSidebar`, `TopBar`, `ThemeToggle` (class-based dark mode with `@custom-variant dark`)
- `DisclaimerBanner` reused across AI features
- `OutputActions` (Copy/Regenerate/Clear/Download) reused

## Non-goals (explicitly excluded)
- No auth, no Cloud/Supabase, no DB, no localStorage persistence of content
- No Save buttons, no history pages, no user profile/notifications
- No sign-up, no analytics tied to users

## Tech notes
- Tailwind v4 tokens in `src/styles.css`; add priority color tokens (`--priority-high/med/low`)
- Load fonts via `<link>` in `__root.tsx` head (never `@import` remote in CSS)
- `jspdf` added via `bun add` for email PDF export
- Provision `LOVABLE_API_KEY` via `lovable_api_key--create` if missing

## Build order
1. Provision AI key, install deps (`ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`, `jspdf`, AI Elements)
2. Theme tokens + fonts + sidebar layout in `__root.tsx`
3. Dashboard + Responsible AI + Help (static)
4. Email generator (server fn + UI)
5. Task planner (server fn + UI)
6. Chat (api route + AI Elements UI)
7. Verify build + quick Playwright smoke of each route
