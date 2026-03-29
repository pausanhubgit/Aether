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
    subtitle: "Shop today and get",
    discount: "20% discount",
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
      className={`relative py-16 md:py-24 overflow-hidden min-h-[500px] transition-colors duration-700 ${slides[currentSlide].bgClass}`}
    >
      <div className="container mx-auto px-4 relative z-10 w-full overflow-hidden">
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="w-full flex-shrink-0">
              <div className="flex flex-col md:flex-row items-center md:justify-between px-2 md:px-12 w-full">
                {/* Content */}
                <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">
                    {slide.title}
                  </h1>
                  <p className="text-xl mb-8 text-gray-700 dark:text-gray-200 transition-colors duration-300">
                    {slide.subtitle} <span className="font-semibold">{slide.discount}</span>
                  </p>
                  <div className="flex flex-col md:flex-row justify-center md:justify-start gap-y-3 gap-x-5">
                    <Link
                      href={slide.link}
                      className={`font-medium px-6 py-3 rounded-lg text-center transition shadow-md ${slide.btn1Class}`}
                    >
                      {slide.btn1}
                    </Link>
                    <Link
                      href={slide.link}
                      className={`font-medium px-6 py-3 rounded-lg text-center transition shadow-md ${slide.btn2Class}`}
                    >
                      {slide.btn2}
                    </Link>
                  </div>
                </div>
                {/* Image */}
                <div className="md:w-1/2 flex justify-center md:justify-end">
                  <Image
                    src={slide.image}
                    className="max-w-full rounded-xl shadow-xl lg:w-3/4 object-cover aspect-[4/3] bg-white/10"
                    alt={slide.title}
                    priority={slide.id === 1}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slider Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-black/10 hover:bg-black/20 text-black dark:bg-white/20 dark:hover:bg-white/40 dark:text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-colors z-20 pointer-events-auto shadow-sm"
        aria-label="Previous Slide"
      >
        &#10094;
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-black/10 hover:bg-black/20 text-black dark:bg-white/20 dark:hover:bg-white/40 dark:text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-colors z-20 pointer-events-auto shadow-sm"
        aria-label="Next Slide"
      >
        &#10095;
      </button>

      {/* Slider Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === currentSlide 
                ? "w-8 bg-black dark:bg-white" 
                : "w-2.5 bg-black/30 dark:bg-white/30"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
