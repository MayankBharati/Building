import React from "react";
import { Mail, Lock, ArrowRight, MessageCircle } from "lucide-react";

// Custom Card Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 border-b ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = "" }) => (
  <div className={`p-6 border-t ${className}`}>
    {children}
  </div>
);

const Home = () => {
  const handleLogin = async () => {
    try {
      const response = await fetch("https://inbox-ai-backend.vercel.app/get-url");
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error("Error fetching auth URL", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      {/* Navigation */}
      <nav className="w-full p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Earthworm.AI
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col md:flex-row max-w-6xl gap-8 items-center">
          {/* Left Side - Features */}
          <div className="w-full md:w-1/2 space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">
              Access Your Email Intelligence
            </h1>
            <p className="text-lg text-gray-600">
              Transform your email experience with AI-powered insights and smart organization
            </p>
            <div className="space-y-4">
              {[
                'Smart email categorization',
                'Priority inbox management',
                'AI-powered response suggestions',
                'Seamless Gmail integration'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="w-full md:w-1/2 max-w-md">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-center text-gray-800">
                  Get Started
                </h2>
                <p className="text-center text-gray-600">
                  Connect your email to begin
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center space-x-2 bg-white border-2 border-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span>Continue with Google</span>
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Protected by
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">End-to-end encryption</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Email privacy</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-center text-sm text-gray-500">
                  By continuing, you agree to our Terms of Service
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;