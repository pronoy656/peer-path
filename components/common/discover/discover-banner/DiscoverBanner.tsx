// import React from "react";

// export default function DiscoverBanner() {
//   return <div className="text-3xl text-red-500">DiscoverBanner Page</div>;
// }

import { ArrowRight } from "lucide-react";

export default function DiscoverBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-background pt-28 pb-16">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Left Content */}
          <div className="space-y-6 flex flex-col justify-center">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full border border-primary/20 w-fit">
              <span className="text-sm font-semibold text-primary">
                Explore Quality Education
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Discover Your{" "}
              <span className="text-primary">Perfect Courses</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Browse through our comprehensive course catalog organized by
              departments and semesters. Find the perfect courses that match
              your academic interests and career goals.
            </p>

            <div className="flex gap-4 pt-4">
              <button className="px-6 py-3 bg-primary/15 text-primary rounded-lg font-semibold hover:bg-primary/25 transition-colors duration-300 flex items-center gap-2 border border-primary/20">
                Explore Courses
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-6 py-3 border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition-colors duration-300">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Courses</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">50+</p>
                <p className="text-sm text-muted-foreground">Instructors</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">5k+</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-full min-h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl" />
            <img
              src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=500&fit=crop"
              alt="Students discovering courses"
              className="relative rounded-2xl shadow-lg w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
