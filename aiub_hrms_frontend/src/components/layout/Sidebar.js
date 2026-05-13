"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api";
import toast from "react-hot-toast";
import { getInitials } from "@/lib/utils/format";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/employees", icon: "badge", label: "Employees" },
  { href: "/departments", icon: "domain", label: "Departments" },
  { href: "/salary", icon: "payments", label: "Salary" },
  { href: "/payroll", icon: "receipt_long", label: "Payroll" },
  { href: "/leave", icon: "event_busy", label: "Leave" },
  { href: "/attendance", icon: "fact_check", label: "Attendance" },
  { href: "/announcements", icon: "campaign", label: "Announcements" },
  { href: "/reports", icon: "assessment", label: "Reports" },
  { href: "/admin", icon: "admin_panel_settings", label: "Admin", roles: ["super_admin", "hr_admin"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {}
    clearAuth();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const visibleNav = navItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  return (
    <aside
      className="fixed left-0 top-0 h-screen z-50 flex flex-col py-6"
      style={{
        width: "var(--sidebar-width)",
        background: "linear-gradient(180deg, var(--color-primary-container), var(--color-primary))",
        boxShadow: "4px 0 16px rgba(0,30,64,0.15)",
      }}
    >
      {/* Logo */}
      <div className="px-6 mb-8">
        <h1
          className="font-bold text-white"
          style={{ fontSize: "20px", letterSpacing: "-0.02em" }}
        >
          AIUB HRMS
        </h1>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>
          University Management
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-grow flex flex-col gap-1 overflow-y-auto px-4"
        style={{ scrollbarWidth: "none" }}>
        {visibleNav.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-full cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-white text-[var(--color-primary)]"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  {item.icon}
                </span>
                <span style={{ fontSize: "14px", fontWeight: isActive ? "600" : "400" }}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-secondary-container)]"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div
        className="mx-4 mt-4 pt-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
      >
        <div className="flex items-center gap-3 px-2 mb-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{
              background: "var(--color-secondary-container)",
              color: "var(--color-on-secondary-fixed-variant)",
            }}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              getInitials(user?.name ?? "U")
            )}
          </div>
          <div className="overflow-hidden">
            <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
            <p className="text-white/60 text-xs capitalize">{role?.replace("_", " ")}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 w-full rounded-full text-white/80 hover:bg-white/10 transition-colors text-sm"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
