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
    <div className="flex flex-wrap gap-2">
      {departments.map((dept) => {
        const selected = selectedDepartment === dept;
        return (
          <button
            key={dept}
            type="button"
            onClick={() => onSelectDepartment(dept)}
            className={`h-9 px-4 rounded-full text-sm font-semibold border transition-colors duration-150 ${
              selected
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:bg-muted"
            }`}
          >
            {dept}
          </button>
        );
      })}
    </div>
  );
}
