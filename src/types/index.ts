// Type definitions
export interface Card {
  id: number;
  word: string;
  flipped: boolean;
  matched: boolean;
}

export interface GameConfig {
  pairs: number;
  gridCols: number;
  time: number;
}

export interface GameMenuProps {
  onStartGame: () => void;
  title: string;
  description: string;
}

export interface PairMatchingGameProps {
  onBackToMenu: () => void;
  words: string[];
  gameConfig: GameConfig;
  title: string;
}

export interface QuizQuestion {
  prompt: string;
  options: string[];
  answer: string;
}

export interface ChallengeCard {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  resource: string;
  explanation: string;
}