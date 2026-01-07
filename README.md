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

## Project Structure

```
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
