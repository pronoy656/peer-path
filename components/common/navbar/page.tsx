"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  GraduationCap,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/store/AppStore";
import { getDashboardPathForRole, signOut } from "@/lib/services/auth";
import { getUnreadCount } from "@/lib/services/notifications";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Discover", href: "/discover" },
  { label: "Courses", href: "/courses" },
  { label: "Faculty", href: "/faculty" },
  { label: "Students", href: "/students" },
  { label: "Alumni", href: "/alumni" },
  { label: "Community", href: "/community" },
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
    const handleScroll = () => setIsScrolled(window.scrollY > 4);
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
      className={`fixed top-0 w-full z-50 transition-all duration-150 ${
        isScrolled || isMobileMenuOpen
          ? "bg-card/95 backdrop-blur-md border-b border-border shadow-[var(--shadow-card)]"
          : "bg-card/80 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-accent text-accent-foreground flex items-center justify-center shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </span>
          <span className="font-display font-bold text-xl tracking-tight text-primary">
            PeerPath
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const active = isRouteActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-2 text-sm font-medium transition-colors duration-150 rounded-lg ${
                  active
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-3 right-3 -bottom-0.5 h-[3px] rounded-full bg-accent"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Session Actions */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          {currentUser ? (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-full border border-border bg-card hover:bg-muted transition-colors"
              >
                <Avatar
                  src={currentUser.avatar}
                  name={currentUser.name}
                  size="sm"
                  department={currentUser.department}
                  avatarColor={currentUser.avatarColor}
                />
                <div className="text-left">
                  <span className="block text-xs font-semibold leading-tight text-foreground max-w-[110px] truncate">
                    {currentUser.name}
                  </span>
                  <span className="block text-[11px] capitalize text-muted-foreground">
                    {currentUser.role}
                  </span>
                </div>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-150 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-[var(--shadow-modal)] overflow-hidden">
                  <div className="px-4 py-3 border-b border-border bg-muted/50">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {currentUser.email}
                    </p>
                  </div>
                  <Link
                    href={dashboardHref}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted text-sm font-medium text-foreground transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                    <span>My Dashboard</span>
                  </Link>
                  <Link
                    href={dashboardHref}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-muted text-sm text-foreground transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-xs font-bold text-danger">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-danger w-full text-left text-sm font-medium border-t border-border transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/signIn">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/signUp">
                <Button variant="default" size="sm">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-muted text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Full Slide-Down Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-b border-border px-4 pb-6 pt-2 space-y-1 shadow-[var(--shadow-modal)]">
          {navItems.map((item) => {
            const active = isRouteActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between min-h-[44px] px-4 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <span>{item.label}</span>
                {active && (
                  <span className="w-2 h-2 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}

          <div className="border-t border-border pt-4 mt-3 space-y-2">
            {currentUser ? (
              <>
                <div className="flex items-center gap-3 px-2 py-2">
                  <Avatar
                    src={currentUser.avatar}
                    name={currentUser.name}
                    size="sm"
                    department={currentUser.department}
                    avatarColor={currentUser.avatarColor}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {currentUser.role}
                    </p>
                  </div>
                </div>
                <Link
                  href={dashboardHref}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block"
                >
                  <Button className="w-full" size="md">
                    <LayoutDashboard className="w-4 h-4" />
                    My Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="md"
                  className="w-full text-danger"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/signIn"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="outline" size="md" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link
                  href="/signUp"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="default" size="md" className="w-full">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
