# Niyyah — Product & Architecture Plan

**Status:** Phase 2 product and architecture decisions complete enough to begin routing.  
**Purpose:** Record agreed product behavior and architectural decisions separately from `README.md` and `ROADMAP.md`.

---

## 1. Product Direction

Niyyah is a **local-first desktop and mobile fasting planner and tracker**.

Personal records live locally on the user's device using SQLite.

Online content, such as du'as and hadith, is optional and must not prevent the core application from working offline.

Niyyah records the **user's selected fasting intention**, not the reason a fasting day was missed.

The application provides Gregorian and Hijri calendar context without deciding the user's religious intention for them.

---

## 2. Pages and Navigation

Niyyah has five main screens:

| Page | Purpose |
|---|---|
| Intro | Launch/loading screen shown on every app start. Runs the intro animation while essential local data initializes, then automatically routes to Home. |
| Home | Today's fasting state, timing, progress, tasbih, optional API content, statistics, and quick actions. |
| Calendar | Gregorian and Hijri dates, planned/completed/not-completed fasts, fasting occasions, and selected-day actions. |
| Create | Central page used to plan, edit, reschedule, or create fasting-related records and recurring plans. |
| Profile / Settings | Preferences, fasting statistics, local data controls, Ramadan settings, notifications, and Hijri calendar correction. |

### Intro Behavior

Intro is **not onboarding**.

It appears on every application launch.

The expected flow is:

```text
App launches
    ↓
Intro renders immediately
    ↓
Logo fade-in animation starts
    +
Application initialization starts
    ↓
Open SQLite
Load local settings
Load fasting data
Load calendar corrections/context
    ↓
Application is ready
    ↓
Wait for minimum intro animation duration if necessary
    ↓
Automatically navigate to Home
```

Both conditions must be satisfied before leaving Intro:

```text
essential initialization complete
AND
minimum intro animation duration complete
```

If initialization fails:

```text
Remain on Intro
    ↓
Show error/retry state
```

The application must not enter Home with partially initialized essential local state.

The global floating navigation is hidden on Intro.

---

## 2.1 Global Floating Navigation

The main application uses a floating circular `+` control.

When expanded, it displays:

- Home
- Calendar
- Profile / Settings
- Create

The Create action is represented by the pencil icon.

The large `+` becomes a close `×` control while the menu is expanded.

There is **no bottom navigation bar**.

The floating navigation appears across the main application pages:

```text
Home
Calendar
Create
Profile
```

It does not appear on Intro.

The floating navigation is a reusable shared UI component under:

```text
features/shared/floating-nav/
```

Its open/closed state is transient UI state.

It should close automatically when navigation occurs.

---

## 3. Fasting Concepts

Niyyah separates three concepts:

```text
Intention
Occasion
Status
```

These must not be treated as the same thing.

### 3.1 Fasting Intention

The fasting intention is chosen by the user.

Initial intentions are:

- Ramadan
- Make-up / Qada
- Voluntary

A make-up fast remains a make-up fast even if it occurs on:

- Monday
- Thursday
- a White Day
- another Sunnah fasting occasion

Niyyah does not ask why the original fasting day was missed.

For example, it does not need to know whether the cause was:

- illness
- travel
- another personal reason

The app only cares about the fasting intention and the remaining make-up balance.

---

## 3.2 Calendar Occasion

Calendar occasions are informational.

Examples include:

- Monday
- Thursday
- White Days
- other fasting-related Hijri occasions

An occasion may be displayed to the user but must **not automatically change the user's fasting intention**.

Example:

```text
Date:
Monday

Occasion:
Monday fasting day

User intention:
Make-up / Qada
```

This remains a make-up fast.

---

## 3.3 Fasting Status Lifecycle

The agreed fasting statuses are:

```text
planned
in-progress
completed
not-completed
cancelled
```

Basic lifecycle:

```text
PLANNED
    ↓
User confirms fasting
    ↓
IN PROGRESS
    ↓
COMPLETED
```

If the planned date passes and the user never confirms that they are fasting:

```text
PLANNED
    ↓
Day ends
    ↓
NOT COMPLETED
```

The user may later correct this from Calendar.

For example:

```text
NOT COMPLETED
    ↓
Mark as Fasted
    ↓
COMPLETED
```

or:

```text
NOT COMPLETED
    ↓
Edit / Reschedule
    ↓
Create opens with existing data
```

A future planned fast may also be cancelled:

```text
PLANNED
    ↓
CANCELLED
```

The internal term `not-completed` is preferred over `missed` for fasting status because Niyyah also tracks outstanding make-up days.

A voluntary fast that is not completed does **not** automatically create make-up debt.

---

## 4. Create Entry Points and Calendar Actions

Niyyah uses **one Create page**.

Route:

```text
/create
```

The same Create page is used from all entry points.

### Global Pencil

```text
Floating pencil
    ↓
/create
```

No date or intention is prefilled.

---

### Home Quick Action

```text
Home quick action
    ↓
/create
```

No date or intention is prefilled.

---

### Calendar Planning

When the user selects a date and chooses a planning action:

```text
Calendar
    ↓
Select date
    ↓
Plan Fast
    ↓
/create
```

The selected Gregorian date is prefilled.

---

### Direct Calendar Actions

The following actions do **not** need to open Create:

```text
Mark as Fasted
Mark as Not Completed
```

These are direct fasting-domain actions.

---

### Edit / Reschedule Existing Fast

Editing or rescheduling opens Create with the existing record prefilled.

Example:

```text
Existing fasting record
    ↓
Edit / Reschedule
    ↓
Create
    ↓
existing date/details prefilled
```

---

## 4.1 Shared Fasting Logic

The logic for creating, editing, completing, cancelling, or marking a fast as not completed does **not** belong to Home, Calendar, or Create.

It belongs to the shared fasting domain under:

```text
core/fasting/
```

The pages are only UI entry points.

Conceptually:

```text
Home ────────┐
Calendar ────┼──→ Fasting Domain → SQLite
Create ──────┘
```

Home, Calendar, and Create all consume the same fasting state.

There must not be separate copies of fasting records maintained by each page.

---

## 5. Make-up / Qada Balance

The outstanding make-up balance can increase in two ways.

### Ramadan Day Not Completed

If a Ramadan fasting day is marked:

```text
not-completed
```

then:

```text
make-up balance +1
```

---

### Manual Historical Adjustment

A user may already have make-up days from before installing Niyyah.

They may manually enter a number such as:

```text
6 outstanding make-up days
```

Original dates are **not required** for manually entered historical make-up days.

---

### Completing a Qada Fast

When a make-up fast is completed:

```text
make-up balance -1
```

---

### Correcting a Record

If a Ramadan day was previously marked `not-completed` and is later corrected to `completed`:

```text
make-up balance -1
```

The balance must remain synchronized with actual fasting records and manual adjustments.

A voluntary fast that is not completed does not affect the make-up balance.

---

## 6. Recurring Fasting Plans

Recurring fasting plans are stored as **schedule rules**, not as batches of future fasting records.

Example:

```text
Recurring Plan

Days:
Monday
Thursday

Start:
2026-10-01

End:
2026-12-31

Active:
true
```

Calendar derives future projected fasting dates from the recurring rule.

Individual fasting records are created only when a specific date needs:

- a real fasting status
- user confirmation
- editing
- completion
- correction

This avoids creating unnecessary future database rows.

Changing a recurring rule affects future projected dates only.

Historical fasting records must never be rewritten when a recurring rule is changed.

Example:

```text
October 5
Completed

October 12
Not Completed

November:
Recurring Monday plan disabled
```

The October history remains unchanged.

---

## 7. Hijri Calendar

Niyyah displays both:

```text
Gregorian date
Hijri date
```

The Gregorian civil date is the stable date used for storing personal fasting records.

Changing Hijri settings must never move, duplicate, or rewrite historical fasting records.

---

## 7.1 Default Hijri Calculation

Niyyah begins with a calculated Hijri calendar from an identified external/default calculation source.

The calculated date must not be presented as universally correct.

The user should be informed that their local calendar may differ.

---

## 7.2 Hijri User Correction

Profile / Settings includes a Hijri calendar correction option.

The application can ask the user whether the displayed Hijri date matches the calendar they follow.

If not, the user can adjust the relevant Hijri month.

Corrections are stored by:

```text
Hijri month
+
Hijri year
```

They are **not** stored as a permanent global:

```text
+1 day
or
-1 day
```

A correction to Ramadan does not automatically imply that Shawwal or another later month must have the same correction.

The correction flow should eventually support:

```text
Current calculated Hijri date
    ↓
User says it is incorrect
    ↓
Settings
    ↓
Adjust month boundary
    ↓
Preview correction
    ↓
Confirm
    ↓
Save locally
```

The application should also offer:

```text
Reset to calculated dates
```

---

## 8. Sunnah Fasting Occasions

Calendar fasting occasions are informational.

Examples include:

- Monday
- Thursday
- White Days

White Days correspond specifically to:

```text
13th
14th
15th
```

of the selected Hijri month.

They should not be confused with the broader practice of fasting any three days in a month.

A user may fast a make-up fast on one of these days.

Niyyah must not automatically classify that fast as voluntary.

---

## 9. Ramadan Mode

Ramadan mode is independent from Hijri calendar calculation.

The Hijri calendar determines when:

```text
Ramadan 1
```

occurs.

Ramadan mode determines how Niyyah behaves when that day arrives.

---

## 9.1 Auto Ramadan Mode

The user may enable:

```text
Automatically enable Ramadan mode
```

This can be selected months in advance.

When the user's selected/corrected Hijri calendar reaches Ramadan 1:

```text
Ramadan mode activates automatically
```

---

## 9.2 Manual Ramadan Mode

The user may prefer manual activation.

As Ramadan approaches, Niyyah can show an action such as:

```text
Fast Ramadan this year
```

If selected, Ramadan mode is scheduled.

When Ramadan 1 arrives:

```text
Ramadan mode activates
```

This is useful for users who do not want Niyyah to assume automatic participation every year.

---

## 9.3 Ramadan Daily Behavior

When Ramadan mode is active, today's Ramadan fast is assumed active by default.

The normal Home action:

```text
Start Fasting Today
```

is replaced by an action allowing the user to indicate that today's fast was not completed.

Possible wording will be finalized during UI implementation.

Examples may include:

```text
I couldn't complete today's fast
```

or:

```text
Mark today's fast as not completed
```

If the user marks a Ramadan day as `not-completed`:

```text
make-up balance +1
```

If later corrected to `completed`:

```text
make-up balance -1
```

Calendar and Home use the same Ramadan fasting state.

---

## 10. Architecture

Niyyah uses three top-level Angular application areas:

```text
src/app/

├── core/
├── features/
└── layout/
```

---

## 10.1 Core

`core/` contains application/domain logic and infrastructure shared across pages.

Current structure:

```text
core/

├── app/
├── api/
├── calendar/
├── database/
├── fasting/
├── settings/
├── utils/
└── providers.ts
```

### Fasting Domain

```text
fasting/

├── models/
├── repositories/
├── sources/
├── state/
└── use-cases/
```

The fasting domain owns:

- fasting records
- fasting status transitions
- recurring plans
- make-up balance
- Ramadan fasting state
- create/update/complete/cancel logic

### Calendar Domain

```text
calendar/

├── models/
├── services/
└── state/
```

The calendar domain owns:

- Gregorian/Hijri context
- selected calendar dates
- Hijri calculation
- Hijri corrections
- fasting occasions

### Database

```text
core/database/
```

Contains shared SQLite infrastructure.

### API

```text
core/api/
```

Contains external API infrastructure.

### Settings

```text
core/settings/
```

Contains persisted application preferences.

### Providers

```text
core/providers.ts
```

Acts as the centralized Angular dependency registration point.

Angular dependency injection is used instead of a custom service locator.

---

## 10.2 Features

`features/` contains pages and reusable UI components.

```text
features/

├── intro/
├── home/
├── calendar/
├── create/
├── profile/
└── shared/
```

Page-exclusive components remain inside their respective feature folders.

Reusable visual components belong under:

```text
features/shared/
```

The floating navigation is one shared component.

---

## 10.3 Layout

`layout/` contains only application-wide structural wrappers.

Current structure:

```text
layout/

└── app-shell/
```

The app shell is responsible for:

- hosting routed main application pages
- integrating shared structural UI
- shared scrolling behavior
- main application structure

Intro sits outside the main app shell.

Desktop and mobile do **not** use separate layout trees.

The same UI adapts responsively using Bootstrap and component styles.

Desktop development is implemented first.

Mobile-specific adjustments are added afterward.

---

## 11. State Management

Niyyah uses Angular Signals for reactive application state.

The initial store boundaries are:

### AppStore

Owns:

- initialization
- loading
- readiness
- startup errors

It determines whether Intro may transition to Home.

---

### FastingStore

Owns:

- fasting records
- fasting statuses
- today's fast
- recurring fasting plans
- make-up balance
- Ramadan fasting mode

Home, Calendar, and Create consume this shared state.

---

### CalendarStore

Owns:

- selected date
- visible calendar context
- Gregorian/Hijri conversion
- Hijri corrections
- fasting occasions

---

### SettingsStore

Owns persisted preferences such as:

- Ramadan Auto / Manual mode
- Hijri correction preferences
- notification settings
- other application preferences

---

## 11.1 State Hydration

Persistent application data is loaded from SQLite when Niyyah starts.

Startup flow:

```text
Intro
    ↓
Open SQLite
    ↓
Load settings
    ↓
Hydrate SettingsStore
    ↓
Load fasting records
    ↓
Hydrate FastingStore
    ↓
Load calendar corrections/context
    ↓
Hydrate CalendarStore
    ↓
AppStore marks application ready
    ↓
Wait for minimum Intro animation duration if needed
    ↓
Home
```

Essential local initialization failure keeps the application on Intro.

The user is given an error/retry state.

The application must not enter Home with partially loaded essential local state.

---

## 11.2 Non-Essential Online Content

Hadith and Dua API content is non-essential.

Failure to load external content must not prevent Niyyah from entering Home.

The application may later use:

```text
API
↓
optional local cache
↓
Home
```

A dedicated content store may be introduced later if shared API state becomes complex enough to require one.

---

## 12. Dependency Injection

Niyyah uses Angular's built-in dependency injection.

A custom Flutter/GetIt-style service locator is not used.

Conceptual dependency flow:

```text
UI
    ↓
Signals Store
    ↓
Use Case
    ↓
Repository
    ↓
Repository Implementation
    ↓
Local Source
    ↓
SQLite
```

Custom provider mappings are centralized through:

```text
core/providers.ts
```

This provides the centralized dependency-registration style without implementing a separate service locator.

---

## 13. Current Implementation Direction

Phase 2 architecture and product behavior required for routing are sufficiently defined.

The next implementation phase is routing.

Phase 3 will implement:

- Intro route
- automatic Intro → Home transition
- shared application shell
- Home route
- Calendar route
- Create route
- Profile / Settings route
- Calendar → Create selected-date context
- back-navigation behavior
- unknown-route handling

Detailed database schemas, migrations, API integration, and full domain implementations will be added incrementally after routing.

---

## 14. Documentation Convention

`README.md`

Explains:

- project setup
- installation
- verified architecture
- development workflow

`NIYYAH_PLAN.md`

Explains:

- product behavior
- domain rules
- agreed architecture
- design decisions

`ROADMAP.md`

Contains:

- development phases
- completed work
- pending work
- task checkboxes

The roadmap is the only document used for implementation-progress checkboxes.