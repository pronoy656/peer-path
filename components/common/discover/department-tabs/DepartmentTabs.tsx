// import React from 'react'

// export default function DepartmentTabs() {
//   return (
//     <div>DepartmentTabs</div>
//   )
// }

"use client";

interface DepartmentTabsProps {
  selectedDepartment: string;
  onSelectDepartment: (dept: string) => void;
}

export default function DepartmentTabs({
  selectedDepartment,
  onSelectDepartment,
}: DepartmentTabsProps) {
  const departments = ["CSE", "BBA", "MSJ", "ENGLISH", "BANGLA"];

  return (
    <div className="flex flex-wrap gap-3">
      {departments.map((dept) => (
        <button
          key={dept}
          onClick={() => onSelectDepartment(dept)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
            selectedDepartment === dept
              ? "bg-primary text-primary-foreground shadow-lg scale-105"
              : "bg-card text-foreground border-2 border-border hover:border-primary"
          }`}
        >
          {dept}
        </button>
      ))}
    </div>
  );
}
