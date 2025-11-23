// import React from 'react'

// export default function SemesterTabs() {
//   return (
//     <div>SemesterTabs</div>
//   )
// }

"use client";

interface SemesterTabsProps {
  selectedSemester: string;
  onSelectSemester: (sem: string) => void;
}

export default function SemesterTabs({
  selectedSemester,
  onSelectSemester,
}: SemesterTabsProps) {
  const semesters = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {semesters.map((sem) => (
        <button
          key={sem}
          onClick={() => onSelectSemester(sem)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
            selectedSemester === sem
              ? "bg-yellow-400 text-secondary-foreground shadow-lg scale-105"
              : "bg-card text-foreground border-2 border-border hover:border-secondary"
          }`}
        >
          Semester {sem}
        </button>
      ))}
    </div>
  );
}
