import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CourseSidebarProps {
  course: {
    duration?: string;
    difficulty?: string;
    students?: number | string;
    price?: string;
  };
  instructor?: string | null; // ← important: can be undefined/null
}

export default function CourseSidebar({
  course,
  instructor,
}: CourseSidebarProps) {
  // Safe initials (e.g. "John Doe" → "JD", "Sarah" → "S", empty → "?")
  const getInitials = (name: string | undefined | null): string => {
    if (!name || typeof name !== "string" || name.trim() === "") {
      return "?";
    }
    return name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2) // max 2 letters
      .join("")
      .toUpperCase();
  };

  const initials = getInitials(instructor);

  return (
    <div className="space-y-6">
      {/* Instructor Card */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Instructor</h3>
        <div className="flex items-center gap-4 mb-4">
          <div
            className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl text-white font-bold shadow-lg"
            aria-hidden="true"
          >
            {initials}
          </div>
          <div>
            <p className="font-semibold text-lg">
              {instructor || "Unknown Instructor"}
            </p>
            <p className="text-sm text-muted-foreground">Course Instructor</p>
          </div>
        </div>
        <Button variant="outline" className="w-full">
          View Profile
        </Button>
      </Card>

      {/* Course Info Card */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Course Details</h3>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium">
              {course.duration || "Self-paced"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Level</span>
            <span className="font-medium">
              {course.difficulty || "All Levels"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Students</span>
            <span className="font-medium">
              {course.students != null
                ? Number(course.students).toLocaleString()
                : "—"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
