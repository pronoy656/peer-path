export default function CourseSyllabus({
  syllabus = [],
}: {
  syllabus?: { week: number; topic: string }[];
}) {
  if (!syllabus || syllabus.length === 0) {
    return <p className="text-muted-foreground">No syllabus available.</p>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Weekly Syllabus</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {syllabus.map((item) => (
          <div
            key={item.week}
            className="flex items-center gap-4 p-5 bg-secondary/40 rounded-xl hover:bg-secondary/60 transition"
          >
            <div className="h-9 w-9 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              W{item.week}
            </div>
            <span className="font-medium">{item.topic}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
