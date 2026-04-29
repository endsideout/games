import React from "react";
import {
  KnowYourHealthModuleLayout,
  type KyhModuleGame,
} from "./KnowYourHealthModuleLayout";

const GAMES: KyhModuleGame[] = [
  {
    name: "Fill the Glass!",
    icon: "💧🥤",
    description:
      "Answer questions about water and healthy drinks to fill up the glass — every correct answer adds water!",
    color: "from-sky-50 to-blue-50",
    borderColor: "border-sky-400",
    textColor: "text-sky-900",
    buttonColor: "from-sky-500 to-blue-600",
    route: "/water-glass-game",
  },
];

export function KnowYourHealthModule4(): React.JSX.Element {
  return (
    <KnowYourHealthModuleLayout
      games={GAMES}
      background="linear-gradient(135deg, #0c4a6e 0%, #0369a1 40%, #0ea5e9 100%)"
      headerBorderClass="border-sky-400"
      eyebrowTextClass="text-sky-600"
      moduleNumber="Module 4"
      moduleTagline="Water & healthy drinks — learn why water is essential for your body!"
    />
  );
}
