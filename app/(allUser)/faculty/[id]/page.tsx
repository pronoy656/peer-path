import React from "react";
import { facultyData } from "@/lib/FacultyData";
import CourseList from "@/components/common/faculty/CourseList";
import ReviewSection from "@/components/common/faculty/ReviewSection";
import ContactModal from "@/components/common/faculty/ContactModal"; // This will need a client wrapper or be handled differently if I want the modal button here too.
import { Mail, Star, Briefcase, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

// Client component wrapper for the Contact Button to handle state
import ContactButton from "@/components/common/faculty/ContactButton";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    const faculty = facultyData.find((f) => f.id === id);

    if (!faculty) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href="/faculty"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-yellow-500 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Faculty
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="relative w-32 h-32 mb-4">
                                    <img
                                        src={faculty.image}
                                        alt={faculty.name}
                                        className="w-full h-full rounded-full object-cover border-4 border-yellow-100"
                                    />
                                    <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white" title="Available"></div>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                    {faculty.name}
                                </h1>
                                <p className="text-gray-500 font-medium mb-4">
                                    {faculty.department}
                                </p>
                                <div className="flex items-center justify-center gap-1 mb-6 bg-yellow-50 px-3 py-1 rounded-full">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold text-gray-900">
                                        {faculty.rating}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        ({faculty.reviews.length} reviews)
                                    </span>
                                </div>

                                <ContactButton
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
                                        Research Area
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {faculty.researchArea}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Bio Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                About
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {faculty.bio}
                            </p>

                            {faculty.teachingMethodology && (
                                <>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        Teaching Methodology
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed italic border-l-4 border-yellow-400 pl-4 py-1 bg-gray-50 rounded-r-lg">
                                        "{faculty.teachingMethodology}"
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Courses Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                Courses
                            </h2>
                            <CourseList
                                title="Currently Teaching"
                                courses={faculty.coursesCurrent}
                            />
                            <CourseList
                                title="Previously Taught"
                                courses={faculty.coursesPrevious}
                            />
                        </div>

                        {/* Reviews Section */}
                        <div className="pt-4">
                            <ReviewSection
                                reviews={faculty.reviews}
                                facultyId={faculty.id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
