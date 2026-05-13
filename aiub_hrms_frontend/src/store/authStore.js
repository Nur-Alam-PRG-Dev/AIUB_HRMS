import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

const isProduction = process.env.NODE_ENV === "production";

const setAuthCookies = (token, role) => {
  const cookieOptions = {
    expires: 7,
    sameSite: "lax",          // CHANGED: strict → lax (strict blocks redirects from Google OAuth)
    secure: isProduction,     // CHANGED: only secure in production, not localhost
    path: "/",
  };
  Cookies.set("hrms_token", token, cookieOptions);
  Cookies.set("hrms_role", role, cookieOptions);
};

const clearAuthCookies = () => {
  Cookies.remove("hrms_token", { path: "/" });
  Cookies.remove("hrms_role", { path: "/" });
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null,
      permissions: [],
      isHydrated: false,          // NEW: track hydration state

      setHydrated: () => set({ isHydrated: true }),

      setAuth: (user, token) => {
        const role = user.roles?.[0]?.name ?? "employee";
        setAuthCookies(token, role);
        set({
          user,
          token,
          role,
          permissions: user.permissions ?? [],
        });
      },

      clearAuth: () => {
        clearAuthCookies();
        set({ user: null, token: null, role: null, permissions: [] });
      },

      hasPermission: (permission) => {
        const { permissions, role } = get();
        return role === "super_admin" || permissions.includes(permission);
      },
    }),
    {
      name: "hrms-auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Called once localStorage rehydration completes
        state?.setHydrated();
      },
    }
  )
);
