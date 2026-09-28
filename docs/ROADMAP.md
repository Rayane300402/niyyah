# Niyyah — Development Roadmap

**Purpose:** The single checklist for implementation and verification. Keep the `README.md` focused on setup and the `NIYYAH_PLAN.md` focused on product decisions and open questions.

**Status key:** `[x]` = reported as set up or completed in the project conversation (verify in the repository where noted); `[ ]` = not implemented or not confirmed. An architectural idea discussed in the plan is **not** a completed implementation.

## Phase 1 — Foundation and developer setup

### Reported as set up

- [x] Initialize Angular 19 with TypeScript and Tauri 2.
- [x] Install Rust/Cargo and establish the Windows Tauri development environment.
- [x] Configure Tauri to start the Angular dev server on `http://localhost:4200`.
- [x] Run the desktop application and verify frontend hot reload.
- [x] Configure desktop window dimensions (default 1180 × 760; minimum 900 × 620; maximum 1320 × 860), centered, resizable, not fullscreen.
- [x] Install Bootstrap 5 and Bootstrap Icons.
- [x] Set up global SCSS, custom Bootstrap Sass theme, and palette: background `#0D1410`, primary `#1A251C`, secondary `#303C2F`, tertiary `#556B50`, primary text `#E8EBE9`, secondary text `#798263`.
- [x] Configure Outfit as primary font; defer typography sizing until UI development.
- [x] Install the Tauri SQL plugin and configure its SQLite driver.
- [x] Organize the PNG logo and SVG illustrations in app assets.

### Verify or finish before relying on it

- [ ] Verify SQLite plugin permissions and a successful local open/query on desktop; installing the driver alone is not database initialization.
- [ ] Verify the final native icon was generated successfully from a square source and is configured in Tauri.
- [ ] Confirm Angular's build includes `src/assets/` and test image/SVG paths in the packaged app.
- [ ] Test a Windows production build/installer.
- [ ] Confirm Outfit is bundled locally so the offline-first app does not depend on Google Fonts at runtime.
- [ ] Confirm actual `tauri.conf.json` sizing matches the documented target values.

## Phase 2 — Product and architecture decisions (discussion first)

- [x] Identify the five screens: Intro, Home, Calendar, Create, Profile/Settings.
- [x] Establish that Home, Calendar, and Create operate on the same fasting records.
- [x] Distinguish user-selected fasting intention from calendar occasion (including Monday/Thursday and White Days).
- [x] Agree to record make-up intention without asking why a day was missed.
- [x] Agree on calculated Hijri dates with a user correction control in Profile/Settings as the design direction.
- [x] Identify the global floating `+` menu and pencil Create action; no bottom navigation bar.
- [ ] Finalize the responsibilities and exact contents of `core/`, `features/`, and `layout/` (the architecture is **not** finalized).
- [ ] Decide where fasting/calendar domain logic, repository interfaces, API clients, and state belong.
- [ ] Finalize Intro initialization and Start App routing; decide whether the floating menu is hidden on Intro.
- [ ] Finalize Create entry-point behavior: global pencil, calendar selected date, Home quick action, and prefilled intention/date.
- [ ] Decide which calendar actions save immediately vs open Create for confirmation.
- [ ] Define the fasting status lifecycle (planned, in progress, completed, missed/not completed, cancelled).
- [ ] Define missed-day balance accounting, adjustments, and whether original missed dates are needed.
- [ ] Define recurring-plan semantics vs individual planned/completed fasting records.
- [ ] Decide when Ramadan mode appears, whether activation needs confirmation, and how Ramadan records are handled.
- [ ] Agree on the calculated Hijri method, month-specific correction UI, and month-boundary rules.
- [ ] Finalize Signals store boundaries and application hydration/error-handling strategy.

## Phase 3 — Folder structure and routing

- [ ] Create the **agreed** folder structure only after Phase 2 discussion.
- [ ] Keep reusable visual components shared and page-exclusive widgets with their respective pages.
- [ ] Build the Intro → Start App → Home navigation flow, gated by essential local-data readiness.
- [ ] Configure routes for Home, Calendar, Create, and Profile/Settings.
- [ ] Define optional Create navigation context and date/intention prefill, including direct navigation and back behavior.
- [ ] Handle unknown routes and navigation errors.

## Phase 4 — State, SQLite, and core domain behavior

- [ ] Create SQLite initialization and versioned migrations.
- [ ] Define fasting records, intentions, statuses, and date/timestamp representation.
- [ ] Define the make-up-day ledger/balance and rules for decrementing it after completed make-up fasts.
- [ ] Define recurring plans separately from actual fast records.
- [ ] Define calendar-method preferences and per-Hijri-month corrections without shifting stored Gregorian fasting dates.
- [ ] Implement repository/data-source boundaries and Angular DI bindings as agreed.
- [ ] Implement shared reactive fasting state so Home and Calendar update when Create saves.
- [ ] Implement state initialization/hydration from SQLite and recovery from load/save failures.
- [ ] Keep modal, menu, form, and animation state temporary rather than persisting it indiscriminately.
- [ ] Verify state and records survive app restart and do not duplicate on navigation.
- [ ] Decide and implement local data clearing/export/backup behavior, with confirmation for destructive actions.

## Phase 5 — Shared shell and UI foundations

- [ ] Implement responsive desktop/mobile app shell and vertical scrolling for content taller than the viewport.
- [ ] Build the global floating `+` menu with Home, Calendar, pencil/Create, Profile, and close actions.
- [ ] Keep menu position independent of page scroll; close on navigation; check touch and keyboard accessibility.
- [ ] Build shared buttons, navigation controls, and cards from the Niyyah theme.
- [ ] Implement the intro animation and Start App button, keeping animation brief and optional to skip.
- [ ] Establish consistent page loading, empty, and error states.
- [ ] Finish typography sizing progressively as UI screens are implemented.

## Phase 6 — Screens and fasting workflows

- [ ] Home: today's fasting status, user-confirmed Start/Finish flow, countdown, progress, and quick actions.
- [ ] Home: Tasbih card and optional Hadith/Dua content with offline fallback.
- [ ] Calendar: Gregorian/Hijri date display, fasting markers/legend, date selection, and selected-day actions.
- [ ] Create: single-date fast, prefilled date from Calendar, explicit intention selection, and save/edit feedback.
- [ ] Create: missed-day balance entry and make-up fast tracking.
- [ ] Create: recurring fasting schedule controls with distinction between suggestions and confirmed plans.
- [ ] Profile/Settings: statistics, preferences, Hijri correction, and data-management controls.
- [ ] Verify a fast created or changed from **any** entry point appears correctly on Home and Calendar.
- [ ] Ensure passing dates/occasions never silently assigns a voluntary or make-up intention.

## Phase 7 — Hijri calendar, occasions, and Ramadan

- [ ] Choose and document a calculation method and clearly label calculated/unconfirmed month boundaries.
- [ ] Implement Gregorian ↔ Hijri display while anchoring personal records to Gregorian civil dates.
- [ ] Build month-specific Hijri correction, preview, local save, reset, and adjacent-month validity checks.
- [ ] Ensure date corrections update occasion labels without moving or duplicating fasting history.
- [ ] Identify Monday/Thursday, White Days (13th–15th Hijri), and other explicitly defined fasting occasions as informational context.
- [ ] Keep generic three-days-per-month fasting distinct from the specific White Days.
- [ ] Implement agreed Ramadan approach, including local start-date correction and user-confirmed records.
- [ ] Validate date boundaries, time zones, month transitions, and offline behavior.

## Phase 8 — Optional online content, notification decisions, and polish

- [ ] Choose Dua/Hadith data sources and document their content, licensing, attribution, and availability constraints.
- [ ] Implement optional API clients and locally cached/offline content fallback.
- [ ] Confirm whether prayer/fasting-time calculation or notifications are in scope; do not assume an API is required for core offline use.
- [ ] If agreed, implement notifications/preferences and test platform permissions.
- [ ] Add restrained GSAP intro/scroll animations **after** the core UI; prefer CSS for simple transitions.
- [ ] Respect reduced-motion preferences and test keyboard/touch/screen-reader interaction.
- [ ] Review Arabic/English typography, directionality, contrast, and small-device layouts.

## Phase 9 — Mobile, testing, and release

- [ ] Set up Android SDK/NDK and test the Android Tauri build on a device/emulator.
- [ ] Plan and test the iOS build on macOS/Xcode when that environment is available.
- [ ] Verify native SQL access, stored-data locations, and upgrade/migration behavior on each target platform.
- [ ] Test fasting records, balance calculations, recurrence, Hijri corrections, and Ramadan boundary cases.
- [ ] Test app start, long-scroll screens, navigation menu, form prefill, and persistence after restart.
- [ ] Test offline launch and unavailable external APIs.
- [ ] Generate native assets, package desktop/mobile builds, and review release metadata.
- [ ] Update README to describe only verified setup, supported platforms, and build commands.

---

**Planning reference:** See [`NIYYAH_PLAN.md`](NIYYAH_PLAN.md). Do not mark a roadmap item complete merely because its behavior was agreed in discussion.
