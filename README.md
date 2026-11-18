# Study Spottah — UH Mānoa Transit Mockup

A **Vercel-ready, independent Next.js 16 + React 19 + TypeScript** transit page designed for UH Mānoa students. No database, login, service key, or backend is needed to demonstrate Tier 1.

## Features

- Student-friendly **Transit** homepage and `/transit` route.
- Square-cornered UI with the required palette: `#91a8eb`, `#8eb3eb`, `#7d9946`; text is black.
- Static, illustrated campus **stop map**, filterable by TheBus and Rainbow Shuttle. The stop pins are schematic, **not exact GPS coordinates**.
- 23 TheBus stops based on the official campus bus-stop map (2025, including nearby stops), with HEA stop numbers.
- 11 unique Rainbow Shuttle stop locations on the UH Student Housing / Hawaiian Studies loop, based on the official UH published schedule and map (2026).
- **To campus / From campus** arrival board. By default TheBus arrivals are explicitly fictional samples, for design and testing only.
- **Rainbow Shuttle schedule calculations** in `Pacific/Honolulu` time, using published 30-minute weekday timetable. This is a *scheduled* time, never labeled as a GPS arrival.
- Searchable and filterable stop directory with tappable map markers.
- Mobile-responsive layout and accessible control labels.
- Tier 2: optional server-side **HEA/TheBus Arrivals JSON** API adapter and client fetcher. Inactive until an official AppID is obtained.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Windows PowerShell alternative: `Copy-Item .env.example .env.local`

Open **http://localhost:3000/transit** (or `/`). No API key is needed for the mockup. For code checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## Deploy to Vercel

1. Create a GitHub repository and commit this **project folder's contents** (not the ZIP).
2. In your Vercel dashboard, add a project using that repository. Framework: **Next.js**, Root Directory: the project root.
3. Leave environment variables unset for Tier 1, or set `NEXT_PUBLIC_TRANSIT_LIVE_ENABLED=false`.
4. Deploy. Both `/` and `/transit` show the standalone Transit page.
5. To add this to your existing team project instead, see the next section. **Do not replace that project's root app layout or base components.**

## Copy into an existing Next.js / Study Spottah project

Copy these directories into the matching locations in your team's project:

```
src/components/transit/
src/lib/transit/
src/app/transit/page.tsx
src/app/api/transit/thebus/route.ts
```

Install `lucide-react` if you don't already have it: `npm install lucide-react`. This feature's CSS is a **CSS Module**, so the transit-specific styles are contained inside `src/components/transit/Transit.module.css`.

The original project's app router must already have a `src/app/layout.tsx` and global CSS for generic font/reset. **Do not copy the standalone `src/app/page.tsx`, `layout.tsx`, or `globals.css` over your team's app**. Link your navigation to `/transit` using your existing navbar.

If your team's `@/*` alias isn't configured, either add it to `tsconfig.json` or change imports in the copied feature to relative paths.

## API: optional future TheBus real-time data

The official [Oahu Transit Services HEA](https://hea.thebus.org/api_info.asp) requires a registered AppID and documents:

```
GET http://api.thebus.org/arrivalsJSON/?key=APP_ID&stop=983
```

The **Next.js server** calls the HTTP API. The browser calls **your** endpoint, never the provider directly:

```
GET /api/transit/thebus?stop=983
```

The response has `mode: 'not-configured'`, `mode: 'live'`, or `mode: 'error'`, normalized `arrivals[]`, and a timestamp in live mode. `status` per arrival is `estimated` (GPS) or `scheduled` (no active estimate). Unsupported stop numbers return HTTP 400.

To enable later, add to **Vercel Environment Variables** and local `.env.local`:

```dotenv
THEBUS_API_KEY=YOUR_REGISTERED_APP_ID
NEXT_PUBLIC_TRANSIT_LIVE_ENABLED=true
```

Then redeploy. The server adapter is in `src/lib/transit/hea.ts`; it uses the documented response fields `route`, `headsign`, `direction`, `stopTime`, `date`, and `estimated`. The client polls at 60-second intervals and never sends the key to the browser. There is **no automatic fallback that impersonates real data** if the API fails.

**Before relying on Tier 2**, validate supported HEA stop IDs and incoming/outgoing direction interpretation against current agency data, verify the HEA license/attribution requirements, check provider availability (the published HEA endpoint is HTTP), and consider rate limits. Don't show arrival times as verified until the adapter is tested with a genuine AppID.

## Rainbow Shuttle live tracking

The published Student Housing/Hawaiian Studies loop provides timetable data. **No verified public real-time Rainbow Shuttle API is configured**. When one is available, implement a separate provider in `src/lib/transit/`, preserving the same `Arrival` type and explicit `status` labels. Do not represent scheduled times as live tracking.

Service is during **fall/spring semesters, weekdays, except holidays**. The calculation currently checks weekdays and the schedule times but **does not know the UH holiday calendar or school break dates**. Check the official site before riding. The published timetable and route narrative differ on the order of **Hale Wainani** and **Hale Noelani**; this implementation follows the **timetable's columns** for times and clearly marks the map schematic.

## Important data and map limitations

- **Map is schematic, not to scale**. TheBus inventory comes from the agency's published 2025 UH stop guide; stop locations and route labels may change. The app includes both on-campus and nearby stops, as requested.
- Routes drawn on the background map are illustrative corridors, **not road-by-road paths**. Official TheBus and Rainbow Shuttle maps are linked in the UI.
- TheBus demo ETA rows are **fictional** and do not reflect current service, frequency, routes at those times, or actual direction. They are for the mockup only.
- Scheduled Rainbow Shuttle departure time is computed from the university timetable in **Honolulu local time**. No vehicle-position feed is used.
- The feature is a **student project, not an official UH or OTS application**.

## Source references (verified Nov 2026)

- UH Rainbow Shuttle overview & service rules: https://manoa.hawaii.edu/commuter/rainbow-shuttle/
- Official Student Housing / Hawaiian Studies shuttle timetable: https://manoa.hawaii.edu/commuter/rainbow-shuttle/student-housing-hawaiian-studies-rainbow-shuttle-route/
- UH shuttle route image: https://manoa.hawaii.edu/commuter/wp-content/uploads/sites/6/2025/08/sh-haw-route-map.jpg
- TheBus official UH stops map and HEA stop numbers (2025): https://www.thebus.org/Updates/Manoaflyer2025RAIL.pdf
- UH TheBus commuter page: https://manoa.hawaii.edu/commuter/thebus/
- Current A/U lines and transfer stops: https://manoa.hawaii.edu/commuter/skyline/
- HEA API registration and usage: https://hea.thebus.org/api_info.asp
- HEA JSON arrivals format: https://hea.thebus.org/api/documentation/arrivalsJSON.pdf

## Project structure

```
src/app/                        App router entry and optional API route
src/components/transit/         Independent UI and scoped CSS module
src/lib/transit/data.ts         Stops, routes, and sources
src/lib/transit/schedule.ts     Honolulu schedule and demo computations
src/lib/transit/hea.ts          Optional server-only TheBus provider
src/lib/transit/types.ts        Shared data contracts
```
