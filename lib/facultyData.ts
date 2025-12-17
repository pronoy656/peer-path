
export interface Review {
    id: string;
    studentName: string;
    rating: number;
    comment: string;
    date: string;
}

export interface Course {
    id: string;
    code: string;
    name: string;
    semester?: string;
}

export interface FacultyMember {
    id: string;
    name: string;
    email: string;
    image: string;
    department: string;
    researchArea: string;
    experienceYears: number;
    rating: number;
    bio: string;
    teachingMethodology?: string;
    coursesPrevious: Course[];
    coursesCurrent: Course[];
    reviews: Review[];
}

export const facultyData: FacultyMember[] = [
    {
        id: "1",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        image: "https://i.pravatar.cc/150?u=sarah",
        department: "Computer Science",
        researchArea: "Artificial Intelligence, Machine Learning",
        experienceYears: 12,
        rating: 4.8,
        bio: "Dr. Johnson is a leading researcher in AI with a focus on ethical machine learning. She has published over 50 papers in top-tier conferences.",
        teachingMethodology: "I believe in project-based learning and encourage students to solve real-world problems using AI techniques.",
        coursesPrevious: [
            { id: "c1", code: "CS101", name: "Intro to Computer Science", semester: "Fall 2023" },
            { id: "c2", code: "CS405", name: "Machine Learning", semester: "Spring 2024" },
        ],
        coursesCurrent: [
            { id: "c3", code: "CS505", name: "Advanced AI", semester: "Fall 2024" },
        ],
        reviews: [
            { id: "r1", studentName: "Alice M.", rating: 5, comment: "Amazing professor! Explains complex concepts very clearly.", date: "2024-05-15" },
            { id: "r2", studentName: "John D.", rating: 4.5, comment: "Tough grader but learned a lot.", date: "2024-01-20" },
        ],
    },
    {
        id: "2",
        name: "Prof. Michael Chen",
        email: "michael.chen@university.edu",
        image: "https://i.pravatar.cc/150?u=michael",
        department: "Computer Science",
        researchArea: "Database Systems, Big Data",
        experienceYears: 18,
        rating: 4.5,
        bio: "Professor Chen has extensive industry experience having worked at major tech companies before joining academia. His research focuses on scalable data systems.",
        teachingMethodology: "My classes are interactive and focused on understanding the underlying principles of database design.",
        coursesPrevious: [
            { id: "c4", code: "CS302", name: "Database Management Systems", semester: "Spring 2023" },
        ],
        coursesCurrent: [
            { id: "c5", code: "CS402", name: "Big Data Analytics", semester: "Fall 2024" },
            { id: "c6", code: "CS101", name: "Intro to Computer Science", semester: "Fall 2024" },
        ],
        reviews: [
            { id: "r3", studentName: "Emily R.", rating: 4, comment: "Great insights into industry practices.", date: "2023-12-10" },
        ],
    },
    {
        id: "3",
        name: "Dr. Emily Davis",
        email: "emily.davis@university.edu",
        image: "https://i.pravatar.cc/150?u=emily",
        department: "Mathematics",
        researchArea: "Applied Mathematics, Cryptography",
        experienceYears: 8,
        rating: 4.9,
        bio: "Dr. Davis is passionate about making mathematics accessible to everyone. Her research in cryptography is funded by several grants.",
        teachingMethodology: "I use a lot of visual aids and try to connect mathematical theories to practical applications.",
        coursesPrevious: [
            { id: "c7", code: "MATH201", name: "Calculus II", semester: "Fall 2023" },
        ],
        coursesCurrent: [
            { id: "c8", code: "MATH305", name: "Linear Algebra", semester: "Fall 2024" },
        ],
        reviews: [
            { id: "r4", studentName: "David K.", rating: 5, comment: "Best math teacher I've ever had.", date: "2024-06-01" },
        ],
    },
    {
        id: "4",
        name: "Dr. Robert Wilson",
        email: "robert.wilson@university.edu",
        image: "https://i.pravatar.cc/150?u=robert",
        department: "Physics",
        researchArea: "Quantum Computing, Condensed Matter",
        experienceYears: 22,
        rating: 4.2,
        bio: "Dr. Wilson is a veteran physicist with a deep interest in the intersection of physics and computing.",
        teachingMethodology: "Rigorous mathematical derivations combined with conceptual demonstrations.",
        coursesPrevious: [
            { id: "c9", code: "PHY101", name: "General Physics I", semester: "Fall 2023" },
        ],
        coursesCurrent: [
            { id: "c10", code: "PHY401", name: "Quantum Mechanics", semester: "Fall 2024" },
        ],
        reviews: [
            { id: "r5", studentName: "Chris P.", rating: 4, comment: "Very knowledgeable but lectures can be dry.", date: "2023-11-20" },
        ]
    },
    {
        id: "5",
        name: "Prof. Laura Martinez",
        email: "laura.martinez@university.edu",
        image: "https://i.pravatar.cc/150?u=laura",
        department: "Biology",
        researchArea: "Genetics, Bioinformatics",
        experienceYears: 10,
        rating: 4.7,
        bio: "Prof. Martinez combines biology and computer science in her innovative research on genetic data analysis.",
        teachingMethodology: "Hands-on lab work and data analysis workshops.",
        coursesPrevious: [
            { id: "c11", code: "BIO202", name: "Genetics", semester: "Spring 2024" },
        ],
        coursesCurrent: [
            { id: "c12", code: "BIO304", name: "Bioinformatics", semester: "Fall 2024" },
        ],
        reviews: [
            { id: "r6", studentName: "Sarah L.", rating: 5, comment: "Love the lab sessions!", date: "2024-04-12" },
        ]
    }
];
