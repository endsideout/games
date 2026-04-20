# EndsideOut Games

## Project Description

EndsideOut Games is an interactive educational platform featuring engaging games focused on wellbeing and personal development. The application provides a structured learning experience through the 8 dimensions of wellness, with specialized games targeting social wellbeing concepts like healthy relationships, nutrition awareness, and personal growth.

## Tech Stack

- **React 19.1.1** - UI library for building interactive components
- **TypeScript** - Type-safe development
- **React Router DOM 7.8.2** - Client-side routing and navigation
- **Tailwind CSS 4.1.12** - Utility-first styling framework
- **Vite 5.4.11** - Fast build tool and development server
- **ESLint** - Code quality and consistency

## Live Application

Access all games in production: [https://endsideoutgames.netlify.app/](https://endsideoutgames.netlify.app/)
Staging (for peer testing) should use your dedicated non-production site URL.

## How to Run Locally

### Prerequisites

- Node.js (version 20.19+ or 22.12+ recommended)
- npm or yarn

### Installation & Running

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run storybook` - Run Storybook locally on port 6006
- `npm run build-storybook` - Build Storybook static output
- `npm run test:storybook` - Run Storybook interaction tests
- `npm run test:e2e` - Run Playwright smoke tests
- `npm run seed:staging` - Seed sample `game_events` into a staging Firebase project

## Testing Strategy

We use a mixed approach:

- **Storybook** for component and page-shell states, form behavior, and interaction assertions.
- **Playwright** for browser-level smoke journeys across routing, profile gating, and key app flows.

See [`docs/testing-scope.md`](docs/testing-scope.md) for the locked Depth 1 smoke journeys and when to scale to Depth 2.
Use [`docs/testing-maintenance.md`](docs/testing-maintenance.md) for ongoing flake/CI maintenance and Depth 2 readiness checks.

### Depth Guidance

- **Depth 1 (default):** keep 5-8 stable smoke tests and stories for high-change UI.
- **Depth 2 (expand):** only after 2+ weeks of stable CI and low flake rate.

### Stability Guidelines

- Prefer semantic selectors (`getByRole`, `getByLabel`) before test IDs.
- Add lightweight `data-testid` attributes only for unstable/highly dynamic elements.
- Keep one golden path Playwright test per major course/game family before expanding breadth.

## Staging Environment Setup

Use a separate Firebase project and a separate Netlify site/branch-deploy for staging. Do not reuse production Firebase credentials.

### 1) Staging environment variables

Set these in the staging Netlify environment:

- `VITE_APP_ENV=staging`
- `VITE_STAGING_ADMIN_ALLOWLIST=admin1@example.org,admin2@example.org`
- `VITE_PRODUCTION_FIREBASE_PROJECT_ID=<prod-project-id>` (for safety block checks)
- `VITE_STAGING_BASE_URL=https://your-staging-site.netlify.app`
- `VITE_FIREBASE_*` values from the staging Firebase project

Production should keep `VITE_APP_ENV=production` and production `VITE_FIREBASE_*`.

### 2) Seed staging data

Create a local staging env file (example: `.env.staging.local`) with staging Firebase values, then run:

```bash
node --env-file=.env.staging.local scripts/seed-staging-game-events.mjs
```

or:

```bash
npm run seed:staging
```

The second command expects `VITE_FIREBASE_*` env vars to already be present in your shell.

### 3) Staging safety behavior

- When `VITE_APP_ENV=staging`, the app shows a staging banner.
- Admin sign-in is restricted to `VITE_STAGING_ADMIN_ALLOWLIST`.
- Startup is blocked when staging mode is configured with a Firebase project ID equal to `VITE_PRODUCTION_FIREBASE_PROJECT_ID`.

### 4) Verification before sharing links

- Confirm staging gameplay events appear only in staging `game_events`.
- Confirm production dashboard does not show staging events.
- Confirm public users can open game links.
- Confirm only allowlisted emails can access `/admin`.

See [`docs/staging-game-links.md`](docs/staging-game-links.md) for shareable link format.

## Project Structure

```text
src/
├── assets/
│   └── images/
│       ├── logos/                    # EndsideOut logo files
│       └── games/
│           ├── fruits/               # Fruit matching game images
│           └── vegetables/           # Vegetable matching game images
│
├── components/                       # Reusable UI components
│   ├── GameMenu.tsx                  # Generic game menu/landing page
│   ├── PairMatchingGame.tsx          # Pair matching game engine
│   ├── Logo.tsx                      # EndsideOut logo component
│   └── index.ts                      # Component barrel exports
│
├── pages/                            # Route-specific page components
│   ├── landing/
│   │   ├── Home.tsx                  # Main landing page
│   │   └── index.ts
│   │
│   ├── courses/
│   │   ├── ThreeDWellness.tsx        # 8 wellness dimensions hub
│   │   ├── index.ts
│   │   └── wellbeing/
│   │       ├── SocialWellbeing.tsx   # Social wellbeing games hub
│   │       ├── index.ts
│   │       └── social-wellbeing/
│   │           └── games/
│   │               ├── PrincipleOfRelationshipGame.tsx
│   │               ├── FruitVegetableGame.tsx
│   │               ├── Quiz.tsx
│   │               └── index.ts
│   │
│   └── index.ts                      # Page barrel exports
│
├── types/                            # TypeScript type definitions
│   └── index.ts                      # Shared interfaces and types
│
├── App.tsx                           # Router setup and main app component
├── main.tsx                          # Application entry point
├── index.css                         # Global styles and Tailwind imports
└── vite-env.d.ts                     # TypeScript declarations for imports
```
