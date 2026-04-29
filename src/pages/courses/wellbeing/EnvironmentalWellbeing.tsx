import React from "react";
import { Logo } from "../../../components";
import {
  WellbeingDimensionsBackLink,
  WellbeingGameGrid,
} from "./WellbeingGameGrid";

export function EnvironmentalWellbeing(): React.JSX.Element {
  const games = [
    {
      title: "Planet Protector",
      icon: "🌍",
      description: "Protect our planet! Learn about recycling, conservation, and how small actions can make a big difference for Earth.",
      route: "/environmental-wellbeing/planet-protector",
      color: "from-green-50 to-emerald-50",
      borderColor: "border-green-300",
      buttonColor: "from-green-500 to-emerald-600",
      tags: ["Recycling", "Conservation", "Eco-Friendly"],
      comingSoon: false
    },
    {
      title: "Eco Sort Challenge",
      icon: "♻️✅",
      description: "Sort items into Eco-Friendly or Not Eco-Friendly. Learn what helps or harms our planet!",
      route: "/environmental-wellbeing/eco-fix-it",
      color: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-300",
      buttonColor: "from-blue-400 to-cyan-500",
      tags: ["Sorting", "Eco-Friendly", "Learning"],
      comingSoon: false
    },
    {
      title: "Water Saver Challenge",
      icon: "💧",
      description: "Coming Soon! Discover ways to save water in everyday life. Every drop counts!",
      route: "#",
      color: "from-cyan-50 to-teal-50",
      borderColor: "border-cyan-300",
      buttonColor: "from-cyan-400 to-teal-500",
      tags: ["Water", "Conservation", "Daily Habits"],
      comingSoon: true
    }
  ];

  return (
    <div
      className="min-h-screen py-8"
      style={{
        background:
          "linear-gradient(135deg, #4CAF50 0%, #8BC34A 25%, #CDDC39 50%, #81C784 75%, #2E7D32 100%)",
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
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-green-300 inline-block">
            <div className="flex items-center justify-center mb-4">
              <Logo size="md" className="mr-4" />
              <div className="text-6xl mr-4">🌱</div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Environmental Wellbeing
              </h1>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl">
              Learn to care for our planet! Explore recycling, conservation, and sustainable living through fun interactive games.
            </p>
          </div>
        </div>

        <WellbeingGameGrid
          games={games}
          gameTitleClassName="text-green-800"
          gameTagClassName="bg-green-200 text-green-800"
        />

        <WellbeingDimensionsBackLink />
      </div>
    </div>
  );
}
