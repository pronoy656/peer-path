import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import type { Course } from "@/lib/types";

export default function CourseCard({
  course,
  instructorName,
}: {
  course: Course;
  instructorName: string;
}) {
  const fullStars = Math.floor(course.rating);
  const hasHalfStar = course.rating - fullStars >= 0.5;

  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="hover:shadow-xl transition-all hover:scale-[1.02] overflow-hidden cursor-pointer flex flex-col h-full rounded-xl border -py-6">
        <div className="relative w-full h-48 bg-gradient-to-b from-primary/20 to-primary/5">
          <Image
            src={course.image || "/programming-intro.jpg"}
            alt={course.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 left-3 bg-black/75 text-white text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-sm">
            {course.code}
          </div>
          <div className="absolute top-3 right-3 bg-white/90 text-slate-900 text-xs font-semibold px-2.5 py-1 rounded-md">
            {course.department} • Sem {course.semester}
          </div>
        </div>

        <div className="p-5 space-y-3 flex-1 flex flex-col">
          <h3 className="font-bold text-lg line-clamp-2 leading-tight">
            {course.title}
          </h3>

          <p className="text-sm font-medium text-foreground/75">
            {instructorName}
          </p>

          <p className="text-sm text-foreground/60 line-clamp-2">
            {course.description}
          </p>

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
                    <Star className="h-4 w-4 text-muted-foreground/30" />
                    <div className="absolute inset-0 overflow-hidden w-1/2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                );
              }
              return (
                <Star key={i} className="h-4 w-4 text-muted-foreground/30" />
              );
            })}
            <span className="text-sm font-semibold ml-1">
              {course.rating.toFixed(1)}
            </span>
            <span className="text-xs text-foreground/60 ml-1">
              ({course.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="px-2.5 py-1 bg-primary/10 text-primary font-medium rounded-full">
              {course.difficulty}
            </span>
            <span className="text-foreground/70">
              {course.credits} Credits • {course.seatsTaken}/{course.seatsTotal} seats
            </span>
          </div>

          <Button className="w-full mt-auto bg-primary text-primary-foreground font-semibold hover:bg-primary/90">
            View Course
          </Button>
        </div>
      </Card>
    </Link>
  );
}
