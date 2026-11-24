"use client";

import { Briefcase, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface SuccessCardProps {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  testimonial: string;
  batch: string;
  impact: string;
  isActive: boolean;
}

export function SuccessCard({
  id,
  name,
  role,
  company,
  image,
  testimonial,
  batch,
  impact,
  isActive,
}: SuccessCardProps) {
  return (
    <Link
      href={`/alumni/${id}`}
      className={`block flex-shrink-0 w-full transition-all duration-500 ${
        isActive ? "opacity-100 scale-100" : "opacity-55 scale-95"
      }`}
    >
      <Card className="bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/80 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="flex gap-4 p-5 items-center">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full border-3 border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10 p-1 shadow-lg relative">
              <Image
                src={image || "/avater-1.jpg"}
                alt={name}
                fill
                className="object-cover rounded-full"
              />
              <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full px-2 h-6 flex items-center justify-center text-[10px] font-bold shadow border-2 border-white">
                &apos;{batch.slice(0, 2)}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <h4 className="text-lg font-bold text-foreground truncate">
                {name}
              </h4>
              <div className="flex items-center gap-2 text-xs text-foreground/70">
                <Briefcase className="w-3 h-3 text-primary shrink-0" />
                <span className="truncate">{role}</span>
              </div>
              <div className="text-xs font-semibold text-primary truncate">
                {company}
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-2">
              <div className="bg-secondary/60 border border-border text-foreground px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                <TrendingUp className="w-2.5 h-2.5" />
                {impact}
              </div>
            </div>

            <p className="text-xs text-foreground/75 italic leading-relaxed line-clamp-2">
              {testimonial}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
