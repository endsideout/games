import React from "react";
import {
  KnowYourHealthModuleLayout,
  type KyhModuleGame,
} from "./KnowYourHealthModuleLayout";

const GAMES: KyhModuleGame[] = [
  {
    name: "Finish the Race!",
    icon: "🏃🏁",
    description:
      "Answer questions about healthy habits and race to the finish line — every correct answer moves you closer!",
    color: "from-green-50 to-emerald-50",
    borderColor: "border-green-400",
    textColor: "text-green-900",
    buttonColor: "from-green-500 to-emerald-600",
    route: "/finish-race-game",
  },
];

export function KnowYourHealthModule5(): React.JSX.Element {
  return (
    <KnowYourHealthModuleLayout
      games={GAMES}
      background="linear-gradient(135deg, #064e3b 0%, #047857 40%, #10b981 100%)"
      headerBorderClass="border-green-400"
      eyebrowTextClass="text-green-600"
      moduleNumber="Module 5"
      moduleTagline="Physical activity & healthy habits — race your way to a healthier you!"
    />
  );
}
