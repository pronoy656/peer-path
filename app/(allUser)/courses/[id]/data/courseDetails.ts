/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(allUser)/courses/[id]/data/courseDetails.ts
export const courseDetails: Record<string, any> = {
    "1": {
        title: "Full Stack Web Development",
        instructor: "Sarah Chen",
        rating: 4.8,
        reviews: 342,
        students: 1240,
        difficulty: "Intermediate",
        duration: "12 weeks",
        price: "$99",
        description: "Master full stack web development with React, Node.js, and databases. Learn to build production-ready applications.",
        image: "/bangla.jpg",
        syllabus: [
            "Frontend Fundamentals",
            "Backend Development",
            "Database Design",
            "Deployment & DevOps",
            "Real-world Projects",
        ],
        reviewsList: [
            { id: 1, author: "Alex Johnson", rating: 5, title: "Excellent course!", text: "Best course I've taken. Sarah explains everything clearly.", helpful: 24, date: "2 weeks ago" },
            { id: 2, author: "Maria Garcia", rating: 4, title: "Very comprehensive", text: "Great content but a bit fast-paced.", helpful: 18, date: "1 month ago" },
        ],
    },
    "2": {
        title: "Data Science Fundamentals",
        instructor: "Prof. Rajesh Kumar",
        rating: 4.9,
        reviews: 512,
        students: 1820,
        difficulty: "Advanced",
        duration: "14 weeks",
        price: "$129",
        description: "Comprehensive data science course covering statistics, machine learning, and real-world applications.",
        image: "/bangla.jpg",
        syllabus: ["Statistics Basics", "Python for Data Analysis", "Machine Learning", "Deep Learning", "Data Visualization"],
        reviewsList: [
            { id: 1, author: "Sam Chen", rating: 5, title: "Outstanding!", text: "Rajesh's teaching style is incredible.", helpful: 32, date: "3 weeks ago" },
        ],
    },
};