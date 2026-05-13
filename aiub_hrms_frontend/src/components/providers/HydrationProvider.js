"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function HydrationProvider({ children }) {
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  // Zustand persist calls onRehydrateStorage automatically, but as a safety net:
  useEffect(() => {
    // Give it one tick, then force-hydrate if not already done
    const timer = setTimeout(() => {
      if (!useAuthStore.getState().isHydrated) {
        setHydrated();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [setHydrated]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-base-content/50 font-medium tracking-wide">
            Loading AIUB HRMS...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
