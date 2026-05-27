// Auto-extracted content data — shared by ContentRegistry.tsx and generateContentRegistry.ts

export interface QARow {
  id: string;
  scenario?: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC?: string;
  optionD?: string;
  correct: string;
  feedback: string;
}

export interface ItemRow {
  id: string;
  item: string;
  category: string;
  notes?: string;
}

export interface VocabRow {
  id: string;
  word: string;
  definition: string;
}

export interface ScenarioRow {
  id: string;
  situation: string;
  options: string;
  correct: string;
}

export type ContentType = "qa" | "items" | "vocab" | "scenarios";

export interface Game {
  id: string;
  name: string;
  module: string;
  route: string;
  type: string;
  gradeLevel: string;
  duration: string;
  voiceover: string;
  contentType: ContentType;
  qa?: QARow[];
  items?: ItemRow[];
  vocab?: VocabRow[];
  scenarios?: ScenarioRow[];
}

// ─────────────────────────────────────────────────────────────────────────────
// GAME CONTENT
// ─────────────────────────────────────────────────────────────────────────────

export const GAMES: Game[] = [

  // ── Know Your Health ──────────────────────────────────────────────────────

  {
    id: "KYH-001",
    name: "Sometimes Anytime Food",
    module: "Know Your Health",
    route: "/sometimes-anytime-food",
    type: "Drag-and-drop classification",
    gradeLevel: "PreK to Grade 8",
    duration: "Open-ended",
    voiceover: "Hi friend! Sort the foods into anytime foods and sometimes foods! Anytime foods are healthy to eat every day. Sometimes foods are yummy treats for special occasions. Drag each food card to the right basket!",
    contentType: "items",
    items: [
      { id: "KYH-001-01", item: "Apple",       category: "Anytime Food",    notes: "Packed with fibre and vitamins. Helps focus in class." },
      { id: "KYH-001-02", item: "Banana",      category: "Anytime Food",    notes: "Great source of energy and potassium. Helps get better grades." },
      { id: "KYH-001-03", item: "Broccoli",    category: "Anytime Food",    notes: "Packed with vitamins and fibre. Boosts your immunity." },
      { id: "KYH-001-04", item: "Cookie",      category: "Sometimes Food",  notes: "High in added sugar. Enjoy occasionally. Too much sugar harms your teeth." },
      { id: "KYH-001-05", item: "Chocolate",   category: "Sometimes Food",  notes: "High in sugar and fat. A treat, not everyday. High sugar spikes your energy and crashes it." },
      { id: "KYH-001-06", item: "French Fries",category: "Sometimes Food",  notes: "High in fat and sodium. Save for special days. Too much fat is bad for your heart." },
    ],
  },

  {
    id: "KYH-002",
    name: "Added vs. Natural Sugar",
    module: "Know Your Health",
    route: "/least-sugar-game",
    type: "Binary choice comparison",
    gradeLevel: "Grade 3 to Grade 8",
    duration: "120 seconds",
    voiceover: "Hello! Find the food with the least sugar! Look carefully at each food and pick the one with the lowest sugar. Ready? Let us go!",
    contentType: "qa",
    qa: [
      {
        id: "KYH-002-Q1",
        question: "Which one has NATURAL sugar?",
        optionA: "Donut — made with added sugar and syrup",
        optionB: "Orange — natural sugar from fruit",
        correct: "Orange",
        feedback: "Oranges have natural sugar that comes packaged with vitamins and fibre.",
      },
      {
        id: "KYH-002-Q2",
        question: "Which has ADDED sugar?",
        optionA: "Cookies — packed with added sugar and fat",
        optionB: "Cherries — only natural fruit sugars",
        correct: "Cookies",
        feedback: "Cookies are loaded with added sugar put in during manufacturing.",
      },
      {
        id: "KYH-002-Q3",
        question: "Which should you eat MORE of?",
        optionA: "Grapes — natural sugars and antioxidants",
        optionB: "Candy — pure added sugar, no nutrients",
        correct: "Grapes",
        feedback: "Grapes have natural sugar alongside antioxidants, making them a great everyday choice.",
      },
      {
        id: "KYH-002-Q4",
        question: "Which should you eat LESS of?",
        optionA: "Cereal — often has lots of added sugar",
        optionB: "Oatmeal — barely any sugar, full of fibre",
        correct: "Cereal",
        feedback: "Most breakfast cereals are high in added sugar. Oatmeal is the healthier swap.",
      },
      {
        id: "KYH-002-Q5",
        question: "Which has NATURAL sugar?",
        optionA: "Watermelon — natural fruit sugar and lots of water",
        optionB: "Ice Cream — high in added sugar and fat",
        correct: "Watermelon",
        feedback: "Watermelon is 92% water with natural sugar, making it super refreshing and nutritious.",
      },
    ],
  },

  {
    id: "KYH-003",
    name: "Brain Health Game",
    module: "Know Your Health",
    route: "/brain-health-game",
    type: "Scenario-based binary choice",
    gradeLevel: "Grade 3 to Grade 8",
    duration: "Open-ended",
    voiceover: "Hey there! It is brain health time! Read each situation and pick the best choice for your brain. Listen to the explanation after each answer. You have got this!",
    contentType: "qa",
    qa: [
      {
        id: "KYH-003-Q1",
        scenario: "Flame-man has been feeling stressed all day.",
        question: "What should he do to feel better?",
        optionA: "Get Active — go for a run or shoot hoops",
        optionB: "Scroll Phone — sit and scroll social media",
        correct: "Get Active",
        feedback: "Exercise releases feel-good chemicals in the brain that melt away stress.",
      },
      {
        id: "KYH-003-Q2",
        scenario: "Flame-man needs a snack to help his brain function.",
        question: "Which should he choose?",
        optionA: "Cupcake — loaded with sugar and frosting",
        optionB: "Apple — natural sugar with vitamins",
        correct: "Apple",
        feedback: "Apples fuel the brain with natural sugars and vitamins, with no sugar crash afterward.",
      },
      {
        id: "KYH-003-Q3",
        scenario: "Flame-man is feeling lonely and sad.",
        question: "What would help his brain health most?",
        optionA: "Talk to a Friend — share his feelings with someone",
        optionB: "Stay Alone — lock himself in his room",
        correct: "Talk to a Friend",
        feedback: "Social connection boosts brain chemicals that lift your mood. Even superheroes need friends.",
      },
      {
        id: "KYH-003-Q4",
        scenario: "Flame-man stayed up until 2 AM playing video games.",
        question: "How will this affect his brain the next day?",
        optionA: "Sharp and focused — ready to learn",
        optionB: "Foggy and slow — hard to concentrate",
        correct: "Foggy and slow",
        feedback: "Sleep is when the brain consolidates memories and repairs itself. Without it, focus and learning both suffer.",
      },
      {
        id: "KYH-003-Q5",
        scenario: "Flame-man wants to boost his brain before a big test.",
        question: "What is the best thing to do the night before?",
        optionA: "Sleep well — get a full night of rest",
        optionB: "Stay up studying — cram as much as possible",
        correct: "Sleep well",
        feedback: "A full night of sleep helps your brain lock in what you studied far better than last-minute cramming.",
      },
    ],
  },

  {
    id: "KYH-004",
    name: "Water Glass Game",
    module: "Know Your Health",
    route: "/water-glass-game",
    type: "Multiple-choice trivia",
    gradeLevel: "PreK to Grade 8",
    duration: "120 seconds",
    voiceover: "Hi! Let us drink water! Answer the questions to fill up your daily water goal. Drinking water every day keeps you healthy and strong!",
    contentType: "qa",
    qa: [
      {
        id: "KYH-004-Q1",
        question: "Which drink is a sometimes drink?",
        optionA: "Soda",
        optionB: "Water",
        correct: "Soda",
        feedback: "Soda has lots of added sugar, so it is a sometimes drink. Water is an anytime drink.",
      },
      {
        id: "KYH-004-Q2",
        question: "How many cups of water should we drink each day?",
        optionA: "8 glasses",
        optionB: "1 glass",
        optionC: "4 glasses",
        correct: "8 glasses",
        feedback: "We should drink 8 cups of water every day to stay healthy and hydrated.",
      },
      {
        id: "KYH-004-Q3",
        question: "Which drink is the healthiest?",
        optionA: "Sports Drink",
        optionB: "Water",
        optionC: "Milkshake",
        correct: "Water",
        feedback: "Water is the healthiest drink — zero sugar, zero calories, and your body loves it.",
      },
      {
        id: "KYH-004-Q4",
        question: "Which drink helps plants grow?",
        optionA: "Milk",
        optionB: "Water",
        correct: "Water",
        feedback: "Plants need water to grow and survive — just like us.",
      },
    ],
  },

  {
    id: "KYH-005",
    name: "Finish Race Game",
    module: "Know Your Health",
    route: "/finish-race-game",
    type: "Multiple-choice trivia with race mechanic",
    gradeLevel: "Grade 3 to Grade 8",
    duration: "120 seconds",
    voiceover: "Ready, set, go! Answer the health questions correctly to run faster and win the race. The faster you answer, the faster you run!",
    contentType: "qa",
    qa: [
      {
        id: "KYH-005-Q1",
        question: "How many minutes a day should we be active?",
        optionA: "20 minutes",
        optionB: "30 minutes",
        optionC: "60 minutes",
        correct: "60 minutes",
        feedback: "We should be active for at least 60 minutes every day to keep our body strong and healthy.",
      },
      {
        id: "KYH-005-Q2",
        question: "True or false: Screen time is healthier than moving your body.",
        optionA: "True",
        optionB: "False",
        correct: "False",
        feedback: "Moving your body is always healthier than screen time. Exercise keeps your body and brain strong.",
      },
      {
        id: "KYH-005-Q3",
        question: "What is a way we can stay active?",
        optionA: "Playing soccer",
        optionB: "Running outside",
        optionC: "Playing basketball",
        optionD: "All of the above",
        correct: "All of the above",
        feedback: "Soccer, running, and basketball are all great ways to stay active every day.",
      },
      {
        id: "KYH-005-Q4",
        question: "What happens when we exercise more?",
        optionA: "Less energy",
        optionB: "Less focused in school",
        optionC: "Better grades in school",
        correct: "Better grades in school",
        feedback: "Exercise helps your brain focus better and gives you more energy, leading to better performance in school.",
      },
      {
        id: "KYH-005-Q5",
        question: "Which is a muscle strengthening exercise?",
        optionA: "Walking",
        optionB: "Swimming",
        optionC: "Push ups",
        correct: "Push ups",
        feedback: "Push ups are a great muscle strengthening exercise that builds strong arms and chest.",
      },
    ],
  },

  {
    id: "KYH-006",
    name: "Habit Guard Game",
    module: "Know Your Health",
    route: "/habit-guard-game",
    type: "Drag-and-drop habit classification",
    gradeLevel: "PreK to Grade 8",
    duration: "60 seconds",
    voiceover: "Hey hero! Drag the good habits to your character to protect them! Bad habits will try to sneak in — drag them away! Keep your character safe and healthy!",
    contentType: "items",
    items: [
      { id: "KYH-006-01", item: "Staying Active",      category: "Good Habit", notes: "Regular movement keeps the body and mind healthy." },
      { id: "KYH-006-02", item: "Sleep Well",          category: "Good Habit", notes: "Quality sleep restores energy and supports brain function." },
      { id: "KYH-006-03", item: "Drinking Water",      category: "Good Habit", notes: "Staying hydrated supports every system in the body." },
      { id: "KYH-006-04", item: "Wash Hands",          category: "Good Habit", notes: "Prevents the spread of germs and illness." },
      { id: "KYH-006-05", item: "Anytime Foods",       category: "Good Habit", notes: "Eating nutritious food fuels the body and brain." },
      { id: "KYH-006-06", item: "Exercise Daily",      category: "Good Habit", notes: "At least 60 minutes of physical activity each day." },
      { id: "KYH-006-07", item: "Clean and Disinfect", category: "Good Habit", notes: "Keeping surfaces clean reduces risk of infection." },
      { id: "KYH-006-08", item: "Not Enough Sleep",    category: "Bad Habit",  notes: "Sleep deprivation weakens focus and immune function." },
      { id: "KYH-006-09", item: "Too Much Sugar",      category: "Bad Habit",  notes: "Excess sugar leads to energy crashes and poor dental health." },
      { id: "KYH-006-10", item: "Junk Food",           category: "Bad Habit",  notes: "Low nutritional value; contributes to poor health over time." },
    ],
  },

  {
    id: "KYH-007",
    name: "Body Image Game",
    module: "Know Your Health",
    route: "/body-image-game",
    type: "Positive or negative body image classification",
    gradeLevel: "Grade 3 to Grade 8",
    duration: "Open-ended",
    voiceover: "Hi! Let us talk about body image! Read each statement and decide if it shows a positive or negative body image. Every body is amazing!",
    contentType: "qa",
    qa: [
      {
        id: "KYH-007-Q1",
        question: "My appearance does not say anything about my character and values.",
        optionA: "Positive Body Image",
        optionB: "Negative Body Image",
        correct: "Positive Body Image",
        feedback: "Your kindness, creativity, and values define who you are — not how you look. That is positive body image.",
      },
      {
        id: "KYH-007-Q2",
        question: "I celebrate and appreciate my body.",
        optionA: "Positive Body Image",
        optionB: "Negative Body Image",
        correct: "Positive Body Image",
        feedback: "Appreciating what your body can do and celebrating it is a beautiful sign of positive body image.",
      },
      {
        id: "KYH-007-Q3",
        question: "I am always thinking about food, exercise, and body size.",
        optionA: "Positive Body Image",
        optionB: "Negative Body Image",
        correct: "Negative Body Image",
        feedback: "Constantly obsessing over food, exercise, and body size can be harmful and reflects a negative body image.",
      },
      {
        id: "KYH-007-Q4",
        question: "I compare myself to others.",
        optionA: "Positive Body Image",
        optionB: "Negative Body Image",
        correct: "Negative Body Image",
        feedback: "Comparing yourself to others hurts your self-esteem. Everyone is unique and worthy just as they are.",
      },
      {
        id: "KYH-007-Q5",
        question: "I feel comfortable in my body.",
        optionA: "Positive Body Image",
        optionB: "Negative Body Image",
        correct: "Positive Body Image",
        feedback: "Feeling comfortable in your body is a sign of positive body image. It means you accept and appreciate yourself just as you are.",
      },
    ],
  },

  // ── Social Wellbeing ──────────────────────────────────────────────────────

  {
    id: "3DW-SOC-001",
    name: "Fruit and Vegetable Quiz",
    module: "Social Wellbeing",
    route: "/fruit-veggie-quiz",
    type: "Multiple-choice classification quiz",
    gradeLevel: "PreK to Grade 8",
    duration: "Open-ended",
    voiceover: "Quiz time! Answer questions about fruits and vegetables. Each correct answer helps your plant grow bigger. How tall can you make it?",
    contentType: "qa",
    qa: [
      { id: "3DW-SOC-001-Q1", question: "Apple is a...",              optionA: "Fruit", optionB: "Vegetable", correct: "Fruit",     feedback: "Apples grow on trees and contain seeds, making them a fruit." },
      { id: "3DW-SOC-001-Q2", question: "Tomato is botanically a...", optionA: "Fruit", optionB: "Vegetable", correct: "Fruit",     feedback: "Although used as a vegetable in cooking, tomatoes are botanically a fruit because they contain seeds." },
      { id: "3DW-SOC-001-Q3", question: "Broccoli is a...",           optionA: "Fruit", optionB: "Vegetable", correct: "Vegetable", feedback: "Broccoli is the edible flower of a plant, making it a vegetable." },
      { id: "3DW-SOC-001-Q4", question: "Strawberry is a...",         optionA: "Fruit", optionB: "Vegetable", correct: "Fruit",     feedback: "Strawberries are fruits that grow close to the ground on small plants." },
      { id: "3DW-SOC-001-Q5", question: "Carrot is a...",             optionA: "Fruit", optionB: "Vegetable", correct: "Vegetable", feedback: "Carrots are root vegetables that grow underground." },
      { id: "3DW-SOC-001-Q6", question: "Cucumber is botanically a...", optionA: "Fruit", optionB: "Vegetable", correct: "Fruit",  feedback: "Cucumbers contain seeds and develop from a flower, making them a botanical fruit." },
    ],
  },

  {
    id: "3DW-SOC-002",
    name: "Mental Health Challenge Quiz",
    module: "Social Wellbeing",
    route: "/challenge-quiz",
    type: "Multiple-choice emotional intelligence quiz",
    gradeLevel: "Grade 3 to Grade 8",
    duration: "Open-ended",
    voiceover: "Mental health challenge! Answer questions about emotions and feelings. Each correct answer builds your emotional intelligence. You are a superstar!",
    contentType: "qa",
    qa: [
      {
        id: "3DW-SOC-002-Q1",
        question: "When you feel overwhelmed, what is the first step in the Mood Meter process?",
        optionA: "Take deep breaths",
        optionB: "Recognize what you are feeling",
        optionC: "Ask for help immediately",
        optionD: "Ignore the feeling",
        correct: "Recognize what you are feeling",
        feedback: "Recognition is the first step. You need to identify and name your emotions before you can work with them effectively.",
      },
      {
        id: "3DW-SOC-002-Q2",
        question: "What does it mean to perspective-take?",
        optionA: "Only think about your own feelings",
        optionB: "Try to see things from another person's point of view",
        optionC: "Ignore how others feel",
        optionD: "Always agree with others",
        correct: "Try to see things from another person's point of view",
        feedback: "Perspective-taking is a key empathy skill. It helps you understand others and build stronger relationships.",
      },
      {
        id: "3DW-SOC-002-Q3",
        question: "Why are boundaries important for relationships?",
        optionA: "They keep people away from you",
        optionB: "They help maintain respect and prevent burnout",
        optionC: "They mean you do not care about others",
        optionD: "They make relationships less fun",
        correct: "They help maintain respect and prevent burnout",
        feedback: "Healthy boundaries allow people to show up for each other without losing themselves in the process.",
      },
      {
        id: "3DW-SOC-002-Q4",
        question: "Which is a healthy way to ask for help?",
        optionA: "Pretend everything is fine",
        optionB: "Clearly express what you need to a trusted person",
        optionC: "Wait until things get worse",
        optionD: "Blame others for your problems",
        correct: "Clearly express what you need to a trusted person",
        feedback: "Asking for help clearly and calmly is a sign of strength and self-awareness.",
      },
      {
        id: "3DW-SOC-002-Q5",
        question: "What is the best way to respond when a friend is upset?",
        optionA: "Tell them to stop being dramatic",
        optionB: "Listen without judgment and offer support",
        optionC: "Change the subject quickly",
        optionD: "Walk away",
        correct: "Listen without judgment and offer support",
        feedback: "Listening without judgment makes the other person feel heard and valued, which is the foundation of emotional support.",
      },
    ],
  },

  // ── Emotional Wellbeing ───────────────────────────────────────────────────

  {
    id: "3DW-EMO-001",
    name: "Emotion Detective Game",
    module: "Emotional Wellbeing",
    route: "/emotion-detective-game",
    type: "Scenario-based emotion identification",
    gradeLevel: "PreK to Grade 8",
    duration: "Open-ended",
    voiceover: "Be an emotion detective! Look at each face and figure out how they are feeling. Understanding emotions helps us be better friends!",
    contentType: "scenarios",
    scenarios: [
      { id: "3DW-EMO-001-S1", situation: "Maya's bike was stolen from the school playground.",         options: "Happy, Sad, Angry, Scared",    correct: "Angry" },
      { id: "3DW-EMO-001-S2", situation: "John's brother ate his piece of birthday cake.",              options: "Happy, Sad, Angry, Surprised", correct: "Angry" },
      { id: "3DW-EMO-001-S3", situation: "Sarah is watching a scary movie alone at night.",            options: "Happy, Scared, Angry, Bored",  correct: "Scared" },
      { id: "3DW-EMO-001-S4", situation: "Tom got a puppy for his birthday.",                          options: "Happy, Sad, Angry, Scared",    correct: "Happy" },
      { id: "3DW-EMO-001-S5", situation: "Lisa's best friend is moving to another city.",              options: "Happy, Sad, Angry, Surprised", correct: "Sad" },
      { id: "3DW-EMO-001-S6", situation: "Alex won first place in the school race.",                   options: "Happy, Proud, Sad, Scared",    correct: "Happy or Proud" },
      { id: "3DW-EMO-001-S7", situation: "Emma lost her favorite toy at the park.",                    options: "Happy, Sad, Angry, Confused",  correct: "Sad" },
      { id: "3DW-EMO-001-S8", situation: "Ben heard a loud noise outside his window at night.",        options: "Happy, Scared, Angry, Sleepy", correct: "Scared" },
      { id: "3DW-EMO-001-S9", situation: "Nina's team lost the final game of the season.",             options: "Happy, Sad, Frustrated, Scared", correct: "Frustrated" },
      { id: "3DW-EMO-001-S10", situation: "David's friend shared their lunch with him when he forgot his.", options: "Happy, Grateful, Sad, Angry", correct: "Happy or Grateful" },
    ],
  },

  // ── Environmental Wellbeing ───────────────────────────────────────────────

  {
    id: "3DW-ENV-001",
    name: "Planet Protector Game",
    module: "Environmental Wellbeing",
    route: "/environmental-wellbeing/planet-protector",
    type: "Drag-and-drop environmental action classification",
    gradeLevel: "Grade 3 to Grade 8",
    duration: "60 seconds",
    voiceover: "Save the planet! Sort the items into good and bad actions for the environment. Taking care of our Earth keeps it beautiful for everyone!",
    contentType: "items",
    items: [
      { id: "3DW-ENV-001-01", item: "Plant trees",                     category: "Good for the Environment", notes: "Trees absorb carbon dioxide and produce oxygen." },
      { id: "3DW-ENV-001-02", item: "Turning off lights",              category: "Good for the Environment", notes: "Conserves electricity and reduces energy waste." },
      { id: "3DW-ENV-001-03", item: "Biking or walking",               category: "Good for the Environment", notes: "Reduces carbon emissions from vehicle travel." },
      { id: "3DW-ENV-001-04", item: "Saving water",                    category: "Good for the Environment", notes: "Preserves a vital natural resource." },
      { id: "3DW-ENV-001-05", item: "Picking up trash",                category: "Good for the Environment", notes: "Keeps ecosystems clean and protects wildlife." },
      { id: "3DW-ENV-001-06", item: "Leaving lights on",               category: "Bad for the Environment",  notes: "Wastes electricity and increases carbon footprint." },
      { id: "3DW-ENV-001-07", item: "Driving cars unnecessarily",      category: "Bad for the Environment",  notes: "Increases greenhouse gas emissions." },
      { id: "3DW-ENV-001-08", item: "Throwing trash on the ground",    category: "Bad for the Environment",  notes: "Pollutes soil and water and harms wildlife." },
      { id: "3DW-ENV-001-09", item: "Wasting water",                   category: "Bad for the Environment",  notes: "Depletes a scarce natural resource." },
      { id: "3DW-ENV-001-10", item: "Pollution and smoke",             category: "Bad for the Environment",  notes: "Contributes to air quality deterioration and climate change." },
    ],
  },

  // ── Financial Literacy ────────────────────────────────────────────────────

  {
    id: "3DW-FIN-001",
    name: "Banking Word Search",
    module: "Financial Literacy",
    route: "/banking-word-search",
    type: "Vocabulary word search with definitions",
    gradeLevel: "Grade 3 to Grade 8",
    duration: "120 seconds",
    voiceover: "Word search time! Find the banking and finance words hidden in the grid. Learning about money helps you make smart choices!",
    contentType: "vocab",
    vocab: [
      { id: "3DW-FIN-001-V01", word: "BANK",    definition: "A safe place to keep your money." },
      { id: "3DW-FIN-001-V02", word: "SAVE",    definition: "To keep money for later." },
      { id: "3DW-FIN-001-V03", word: "CASH",    definition: "Paper money and coins." },
      { id: "3DW-FIN-001-V04", word: "LOAN",    definition: "Money borrowed that must be repaid." },
      { id: "3DW-FIN-001-V05", word: "FEES",    definition: "Charges for using some services." },
      { id: "3DW-FIN-001-V06", word: "SAFE",    definition: "A secure place for valuables." },
      { id: "3DW-FIN-001-V07", word: "COIN",    definition: "Small round metal money." },
      { id: "3DW-FIN-001-V08", word: "CREDIT",  definition: "Borrowing money to pay back later." },
      { id: "3DW-FIN-001-V09", word: "TRUST",   definition: "Believing the bank keeps money safe." },
      { id: "3DW-FIN-001-V10", word: "MONEY",   definition: "What we use to buy things." },
      { id: "3DW-FIN-001-V11", word: "DEPOSIT", definition: "Put money into your account." },
      { id: "3DW-FIN-001-V12", word: "BALANCE", definition: "How much money you have in your account." },
      { id: "3DW-FIN-001-V13", word: "SAVINGS", definition: "An account designed to grow your money over time." },
    ],
  },

  {
    id: "3DW-FIN-002",
    name: "Budgeting Game",
    module: "Financial Literacy",
    route: "/budgeting-game",
    type: "Drag-and-drop needs vs. wants classification",
    gradeLevel: "Grade 3 to Grade 8",
    duration: "120 seconds",
    voiceover: "Let us budget! Sort items into needs and wants jars. Needs are things we must have. Wants are extra nice things. Can you fill the jars correctly?",
    contentType: "items",
    items: [
      { id: "3DW-FIN-002-01", item: "Food",        category: "Need",  notes: "Essential for survival. Example cost: $20." },
      { id: "3DW-FIN-002-02", item: "Water",       category: "Need",  notes: "Essential for survival. Example cost: $5." },
      { id: "3DW-FIN-002-03", item: "Rent",        category: "Need",  notes: "Shelter is a basic human need. Example cost: $800." },
      { id: "3DW-FIN-002-04", item: "Clothing",    category: "Need",  notes: "Basic clothing is a necessity. Example cost: $50." },
      { id: "3DW-FIN-002-05", item: "Medicine",    category: "Need",  notes: "Healthcare is essential. Example cost: $30." },
      { id: "3DW-FIN-002-06", item: "Video Games", category: "Want",  notes: "Entertainment is a want, not a necessity. Example cost: $60." },
      { id: "3DW-FIN-002-07", item: "Candy",       category: "Want",  notes: "Treats are wants. Example cost: $3." },
      { id: "3DW-FIN-002-08", item: "New Phone",   category: "Want",  notes: "An upgrade beyond basic communication is a want. Example cost: $200." },
      { id: "3DW-FIN-002-09", item: "Vacation",    category: "Want",  notes: "Travel for leisure is a want. Example cost: $500." },
      { id: "3DW-FIN-002-10", item: "Jewelry",     category: "Want",  notes: "Decorative accessories are wants. Example cost: $150." },
    ],
  },

  // ── Intellectual Wellbeing ────────────────────────────────────────────────

  {
    id: "3DW-INT-001",
    name: "Study Habits Game",
    module: "Intellectual Wellbeing",
    route: "/study-habits-game",
    type: "Drag-and-drop habit classification",
    gradeLevel: "Grade 3 to Grade 8",
    duration: "90 seconds",
    voiceover: "Study habits time! Sort the habits into good and bad study habits. Good study habits help you learn better and feel great!",
    contentType: "items",
    items: [
      { id: "3DW-INT-001-01", item: "Set a study schedule",          category: "Good Study Habit" },
      { id: "3DW-INT-001-02", item: "Keep a clean desk",             category: "Good Study Habit" },
      { id: "3DW-INT-001-03", item: "Drink water while studying",    category: "Good Study Habit" },
      { id: "3DW-INT-001-04", item: "Take short breaks",             category: "Good Study Habit" },
      { id: "3DW-INT-001-05", item: "Write notes by hand",           category: "Good Study Habit" },
      { id: "3DW-INT-001-06", item: "Study in bright light",         category: "Good Study Habit" },
      { id: "3DW-INT-001-07", item: "Get 8 hours of sleep",          category: "Good Study Habit" },
      { id: "3DW-INT-001-08", item: "Study in a quiet room",         category: "Good Study Habit" },
      { id: "3DW-INT-001-09", item: "Use flashcards to review",      category: "Good Study Habit" },
      { id: "3DW-INT-001-10", item: "Turn off notifications",        category: "Good Study Habit" },
      { id: "3DW-INT-001-11", item: "Review notes after class",      category: "Good Study Habit" },
      { id: "3DW-INT-001-12", item: "Set a study timer",             category: "Good Study Habit" },
      { id: "3DW-INT-001-13", item: "Watch TV while studying",       category: "Bad Study Habit" },
      { id: "3DW-INT-001-14", item: "Use phone while studying",      category: "Bad Study Habit" },
      { id: "3DW-INT-001-15", item: "Study with a messy desk",       category: "Bad Study Habit" },
      { id: "3DW-INT-001-16", item: "Stay up all night",             category: "Bad Study Habit" },
      { id: "3DW-INT-001-17", item: "Skip all breaks",               category: "Bad Study Habit" },
      { id: "3DW-INT-001-18", item: "Study in the dark",             category: "Bad Study Habit" },
      { id: "3DW-INT-001-19", item: "Eat junk food while studying",  category: "Bad Study Habit" },
      { id: "3DW-INT-001-20", item: "Chat with friends instead",     category: "Bad Study Habit" },
      { id: "3DW-INT-001-21", item: "Leave things to last minute",   category: "Bad Study Habit" },
      { id: "3DW-INT-001-22", item: "Listen to loud music",          category: "Bad Study Habit" },
      { id: "3DW-INT-001-23", item: "Jump between subjects",         category: "Bad Study Habit" },
      { id: "3DW-INT-001-24", item: "Skip reviewing homework",       category: "Bad Study Habit" },
    ],
  },

  // ── Occupational Wellbeing ────────────────────────────────────────────────

  {
    id: "3DW-OCC-001",
    name: "Job Path Maze",
    module: "Occupational Wellbeing",
    route: "/job-path-maze",
    type: "Quiz-based maze navigation with career checkpoints",
    gradeLevel: "Grade 6 to Grade 8",
    duration: "60 seconds per career (3 careers per session)",
    voiceover: "Find your path! Navigate through the maze to discover different job paths. Answer the questions at each checkpoint to keep moving. There are so many amazing careers waiting for you!",
    contentType: "qa",
    qa: [
      // Doctor
      { id: "3DW-OCC-001-Q01", scenario: "Career: Doctor", question: "Which subject helps a doctor the most?", optionA: "Art", optionB: "Science", optionC: "Music", correct: "Science", feedback: "Science helps doctors understand how the body works!" },
      { id: "3DW-OCC-001-Q02", scenario: "Career: Doctor", question: "A patient is scared. What should a doctor do?", optionA: "Ignore them", optionB: "Speak kindly and explain", optionC: "Walk away", correct: "Speak kindly and explain", feedback: "Doctors need empathy to help patients feel safe." },
      { id: "3DW-OCC-001-Q03", scenario: "Career: Doctor", question: "What does a doctor use to listen to your heartbeat?", optionA: "Telescope", optionB: "Stethoscope", optionC: "Ruler", correct: "Stethoscope", feedback: "A stethoscope amplifies sounds inside your body!" },
      { id: "3DW-OCC-001-Q04", scenario: "Career: Doctor", question: "Which skill makes a great doctor?", optionA: "Swimming", optionB: "Caring for others", optionC: "Singing", correct: "Caring for others", feedback: "Caring for people is the heart of being a doctor." },
      // Chef
      { id: "3DW-OCC-001-Q05", scenario: "Career: Chef", question: "What does a chef need most?", optionA: "Drawing", optionB: "Cooking skills", optionC: "Fixing engines", correct: "Cooking skills", feedback: "Cooking skills are the foundation of being a great chef!" },
      { id: "3DW-OCC-001-Q06", scenario: "Career: Chef", question: "A dish tastes too salty. What do you do?", optionA: "Add more salt", optionB: "Taste and adjust", optionC: "Throw it away", correct: "Taste and adjust", feedback: "Good chefs taste and adjust to make food just right." },
      { id: "3DW-OCC-001-Q07", scenario: "Career: Chef", question: "Which skill makes a great chef?", optionA: "Creativity", optionB: "Swimming", optionC: "Video gaming", correct: "Creativity", feedback: "Creativity helps chefs invent new and delicious recipes!" },
      { id: "3DW-OCC-001-Q08", scenario: "Career: Chef", question: "Where does a chef mostly work?", optionA: "Hospital", optionB: "Kitchen", optionC: "Playground", correct: "Kitchen", feedback: "The kitchen is a chef's workplace and creative space!" },
      // Teacher
      { id: "3DW-OCC-001-Q09", scenario: "Career: Teacher", question: "What is the most important skill for a teacher?", optionA: "Patience", optionB: "Running fast", optionC: "Cooking", correct: "Patience", feedback: "Patience helps teachers support every student's learning pace." },
      { id: "3DW-OCC-001-Q10", scenario: "Career: Teacher", question: "A student does not understand. What should a teacher do?", optionA: "Move on quickly", optionB: "Explain it differently", optionC: "Give them less work", correct: "Explain it differently", feedback: "Great teachers find new ways to explain until everyone gets it!" },
      { id: "3DW-OCC-001-Q11", scenario: "Career: Teacher", question: "Which tool does a teacher use most?", optionA: "Hammer", optionB: "Books and lessons", optionC: "Car", correct: "Books and lessons", feedback: "Books and lessons are a teacher's main tools for sharing knowledge." },
      { id: "3DW-OCC-001-Q12", scenario: "Career: Teacher", question: "Where does a teacher work?", optionA: "Farm", optionB: "Classroom", optionC: "Ocean", correct: "Classroom", feedback: "Classrooms are where teachers inspire the next generation!" },
      // Engineer
      { id: "3DW-OCC-001-Q13", scenario: "Career: Engineer", question: "Which subject is most useful for an engineer?", optionA: "Drama", optionB: "Math and Science", optionC: "Painting", correct: "Math and Science", feedback: "Math and science are the building blocks of engineering!" },
      { id: "3DW-OCC-001-Q14", scenario: "Career: Engineer", question: "A bridge design has a problem. What does an engineer do?", optionA: "Give up", optionB: "Solve and redesign", optionC: "Ignore it", correct: "Solve and redesign", feedback: "Engineers are problem solvers — they keep improving until it is right." },
      { id: "3DW-OCC-001-Q15", scenario: "Career: Engineer", question: "What skill helps engineers most?", optionA: "Dancing", optionB: "Critical thinking", optionC: "Cooking", correct: "Critical thinking", feedback: "Critical thinking helps engineers find the best solutions." },
      { id: "3DW-OCC-001-Q16", scenario: "Career: Engineer", question: "Which tool do engineers often use?", optionA: "Computer and blueprints", optionB: "Guitar", optionC: "Flowers", correct: "Computer and blueprints", feedback: "Computers and blueprints help engineers design and plan structures." },
      // Artist
      { id: "3DW-OCC-001-Q17", scenario: "Career: Artist", question: "What does an artist need most?", optionA: "Creativity", optionB: "Strength", optionC: "Speed", correct: "Creativity", feedback: "Creativity is the fuel that powers all great artwork!" },
      { id: "3DW-OCC-001-Q18", scenario: "Career: Artist", question: "An artwork does not look right. What should an artist do?", optionA: "Quit", optionB: "Keep practising and improving", optionC: "Copy someone else", correct: "Keep practising and improving", feedback: "Great artists grow by practising and learning from mistakes." },
      { id: "3DW-OCC-001-Q19", scenario: "Career: Artist", question: "Which skill helps an artist succeed?", optionA: "Attention to detail", optionB: "Loud voice", optionC: "Cooking", correct: "Attention to detail", feedback: "Noticing small details helps artists create beautiful, precise work." },
      { id: "3DW-OCC-001-Q20", scenario: "Career: Artist", question: "Where can an artist show their work?", optionA: "Hospital only", optionB: "Gallery, internet, anywhere", optionC: "Only at the beach", correct: "Gallery, internet, anywhere", feedback: "Artists can share their work with the whole world!" },
      // Pilot
      { id: "3DW-OCC-001-Q21", scenario: "Career: Pilot", question: "Which skill is most important for a pilot?", optionA: "Staying calm under pressure", optionB: "Singing", optionC: "Drawing", correct: "Staying calm under pressure", feedback: "Staying calm helps pilots make safe decisions in any situation." },
      { id: "3DW-OCC-001-Q22", scenario: "Career: Pilot", question: "There is bad weather ahead. What should a pilot do?", optionA: "Fly through it fast", optionB: "Check instruments and take a safe route", optionC: "Land immediately anywhere", correct: "Check instruments and take a safe route", feedback: "Pilots use instruments and training to navigate safely." },
      { id: "3DW-OCC-001-Q23", scenario: "Career: Pilot", question: "What does a pilot use to navigate?", optionA: "Paper map only", optionB: "Instruments and GPS", optionC: "Magic", correct: "Instruments and GPS", feedback: "Modern pilots use advanced instruments and GPS to fly safely." },
      { id: "3DW-OCC-001-Q24", scenario: "Career: Pilot", question: "Which subject helps a future pilot?", optionA: "Math and physics", optionB: "Cooking", optionC: "Poetry", correct: "Math and physics", feedback: "Math and physics help pilots understand speed, altitude, and navigation." },
    ],
    items: [
      { id: "3DW-OCC-001-CF1", item: "Doctors can work in hospitals, clinics, or even on rescue helicopters!", category: "Doctor — Career Fact" },
      { id: "3DW-OCC-001-CF2", item: "Chefs can work in restaurants, hotels, cruise ships, or even the White House!", category: "Chef — Career Fact" },
      { id: "3DW-OCC-001-CF3", item: "Teachers shape the future — every doctor, engineer, and artist once had a great teacher!", category: "Teacher — Career Fact" },
      { id: "3DW-OCC-001-CF4", item: "Engineers built bridges, rockets, smartphones, and the internet — they solve the world's problems!", category: "Engineer — Career Fact" },
      { id: "3DW-OCC-001-CF5", item: "Artists work in movies, video games, fashion, architecture, advertising — art is everywhere!", category: "Artist — Career Fact" },
      { id: "3DW-OCC-001-CF6", item: "Pilots can fly to over 100 different countries and see the world from above the clouds!", category: "Pilot — Career Fact" },
    ],
  },

  {
    id: "3DW-OCC-002",
    name: "Dream Job Builder",
    module: "Occupational Wellbeing",
    route: "/dream-job-builder",
    type: "Personality quiz with trait-based career matching",
    gradeLevel: "Grade 6 to Grade 8",
    duration: "Open-ended",
    voiceover: "Build your dream job! Answer five questions about yourself and discover which career could be perfect for you. Every answer reveals a little more about who you are. Dream big!",
    contentType: "qa",
    qa: [
      { id: "3DW-OCC-002-Q1", question: "What do you love doing most after school?", optionA: "Reading and learning new things", optionB: "Making and creating things", optionC: "Helping and caring for others", correct: "Depends on personality traits", feedback: "Option A builds analytical traits. Option B builds creative traits. Option C builds caring traits." },
      { id: "3DW-OCC-002-Q2", question: "Where would you love to work?", optionA: "Outdoors, moving around", optionB: "In a cozy office or lab", optionC: "Travelling and meeting people", correct: "Depends on personality traits", feedback: "Option A builds physical traits. Option B builds analytical traits. Option C builds social traits." },
      { id: "3DW-OCC-002-Q3", question: "Which activity sounds most fun?", optionA: "Solving a really tricky puzzle", optionB: "Creating something beautiful", optionC: "Teaching a friend something new", correct: "Depends on personality traits", feedback: "Option A builds analytical traits. Option B builds creative traits. Option C builds both caring and social traits." },
      { id: "3DW-OCC-002-Q4", question: "If you had a superpower, you would…", optionA: "Heal anyone who is sick", optionB: "Build incredible things", optionC: "Understand everything around me", correct: "Depends on personality traits", feedback: "Option A builds caring traits. Option B builds physical and creative traits. Option C builds analytical traits." },
      { id: "3DW-OCC-002-Q5", question: "What makes you feel most proud?", optionA: "Finishing a creative project", optionB: "Helping someone who needed me", optionC: "Solving a really hard problem", correct: "Depends on personality traits", feedback: "Option A builds creative traits. Option B builds caring traits. Option C builds analytical traits." },
    ],
    items: [
      { id: "3DW-OCC-002-C1", item: "Doctor",    category: "Career Match", notes: "You care deeply about people and love solving health mysteries!" },
      { id: "3DW-OCC-002-C2", item: "Teacher",   category: "Career Match", notes: "You love sharing knowledge and helping others learn and grow!" },
      { id: "3DW-OCC-002-C3", item: "Artist",    category: "Career Match", notes: "Your creativity shines — you make the world more beautiful!" },
      { id: "3DW-OCC-002-C4", item: "Engineer",  category: "Career Match", notes: "You love building things and solving big problems!" },
      { id: "3DW-OCC-002-C5", item: "Chef",      category: "Career Match", notes: "You are creative and love making people happy with delicious food!" },
      { id: "3DW-OCC-002-C6", item: "Pilot",     category: "Career Match", notes: "Calm, analytical and adventurous — the sky is your office!" },
      { id: "3DW-OCC-002-C7", item: "Scientist", category: "Career Match", notes: "Endlessly curious — you love discovering how the world works!" },
      { id: "3DW-OCC-002-C8", item: "Athlete",   category: "Career Match", notes: "You love being active and pushing yourself to new limits!" },
    ],
  },

  {
    id: "3DW-OCC-003",
    name: "Skills Jobs Sort",
    module: "Occupational Wellbeing",
    route: "/skills-jobs-sort",
    type: "Drag-and-drop skills to careers matching",
    gradeLevel: "Grade 6 to Grade 8",
    duration: "90 seconds",
    voiceover: "Match skills to jobs! A skill card appears on the left — drag it to the career box that needs it most. You have 90 seconds. Every job needs special skills — can you find the right matches?",
    contentType: "items",
    items: [
      { id: "3DW-OCC-003-01", item: "Treating Patients",  category: "Doctor",   notes: "Core clinical skill: diagnosing and treating illness." },
      { id: "3DW-OCC-003-02", item: "Reading X-Rays",     category: "Doctor",   notes: "Diagnostic imaging skill used to assess injuries and conditions." },
      { id: "3DW-OCC-003-03", item: "Teaching Lessons",   category: "Teacher",  notes: "Designing and delivering instruction to students." },
      { id: "3DW-OCC-003-04", item: "Grading Homework",   category: "Teacher",  notes: "Assessing student work and providing academic feedback." },
      { id: "3DW-OCC-003-05", item: "Cooking Meals",      category: "Chef",     notes: "Preparing dishes with proper technique and flavour balance." },
      { id: "3DW-OCC-003-06", item: "Following Recipes",  category: "Chef",     notes: "Reading and executing culinary instructions accurately." },
      { id: "3DW-OCC-003-07", item: "Drawing Blueprints", category: "Engineer", notes: "Creating technical plans for structures and systems." },
      { id: "3DW-OCC-003-08", item: "Building Structures",category: "Engineer", notes: "Constructing physical or digital systems from a design." },
    ],
  },

  // ── Physical Wellbeing ────────────────────────────────────────────────────

  {
    id: "3DW-PHY-001",
    name: "Healthy Plate Game",
    module: "Physical Wellbeing",
    route: "/healthy-plate",
    type: "Drag-and-drop food selection with health scoring",
    gradeLevel: "PreK to Grade 8",
    duration: "90 seconds",
    voiceover: "Build a healthy plate! Drag foods from the sides onto the plate and fill all six sections. The healthier your picks, the higher your score. Vegetables, fruits, and proteins earn the most points. You have 90 seconds!",
    contentType: "items",
    items: [
      { id: "3DW-PHY-001-01", item: "Broccoli",    category: "Vegetable", notes: "Health score: 10/10. High in fibre, vitamins C and K." },
      { id: "3DW-PHY-001-02", item: "Carrot",      category: "Vegetable", notes: "Health score: 10/10. Rich in beta-carotene and vitamin A." },
      { id: "3DW-PHY-001-03", item: "Spinach",     category: "Vegetable", notes: "Health score: 10/10. High in iron, calcium, and folate." },
      { id: "3DW-PHY-001-04", item: "Corn",        category: "Vegetable", notes: "Health score: 9/10. Good source of fibre and B vitamins." },
      { id: "3DW-PHY-001-05", item: "Apple",       category: "Fruit",     notes: "Health score: 9/10. Rich in fibre and vitamin C." },
      { id: "3DW-PHY-001-06", item: "Orange",      category: "Fruit",     notes: "Health score: 9/10. Excellent source of vitamin C." },
      { id: "3DW-PHY-001-07", item: "Grapes",      category: "Fruit",     notes: "Health score: 9/10. Contains antioxidants and natural sugars." },
      { id: "3DW-PHY-001-08", item: "Fish",        category: "Protein",   notes: "Health score: 9/10. High in omega-3 fatty acids and lean protein." },
      { id: "3DW-PHY-001-09", item: "Chicken",     category: "Protein",   notes: "Health score: 8/10. Lean protein that supports muscle growth." },
      { id: "3DW-PHY-001-10", item: "Egg",         category: "Protein",   notes: "Health score: 8/10. Complete protein with essential vitamins." },
      { id: "3DW-PHY-001-11", item: "Brown Rice",  category: "Grain",     notes: "Health score: 7/10. Whole grain with fibre and B vitamins." },
      { id: "3DW-PHY-001-12", item: "Whole Bread", category: "Grain",     notes: "Health score: 6/10. Better than white bread; contains fibre." },
      { id: "3DW-PHY-001-13", item: "Pizza",       category: "Junk Food", notes: "Health score: 2/10. High in saturated fat and sodium." },
      { id: "3DW-PHY-001-14", item: "Burger",      category: "Junk Food", notes: "Health score: 1/10. High in fat, sodium, and refined carbs." },
      { id: "3DW-PHY-001-15", item: "Fries",       category: "Junk Food", notes: "Health score: 1/10. Deep-fried; high in fat and salt." },
      { id: "3DW-PHY-001-16", item: "Candy",       category: "Junk Food", notes: "Health score: 0/10. Pure added sugar with no nutritional value." },
      { id: "3DW-PHY-001-17", item: "Soda",        category: "Junk Food", notes: "Health score: 0/10. High in added sugar; no nutritional benefit." },
      { id: "3DW-PHY-001-18", item: "Donut",       category: "Junk Food", notes: "Health score: 0/10. High in sugar, refined flour, and fat." },
    ],
  },

  // ── Spiritual Wellbeing ───────────────────────────────────────────────────

  {
    id: "3DW-SPI-001",
    name: "Surya Namaskar",
    module: "Spiritual Wellbeing",
    route: "/surya-namaskar",
    type: "Sequencing and mindfulness activity",
    gradeLevel: "Grade 3 to Grade 8",
    duration: "Open-ended",
    voiceover: "Namaste! Let us do Surya Namaskar! Watch the animation to learn all twelve poses, then drag the cards into the right order. Sun salutations are great for your body and mind!",
    contentType: "items",
    items: [
      { id: "3DW-SPI-001-01", item: "Pranamasana — Prayer Pose",         category: "Sun Salutation Sequence", notes: "Pose 1 of 12. Starting position." },
      { id: "3DW-SPI-001-02", item: "Hasta Uttanasana — Raised Arms",    category: "Sun Salutation Sequence", notes: "Pose 2 of 12." },
      { id: "3DW-SPI-001-03", item: "Hastapadasana — Forward Bend",      category: "Sun Salutation Sequence", notes: "Pose 3 of 12." },
      { id: "3DW-SPI-001-04", item: "Ashwa Sanchalanasana — Equestrian", category: "Sun Salutation Sequence", notes: "Pose 4 of 12." },
      { id: "3DW-SPI-001-05", item: "Dandasana — Stick Pose",            category: "Sun Salutation Sequence", notes: "Pose 5 of 12." },
      { id: "3DW-SPI-001-06", item: "Ashtanga Namaskara — 8 Limbs",      category: "Sun Salutation Sequence", notes: "Pose 6 of 12." },
      { id: "3DW-SPI-001-07", item: "Bhujangasana — Cobra Pose",         category: "Sun Salutation Sequence", notes: "Pose 7 of 12." },
      { id: "3DW-SPI-001-08", item: "Adho Mukha Svanasana — Downward Dog",category: "Sun Salutation Sequence", notes: "Pose 8 of 12." },
      { id: "3DW-SPI-001-09", item: "Ashwa Sanchalanasana — Equestrian (Right)", category: "Sun Salutation Sequence", notes: "Pose 9 of 12." },
      { id: "3DW-SPI-001-10", item: "Hastapadasana — Forward Bend",      category: "Sun Salutation Sequence", notes: "Pose 10 of 12." },
      { id: "3DW-SPI-001-11", item: "Hasta Uttanasana — Raised Arms",    category: "Sun Salutation Sequence", notes: "Pose 11 of 12." },
      { id: "3DW-SPI-001-12", item: "Tadasana — Mountain Pose",          category: "Sun Salutation Sequence", notes: "Pose 12 of 12. Closing position." },
    ],
  },
];

// ── Change log ────────────────────────────────────────────────────────────────

export const CHANGELOG = [
  { version: "v1.0", date: "May 2026", game: "All Games", change: "Initial content registry created for copyright deposit filing.", ticket: "", updatedBy: "EndsideOut Team" },
];
