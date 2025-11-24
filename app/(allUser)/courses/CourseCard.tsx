// components/CourseCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface Course {
  id: number;
  title: string;
  instructor: string;
  rating: number;
  reviews: number;
  difficulty: string;
  students: number;
  image: string;
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="hover:shadow-lg transition-all hover:scale-105 overflow-hidden cursor-pointer flex flex-col h-full">
        <div className="relative w-full h-48 bg-liner-to-b from-primary/10 to-primary/5">
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
                  i < Math.floor(course.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-border"
                }`}
              />
            ))}
            <span className="text-sm font-medium ml-1">{course.rating}</span>
            <span className="text-xs text-foreground/60">
              ({course.reviews})
            </span>
          </div>

          <div className="space-y-2 text-xs text-foreground/60">
            <p>📊 {course.difficulty}</p>
            <p>👥 {course.students.toLocaleString()} students</p>
          </div>

          <Button className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white">
            View Course
          </Button>
        </div>
      </Card>
    </Link>
  );
}
