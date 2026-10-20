# AI Insurance Frontend

Next.js frontend for the AI Insurance Operations Platform. The API lives in the separate `ai-insurance-backend` repository.

## Getting Started

Requires Node.js 20.9+.

```bash
npm install
npm run dev
```

Open http://localhost:3000

Requests to `/api/*` are proxied to the backend (see `next.config.js`). Set `NEXT_PUBLIC_API_URL` to point at your backend, e.g. `NEXT_PUBLIC_API_URL=http://localhost:8000`. The value is read at build time, so rebuild after changing it.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run typecheck` | TypeScript check |

## Pages

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/submit` | Public | Customer claim submission with document upload |
| `/login`, `/register` | Public | Operations accounts |
| `/dashboard` | Signed in | Claim queue with status and risk filters |
| `/dashboard/[id]` | Signed in | Claim detail: AI extraction, risk, customer conversation, documents, decisions, audit trail |
| `/analytics` | Signed in | Operational metrics computed from live data |

## Authentication

Operations pages require an account. The bearer token returned by the backend is kept in `localStorage` and sent with every API call; an expired session redirects to `/login`. Customers submit claims without an account.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 3, TanStack Table, Recharts, lucide-react.
