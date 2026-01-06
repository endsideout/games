import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components";

export function ThreeDWellness(): React.JSX.Element {
  const wellnessDimensions = [
    {
      name: "Social Wellbeing",
      icon: "👥",
      description: "Building healthy relationships and community connections",
      color: "from-pink-50 to-purple-50",
      borderColor: "border-pink-300",
      textColor: "text-pink-800",
      buttonColor: "from-pink-500 to-purple-600",
      route: "/social-wellbeing"
    },
    {
      name: "Emotional Wellbeing",
      icon: "💝",
      description: "Understanding and managing emotions effectively",
      color: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-300",
      textColor: "text-purple-800",
      buttonColor: "from-purple-500 to-indigo-600",
      route: "/emotional-wellbeing"
    },
    {
      name: "Environmental Wellbeing",
      icon: "🌍",
      description: "Living in harmony with our natural environment",
      color: "from-green-50 to-teal-50",
      borderColor: "border-green-300",
      textColor: "text-green-800",
      buttonColor: "from-green-500 to-teal-600",
      route: "/environmental-wellbeing"
    },
    {
      name: "Financial Literacy",
      icon: "💰",
      description: "Making informed financial decisions and planning",
      color: "from-yellow-50 to-orange-50",
      borderColor: "border-yellow-300",
      textColor: "text-yellow-800",
      buttonColor: "from-yellow-500 to-orange-600",
      route: "/financial-literacy"
    },
    {
      name: "Intellectual Wellbeing",
      icon: "🧠",
      description: "Continuous learning and mental stimulation",
      color: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-300",
      textColor: "text-blue-800",
      buttonColor: "from-blue-500 to-cyan-600",
      route: "/intellectual-wellbeing"
    },
    {
      name: "Occupational Wellbeing",
      icon: "💼",
      description: "Finding purpose and satisfaction in work and activities",
      color: "from-indigo-50 to-blue-50",
      borderColor: "border-indigo-300",
      textColor: "text-indigo-800",
      buttonColor: "from-indigo-500 to-blue-600",
      route: "/occupational-wellbeing"
    },
    {
      name: "Physical Wellbeing",
      icon: "🏃‍♀️",
      description: "Maintaining health through exercise and nutrition",
      color: "from-red-50 to-pink-50",
      borderColor: "border-red-300",
      textColor: "text-red-800",
      buttonColor: "from-red-500 to-pink-600",
      route: "/physical-wellbeing"
    },
    {
      name: "Spiritual Wellbeing",
      icon: "🙏",
      description: "Finding meaning, purpose, and inner peace",
      color: "from-violet-50 to-purple-50",
      borderColor: "border-violet-300",
      textColor: "text-violet-800",
      buttonColor: "from-violet-500 to-purple-600",
      route: "/spiritual-wellbeing"
    }
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
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-blue-300 inline-block">
            <div className="flex items-center justify-center mb-4">
              <Logo size="md" className="mr-4" />
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                3D Wellness Dimensions
              </h1>
            </div>
            <p className="text-xl text-gray-700 max-w-2xl">
              Explore the eight dimensions of wellness through interactive games and learning experiences designed to promote holistic wellbeing.
            </p>
          </div>
        </div>

        {/* Wellness Dimensions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wellnessDimensions.map((dimension, index) => (
            <Link
              key={index}
              to={dimension.route}
              className={`bg-gradient-to-br ${dimension.color} rounded-2xl p-6 border-4 ${dimension.borderColor} shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 block`}
            >
              <div className="text-center">
                <div className="text-5xl mb-4">{dimension.icon}</div>
                <h3 className={`text-2xl font-bold mb-3 ${dimension.textColor}`}>
                  {dimension.name}
                </h3>
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  {dimension.description}
                </p>
                <div className={`inline-block px-4 py-2 bg-gradient-to-r ${dimension.buttonColor} text-white text-sm font-bold rounded-full shadow-lg`}>
                  Explore →
                </div>
              </div>
            </Link>
          ))}
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