"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { signOut } from "@/lib/services/auth";
import { getUnreadCount } from "@/lib/services/notifications";
import { Avatar } from "@/components/ui/avatar";
import type { Role } from "@/lib/types";
import RoleGuard from "./RoleGuard";

export interface DashboardNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  group?: "Overview" | "Manage" | "Account";
}

export default function DashboardShell({
  allowedRole,
  roleTitle,
  navItems,
  activeTab,
  onSelectTab,
  children,
}: {
  allowedRole: Role;
  roleTitle: string;
  navItems: DashboardNavItem[];
  activeTab: string;
  onSelectTab: (id: string) => void;
  children: React.ReactNode;
}) {
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  const handleLogout = () => {
    signOut(dispatch);
    showToast("Signed out of PeerPath.", "info");
    router.push("/");
  };

  const unreadCount = currentUser
    ? getUnreadCount(state, currentUser.id)
    : 0;

  const activeLabel =
    navItems.find((n) => n.id === activeTab)?.label ?? roleTitle;

  // Group items cleanly with sensible defaults based on index/id
  const getGroup = (item: DashboardNavItem): "Overview" | "Manage" | "Account" => {
    if (item.group) return item.group;
    if (item.id === "overview") return "Overview";
    if (
      item.id === "settings" ||
      item.id === "profile" ||
      item.id === "notifications" ||
      item.id === "messages"
    ) {
      return "Account";
    }
    return "Manage";
  };

  const groups: Array<"Overview" | "Manage" | "Account"> = [
    "Overview",
    "Manage",
    "Account",
  ];

  const renderSidebar = (compactOnTablet = false) => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="p-4 lg:p-5 border-b border-sidebar-border flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <span className="w-9 h-9 rounded-lg bg-accent text-accent-foreground flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </span>
          <div className={compactOnTablet ? "md:hidden lg:block" : ""}>
            <span className="font-display font-bold text-base text-white block leading-tight">
              PeerPath
            </span>
            <span className="text-[11px] font-medium text-sidebar-foreground/70">
              {roleTitle}
            </span>
          </div>
        </Link>
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 text-sidebar-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Grouped Navigation */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
        {groups.map((group) => {
          const items = navItems.filter((item) => getGroup(item) === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className="space-y-1">
              <p
                className={`px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50 ${
                  compactOnTablet ? "md:hidden lg:block" : ""
                }`}
              >
                {group}
              </p>
              {items.map((item) => {
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    title={item.label}
                    onClick={() => {
                      onSelectTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 min-h-[42px] ${
                      active
                        ? "bg-white/10 text-white border-l-[3px] border-accent"
                        : "text-sidebar-foreground/80 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent"
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="shrink-0 w-[18px] h-[18px] flex items-center justify-center">
                        {item.icon}
                      </span>
                      <span
                        className={`truncate ${
                          compactOnTablet ? "md:hidden lg:inline" : ""
                        }`}
                      >
                        {item.label}
                      </span>
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-bold bg-accent text-accent-foreground ${
                          compactOnTablet ? "md:hidden lg:inline-block" : ""
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Pinned Bottom User Card */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <Link
          href="/"
          title="View public site"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-sidebar-foreground/75 hover:bg-white/5 hover:text-white transition"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          <span className={compactOnTablet ? "md:hidden lg:inline" : ""}>
            Public site
          </span>
        </Link>

        {currentUser && (
          <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar
                src={currentUser.avatar}
                name={currentUser.name}
                size="sm"
                department={currentUser.department}
                avatarColor={currentUser.avatarColor}
              />
              <div
                className={`min-w-0 ${
                  compactOnTablet ? "md:hidden lg:block" : ""
                }`}
              >
                <p className="text-xs font-semibold text-white truncate">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-sidebar-foreground/60 capitalize truncate">
                  {currentUser.role}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Sign out"
              aria-label="Sign out"
              className="p-1.5 rounded-lg text-sidebar-foreground/70 hover:text-white hover:bg-white/10 transition shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <RoleGuard allowedRole={allowedRole}>
      <div className="min-h-screen bg-background flex">
        {/* Tablet (icon rail) & Desktop (full) Sidebar */}
        <aside className="hidden md:block md:w-20 lg:w-64 shrink-0 sticky top-0 h-screen border-r border-sidebar-border">
          {renderSidebar(true)}
        </aside>

        {/* Mobile Drawer */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 md:hidden bg-black/50 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          >
            <aside
              className="w-64 h-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {renderSidebar(false)}
            </aside>
          </div>
        )}

        {/* Content Column */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 bg-card border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                aria-label="Open dashboard navigation"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border border-border hover:bg-muted"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>Dashboard</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-foreground font-medium">
                    {activeLabel}
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold font-display text-foreground truncate">
                  {activeLabel}
                </h1>
              </div>
            </div>

            {currentUser && (
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  aria-label="View notifications"
                  onClick={() => {
                    const hasNotif = navItems.some(
                      (n) => n.id === "notifications"
                    );
                    if (hasNotif) onSelectTab("notifications");
                  }}
                  className="relative p-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
                >
                  <Bell className="w-4 h-4 text-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
                  )}
                </button>
                <Avatar
                  src={currentUser.avatar}
                  name={currentUser.name}
                  size="sm"
                  department={currentUser.department}
                  avatarColor={currentUser.avatarColor}
                />
              </div>
            )}
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
