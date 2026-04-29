import React from "react";
import {
  KnowYourHealthModuleLayout,
  type KyhModuleGame,
} from "./KnowYourHealthModuleLayout";

const GAMES: KyhModuleGame[] = [
  {
    name: "Positive or Negative?",
    icon: "🪞💜",
    description:
      "Read statements about body image and decide if each one reflects a positive or negative attitude!",
    color: "from-purple-50 to-pink-50",
    borderColor: "border-purple-400",
    textColor: "text-purple-900",
    buttonColor: "from-purple-500 to-pink-600",
    route: "/body-image-game",
  },
];

export function KnowYourHealthModule7(): React.JSX.Element {
  return (
    <KnowYourHealthModuleLayout
      games={GAMES}
      background="linear-gradient(135deg, #4c1d95 0%, #7c3aed 45%, #db2777 100%)"
      headerBorderClass="border-purple-400"
      eyebrowTextClass="text-purple-600"
      moduleNumber="Module 7"
      moduleTagline="Body image & self-worth — learn to celebrate and appreciate your body!"
    />
  );
}
