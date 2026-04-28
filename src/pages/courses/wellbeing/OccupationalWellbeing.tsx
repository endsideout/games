import React from "react";
import { Logo } from "../../../components";
import {
  WellbeingDimensionsBackLink,
  WellbeingGameGrid,
} from "./WellbeingGameGrid";

export function OccupationalWellbeing(): React.JSX.Element {
  const games = [
    {
      title: "Job Path Maze",
      icon: "🗺️",
      description: "Navigate your character to their Dream Job! Answer questions at each checkpoint to move forward.",
      route: "/job-path-maze",
      color: "from-orange-50 to-amber-50",
      borderColor: "border-orange-300",
      buttonColor: "from-orange-500 to-amber-600",
      tags: ["Careers", "Quiz", "3 Lives", "60s / Step"],
      comingSoon: false
    },
    {
      title: "Dream Job Builder",
      icon: "🏗️",
      description: "Answer 5 fun questions and discover which career matches your personality!",
      route: "/dream-job-builder",
      color: "from-yellow-50 to-amber-50",
      borderColor: "border-yellow-300",
      buttonColor: "from-yellow-500 to-amber-600",
      tags: ["Personality Quiz", "5 Questions", "Career Match"],
      comingSoon: false
    },
    {
      title: "Skills & Jobs Sort",
      icon: "🔧",
      description: "Match skills like teamwork, math, and creativity to the careers that need them!",
      route: "/skills-jobs-sort",
      color: "from-lime-50 to-green-50",
      borderColor: "border-lime-300",
      buttonColor: "from-lime-500 to-green-600",
      tags: ["Drag & Drop", "8 Skills", "4 Careers"],
      comingSoon: false
    },
    {
      title: "Career Explorer",
      icon: "🎯",
      description: "Coming Soon! Discover different careers and find out what jobs match your interests and skills.",
      route: "#",
      color: "from-orange-50 to-red-50",
      borderColor: "border-orange-300",
      buttonColor: "from-orange-500 to-red-600",
      tags: ["Careers", "Interests", "Skills"],
      comingSoon: true
    },
    {
      title: "Team Builder",
      icon: "🤝",
      description: "Coming Soon! Learn teamwork skills through fun collaborative challenges and activities.",
      route: "#",
      color: "from-yellow-50 to-orange-50",
      borderColor: "border-yellow-300",
      buttonColor: "from-yellow-400 to-orange-500",
      tags: ["Teamwork", "Collaboration", "Communication"],
      comingSoon: true
    },
    {
      title: "Goal Getter",
      icon: "🏆",
      description: "Coming Soon! Set goals and track your progress. Learn how to achieve your dreams step by step!",
      route: "#",
      color: "from-amber-50 to-yellow-50",
      borderColor: "border-amber-300",
      buttonColor: "from-amber-400 to-yellow-500",
      tags: ["Goals", "Planning", "Achievement"],
      comingSoon: true
    }
  ];

  return (
    <div
      className="min-h-screen py-8"
      style={{
        background:
          "linear-gradient(135deg, #FF9800 0%, #FFB74D 25%, #FFCC80 50%, #FFA726 75%, #F57C00 100%)",
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `,
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-orange-300 inline-block">
            <div className="flex items-center justify-center mb-4">
              <Logo size="md" className="mr-4" />
              <div className="text-6xl mr-4">💼</div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                Occupational Wellbeing
              </h1>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl">
              Explore careers and develop work skills! Learn about teamwork, goal-setting, and finding what you love to do.
            </p>
          </div>
        </div>

        <WellbeingGameGrid
          games={games}
          gameTitleClassName="text-orange-800"
          gameTagClassName="bg-orange-200 text-orange-800"
        />

        <WellbeingDimensionsBackLink />
      </div>
    </div>
  );
}
