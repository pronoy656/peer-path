"use client";

import React, { useState } from "react";
// import { FacultyMember } from "@/lib/FacultyData";
import { Star, Briefcase, GraduationCap, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FacultyMember } from "@/lib/facultyData";
import ContactModal from "./ContactModal";
// import ContactModal from "./ContactModal";

interface FacultyCardProps {
  faculty: FacultyMember;
}

export default function FacultyCard({ faculty }: FacultyCardProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={faculty.image}
            alt={faculty.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-yellow-100"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {faculty.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">{faculty.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-700">
                {faculty.rating}
              </span>
              <span className="text-xs text-gray-400">
                ({faculty.reviews.length} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6 flex-1">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Briefcase className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
            <span>
              <span className="font-medium text-gray-900">Experience:</span>{" "}
              {faculty.experienceYears} years
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <GraduationCap className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
            <span className="line-clamp-2">
              <span className="font-medium text-gray-900">Research:</span>{" "}
              {faculty.researchArea}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact
          </button>
          <Link
            href={`/faculty/${faculty.id}`}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl text-sm font-bold transition-colors"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        facultyName={faculty.name}
        facultyEmail={faculty.email}
      />
    </>
  );
}
