"use client";

import type { Department } from "@/lib/types";

interface DepartmentTabsProps {
  selectedDepartment: Department;
  onSelectDepartment: (dept: Department) => void;
}

export default function DepartmentTabs({
  selectedDepartment,
  onSelectDepartment,
}: DepartmentTabsProps) {
  const departments: Department[] = ["CSE", "BBA", "MSJ", "English", "Bangla"];

  return (
    <div className="flex flex-wrap gap-3">
      {departments.map((dept) => (
        <button
          key={dept}
          type="button"
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
