import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components";

export const TDW_SET1_GAMES = [
  {
    number: 1,
    name: "Principle of Relationship",
    description: "Match relationship principles and discover the building blocks of healthy connections!",
    icon: "🤝💬",
    route: "/principle-of-relationship-pair-matching-game",
    dimension: "Social Wellbeing",
    color: "from-pink-50 to-purple-50",
    border: "border-pink-300",
    text: "text-pink-800",
    btnBg: "linear-gradient(135deg, #ec4899, #a855f7)",
  },
  {
    number: 2,
    name: "Emotional Detective",
    description: "Identify emotions in real-life scenarios and build emotional intelligence!",
    icon: "🔍💝",
    route: "/emotion-detective-game",
    dimension: "Emotional Wellbeing",
    color: "from-purple-50 to-indigo-50",
    border: "border-purple-300",
    text: "text-purple-800",
    btnBg: "linear-gradient(135deg, #7c3aed, #4f46e5)",
  },
  {
    number: 3,
    name: "Eco Sort Challenge",
    description: "Sort items into eco-friendly categories and protect the planet!",
    icon: "♻️🌍",
    route: "/environmental-wellbeing/eco-fix-it",
    dimension: "Environmental Wellbeing",
    color: "from-green-50 to-teal-50",
    border: "border-green-300",
    text: "text-green-800",
    btnBg: "linear-gradient(135deg, #16a34a, #0d9488)",
  },
  {
    number: 4,
    name: "Budgeting Jars",
    description: "Learn smart money management by sorting coins into the right jars!",
    icon: "💰🏦",
    route: "/budgeting-game",
    dimension: "Financial Literacy",
    color: "from-yellow-50 to-orange-50",
    border: "border-yellow-300",
    text: "text-yellow-800",
    btnBg: "linear-gradient(135deg, #d97706, #ea580c)",
  },
  {
    number: 5,
    name: "Study Habits Sort",
    description: "Sort good and bad study habits to build smarter learning routines!",
    icon: "📚🧠",
    route: "/study-habits-game",
    dimension: "Intellectual Wellbeing",
    color: "from-blue-50 to-cyan-50",
    border: "border-blue-300",
    text: "text-blue-800",
    btnBg: "linear-gradient(135deg, #2563eb, #0891b2)",
  },
  {
    number: 6,
    name: "Dream Job Builder",
    description: "Explore careers and build your dream job path step by step!",
    icon: "💼🌟",
    route: "/dream-job-builder",
    dimension: "Occupational Wellbeing",
    color: "from-indigo-50 to-blue-50",
    border: "border-indigo-300",
    text: "text-indigo-800",
    btnBg: "linear-gradient(135deg, #4f46e5, #2563eb)",
  },
  {
    number: 7,
    name: "Healthy Plate Builder",
    description: "Build a balanced meal by placing foods in the right sections of the plate!",
    icon: "🥗🏃",
    route: "/healthy-plate",
    dimension: "Physical Wellbeing",
    color: "from-red-50 to-pink-50",
    border: "border-red-300",
    text: "text-red-800",
    btnBg: "linear-gradient(135deg, #dc2626, #db2777)",
  },
  {
    number: 8,
    name: "Surya Namaskar",
    description: "Follow the sun salutation sequence and find your inner calm!",
    icon: "🙏🌅",
    route: "/surya-namaskar",
    dimension: "Spiritual Wellbeing",
    color: "from-violet-50 to-purple-50",
    border: "border-violet-300",
    text: "text-violet-800",
    btnBg: "linear-gradient(135deg, #7c3aed, #a855f7)",
  },
];

export const TDW_SET1_BACK_PARAM = "?from=3dw-set1";

export function ThreeDWellnessSet1(): React.JSX.Element {
  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #d1fae5 40%, #ede9fe 100%)" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-blue-300 inline-block">
            <Logo size="md" className="mx-auto mb-3" />
            <div className="text-5xl mb-2">🌟</div>
            <h1 className="text-4xl font-black text-gray-800 mb-1">Set 1</h1>
            <p className="text-gray-500 text-sm">One game from each wellness dimension!</p>
            <div className="flex justify-center gap-4 mt-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-2">
                <span className="text-blue-700 font-black text-sm">{TDW_SET1_GAMES.length} Games</span>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl px-4 py-2">
                <span className="text-green-700 font-black text-sm">~15 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Game grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
          {TDW_SET1_GAMES.map((game) => (
            <Link
              key={game.number}
              to={`${game.route}${TDW_SET1_BACK_PARAM}`}
              className={`bg-gradient-to-br ${game.color} rounded-3xl border-4 ${game.border} shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 flex flex-col items-center text-center p-6`}
            >
              {/* Number badge */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm shadow mb-3 self-start"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
              >
                {game.number}
              </div>

              {/* Icon */}
              <div className="text-5xl mb-4" style={{ lineHeight: 1 }}>{game.icon}</div>

              {/* Name */}
              <p className={`font-black text-base leading-snug mb-1 ${game.text}`}>{game.name}</p>

              {/* Dimension tag */}
              <span className="text-xs font-bold text-gray-400 bg-white/70 rounded-full px-2 py-0.5 mb-4">
                {game.dimension}
              </span>

              {/* Description */}
              <p className="text-gray-600 text-xs leading-snug mb-4 flex-1">{game.description}</p>

              {/* Play button */}
              <div
                className="w-full py-2 rounded-full text-white text-sm font-black shadow"
                style={{ background: game.btnBg }}
              >
                Play →
              </div>
            </Link>
          ))}
        </div>

        {/* Play All */}
        <div className="text-center space-y-3">
          <Link
            to={`${TDW_SET1_GAMES[0].route}${TDW_SET1_BACK_PARAM}`}
            className="inline-block px-10 py-5 text-white text-xl font-black rounded-full shadow-xl hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)" }}
          >
            ▶ Play All in Order
          </Link>
          <div>
            <Link to="/3d-wellness" className="text-gray-500 hover:text-gray-700 font-semibold text-sm">
              ← Back to 3D Wellness
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
