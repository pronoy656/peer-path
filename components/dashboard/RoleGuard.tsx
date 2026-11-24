"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/AppStore";
import { getDashboardPathForRole } from "@/lib/services/auth";
import type { Role } from "@/lib/types";

export default function RoleGuard({
  allowedRole,
  children,
}: {
  allowedRole: Role;
  children: React.ReactNode;
}) {
  const { currentUser, hydrated } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!currentUser) {
      router.replace("/signIn");
      return;
    }
    if (currentUser.role !== allowedRole) {
      router.replace(getDashboardPathForRole(currentUser.role));
    }
  }, [hydrated, currentUser, allowedRole, router]);

  if (!hydrated || !currentUser || currentUser.role !== allowedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
        <div className="max-w-sm w-full rounded-2xl border bg-card p-6 text-center space-y-2 animate-pulse">
          <div className="h-6 w-32 bg-muted rounded mx-auto" />
          <div className="h-4 w-48 bg-muted rounded mx-auto" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
