@AGENTS.md

# TB Solutions — Project Context

## Overview
Full-stack company website for TorchBearer Solutions (Satish, owner).
- **Live URL**: https://tbsolutions.online
- **Vercel alias**: https://tb-solutions-official.vercel.app
- **GitHub**: https://github.com/tbsolutionsofficial/TB_Solutions.git
- **Firebase project**: `tb-solutions` (Spark plan — no Storage)
- **Admin email**: `tbsolutions.official@gmail.com` (only this email can access /admin)

## Stack
- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4 with `@theme` (no tailwind.config.ts — use CSS variables)
- Firebase Firestore + Firebase Auth
- `framer-motion` for animations
- `@dnd-kit/core@6.3.1` + `@dnd-kit/sortable@10.0.0` for drag-and-drop
- ImgBB API for image uploads (key: `cc85c5da2303711c91a2b81a146a207b`)
- `react-hook-form` + `zod` for forms
- `sonner` for toasts
- Nodemailer for optional email (non-fatal — Firestore is always primary)

## Design System
- **Coral**: `#cc785c` (primary accent) — use `text-coral`, `glass-coral`, `bg-coral`
- **Navy/dark**: `#181715` — use `text-ink`, `bg-ink`
- **Glass cards**: `glass-light`, `glass-dark`, `glass-shimmer` utility classes
- **Typography**: `font-cormorant` for headings, `font-inter` for body
- **Liquid glass** aesthetic throughout — frosted glass panels, blurred backgrounds

## Firestore Collections
| Collection | Notes |
|---|---|
| `projects` | `sortOrder` field; ordered by sortOrder asc; client-side sort only |
| `reviews` | `approved: boolean`; never use `orderBy` with `where` (no composite index) |
| `banners` | Public read; per-domain promotional banners |
| `offers` | Public read; promotional offers with multi-domain targeting |
| `contacts` | Public create, auth-only read; contact form submissions |
| `siteContent` | Single doc `"main"`; all CMS content for site |
| `adminSettings` | Auth-only |

## Critical Rules
- **Never use `orderBy` + `where` together in Firestore** — causes composite index error on Spark plan. Always filter with `where` only, then sort client-side.
- **Firestore is primary for all data** — email (Nodemailer) is always fire-and-forget in a try/catch.
- **ImgBB for images** — Firebase Storage is not available on Spark plan.
- **`export const dynamic = "force-dynamic"`** on all admin pages.
- Admin is locked to `tbsolutions.official@gmail.com` only — never change this.
- **Do not commit `.env.local`** — it is in .gitignore.

## Key Files
- `lib/types.ts` — all TypeScript interfaces (Project, Banner, Offer, ContactSubmission, SiteContent, Review)
- `lib/firestore.ts` — all Firestore CRUD functions
- `lib/firebase.ts` — Firebase app initialization
- `hooks/useSiteContent.ts` — real-time hook for CMS content
- `components/admin/AdminSidebar.tsx` — admin nav (Dashboard, Projects, Reviews, Banners, Offers, Contacts, Site Content, Settings)
- `components/ui/GlassNav.tsx` — public navbar with logo `/public/logo.png`
- `app/admin/layout.tsx` — admin shell with mobile bottom nav
- `app/page.tsx` — homepage (Hero → Banners → DomainsStrip → Projects → Offers → HowWeWork → WhoWeServe → Reviews → Contact)

## Admin Pages
- `/admin/dashboard` — stats overview
- `/admin/projects` — list with drag-and-drop reorder
- `/admin/projects/new` — create project
- `/admin/projects/[id]/edit` — edit project
- `/admin/reviews` — approve/reject reviews
- `/admin/banners` — manage promotional banners (drag-reorder)
- `/admin/offers` — manage promotional offers
- `/admin/contacts` — inbox for contact form submissions
- `/admin/content` — Site Content CMS (hero, contact info, social, about, offers headline, T&C)
- `/admin/settings` — admin settings

## Public Pages
- `/` — homepage
- `/projects/[id]` — project detail
- `/terms` — Terms & Conditions (CMS-driven from siteContent)

## Deployment
```bash
# Deploy to production
vercel --prod --yes

# Pull env vars
vercel env pull .env.local
```
Vercel auto-deploys on push to `main`. Always run `npm run build` before pushing to catch type errors.

## Environment Variables (in Vercel dashboard)
- `NEXT_PUBLIC_FIREBASE_*` — Firebase config
- `NEXT_PUBLIC_IMGBB_API_KEY` — ImgBB image upload key
- `CONTACT_EMAIL_USER` — sender Gmail
- `CONTACT_EMAIL_PASSWORD` — Gmail app password
- `CONTACT_RECEIVER_EMAIL` — tbsolutions.official@gmail.com
