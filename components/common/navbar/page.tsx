"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store/AppStore";
import { getDashboardPathForRole, signOut } from "@/lib/services/auth";
import { getUnreadCount } from "@/lib/services/notifications";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Discover", href: "/discover", icon: Compass },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Faculty", href: "/faculty", icon: Users },
  { label: "Students", href: "/students", icon: Users },
  { label: "Alumni", href: "/alumni", icon: UserCheck },
  { label: "Community", href: "/community", icon: MessageSquare },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, dispatch, currentUser, showToast } = useAppStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
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

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const isRouteActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const dashboardHref = currentUser
    ? getDashboardPathForRole(currentUser.role)
    : "/signIn";
  const unreadCount = currentUser
    ? getUnreadCount(state, currentUser.id)
    : 0;

  const handleLogout = () => {
    signOut(dispatch);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    showToast("Signed out of PeerPath.", "info");
    router.push("/");
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-background/90 backdrop-blur-xl border-b border-border/60 shadow-sm"
          : "bg-background/70 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-slate-900 font-extrabold text-lg">P</span>
            </div>
            <span className="font-bold text-xl text-foreground">PeerPath</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                    active
                      ? "bg-yellow-400 text-slate-900 font-semibold shadow-sm"
                      : "text-foreground/80 hover:bg-yellow-400/20 hover:text-amber-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Session State */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-border bg-card hover:bg-yellow-50 transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-xs">
                    {getInitials(currentUser.name)}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold leading-tight text-foreground max-w-[110px] truncate">
                      {currentUser.name}
                    </span>
                    <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
                      {currentUser.role}
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold">
                      {unreadCount}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-border bg-muted/40">
                      <p className="text-sm font-semibold truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {currentUser.email}
                      </p>
                    </div>
                    <Link
                      href={dashboardHref}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-yellow-50 text-sm font-medium transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-amber-600" />
                      <span>My Dashboard</span>
                    </Link>
                    <Link
                      href={dashboardHref}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-yellow-50 text-sm transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <Bell className="w-4 h-4 text-muted-foreground" />
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="text-xs font-bold text-red-600">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 w-full text-left text-sm font-medium border-t border-border transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/signIn">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border hover:bg-yellow-400 hover:text-slate-900 hover:border-yellow-400"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signUp">
                  <Button
                    size="sm"
                    className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
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
          <div className="lg:hidden mt-3 pb-4 border-t border-border pt-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    active
                      ? "bg-yellow-400 text-slate-900 font-semibold"
                      : "text-foreground/80 hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="border-t border-border pt-3 mt-2 space-y-2">
              {currentUser ? (
                <>
                  <div className="px-4 py-1.5 text-xs text-muted-foreground">
                    Signed in as{" "}
                    <span className="font-semibold text-foreground">
                      {currentUser.name}
                    </span>{" "}
                    ({currentUser.role})
                  </div>
                  <Link
                    href={dashboardHref}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-yellow-400/20 text-foreground font-semibold text-sm"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>My Dashboard</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl w-full text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-2">
                  <Link
                    href="/signIn"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/signUp"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
