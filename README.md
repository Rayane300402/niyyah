# Niyyah 🌙

Niyyah is a local-first desktop and mobile application built with Angular, Tauri, Bootstrap, and SQLite.

The application is designed to work primarily offline, with user data stored locally using SQLite.

Internet access may be used for selected external content, such as Duas and Hadith APIs.

---

## 1. Tech Stack

| Technology | Purpose |
|---|---|
| Angular 19 | Frontend framework |
| TypeScript | Application logic |
| Tauri 2 | Desktop and mobile application |
| Rust | Native application backend |
| Bootstrap 5 | UI components and responsive design |
| Bootstrap Icons | Icon library |
| SCSS | Global styling and theme customization |
| SQLite | Local database |
| Angular Signals | State management (planned) |
| GSAP | Selected animations (planned) |

---

## 2. Prerequisites

### Node.js

The project was initialized using Node.js 22.18.0.

Check your version:

```bash
node -v
npm -v
```

### Angular CLI

Install Angular CLI 19:

```bash
npm install -g @angular/cli@19
```

Verify:

```bash
ng version
```

### Rust

Tauri requires Rust and Cargo.

On Windows, install Rust using:

```bash
winget install --id Rustlang.Rustup --source winget
```

Restart your terminal after installation.

Configure the MSVC toolchain:

```bash
rustup default stable-msvc
```

Verify:

```bash
rustc --version
cargo --version
```

### Windows Build Tools

Windows development requires Microsoft C++ build tools.

Install Visual Studio Build Tools with the following workload:

- Desktop development with C++
- MSVC toolchain
- Windows SDK

Tauri also requires Microsoft Edge WebView2, which is already installed on most modern Windows systems.

For Android development, additional Android SDK and NDK setup will be required.

Building the iOS version requires macOS and Xcode.

---

## 3. Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project:

```bash
cd niyyah
```

Install dependencies:

```bash
npm install
```

Ensure Rust and the Windows build tools are installed before running the native application.

---

## 4. Development

Start the desktop application:

```bash
npx tauri dev
```

Tauri automatically starts the Angular development server using:

```bash
npm run start
```

The Angular development server runs at:

http://localhost:4200

The application opens in a native Tauri window.

### Hot Reload

Angular frontend changes update automatically while the application is running.

This includes changes to:

- HTML templates
- CSS and SCSS
- TypeScript components
- Angular services
- Global styles

There is no need to manually restart Tauri after every frontend change.

Changes to Rust code or native Tauri configuration may trigger a native rebuild or restart.

---

## 5. Production Build

Build the desktop application using:

```bash
npx tauri build
```

Tauri runs the Angular production build automatically.

The configured frontend distribution directory is:

```text
dist/niyyah/browser
```

The native application build is generated under:

```text
src-tauri/target/release/
```

Platform-specific installers are generated inside the corresponding bundle directory.

---

## 6. Project Architecture

Niyyah currently follows a three-part application structure:

```text
src/app/

├── core/
├── features/
└── layout/
```

This structure is **provisionally approved** and will be refined as routing, state management, and application data flow are finalized.

The goal is to keep the architecture clean, understandable, and scalable without introducing unnecessary abstraction.

### Core

`core/` contains application-wide infrastructure and logic that is not tied to a single page.

Current structure:

```text
core/
├── api/
├── database/
├── models/
├── services/
├── state/
└── utils/
```

Current responsibilities include:

- API communication
- SQLite database access
- Application-wide services
- Shared application state
- Common models
- Utility functions

The internal organization of `models`, `services`, and `state` is still under review.

Some of these folders may later be organized by domain, for example:

```text
state/
├── fasting/
├── calendar/
├── settings/
└── app/
```

or simplified depending on the final state-management approach.

Angular's built-in dependency injection will be used instead of a separate service locator.

### Features

`features/` contains the application's main pages and their page-specific UI components.

Current structure:

```text
features/
├── intro/
├── home/
├── calendar/
├── create/
├── profile/
└── shared/
```

Each page owns its own exclusive components.

Example:

```text
home/
├── home.page.ts
├── home.page.html
├── home.page.scss
└── components/
```

Components used only by Home remain inside:

```text
features/home/components/
```

The same rule applies to Calendar, Create, Profile, and Intro.

Reusable UI components shared across multiple pages belong in:

```text
features/shared/
```

Examples include:

- Shared buttons
- Navigation controls
- Reusable cards
- Form controls
- Common indicators
- Reusable visual elements

This keeps page-specific components close to the page that owns them while avoiding duplication for shared UI.

### Layout

`layout/` contains global application structure and navigation behavior.

Current structure:

```text
layout/
├── app-shell/
├── desktop/
└── mobile/
```

The layout layer is expected to manage:

- The global application shell
- The expandable floating navigation control
- Responsive desktop and mobile behavior
- Global scrolling behavior
- Shared structural elements that belong to the application itself rather than a specific page

The floating navigation control is available across the main application and provides navigation to:

- Home
- Calendar
- Create
- Profile

The Intro page remains separate from the main application shell and does not use the global floating navigation.

The exact `desktop/` and `mobile/` separation is still under review.

It may remain as separate layout helpers, or the application may use a single responsive shell if that proves cleaner during implementation.

### Page Structure

The main application pages are:

```text
Intro
Home
Calendar
Create
Profile
```

Their responsibilities are currently understood as:

#### Intro

The application entry point.

Responsibilities include:

- Displaying the logo and introductory animation
- Initializing essential application data
- Preparing local state
- Loading settings and fasting data
- Starting the main application when the user presses the Start App button

#### Home

The main dashboard.

It may display:

- Today's fasting status
- Current or planned fast
- Fasting progress
- Missed fasts remaining
- Voluntary fasting statistics
- Hadith or Dua content
- Tasbih
- Quick actions

Home depends on shared fasting and calendar state rather than owning separate fasting data.

#### Calendar

Displays fasting-related calendar information.

It may include:

- Gregorian dates
- Hijri dates
- Planned fasts
- Completed fasts
- Missed days
- Sunnah fasting occasions
- Ramadan-related information
- Date-specific actions

Calendar and Home use the same shared fasting data.

#### Create

Provides a central way to create or plan fasting-related actions.

Create can be opened:

- From the global floating navigation
- From Calendar after selecting a date
- From Home through relevant actions

The page may receive context such as:

- A preselected date
- A predefined action
- A suggested fasting intention

The final routing and data-passing strategy for Create is still under discussion.

#### Profile

Contains user settings and local application preferences.

Potential responsibilities include:

- Notification settings
- Hijri calendar settings
- Manual Hijri calendar correction
- Fasting statistics
- Missed-day balance
- Local data management
- Application information

### Shared Domain Behavior

Some application behavior is shared across multiple pages.

For example:

```text
Create Fast
    ↓
Shared Fasting State
    ↓
SQLite
    ↓
Home + Calendar
```

A fast created from Calendar or Create should automatically be reflected in Home and Calendar without those pages maintaining separate copies of the same data.

The same principle applies to:

- Fasting records
- Fasting intentions
- Missed-day balance
- Calendar dates
- Hijri calendar settings
- User settings

The final state-management implementation for this shared behavior has not yet been finalized.

### Architecture Principles

The current architecture follows these principles:

- Page-specific UI stays close to its page
- Reusable UI is shared rather than duplicated
- Application-wide infrastructure stays outside page folders
- UI should not directly manage database persistence
- Shared state should have a single source of truth
- Persistent data should be stored in SQLite
- Temporary UI state should remain in memory
- Angular dependency injection should be preferred over a custom service locator
- The architecture should remain understandable and avoid unnecessary abstraction

### Architecture Status

Current approval status:

- Top-level `core / features / layout` structure: **Provisionally approved**
- Main feature folders: **Approved**
- Page-specific component ownership: **Approved**
- Shared UI location: **Approved**
- Core infrastructure concept: **Provisionally approved**
- `core/models` organization: **Pending review**
- `core/services` organization: **Pending review**
- `core/state` organization: **Pending state-management decision**
- Layout strategy: **Provisionally approved**
- Desktop/mobile layout split: **Pending review**
- Routing architecture: **Pending final decision**
- State-management architecture: **Pending final decision**
- Final folder structure approval: **Pending**

The architecture will be considered finalized only after routing and state management have been agreed and the resulting data flow has been reviewed.

---

## 7. State Management

The application's state-management architecture is currently being finalized.

Angular Signals are being considered as the primary reactive state mechanism, particularly for shared application state such as fasting records, calendar state, settings, and application initialization.

Persistent application data will be stored locally in SQLite.

Temporary UI state will remain in memory.

The final state-management approach will be documented after the architecture decision is complete.

---

## 8. Local Database

Niyyah uses SQLite as its local database.

The Tauri SQL plugin has been installed with SQLite support.

The application follows a local-first approach:

- User data is stored locally.
- Core functionality should work offline.
- External APIs are used only when needed.
- Selected external content may be cached locally.

Database initialization, repositories, and migrations will be implemented as the application features are developed.

---

## 9. Styling and Design System

The application uses Bootstrap 5 with a custom SCSS theme.

Global styles are organized as follows:

```text
src/
├── styles.scss
└── styles/
    ├── _variables.scss
    ├── _typography.scss
    ├── _bootstrap-overrides.scss
    └── styles.scss
```

Bootstrap is compiled using Niyyah's custom theme variables.

This allows Bootstrap utilities and components to use the application's colors without manually overriding every component.

### Color Palette

| Token | Hex |
|---|---|
| Background | `#0D1410` |
| Primary | `#1A251C` |
| Secondary | `#303C2F` |
| Tertiary | `#556B50` |
| Primary Text | `#E8EBE9` |
| Secondary Text | `#798263` |

### Typography

Primary font: **Outfit**

Available font weights:

- 300 — Light
- 400 — Regular
- 500 — Medium
- 600 — SemiBold
- 700 — Bold

Typography sizes will be defined progressively during UI development.

---

## 10. Desktop and Mobile Layout

The desktop application uses a constrained Tauri window.

### Desktop Window

| Property | Value |
|---|---|
| Default width | 1180 |
| Default height | 760 |
| Minimum width | 900 |
| Minimum height | 620 |
| Maximum width | 1320 |
| Maximum height | 860 |

The window is centered, resizable, and does not open in fullscreen mode.

These dimensions are configured in:

```text
src-tauri/tauri.conf.json
```

Content that exceeds the window height will scroll vertically.

The desktop window dimensions do not restrict the height of individual pages.

### Mobile

The mobile application will adapt to the device viewport.

Responsive layouts will be implemented using Bootstrap and custom CSS.

There is no fixed bottom navigation bar.

The application will use a floating side action button where required by the design.

---

## 11. Assets

Application assets are organized under:

```text
src/assets/
├── images/
├── illustrations/
└── fonts/
```

The logo is stored as a PNG.

Illustrations are stored as SVG files to preserve quality across different screen sizes.

Assets are referenced in Angular using their public paths.

The Angular asset configuration must include `src/assets/` for these files to be copied into the production build.

### Native Application Icon

Native app icons are stored in:

```text
src-tauri/icons/
```

Tauri requires a square source image for icon generation.

Recommended source image:

```text
1024 × 1024 PNG
```

Generate native icons using:

```bash
npx tauri icon path/to/icon.png
```

Tauri generates the required platform-specific icon files.

---

## 12. Animation

Animation will be introduced after the main UI and application functionality are stable.

GSAP is the planned animation library.

Potential uses include:

- Intro animation
- Subtle page entrance transitions
- Selected scrolling effects
- Coordinated UI transitions

Simple interactions will use CSS transitions where possible.

Animation should remain subtle and should not interfere with application usability.

---

## 13. Development Principles

Niyyah follows these principles:

**Local-first:** User data remains on the device, with external APIs used only for selected content.

**Clean architecture:** UI, state management, and data access remain separated.

**Reusable components:** Shared UI components are developed once and reused across pages.

**Responsive design:** Desktop and mobile layouts adapt to their respective screen sizes.

**Minimal animation:** Animations enhance the experience without distracting from the application's purpose.

**Maintainability:** The architecture should remain understandable and avoid unnecessary abstractions.

---

## 14. Project Documentation

- [Niyyah Plan](docs/NIYYAH_PLAN.md) — Product behavior, domain rules, and architectural decisions.
- [Development Roadmap](docs/ROADMAP.md) — Development phases, completed work, and upcoming tasks.