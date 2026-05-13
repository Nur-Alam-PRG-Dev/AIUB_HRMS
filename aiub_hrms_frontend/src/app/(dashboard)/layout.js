"use client";
import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { useAuth } from "@/hooks/useAuth";
import { StatCardSkeleton } from "@/components/ui/Skeleton";

export default function DashboardLayout({ children }) {
  const { isLoading } = useAuth({ required: true });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Skeleton sidebar */}
        <div className="hidden lg:block w-64 bg-surface border-r border-border flex-shrink-0" />
        <div className="flex-1 p-8 pt-24 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <Topbar
        onMobileMenuOpen={() => setMobileOpen(true)}
        sidebarCollapsed={collapsed}
      />

      {/* Main content */}
      <main
        className="min-h-screen pt-16 transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ paddingLeft: collapsed ? "72px" : "260px" }}
      >
        {/* On mobile: no left padding from sidebar */}
        <div className="lg:hidden" style={{ paddingLeft: 0 }} />
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
