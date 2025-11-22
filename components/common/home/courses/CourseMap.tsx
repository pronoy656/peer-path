// import { CourseCard } from '@/components/course-card'

import CourseCard from "./CourseCard";

const courses = [
  {
    id: 1,
    title: "Introduction to Programming",
    description: "Learn the basics of programming using C and Python.",
    category: "CSE",
    level: "Beginner",
    students: 5120,
    rating: 4.7,
    image: "/programming-intro.jpg",
  },
  {
    id: 2,
    title: "Business Communication Essentials",
    description:
      "Develop communication skills required in the corporate business world.",
    category: "BBA",
    level: "Intermediate",
    students: 3741,
    rating: 4.6,
    image: "/communication.jpg",
  },
  {
    id: 3,
    title: "Modern English Grammar",
    description:
      "Improve your grammar, sentence structure, and writing clarity.",
    category: "ENGLISH",
    level: "Beginner",
    students: 6423,
    rating: 4.8,
    image: "/grammer.jpg",
  },
  {
    id: 4,
    title: "News Reporting & Editing",
    description: "Learn journalistic writing, editing, and newsroom workflows.",
    category: "MSJ",
    level: "Advanced",
    students: 2981,
    rating: 4.9,
    image: "/news-reporter.jpg",
  },
  {
    id: 5,
    title: "Bangla Literature Classics",
    description: "Explore the greatest works of Bangla literature and poetry.",
    category: "BANGLA",
    level: "Intermediate",
    students: 4320,
    rating: 4.7,
    image: "/bangla.jpg",
  },
  {
    id: 6,
    title: "Data Structures & Algorithms",
    description:
      "Understand the fundamentals of algorithms and complex data structures.",
    category: "CSE",
    level: "Advanced",
    students: 7219,
    rating: 4.9,
    image: "/data-structure.jpg",
  },
  {
    id: 7,
    title: "Marketing Strategies",
    description: "Learn modern marketing techniques and customer psychology.",
    category: "BBA",
    level: "Intermediate",
    students: 5831,
    rating: 4.5,
    image: "/marketing.jpg",
  },
  {
    id: 8,
    title: "Creative Writing Workshop",
    description: "Improve storytelling, fiction writing, and narrative style.",
    category: "ENGLISH",
    level: "Beginner",
    students: 4550,
    rating: 4.8,
    image: "/writintg.jpg",
  },
];
export default function CourseMap() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Explore Courses
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Learn new skills from industry experts and advance your career
            </p>
          </div>

          {/* Courses Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
