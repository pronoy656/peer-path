"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { signOut } from "@/lib/services/auth";
import type { Role } from "@/lib/types";
import RoleGuard from "./RoleGuard";

export interface DashboardNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
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
  const { dispatch, currentUser, showToast } = useAppStore();
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

  const initials = currentUser
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "PP";

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-slate-900 font-extrabold text-lg">P</span>
          </div>
          <div>
            <span className="font-bold text-base block leading-tight">
              PeerPath
            </span>
            <span className="text-[11px] font-semibold text-amber-700">
              {roleTitle}
            </span>
          </div>
        </Link>
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-yellow-400 text-slate-900 font-semibold shadow-sm"
                  : "text-foreground/80 hover:bg-muted"
              }`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className="shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    active
                      ? "bg-slate-900 text-white"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border space-y-1.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Public Site</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <RoleGuard allowedRole={allowedRole}>
      <div className="min-h-screen bg-muted/30 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 bg-card border-r border-border sticky top-0 h-screen">
          {sidebarContent}
        </aside>

        {/* Mobile Drawer */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden bg-black/50 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          >
            <aside
              className="w-64 h-full bg-card border-r border-border shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {sidebarContent}
            </aside>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 bg-card/90 backdrop-blur-md border-b border-border px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                aria-label="Open dashboard navigation"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg border border-border hover:bg-muted"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-foreground truncate">
                  {navItems.find((n) => n.id === activeTab)?.label ?? roleTitle}
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  ULAB PeerPath • {roleTitle}
                </p>
              </div>
            </div>

            {currentUser && (
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold leading-tight">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentUser.department || "ULAB"}
                    {currentUser.batch ? ` • Batch ${currentUser.batch}` : ""}
                  </p>
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-slate-900 border border-yellow-400"
                  style={{
                    backgroundColor: currentUser.avatarColor || "#facc15",
                  }}
                >
                  {initials}
                </div>
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
