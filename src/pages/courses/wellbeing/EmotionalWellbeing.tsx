import React from "react";
import { Logo } from "../../../components";
import {
  WellbeingDimensionsBackLink,
  WellbeingGameGrid,
} from "./WellbeingGameGrid";
import { emotionalWellbeingPageStyle } from "./emotional-wellbeing/emotionalWellbeingPageStyle";

export function EmotionalWellbeing(): React.JSX.Element {
  const games = [
    {
      title: "Emotion Detective",
      icon: "🔍",
      description: "Help identify how people feel in different situations. Match scenarios to emotions!",
      route: "/emotion-detective-game",
      color: "from-purple-50 to-pink-50",
      borderColor: "border-purple-300",
      buttonColor: "from-purple-500 to-pink-600",
      tags: ["Empathy", "Feelings", "Understanding"]
    }
  ];

  return (
    <div className="min-h-screen py-8" style={emotionalWellbeingPageStyle}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-purple-300 inline-block">
            <div className="flex items-center justify-center mb-4">
              <Logo size="md" className="mr-4" />
              <div className="text-6xl mr-4">💝</div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Emotional Wellbeing
              </h1>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl">
              Learn to understand and manage emotions effectively. Explore empathy, feelings, and emotional awareness through fun games!
            </p>
          </div>
        </div>

        <WellbeingGameGrid
          games={games}
          gameTitleClassName="text-purple-800"
          gameTagClassName="bg-purple-200 text-purple-800"
        />

        <WellbeingDimensionsBackLink />
      </div>
    </div>
  );
}
