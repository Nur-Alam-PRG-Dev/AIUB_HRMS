"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { RiMenuLine, RiNotification3Line, RiSearchLine, RiSettings3Line } from "react-icons/ri";
import { useAuthStore } from "@/store/authStore";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/employees": "Employees",
  "/departments": "Departments",
  "/designations": "Designations",
  "/salary": "Salary Management",
  "/payroll": "Payroll",
  "/leave": "Leave Management",
  "/attendance": "Attendance",
  "/announcements": "Announcements",
  "/reports": "Reports",
  "/admin": "Admin Panel",
  "/profile": "My Profile",
};

export default function Topbar({ onMobileMenuOpen, sidebarCollapsed }) {
  const pathname = usePathname();
  const { user, role, clearAuth } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);

  const pageTitle = Object.entries(PAGE_TITLES).find(([path]) =>
    pathname === path || pathname.startsWith(path + "/")
  )?.[1] ?? "AIUB HRMS";

  return (
    <header
      className="fixed top-0 right-0 z-20 bg-surface/80 backdrop-blur-md border-b border-border"
      style={{
        left: 0,
        paddingLeft: sidebarCollapsed ? "72px" : "260px",
        transition: "padding-left 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMobileMenuOpen}
            className="lg:hidden p-2 rounded-lg hover:bg-base-200 text-text-muted transition-colors"
          >
            <RiMenuLine size={20} />
          </button>
          <div>
            <h2 className="text-base font-semibold text-text leading-none">{pageTitle}</h2>
            <p className="text-xs text-text-muted mt-0.5">
              {new Date().toLocaleDateString("en-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-base-200 hover:bg-base-300 text-text-muted hover:text-text text-sm transition-colors"
          >
            <RiSearchLine size={16} />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-surface rounded border border-border font-mono">⌘K</kbd>
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-base-200 text-text-muted hover:text-text transition-colors">
            <RiNotification3Line size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-surface" />
          </button>

          {/* Avatar dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-base-200 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <span className="text-primary font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block text-left leading-none">
                  <p className="text-sm font-semibold text-text">{user?.name?.split(" ")[0]}</p>
                  <p className="text-[11px] text-text-muted capitalize mt-0.5">{role?.replace("_", " ")}</p>
                </div>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="min-w-[200px] bg-surface rounded-xl shadow-xl border border-border p-1.5 z-50 animate-fade-in"
              >
                <div className="px-3 py-2 mb-1 border-b border-border">
                  <p className="text-sm font-semibold text-text">{user?.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">{user?.email}</p>
                </div>
                <DropdownMenu.Item asChild>
                  <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text hover:bg-base-200 cursor-pointer transition-colors outline-none">
                    <RiSettings3Line size={16} /> My Profile
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-border" />
                <DropdownMenu.Item
                  onSelect={() => { clearAuth(); window.location.href = "/login"; }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-danger hover:bg-danger/10 cursor-pointer transition-colors outline-none"
                >
                  Sign out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}
