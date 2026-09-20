# Manage My Shifts

A client-side web app for tracking work shifts across multiple jobs and calculating monthly earnings. Built as a course project — no backend, no database server: everything runs in the browser and persists to `localStorage`.

## The problem it solves

An hourly employee working at more than one workplace needs a simple way to log shifts, see what they've earned, and identify their best-earning month — without a spreadsheet.

## Features

- **Account system**: registration and login with per-field validation (email format, username complexity, password length, name and age rules), running entirely client-side.
- **Session management**: a login session lasts 60 minutes; protected pages redirect to login automatically when the session is missing or has expired, including when a page is restored from the browser's back/forward cache.
- **Shift tracking**: add, edit shifts with date, start/end time, hourly wage, workplace, a per-user-unique shift name, and optional comments. Future-dated shifts are rejected.
- **My Shifts table**: lists all shifts with computed profit per shift, sorted by date, with a summary of the best-earning month so far.
- **Filters**: narrow the shift list by workplace and/or an inclusive date range, applied together as AND.
- **Profile editing**: update account details; password is optional on this form (leave blank to keep the current one).
- **Password reset**: per the assignment spec, resetting a password is destructive — it permanently deletes the account and every shift belonging to it, requiring the user to register again. The form requires typing a confirmation phrase before proceeding.
- **Responsive layout**: usable from small phone screens up through desktop, with a hamburger menu replacing the inline navigation below 600px.

## Technologies used

- HTML5
- CSS3 (custom properties for theming, Flexbox layout, a single mobile breakpoint)
- Vanilla JavaScript (no frameworks, no build step)
- Browser `localStorage` for all persistence
- [Inter](https://fonts.google.com/specimen/Inter) typeface via Google Fonts

## Running it locally

This project has no build step and no server-side code, but it should be served over HTTP rather than opened directly as a `file://` path — some browser behavior (and `localStorage` isolation) is more predictable that way, and it avoids confusion if you ever add features that expect a server context.

**Recommended: a local static server**, such as the VS Code "Live Server" extension:
1. Open the project folder in VS Code.
2. Right-click `index.html` → "Open with Live Server".
3. The app opens at an address like `http://127.0.0.1:5500/index.html`.

**Alternative:** open `index.html` directly by double-clicking it (`file:///...` in the address bar). This works for basic use, but keep in mind `localStorage` is isolated per exact origin — if you sometimes open the project via `file://` and sometimes via `http://localhost`, the app will behave as if it has two completely separate sets of accounts and shifts, since the browser treats them as different sites.

## How data is stored

All data — accounts and shifts — lives in the browser's `localStorage`, scoped to the origin you loaded the app from. This means:

- **Nothing is shared between devices or browsers.** An account created in Chrome won't be visible in Firefox, or on a different computer.
- **Clearing browser data deletes everything.** There is no server-side backup.
- **Passwords are stored in plain text.** This is a deliberate trade-off of the assignment's client-only architecture (no backend to hash passwords against) — not a production-appropriate practice. A real deployment would hash credentials server-side.
- Each user has a stable, randomly generated `id` created at registration, which is what shifts and sessions are actually keyed to internally — not the username, which the user can change later without losing their data.

## Screens

| Page | Purpose |
|---|---|
| `index.html` | Login. Also the app's entry point. |
| `register.html` | Account creation. |
| `reset-password.html` | Password reset — deletes the account and all its shifts after confirmation. |
| `home.html` | My Shifts — the shift table, filters, and best-month summary. |
| `add-shift.html` | Add a new shift, or edit an existing one (the same form handles both, based on a URL parameter). |
| `profile.html` | Edit account details. |

## Known limitations

- **Session expiry is checked on page load and navigation, not in real time.** A user idle on a page past the 60-minute mark won't be redirected until their next interaction or reload.
- **Passwords are stored in plain text** (see "How data is stored" above) — acceptable only because the assignment specifies a client-only architecture with no backend.
- **No password recovery in the usual sense.** "Resetting" a password is destructive by design, per the assignment specification — it does not offer a way to regain access to an account's existing data.
- **Workplace suggestions are derived from past shifts**, not a separately managed list — a user's first shift at a new place requires typing the name once.

## Author

Luiz Gustavo Guimaraes — built as a course project for wawiwa Tech Training's full-stack sequence.
