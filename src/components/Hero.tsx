"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface BannerSlide {
  id: number;
  src: string;
  alt: string;
  title: string;
}

const SLIDES: BannerSlide[] = [
  {
    id: 1,
    src: "/Referral Programme Healthcare Partnership Banner.png",
    alt: "Referral Programme Healthcare Partnership Banner",
    title: "Healthcare Referral Programme",
  },
  {
    id: 2,
    src: "/Flexible CRA Partnership Models.png",
    alt: "Flexible CRA Partnership Models",
    title: "Flexible CRA Partnership Models",
  },
  {
    id: 3,
    src: "/Seamless Diagnostics, Stronger Connections.png",
    alt: "Seamless Diagnostics, Stronger Connections",
    title: "Seamless Diagnostics, Stronger Connections",
  },
  {
    id: 4,
    src: "/Refer, Track, Earn in Healthcare.png",
    alt: "Refer, Track, Earn in Healthcare",
    title: "Refer, Track, and Earn in Healthcare",
  },
];

const AUTO_SCROLL_DELAY = 5000; // 5 seconds per slide

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Manual navigation handlers
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, AUTO_SCROLL_DELAY);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch handlers for mobile swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45; // Minimum px to count as a swipe
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  return (
    <section
      id="hero"
      aria-label="AVMLabs Referral Programme Banners"
      className="w-full bg-gradient-to-b from-white via-slate-50/50 to-[#f8fafc] pt-0 pb-3 sm:pb-5 lg:pb-6"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Promotional Banners Carousel"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200/90 bg-slate-900 group select-none focus:outline-none focus:ring-2 focus:ring-[#1c1950]/30"
        >
          {/* Slides Track */}
          <div
            className="flex transition-transform duration-700 ease-in-out will-change-transform"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {SLIDES.map((slide, idx) => (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${idx + 1} of ${SLIDES.length}: ${slide.title}`}
                className="w-full shrink-0 relative aspect-[16/9] sm:aspect-[2/1] bg-slate-100 flex items-center justify-center overflow-hidden"
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 95vw, 1280px"
                  priority={idx === 0}
                  className="object-cover sm:object-contain w-full h-full"
                />
              </div>
            ))}
          </div>

          {/* Manual Scroll: Previous Arrow Button (Visible only on hover) */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-md backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:scale-105 active:scale-95 cursor-pointer focus:opacity-100 focus:pointer-events-auto focus:outline-none"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Manual Scroll: Next Arrow Button (Visible only on hover) */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-md backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:scale-105 active:scale-95 cursor-pointer focus:opacity-100 focus:pointer-events-auto focus:outline-none"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Bottom Bar: Indicators + Slide Counter */}
          <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full transition-colors">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                className={`transition-all duration-300 rounded-full cursor-pointer h-2 sm:h-2.5 ${
                  currentIndex === idx
                    ? "w-6 sm:w-8 bg-white shadow-xs"
                    : "w-2 sm:w-2.5 bg-white/45 hover:bg-white/75"
                }`}
              />
            ))}
          </div>

          {/* Auto Scroll Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 z-20">
            <div
              key={currentIndex}
              className={`h-full bg-[#1c1950] ${
                !isPaused ? "animate-slide-progress" : ""
              }`}
              style={{
                animationDuration: `${AUTO_SCROLL_DELAY}ms`,
                animationPlayState: isPaused ? "paused" : "running",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
