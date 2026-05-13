"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import {
  RiDashboardLine, RiDashboardFill,
  RiTeamLine, RiTeamFill,
  RiMoneyDollarCircleLine, RiMoneyDollarCircleFill,
  RiFileListLine, RiFileListFill,
  RiCalendarCheckLine, RiCalendarCheckFill,
  RiTimeLine, RiTimeFill,
  RiMegaphoneLine, RiMegaphoneFill,
  RiBarChartBoxLine, RiBarChartBoxFill,
  RiShieldLine, RiMenuFoldLine, RiMenuUnfoldLine,
  RiLogoutBoxLine, RiBuildingLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: RiDashboardLine, activeIcon: RiDashboardFill, roles: ["all"] },
  { label: "Employees", href: "/employees", icon: RiTeamLine, activeIcon: RiTeamFill, roles: ["super_admin", "hr_admin", "manager"] },
  { label: "Departments", href: "/departments", icon: RiBuildingLine, activeIcon: RiBuildingLine, roles: ["super_admin", "hr_admin"] },
  { label: "Salary", href: "/salary", icon: RiMoneyDollarCircleLine, activeIcon: RiMoneyDollarCircleFill, roles: ["super_admin", "hr_admin"] },
  { label: "Payroll", href: "/payroll", icon: RiFileListLine, activeIcon: RiFileListFill, roles: ["super_admin", "hr_admin"] },
  { label: "Leave", href: "/leave", icon: RiCalendarCheckLine, activeIcon: RiCalendarCheckFill, roles: ["all"] },
  { label: "Attendance", href: "/attendance", icon: RiTimeLine, activeIcon: RiTimeFill, roles: ["all"] },
  { label: "Announcements", href: "/announcements", icon: RiMegaphoneLine, activeIcon: RiMegaphoneFill, roles: ["all"] },
  { label: "Reports", href: "/reports", icon: RiBarChartBoxLine, activeIcon: RiBarChartBoxFill, roles: ["super_admin", "hr_admin"] },
  { label: "Admin Panel", href: "/admin", icon: RiShieldLine, activeIcon: RiShieldLine, roles: ["super_admin", "hr_admin"] },
];

export default function Sidebar({ collapsed, onToggle, isMobileOpen, onMobileClose }) {
  const pathname = usePathname();
  const { user, role, clearAuth } = useAuthStore();

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes("all") || item.roles.includes(role)
  );

  const handleLogout = async () => {
    clearAuth();
    window.location.href = "/login";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b border-border flex-shrink-0",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="full-logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="leading-none">
                <p className="font-bold text-sm text-text">AIUB HRMS</p>
                <p className="text-[10px] text-text-muted mt-0.5">HR Management</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="icon-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm">A</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle button — desktop only */}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md hover:bg-base-200 text-text-muted hover:text-text transition-colors"
        >
          {collapsed ? <RiMenuUnfoldLine size={16} /> : <RiMenuFoldLine size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = isActive ? item.activeIcon : item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative",
                collapsed ? "justify-center" : "",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-muted hover:bg-base-200 hover:text-text"
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip on collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-neutral text-neutral-content text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile bottom */}
      <div className={cn("p-3 border-t border-border flex-shrink-0", collapsed ? "flex justify-center" : "")}>
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <span className="text-primary font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text truncate">{user?.name}</p>
              <p className="text-xs text-text-muted truncate capitalize">{role?.replace("_", " ")}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md hover:bg-danger/10 hover:text-danger text-text-muted transition-colors"
              title="Logout"
            >
              <RiLogoutBoxLine size={17} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-danger/10 hover:text-danger text-text-muted transition-colors"
            title="Logout"
          >
            <RiLogoutBoxLine size={18} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex flex-col fixed left-0 top-0 h-full bg-surface border-r border-border z-30 overflow-hidden"
        style={{ willChange: "width" }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-border z-50 flex flex-col lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
