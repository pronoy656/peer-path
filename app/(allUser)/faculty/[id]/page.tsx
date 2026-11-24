"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Mail, Star, Briefcase, User, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import ContactButton from "@/components/faculty/ContactButton";
import ReviewSection from "@/components/faculty/ReviewSection";
import CourseList from "@/components/faculty/CourseList";
import { useAppStore } from "@/lib/store/AppStore";
import { getCourses } from "@/lib/services/courses";
import { getFacultyById, getFacultyReviews } from "@/lib/services/people";

export default function FacultyProfilePage() {
  const { id } = useParams();
  const { state } = useAppStore();

  const faculty = getFacultyById(state, id as string);

  if (!faculty) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Faculty Member Not Found</h1>
        <p className="text-muted-foreground mb-6">
          This faculty profile could not be found.
        </p>
        <Link
          href="/faculty"
          className="px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-semibold"
        >
          Back to Faculty Directory
        </Link>
      </div>
    );
  }

  const allCourses = getCourses(state).filter(
    (c) => c.instructorId === faculty.id
  );
  const currentCourses = allCourses.filter((c) => c.semester <= 2);
  const upperCourses = allCourses.filter((c) => c.semester > 2);
  const reviews = getFacultyReviews(state, faculty.id);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-20">
      {/* Header / Breadcrumb — padded below sticky navbar */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <Link
            href="/faculty"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Faculty
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative w-32 h-32 mb-4">
                  {faculty.avatar ? (
                    <img
                      src={faculty.avatar}
                      alt={faculty.name}
                      className="w-full h-full rounded-full object-cover border-4 border-yellow-100"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-yellow-100 flex items-center justify-center text-3xl font-bold text-yellow-700 border-4 border-yellow-200">
                      {faculty.name[0]}
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {faculty.name}
                </h1>
                <p className="text-amber-700 font-semibold text-sm mb-1">
                  {faculty.title}
                </p>
                <p className="text-gray-500 font-medium text-sm mb-4">
                  Department of {faculty.department}
                </p>
                <div className="flex items-center justify-center gap-1 mb-6 bg-yellow-50 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-gray-900">
                    {faculty.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    ({reviews.length} reviews)
                  </span>
                </div>

                <ContactButton
                  facultyId={faculty.id}
                  facultyName={faculty.name}
                  facultyEmail={faculty.email}
                />
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Email
                  </h3>
                  <p className="text-sm text-gray-600 break-all">
                    {faculty.email}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Office Hours
                  </h3>
                  <p className="text-sm text-gray-600">{faculty.officeHours}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    Experience
                  </h3>
                  <p className="text-sm text-gray-600">
                    {faculty.experienceYears} Years
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    Research Areas
                  </h3>
                  <p className="text-sm text-gray-600">
                    {faculty.researchArea.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {faculty.bio}
              </p>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Teaching Methodology
              </h3>
              <p className="text-gray-600 leading-relaxed italic border-l-4 border-yellow-400 pl-4 py-1 bg-gray-50 rounded-r-lg">
                {faculty.methodology}
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Courses</h2>
              <CourseList
                title="Core & Introductory Courses"
                courses={
                  currentCourses.length > 0 ? currentCourses : allCourses
                }
              />
              {upperCourses.length > 0 && currentCourses.length > 0 && (
                <CourseList
                  title="Advanced & Upper-Semester Courses"
                  courses={upperCourses}
                />
              )}
            </div>

            <div className="pt-4">
              <ReviewSection facultyId={faculty.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
