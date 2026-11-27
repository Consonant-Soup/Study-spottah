# Study Spottah — Issue 1 + Transit Integration

This project is built **on the supplied Study-spottah-issue-1 codebase**, not the standalone transit project's root layout. Existing sign-in, signup, session provider, navigation, protected pages, study scheduling, spot-related components, and database schema are retained. The original `/transit` placeholder was replaced with the full UH Mānoa transit mockup.

## Navigation and login rules

| Navigation item | Signed out | Signed in | Destination |
|---|---|---|---|
| Home (house icon/logo) | Yes | Yes | `/` |
| Schedule a study session | Hidden | Yes | `/schedule` |
| Transit | Yes | Yes | `/transit` |
| Create/report a new spot | Hidden | Yes | `/spots/new` |
| Login | Yes | Replaced by profile | `/auth/signin` |
| Profile and account dropdown | Hidden | Yes | `/profile` and sign-out/change-password |

Navigation is owned by `src/components/Navbar.tsx` and styled only through `Navbar.module.css`. The root layout (`src/app/layout.tsx`) still renders the existing `Providers`, `Navbar`, and `Footer`. The transit page has **no duplicate navigation or footer**.

> Sign in is the original issue-1 credentials-based NextAuth login backed by Prisma/Postgres. It is not a fake login or a hardcoded authenticated state. Public Transit works as a route regardless of authentication, but to test sign-in and schedule a study session you must set up the issue-1 database and authentication secret.

## Folder structure

```text
src/
  app/
    page.tsx                         Existing Study Spottah homepage
    layout.tsx                       Existing app shell and auth providers
    auth/{signin,signup,signout}/    Existing login and signup flow
    schedule/                        Existing login-protected scheduling
    spots/new/                       Existing login-protected reporting placeholder
    profile/                         Existing login-protected profile placeholder
    transit/page.tsx                 New public transit route (in original folder)
    api/transit/thebus/route.ts      Optional HEA/TheBus adapter (server)
  components/
    Navbar.tsx                       Existing navbar, minimal theme change
    Navbar.module.css                New scoped nav styling
    Footer.tsx                       Unchanged shared footer
    transit/
      TransitPage.tsx                 Transit UI and arrival board
      TransitMap.tsx                  Clickable illustrative map
      Transit.module.css             Scoped transit styles
  lib/
    auth.ts                          Existing issue-1 authentication
    transit/{data,hea,schedule,types}.ts
prisma/                             Existing issue-1 schema and migrations
.env.example                         Placeholder-only environment file
.env.local.example                   Transit-only environment example
```

## Run locally

1. Install Node.js and PostgreSQL. Extract this ZIP into a *new* folder to test first; don't overwrite your team repository until you've reviewed the diffs.
2. Copy `.env.example` to `.env` and replace `YOUR_PASSWORD` with the actual password for a **local PostgreSQL** user. Ensure the `study_spottah` database exists, or point `DATABASE_URL` to your existing database.
3. Generate a fresh auth secret with `npx auth secret` or `openssl rand -base64 32`, and put it in `AUTH_SECRET` in `.env`. Do **not** copy real secrets into GitHub.
4. If you prefer, copy `.env.local.example` to `.env.local` for the transit flags (not required when defaults are used).

```powershell
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

### Study meeting scheduling and reminders

The schedule page creates meetings between the signed-in user's `Profile` and one invited profile. It stores the selected `Spot` ID, meeting times, and each person's response. The convener is accepted automatically; the invitee can accept or decline, and only the convener can cancel an upcoming meeting.

Apply the meeting migration with `npx prisma migrate dev` locally or `npx prisma migrate deploy` in production. Set `RESEND_API_KEY`, `EMAIL_FROM` (a sender verified with Resend), and a strong random `CRON_SECRET` in the server environment. The configured Vercel Cron calls `/api/cron/meeting-reminders` every five minutes; it sends a reminder about an hour before the meeting to each participant whose response is accepted. This frequency requires a Vercel plan that supports five-minute cron intervals. Meeting times and reminder formatting use the convener's browser time zone. Vercel Cron and Resend credentials must be configured in the deployed project's environment.

Visit `http://localhost:3000` for the original Study Spottah home, and `http://localhost:3000/transit` for the integrated route. After database seeding, the original issue-1 sample accounts are documented in `config/settings.development.json`; default seed password is `changeme` in the supplied template. For local-only use, do not use that password in production.

### Verify navbar by session state

- **Signed out:** Home, Transit, and Login should appear. Schedule a study session, Create/report a new spot, and Profile should not be visible in the navbar.
- **Signed in:** Home, Schedule a study session, Transit, Create/report a new spot, and Profile should appear; Login should be replaced with profile/account controls.
- `/schedule` and `/spots/new` are protected server-side using issue-1 auth helpers; hiding a link is not the only access control.

## Transit: data limitations and future API

The map is a **schematic**, not a street-accurate navigation map. TheBus ETAs are deliberately labeled sample data until connected to a verified HEA AppID. Rainbow Shuttle times are **published scheduled departures**, not live GPS tracking. Stop/route data and official source links are in `src/lib/transit/data.ts`.

Only the server reads `THEBUS_API_KEY`; the browser uses `/api/transit/thebus?stop=983`. The feature is **off by default**:

```dotenv
NEXT_PUBLIC_TRANSIT_LIVE_ENABLED=false
THEBUS_API_KEY=
```

To enable in future, obtain an official HEA AppID, configure `THEBUS_API_KEY` on the server, set `NEXT_PUBLIC_TRANSIT_LIVE_ENABLED=true`, and validate the provider's live response before relying on it. No Rainbow Shuttle live provider is configured.

## Test code

```powershell
npm run lint
npm run typecheck
npm run build
```

**Production on Vercel:** issue-1 login needs a real accessible Postgres database (localhost does not work from Vercel) and a server-side `AUTH_SECRET`. Add the transit flag as `false` for preview mode. Environment variables configured locally are not automatically copied to Vercel. The server-side HEA key should remain unset unless using the real API.

**Caution:** Deploying this integrated project to an existing Vercel production project will replace that project's codebase. Review with your team and select a separate preview project until ready.

## Differences from your two ZIPs

- Original issue-1 project is the **base**. No old code or auth system is swapped for a standalone site.
- Replaces only the placeholder `src/app/transit/page.tsx` and adds transit-scoped files and a server-side future API endpoint.
- Keeps one navbar and footer in the root layout; simplifies duplicate transit header/footer.
- Keeps the original nav's five requested destinations, with conditional login/profile visibility; adds scoped color and sharp-corner styling.
- Changes sign-in/signup landing destinations from template Stuff pages to `/`.
- Adds `lucide-react` as a dependency and improves local `src/seed.ts` async execution.
