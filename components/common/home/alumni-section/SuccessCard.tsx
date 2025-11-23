"use client";

import { Briefcase, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface SuccessCardProps {
  name: string;
  role: string;
  company: string;
  image: string;
  testimonial: string;
  achievement: string;
  yearsOut: string;
  impact: string;
  isActive: boolean;
}

export function SuccessCard({
  name,
  role,
  company,
  image,
  testimonial,
  yearsOut,
  impact,
  isActive,
}: SuccessCardProps) {
  return (
    <div
      className={`flex-shrink-0 w-full transition-all duration-500 ${
        isActive ? "opacity-100 scale-100" : "opacity-50 scale-90"
      }`}
    >
      <Card className="bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/80 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
        <div className="flex gap-4 p-5 items-center">
          {/* Left Side - Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full border-3 border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10 p-1 shadow-lg relative">
              <Image
                src={image || "/placeholder.svg"}
                alt={name}
                fill
                className="object-cover rounded-full"
              />
              {/* Years out badge */}
              <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white">
                {yearsOut}y
              </div>
            </div>
          </div>

          {/* Middle Section - Info */}
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <h4 className="text-lg font-bold text-foreground">{name}</h4>
              <div className="flex items-center gap-2 text-xs text-foreground/70">
                <Briefcase className="w-3 h-3 text-primary" />
                <span>{role}</span>
              </div>
              <div className="text-xs font-semibold text-primary">
                {company}
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1 mb-2">
              <div className="bg-secondary/20 border border-secondary/40 text-foreground px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                <TrendingUp className="w-2.5 h-2.5" />
                {impact}
              </div>
            </div>

            {/* Testimonial */}
            <p className="text-xs text-foreground/75 italic leading-relaxed line-clamp-2">
              {testimonial}
            </p>
          </div>

          {/* Right Side - Accent */}
          <div className="flex-shrink-0 hidden sm:flex flex-col items-center justify-center">
            <div className="w-0.5 h-12 bg-gradient-to-b from-primary to-transparent rounded-full" />
            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1 animate-pulse" />
          </div>
        </div>
      </Card>
    </div>
  );
}
