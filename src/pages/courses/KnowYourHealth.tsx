import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components";

export function KnowYourHealth(): React.JSX.Element {
  const healthCategories = [
    {
      name: "Fruit & Veggie Quiz",
      icon: "🌳",
      description: "Choose if it's a fruit or a vegetable. Each correct answer grows your tree!",
      color: "from-blue-50 to-green-50",
      borderColor: "border-blue-300",
      textColor: "text-blue-800",
      buttonColor: "from-blue-500 to-green-600",
      comingSoon: false,
      route: "/fruit-veggie-quiz",
    },
    {
      name: "Fruit & Vegetable Matching Game",
      icon: "🍎🥕",
      description: "Test your knowledge! Drag fruits and vegetables to their correct columns",
      color: "from-green-50 to-orange-50",
      borderColor: "border-green-300",
      textColor: "text-green-800",
      buttonColor: "from-green-500 to-orange-600",
      comingSoon: false,
      route: "/fruit-vegetable-matching-game",
    },
    {
      name: "Body Systems",
      icon: "🫀",
      description: "Learn how your heart, lungs, and other organs keep you healthy",
      color: "from-red-50 to-pink-50",
      borderColor: "border-red-300",
      textColor: "text-red-800",
      buttonColor: "from-red-500 to-pink-600",
      comingSoon: true,
    },
    {
      name: "Nutrition Basics",
      icon: "🥗",
      description: "Understand what fuels your body and how to make healthy food choices",
      color: "from-green-50 to-lime-50",
      borderColor: "border-green-300",
      textColor: "text-green-800",
      buttonColor: "from-green-500 to-lime-600",
      comingSoon: true,
    },
    {
      name: "Mental Health",
      icon: "🧠",
      description: "Explore the connection between mind, mood, and overall health",
      color: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-300",
      textColor: "text-purple-800",
      buttonColor: "from-purple-500 to-indigo-600",
      comingSoon: true,
    },
    {
      name: "Sleep & Rest",
      icon: "😴",
      description: "Discover why sleep is essential and how to build healthy habits",
      color: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-300",
      textColor: "text-blue-800",
      buttonColor: "from-blue-500 to-cyan-600",
      comingSoon: true,
    },
    {
      name: "Physical Activity",
      icon: "🏃",
      description: "Find out how movement and exercise strengthen your body and mind",
      color: "from-orange-50 to-yellow-50",
      borderColor: "border-orange-300",
      textColor: "text-orange-800",
      buttonColor: "from-orange-500 to-yellow-600",
      comingSoon: true,
    },
  ];

  return (
    <div
      className="min-h-screen py-8"
      style={{
        background:
          "linear-gradient(135deg, #4FC3F7 0%, #81C784 25%, #FFB74D 50%, #BA68C8 75%, #F06292 100%)",
        backgroundImage: `
             radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 30%),
             radial-gradient(circle at 85% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 40%),
             radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 60%),
             url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
           `,
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-green-300 inline-block">
            <div className="flex items-center justify-center mb-4">
              <Logo size="md" className="mr-4" />
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
                Know Your Health
              </h1>
            </div>
            <p className="text-xl text-gray-700 max-w-2xl">
              Discover the building blocks of a healthy life through fun, interactive games and learning experiences.
            </p>
          </div>
        </div>

        {/* Health Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthCategories.map((category, index) =>
            !category.comingSoon && category.route ? (
              <Link
                key={index}
                to={category.route}
                className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 border-4 ${category.borderColor} shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 block`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className={`text-2xl font-bold mb-3 ${category.textColor}`}>
                    {category.name}
                  </h3>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    {category.description}
                  </p>
                  <div className={`inline-block px-4 py-2 bg-gradient-to-r ${category.buttonColor} text-white text-sm font-bold rounded-full shadow-lg`}>
                    🎮 Play Now!
                  </div>
                </div>
              </Link>
            ) : (
              <div
                key={index}
                className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 border-4 ${category.borderColor} shadow-xl opacity-80`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className={`text-2xl font-bold mb-3 ${category.textColor}`}>
                    {category.name}
                  </h3>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    {category.description}
                  </p>
                  <div className="inline-block px-4 py-2 bg-gray-300 text-gray-500 text-sm font-bold rounded-full shadow cursor-not-allowed">
                    Coming Soon
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
