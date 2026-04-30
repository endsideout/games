export interface GameInstruction {
  text:  string;
  emoji: string;
  audio: string;
}

export const REACT_AUDIO = {
  winHigh: "/audio/react-win-high.wav",
  winMid:  "/audio/react-win-mid.wav",
  winLow:  "/audio/react-win-low.wav",
  retry:   "/audio/react-retry.wav",
  giggle:  "/audio/react-giggle.wav",
} as const;

export const GAME_INSTRUCTIONS: Record<string, GameInstruction> = {
  "/sometimes-anytime-food": {
    emoji: "🍎",
    audio: "/audio/game-sometimes-anytime-food.wav",
    text:  "Hi friend! Sort the foods into anytime foods and sometimes foods! Anytime foods are healthy to eat every day. Sometimes foods are yummy treats for special occasions. Drag each food card to the right basket!",
  },
  "/least-sugar-game": {
    emoji: "🍬",
    audio: "/audio/game-least-sugar-game.wav",
    text:  "Hello! Find the food with the least sugar! Look carefully at each food and pick the one with the lowest sugar. Ready? Let's go!",
  },
  "/brain-health-game": {
    emoji: "🧠",
    audio: "/audio/game-brain-health-game.wav",
    text:  "Hey there! It's brain health time! Read each situation and pick the best choice for your brain. Listen to the explanation after each answer. You've got this!",
  },
  "/water-glass-game": {
    emoji: "💧",
    audio: "/audio/game-water-glass-game.wav",
    text:  "Hi! Let's drink water! Drag glasses of water to fill up your daily goal. Drinking water every day keeps you healthy and strong!",
  },
  "/finish-race-game": {
    emoji: "🏃",
    audio: "/audio/game-finish-race-game.wav",
    text:  "Ready, set, go! Answer the health questions correctly to run faster and win the race. The faster you answer, the faster you run!",
  },
  "/habit-guard-game": {
    emoji: "🛡️",
    audio: "/audio/game-habit-guard-game.wav",
    text:  "Hey hero! Drag the good habits to your character to protect them! Bad habits will try to sneak in — drag them away! Keep your character safe and healthy!",
  },
  "/body-image-game": {
    emoji: "💚",
    audio: "/audio/game-body-image-game.wav",
    text:  "Hi! Let's talk about body image! Read each statement and decide if it shows a positive or negative body image. Every body is amazing!",
  },
  "/principle-of-relationship-pair-matching-game": {
    emoji: "🤝",
    audio: "/audio/game-principle-of-relationship.wav",
    text:  "Hello! Match the relationship principles with their meanings! Flip the cards and find the matching pairs. Good relationships make us happy!",
  },
  "/fruit-vegetable-matching-game": {
    emoji: "🥦",
    audio: "/audio/game-fruit-vegetable-matching.wav",
    text:  "Hey! Match the fruits and vegetables! Flip the cards and find the pairs that go together. Fruits and veggies keep us super healthy!",
  },
  "/fruit-veggie-quiz": {
    emoji: "🌱",
    audio: "/audio/game-fruit-veggie-quiz.wav",
    text:  "Quiz time! Answer questions about fruits and vegetables. Each correct answer helps your plant grow bigger. How tall can you make it?",
  },
  "/challenge-quiz": {
    emoji: "🧠",
    audio: "/audio/game-challenge-quiz.wav",
    text:  "Mental health challenge! Answer questions about emotions and feelings. Each correct answer builds your emotional intelligence. You're a superstar!",
  },
  "/emotion-detective-game": {
    emoji: "🔍",
    audio: "/audio/game-emotion-detective.wav",
    text:  "Be an emotion detective! Look at each face and figure out how they are feeling. Understanding emotions helps us be better friends!",
  },
  "/environmental-wellbeing/planet-protector": {
    emoji: "🌍",
    audio: "/audio/game-planet-protector.wav",
    text:  "Save the planet! Sort the items into recycling, compost, and trash. Taking care of our Earth keeps it beautiful for everyone!",
  },
  "/environmental-wellbeing/eco-fix-it": {
    emoji: "♻️",
    audio: "/audio/game-eco-fix-it.wav",
    text:  "Eco fix it time! Find and fix the things that are bad for the environment. Every small action helps our planet stay healthy!",
  },
  "/banking-word-search": {
    emoji: "🏦",
    audio: "/audio/game-banking-word-search.wav",
    text:  "Word search time! Find the banking and finance words hidden in the grid. Learning about money helps you make smart choices!",
  },
  "/budgeting-game": {
    emoji: "💰",
    audio: "/audio/game-budgeting-game.wav",
    text:  "Let's budget! Sort items into needs and wants jars. Needs are things we must have. Wants are extra nice things. Can you fill the jars correctly?",
  },
  "/study-habits-game": {
    emoji: "📚",
    audio: "/audio/game-study-habits-game.wav",
    text:  "Study habits time! Sort the habits into good and bad study habits. Good study habits help you learn better and feel great!",
  },
  "/job-path-maze": {
    emoji: "🗺️",
    audio: "/audio/game-job-path-maze.wav",
    text:  "Find your path! Navigate through the maze to discover different job paths. There are so many amazing careers waiting for you!",
  },
  "/dream-job-builder": {
    emoji: "⭐",
    audio: "/audio/game-dream-job-builder.wav",
    text:  "Build your dream job! Mix and match skills and interests to discover what job could be perfect for you. Dream big!",
  },
  "/skills-jobs-sort": {
    emoji: "🔧",
    audio: "/audio/game-skills-jobs-sort.wav",
    text:  "Match skills to jobs! Drag each skill to the job that needs it most. Every job needs special skills — can you find the right matches?",
  },
  "/healthy-plate": {
    emoji: "🥗",
    audio: "/audio/game-healthy-plate.wav",
    text:  "Build a healthy plate! Drag foods onto your plate and fill each section correctly. A balanced plate gives you energy to play and learn!",
  },
  "/surya-namaskar": {
    emoji: "🌅",
    audio: "/audio/game-surya-namaskar.wav",
    text:  "Namaste! Let's do Surya Namaskar! Watch the animation to learn all twelve poses, then drag the cards into the right order. Sun salutations are great for your body and mind!",
  },
};
