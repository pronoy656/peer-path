"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Star,
  MessageCircle,
  MapPin,
  Briefcase,
  Search,
  ArrowRight,
  X,
  Linkedin,
  Facebook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const mentors = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    title: "Tech Lead at Google",
    department: "CSE",
    expertise: ["AI/ML", "Full Stack", "Leadership"],
    rating: 4.9,
    reviews: 127,
    availability: "Available",
    mentees: 45,
    image: "/avater-2.jpg",
    bio: "Senior engineer with 10+ years experience in tech. Passionate about helping newcomers break into the industry.",
  },
  {
    id: 2,
    name: "Michael Brown",
    title: "Senior Product Manager at Meta",
    department: "BBA",
    expertise: ["Product Strategy", "Business Development", "Growth"],
    rating: 4.8,
    reviews: 89,
    availability: "Available",
    mentees: 32,
    image: "/avater-1.jpg",
    bio: "Product leader focused on scaling teams and building products that matter.",
  },
  {
    id: 3,
    name: "Lisa Wang",
    title: "Founder & CEO",
    department: "BBA",
    expertise: ["Entrepreneurship", "Fundraising", "Strategy"],
    rating: 4.9,
    reviews: 156,
    availability: "Limited",
    mentees: 28,
    image: "/avater-2.jpg",
    bio: "Built two successful startups from scratch. Now mentoring next-gen founders.",
  },
  {
    id: 4,
    name: "James Wilson",
    title: "Senior UX Designer at Apple",
    department: "CSE",
    expertise: ["UX Design", "Product Design", "Design Systems"],
    rating: 4.7,
    reviews: 94,
    availability: "Available",
    mentees: 38,
    image: "/avater-1.jpg",
    bio: "Design leader passionate about creating intuitive user experiences.",
  },
  {
    id: 5,
    name: "Emma Martinez",
    title: "Data Science Manager at Netflix",
    department: "CSE",
    expertise: ["Data Science", "ML Engineering", "Analytics"],
    rating: 4.8,
    reviews: 112,
    availability: "Available",
    mentees: 41,
    image: "/avater-2.jpg",
    bio: "Data scientist helping others navigate the AI/ML landscape.",
  },
  {
    id: 6,
    name: "David Park",
    title: "VP of Engineering at Stripe",
    department: "CSE",
    expertise: ["Systems Design", "Engineering Management", "Tech Culture"],
    rating: 4.9,
    reviews: 134,
    availability: "Available",
    mentees: 35,
    image: "/avater-2.jpg",
    bio: "Engineering leader focused on building high-performing teams.",
  },
  {
    id: 7,
    name: "Priya Sharma",
    title: "Marketing Director at TechCorp",
    department: "BBA",
    expertise: ["Marketing Strategy", "Brand Development", "Digital Marketing"],
    rating: 4.8,
    reviews: 98,
    availability: "Available",
    mentees: 29,
    image: "/avater-2.jpg",
    bio: "Marketing expert focused on building strong brands and growth strategies.",
  },
  {
    id: 8,
    name: "Prof. Ahmed Hassan",
    title: "English Department Head",
    department: "English",
    expertise: ["Academic Writing", "Communication", "Teaching Methodology"],
    rating: 4.9,
    reviews: 110,
    availability: "Available",
    mentees: 26,
    image: "/avater-2.jpg",
    bio: "Dedicated educator helping students master the art of communication.",
  },
  {
    id: 9,
    name: "Dr. Ravi Kumar",
    title: "Research Scholar in Media Studies",
    department: "MSJ",
    expertise: ["Journalism", "Media Studies", "Content Creation"],
    rating: 4.7,
    reviews: 85,
    availability: "Limited",
    mentees: 22,
    image: "/avater-1.jpg",
    bio: "Media professional helping aspiring journalists find their voice.",
  },
  {
    id: 10,
    name: "Tanvi Das",
    title: "Bengali Literature Expert",
    department: "Bangla",
    expertise: ["Bengali Literature", "Language Teaching", "Cultural Studies"],
    rating: 4.8,
    reviews: 92,
    availability: "Available",
    mentees: 24,
    image: "/avater-1.jpg",
    bio: "Passionate about preserving and sharing Bengali language and culture.",
  },
];

const jobs = [
  {
    id: 1,
    title: "Junior Full Stack Developer",
    company: "Tech Startup",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$80K - $120K",
    postedBy: "Alumni",
    date: "2 days ago",
  },
  {
    id: 2,
    title: "Data Science Intern",
    company: "AI Company",
    location: "Remote",
    type: "Internship",
    salary: "$15 - $20/hr",
    postedBy: "Alumni",
    date: "5 days ago",
  },
  {
    id: 3,
    title: "Product Manager",
    company: "E-commerce Platform",
    location: "New York, NY",
    type: "Full-time",
    salary: "$120K - $160K",
    postedBy: "Alumni",
    date: "1 week ago",
  },
  {
    id: 4,
    title: "UX/UI Designer",
    company: "Design Studio",
    location: "Los Angeles, CA",
    type: "Full-time",
    salary: "$90K - $130K",
    postedBy: "Alumni",
    date: "1 week ago",
  },
];

const departmentExpertise: Record<string, string[]> = {
  All: ["All"],
  CSE: [
    "AI/ML",
    "Full Stack",
    "Data Science",
    "UX Design",
    "Leadership",
    "Systems Design",
  ],
  BBA: [
    "Product Strategy",
    "Business Development",
    "Entrepreneurship",
    "Fundraising",
    "Marketing Strategy",
  ],
  MSJ: ["Journalism", "Media Studies", "Content Creation"],
  English: ["Academic Writing", "Communication", "Teaching Methodology"],
  Bangla: ["Bengali Literature", "Language Teaching", "Cultural Studies"],
};

export default function AllAlumniSection() {
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedExpertise, setSelectedExpertise] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [mentorFilter, setMentorFilter] = useState("all");
  const [connectingMentor, setConnectingMentor] = useState<number | null>(null);

  const departments = ["All", "CSE", "BBA", "MSJ", "English", "Bangla"];
  const expertiseAreas =
    departmentExpertise[selectedDepartment] || departmentExpertise["All"];

  const filtered = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" || mentor.department === selectedDepartment;
    const matchesExpertise =
      selectedExpertise === "All" ||
      mentor.expertise.includes(selectedExpertise);
    const matchesFilter =
      mentorFilter === "all" ||
      (mentorFilter === "available" && mentor.availability === "Available");

    return (
      matchesSearch && matchesDepartment && matchesExpertise && matchesFilter
    );
  });

  return (
    <div className="min-h-screen flex flex-col ">
      <main className="flex-1 pt-28">
        {/* Hero Section with Background Image */}
        <section className="relative py-16 md:py-28 overflow-hidden bg-yellow-50 dark:bg-yellow-950/20">
          <div className="absolute inset-0 z-0">
            <Image
              src="/alumni-together.jpg"
              alt="Alumni Network Background"
              fill
              className="h-full w-full object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700/70 to-gray-700/50"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Alumni Network
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Connect with industry leaders, discover opportunities, and grow
                your professional network.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-gray-400/20 backdrop-blur-sm rounded-lg p-4 border border-gray-300/30">
                  <p className="text-2xl font-bold text-white">800+</p>
                  <p className="text-sm text-white/80">Active Mentors</p>
                </div>
                <div className="bg-gray-400/20 backdrop-blur-sm rounded-lg p-4 border border-gray-300/30">
                  <p className="text-2xl font-bold text-white">5K+</p>
                  <p className="text-sm text-white/80">Job Placements</p>
                </div>
                <div className="bg-gray-400/20 backdrop-blur-sm rounded-lg p-4 border border-gray-300/30">
                  <p className="text-2xl font-bold text-white">95%</p>
                  <p className="text-sm text-white/80">Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mentors Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Find Your Mentor</h2>
                <p className="text-foreground/60 mt-2">
                  Connect with industry experts
                </p>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="space-y-4 mb-8 bg-card p-6 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                <input
                  type="text"
                  placeholder="Search mentors by name or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-3 border border-yellow-200 dark:border-yellow-900/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Department Filter */}
              <div className="space-y-3">
                <p className="text-sm font-semibold">Department</p>
                <div className="flex flex-wrap gap-2">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => {
                        setSelectedDepartment(dept);
                        setSelectedExpertise("All");
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedDepartment === dept
                          ? "bg-yellow-500 text-black shadow-md"
                          : "bg-yellow-100 dark:bg-yellow-900/30 text-foreground hover:bg-yellow-200 dark:hover:bg-yellow-900/40"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Expertise Filter */}
              <div className="space-y-3">
                <p className="text-sm font-semibold">Expertise Areas</p>
                <div className="flex flex-wrap gap-2">
                  {expertiseAreas.map((area) => (
                    <button
                      key={area}
                      onClick={() => setSelectedExpertise(area)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedExpertise === area
                          ? "bg-primary text-black shadow-md"
                          : "bg-secondary dark:bg-yellow-900/30 text-foreground hover:bg-primary dark:hover:bg-yellow-900/40"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="flex gap-3">
                <button
                  onClick={() => setMentorFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    mentorFilter === "all"
                      ? "bg-yellow-500 text-black"
                      : "bg-primary/30 dark:bg-yellow-900/30 text-foreground hover:bg-yellow-200 dark:hover:bg-yellow-900/40"
                  }`}
                >
                  All Mentors
                </button>
                <button
                  onClick={() => setMentorFilter("available")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    mentorFilter === "available"
                      ? "bg-yellow-500 text-black"
                      : "bg-primary dark:bg-yellow-900/30 text-foreground hover:bg-yellow-200 dark:hover:bg-yellow-900/40"
                  }`}
                >
                  Available Now
                </button>
              </div>
            </div>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((mentor) => (
                <Card
                  key={mentor.id}
                  className="p-6 hover:shadow-lg transition-all hover:scale-102 hover:border-primary flex flex-col bg-gradient-to-br from-card to-card/50 border-yellow-200 dark:border-yellow-900/30"
                >
                  <div className="space-y-4 flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3 flex-1">
                        <Image
                          src={mentor.image || "/placeholder.svg"}
                          alt={mentor.name}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg line-clamp-1">
                            {mentor.name}
                          </h3>
                          <p className="text-sm text-foreground/60 line-clamp-1">
                            {mentor.title}
                          </p>
                        </div>
                      </div>
                      {mentor.availability === "Available" && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium whitespace-nowrap ml-2">
                          Available
                        </span>
                      )}
                    </div>

                    {/* Department Badge */}
                    <span className="inline-block px-3 py-1 bg-yellow-200 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-200 text-xs rounded-full font-medium">
                      {mentor.department}
                    </span>

                    {/* Bio */}
                    <p className="text-sm text-foreground/70 line-clamp-2">
                      {mentor.bio}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(mentor.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-border"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {mentor.rating}
                      </span>
                      <span className="text-xs text-foreground/60">
                        ({mentor.reviews})
                      </span>
                    </div>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.slice(0, 2).map((exp) => (
                        <span
                          key={exp}
                          className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-200 text-xs rounded-full font-medium"
                        >
                          {exp}
                        </span>
                      ))}
                      {mentor.expertise.length > 2 && (
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-200 text-xs rounded-full font-medium">
                          +{mentor.expertise.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="text-xs text-foreground/60 pt-2">
                      <p>{mentor.mentees} mentees this year</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-primary/40 dark:border-primary/30 mt-4">
                    <Link href={`/alumni/${mentor.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent border-primary dark:border-yellow-900/30 hover:bg-primary dark:hover:bg-primary/20"
                      >
                        View Profile
                      </Button>
                    </Link>
                    <Button
                      className="flex-1 gap-2 bg-primary hover:bg-yellow-600 text-black"
                      onClick={() => setConnectingMentor(mentor.id)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Connect
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Job Board Section - Enhanced Design */}
        <section className="py-16 md:py-20 bg-yellow-50 dark:bg-yellow-950/20 border-y border-yellow-200 dark:border-yellow-900/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Alumni Job Board</h2>
                <p className="text-foreground/60 mt-2">
                  Opportunities from our alumni network
                </p>
              </div>
              <Link href="/alumni/jobs">
                <Button className="gap-2 bg-yellow-500 hover:bg-yellow-600 text-black">
                  View All Jobs
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-4">
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  className="p-6 hover:shadow-lg transition-all hover:border-yellow-500 border-l-4 border-yellow-500/30 hover:border-l-yellow-500 bg-gradient-to-r from-card to-card/50"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="text-2xl mt-1">💼</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-foreground">
                            {job.title}
                          </h3>
                          <p className="text-foreground/60">{job.company}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-foreground/60 mt-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.type}
                        </span>
                        <span className="font-semibold text-foreground">
                          {job.salary}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-200 text-xs rounded-full font-medium">
                          {job.type}
                        </span>
                        <span className="px-3 py-1 bg-yellow-100/50 dark:bg-yellow-900/20 text-foreground/60 text-xs rounded-full font-medium">
                          Posted {job.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Link href={`/alumni/jobs/${job.id}`}>
                        <Button className="bg-primary hover:bg-primary text-black">
                          Apply Now
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="border-primary dark:border-yellow-900/30"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Networking Events */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">
              Upcoming Networking Events
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Alumni Lunch & Learn",
                  date: "March 15, 2025",
                  time: "12:00 PM - 1:30 PM",
                  speaker: "Sarah Chen - Tech Lead at Google",
                  topic: "AI/ML Career Paths",
                  icon: "🍽️",
                },
                {
                  title: "Startup Founder Panel",
                  date: "March 22, 2025",
                  time: "6:00 PM - 7:30 PM",
                  speaker: "4 Successful Founders",
                  topic: "From Idea to IPO",
                  icon: "🚀",
                },
                {
                  title: "Product Management Workshop",
                  date: "March 29, 2025",
                  time: "3:00 PM - 5:00 PM",
                  speaker: "Michael Brown - PM at Meta",
                  topic: "Building Products Users Love",
                  icon: "📱",
                },
                {
                  title: "Design Systems Talk",
                  date: "April 5, 2025",
                  time: "5:00 PM - 6:30 PM",
                  speaker: "James Wilson - Designer at Apple",
                  topic: "Scaling Design",
                  icon: "🎨",
                },
              ].map((event, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-all hover:scale-105 border-t-4 border-yellow-500 hover:border-yellow-600 bg-gradient-to-br from-card to-card/50"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg flex-1">
                        {event.title}
                      </h3>
                      <span className="text-2xl">{event.icon}</span>
                    </div>
                    <div className="space-y-2 text-sm text-foreground/60">
                      <p className="font-medium text-foreground">
                        📅 {event.date}
                      </p>
                      <p>⏰ {event.time}</p>
                      <p>🎤 {event.speaker}</p>
                      <p className="text-yellow-600 dark:text-yellow-400 font-medium">
                        📌 {event.topic}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-yellow-200 dark:border-yellow-900/30 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    >
                      Register Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="contact-mentors"
          className="relative py-16 md:py-20 overflow-hidden bg-primary dark:bg-primary/20"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/alumni-together.jpg"
              alt="Alumni Network CTA"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-yellow-600/70 dark:bg-yellow-900/70"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Connect?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Get matched with industry leaders, explore opportunities, and
              accelerate your career growth.
            </p>
            <Button className="px-8 py-3 bg-white text-primary hover:bg-yellow-50 text-lg font-semibold">
              Start Your Journey
            </Button>
          </div>
        </section>
      </main>

      {connectingMentor !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">
                Connect with{" "}
                {mentors.find((m) => m.id === connectingMentor)?.name}
              </h3>
              <button
                onClick={() => setConnectingMentor(null)}
                className="text-foreground/60 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-black border h-12">
                <Linkedin className="h-5 w-5" />
                Connect via LinkedIn
              </Button>
              <Button className="w-full gap-2 bg-blue-500 hover:bg-blue-600 text-white h-12">
                <Facebook className="h-5 w-5" />
                Connect via Facebook
              </Button>
              <Button className="w-full gap-2 bg-black dark:bg-gray-800 hover:bg-gray-900 dark:hover:bg-gray-700 text-black border h-12">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.908 6.75h-3.315l7.73-8.835L.424 2.25h6.755l4.872 6.237 5.477-6.237zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Connect via X
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => setConnectingMentor(null)}
            >
              Cancel
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
