// import { CourseCard } from '@/components/course-card'

import CourseCard from "./CourseCard";

const courses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description:
      "Learn the basics of HTML, CSS, and JavaScript to build stunning websites.",
    category: "Web Development",
    level: "Beginner",
    students: 12543,
    rating: 4.8,
    image: "/web-development-course.png",
  },
  {
    id: 2,
    title: "Advanced React & Next.js",
    description:
      "Master modern React patterns and build production-ready Next.js applications.",
    category: "Frontend",
    level: "Advanced",
    students: 8934,
    rating: 4.9,
    image: "/react-nextjs-development.png",
  },
  {
    id: 3,
    title: "UI/UX Design Principles",
    description:
      "Create beautiful and intuitive user interfaces with modern design systems.",
    category: "Design",
    level: "Intermediate",
    students: 6721,
    rating: 4.7,
    image: "/ui-ux-design-concept.png",
  },
  {
    id: 4,
    title: "TypeScript Mastery",
    description:
      "Write type-safe JavaScript with TypeScript and catch bugs before they happen.",
    category: "Programming",
    level: "Intermediate",
    students: 9102,
    rating: 4.8,
    image: "/typescript-programming.png",
  },
  {
    id: 5,
    title: "Backend Development with Node.js",
    description:
      "Build scalable server-side applications using Node.js and Express.js.",
    category: "Backend",
    level: "Intermediate",
    students: 7543,
    rating: 4.6,
    image: "/nodejs-backend-server.jpg",
  },
  {
    id: 6,
    title: "Database Design & SQL",
    description:
      "Master database design principles and write efficient SQL queries.",
    category: "Database",
    level: "Intermediate",
    students: 5821,
    rating: 4.7,
    image: "/sql-database-design.jpg",
  },
  {
    id: 7,
    title: "Cloud Deployment with Vercel",
    description:
      "Deploy your applications to production with Vercel and master CI/CD pipelines.",
    category: "DevOps",
    level: "Intermediate",
    students: 4932,
    rating: 4.9,
    image: "/cloud-deployment-vercel.jpg",
  },
  {
    id: 8,
    title: "Mobile App Development",
    description:
      "Build cross-platform mobile applications with React Native and Expo.",
    category: "Mobile",
    level: "Advanced",
    students: 6543,
    rating: 4.8,
    image: "/mobile-app-development.png",
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
