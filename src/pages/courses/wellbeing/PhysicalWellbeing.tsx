import React from "react";
import { Logo } from "../../../components";
import {
  WellbeingDimensionsBackLink,
  WellbeingGameGrid,
} from "./WellbeingGameGrid";

export function PhysicalWellbeing(): React.JSX.Element {
  const games = [
    {
      title: "Fitness Fun",
      icon: "🏃",
      description: "Coming Soon! Get moving with fun exercise challenges and learn how to keep your body healthy and strong.",
      route: "#",
      color: "from-red-50 to-orange-50",
      borderColor: "border-red-300",
      buttonColor: "from-red-500 to-orange-600",
      tags: ["Exercise", "Movement", "Strength"],
      comingSoon: true
    },
    {
      title: "Healthy Plate Builder",
      icon: "🍽️",
      description: "Build the perfect healthy plate! Drag 5 foods onto the plate and score based on how nutritious your choices are.",
      route: "/healthy-plate",
      color: "from-green-50 to-lime-50",
      borderColor: "border-green-300",
      buttonColor: "from-green-400 to-lime-500",
      tags: ["Nutrition", "Drag & Drop", "5 Foods", "90s Timer"],
      comingSoon: false
    },
    {
      title: "Sleep Stars",
      icon: "😴",
      description: "Coming Soon! Learn about good sleep habits and why rest is important for your body and mind.",
      route: "#",
      color: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-300",
      buttonColor: "from-blue-400 to-indigo-500",
      tags: ["Sleep", "Rest", "Healthy Habits"],
      comingSoon: true
    }
  ];

  return (
    <div
      className="min-h-screen py-8"
      style={{
        background:
          "linear-gradient(135deg, #EF5350 0%, #FF7043 25%, #FFAB91 50%, #FF8A65 75%, #E53935 100%)",
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
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-red-300 inline-block">
            <div className="flex items-center justify-center mb-4">
              <Logo size="md" className="mr-4" />
              <div className="text-6xl mr-4">💪</div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                Physical Wellbeing
              </h1>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl">
              Take care of your body! Learn about exercise, nutrition, and healthy habits that keep you strong and energized.
            </p>
          </div>
        </div>

        <WellbeingGameGrid
          games={games}
          gameTitleClassName="text-red-800"
          gameTagClassName="bg-red-200 text-red-800"
        />

        <WellbeingDimensionsBackLink />
      </div>
    </div>
  );
}
