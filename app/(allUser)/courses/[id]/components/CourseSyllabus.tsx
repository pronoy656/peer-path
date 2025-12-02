interface CourseSyllabusProps {
  syllabus?: string[];
}

export default function CourseSyllabus({ syllabus = [] }: CourseSyllabusProps) {
  if (!syllabus || syllabus.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>No syllabus available yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">What You&apos;ll Learn</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {syllabus.map((topic, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-5 bg-secondary/40 rounded-xl hover:bg-secondary/60 transition"
          >
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {i + 1}
            </div>
            <span className="font-medium text-foreground">{topic}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
