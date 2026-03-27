# Zoo 2 Animal Park — CLAUDE.md

## Project Overview
Community management tool for the mobile game *Zoo 2: Animal Park*. Helps club members plan competitions, manage animal inventories, and track contest results.

## Tech Stack
- **Framework:** Next.js 13.4.8 (Pages Router)
- **Database:** MySQL via Prisma ORM (TiDB Cloud in prod, XAMPP locally)
- **Auth:** NextAuth.js with Discord OAuth (roles: Besucher, Editor, Admin)
- **Styling:** Styled Components
- **i18n:** next-i18next (de default, en supported)
- **State:** SWR for server state
- **UI:** React Toastify (toasts), SweetAlert2 (modals), Lucide React + React Icons

## Project Structure
```
pages/api/          # REST API endpoints
pages/              # Next.js pages (file-based routing)
components/         # Feature components (animals/, contests/, page-structure/)
services/           # Business logic (AnimalService, ContestService, etc.)
lib/                # prisma.js singleton, db.js MySQL fallback
utils/              # helpers (translations, XP_MAP, FlagMap)
hooks/              # Custom hooks (useSort)
prisma/             # schema.prisma + seed scripts + data/
public/locales/     # i18n translation files (de/, en/)
styles/             # Global styles and theme
```

## Key Conventions
- **API routes** live in `pages/api/` — use Prisma for DB queries
- **Service layer** in `services/` contains business logic, called by API routes and pages
- **Components** are organized by feature then by role (Overview, Detail, Form)
- **Translations** go in both `public/locales/de/*.json` and `public/locales/en/*.json`
- **Database table names** are German (tiere, wettbewerbe, mitglieder, gehege, etc.)

## Database Models (Prisma)
- `tiere` — Animals
- `wettbewerbe` — Contests
- `wettbewerb_ergebnisse` — Contest entries/results
- `contest_statuen` — Contest reward statues
- `mitglieder` — Club members
- `gehege` — Habitats/Biomes
- `users` — Auth users

## Scripts
```bash
npm run dev          # Start dev server
npm run build        # Prisma generate + Next.js build
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to DB
npm run lint         # ESLint
```

## Environment
- `.env.local` — local dev (XAMPP MySQL + Discord OAuth test credentials)
- `.env` — production (TiDB Cloud + Vercel)
- Never commit `.env` or `.env.local`

## Current Branch
`feature/edit-delete-contest` — adding edit/delete functionality for contests