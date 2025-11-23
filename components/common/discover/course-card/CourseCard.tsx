/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CourseCardDesign from "../course-card-design/CourseCardDesign";

// import { CourseCard } from "./course-card"

interface CourseGridProps {
  department: string;
  semester: string;
  onAddCourse?: (course: any) => void;
  selectedCourses?: string[];
}

export default function CourseCard({
  department,
  semester,
  onAddCourse,
  selectedCourses = [],
}: CourseGridProps) {
  const coursesData: Record<
    string,
    Record<
      string,
      Array<{
        id: string;
        name: string;
        code: string;
        credits: number;
        instructor: string;
        schedule: string;
        difficulty: "Beginner" | "Intermediate" | "Advanced";
        description: string;
      }>
    >
  > = {
    CSE: {
      "1": [
        {
          id: "1",
          name: "Programming Fundamentals",
          code: "CSE101",
          credits: 3,
          instructor: "Dr. Ahmed Khan",
          schedule: "MWF 9:00-10:30 AM",
          difficulty: "Beginner",
          description:
            "Learn basic programming concepts and problem-solving techniques using Python.",
        },
        {
          id: "2",
          name: "Digital Logic Design",
          code: "CSE102",
          credits: 3,
          instructor: "Dr. Fatima Ali",
          schedule: "TTh 10:00-11:30 AM",
          difficulty: "Beginner",
          description:
            "Understand digital circuits and boolean algebra fundamentals.",
        },
        {
          id: "3",
          name: "Mathematics for Computing",
          code: "CSE103",
          credits: 4,
          instructor: "Prof. Hassan",
          schedule: "MWF 11:00 AM-12:30 PM",
          difficulty: "Intermediate",
          description:
            "Essential mathematical foundations for computer science applications.",
        },
        {
          id: "4",
          name: "Programming Lab",
          code: "CSE101L",
          credits: 1,
          instructor: "Dr. Zara",
          schedule: "TTh 2:00-3:30 PM",
          difficulty: "Beginner",
          description: "Hands-on programming practice and project development.",
        },
      ],
      "2": [
        {
          id: "5",
          name: "Object Oriented Programming",
          code: "CSE201",
          credits: 3,
          instructor: "Dr. Karim",
          schedule: "MWF 10:00-11:30 AM",
          difficulty: "Intermediate",
          description:
            "Master OOP principles with Java and C++ implementations.",
        },
        {
          id: "6",
          name: "Database Management Systems",
          code: "CSE202",
          credits: 3,
          instructor: "Dr. Nadia",
          schedule: "TTh 1:00-2:30 PM",
          difficulty: "Intermediate",
          description:
            "Learn database design, SQL, and data management concepts.",
        },
        {
          id: "7",
          name: "Web Development",
          code: "CSE203",
          credits: 3,
          instructor: "Dr. Rashid",
          schedule: "MWF 2:00-3:30 PM",
          difficulty: "Intermediate",
          description:
            "Build responsive web applications using HTML, CSS, and JavaScript.",
        },
        {
          id: "8",
          name: "Database Lab",
          code: "CSE202L",
          credits: 1,
          instructor: "Dr. Amira",
          schedule: "TTh 3:00-4:30 PM",
          difficulty: "Intermediate",
          description:
            "Practical experience with database implementation and queries.",
        },
      ],
    },
    BBA: {
      "1": [
        {
          id: "9",
          name: "Business Fundamentals",
          code: "BBA101",
          credits: 3,
          instructor: "Prof. Ahmed",
          schedule: "MWF 9:00-10:30 AM",
          difficulty: "Beginner",
          description:
            "Introduction to core business concepts and organizational structure.",
        },
        {
          id: "10",
          name: "Accounting Basics",
          code: "BBA102",
          credits: 3,
          instructor: "Dr. Saira",
          schedule: "TTh 10:00-11:30 AM",
          difficulty: "Beginner",
          description:
            "Foundational accounting principles and financial statement analysis.",
        },
        {
          id: "11",
          name: "Economics I",
          code: "BBA103",
          credits: 4,
          instructor: "Prof. Hassan",
          schedule: "MWF 11:00 AM-12:30 PM",
          difficulty: "Intermediate",
          description:
            "Microeconomic theory and practical business applications.",
        },
        {
          id: "12",
          name: "Business Lab",
          code: "BBA101L",
          credits: 1,
          instructor: "Dr. Hira",
          schedule: "TTh 2:00-3:30 PM",
          difficulty: "Beginner",
          description: "Case studies and business simulation exercises.",
        },
      ],
      "2": [
        {
          id: "13",
          name: "Business Management",
          code: "BBA201",
          credits: 3,
          instructor: "Dr. Adnan",
          schedule: "MWF 10:00-11:30 AM",
          difficulty: "Intermediate",
          description:
            "Strategic management and organizational leadership principles.",
        },
        {
          id: "14",
          name: "Finance Essentials",
          code: "BBA202",
          credits: 3,
          instructor: "Dr. Leila",
          schedule: "TTh 1:00-2:30 PM",
          difficulty: "Intermediate",
          description:
            "Corporate finance, investment analysis, and portfolio management.",
        },
        {
          id: "15",
          name: "Marketing Principles",
          code: "BBA203",
          credits: 3,
          instructor: "Prof. Rania",
          schedule: "MWF 2:00-3:30 PM",
          difficulty: "Beginner",
          description:
            "Market research, consumer behavior, and marketing strategy.",
        },
        {
          id: "16",
          name: "Finance Lab",
          code: "BBA202L",
          credits: 1,
          instructor: "Dr. Majid",
          schedule: "TTh 3:00-4:30 PM",
          difficulty: "Intermediate",
          description:
            "Financial analysis tools and investment valuation practice.",
        },
      ],
    },
    MSJ: {
      "1": [
        {
          id: "17",
          name: "Journalism Basics",
          code: "MSJ101",
          credits: 3,
          instructor: "Prof. Tariq",
          schedule: "MWF 9:00-10:30 AM",
          difficulty: "Beginner",
          description:
            "Fundamentals of journalism, reporting, and news gathering.",
        },
        {
          id: "18",
          name: "Media Ethics",
          code: "MSJ102",
          credits: 3,
          instructor: "Dr. Salma",
          schedule: "TTh 10:00-11:30 AM",
          difficulty: "Intermediate",
          description:
            "Ethical considerations in media and responsible journalism.",
        },
        {
          id: "19",
          name: "News Writing",
          code: "MSJ103",
          credits: 3,
          instructor: "Prof. Yasir",
          schedule: "MWF 11:00 AM-12:30 PM",
          difficulty: "Intermediate",
          description:
            "Techniques for writing compelling news stories and headlines.",
        },
        {
          id: "20",
          name: "Media Lab",
          code: "MSJ101L",
          credits: 1,
          instructor: "Dr. Layla",
          schedule: "TTh 2:00-3:30 PM",
          difficulty: "Beginner",
          description: "Hands-on practice with media equipment and production.",
        },
      ],
      "2": [
        {
          id: "21",
          name: "Broadcast Journalism",
          code: "MSJ201",
          credits: 3,
          instructor: "Dr. Khalid",
          schedule: "MWF 10:00-11:30 AM",
          difficulty: "Advanced",
          description:
            "Television and radio journalism production and presentation.",
        },
        {
          id: "22",
          name: "Documentary Production",
          code: "MSJ202",
          credits: 3,
          instructor: "Prof. Aisha",
          schedule: "TTh 1:00-2:30 PM",
          difficulty: "Advanced",
          description:
            "Creating professional documentary films and visual narratives.",
        },
        {
          id: "23",
          name: "Social Media Strategy",
          code: "MSJ203",
          credits: 3,
          instructor: "Dr. Omar",
          schedule: "MWF 2:00-3:30 PM",
          difficulty: "Intermediate",
          description:
            "Digital content creation and social media platform strategy.",
        },
        {
          id: "24",
          name: "Production Lab",
          code: "MSJ202L",
          credits: 1,
          instructor: "Dr. Hana",
          schedule: "TTh 3:00-4:30 PM",
          difficulty: "Intermediate",
          description: "Video editing and multimedia production techniques.",
        },
      ],
    },
    ENGLISH: {
      "1": [
        {
          id: "25",
          name: "English Composition",
          code: "ENG101",
          credits: 3,
          instructor: "Prof. Elizabeth",
          schedule: "MWF 9:00-10:30 AM",
          difficulty: "Beginner",
          description:
            "Essay writing, grammar, and effective communication skills.",
        },
        {
          id: "26",
          name: "Literature & Society",
          code: "ENG102",
          credits: 3,
          instructor: "Dr. Margaret",
          schedule: "TTh 10:00-11:30 AM",
          difficulty: "Intermediate",
          description:
            "Analyze literature in cultural and historical contexts.",
        },
        {
          id: "27",
          name: "Grammar & Syntax",
          code: "ENG103",
          credits: 3,
          instructor: "Prof. Jane",
          schedule: "MWF 11:00 AM-12:30 PM",
          difficulty: "Beginner",
          description:
            "Detailed study of English grammar rules and sentence structure.",
        },
        {
          id: "28",
          name: "Writing Lab",
          code: "ENG101L",
          credits: 1,
          instructor: "Dr. Helen",
          schedule: "TTh 2:00-3:30 PM",
          difficulty: "Beginner",
          description: "Workshop for improving writing and editing skills.",
        },
      ],
      "2": [
        {
          id: "29",
          name: "British Literature",
          code: "ENG201",
          credits: 3,
          instructor: "Dr. Victoria",
          schedule: "MWF 10:00-11:30 AM",
          difficulty: "Intermediate",
          description:
            "Survey of major works and authors from British literature.",
        },
        {
          id: "30",
          name: "American Literature",
          code: "ENG202",
          credits: 3,
          instructor: "Prof. Charlotte",
          schedule: "TTh 1:00-2:30 PM",
          difficulty: "Intermediate",
          description:
            "Explore American literary traditions and influential authors.",
        },
        {
          id: "31",
          name: "Creative Writing",
          code: "ENG203",
          credits: 3,
          instructor: "Dr. Sophia",
          schedule: "MWF 2:00-3:30 PM",
          difficulty: "Intermediate",
          description:
            "Develop creative fiction, poetry, and narrative techniques.",
        },
        {
          id: "32",
          name: "Literature Lab",
          code: "ENG202L",
          credits: 1,
          instructor: "Prof. Rose",
          schedule: "TTh 3:00-4:30 PM",
          difficulty: "Intermediate",
          description: "Literary analysis and critical discussion sessions.",
        },
      ],
    },
    BANGLA: {
      "1": [
        {
          id: "33",
          name: "Bangla Grammar",
          code: "BAN101",
          credits: 3,
          instructor: "Prof. Karim",
          schedule: "MWF 9:00-10:30 AM",
          difficulty: "Beginner",
          description:
            "Comprehensive study of Bengali language grammar and rules.",
        },
        {
          id: "34",
          name: "Bangla Literature",
          code: "BAN102",
          credits: 3,
          instructor: "Dr. Nasrin",
          schedule: "TTh 10:00-11:30 AM",
          difficulty: "Intermediate",
          description:
            "Classic and contemporary Bengali literary works analysis.",
        },
        {
          id: "35",
          name: "Bengali Writing Skills",
          code: "BAN103",
          credits: 3,
          instructor: "Prof. Rumi",
          schedule: "MWF 11:00 AM-12:30 PM",
          difficulty: "Intermediate",
          description: "Develop proficiency in Bengali prose and composition.",
        },
        {
          id: "36",
          name: "Bangla Lab",
          code: "BAN101L",
          credits: 1,
          instructor: "Dr. Asha",
          schedule: "TTh 2:00-3:30 PM",
          difficulty: "Beginner",
          description:
            "Practical Bengali language conversation and writing practice.",
        },
      ],
      "2": [
        {
          id: "37",
          name: "Classical Literature",
          code: "BAN201",
          credits: 3,
          instructor: "Dr. Priya",
          schedule: "MWF 10:00-11:30 AM",
          difficulty: "Advanced",
          description: "In-depth study of classical Bengali poetry and epics.",
        },
        {
          id: "38",
          name: "Contemporary Bangla",
          code: "BAN202",
          credits: 3,
          instructor: "Prof. Dina",
          schedule: "TTh 1:00-2:30 PM",
          difficulty: "Intermediate",
          description:
            "Modern Bengali literature and contemporary writing trends.",
        },
        {
          id: "39",
          name: "Poetry & Prose",
          code: "BAN203",
          credits: 3,
          instructor: "Dr. Meera",
          schedule: "MWF 2:00-3:30 PM",
          difficulty: "Intermediate",
          description: "Analysis of Bengali poetry forms and prose narratives.",
        },
        {
          id: "40",
          name: "Language Lab",
          code: "BAN202L",
          credits: 1,
          instructor: "Prof. Anjali",
          schedule: "TTh 3:00-4:30 PM",
          difficulty: "Beginner",
          description: "Advanced conversation and composition workshop.",
        },
      ],
    },
  };

  const courses = coursesData[department]?.[semester] || [];

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          No courses available for this selection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {courses.map((course) => (
        <CourseCardDesign
          key={course.id}
          course={course}
          onAddCourse={onAddCourse}
          isSelected={selectedCourses?.includes(course.id)}
        />
      ))}
    </div>
  );
}
