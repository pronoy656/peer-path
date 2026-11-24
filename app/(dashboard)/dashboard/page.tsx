"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/AppStore";
import { getDashboardPathForRole } from "@/lib/services/auth";

export default function DashboardIndexRedirect() {
  const { currentUser, hydrated } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!currentUser) {
      router.replace("/signIn");
    } else {
      router.replace(getDashboardPathForRole(currentUser.role));
    }
  }, [hydrated, currentUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <p className="text-sm text-muted-foreground">
        Redirecting to your PeerPath dashboard...
      </p>
    </div>
  );
}
