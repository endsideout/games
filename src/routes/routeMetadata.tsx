import React from "react";
import {
  Home,
  PlayerInfoForm,
  ThreeDWellness,
  ThreeDWellnessSet1,
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
  FinancialLiteracy,
  BankingWordSearch,
  StudyHabitsGame,
  JobPathMaze,
  DreamJobBuilder,
  SkillsJobsSort,
  HealthyPlateGame,
  SuryaNamaskarGame,
} from "../pages";
import { AdminLogin } from "../pages/admin";
import { FRUIT_VEGGIE_QUESTIONS } from "../data/fruitVeggieQuiz";
import { challengeCards } from "../data/challengeCards";

export type RouteAccess = "public" | "player_profile" | "admin";

const BrainHealthGame = React.lazy(async () => ({
  default: (await import("../pages")).BrainHealthGame,
}));
const WaterGlassGame = React.lazy(async () => ({
  default: (await import("../pages")).WaterGlassGame,
}));
const EmotionDetectiveGame = React.lazy(async () => ({
  default: (await import("../pages")).EmotionDetectiveGame,
}));
const BudgetingGame = React.lazy(async () => ({
  default: (await import("../pages")).BudgetingGame,
}));
const AdminDashboard = React.lazy(async () => ({
  default: (await import("../pages/admin")).AdminDashboard,
}));

export interface AppRouteMetadata {
  path: string;
  title: string;
  owner: string;
  access: RouteAccess;
  element: React.ReactNode;
}

const rawRoutes: AppRouteMetadata[] = [
  { path: "/", title: "Home", owner: "landing", access: "public", element: <Home /> },
  {
    path: "/player-info",
    title: "Player Info",
    owner: "landing",
    access: "public",
    element: <PlayerInfoForm />,
  },
  {
    path: "/3d-wellness",
    title: "3D Wellness",
    owner: "courses",
    access: "public",
    element: <ThreeDWellness />,
  },
  {
    path: "/3d-wellness/set-1",
    title: "3D Wellness Set 1",
    owner: "courses",
    access: "public",
    element: <ThreeDWellnessSet1 />,
  },
  {
    path: "/know-your-health",
    title: "Know Your Health",
    owner: "courses",
    access: "public",
    element: <KnowYourHealth />,
  },
  {
    path: "/know-your-health/module-1",
    title: "Know Your Health Module 1",
    owner: "know-your-health",
    access: "public",
    element: <KnowYourHealthModule1 />,
  },
  {
    path: "/sometimes-anytime-food",
    title: "Sometimes Anytime Food",
    owner: "know-your-health",
    access: "player_profile",
    element: <SometimesAnytimeGame />,
  },
  {
    path: "/know-your-health/module-2",
    title: "Know Your Health Module 2",
    owner: "know-your-health",
    access: "public",
    element: <KnowYourHealthModule2 />,
  },
  {
    path: "/know-your-health/set-1",
    title: "Know Your Health Set 1",
    owner: "know-your-health",
    access: "public",
    element: <KnowYourHealthSet1 />,
  },
  {
    path: "/least-sugar-game",
    title: "Least Sugar Game",
    owner: "know-your-health",
    access: "player_profile",
    element: <LeastSugarGame />,
  },
  {
    path: "/know-your-health/module-3",
    title: "Know Your Health Module 3",
    owner: "know-your-health",
    access: "public",
    element: <KnowYourHealthModule3 />,
  },
  {
    path: "/brain-health-game",
    title: "Brain Health Game",
    owner: "know-your-health",
    access: "player_profile",
    element: <BrainHealthGame />,
  },
  {
    path: "/know-your-health/module-4",
    title: "Know Your Health Module 4",
    owner: "know-your-health",
    access: "public",
    element: <KnowYourHealthModule4 />,
  },
  {
    path: "/water-glass-game",
    title: "Water Glass Game",
    owner: "know-your-health",
    access: "player_profile",
    element: <WaterGlassGame />,
  },
  {
    path: "/know-your-health/module-5",
    title: "Know Your Health Module 5",
    owner: "know-your-health",
    access: "public",
    element: <KnowYourHealthModule5 />,
  },
  {
    path: "/finish-race-game",
    title: "Finish Race Game",
    owner: "know-your-health",
    access: "player_profile",
    element: <FinishRaceGame />,
  },
  {
    path: "/know-your-health/module-6",
    title: "Know Your Health Module 6",
    owner: "know-your-health",
    access: "public",
    element: <KnowYourHealthModule6 />,
  },
  {
    path: "/habit-guard-game",
    title: "Habit Guard Game",
    owner: "know-your-health",
    access: "player_profile",
    element: <HabitGuardGame />,
  },
  {
    path: "/know-your-health/module-7",
    title: "Know Your Health Module 7",
    owner: "know-your-health",
    access: "public",
    element: <KnowYourHealthModule7 />,
  },
  {
    path: "/body-image-game",
    title: "Body Image Game",
    owner: "know-your-health",
    access: "player_profile",
    element: <BodyImageGame />,
  },
  {
    path: "/social-wellbeing",
    title: "Social Wellbeing",
    owner: "wellbeing",
    access: "public",
    element: <SocialWellbeing />,
  },
  {
    path: "/principle-of-relationship-pair-matching-game",
    title: "Principle Of Relationship Pair Matching Game",
    owner: "social-wellbeing",
    access: "player_profile",
    element: <PrincipleOfRelationshipGame />,
  },
  {
    path: "/fruit-vegetable-matching-game",
    title: "Fruit Vegetable Matching Game",
    owner: "social-wellbeing",
    access: "player_profile",
    element: <FruitVegetableGame />,
  },
  {
    path: "/fruit-veggie-quiz",
    title: "Fruit Veggie Quiz",
    owner: "social-wellbeing",
    access: "player_profile",
    element: (
      <Quiz
        questions={FRUIT_VEGGIE_QUESTIONS}
        title="Fruit & Veggie Quiz"
        subtitle="Answer correctly to grow! 🌱➡️🌳"
        gameId="fruit-veggie-quiz"
      />
    ),
  },
  {
    path: "/challenge-quiz",
    title: "Challenge Quiz",
    owner: "social-wellbeing",
    access: "player_profile",
    element: (
      <Quiz
        cards={challengeCards}
        title="Mental Health Challenge"
        subtitle="Build your emotional intelligence! 🧠💚"
        gameId="challenge-quiz"
      />
    ),
  },
  {
    path: "/emotional-wellbeing",
    title: "Emotional Wellbeing",
    owner: "wellbeing",
    access: "public",
    element: <EmotionalWellbeing />,
  },
  {
    path: "/emotion-detective-game",
    title: "Emotion Detective Game",
    owner: "emotional-wellbeing",
    access: "player_profile",
    element: <EmotionDetectiveGame />,
  },
  {
    path: "/environmental-wellbeing",
    title: "Environmental Wellbeing",
    owner: "wellbeing",
    access: "public",
    element: <EnvironmentalWellbeing />,
  },
  {
    path: "/environmental-wellbeing/planet-protector",
    title: "Planet Protector Game",
    owner: "environmental-wellbeing",
    access: "player_profile",
    element: <PlanetProtectorGame />,
  },
  {
    path: "/environmental-wellbeing/eco-fix-it",
    title: "Eco Fix It Game",
    owner: "environmental-wellbeing",
    access: "player_profile",
    element: <EcoFixItGame />,
  },
  {
    path: "/financial-literacy",
    title: "Financial Literacy",
    owner: "courses",
    access: "public",
    element: <FinancialLiteracy />,
  },
  {
    path: "/banking-word-search",
    title: "Banking Word Search",
    owner: "financial-literacy",
    access: "player_profile",
    element: <BankingWordSearch />,
  },
  {
    path: "/budgeting-game",
    title: "Budgeting Game",
    owner: "financial-literacy",
    access: "player_profile",
    element: <BudgetingGame />,
  },
  {
    path: "/study-habits-game",
    title: "Study Habits Game",
    owner: "intellectual-wellbeing",
    access: "player_profile",
    element: <StudyHabitsGame />,
  },
  {
    path: "/intellectual-wellbeing",
    title: "Intellectual Wellbeing",
    owner: "wellbeing",
    access: "public",
    element: <IntellectualWellbeing />,
  },
  {
    path: "/occupational-wellbeing",
    title: "Occupational Wellbeing",
    owner: "wellbeing",
    access: "public",
    element: <OccupationalWellbeing />,
  },
  {
    path: "/job-path-maze",
    title: "Job Path Maze",
    owner: "occupational-wellbeing",
    access: "player_profile",
    element: <JobPathMaze />,
  },
  {
    path: "/dream-job-builder",
    title: "Dream Job Builder",
    owner: "occupational-wellbeing",
    access: "player_profile",
    element: <DreamJobBuilder />,
  },
  {
    path: "/skills-jobs-sort",
    title: "Skills Jobs Sort",
    owner: "occupational-wellbeing",
    access: "player_profile",
    element: <SkillsJobsSort />,
  },
  {
    path: "/physical-wellbeing",
    title: "Physical Wellbeing",
    owner: "wellbeing",
    access: "public",
    element: <PhysicalWellbeing />,
  },
  {
    path: "/healthy-plate",
    title: "Healthy Plate",
    owner: "physical-wellbeing",
    access: "player_profile",
    element: <HealthyPlateGame />,
  },
  {
    path: "/surya-namaskar",
    title: "Surya Namaskar",
    owner: "spiritual-wellbeing",
    access: "player_profile",
    element: <SuryaNamaskarGame />,
  },
  {
    path: "/spiritual-wellbeing",
    title: "Spiritual Wellbeing",
    owner: "wellbeing",
    access: "public",
    element: <SpiritualWellbeing />,
  },
  {
    path: "/admin/login",
    title: "Admin Login",
    owner: "admin",
    access: "public",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    title: "Admin Dashboard",
    owner: "admin",
    access: "admin",
    element: <AdminDashboard />,
  },
];

const landingRoutes = rawRoutes.filter((route) => route.owner === "landing");
const coreCourseRoutes = rawRoutes.filter((route) => route.owner === "courses");
const knowYourHealthRoutes = rawRoutes.filter((route) => route.owner === "know-your-health");
const wellbeingRoutes = rawRoutes.filter((route) =>
  route.owner.includes("wellbeing") || route.owner === "social-wellbeing" || route.owner === "emotional-wellbeing"
);
const financialLiteracyRoutes = rawRoutes.filter((route) => route.owner === "financial-literacy");
const adminRoutes = rawRoutes.filter((route) => route.owner === "admin");

const routeSlices = {
  landingRoutes,
  coreCourseRoutes,
  knowYourHealthRoutes,
  wellbeingRoutes,
  financialLiteracyRoutes,
  adminRoutes,
};

export const appRoutes: AppRouteMetadata[] = [
  ...landingRoutes,
  ...coreCourseRoutes,
  ...knowYourHealthRoutes,
  ...wellbeingRoutes,
  ...financialLiteracyRoutes,
  ...adminRoutes,
];
