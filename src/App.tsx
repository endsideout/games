import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameUserProvider } from "./context/GameUserContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import {
  Home,
  ThreeDWellness,
  SocialWellbeing,
  EmotionalWellbeing,
  PlanetProtectorGame,
  PrincipleOfRelationshipGame,
  FruitVegetableGame,
  Quiz,
  EmotionDetectiveGame,
  BankingWordSearch,
} from "./pages";
import { AdminLogin, AdminDashboard } from "./pages/admin";
import { FRUIT_VEGGIE_QUESTIONS } from "./data/fruitVeggieQuiz";
import { challengeCards } from "./data/challengeCards";

export default function App(): React.JSX.Element {
  return (
    <Router>
      <AuthProvider>
        <GameUserProvider>
          <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/3d-wellness" element={<ThreeDWellness />} />
        <Route path="/social-wellbeing" element={<SocialWellbeing />} />
        <Route
          path="/principle-of-relationship-pair-matching-game"
          element={<PrincipleOfRelationshipGame />}
        />
        <Route
          path="/fruit-vegetable-matching-game"
          element={<FruitVegetableGame />}
        />
        <Route
          path="/fruit-veggie-quiz"
          element={
            <Quiz
              questions={FRUIT_VEGGIE_QUESTIONS}
              title="Fruit & Veggie Quiz"
              subtitle="Answer correctly to grow! 🌱➡️🌳"
              gameId="fruit-veggie-quiz"
            />
          }
        />
        <Route
          path="/challenge-quiz"
          element={
            <Quiz
              cards={challengeCards}
              title="Mental Health Challenge"
              subtitle="Build your emotional intelligence! 🧠💚"
              gameId="challenge-quiz"
            />
          }
        />
        {/* Emotional Wellbeing routes */}
        <Route path="/emotional-wellbeing" element={<EmotionalWellbeing />} />
        <Route path="/emotion-detective-game" element={<EmotionDetectiveGame />} />
        {/* Placeholder routes for other wellness dimensions */}
        <Route
          path="/environmental-wellbeing"
          element={
              <PlanetProtectorGame />
          }
        />
        <Route path="/financial-literacy" element={<BankingWordSearch />} />
        <Route path="/banking-word-search" element={<BankingWordSearch />} />
        <Route path="/intellectual-wellbeing" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-4xl font-bold mb-4">Intellectual Wellbeing</h1><p className="text-xl">Coming Soon!</p></div></div>} />
        <Route path="/occupational-wellbeing" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-4xl font-bold mb-4">Occupational Wellbeing</h1><p className="text-xl">Coming Soon!</p></div></div>} />
        <Route path="/physical-wellbeing" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-4xl font-bold mb-4">Physical Wellbeing</h1><p className="text-xl">Coming Soon!</p></div></div>} />
        <Route path="/spiritual-wellbeing" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-4xl font-bold mb-4">Spiritual Wellbeing</h1><p className="text-xl">Coming Soon!</p></div></div>} />
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      </GameUserProvider>
      </AuthProvider>
    </Router>
  );
}
