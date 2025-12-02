import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CourseHeader({
  image,
  title,
}: {
  image: string;
  title: string;
}) {
  return (
    <section className="relative h-80 md:h-96 bg-gradient-to-b from-blue-600 to-blue-400 overflow-hidden">
      <img
        src={image || "/placeholder.svg"}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute top-6 left-6">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-5 py-3 bg-white/95 rounded-lg hover:bg-white shadow-lg transition"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Courses</span>
        </Link>
      </div>
    </section>
  );
}
