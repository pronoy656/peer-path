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
  const fullStars = Math.floor(course.rating);
  const hasHalfStar = course.rating - fullStars >= 0.5;

  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="hover:shadow-lg transition-all hover:scale-105 overflow-hidden cursor-pointer flex flex-col h-full rounded-xl -py-6">
        <div className="relative w-full h-48 bg-linear-to-b from-primary/20 to-primary/5">
          <Image
            src={course.image || "/placeholder.svg"}
            alt={course.title}
            fill
            className="object-cover rounded-t-xl"
          />
        </div>

        <div className="p-6 space-y-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
          <p className="text-sm text-foreground/70">{course.instructor}</p>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => {
              if (i < fullStars) {
                return (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                );
              }
              if (i === fullStars && hasHalfStar) {
                return (
                  <div key={i} className="relative h-4 w-4">
                    <Star className="h-4 w-4 text-border absolute" />
                    <div className="absolute overflow-hidden w-[50%]">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                );
              }
              return <Star key={i} className="h-4 w-4 text-border" />;
            })}
            <span className="text-sm font-medium ml-2">
              {course.rating.toFixed(1)}
            </span>
            <span className="text-xs text-foreground/70 ml-1">
              ({course.reviews})
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-foreground/70">
            <span className="px-2 py-1 bg-primary/10 rounded-full">
              📊 {course.difficulty}
            </span>
            <span>👥 {course.students.toLocaleString()} students</span>
          </div>

          <Button className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            View Course
          </Button>
        </div>
      </Card>
    </Link>
  );
}
