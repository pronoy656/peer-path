"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState("#");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Course", href: "/courses", icon: BookOpen },
    { label: "Students", href: "/students", icon: Users },
    { label: "Instructor", href: "/instructor", icon: UserCheck },
    { label: "Community", href: "/community", icon: MessageSquare },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/50 backdrop-blur-xl border-b border-border/50 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
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
            <Link
              href="/signIn"
              className="text-foreground/80 hover:text-yellow-500 font-medium transition-colors"
            >
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all"
              >
                Sign In
              </Button>
            </Link>
            {/* Profile Picture */}
            <div className="w-10 h-10 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
              <span className="text-black font-bold text-sm">JD</span>
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
              isScrolled ? "bg-background/50 backdrop-blur-xl" : "bg-background"
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
              <div className="flex gap-2 pt-2 border-t border-border/50 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-border hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all"
                >
                  Sign In
                </Button>
                <div className="w-10 h-10 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
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
