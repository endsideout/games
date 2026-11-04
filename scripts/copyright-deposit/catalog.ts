export interface SetGameCard {
  number: number;
  name: string;
  description: string;
  route: string;
  module?: string;
  dimension?: string;
}

export const SET1_GAMES: SetGameCard[] = [
  {
    number: 1,
    name: "Sometimes or Anytime?",
    description: "Drag each food to the right group — treat foods vs. foods you can eat anytime!",
    route: "/sometimes-anytime-food",
    module: "Module 1",
  },
  {
    number: 2,
    name: "Added vs. Natural Sugar",
    description: "Natural sugar or added sugar? Eat more or less? Answer different questions each round!",
    route: "/least-sugar-game",
    module: "Module 2",
  },
  {
    number: 3,
    name: "Help Flame-man!",
    description: "Help our superhero make smart choices for his brain health across 5 real-life scenarios!",
    route: "/brain-health-game",
    module: "Module 3",
  },
  {
    number: 4,
    name: "Fill the Glass!",
    description: "Answer questions about water and healthy drinks to fill up the glass — every correct answer adds water!",
    route: "/water-glass-game",
    module: "Module 4",
  },
  {
    number: 5,
    name: "Finish the Race!",
    description: "Answer questions about healthy habits and race to the finish line — every correct answer moves your runner closer!",
    route: "/finish-race-game",
    module: "Module 5",
  },
  {
    number: 6,
    name: "Guard Your Health!",
    description: "Let good habits fall on you and drag bad habits away — protect your body from disease!",
    route: "/habit-guard-game",
    module: "Module 6",
  },
  {
    number: 7,
    name: "Positive or Negative?",
    description: "Read body image statements and decide if each one is positive or negative — build a healthy self-image!",
    route: "/body-image-game",
    module: "Module 7",
  },
];

export const TDW_SET1_GAMES: SetGameCard[] = [
  {
    number: 1,
    name: "Principle of Relationship",
    description: "Match relationship principles and discover the building blocks of healthy connections!",
    route: "/principle-of-relationship-pair-matching-game",
    dimension: "Social Wellbeing",
  },
  {
    number: 2,
    name: "Emotional Detective",
    description: "Identify emotions in real-life scenarios and build emotional intelligence!",
    route: "/emotion-detective-game",
    dimension: "Emotional Wellbeing",
  },
  {
    number: 3,
    name: "Eco Sort Challenge",
    description: "Sort items into eco-friendly categories and protect the planet!",
    route: "/environmental-wellbeing/eco-fix-it",
    dimension: "Environmental Wellbeing",
  },
  {
    number: 4,
    name: "Budgeting Jars",
    description: "Learn smart money management by sorting coins into the right jars!",
    route: "/budgeting-game",
    dimension: "Financial Literacy",
  },
  {
    number: 5,
    name: "Study Habits Sort",
    description: "Sort good and bad study habits to build smarter learning routines!",
    route: "/study-habits-game",
    dimension: "Intellectual Wellbeing",
  },
  {
    number: 6,
    name: "Dream Job Builder",
    description: "Explore careers and build your dream job path step by step!",
    route: "/dream-job-builder",
    dimension: "Occupational Wellbeing",
  },
  {
    number: 7,
    name: "Healthy Plate Builder",
    description: "Build a balanced meal by placing foods in the right sections of the plate!",
    route: "/healthy-plate",
    dimension: "Physical Wellbeing",
  },
  {
    number: 8,
    name: "Surya Namaskar",
    description: "Follow the sun salutation sequence and find your inner calm!",
    route: "/surya-namaskar",
    dimension: "Spiritual Wellbeing",
  },
];
