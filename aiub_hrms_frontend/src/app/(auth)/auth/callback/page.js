"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { setAuth } = useAuthStore();

  useEffect(() => {
    if (!token) {
      toast.error("Authentication failed");
      router.push("/login");
      return;
    }

    // Since we just got the token from URL, we temporarily set it to fetch the user
    // The axios interceptor will pick it up from cookies, but let's set it first.
    // Instead of directly setting cookie, we can use the setAuth, but we need the user object first.
    
    // Quick workaround: set temporary cookie to allow /auth/me call
    document.cookie = `hrms_token=${token}; path=/`;

    const fetchUser = async () => {
      try {
        const res = await authApi.me();
        const user = res.data.data;
        setAuth(user, token);
        toast.success(`Welcome back, ${user.name}!`);
        router.push("/dashboard");
      } catch (err) {
        toast.error("Failed to fetch user profile");
        router.push("/login");
      }
    };

    fetchUser();
  }, [token, router, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-surface)" }}>
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-4 animate-spin mx-auto mb-4"
             style={{ borderColor: "var(--color-primary-fixed)", borderTopColor: "var(--color-primary)" }} />
        <h2 className="font-bold text-lg" style={{ color: "var(--color-primary)" }}>Authenticating...</h2>
        <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>Please wait while we secure your session.</p>
      </div>
    </div>
  );
}
