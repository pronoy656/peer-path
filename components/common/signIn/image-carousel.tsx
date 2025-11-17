"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const carouselImages = [
  {
    src: "/ulab-campus-1.jpg",
    title: "ULAB CAMPUS",
    subtitle: "UNIVERSITY OF LIBERAL\nARTS BANGLADESH",
  },
  {
    src: "/ulab-campus-2.jpg",
    title: "ULAB CAMPUS",
    subtitle: "UNIVERSITY OF LIBERAL\nARTS BANGLADESH",
  },
  {
    src: "/ulab-campus-3.jpg",
    title: "ULAB CAMPUS",
    subtitle: "UNIVERSITY OF LIBERAL\nARTS BANGLADESH",
  },
  {
    src: "/ulab-campus-1.jpg",
    title: "ULAB CAMPUS",
    subtitle: "UNIVERSITY OF LIBERAL\nARTS BANGLADESH",
  },
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [nextIndex, setNextIndex] = useState(1);

  useEffect(() => {
    if (!isAutoplay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [isAutoplay]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoplay(false);
  };
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Image Container */}
      <div className="relative w-full h-full">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000ms ease-out ${
              index === currentIndex
                ? "opacity-100 translate-x-0"
                : index === nextIndex
                ? "opacity-0 translate-x-full"
                : "opacity-0 -translate-x-full"
            }`}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <h2 className="text-5xl font-bold text-white mb-4 animate-slide-down">
                {image.title}
              </h2>
              <p
                className="text-2xl text-white font-light tracking-widest animate-slide-down"
                style={{ animationDelay: "0.1s" }}
              >
                {image.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 rounded-full ${
              index === currentIndex
                ? "bg-white w-8 h-1"
                : "bg-white/50 w-6 h-1 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play Resume on Hover */}
      <div
        className="absolute inset-0 z-5"
        onMouseLeave={() => setIsAutoplay(true)}
      />
    </div>
  );
}
