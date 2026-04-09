"use client";

import { ART_ROUTE } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import heroImg from "@/assets/images/Background/butterfly.jpg";
import musicImg from "@/assets/images/home/music.jpg";
import videoImg from "@/assets/images/home/video.jpg";

const slides = [
  { 
    id: 1, 
    image: heroImg, 
    title: "New Amazing Arts Collection",
    subtitle: "Discover creative masterpieces and find",
    discount: "your inspiration",
    btn1: "Shop Now",
    btn2: "View Categories",
    link: ART_ROUTE,
    bgClass: "bg-purple-50 dark:bg-[#1a0533]",
    btn1Class: "bg-purple-600 !text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400",
    btn2Class: "border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:border-purple-500 dark:text-purple-400 dark:hover:bg-white/5"
  },
  { 
    id: 2, 
    image: musicImg, 
    title: "Discover Melodious Tunes",
    subtitle: "Explore our collection and get",
    discount: "special offers",
    btn1: "Listen Now",
    btn2: "View Genres",
    link: "/music",
    bgClass: "bg-blue-50 dark:bg-blue-900/40",
    btn1Class: "bg-blue-700 !text-white hover:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-600",
    btn2Class: "border-2 border-blue-700 text-blue-700 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/40"
  },
  { 
    id: 3, 
    image: videoImg, 
    title: "Watch Captivating Videos",
    subtitle: "Stream today and get",
    discount: "premium access",
    btn1: "Watch Now",
    btn2: "Browse Videos",
    link: "/video",
    bgClass: "bg-teal-50 dark:bg-teal-900/40",
    btn1Class: "bg-teal-700 !text-white hover:bg-teal-800 dark:bg-teal-500 dark:hover:bg-teal-600",
    btn2Class: "border-2 border-teal-700 text-teal-700 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900/40"
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section
      id="home"
      className={`relative py-10 md:py-16 lg:py-20 overflow-hidden min-h-[450px] flex items-center transition-colors duration-700 ${slides[currentSlide].bgClass}`}
    >
      <div className="container-7xl relative z-10 w-full overflow-hidden">
        <div 
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ 
            width: `${slides.length * 100}%`, 
            transform: `translateX(-${(currentSlide * 100) / slides.length}%)` 
          }}
        >
          {slides.map((slide) => (
            <div 
              key={slide.id} 
              className="flex-shrink-0 px-4 md:px-12 lg:px-20"
              style={{ width: `${100 / slides.length}%` }}
            >
              <div className="flex flex-col-reverse md:flex-row items-center md:justify-between w-full gap-12 lg:gap-24 max-w-[1400px] mx-auto">
                {/* Content */}
                <div className="w-full md:w-1/2 text-center md:text-left z-10 space-y-6 md:space-y-8">
                  <div className="space-y-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 text-gray-900 dark:text-white transition-colors duration-300 leading-[1.1] tracking-tight text-balance">
                      {slide.title}
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-200 transition-colors duration-300 max-w-xl mx-auto md:mx-0 leading-relaxed">
                      {slide.subtitle} <span className="font-bold text-primary underline decoration-primary/30 underline-offset-4">{slide.discount}</span>
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-4">
                    <Link
                      href={slide.link}
                      className={`group relative overflow-hidden font-black uppercase tracking-widest text-xs px-10 py-4 rounded-2xl text-center transition-all shadow-2xl hover:scale-105 active:scale-95 w-full sm:w-auto ${slide.btn1Class}`}
                    >
                      <span className="relative z-10">{slide.btn1}</span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </Link>
                    <Link
                      href={slide.link}
                      className={`font-black uppercase tracking-widest text-xs px-10 py-4 rounded-2xl text-center transition-all shadow-lg border-2 hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 w-full sm:w-auto ${slide.btn2Class}`}
                    >
                      {slide.btn2}
                    </Link>
                  </div>
                </div>

                {/* Image */}
                <div className="w-full md:w-1/2 flex justify-center md:justify-end relative group py-8 md:py-0">
                  <div className="relative w-full aspect-square sm:aspect-video md:aspect-[4/3] max-w-[450px] flex items-center justify-center">
                    <Image
                      src={slide.image}
                      className="w-full h-full rounded-[3rem] object-cover transition-all duration-700 group-hover:scale-[1.03] group-hover:-rotate-1"
                      alt={slide.title}
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slider Controls */}
      <div className="container-7xl absolute inset-0 pointer-events-none flex items-center justify-between z-20 hidden md:flex">
        <button 
          onClick={prevSlide}
          className="pointer-events-auto p-4 bg-white/80 dark:bg-[#1a0533]/80 hover:bg-white dark:hover:bg-[#1a0533] text-gray-900 dark:text-white rounded-2xl transition-all shadow-2xl backdrop-blur-md group -translate-x-1/2"
          aria-label="Previous Slide"
        >
          <span className="block group-hover:-translate-x-1 transition-transform">&#10094;</span>
        </button>
        <button 
          onClick={nextSlide}
          className="pointer-events-auto p-4 bg-white/80 dark:bg-[#1a0533]/80 hover:bg-white dark:hover:bg-[#1a0533] text-gray-900 dark:text-white rounded-2xl transition-all shadow-2xl backdrop-blur-md group translate-x-1/2"
          aria-label="Next Slide"
        >
          <span className="block group-hover:translate-x-1 transition-transform">&#10095;</span>
        </button>
      </div>

      {/* Slider Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-500 rounded-full ${
              index === currentSlide 
                ? "w-12 h-2.5 bg-primary shadow-lg shadow-primary/20" 
                : "w-2.5 h-2.5 bg-gray-300 dark:bg-gray-700 hover:bg-primary/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
