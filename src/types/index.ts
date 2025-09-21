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