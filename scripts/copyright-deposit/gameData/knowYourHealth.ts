export const MODE1_FOODS = [
  { id: "cookie", name: "Cookie", emoji: "🍪", category: "sometimes" },
  { id: "apple", name: "Apple", emoji: "🍎", category: "anytime" },
  { id: "banana", name: "Banana", emoji: "🍌", category: "anytime" },
  { id: "chocolate", name: "Chocolate", emoji: "🍫", category: "sometimes" },
  { id: "broccoli", name: "Broccoli", emoji: "🥦", category: "anytime" },
] as const;

export const MODE2_FOODS = [
  {
    id: "fries",
    name: "French Fries",
    emoji: "🍟",
    category: "sometimes",
    hint: "High in fat & sodium — save it for special days!",
    nonBenefit: { icon: "badheart", text: "Too much fat is bad for your heart!" },
  },
  {
    id: "cookie",
    name: "Cookie",
    emoji: "🍪",
    category: "sometimes",
    hint: "High in added sugar — enjoy occasionally!",
    nonBenefit: { icon: "tooth", text: "Too much sugar harms your teeth!" },
  },
  {
    id: "chocolate",
    name: "Chocolate",
    emoji: "🍫",
    category: "sometimes",
    hint: "High in sugar & fat — a treat, not everyday!",
    nonBenefit: { icon: "sugar", text: "High sugar spikes your energy & crashes it!" },
  },
  {
    id: "apple",
    name: "Apple",
    emoji: "🍎",
    category: "anytime",
    hint: "Packed with fibre & vitamins!",
    benefit: { icon: "books", text: "Helps focus in class" },
  },
  {
    id: "banana",
    name: "Banana",
    emoji: "🍌",
    category: "anytime",
    hint: "Great source of energy & potassium!",
    benefit: { icon: "grades", text: "Helps get better grades" },
  },
  {
    id: "broccoli",
    name: "Broccoli",
    emoji: "🥦",
    category: "anytime",
    hint: "Packed with vitamins & fibre!",
    benefit: { icon: "immunity", text: "Boosts your immunity" },
  },
] as const;

export const LEAST_SUGAR_ROUNDS = [
  {
    question: "Which one has NATURAL sugar? 🍃",
    questionType: "natural",
    left: { name: "Donut", emoji: "🍩", fact: "Made with added sugar & syrup" },
    right: { name: "Orange", emoji: "🍊", fact: "Natural sugar from fruit" },
    answer: "right",
    explanation: "Oranges have natural sugar that comes with vitamins & fibre!",
  },
  {
    question: "Which has ADDED sugar? 🏭",
    questionType: "added",
    left: { name: "Cookies", emoji: "🍪", fact: "Packed with added sugar & fat" },
    right: { name: "Cherries", emoji: "🍒", fact: "Only natural fruit sugars" },
    answer: "left",
    explanation: "Cookies are loaded with added sugar put in during manufacturing!",
  },
  {
    question: "Which should you eat MORE of? 💪",
    questionType: "eat-more",
    left: { name: "Grapes", emoji: "🍇", fact: "Natural sugars + antioxidants" },
    right: { name: "Candy", emoji: "🍬", fact: "Pure added sugar, no nutrients" },
    answer: "left",
    explanation: "Grapes have natural sugar with antioxidants — great for you!",
  },
  {
    question: "Which should you eat LESS of? 🚫",
    questionType: "eat-less",
    left: { name: "Cereal", emoji: "🥣", fact: "Often has lots of added sugar" },
    right: { name: "Oatmeal", emoji: "🌾", fact: "Barely any sugar, full of fibre" },
    answer: "left",
    explanation: "Most cereals are high in added sugar — oatmeal is the healthier swap!",
  },
  {
    question: "Which has NATURAL sugar? 🍃",
    questionType: "natural",
    left: { name: "Watermelon", emoji: "🍉", fact: "Natural fruit sugar + lots of water" },
    right: { name: "Ice Cream", emoji: "🍦", fact: "High in added sugar & fat" },
    answer: "left",
    explanation: "Watermelon is 92% water with natural sugar — super refreshing!",
  },
] as const;

export const BRAIN_HEALTH_SCENARIOS = [
  {
    situation: "Flame-man has been feeling stressed all day.",
    question: "What should he do to feel better?",
    left: { name: "Get Active", emoji: "🏀", desc: "Play basketball & move his body" },
    right: { name: "Scroll His Phone", emoji: "📱", desc: "Browse social media for hours" },
    answer: "left",
    explanation: "Exercise releases feel-good chemicals in the brain that melt away stress!",
  },
  {
    situation: "Flame-man needs a snack to help his brain function.",
    question: "Which should he choose?",
    left: { name: "Cupcake", emoji: "🧁", desc: "Sweet & sugary treat" },
    right: { name: "Apple", emoji: "🍎", desc: "Crunchy fruit full of vitamins" },
    answer: "right",
    explanation: "Apples fuel the brain with natural sugars and vitamins — no sugar crash!",
  },
  {
    situation: "Flame-man can't focus on his homework.",
    question: "What should he try first?",
    left: { name: "Stretch & Breathe", emoji: "🤸", desc: "Take a short movement break" },
    right: { name: "Play Video Games", emoji: "🎮", desc: "Switch to something fun instead" },
    answer: "left",
    explanation: "A short movement break refreshes the brain so you can focus better when you return!",
  },
  {
    situation: "Flame-man is feeling lonely and sad.",
    question: "What would help his brain health most?",
    left: { name: "Talk to a Friend", emoji: "🗣️", desc: "Share his feelings with someone" },
    right: { name: "Stay Alone", emoji: "😶", desc: "Lock himself in his room" },
    answer: "left",
    explanation: "Social connection boosts brain chemicals that lift your mood — superheroes need friends too!",
  },
  {
    situation: "It's 10pm and Flame-man is still wide awake.",
    question: "What's best for his brain?",
    left: { name: "Go to Sleep", emoji: "😴", desc: "Get a full night of rest" },
    right: { name: "Watch TV", emoji: "📺", desc: "Stay up watching his favourite show" },
    answer: "left",
    explanation: "The brain cleans itself and builds memories during sleep — 8 to 10 hours is every hero's superpower!",
  },
] as const;

export const WATER_GLASS_QUESTIONS = [
  {
    question: "Which drink is a sometimes drink?",
    voiceText: "Which drink is a sometimes drink?",
    options: [
      { id: "a", emoji: "🥤", label: "Soda", desc: "Sweet & fizzy" },
      { id: "b", emoji: "💧", label: "Water", desc: "Clear & refreshing" },
    ],
    answer: "a",
    explanation: "Soda has lots of added sugar, so it's a sometimes drink. Water is an anytime drink!",
  },
  {
    question: "How many cups of water should we drink each day?",
    voiceText: "How many cups of water should we drink each day?",
    options: [
      { id: "a", numberLabel: "🥤🥤🥤🥤🥤🥤🥤🥤", label: "8 glasses" },
      { id: "b", numberLabel: "🥤", label: "1 glass" },
      { id: "c", numberLabel: "🥤🥤🥤🥤", label: "4 glasses" },
    ],
    answer: "a",
    explanation: "We should drink 8 cups of water every day to stay healthy and hydrated!",
  },
  {
    question: "Which drink is the healthiest?",
    voiceText: "Which drink is the healthiest?",
    options: [
      { id: "a", emoji: "🏃", label: "Sports Drink", desc: "Like Gatorade" },
      { id: "b", emoji: "💧", label: "Water", desc: "Plain & pure" },
      { id: "c", emoji: "🧋", label: "Milkshake", desc: "Sweet & creamy" },
    ],
    answer: "b",
    explanation: "Water is the healthiest drink — zero sugar, zero calories, and your body loves it!",
  },
  {
    question: "Which drink helps plants grow?",
    voiceText: "Which drink helps plants grow?",
    options: [
      { id: "a", emoji: "🥛", label: "Milk", desc: "From a cow" },
      { id: "b", emoji: "💧", label: "Water", desc: "From a tap or bottle" },
    ],
    answer: "b",
    explanation: "Plants need water to grow and survive — just like us!",
  },
] as const;

export const FINISH_RACE_QUESTIONS = [
  {
    question: "How many minutes a day should we be active?",
    options: [
      { id: "a", text: "20 minutes", emoji: "😴" },
      { id: "b", text: "30 minutes", emoji: "🙂" },
      { id: "c", text: "60 minutes", emoji: "💪" },
    ],
    answer: "c",
    explanation: "We should be active for at least 60 minutes every day to keep our body strong and healthy!",
  },
  {
    question: "True or false: Screen time is healthier than moving your body.",
    options: [
      { id: "a", text: "True", emoji: "📱" },
      { id: "b", text: "False", emoji: "🏃" },
    ],
    answer: "b",
    explanation: "False! Moving your body is always healthier than screen time. Exercise keeps your body and brain strong!",
  },
  {
    question: "What is a way we can stay active?",
    options: [
      { id: "a", text: "Playing soccer", emoji: "⚽" },
      { id: "b", text: "Run outside", emoji: "🏃" },
      { id: "c", text: "Play basketball", emoji: "🏀" },
      { id: "d", text: "All of the above", emoji: "🎉" },
    ],
    answer: "d",
    explanation: "All of the above! Soccer, running, and basketball are all great ways to stay active every day.",
  },
  {
    question: "What happens when we exercise more?",
    options: [
      { id: "a", text: "Less energy", emoji: "😴" },
      { id: "b", text: "Less focused in school", emoji: "😕" },
      { id: "c", text: "Better grades in school", emoji: "📚" },
    ],
    answer: "c",
    explanation: "Exercise helps your brain focus better and gives you more energy — leading to better grades in school!",
  },
  {
    question: "Which is a muscle strengthening exercise?",
    options: [
      { id: "a", text: "Walking", emoji: "🚶" },
      { id: "b", text: "Swimming", emoji: "🏊" },
      { id: "c", text: "Push ups", emoji: "💪" },
    ],
    answer: "c",
    explanation: "Push ups are a great muscle strengthening exercise that builds strong arms and chest!",
  },
] as const;

export const BODY_IMAGE_STATEMENTS = [
  {
    id: 1,
    text: "My appearance does not say anything about my character and values.",
    answer: "positive",
    explanation:
      "Your kindness, creativity, and values define who you are — not how you look. That's positive body image!",
  },
  {
    id: 2,
    text: "I celebrate and appreciate my body.",
    answer: "positive",
    explanation:
      "Appreciating what your body can do and celebrating it is a beautiful sign of positive body image!",
  },
  {
    id: 3,
    text: "I'm always thinking about food, exercise, and body size.",
    answer: "negative",
    explanation:
      "Constantly obsessing over food, exercise, and body size can be harmful and reflects a negative body image.",
  },
  {
    id: 4,
    text: "I compare myself to others.",
    answer: "negative",
    explanation:
      "Comparing yourself to others hurts your self-esteem. Everyone is unique and worthy just as they are!",
  },
  {
    id: 5,
    text: "I feel comfortable in my body.",
    answer: "positive",
    explanation:
      "Feeling comfortable in your body is a sign of positive body image. It means you accept and appreciate yourself just as you are!",
  },
] as const;

export const PREK_HABIT_ITEMS = [
  { label: "Staying Active", emoji: "🏃", type: "good", voice: "Staying Active!" },
  { label: "Sleep Well", emoji: "😴", type: "good", voice: "Sleep Well!" },
  { label: "Drinking Water", emoji: "💧", type: "good", voice: "Drinking Water!" },
  { label: "Junk Food", emoji: "🍔", type: "bad", voice: "Junk Food!" },
  { label: "Not Enough Sleep", emoji: "😵", type: "bad", voice: "Not enough sleep!" },
] as const;

export const OLDER_HABIT_ITEMS = [
  { label: "Wash Hands", emoji: "🧼", type: "good", voice: "Washing hands!" },
  { label: "Anytime Foods", emoji: "🥗", type: "good", voice: "Anytime foods!" },
  { label: "Exercise Daily", emoji: "💪", type: "good", voice: "Exercise one hour a day!" },
  { label: "Drink Water", emoji: "💧", type: "good", voice: "Drink water!" },
  { label: "Clean & Disinfect", emoji: "🧹", type: "good", voice: "Clean and disinfect!" },
  { label: "Not Enough Sleep", emoji: "🌙", type: "bad", voice: "Not enough sleep!" },
  { label: "Too Much Sugar", emoji: "🍬", type: "bad", voice: "Too much sugar!" },
  { label: "Ignore Family History", emoji: "🏥", type: "bad", voice: "Ignoring family health history!" },
  { label: "Junk Food", emoji: "🍔", type: "bad", voice: "Eating junk food!" },
  { label: "Limit Exercise", emoji: "🛋️", type: "bad", voice: "Limiting exercise!" },
] as const;
