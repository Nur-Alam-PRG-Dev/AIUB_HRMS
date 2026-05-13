import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null,
      permissions: [],

      setAuth: (user, token) => {
        const role = user.roles?.[0] ?? null;
        Cookies.set("hrms_token", token, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        Cookies.set("hrms_role", role ?? "", {
          expires: 7,
          sameSite: "strict",
        });
        set({
          user,
          token,
          role,
          permissions: user.permissions ?? [],
        });
      },

      clearAuth: () => {
        Cookies.remove("hrms_token");
        Cookies.remove("hrms_role");
        set({ user: null, token: null, role: null, permissions: [] });
      },

      hasPermission: (permission) => {
        const { permissions, role } = get();
        return role === "super_admin" || permissions.includes(permission);
      },

      hasRole: (...roles) => {
        const { role } = get();
        return roles.includes(role);
      },

      isAuthenticated: () => !!get().token,
    }),
    {
      name: "hrms-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
        permissions: state.permissions,
      }),
    }
  )
);
