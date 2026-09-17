# BlueZone — Job Application Tracker

A full-stack web application for managing the entire job search process — tracking applications, interviews, and follow-ups in one place, with a visual pipeline view and real dashboard analytics.

Built as a portfolio project to demonstrate practical full-stack development: authentication built from first principles, ownership-secured authorization, relational data modeling, and database-level aggregation — not just CRUD.

## Features

- **Authentication** — registration, login, logout, with bcrypt password hashing and database-backed sessions (instantly revocable on logout, unlike stateless JWTs)
- **Application management** — full CRUD with server-side validation; search, filter, sort, and pagination, all driven by shareable URL query parameters
- **Interview tracking** — multiple interviews per application, each with its own round, date, type, notes, and result
- **Dashboard** — live statistics computed via database aggregation (`GROUP BY`-style queries), recent applications, upcoming interviews, and upcoming follow-ups
- **Kanban board** — drag-and-drop status pipeline using the native HTML5 Drag and Drop API (no external library)
- **Authorization** — every read and write is scoped to the logged-in user at the database query level, not just hidden in the UI; verified with dedicated ownership-check test scripts
- **Responsive design** — mobile navigation, card-based mobile layout for data tables, tested across phone/tablet/desktop widths
- **Polish** — loading states, empty states, custom 404/error pages, accessible modal dialogs (Escape-to-close, focus management)

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4 |
| Database | PostgreSQL (hosted on Neon) |
| ORM | Prisma ORM 7 |
| Auth | Custom — bcryptjs, jose (JWT signing), database-backed sessions |
| Validation | Zod |

No external authentication platform, no ORM-adjacent BaaS, no state management library — deliberately built on a minimal, explainable stack.

## Architecture
Browser
↓
Next.js App Router
↓
React Server Components ←→ Client Components (forms, Kanban drag, modals)
↓
Server Actions / Route Handlers
↓
Prisma Client
↓
PostgreSQL (Neon)


No separate backend server — Next.js Server Actions handle all data mutations directly, colocated with the pages that use them.

## Database design

Three related models:

- **User** → has many **Applications**
- **Application** → belongs to a User, has many **Interviews**
- **Interview** → belongs to an Application

Cascading deletes are configured at the database level (deleting a user removes their applications and interviews automatically). IDs use UUID v7 (time-sortable). See [`prisma/schema.prisma`](./prisma/schema.prisma) for the full schema.

## Authorization model

Every Server Action that reads or writes an `Application` or `Interview` verifies the record belongs to the logged-in user as part of the database query itself — for example:

```typescript
await prisma.application.update({
  where: { id: applicationId, userId: session.userId },
  data: { ... },
});
```

If the ID doesn't exist, or exists but belongs to another user, this fails identically either way — no information is leaked about whether a given ID is valid. This is verified directly with dedicated scripts in [`src/scripts/`](./src/scripts/) (`test-ownership.ts`, `test-interview-ownership.ts`, `test-regression.ts`), which simulate a second user attempting to access the first user's data.

## Local setup

### Prerequisites
- Node.js 22 LTS or newer
- A free [Neon](https://neon.com) PostgreSQL database

### Steps

```bash
git clone <your-repo-url>
cd job-application-tracker
npm install
```

Copy `.env.example` to `.env` and fill in your own values:

```ini
DATABASE_URL="your-neon-pooled-connection-string"
DATABASE_URL_UNPOOLED="your-neon-direct-connection-string"
SESSION_SECRET="generate-with-the-command-in-.env.example"
```

Run migrations and start the dev server:

```bash
npx prisma migrate deploy
npm run dev
```

Visit `http://localhost:3000`.

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon pooled connection string — used by the running app |
| `DATABASE_URL_UNPOOLED` | Neon direct connection string — used only for migrations |
| `SESSION_SECRET` | Signing key for session tokens — generate a new one per environment, never reuse |

## Deployment

Deployed on Vercel, with the production PostgreSQL database on Neon. See [Deployment](#deployment) section — *(filled in during Phase 15)*.

## Known limitations

- No rate limiting on login/registration attempts — would need a shared store (e.g. Redis) to implement correctly across serverless function instances, which was deliberately kept out of this project's scope
- Search uses a basic `contains` query rather than a dedicated full-text search index, which is fine at portfolio scale but wouldn't scale to a very large dataset without a trigram index

## Future improvements

- Email/SMS notifications for upcoming follow-ups and interviews
- Rate limiting on authentication endpoints
- Export application history to CSV