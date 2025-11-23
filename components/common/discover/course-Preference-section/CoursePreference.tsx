"use client";

import { useState } from "react";
import { Heart, BookmarkIcon } from "lucide-react";

export default function CoursePreference() {
  const [preferences, setPreferences] = useState({
    creditRange: "3",
    schedule: "morning",
    courseLevel: "beginner",
  });

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 border-2 border-primary/20 p-8 md:p-12">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/10 rounded-full -ml-20 -mb-20 blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-6 h-6 text-primary fill-primary" />
          <h2 className="text-3xl font-bold text-foreground">
            Your Learning Preferences
          </h2>
        </div>

        <p className="text-muted-foreground mb-8 max-w-2xl">
          Customize your course experience by setting your preferences. We all
          recommend courses that match your learning style and schedule.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Credit Range */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">
              Preferred Credits
            </label>
            <select
              value={preferences.creditRange}
              onChange={(e) =>
                handlePreferenceChange("creditRange", e.target.value)
              }
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card text-foreground font-medium hover:border-primary focus:border-primary outline-none transition-colors"
            >
              <option value="3">3 Credits</option>
              <option value="4">4 Credits</option>
              <option value="5">5+ Credits</option>
            </select>
          </div>

          {/* Schedule Preference */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">
              Time Preference
            </label>
            <select
              value={preferences.schedule}
              onChange={(e) =>
                handlePreferenceChange("schedule", e.target.value)
              }
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card text-foreground font-medium hover:border-primary focus:border-primary outline-none transition-colors"
            >
              <option value="morning">Morning (9 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
              <option value="evening">Evening (3 PM - 6 PM)</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          {/* Course Level */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground">
              Course Level
            </label>
            <select
              value={preferences.courseLevel}
              onChange={(e) =>
                handlePreferenceChange("courseLevel", e.target.value)
              }
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card text-foreground font-medium hover:border-primary focus:border-primary outline-none transition-colors"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-border/50">
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-secondary transition-colors duration-300">
            <BookmarkIcon className="w-4 h-4" />
            Save Preferences
          </button>
          <button className="px-6 py-3 bg-card text-foreground border-2 border-border rounded-lg font-semibold hover:border-primary transition-colors duration-300">
            Get Recommendations
          </button>
        </div>
      </div>
    </div>
  );
}
