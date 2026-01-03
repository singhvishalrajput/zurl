import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/authContext'
import { ArrowRight, Sparkles, X } from 'lucide-react'

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const handleCustomUrlClick = () => {
    if (user) {
      navigate('/create-url', { state: { enableCustomSlug: true } });
    } else {
      setShowLoginMessage(true);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(to right, #e5e7eb 1px, transparent 1px),
          linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>

      {/* Hero Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Lightning Fast URL Shortener</span>
          </div>

          {/* Main Heading with Animation */}
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Shorten URLs
            <br />
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent animate-gradient">Share Seamlessly</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform long, complex URLs into short, memorable links. Custom slugs and analytics available for registered users.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              to="/create-url"
              className="group px-8 py-4 bg-gray-900 text-white font-medium text-lg hover:bg-gray-800 transition-all cursor-pointer flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <span>Create Short URL</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={handleCustomUrlClick}
              className="px-8 py-4 bg-white text-gray-900 font-medium text-lg border-2 border-gray-900 hover:bg-gray-50 transition-colors cursor-pointer w-full sm:w-auto text-center"
            >
              Try Custom URLs
            </button>
          </div>

          {/* Stats or Features */}
          {/* <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">Fast</div>
              <div className="text-sm text-gray-600 mt-1">Instant Links</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">Secure</div>
              <div className="text-sm text-gray-600 mt-1">Safe & Reliable</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">Custom</div>
              <div className="text-sm text-gray-600 mt-1">Your Slugs</div>
            </div>
          </div> */}
        </div>
      </main>

      {/* Login Message Modal */}
      {showLoginMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="bg-white border-2 border-gray-900 p-6 max-w-md w-full mx-4">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Login Required</h2>
              <button
                onClick={() => setShowLoginMessage(false)}
                className="text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              You need to be logged in to create custom URL slugs. Please sign up or login to continue.
            </p>
            <div className="flex gap-4">
              <Link
                to="/signup"
                className="flex-1 px-4 py-2 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors text-center cursor-pointer"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="flex-1 px-4 py-2 bg-white text-gray-900 font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-center cursor-pointer"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage