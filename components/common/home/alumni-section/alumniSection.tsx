"use client";
//
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SuccessCard } from "./SuccessCard";
// import { SuccessCard } from "@/components/success-card"

export function AlumniSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % alumni.length);
    }, 5000);
    console.log({ interval });
    return () => clearInterval(interval);
  }, []);

  const alumni = [
    {
      name: "Sarah Chen",
      role: "Senior Product Designer",
      company: "TechVenture Inc.",
      image: "/avater-1.jpg",
      testimonial:
        "This institution shaped my career in ways I never imagined. The mentorship and network I gained here became the foundation for my success in tech.",
      achievement: "Led design for 50M+ users",
      yearsOut: "8",
      impact: "Design Excellence",
    },
    {
      name: "Marcus Johnson",
      role: "Founder & CEO",
      company: "DataFlow Solutions",
      image: "/avater-2.jpg",
      testimonial:
        "The skills and confidence I developed here empowered me to launch my own company. I owe so much to the incredible community.",
      achievement: "$500M company valuation",
      yearsOut: "6",
      impact: "Entrepreneurship",
    },
    {
      name: "Amara Okonkwo",
      role: "Lead Engineer",
      company: "CloudSync Systems",
      image: "/avater-1.jpg",
      testimonial:
        "Being part of this community opened doors I didn't know existed. The connections made here are lifelong and invaluable.",
      achievement: "Patents in cloud infrastructure",
      yearsOut: "5",
      impact: "Innovation",
    },
  ];

  return (
    <section className="w-full bg-linear-to-b from-background to-muted/40 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-black" />
            <span className="text-sm font-medium text-yellow-400">
              Our Alumni Network
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Where Excellence Continues Beyond Graduation
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-pretty">
            Join thousands of successful graduates shaping industries, leading
            innovations, and making meaningful impact across the globe.
          </p>
        </div>

        <div className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Achievements */}
            <div className="bg-linear-to-br from-primary/20 via-secondary/10 to-background border border-primary/20 rounded-2xl p-8 lg:p-10">
              <h3 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Award className="w-6 h-6 text-black" />
                </div>
                Alumni Achievements
              </h3>
              <ul className="space-y-4">
                {[
                  "Led 5+ Fortune 500 companies",
                  "Founded 200+ startups with combined $2B+ valuation",
                  "Published 500+ peer-reviewed research papers",
                  "Won 50+ international innovation awards",
                  "Established scholarship funds for 1000+ students",
                ].map((achievement, i) => (
                  <li key={i} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1 group-hover:bg-primary/40 transition-colors duration-300">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                    <span className="text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                      {achievement}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side - Stats Box */}
            <div className="flex flex-col gap-6 mt-4.5">
              <div className="bg-linear-to-tl from-secondary/5 to-primary/20 border border-primary/20 rounded-2xl p-8 flex flex-col justify-center min-h-56">
                <p className="text-foreground/70 mb-6 leading-relaxed">
                  Our alumni community is more than just a network—it's a
                  lifelong bond of mentorship, collaboration, and shared
                  success.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-primary/20">
                    <span className="text-foreground/70 font-medium">
                      Avg. Salary Increase
                    </span>
                    <span className="text-2xl font-bold text-black">+45%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-primary/20">
                    <span className="text-foreground/70 font-medium">
                      Career Growth Rate
                    </span>
                    <span className="text-2xl font-bold text-black">92%</span>
                  </div>
                  <p className="text-xs text-foreground/50 mt-4">
                    Based on alumni survey data from last 5 years
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative mb-10">
          <div className="flex items-center justify-center overflow-hidden">
            <div className="flex gap-4 justify-center items-center w-full max-w-6xl px-4">
              {/* Previous Card */}
              <div className="hidden lg:block w-1/4 flex-shrink-0">
                <SuccessCard
                  {...alumni[(activeSlide - 1 + alumni.length) % alumni.length]}
                  isActive={false}
                />
              </div>

              {/* Center Card - Main Focus */}
              <div className="w-full lg:w-1/2 flex-shrink-0">
                <SuccessCard {...alumni[activeSlide]} isActive={true} />
              </div>

              {/* Next Card */}
              <div className="hidden lg:block w-1/4 flex-shrink-0">
                <SuccessCard
                  {...alumni[(activeSlide + 1) % alumni.length]}
                  isActive={false}
                />
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() =>
              setActiveSlide(
                (prev) => (prev - 1 + alumni.length) % alumni.length
              )
            }
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-primary hover:bg-primary/90 text-black-foreground p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveSlide((prev) => (prev + 1) % alumni.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-primary hover:bg-primary/90 text-black-foreground p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next story"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicator dots */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {alumni.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === activeSlide
                    ? "bg-primary w-10 h-3 shadow-lg shadow-primary/50"
                    : "bg-gray-300 w-3 h-3 hover:bg-gray-400 cursor-pointer"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-r from-primary/15 via-secondary/10 to-primary/15 p-12 lg:p-16">
          {/* Background accent */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Be Part of Our Growing Community
            </h3>
            <p className="text-lg text-foreground/70 mb-10 max-w-2xl">
              Whether you're a current student or a graduate, join our network
              and connect with thousands of accomplished alumni shaping the
              future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
              <Button className="bg-primary hover:bg-secondary text-black-foreground px-8 py-6 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:gap-3 text-base">
                Join the Network
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                className="px-8 py-6 rounded-full font-semibold bg-background hover:bg-muted border-primary/40 text-base"
              >
                Explore Opportunities
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
