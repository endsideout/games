export const EMOTION_SCENARIOS = [
  {
    id: 1,
    text: "Maya's bike was stolen from the school playground",
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "😢", emotion: "Sad" },
      { emoji: "😠", emotion: "Angry" },
      { emoji: "😨", emotion: "Scared" },
    ],
    correctAnswers: ["Angry"],
  },
  {
    id: 2,
    text: "John's brother ate his piece of birthday cake",
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "😢", emotion: "Sad" },
      { emoji: "😠", emotion: "Angry" },
      { emoji: "😱", emotion: "Surprised" },
    ],
    correctAnswers: ["Angry"],
  },
  {
    id: 3,
    text: "Sarah is watching a scary movie alone at night",
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "😨", emotion: "Scared" },
      { emoji: "😠", emotion: "Angry" },
      { emoji: "😴", emotion: "Bored" },
    ],
    correctAnswers: ["Scared"],
  },
  {
    id: 4,
    text: "Tom got a puppy for his birthday",
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "😢", emotion: "Sad" },
      { emoji: "😠", emotion: "Angry" },
      { emoji: "😨", emotion: "Scared" },
    ],
    correctAnswers: ["Happy"],
  },
  {
    id: 5,
    text: "Lisa's best friend is moving to another city",
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "😢", emotion: "Sad" },
      { emoji: "😠", emotion: "Angry" },
      { emoji: "😱", emotion: "Surprised" },
    ],
    correctAnswers: ["Sad"],
  },
  {
    id: 6,
    text: "Alex won first place in the school race",
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "😎", emotion: "Proud" },
      { emoji: "😢", emotion: "Sad" },
      { emoji: "😨", emotion: "Scared" },
    ],
    correctAnswers: ["Happy", "Proud"],
  },
  {
    id: 7,
    text: "Emma lost her favorite toy at the park",
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "😢", emotion: "Sad" },
      { emoji: "😠", emotion: "Angry" },
      { emoji: "🤔", emotion: "Confused" },
    ],
    correctAnswers: ["Sad"],
  },
  {
    id: 8,
    text: "Ben heard a loud noise outside his window at night",
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "😨", emotion: "Scared" },
      { emoji: "😠", emotion: "Angry" },
      { emoji: "😴", emotion: "Sleepy" },
    ],
    correctAnswers: ["Scared"],
  },
  {
    id: 9,
    text: "Nina's team lost the final game of the season",
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "😢", emotion: "Sad" },
      { emoji: "😤", emotion: "Frustrated" },
      { emoji: "😨", emotion: "Scared" },
    ],
    correctAnswers: ["Frustrated"],
  },
  {
    id: 10,
    text: "David's friend shared their lunch with him when he forgot his",
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "🥰", emotion: "Grateful" },
      { emoji: "😢", emotion: "Sad" },
      { emoji: "😠", emotion: "Angry" },
    ],
    correctAnswers: ["Happy", "Grateful"],
  },
] as const;

export const RELATIONSHIP_WORDS = [
  "Communication",
  "Respect",
  "Trust",
  "Honest",
  "Equality",
  "Boundaries",
] as const;

export const FRUIT_ITEMS = [
  "Apple",
  "Banana",
  "Grapes",
  "Kiwi",
  "Mango",
  "Orange",
  "Pineapple",
  "Pomegranate",
  "Strawberry",
  "Watermelon",
] as const;

export const VEGETABLE_ITEMS = [
  "Broccoli",
  "Cabbage",
  "Carrot",
  "Cauliflower",
  "Green Beans",
  "Mushroom",
  "Onion",
  "Spinach",
  "Potato",
  "Brinjal",
] as const;

export const ECO_FRIENDLY_ITEMS = [
  { id: 1, name: "Electric Car", type: "eco-friendly", emoji: "🚙⚡", description: "Zero emissions vehicle" },
  { id: 2, name: "Reusable Bag", type: "eco-friendly", emoji: "♻️🛍️", description: "Reduces plastic waste" },
  { id: 3, name: "Solar Panels", type: "eco-friendly", emoji: "☀️🔋", description: "Clean renewable energy" },
  { id: 4, name: "Recycling Bin", type: "eco-friendly", emoji: "♻️", description: "Sorts waste properly" },
  { id: 5, name: "Bicycle", type: "eco-friendly", emoji: "🚲", description: "Zero emission transport" },
  { id: 6, name: "Tree Planting", type: "eco-friendly", emoji: "🌳", description: "Produces oxygen" },
  { id: 7, name: "Wind Turbine", type: "eco-friendly", emoji: "💨🔋", description: "Renewable energy" },
  { id: 8, name: "Composting", type: "eco-friendly", emoji: "🌱", description: "Natural fertilizer" },
  { id: 9, name: "LED Bulb", type: "eco-friendly", emoji: "💡", description: "Energy efficient" },
  { id: 10, name: "Water Conservation", type: "eco-friendly", emoji: "💧✅", description: "Saves water" },
] as const;

export const NOT_ECO_FRIENDLY_ITEMS = [
  { id: 11, name: "Gas Car", type: "not-eco-friendly", emoji: "🚗💨", description: "Emits pollution" },
  { id: 12, name: "Plastic Bags", type: "not-eco-friendly", emoji: "🛍️", description: "Single-use plastic" },
  { id: 13, name: "Factory Smoke", type: "not-eco-friendly", emoji: "🏭💨", description: "Air pollution" },
  { id: 14, name: "Trash Pile", type: "not-eco-friendly", emoji: "🗑️", description: "Unsorted waste" },
  { id: 15, name: "Cutting Trees", type: "not-eco-friendly", emoji: "🪵", description: "Deforestation" },
  { id: 16, name: "Coal Power", type: "not-eco-friendly", emoji: "⚫⚡", description: "Polluting energy" },
  { id: 17, name: "Littering", type: "not-eco-friendly", emoji: "🚮", description: "Pollutes environment" },
  { id: 18, name: "Water Waste", type: "not-eco-friendly", emoji: "💧❌", description: "Wastes resources" },
  { id: 19, name: "Incandescent Bulb", type: "not-eco-friendly", emoji: "💡🔥", description: "Energy wasting" },
  { id: 20, name: "Aerosol Spray", type: "not-eco-friendly", emoji: "💨", description: "Harmful chemicals" },
] as const;

export const PLANET_GOOD_ACTIONS = [
  "Plant trees",
  "Turning off lights",
  "Biking/walking",
  "Saving water",
  "Picking up trash",
] as const;

export const PLANET_BAD_ACTIONS = [
  "Leaving lights on",
  "Driving cars unnecessarily",
  "Throwing trash on the ground",
  "Wasting water",
  "Pollution/smoke",
] as const;

export const BUDGET_ITEMS = [
  { name: "Food", emoji: "🍎", category: "need", value: 20 },
  { name: "Video Games", emoji: "🎮", category: "want", value: 60 },
  { name: "Water", emoji: "💧", category: "need", value: 5 },
  { name: "Candy", emoji: "🍬", category: "want", value: 3 },
  { name: "Rent", emoji: "🏠", category: "need", value: 800 },
  { name: "New Phone", emoji: "📱", category: "want", value: 200 },
  { name: "Clothing", emoji: "👕", category: "need", value: 50 },
  { name: "Vacation", emoji: "✈️", category: "want", value: 500 },
  { name: "Medicine", emoji: "💊", category: "need", value: 30 },
  { name: "Jewelry", emoji: "💍", category: "want", value: 150 },
] as const;

export const BANKING_WORDS = [
  { word: "BANK", definition: "A safe place to keep your money" },
  { word: "SAVE", definition: "To keep money for later" },
  { word: "CASH", definition: "Paper money and coins" },
  { word: "LOAN", definition: "Money borrowed that must be repaid" },
  { word: "FEES", definition: "Charges for using some services" },
  { word: "SAFE", definition: "A secure place for valuables" },
  { word: "COIN", definition: "Small round metal money" },
  { word: "CREDIT", definition: "Borrowing money to pay back later" },
  { word: "TRUST", definition: "Believing the bank keeps money safe" },
  { word: "MONEY", definition: "What we use to buy things" },
  { word: "DEPOSIT", definition: "Put money INTO your account" },
  { word: "BALANCE", definition: "How much money you have" },
  { word: "SAVINGS", definition: "Account to grow your money" },
] as const;

export const STUDY_HABITS = [
  { name: "Set a study schedule", emoji: "📅", category: "good" },
  { name: "Keep a clean desk", emoji: "🗂️", category: "good" },
  { name: "Drink water while studying", emoji: "💧", category: "good" },
  { name: "Take short breaks", emoji: "☕", category: "good" },
  { name: "Write notes by hand", emoji: "✍️", category: "good" },
  { name: "Study in bright light", emoji: "💡", category: "good" },
  { name: "Get 8 hours of sleep", emoji: "😴", category: "good" },
  { name: "Study in a quiet room", emoji: "🤫", category: "good" },
  { name: "Use flashcards to review", emoji: "🃏", category: "good" },
  { name: "Turn off notifications", emoji: "🔕", category: "good" },
  { name: "Review notes after class", emoji: "📖", category: "good" },
  { name: "Set a study timer", emoji: "⏱️", category: "good" },
  { name: "Watch TV while studying", emoji: "📺", category: "bad" },
  { name: "Use phone while studying", emoji: "📱", category: "bad" },
  { name: "Study with a messy desk", emoji: "🗑️", category: "bad" },
  { name: "Stay up all night", emoji: "🌙", category: "bad" },
  { name: "Skip all breaks", emoji: "😵", category: "bad" },
  { name: "Study in the dark", emoji: "🌑", category: "bad" },
  { name: "Eat junk food while studying", emoji: "🍕", category: "bad" },
  { name: "Chat with friends instead", emoji: "💬", category: "bad" },
  { name: "Leave things to last minute", emoji: "⏰", category: "bad" },
  { name: "Listen to loud music", emoji: "🎵", category: "bad" },
  { name: "Jump between subjects", emoji: "🔄", category: "bad" },
  { name: "Skip reviewing homework", emoji: "📚", category: "bad" },
] as const;

export const HEALTHY_PLATE_FOODS = [
  { id: "broccoli", name: "Broccoli", emoji: "🥦", healthScore: 10, category: "vegetable" },
  { id: "carrot", name: "Carrot", emoji: "🥕", healthScore: 10, category: "vegetable" },
  { id: "spinach", name: "Spinach", emoji: "🥬", healthScore: 10, category: "vegetable" },
  { id: "corn", name: "Corn", emoji: "🌽", healthScore: 9, category: "vegetable" },
  { id: "apple", name: "Apple", emoji: "🍎", healthScore: 9, category: "fruit" },
  { id: "orange", name: "Orange", emoji: "🍊", healthScore: 9, category: "fruit" },
  { id: "grapes", name: "Grapes", emoji: "🍇", healthScore: 9, category: "fruit" },
  { id: "chicken", name: "Chicken", emoji: "🍗", healthScore: 8, category: "protein" },
  { id: "fish", name: "Fish", emoji: "🐟", healthScore: 9, category: "protein" },
  { id: "egg", name: "Egg", emoji: "🥚", healthScore: 8, category: "protein" },
  { id: "rice", name: "Brown Rice", emoji: "🍚", healthScore: 7, category: "grain" },
  { id: "bread", name: "Whole Bread", emoji: "🍞", healthScore: 6, category: "grain" },
  { id: "pizza", name: "Pizza", emoji: "🍕", healthScore: 2, category: "junk" },
  { id: "burger", name: "Burger", emoji: "🍔", healthScore: 1, category: "junk" },
  { id: "fries", name: "Fries", emoji: "🍟", healthScore: 1, category: "junk" },
  { id: "candy", name: "Candy", emoji: "🍬", healthScore: 0, category: "junk" },
  { id: "soda", name: "Soda", emoji: "🥤", healthScore: 0, category: "junk" },
  { id: "donut", name: "Donut", emoji: "🍩", healthScore: 0, category: "junk" },
] as const;

export const SURYA_POSES = [
  { id: 1, name: "Pranamasana", sanskrit: "Prayer Pose", subtitle: "Normal breath", image: "/poses/pose-1.png" },
  { id: 2, name: "Hasta Uttanasana", sanskrit: "Raised Arms", subtitle: "Stretch up", image: "/poses/pose-2.png" },
  { id: 3, name: "Uttanasana", sanskrit: "Forward Fold", subtitle: "Forward fold", image: "/poses/pose-3.png" },
  { id: 4, name: "Ashwa Sanchalanasana", sanskrit: "Right Leg Back Lunge", subtitle: "Right leg back", image: "/poses/pose-4.png" },
  { id: 5, name: "Dandasana", sanskrit: "Plank", subtitle: "Plank", image: "/poses/pose-5.png" },
  { id: 6, name: "Ashtanga Namaskara", sanskrit: "Eight Limbs", subtitle: "Knees chest chin", image: "/poses/pose-6.png" },
  { id: 7, name: "Bhujangasana", sanskrit: "Cobra Pose", subtitle: "Lift chest", image: "/poses/pose-7.png" },
  { id: 8, name: "Parvatasana", sanskrit: "Downward Dog", subtitle: "Hips up", image: "/poses/pose-8.png" },
  { id: 9, name: "Ashwa Sanchalanasana", sanskrit: "Right Leg Forward Lunge", subtitle: "Right leg forward", image: "/poses/pose-9.png" },
  { id: 10, name: "Uttanasana", sanskrit: "Forward Fold", subtitle: "Fold", image: "/poses/pose-10.png" },
  { id: 11, name: "Hasta Uttanasana", sanskrit: "Raised Arms", subtitle: "Stretch up", image: "/poses/pose-11.png" },
  { id: 12, name: "Pranamasana", sanskrit: "Prayer Pose", subtitle: "Relax", image: "/poses/pose-12.png" },
] as const;

export const DREAM_JOB_QUESTIONS = [
  {
    text: "What do you love doing most after school?",
    emoji: "💭",
    options: [
      { label: "Reading and learning new things", emoji: "📚", traits: { analytical: 2 } },
      { label: "Making and creating things", emoji: "🎨", traits: { creative: 2 } },
      { label: "Helping and caring for others", emoji: "🤝", traits: { caring: 2 } },
    ],
  },
  {
    text: "Where would you love to work?",
    emoji: "🏙️",
    options: [
      { label: "Outdoors, moving around", emoji: "🌿", traits: { physical: 2 } },
      { label: "In a cozy office or lab", emoji: "🏢", traits: { analytical: 2 } },
      { label: "Travelling and meeting people", emoji: "✈️", traits: { social: 2 } },
    ],
  },
  {
    text: "Which activity sounds most fun?",
    emoji: "🎯",
    options: [
      { label: "Solving a really tricky puzzle", emoji: "🧩", traits: { analytical: 2 } },
      { label: "Creating something beautiful", emoji: "🖌️", traits: { creative: 2 } },
      { label: "Teaching a friend something new", emoji: "📖", traits: { caring: 1, social: 1 } },
    ],
  },
  {
    text: "If you had a superpower, you would…",
    emoji: "⚡",
    options: [
      { label: "Heal anyone who is sick", emoji: "💊", traits: { caring: 2 } },
      { label: "Build incredible things", emoji: "🔧", traits: { physical: 1, creative: 1 } },
      { label: "Understand everything around me", emoji: "🔬", traits: { analytical: 2 } },
    ],
  },
  {
    text: "What makes you feel most proud?",
    emoji: "🌟",
    options: [
      { label: "Finishing a creative project", emoji: "🎨", traits: { creative: 2 } },
      { label: "Helping someone who needed me", emoji: "🤗", traits: { caring: 2 } },
      { label: "Solving a really hard problem", emoji: "🧠", traits: { analytical: 2 } },
    ],
  },
] as const;

export const DREAM_JOB_CAREERS = [
  { title: "Doctor", emoji: "👨‍⚕️", description: "You care deeply about people and love solving health mysteries!" },
  { title: "Teacher", emoji: "👩‍🏫", description: "You love sharing knowledge and helping others learn and grow!" },
  { title: "Artist", emoji: "🎨", description: "Your creativity shines — you make the world more beautiful!" },
  { title: "Engineer", emoji: "👷", description: "You love building things and solving big problems!" },
  { title: "Chef", emoji: "👨‍🍳", description: "You're creative and love making people happy with delicious food!" },
  { title: "Pilot", emoji: "✈️", description: "Calm, analytical and adventurous — the sky is your office!" },
  { title: "Scientist", emoji: "🔬", description: "Endlessly curious — you love discovering how the world works!" },
  { title: "Athlete", emoji: "🏃", description: "You love being active and pushing yourself to new limits!" },
] as const;

export const SKILLS_JOBS_SKILLS = [
  { id: "treating", name: "Treating Patients", emoji: "🩺", correctCareer: "doctor" },
  { id: "xray", name: "Reading X-Rays", emoji: "🩻", correctCareer: "doctor" },
  { id: "lessons", name: "Teaching Lessons", emoji: "📖", correctCareer: "teacher" },
  { id: "grading", name: "Grading Homework", emoji: "📝", correctCareer: "teacher" },
  { id: "cooking", name: "Cooking Meals", emoji: "🍳", correctCareer: "chef" },
  { id: "recipes", name: "Following Recipes", emoji: "📋", correctCareer: "chef" },
  { id: "blueprints", name: "Drawing Blueprints", emoji: "📐", correctCareer: "engineer" },
  { id: "building", name: "Building Structures", emoji: "🏗️", correctCareer: "engineer" },
] as const;

export const SKILLS_JOBS_CAREERS = [
  { id: "doctor", title: "Doctor", emoji: "👨‍⚕️" },
  { id: "teacher", title: "Teacher", emoji: "👩‍🏫" },
  { id: "chef", title: "Chef", emoji: "👨‍🍳" },
  { id: "engineer", title: "Engineer", emoji: "👷" },
] as const;

export const JOB_PATH_JOBS = [
  {
    title: "Doctor",
    emoji: "👨‍⚕️",
    fact: "Doctors can work in hospitals, clinics, or even on rescue helicopters!",
    checkpoints: [
      { question: "Which subject helps a doctor the most?", options: ["🎨 Art", "🔬 Science", "🎵 Music"], correct: 1, explanation: "Science helps doctors understand how the body works!" },
      { question: "A patient is scared. What should a doctor do?", options: ["Ignore them", "Speak kindly and explain", "Walk away"], correct: 1, explanation: "Doctors need empathy to help patients feel safe." },
      { question: "What does a doctor use to listen to your heartbeat?", options: ["🔭 Telescope", "🩺 Stethoscope", "📏 Ruler"], correct: 1, explanation: "A stethoscope amplifies sounds inside your body!" },
      { question: "Which skill makes a great doctor?", options: ["Swimming", "Caring for others", "Singing"], correct: 1, explanation: "Caring for people is the heart of being a doctor." },
    ],
  },
  {
    title: "Chef",
    emoji: "👨‍🍳",
    fact: "Chefs can work in restaurants, hotels, cruise ships, or even the White House!",
    checkpoints: [
      { question: "What does a chef need most?", options: ["🎨 Drawing", "🍳 Cooking skills", "🔧 Fixing engines"], correct: 1, explanation: "Cooking skills are the foundation of being a great chef!" },
      { question: "A dish tastes too salty. What do you do?", options: ["Add more salt", "Taste and adjust", "Throw it away"], correct: 1, explanation: "Good chefs taste and adjust to make food just right." },
      { question: "Which skill makes a great chef?", options: ["Creativity", "Swimming", "Video gaming"], correct: 0, explanation: "Creativity helps chefs invent new and delicious recipes!" },
      { question: "Where does a chef mostly work?", options: ["Hospital", "Kitchen", "Playground"], correct: 1, explanation: "The kitchen is a chef's workplace and creative space!" },
    ],
  },
  {
    title: "Teacher",
    emoji: "👩‍🏫",
    fact: "Teachers shape the future — every doctor, engineer, and artist once had a great teacher!",
    checkpoints: [
      { question: "What is the most important skill for a teacher?", options: ["Patience", "Running fast", "Cooking"], correct: 0, explanation: "Patience helps teachers support every student's learning pace." },
      { question: "A student doesn't understand. What should a teacher do?", options: ["Move on quickly", "Explain it differently", "Give them less work"], correct: 1, explanation: "Great teachers find new ways to explain until everyone gets it!" },
      { question: "Which tool does a teacher use most?", options: ["🔨 Hammer", "📚 Books & lessons", "🚗 Car"], correct: 1, explanation: "Books and lessons are a teacher's main tools for sharing knowledge." },
      { question: "Where does a teacher work?", options: ["Farm", "Classroom", "Ocean"], correct: 1, explanation: "Classrooms are where teachers inspire the next generation!" },
    ],
  },
  {
    title: "Engineer",
    emoji: "👷",
    fact: "Engineers built bridges, rockets, smartphones, and the internet — they solve the world's problems!",
    checkpoints: [
      { question: "Which subject is most useful for an engineer?", options: ["🎭 Drama", "📐 Math & Science", "🎨 Painting"], correct: 1, explanation: "Math and science are the building blocks of engineering!" },
      { question: "A bridge design has a problem. What does an engineer do?", options: ["Give up", "Solve and redesign", "Ignore it"], correct: 1, explanation: "Engineers are problem solvers — they keep improving until it's right." },
      { question: "What skill helps engineers most?", options: ["Dancing", "Critical thinking", "Cooking"], correct: 1, explanation: "Critical thinking helps engineers find the best solutions." },
      { question: "Which tool do engineers often use?", options: ["🖥️ Computer & blueprints", "🎸 Guitar", "🌸 Flowers"], correct: 0, explanation: "Computers and blueprints help engineers design and plan structures." },
    ],
  },
  {
    title: "Artist",
    emoji: "🎨",
    fact: "Artists work in movies, video games, fashion, architecture, advertising — art is everywhere!",
    checkpoints: [
      { question: "What does an artist need most?", options: ["Creativity", "Strength", "Speed"], correct: 0, explanation: "Creativity is the fuel that powers all great artwork!" },
      { question: "An artwork doesn't look right. What should an artist do?", options: ["Quit", "Keep practising and improving", "Copy someone else"], correct: 1, explanation: "Great artists grow by practising and learning from mistakes." },
      { question: "Which skill helps an artist succeed?", options: ["Attention to detail", "Loud voice", "Cooking"], correct: 0, explanation: "Noticing small details helps artists create beautiful, precise work." },
      { question: "Where can an artist show their work?", options: ["🏥 Hospital only", "🖼️ Gallery, internet, anywhere!", "🏖️ Only at the beach"], correct: 1, explanation: "Artists can share their work with the whole world!" },
    ],
  },
  {
    title: "Pilot",
    emoji: "✈️",
    fact: "Pilots can fly to over 100 different countries and see the world from above the clouds!",
    checkpoints: [
      { question: "Which skill is most important for a pilot?", options: ["Staying calm under pressure", "Singing", "Drawing"], correct: 0, explanation: "Staying calm helps pilots make safe decisions in any situation." },
      { question: "There is bad weather ahead. What should a pilot do?", options: ["Fly through it fast", "Check instruments and take a safe route", "Land immediately anywhere"], correct: 1, explanation: "Pilots use instruments and training to navigate safely." },
      { question: "What does a pilot use to navigate?", options: ["🗺️ Paper map only", "🖥️ Instruments & GPS", "🔮 Magic"], correct: 1, explanation: "Modern pilots use advanced instruments and GPS to fly safely." },
      { question: "Which subject helps a future pilot?", options: ["Math & physics", "Cooking", "Poetry"], correct: 0, explanation: "Math and physics help pilots understand speed, altitude, and navigation." },
    ],
  },
] as const;
