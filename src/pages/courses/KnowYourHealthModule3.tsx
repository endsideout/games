import React from "react";
import {
  KnowYourHealthModuleLayout,
  type KyhModuleGame,
} from "./KnowYourHealthModuleLayout";

const GAMES: KyhModuleGame[] = [
  {
    name: "Help Flame-man!",
    icon: "🦸🔥",
    description:
      "Help our superhero Flame-man make smart choices for his brain health across 5 real-life scenarios!",
    color: "from-blue-50 to-purple-50",
    borderColor: "border-blue-400",
    textColor: "text-blue-900",
    buttonColor: "from-blue-600 to-purple-600",
    route: "/brain-health-game",
  },
];

export function KnowYourHealthModule3(): React.JSX.Element {
  return (
    <KnowYourHealthModuleLayout
      games={GAMES}
      background="linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 40%, #7c3aed 100%)"
      headerBorderClass="border-yellow-400"
      eyebrowTextClass="text-blue-600"
      moduleNumber="Module 3"
      moduleTagline="Brain health — make the right choices to keep your brain strong!"
    />
  );
}
