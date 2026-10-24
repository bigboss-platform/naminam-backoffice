@AGENTS.md

# naminam/backoffice-app — AI Agent Briefing

## What this project is

The **back office (admin panel) for Ñami Ñam Dulcería-Pastelería**. The client logs in and
manages everything the public site (`../landing-app/`) shows: desserts (name, category,
price, description, photo/video link, availability, "Nuestros favoritos"), categories,
contact (WhatsApp, phone, Instagram), location (address + Google Maps pin), opening hours
and the home cover photo. Built in Cycle 03 (2026-10-06).

- **No dedicated backend project** (user decision): Next.js Server Actions talk to MongoDB
  directly, server-side only. The browser never sees the DB.
- **No media server** (user decision): the admin pastes public links to photos/videos
  (Cloudinary, ImgBB, …). "Ver cómo se verá" previews the exact menu card before saving.
- The public site reads the same MongoDB (`../landing-app/src/server/siteData.ts`) and is
  refreshed on demand after every save (`src/server/publicSite.ts` → landing `/api/revalidate`).
- Same look, feel, UX rules and coding rules as the landing (Ñami tokens, fonts, logo, icons).
- Brief for the future coupons app (Ñami Rewards, `../naminam.md` second half) also needs an
  admin: **extend this back office** with coupon/customer sections instead of building another.

**Stack:** Next.js 16 (App Router, Turbopack, `proxy.ts`) · React 19 · TypeScript · CSS
Modules · `mongodb` driver · `jose` (session JWT) · Node `crypto.scrypt` (passwords) ·
Docker (local MongoDB 7). Runs on **port 3001** (landing uses 3000).

## Run it locally

```bash
cd naminam/backoffice-app
npm install
npm run db:up        # docker compose up -d → MongoDB on localhost:27017 (volume naminam-mongo-data)
npm run seed         # indexes + first admin + current menu/business data (safe to re-run; --reset wipes)
npm run dev          # http://localhost:3001  → /login
npm test             # 26 unit + integration tests (integration uses DB "naminam_test", auto-dropped)
```

`.env.local` (gitignored) holds `MONGODB_URI`, `MONGODB_DB`, `SESSION_SECRET`, `ADMIN_EMAIL`,
`ADMIN_NAME`, `ADMIN_PASSWORD` (first admin, created by the seed) and the optional
`LANDING_REVALIDATE_URL` + `LANDING_REVALIDATE_SECRET`. Template: `.env.example`.
Seed data (`scripts/seed-data.json`) was generated from the landing's original data files.

## Security model (follow it for every new feature)

- `src/server/**` is `server-only`: DB client (`db/mongo.ts`), repositories, auth.
- `src/proxy.ts`: optimistic redirect only (valid cookie? else `/login`). The **real check is
  the DAL** (`server/auth/dal.ts`): pages call `requirePageSession()`, every Server Action
  calls `getActionSession()` and returns `NOT_LOGGED_IN_ERROR` when missing.
- Every Server Action re-validates input with the same pure validators the forms use
  (`features/*/utils/*.validation.ts`) and returns `ActionResult` (never throws to the client;
  errors are human Spanish messages).
- Sessions: HS256 JWT in httpOnly cookie `naminam_session`, 7 days. Passwords: scrypt
  (`scrypt$salt$hash`, same format in `scripts/seed.mjs`). Login lockout: 5 failures →
  10 min (in-memory, `server/auth/loginThrottle.ts`).
- The only outbound fetch from user input is `saveLocation` following **Google Maps short
  links only** (`maps.app.goo.gl` / `goo.gl/maps`) — keep that allow-list if you touch it.

## Data model (MongoDB, DB `naminam`)

| Collection | Shape | Notes |
|---|---|---|
| `admins` | email (unique), name, passwordHash, createdAt | |
| `products` | slug (unique), name, categoryId (= category slug), price, description, note, badge, isFeatured, isAddOn, isAvailable, mediaType (image\|video), mediaUrl, posterUrl, sortOrder, createdAt, updatedAt | slug never changes on rename (public links `/menu#slug`) |
| `categories` | slug (unique), label, tagline, sortOrder | deletable only when empty |
| `settings` | single doc `_id: "business"`: name, tagline, whatsappNumber, phoneNumber, instagramHandle, address, city, mapsUrl, mapLatitude, mapLongitude, hours[{id,label,opensAt,closesAt}], heroImageUrl, updatedAt | |

Types: `features/products/types/*.type.ts`, `features/business/types/BusinessSettings.type.ts`.

## Architecture (workspace conventions)

```
src/
  app/                  login/, (admin)/{productos,categorias,negocio,cuenta}/ — thin pages (session + data → Container)
  proxy.ts
  server/               db/mongo.ts, auth/{session,dal,password,loginThrottle}.ts,
                        repositories/*.repository.ts, publicSite.ts      (all server-only)
  features/
    core/               components (BottomSheet, KeypadField/NumericKeyboard, FormField, PillChoice,
                        SheetActions, ConfirmSheet, InfoSheet, SaveButton, PageHeader, TopBar,
                        BottomNav, EmptyState, BrandLogo), utils (format, links), types (ActionResult)
    auth/ products/ categories/ business/ account/   → {actions,components,containers,hooks,types,utils,config}
tests/                  node:test files + alias-loader (runs TS sources directly)
scripts/                seed.mjs, seed-data.json, fetch-icon-font.mjs, process-logo.mjs
```

- File naming: `Thing.component.tsx`, `ThingContainer.container.tsx`, `useThing.hook.ts`,
  `thing.action.ts` (real `'use server'` files), `thing.repository.ts`, `Thing.type.ts`.
- English identifiers, Spanish UI. 200-line rule + `ctx` pattern (`../../AGENTS.md`).
- **Sheets/keypads render through a portal to `<body>`** (`BottomSheet`, `NumericKeyboard`):
  the `.page-fade-in` transform would otherwise pin `position: fixed` to the page.
- Icons: self-hosted subsets — add names to `scripts/fetch-icon-font.mjs` and run it.

## Verify before declaring done (outside UI/UX audit sessions)

```bash
npx tsc --noEmit && npx eslint src --max-warnings=0 && npm test && npx next build
```

## Where to look for things

| Question | Where |
|---|---|
| What's built | `FEATURES.md` |
| What's pending | `TASKS.md` |
| Last session | `SESSION.md` |
| Changes | `CHANGELOG.md` |
| UI/UX decisions | `UI-UX-RULES.md` (+ `../landing-app/UI-UX-RULES.md`, `../../UI-UX-RULES.md`) |
| Cycle history | `../../tasks/naminam-landing/ROADMAP.md` |
