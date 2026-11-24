import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Course, FacultyProfile } from "@/lib/types";

export default function CourseSidebar({
  course,
  instructor,
}: {
  course: Course;
  instructor?: FacultyProfile;
}) {
  const getInitials = (name?: string | null): string => {
    if (!name?.trim()) return "?";
    return name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Instructor</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-xl text-white font-bold shadow-md shrink-0">
            {getInitials(instructor?.name)}
          </div>
          <div>
            <p className="font-semibold text-lg">
              {instructor?.name ?? "ULAB Faculty"}
            </p>
            <p className="text-sm text-muted-foreground">
              {instructor?.title ?? "Course Instructor"} •{" "}
              {instructor?.department ?? course.department}
            </p>
          </div>
        </div>
        {instructor ? (
          <Link href={`/faculty/${instructor.id}`}>
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </Link>
        ) : (
          <Link href="/faculty">
            <Button variant="outline" className="w-full">
              Browse Faculty
            </Button>
          </Link>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Course Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Course Code</span>
            <span className="font-semibold">{course.code}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Department</span>
            <span className="font-medium">{course.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Semester</span>
            <span className="font-medium">Semester {course.semester}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Credits</span>
            <span className="font-medium">{course.credits}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Level</span>
            <span className="font-medium">{course.difficulty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Seats Filled</span>
            <span className="font-medium">
              {course.seatsTaken} / {course.seatsTotal}
            </span>
          </div>
          {course.schedule && (
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Schedule</span>
              <span className="font-medium text-right">{course.schedule}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
