// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import {
//   Menu,
//   X,
//   Home,
//   Compass,
//   BookOpen,
//   Users,
//   UserCheck,
//   MessageSquare,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function Navbar() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [activeRoute, setActiveRoute] = useState("#");

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 0);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const navItems = [
//     { label: "Home", href: "/", icon: Home },
//     { label: "Discover", href: "/discover", icon: Compass },
//     { label: "Course", href: "/courses", icon: BookOpen },
//     { label: "Students", href: "/students", icon: Users },
//     { label: "Instructor", href: "/instructor", icon: UserCheck },
//     { label: "Faculty", href: "/faculty", icon: Users },
//     { label: "Community", href: "/community", icon: MessageSquare },
//   ];

//   return (
//     <nav
//       className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//         isScrolled
//           ? "bg-background/50 backdrop-blur-xl border-b border-border/50 shadow-lg"
//           : "bg-transparent"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-6 py-4">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-lg">P</span>
//             </div>
//             <span className="font-bold text-xl hidden sm:inline text-foreground">
//               Peer-Path
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden lg:flex items-center gap-2">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = activeRoute === item.href;
//               return (
//                 <Link
//                   key={item.label}
//                   href={item.href}
//                   onClick={() => setActiveRoute(item.href)}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
//                     isActive
//                       ? "bg-yellow-400 text-black shadow-md hover:shadow-lg"
//                       : "text-foreground/80 hover:bg-yellow-400/20 hover:text-yellow-500"
//                   }`}
//                 >
//                   <Icon className="w-4 h-4" />
//                   <span>{item.label}</span>
//                 </Link>
//               );
//             })}
//           </div>

//           {/* Desktop Right Section */}
//           <div className="hidden lg:flex items-center gap-4">
//             <Link
//               href="/signIn"
//               className="text-foreground/80 hover:text-yellow-500 font-medium transition-colors"
//             >
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="border-border hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all"
//               >
//                 Sign In
//               </Button>
//             </Link>
//             {/* Profile Picture */}
//             <div className="w-10 h-10 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
//               <span className="text-black font-bold text-sm">JD</span>
//             </div>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="lg:hidden p-2"
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             aria-label="Toggle menu"
//           >
//             {isMobileMenuOpen ? (
//               <X className="w-6 h-6 text-foreground" />
//             ) : (
//               <Menu className="w-6 h-6 text-foreground" />
//             )}
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         {isMobileMenuOpen && (
//           <div
//             className={`lg:hidden mt-4 pb-4 border-t border-border/50 transition-all duration-300 ${
//               isScrolled ? "bg-background/50 backdrop-blur-xl" : "bg-background"
//             }`}
//           >
//             <div className="flex flex-col gap-2 pt-4">
//               {navItems.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = activeRoute === item.href;
//                 return (
//                   <Link
//                     key={item.label}
//                     href={item.href}
//                     onClick={() => {
//                       setActiveRoute(item.href);
//                       setIsMobileMenuOpen(false);
//                     }}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
//                       isActive
//                         ? "bg-yellow-400 text-black shadow-md"
//                         : "text-foreground/80 hover:bg-yellow-400/20 hover:text-yellow-500"
//                     }`}
//                   >
//                     <Icon className="w-4 h-4" />
//                     <span>{item.label}</span>
//                   </Link>
//                 );
//               })}
//               <div className="flex gap-2 pt-2 border-t border-border/50 mt-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="flex-1 border-border hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all"
//                 >
//                   Sign In
//                 </Button>
//                 <div className="w-10 h-10 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
//                   <span className="text-black font-bold text-sm">JD</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  Compass,
  BookOpen,
  Users,
  UserCheck,
  MessageSquare,
  ChevronDown,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState("#");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Close dropdown when clicking outside
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Course", href: "/courses", icon: BookOpen },
    { label: "Students", href: "/students", icon: Users },
    { label: "Alumni", href: "/alumni", icon: UserCheck },
    { label: "Faculty", href: "/faculty", icon: Users },
    { label: "Community", href: "/community", icon: MessageSquare },
  ];

  const handleLogout = () => {
    // Add your logout logic here (e.g. clear auth, redirect)
    console.log("Logging out...");
    setIsProfileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline text-foreground">
              Peer-Path
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setActiveRoute(item.href)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-yellow-400 text-black shadow-md hover:shadow-lg"
                      : "text-foreground/80 hover:bg-yellow-400/20 hover:text-yellow-500"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/signIn">
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all"
              >
                Sign In
              </Button>
            </Link>

            {/* Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-yellow-400/20 transition-all group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center cursor-pointer shadow-md group-hover:shadow-xl transition-shadow">
                  <span className="text-black font-bold text-sm">JD</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-foreground/70 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border/50 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-yellow-400/10 text-foreground/90 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-red-500 w-full text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div
            className={`lg:hidden mt-4 pb-4 border-t border-border/50 transition-all duration-300 ${
              isScrolled ? "bg-background/80 backdrop-blur-xl" : "bg-background"
            }`}
          >
            <div className="flex flex-col gap-2 pt-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeRoute === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      setActiveRoute(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                      isActive
                        ? "bg-yellow-400 text-black shadow-md"
                        : "text-foreground/80 hover:bg-yellow-400/20 hover:text-yellow-500"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Mobile Profile Section */}
              <div className="border-t border-border/50 pt-4 mt-2 space-y-3">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-foreground/90 hover:bg-yellow-400/10 rounded-lg"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>

              <div className="flex gap-2 pt-2 border-t border-border/50 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-border hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all"
                >
                  Sign In
                </Button>
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">JD</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
