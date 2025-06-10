import { assets } from "@/assets/assets"
import Image from "next/image"

const Banner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 rounded-3xl mx-4 my-16 shadow-xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-300 rounded-full blur-2xl"></div>
        </div>
      </div>

      <div className="relative flex flex-col lg:flex-row items-center justify-between min-h-[500px] p-8 lg:p-16">
        {/* Left Product Image */}
        <div className="flex-shrink-0 mb-8 lg:mb-0">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full blur-2xl opacity-20 scale-110"></div>
            <Image
              className="relative z-10 max-w-48 lg:max-w-64 hover:scale-105 transition-transform duration-300"
              src={assets.jbl_soundbox_image || "/placeholder.svg"}
              alt="JBL Soundbox"
            />
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 text-center px-4 lg:px-8">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold mb-4">
              🎮 Gaming Special
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Level Up Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
                Gaming Experience
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
              From immersive sound to precise controls—everything you need to dominate the game
            </p>
          </div>

          <button className="group inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <span>Shop Gaming Gear</span>
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </button>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8 text-sm text-gray-600">
            <div className="text-center">
              <div className="font-bold text-2xl text-gray-900">50K+</div>
              <div>Happy Gamers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-gray-900">4.9★</div>
              <div>Rating</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-gray-900">24/7</div>
              <div>Support</div>
            </div>
          </div>
        </div>

        {/* Right Product Image */}
        <div className="flex-shrink-0 mt-8 lg:mt-0">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur-2xl opacity-20 scale-110"></div>
            <Image
              className="relative z-10 max-w-64 lg:max-w-80 hover:scale-105 transition-transform duration-300 hidden lg:block"
              src={assets.md_controller_image || "/placeholder.svg"}
              alt="Gaming Controller"
            />
            <Image
              className="relative z-10 max-w-48 hover:scale-105 transition-transform duration-300 lg:hidden"
              src={assets.sm_controller_image || "/placeholder.svg"}
              alt="Gaming Controller"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner

