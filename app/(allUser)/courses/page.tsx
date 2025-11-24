"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Search, Filter } from "lucide-react"

const allCourses = [
  {
    id: 1,
    title: "Full Stack Web Development",
    instructor: "Sarah Chen",
    rating: 4.8,
    reviews: 342,
    difficulty: "Intermediate",
    students: 1240,
    image: "/full-stack-web-development-classroom.jpg",
  },
  {
    id: 2,
    title: "Data Science Fundamentals",
    instructor: "Prof. Rajesh Kumar",
    rating: 4.9,
    reviews: 512,
    difficulty: "Advanced",
    students: 1820,
    image: "/data-science-analytics-graphs.jpg",
  },
  {
    id: 3,
    title: "Digital Marketing Mastery",
    instructor: "Emily Rodriguez",
    rating: 4.7,
    reviews: 289,
    difficulty: "Beginner",
    students: 856,
    image: "/digital-marketing-strategy.png",
  },
  {
    id: 4,
    title: "Mobile App Development",
    instructor: "Alex Thompson",
    rating: 4.6,
    reviews: 198,
    difficulty: "Intermediate",
    students: 654,
    image: "/mobile-app-development-coding.png",
  },
  {
    id: 5,
    title: "Cloud Computing with AWS",
    instructor: "David Miller",
    rating: 4.8,
    reviews: 423,
    difficulty: "Advanced",
    students: 987,
    image: "/cloud-computing-aws-infrastructure.jpg",
  },
  {
    id: 6,
    title: "Python for Beginners",
    instructor: "Lisa Wong",
    rating: 4.9,
    reviews: 678,
    difficulty: "Beginner",
    students: 2340,
    image: "/python-code.png",
  },
  {
    id: 7,
    title: "UI/UX Design Principles",
    instructor: "James Park",
    rating: 4.5,
    reviews: 267,
    difficulty: "Intermediate",
    students: 523,
    image: "/ui-ux-design-mockup-interface.jpg",
  },
  {
    id: 8,
    title: "Business Analytics",
    instructor: "Maria Garcia",
    rating: 4.7,
    reviews: 345,
    difficulty: "Advanced",
    students: 789,
    image: "/business-analytics-dashboard-data.jpg",
  },
  {
    id: 9,
    title: "Cybersecurity Essentials",
    instructor: "Robert Chen",
    rating: 4.8,
    reviews: 401,
    difficulty: "Intermediate",
    students: 912,
    image: "/cybersecurity-network-protection.png",
  },
  {
    id: 10,
    title: "Content Writing & SEO",
    instructor: "Sarah Johnson",
    rating: 4.6,
    reviews: 234,
    difficulty: "Beginner",
    students: 654,
    image: "/content-writing-seo-blog.jpg",
  },
  {
    id: 11,
    title: "Machine Learning Advanced",
    instructor: "Dr. Amit Patel",
    rating: 4.9,
    reviews: 289,
    difficulty: "Advanced",
    students: 445,
    image: "/machine-learning-neural-network-ai.jpg",
  },
  {
    id: 12,
    title: "Graphic Design Bootcamp",
    instructor: "Elena Rodriguez",
    rating: 4.7,
    reviews: 312,
    difficulty: "Intermediate",
    students: 634,
    image: "/graphic-design-creative-artwork.jpg",
  },
]

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")

  const filtered = allCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === "All" || course.difficulty === selectedDifficulty

    return matchesSearch && matchesDifficulty
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Courses</h1>
            <p className="text-xl text-foreground/60">
              Browse {allCourses.length} courses with verified student reviews and ratings
            </p>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                <input
                  type="text"
                  placeholder="Search courses or instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Filter className="h-4 w-4" />
                  Difficulty:
                </span>
                {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedDifficulty(level)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedDifficulty === level
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>

              <p className="text-sm text-foreground/60">
                Showing {filtered.length} of {allCourses.length} courses
              </p>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((course) => (
                  <Link key={course.id} href={`/courses/${course.id}`}>
                    <Card className="hover:shadow-lg transition-all hover:scale-105 overflow-hidden cursor-pointer flex flex-col h-full">
                      <div className="relative w-full h-48 bg-gradient-to-b from-primary/10 to-primary/5">
                        <Image
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="p-6 space-y-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
                        <p className="text-sm text-foreground/60">{course.instructor}</p>

                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(course.rating) ? "fill-yellow-400 text-yellow-400" : "text-border"
                              }`}
                            />
                          ))}
                          <span className="text-sm font-medium ml-1">{course.rating}</span>
                          <span className="text-xs text-foreground/60">({course.reviews})</span>
                        </div>

                        <div className="space-y-2 text-xs text-foreground/60">
                          <p>📊 {course.difficulty}</p>
                          <p>👥 {course.students.toLocaleString()} students</p>
                        </div>

                        <Button className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white">View Course</Button>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 space-y-4">
                <p className="text-xl font-semibold text-foreground/60">No courses found</p>
                <p className="text-foreground/40">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
