"use client"

import { useState, useEffect } from "react"
import { assets } from "@/assets/assets"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Experience Pure Sound",
      subtitle: "Your Perfect Headphones Awaits!",
      offer: "Limited Time Offer 30% Off",
      buttonText1: "Shop Now",
      buttonText2: "Learn More",
      imgSrc: assets.header_headphone_image || "/placeholder.svg",
      gradient: "from-purple-600 to-blue-600",
    },
    {
      id: 2,
      title: "Next-Level Gaming",
      subtitle: "Discover PlayStation 5 Today!",
      offer: "Hurry up only few left!",
      buttonText1: "Buy Now",
      buttonText2: "View Details",
      imgSrc: assets.header_playstation_image || "/placeholder.svg",
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      id: 3,
      title: "Power Meets Elegance",
      subtitle: "Apple MacBook Pro is Here!",
      offer: "Exclusive Deal 40% Off",
      buttonText1: "Order Now",
      buttonText2: "Compare Models",
      imgSrc: assets.header_macbook_image || "/placeholder.svg",
      gradient: "from-gray-700 to-gray-900",
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [sliderData.length, isAutoPlay])

  const handleSlideChange = (index) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length)
  }

  return (
    <div className="relative overflow-hidden rounded-3xl mx-4 my-8 shadow-2xl">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className={`relative flex flex-col-reverse lg:flex-row items-center justify-between bg-gradient-to-br ${slide.gradient} py-12 lg:py-16 px-6 lg:px-16 min-w-full min-h-[500px]`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 lg:w-1/2 text-center lg:text-left text-white">
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                {slide.offer}
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                {slide.title}
                <span className="block text-2xl lg:text-3xl font-normal text-white/90 mt-2">
                  {slide.subtitle}
                </span>
              </h1>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-8">
                <button className="group px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  {slide.buttonText1}
                </button>
                <button className="group flex items-center gap-2 px-6 py-4 text-white hover:text-white/80 font-medium transition-colors">
                  <span>{slide.buttonText2}</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Product Image */}
            <div className="relative z-10 lg:w-1/2 flex items-center justify-center mb-8 lg:mb-0">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl scale-110"></div>
                <Image
                  className="relative z-10 w-64 lg:w-80 xl:w-96 hover:scale-105 transition-transform duration-300"
                  src={slide.imgSrc || "/placeholder.svg"}
                  alt={`${slide.title} - ${slide.subtitle}`}
                  width={400}
                  height={400}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all duration-200 text-white"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all duration-200 text-white"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {sliderData.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentSlide === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Auto-play Toggle */}
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all duration-200 text-white"
        >
          {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

export default HeaderSlider

