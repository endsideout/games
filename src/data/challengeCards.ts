export interface ChallengeCard {
    id: number;
    topic: string;
    question: string;
    options: string[];
    correctAnswer: number;
    resource: string;
    explanation: string;
}

export const challengeCards: ChallengeCard[] = [
    // Check-in/Mood Meter questions (Sunlight)
    {
        id: 1,
        topic: "check-in",
        question:
            "When you feel overwhelmed, what's the first step in the Mood Meter process?",
        options: [
            "Take deep breaths",
            "Recognize what you're feeling",
            "Ask for help immediately",
            "Ignore the feeling",
        ],
        correctAnswer: 1,
        resource: "sunlight",
        explanation:
            "Recognition is the first step - you need to identify and name your emotions before you can work with them effectively.",
    },
    {
        id: 2,
        topic: "check-in",
        question:
            "Which emotion word shows the highest energy and most pleasant feeling?",
        options: ["Content", "Ecstatic", "Calm", "Satisfied"],
        correctAnswer: 1,
        resource: "sunlight",
        explanation:
            "Ecstatic represents high energy and high pleasantness on the Mood Meter - it's in the yellow quadrant.",
    },

    // Empathy questions (Water)
    {
        id: 3,
        topic: "empathy",
        question: "When a friend is upset, what's the most empathetic response?",
        options: [
            "Give them advice right away",
            "Listen and reflect their feelings",
            "Tell them it could be worse",
            "Change the subject",
        ],
        correctAnswer: 1,
        resource: "water",
        explanation:
            "Empathy starts with listening and reflecting back what you hear - showing you understand their perspective.",
    },
    {
        id: 4,
        topic: "empathy",
        question: 'What does it mean to "perspective-take"?',
        options: [
            "Agree with everyone",
            "Try to see things from another person's point of view",
            "Take photos from different angles",
            "Change your mind often",
        ],
        correctAnswer: 1,
        resource: "water",
        explanation:
            "Perspective-taking means imagining how someone else might think and feel in their situation.",
    },

    // Boundaries questions (Roots)
    {
        id: 5,
        topic: "boundaries",
        question: "What's a healthy way to say no to a request you can't handle?",
        options: [
            "Just ignore the request",
            'Say "I can\'t help with this right now, but I care about you"',
            "Make up an excuse",
            "Say yes but don't follow through",
        ],
        correctAnswer: 1,
        resource: "roots",
        explanation:
            "Healthy boundaries are clear, kind, and honest - you can say no while still showing you care.",
    },
    {
        id: 6,
        topic: "boundaries",
        question: "Why are boundaries important for relationships?",
        options: [
            "They keep people away",
            "They help maintain respect and prevent burnout",
            "They make you seem important",
            "They're not really necessary",
        ],
        correctAnswer: 1,
        resource: "roots",
        explanation:
            "Boundaries protect your well-being and actually strengthen relationships by creating mutual respect.",
    },

    // Seeking Help questions (Support Stakes)
    {
        id: 7,
        topic: "help",
        question: "When is it most important to seek help?",
        options: [
            "Only in emergencies",
            "When you feel overwhelmed or stuck",
            "Never - you should handle everything alone",
            "Only when others offer",
        ],
        correctAnswer: 1,
        resource: "stakes",
        explanation:
            "Seeking help when you feel overwhelmed prevents small problems from becoming bigger ones.",
    },
    {
        id: 8,
        topic: "help",
        question: "What's a good way to ask for help?",
        options: [
            "Demand immediate attention",
            "Be specific about what you need",
            "Hint until someone notices",
            "Wait for others to offer",
        ],
        correctAnswer: 1,
        resource: "stakes",
        explanation:
            "Being specific about what kind of help you need makes it easier for others to support you effectively.",
    },
];
