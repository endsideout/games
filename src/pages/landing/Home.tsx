import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components";

export function Home(): React.JSX.Element {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
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
      <div className="text-center p-12 bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl border-8 border-yellow-300 max-w-7xl w-full mx-4">
        <div className="flex items-center justify-center mb-8">
          <Logo size="lg" className="mr-6" />
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            EndsideOut Games
          </h1>
        </div>

        {/* 3D Wellness Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* 3D Wellness */}
            <Link
              to="/3d-wellness"
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-4 border-blue-300 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 block"
            >
              <div className="text-6xl mb-4">🌟</div>
              <h2 className="text-3xl font-bold mb-4 text-blue-800">
                3D Wellness
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Explore comprehensive wellness through our interactive games and learning experiences.
              </p>
              <div className="text-center">
                <span className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold rounded-full shadow-lg">
                  Explore Now →
                </span>
              </div>
            </Link>

            {/* Coming Soon 1 */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-4 border-gray-300 shadow-lg opacity-75">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-3xl font-bold mb-4 text-gray-600">
                Coming Soon
              </h2>
              <p className="text-lg text-gray-500 mb-6">
                Exciting new wellness programs are in development. Stay tuned!
              </p>
              <div className="text-center">
                <span className="inline-block px-6 py-3 bg-gray-300 text-gray-500 text-lg font-bold rounded-full shadow-lg cursor-not-allowed">
                  Coming Soon
                </span>
              </div>
            </div>

            {/* Coming Soon 2 */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-4 border-gray-300 shadow-lg opacity-75">
              <div className="text-6xl mb-4">🌱</div>
              <h2 className="text-3xl font-bold mb-4 text-gray-600">
                Coming Soon
              </h2>
              <p className="text-lg text-gray-500 mb-6">
                More wellness dimensions and interactive experiences coming your way!
              </p>
              <div className="text-center">
                <span className="inline-block px-6 py-3 bg-gray-300 text-gray-500 text-lg font-bold rounded-full shadow-lg cursor-not-allowed">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border-4 border-green-300 shadow-xl">
          <h2 className="text-4xl font-bold mb-6 text-green-800 text-center">
            Our Mission
          </h2>
          <div className="text-left max-w-4xl mx-auto text-lg text-gray-700 leading-relaxed space-y-4">
            <p>
              EndsideOut (EO) envisions a future where communities thrive in complete physical, mental, and emotional wellness. We aspire to create a culture of health where youth, families, and communities are equipped with the knowledge, resources, and opportunities to make sustainable, life-affirming choices.
            </p>
            <p>
              Our vision is rooted in the belief that healthy children are the foundation of healthy communities, and that health equity and literacy is essential to a just and thriving society. Our programs are rooted in a public health and social determinants lens and are designed to equip youth and community members with holistic skills to make healthy decisions. We see a future where barriers to optimal health are dismantled, and all individuals have access to the tools and education needed to live vibrant, fulfilling lives.
            </p>
            <p>
              Through our pillars of Education, Community Outreach, and Collaboration, we cultivate lasting partnerships and collective action that extend beyond individual programs. These pillars represent our enduring commitment to building sustainable pathways toward wellness – empowering communities from the inside out and shaping generations of health-conscious leaders.
            </p>
            <p>
              Our vision is a world where wellness knows no barriers, possibilities are limitless, and every child, community, and society has full access to the opportunity to prosper.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
