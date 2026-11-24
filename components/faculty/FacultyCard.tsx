"use client";

import React, { useState } from "react";
import { Mail, Star } from "lucide-react";
import Link from "next/link";
import type { FacultyProfile } from "@/lib/types";
import { useAppStore } from "@/lib/store/AppStore";
import { getFacultyReviews } from "@/lib/services/people";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ContactModal from "./ContactModal";

export default function FacultyCard({ faculty }: { faculty: FacultyProfile }) {
  const { state } = useAppStore();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const reviews = getFacultyReviews(state, faculty.id);

  return (
    <>
      <div className="group bg-card border border-border rounded-2xl p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between gap-4 h-full">
        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <Avatar
              src={faculty.avatar}
              name={faculty.name}
              size="md"
              department={faculty.department}
              avatarColor={faculty.avatarColor}
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-semibold text-base text-foreground truncate">
                {faculty.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {faculty.title}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge department={faculty.department}>
                  {faculty.department}
                </Badge>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
                  <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                  {faculty.rating.toFixed(1)} ({reviews.length})
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {faculty.bio}
          </p>

          <p className="text-xs text-muted-foreground truncate">
            Office hours: <span className="text-foreground font-medium">{faculty.officeHours}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsContactModalOpen(true)}
          >
            <Mail className="w-3.5 h-3.5" />
            Contact
          </Button>
          <Link href={`/faculty/${faculty.id}`}>
            <Button variant="default" size="sm" className="w-full">
              View profile
            </Button>
          </Link>
        </div>
      </div>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        facultyId={faculty.id}
        facultyName={faculty.name}
        facultyEmail={faculty.email}
      />
    </>
  );
}
