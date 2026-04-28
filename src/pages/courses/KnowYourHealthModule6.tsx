import React from "react";
import {
  KnowYourHealthModuleLayout,
  type KyhModuleGame,
} from "./KnowYourHealthModuleLayout";

const GAMES: KyhModuleGame[] = [
  {
    name: "Guard Your Health!",
    icon: "🛡️🏃",
    description:
      "Let good habits fall on you and drag bad habits away — protect your body from disease!",
    color: "from-violet-50 to-purple-50",
    borderColor: "border-violet-400",
    textColor: "text-violet-900",
    buttonColor: "from-violet-500 to-purple-600",
    route: "/habit-guard-game",
  },
];

export function KnowYourHealthModule6(): React.JSX.Element {
  return (
    <KnowYourHealthModuleLayout
      games={GAMES}
      background="linear-gradient(135deg, #3b0764 0%, #6d28d9 40%, #a78bfa 100%)"
      headerBorderClass="border-violet-400"
      eyebrowTextClass="text-violet-600"
      moduleNumber="Module 6"
      moduleTagline="Healthy habits vs. bad habits — guard your body and stay healthy!"
    />
  );
}
