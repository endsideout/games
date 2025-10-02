import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, PrincipleOfRelationshipGame, FruitVegetableGame } from "./pages";

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
        {/* Add more game routes here in the future */}
      </Routes>
    </Router>
  );
}