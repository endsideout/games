import React from "react";
import { Logo } from "../../../components";
import {
  WellbeingDimensionsBackLink,
  WellbeingGameGrid,
} from "./WellbeingGameGrid";

export function IntellectualWellbeing(): React.JSX.Element {
  const games = [
    {
      title: "Study Habits Sort",
      icon: "📚",
      description: "Sort study habits into Good or Bad! Drag each habit to the right bucket before time runs out.",
      route: "/study-habits-game",
      color: "from-indigo-50 to-blue-50",
      borderColor: "border-indigo-300",
      buttonColor: "from-indigo-500 to-blue-600",
      tags: ["Focus", "Learning", "Time Management"],
      comingSoon: false
    },
    {
      title: "Brain Puzzles",
      icon: "🧩",
      description: "Coming Soon! Challenge your mind with fun puzzles that boost critical thinking and problem-solving skills.",
      route: "#",
      color: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-300",
      buttonColor: "from-purple-400 to-indigo-500",
      tags: ["Logic", "Problem Solving", "Critical Thinking"],
      comingSoon: true
    },
    {
      title: "Memory Master",
      icon: "🧠",
      description: "Coming Soon! Train your memory with fun matching games and remember more every day!",
      route: "#",
      color: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-300",
      buttonColor: "from-blue-400 to-cyan-500",
      tags: ["Memory", "Focus", "Concentration"],
      comingSoon: true
    }
  ];

  return (
    <div
      className="min-h-screen py-8"
      style={{
        background:
          "linear-gradient(135deg, #5C6BC0 0%, #7986CB 25%, #9FA8DA 50%, #7E57C2 75%, #512DA8 100%)",
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
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-indigo-300 inline-block">
            <div className="flex items-center justify-center mb-4">
              <Logo size="md" className="mr-4" />
              <div className="text-6xl mr-4">💡</div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Intellectual Wellbeing
              </h1>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl">
              Expand your mind! Develop curiosity, creativity, and critical thinking through engaging brain games and challenges.
            </p>
          </div>
        </div>

        <WellbeingGameGrid
          games={games}
          gameTitleClassName="text-indigo-800"
          gameTagClassName="bg-indigo-200 text-indigo-800"
        />

        <WellbeingDimensionsBackLink />
      </div>
    </div>
  );
}
