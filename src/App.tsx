import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GameUserProvider } from "./context/GameUserContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { EnvironmentBanner, RequirePlayerProfile } from "./components";
import {
  Home,
  PlayerInfoForm,
  ThreeDWellness,
  KnowYourHealth,
  KnowYourHealthModule1,
  KnowYourHealthModule2,
  KnowYourHealthSet1,
  KnowYourHealthModule3,
  KnowYourHealthModule4,
  KnowYourHealthModule5,
  KnowYourHealthModule6,
  KnowYourHealthModule7,
  SometimesAnytimeGame,
  LeastSugarGame,
  BrainHealthGame,
  WaterGlassGame,
  FinishRaceGame,
  HabitGuardGame,
  BodyImageGame,
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
  const withPlayerInfoGate = (element: React.ReactNode): React.JSX.Element => (
    <RequirePlayerProfile>{element}</RequirePlayerProfile>
  );

  return (
    <Router>
      <AuthProvider>
        <GameUserProvider>
          <EnvironmentBanner />
          <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player-info" element={<PlayerInfoForm />} />
        <Route path="/3d-wellness" element={<ThreeDWellness />} />
        <Route path="/know-your-health" element={<KnowYourHealth />} />
        <Route path="/know-your-health/module-1" element={<KnowYourHealthModule1 />} />
        <Route path="/sometimes-anytime-food" element={withPlayerInfoGate(<SometimesAnytimeGame />)} />
        <Route path="/know-your-health/module-2" element={<KnowYourHealthModule2 />} />
        <Route path="/know-your-health/set-1" element={<KnowYourHealthSet1 />} />
        <Route path="/least-sugar-game" element={withPlayerInfoGate(<LeastSugarGame />)} />
        <Route path="/know-your-health/module-3" element={<KnowYourHealthModule3 />} />
        <Route path="/brain-health-game" element={withPlayerInfoGate(<BrainHealthGame />)} />
        <Route path="/know-your-health/module-4" element={<KnowYourHealthModule4 />} />
        <Route path="/water-glass-game" element={withPlayerInfoGate(<WaterGlassGame />)} />
        <Route path="/know-your-health/module-5" element={<KnowYourHealthModule5 />} />
        <Route path="/finish-race-game" element={withPlayerInfoGate(<FinishRaceGame />)} />
        <Route path="/know-your-health/module-6" element={<KnowYourHealthModule6 />} />
        <Route path="/habit-guard-game" element={withPlayerInfoGate(<HabitGuardGame />)} />
        <Route path="/know-your-health/module-7" element={<KnowYourHealthModule7 />} />
        <Route path="/body-image-game" element={withPlayerInfoGate(<BodyImageGame />)} />
        <Route path="/social-wellbeing" element={<SocialWellbeing />} />
        <Route
          path="/principle-of-relationship-pair-matching-game"
          element={withPlayerInfoGate(<PrincipleOfRelationshipGame />)}
        />
        <Route
          path="/fruit-vegetable-matching-game"
          element={withPlayerInfoGate(<FruitVegetableGame />)}
        />
        <Route
          path="/fruit-veggie-quiz"
          element={withPlayerInfoGate(
            <Quiz
              questions={FRUIT_VEGGIE_QUESTIONS}
              title="Fruit & Veggie Quiz"
              subtitle="Answer correctly to grow! 🌱➡️🌳"
              gameId="fruit-veggie-quiz"
            />
          )}
        />
        <Route
          path="/challenge-quiz"
          element={withPlayerInfoGate(
            <Quiz
              cards={challengeCards}
              title="Mental Health Challenge"
              subtitle="Build your emotional intelligence! 🧠💚"
              gameId="challenge-quiz"
            />
          )}
        />
        {/* Emotional Wellbeing routes */}
        <Route path="/emotional-wellbeing" element={<EmotionalWellbeing />} />
        <Route path="/emotion-detective-game" element={withPlayerInfoGate(<EmotionDetectiveGame />)} />
        {/* Environmental Wellbeing routes */}
        <Route path="/environmental-wellbeing" element={<EnvironmentalWellbeing />} />
        <Route path="/environmental-wellbeing/planet-protector" element={withPlayerInfoGate(<PlanetProtectorGame />)} />
        <Route path="/environmental-wellbeing/eco-fix-it" element={withPlayerInfoGate(<EcoFixItGame />)} />
        {/* Financial Literacy routes */}
        <Route path="/financial-literacy" element={<FinancialLiteracy />} />
        <Route path="/banking-word-search" element={withPlayerInfoGate(<BankingWordSearch />)} />
        <Route path="/budgeting-game" element={withPlayerInfoGate(<BudgetingGame />)} />
        {/* Other Wellbeing dimension routes */}
        <Route path="/study-habits-game" element={withPlayerInfoGate(<StudyHabitsGame />)} />
        <Route path="/intellectual-wellbeing" element={<IntellectualWellbeing />} />
        <Route path="/occupational-wellbeing" element={<OccupationalWellbeing />} />
        <Route path="/job-path-maze"    element={withPlayerInfoGate(<JobPathMaze />)} />
        <Route path="/dream-job-builder" element={withPlayerInfoGate(<DreamJobBuilder />)} />
        <Route path="/skills-jobs-sort"  element={withPlayerInfoGate(<SkillsJobsSort />)} />
        <Route path="/physical-wellbeing" element={<PhysicalWellbeing />} />
        <Route path="/healthy-plate" element={withPlayerInfoGate(<HealthyPlateGame />)} />
        <Route path="/surya-namaskar" element={withPlayerInfoGate(<SuryaNamaskarGame />)} />
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
