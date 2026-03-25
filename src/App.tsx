import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameUserProvider } from "./context/GameUserContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import {
  Home,
  ThreeDWellness,
  KnowYourHealth,
  SocialWellbeing,
  EmotionalWellbeing,
  EnvironmentalWellbeing,
  IntellectualWellbeing,
  OccupationalWellbeing,
  PhysicalWellbeing,
  SpiritualWellbeing,
  PlanetProtectorGame,
  EcoFixItGame,
  PrincipleOfRelationshipGame,
  FruitVegetableGame,
  Quiz,
  EmotionDetectiveGame,
  FinancialLiteracy,
  BankingWordSearch,
  BudgetingGame,
  StudyHabitsGame,
  JobPathMaze,
  DreamJobBuilder,
  SkillsJobsSort,
  HealthyPlateGame,
  SuryaNamaskarGame,
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
        <Route path="/know-your-health" element={<KnowYourHealth />} />
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
        {/* Environmental Wellbeing routes */}
        <Route path="/environmental-wellbeing" element={<EnvironmentalWellbeing />} />
        <Route path="/environmental-wellbeing/planet-protector" element={<PlanetProtectorGame />} />
        <Route path="/environmental-wellbeing/eco-fix-it" element={<EcoFixItGame />} />
        {/* Financial Literacy routes */}
        <Route path="/financial-literacy" element={<FinancialLiteracy />} />
        <Route path="/banking-word-search" element={<BankingWordSearch />} />
        <Route path="/budgeting-game" element={<BudgetingGame />} />
        {/* Other Wellbeing dimension routes */}
        <Route path="/study-habits-game" element={<StudyHabitsGame />} />
        <Route path="/intellectual-wellbeing" element={<IntellectualWellbeing />} />
        <Route path="/occupational-wellbeing" element={<OccupationalWellbeing />} />
        <Route path="/job-path-maze"    element={<JobPathMaze />} />
        <Route path="/dream-job-builder" element={<DreamJobBuilder />} />
        <Route path="/skills-jobs-sort"  element={<SkillsJobsSort />} />
        <Route path="/physical-wellbeing" element={<PhysicalWellbeing />} />
        <Route path="/healthy-plate" element={<HealthyPlateGame />} />
        <Route path="/surya-namaskar" element={<SuryaNamaskarGame />} />
        <Route path="/spiritual-wellbeing" element={<SpiritualWellbeing />} />
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
