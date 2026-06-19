export const WHES_SCHOOL_CODE = "WHES";

export const MAX_SCORE_BY_GAME_ID: Record<string, number> = {
  "banking-word-search": 50,
  "body-image-game": 100,
  "brain-health-game": 50,
  "budgeting-game": 10,
  "dream-job-builder": 5,
  "eco-fix-it-game": 200,
  "emotion-detective-game": 100,
  "fruit-vegetable-matching-game": 200,
  "healthy-plate": 100,
  "job-path-maze": 24,
  "least-sugar-game": 50,
  "principle-of-relationship-pair-matching-game": 60,
  "skills-jobs-sort": 80,
  "study-habits-game": 6,
  "surya-namaskar": 80,
  "water-glass-game": 40,
};

export interface GameFilterMetadata {
  course: string;
  module: string;
  label: string;
  order: number;
}

export const GAME_FILTER_METADATA: Record<string, GameFilterMetadata> = {
  "fruit-veggie-quiz": {
    course: "Know Your Health",
    module: "Module 1",
    label: "Fruit & Veggie Quiz",
    order: 1,
  },
  "fruit-vegetable-matching-game": {
    course: "Know Your Health",
    module: "Module 1",
    label: "Fruit & Vegetable Matching Game",
    order: 2,
  },
  "sometimes-anytime-food": {
    course: "Know Your Health",
    module: "Module 1",
    label: "Sometimes or Anytime?",
    order: 3,
  },
  "least-sugar-game": {
    course: "Know Your Health",
    module: "Module 2",
    label: "Added vs. Natural Sugar",
    order: 4,
  },
  "brain-health-game": {
    course: "Know Your Health",
    module: "Module 3",
    label: "Help Flame-man!",
    order: 5,
  },
  "water-glass-game": {
    course: "Know Your Health",
    module: "Module 4",
    label: "Fill the Glass!",
    order: 6,
  },
  "finish-race-game": {
    course: "Know Your Health",
    module: "Module 5",
    label: "Finish the Race!",
    order: 7,
  },
  "habit-guard-game": {
    course: "Know Your Health",
    module: "Module 6",
    label: "Guard Your Health!",
    order: 8,
  },
  "body-image-game": {
    course: "Know Your Health",
    module: "Module 7",
    label: "Positive or Negative?",
    order: 9,
  },
  "principle-of-relationship-pair-matching-game": {
    course: "3D Wellness",
    module: "Social Wellbeing",
    label: "Principle of Relationship",
    order: 20,
  },
  "challenge-quiz": {
    course: "3D Wellness",
    module: "Social Wellbeing",
    label: "Mental Health Challenge",
    order: 21,
  },
  "emotion-detective-game": {
    course: "3D Wellness",
    module: "Emotional Wellbeing",
    label: "Emotion Detective",
    order: 30,
  },
  "planet-protector-game": {
    course: "3D Wellness",
    module: "Environmental Wellbeing",
    label: "Planet Protector",
    order: 40,
  },
  "eco-fix-it-game": {
    course: "3D Wellness",
    module: "Environmental Wellbeing",
    label: "Eco Sort Challenge",
    order: 41,
  },
  "study-habits-game": {
    course: "3D Wellness",
    module: "Intellectual Wellbeing",
    label: "Study Habits Sort",
    order: 50,
  },
  "job-path-maze": {
    course: "3D Wellness",
    module: "Occupational Wellbeing",
    label: "Job Path Maze",
    order: 60,
  },
  "dream-job-builder": {
    course: "3D Wellness",
    module: "Occupational Wellbeing",
    label: "Dream Job Builder",
    order: 61,
  },
  "skills-jobs-sort": {
    course: "3D Wellness",
    module: "Occupational Wellbeing",
    label: "Skills & Jobs Sort",
    order: 62,
  },
  "healthy-plate": {
    course: "3D Wellness",
    module: "Physical Wellbeing",
    label: "Healthy Plate Builder",
    order: 70,
  },
  "surya-namaskar": {
    course: "3D Wellness",
    module: "Spiritual Wellbeing",
    label: "Surya Namaskar",
    order: 80,
  },
  "banking-word-search": {
    course: "Financial Literacy",
    module: "Module 2: Basics of Banking",
    label: "Banking Word Hunt",
    order: 90,
  },
  "budgeting-game": {
    course: "Financial Literacy",
    module: "Module 2: Basics of Banking",
    label: "Budgeting Jars",
    order: 91,
  },
};
