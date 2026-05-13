"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function useAuth({ required = true, role = null } = {}) {
  const router = useRouter();
  const { user, token, role: userRole, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return; // wait for localStorage rehydration

    if (required && !token) {
      router.replace("/login");
      return;
    }

    if (role && userRole !== role && userRole !== "super_admin") {
      router.replace("/dashboard");
    }
  }, [isHydrated, token, userRole, required, role, router]);

  return { user, token, role: userRole, isAuthenticated: !!token, isLoading: !isHydrated };
}
