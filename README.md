# AI Workplace Productivity Assistant

A privacy-first SaaS web app that helps professionals automate everyday workplace tasks with AI — drafting emails, planning daily/weekly schedules, and answering workplace questions through a chatbot. No sign-up, no database, no persistent storage: all state lives in the current browser session and clears on refresh.

## Project Overview

The AI Workplace Productivity Assistant delivers a clean, modern SaaS experience for professionals seeking AI assistance with workplace communication, task planning, and general productivity. The application is immediately accessible without registration, prioritises user privacy by avoiding all forms of persistent data storage, and provides a responsive, intuitive interface across devices.

Color palette: **navy, red, and grey**, with light and dark themes powered by semantic design tokens.

## Features Implemented

- **Dashboard (`/`)** — Welcome hero, privacy notice, quick-action cards linking to each tool, and rotating productivity tips.
- **Smart Email Generator (`/email`)** — Form-driven email drafting (recipient, subject, purpose, key points, tone, length). Editable subject/body, plus Copy, Regenerate, Clear, Download as TXT, and Download as PDF.
- **AI Task Planner (`/planner`)** — Daily/Weekly toggle, inputs for working hours, meetings, deadlines, tasks and break preference. Renders a schedule with priority-coded cards (High / Medium / Low) and supports Edit, Copy, Regenerate, and Clear.
- **AI Chatbot (`/chat`)** — Streaming conversational assistant built with AI Elements. Suggested prompts, typing shimmer, Clear Conversation, and Clear Last Response. Session-only state.
- **Responsible AI (`/responsible-ai`)** — Static guidance on limitations, human review, privacy, ethics, security, and best practices.
- **Help (`/help`)** — Overview, feature descriptions, prompt-writing tips, FAQ, and privacy notes.
- **Global UX** — Collapsible sidebar navigation, top bar with theme toggle, responsible-AI disclaimer banner on generated outputs, and consistent semantic theming across light/dark modes.

## Technologies and Tools Used

- **Framework:** TanStack Start v1 (React 19, file-based routing, SSR/server functions)
- **Build tool:** Vite 7
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 with semantic tokens defined in `src/styles.css`
- **UI components:** shadcn/ui (Radix primitives) + AI Elements for the chat surface
- **Icons:** lucide-react
- **Animation:** framer-motion
- **AI SDK:** Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`)
- **AI provider:** Lovable AI Gateway — model `google/gemini-3-flash-preview`
- **PDF export:** jsPDF
- **Runtime:** Cloudflare Workers-compatible edge functions (via TanStack Start)
- **Package manager:** Bun

## Setup Instructions

### Prerequisites

- [Bun](https://bun.sh/) (or Node.js 20+ with npm/pnpm)
- A Lovable AI Gateway API key (`LOVABLE_API_KEY`)

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```
LOVABLE_API_KEY=your_lovable_ai_gateway_key
```

When running inside Lovable, this key is provisioned automatically.

### 3. Start the dev server

```bash
bun run dev
```

The app is served at [http://localhost:8080](http://localhost:8080).

### 4. Build for production

```bash
bun run build
```

### 5. Project structure

```
src/
  routes/               File-based routes (TanStack Start)
    __root.tsx          Root layout, fonts, sidebar shell
    index.tsx           Dashboard
    email.tsx           Smart Email Generator
    planner.tsx         AI Task Planner
    chat.tsx            AI Chatbot
    responsible-ai.tsx  Responsible AI page
    help.tsx            Help / FAQ
    api/chat.ts         Streaming chat server route
  lib/
    ai-gateway.server.ts    Lovable AI Gateway client
    email.functions.ts      generateEmail server function
    planner.functions.ts    generatePlan server function
  components/           App-specific components (sidebar, banners, theme toggle)
  styles.css            Tailwind v4 theme tokens (navy / red / grey)
```

## Privacy

The application does not use a database, cookies, or `localStorage` for user content. All generated emails, plans, and chat messages exist only in the current browser tab and are discarded on refresh or close.
