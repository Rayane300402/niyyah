# Niyyah — Product & Architecture Plan

**Status:** Planning document; no implementation implied.  
**Purpose:** Record agreed behavior, proposed architecture, and open decisions separately from `README.md` (installation and developer setup).

## 1. Product direction

Niyyah is a **local-first desktop and mobile fasting planner and tracker**. Personal records live on the user's device in SQLite. Online content, such as du'as and hadith, is optional and should not prevent core offline use.

The app records the **user's selected fasting intention**, not the reason a day was missed. Its Gregorian/Hijri calendar provides context without deciding the user's intention for them.

## 2. Pages and navigation

| Page | Purpose |
| --- | --- |
| Intro | Brief opening animation and **Start App** button. Prepare essential local data; proceed to Home when ready. |
| Home | Today's fasting state and timing, progress, tasbih, content from optional APIs, and quick actions. |
| Calendar | Gregorian and Hijri dates; planned, ongoing, and recorded fasts; fasting occasions and selected-day actions. |
| Create | One entry point for planning/recording a fast, logging make-up days, and setting recurring plans. |
| Profile / Settings | Preferences, summary statistics, data controls, and **Hijri calendar correction**. |

**Agreed:** Intro is the visual entry point; essential app data loads before entering Home. Calendar, Home, and Create use the same underlying fasting records. Long page content scrolls inside the available window. The floating `+` expands into a compact **global navigation/action menu** (not a bottom navigation bar); see section 2.1.

**Routing intent (to finalize):** The Create page accepts optional context (such as a preselected Gregorian date and requested action) from any entry point. Opening Create via the global pencil action without context starts with no imposed date or intention. Saving a change should be reflected in both Calendar and Home, including after navigation or app restart.

### 2.1 Global floating navigation / action menu — confirmed design direction

- A floating circular **`+`** control appears across the application pages. Tapping/clicking it expands a small cluster of circular actions, matching the supplied Figma design.
- Expanded actions: **Home** (house), **Calendar** (calendar), **Profile / Settings** (person), and **Create** (pencil). The large `+` becomes a **close `×`** control while the menu is open.
- **The pencil icon always opens the same Create page**, whether the user is on Home, Calendar, Profile, or Create. Creation is **not confined to Calendar** or to the Home quick actions. Page-specific entry points may additionally pass a selected date or other creation context.
- The floating menu belongs to the **shared app layout/shell**, not to one page component. Its open/closed state is transient UI state; it should remain usable as page content scrolls and should close when navigating.
- No bottom navigation bar is planned. Exact placement and responsive sizing can be finalized during UI implementation.
- **Intro exception to clarify:** Intro is the launch/initialization gate with its own Start App button. Confirm whether the floating menu is hidden there; “across every page” is currently interpreted as the main application pages unless otherwise specified.

## 3. Fasting records: intention, occasion, status

Treat these as **distinct concepts**:

- **Intention — chosen by the user:** Ramadan, make-up (*qada*), or voluntary. A make-up fast remains a make-up fast even on a Monday, Thursday, or White Day.
- **Occasion — derived from calendar context:** e.g., Monday/Thursday, White Days (13th–15th of a Hijri month), or another relevant date. An occasion may be displayed but must **not** automatically set the user's intention.
- **Status — what happened:** proposed statuses are planned, in progress, completed, cancelled, and missed/not completed. Exact transitions still need agreement.

Niyyah does **not** ask why someone missed a fast (illness, travel, etc.). A completed make-up fast should affect the outstanding make-up-day balance; a completed voluntary fast should not. Do not count a planned fast as completed just because its date passed. Do not automatically assign the religious meaning of two intentions to one record.

**Proposed data concepts (not yet a database schema):** fasting record (civil date, intention, status), outstanding make-up-day ledger/balance, recurring-plan rule, Hijri calendar settings, and user preferences.

## 4. Create and calendar interaction

- Selecting a date in Calendar can open date-specific actions. Planning a fast opens Create with that **Gregorian date** prefilled.
- The Home quick action can open Create with a voluntary-fast context; the user must still be able to select or change their intention.
- The global floating **pencil** action opens Create from any main app page, with no mandatory prefilled date or intention. The `+` expands navigation and is **not itself** the Create action.
- Creating or updating a record refreshes both Home and Calendar through a shared fasting state rather than page-to-page events.
- A recurring schedule and an individually confirmed fast are separate concepts: a calendar suggestion must not silently become a completed personal fast.

**To decide:** Which actions save immediately versus open Create for intention/status confirmation; how missed-day totals are entered and adjusted; how recurring rules become individual planned records; how the Home “Start Fasting Today” action treats an existing plan.

## 5. Hijri calendar: calculated by default, correctable by the user

**Agreed direction:** Display **both Gregorian and Hijri dates**. Start with a clearly identified **calculated Hijri calendar**; do not present its month boundaries as universally confirmed. In **Profile / Settings**, provide a control for users to correct the Hijri calendar to match the dates followed by their community.

### Proposed correction experience

1. Show the current calculated Hijri date and the named calculation method/source.
2. Offer **Adjust Hijri date** from Settings. The user can specify the locally followed start date for a particular Hijri month (or choose the correct Hijri date and let the app derive the affected month boundary).
3. Show a preview of the resulting date mapping and affected occasions, then ask for confirmation.
4. Save the correction **locally** and offer **Reset to calculated dates** for that month.
5. Recalculate future calendar labels and occasion indicators as appropriate, without rewriting saved fasting records.

**Important design rule:** Store corrections by **Hijri month and year**, not as a permanent global “+1 / −1 day” shift. A correction to Ramadan may not apply to Shawwal or any subsequent month. Consider month-length validity, adjacent month boundaries, and how future unconfirmed months are displayed before implementation.

**Stable storage rule:** Anchor every personal fast to its **Gregorian civil date** (and separately store relevant timestamps where needed). Changing the user's Hijri calendar preference or month correction must **not move or duplicate historical fasting records**.

**Still to decide:** Which calculation method is the default; whether the user can select among methods; exact correction UI; whether month starts can be marked provisional/confirmed; how to handle time zone, local sunset date boundaries, and locally announced Ramadan/Eid dates. Do not infer a user's calendar method solely from country.

## 6. Sunnah occasions and Ramadan

Calendar occasions are **informational**, not instructions or automatic intention selection. White Days correspond to the 13th–15th of the selected Hijri month; a more general three-days-per-month practice should not be mislabeled as those specific dates. Monday/Thursday is a weekday-based occasion. Other occasions may be added with clearly documented date rules.

**Ramadan (planned):** A special context or presentation can appear as Ramadan approaches and during Ramadan according to the **user's selected/corrected Hijri calendar**. Ramadan records are still confirmed by the user; the app must not mark all days completed automatically. Actual activation behavior and the user's ability to confirm/correct Ramadan's start remain open decisions.

## 7. State, persistence, and architecture — proposed, not finalized

Keep the three agreed top-level application areas:

```text
src/app/
├── core/       # shared infrastructure and cross-page domain logic
├── features/   # intro, home, calendar, create, profile, shared UI
└── layout/     # app shell, scrolling, responsive layout, global floating menu
```

One architectural option under discussion: put the shared **fasting** and **calendar** domain logic in grouped areas under `core/`, while keeping page-specific components in their respective `features/` directories. Avoid separate, conflicting Home/Calendar/Create copies of fasting data.

**Proposed data flow:** `Page → Angular Signals store → repository / domain operation → SQLite`; calendar calculation is a separate dependency supplying occasion/date context. Only durable records/preferences are persisted. Transient form, dialog, and animation state stays in memory. Angular's dependency injection replaces a manual service locator.

**Not yet agreed:** Exact folders below the three top-level areas, repository/use-case granularity, state store boundaries, routing definitions, initialization strategy, database tables/migrations, and notification behavior. No code should be generated from these proposals before discussion.

## 8. Next architecture discussion (not a task checklist)

Our next conversation will resolve the responsibilities and boundaries of `core/`, `features/`, and `layout/` before creating the final folders. We will then agree on Create route context and prefilled dates, whether the floating menu is visible on Intro, fasting status transitions, missed-day accounting, recurring rules, the Hijri calculation method and correction behavior, Ramadan mode, and the Signals state/hydration design. Only after those decisions should we implement routes, stores, or database migrations.

**Documentation convention:** `README.md` explains how to run the project and describes verified implementation; `NIYYAH_PLAN.md` records product behavior, agreed decisions, proposals, and open questions; `ROADMAP.md` is the only place for task checkboxes. A proposed design is not a completed implementation.
