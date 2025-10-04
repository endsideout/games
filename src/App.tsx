import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Home,
  PrincipleOfRelationshipGame,
  FruitVegetableGame,
  Quiz,
} from "./pages";
import { FRUIT_VEGGIE_QUESTIONS } from "./data/fruitVeggieQuiz";
import { challengeCards } from "./data/challengeCards";

export default function App(): React.JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/principle-of-relationship-pair-matching-game"
          element={<PrincipleOfRelationshipGame />}
        />
        <Route
          path="/fruit-vegetable-matching-game"
          element={<FruitVegetableGame />}
        />
        <Route
          path="/fruit-veggie-quiz"
          element={
            <Quiz
              questions={FRUIT_VEGGIE_QUESTIONS}
              title="Fruit & Veggie Quiz"
              subtitle="Answer correctly to grow! 🌱➡️🌳"
            />
          }
        />
        <Route
          path="/challenge-quiz"
          element={
            <Quiz
              cards={challengeCards}
              title="Mental Health Challenge"
              subtitle="Build your emotional intelligence! 🧠💚"
            />
          }
        />
        {/* Add more game routes here in the future */}
      </Routes>
    </Router>
  );
}
