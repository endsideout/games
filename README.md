# Social Wellbeing Games

A collection of educational games built with React, TypeScript, and Tailwind CSS. This project provides a flexible, modular architecture for creating and managing multiple educational games through a routing-based system.

## 🎯 Project Overview

This application serves as a platform for educational games focused on social wellbeing concepts. Each game is implemented as a separate component with its own endpoint, making it easy to add, modify, and maintain individual games.

### Current Games

- **Principle of Relationship Game** (`/principle-of-relationship-pair-matching-game`)
  - A pair-matching memory game focusing on healthy relationship principles
  - Features: Timer, move counter, animated cards, completion celebration

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── GameMenu.tsx     # Generic game menu/landing page
│   ├── PairMatchingGame.tsx # Generic pair matching game engine
│   └── index.ts         # Component barrel exports
├── pages/               # Route-specific page components
│   ├── Home.tsx         # Main landing page with game selection
│   ├── PrincipleOfRelationshipGame.tsx # Relationship game implementation
│   └── index.ts         # Page barrel exports
├── types/               # TypeScript type definitions
│   └── index.ts         # Shared interfaces and types
├── App.tsx              # Router setup and main app component
├── main.tsx             # Application entry point
└── index.css            # Global styles and Tailwind imports
```

## 🧩 Component Architecture

### Core Components

#### `GameMenu` Component
A reusable menu component that displays game information and provides a start button.

**Props:**
- `onStartGame: () => void` - Callback when start button is clicked
- `title: string` - Game title to display
- `description: string` - Game description text

**Features:**
- Gradient background with animated patterns
- Responsive design
- Logo integration
- Consistent styling across all games

#### `PairMatchingGame` Component
A generic pair-matching game engine that can be configured for different word sets and game rules.

**Props:**
- `onBackToMenu: () => void` - Callback to return to menu
- `words: string[]` - Array of words to use for matching pairs
- `gameConfig: GameConfig` - Game configuration object
- `title: string` - Game title for header display

**Features:**
- Configurable timer
- Move counter
- Card flip animations
- Match detection
- Win/lose states
- Responsive grid layout

#### `Home` Component
The main landing page that displays available games and routes to specific game endpoints.

**Features:**
- Game preview cards
- Navigation to individual games
- Future game placeholders
- Responsive grid layout

### Type Definitions

#### `Card` Interface
```typescript
interface Card {
  id: number;          // Unique identifier
  word: string;        // Text content
  flipped: boolean;    // Current flip state
  matched: boolean;    // Whether card is matched
}
```

#### `GameConfig` Interface
```typescript
interface GameConfig {
  pairs: number;       // Number of word pairs
  gridCols: number;    // Grid column count (for layout)
  time: number;        // Game time limit in seconds
}
```

#### `GameMenuProps` Interface
```typescript
interface GameMenuProps {
  onStartGame: () => void;
  title: string;
  description: string;
}
```

#### `PairMatchingGameProps` Interface
```typescript
interface PairMatchingGameProps {
  onBackToMenu: () => void;
  words: string[];
  gameConfig: GameConfig;
  title: string;
}
```

## 🎮 How to Add a New Game

### Step 1: Define Your Game Data

Create your game's word list and configuration:

```typescript
// Example: Math concepts game
const mathWords = [
  "Addition",
  "Subtraction",
  "Multiplication",
  "Division",
  "Fraction",
  "Decimal"
];

const mathGameConfig: GameConfig = {
  pairs: 6,
  gridCols: 3,
  time: 120
};
```

### Step 2: Create a Game Page Component

Create a new file in `src/pages/` (e.g., `MathConceptsGame.tsx`):

```typescript
import React, { useState } from "react";
import { GameMenu, PairMatchingGame } from "../components";
import { GameConfig } from "../types";

// Your game data (as defined in Step 1)
const mathWords = [/* ... */];
const mathGameConfig: GameConfig = {/* ... */};

const gameTitle = "Math Concepts Game";
const gameDescription = "Match mathematical concepts and improve your math skills!";

export function MathConceptsGame(): React.JSX.Element {
  const [currentView, setCurrentView] = useState<"menu" | "game">("menu");

  const handleStartGame = (): void => {
    setCurrentView("game");
  };

  const handleBackToMenu = (): void => {
    setCurrentView("menu");
  };

  return (
    <div>
      {currentView === "menu" && (
        <GameMenu
          onStartGame={handleStartGame}
          title={gameTitle}
          description={gameDescription}
        />
      )}
      {currentView === "game" && (
        <PairMatchingGame
          onBackToMenu={handleBackToMenu}
          words={mathWords}
          gameConfig={mathGameConfig}
          title="Math Concepts Game"
        />
      )}
    </div>
  );
}
```

### Step 3: Add Route to App

Update `src/App.tsx` to include your new game route:

```typescript
import { MathConceptsGame } from "./pages";

export default function App(): React.JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/principle-of-relationship-pair-matching-game"
          element={<PrincipleOfRelationshipGame />}
        />
        <Route
          path="/math-concepts-game"
          element={<MathConceptsGame />}
        />
      </Routes>
    </Router>
  );
}
```

### Step 4: Update Page Exports

Add your new component to `src/pages/index.ts`:

```typescript
export { Home } from "./Home";
export { PrincipleOfRelationshipGame } from "./PrincipleOfRelationshipGame";
export { MathConceptsGame } from "./MathConceptsGame";
```

### Step 5: Add Game Card to Home Page

Update `src/pages/Home.tsx` to include a card for your new game:

```typescript
{/* Add this alongside existing game cards */}
<div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 border-4 border-blue-300 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
  <div className="text-6xl mb-4">🔢</div>
  <h2 className="text-3xl font-bold mb-4 text-blue-800">
    Math Concepts Game
  </h2>
  <p className="text-lg text-gray-700 mb-6">
    Match mathematical concepts and strengthen your understanding of basic math principles.
  </p>
  <div className="flex flex-wrap gap-2 mb-6 justify-center">
    <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold">Addition</span>
    <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-semibold">Division</span>
    <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-semibold">Fractions</span>
  </div>
  <Link
    to="/math-concepts-game"
    className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-green-600 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
  >
    🎮 Play Now! 🎮
  </Link>
</div>
```

## 🛠️ Development

### Prerequisites

- Node.js (version 20.19+ or 22.12+ recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Development Workflow

1. Start the development server: `npm run dev`
2. Open your browser to `http://localhost:5173`
3. Make changes to the code - the dev server will hot-reload
4. Test your changes by navigating to different routes

## 🎨 Styling

The project uses Tailwind CSS for styling with a consistent design system:

- **Colors**: Gradient backgrounds with blue, purple, pink, and orange accents
- **Typography**: Bold fonts with gradient text effects
- **Components**: Rounded corners, shadows, and hover animations
- **Layout**: Responsive grid systems and flexbox layouts

### Key Design Patterns

- Gradient backgrounds with overlay patterns
- Card-based layouts with hover effects
- Emoji icons for visual interest
- Consistent button styling with transforms
- Responsive design for all screen sizes

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

### Deployment Options

#### **Netlify** (Recommended)
1. Connect your repository for automatic deployments, or
2. Deploy the `dist` folder manually
3. **Important**: The project includes a `public/_redirects` file that handles client-side routing
4. This ensures direct URL access (e.g., `/principle-of-relationship-pair-matching-game`) works correctly

#### **Vercel**
- Connect your repository for automatic deployments
- Vercel automatically handles SPA routing

#### **GitHub Pages**
- Deploy the `dist` folder to GitHub Pages
- May require additional configuration for client-side routing

#### **Other Static Hosts**
- Upload the `dist` folder contents
- Ensure the hosting service supports SPA redirects or configure accordingly

### SPA Routing Configuration

This project uses React Router for client-side routing. For direct URL access to work properly:

**Netlify**: Uses `public/_redirects` file (already included):
```
/*    /index.html   200
```

**Other hosting services** may require similar redirect configurations to serve `index.html` for all routes.

## 🧪 Testing

The project includes:

- **TypeScript**: Compile-time type checking
- **ESLint**: Code quality and consistency
- **Build Verification**: Ensures all components compile correctly

Run checks before deploying:
```bash
npx tsc --noEmit  # Type checking
npm run lint      # Code quality
npm run build     # Production build
```

## 🤝 Contributing

1. Follow the existing code structure and naming conventions
2. Use TypeScript for all new components
3. Maintain consistent styling with Tailwind CSS
4. Test your changes thoroughly
5. Update documentation for new games or components

## 📝 License

This project is licensed under the ISC License.