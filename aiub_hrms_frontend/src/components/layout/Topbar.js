"use client";

import { useAuthStore } from "@/store/authStore";
import { getInitials } from "@/lib/utils/format";
import { useState } from "react";
import Link from "next/link";

export default function Topbar({ title }) {
  const { user, role } = useAuthStore();
  const [search, setSearch] = useState("");

  return (
    <header
      className="sticky top-0 z-40 flex justify-between items-center h-16 px-10"
      style={{
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-outline-variant)",
        boxShadow: "0 1px 4px rgba(0,30,64,0.06)",
      }}
    >
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        {title ? (
          <h2 className="font-bold text-[var(--color-primary)] text-lg">{title}</h2>
        ) : (
          <div className="relative w-full max-w-md">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-on-surface-variant)", fontSize: "18px" }}
            >
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee, ID, department..."
              className="w-full pl-10 pr-4 py-2 rounded-full text-sm outline-none focus:ring-2"
              style={{
                background: "var(--color-surface-container-low)",
                border: "none",
                color: "var(--color-on-surface)",
                focusRingColor: "var(--color-primary-container)",
              }}
            />
          </div>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full hover:bg-[var(--color-surface-container-high)] transition-colors"
            title="Notifications"
          >
            <span className="material-symbols-outlined" style={{ color: "var(--color-on-surface-variant)", fontSize: "22px" }}>
              notifications
            </span>
          </button>
          <Link href="/profile">
            <button
              className="p-2 rounded-full hover:bg-[var(--color-surface-container-high)] transition-colors"
              title="Profile"
            >
              <span className="material-symbols-outlined" style={{ color: "var(--color-on-surface-variant)", fontSize: "22px" }}>
                account_circle
              </span>
            </button>
          </Link>
        </div>

        <div
          className="flex items-center gap-3 pl-6"
          style={{ borderLeft: "1px solid var(--color-outline-variant)" }}
        >
          <div className="text-right">
            <p className="font-semibold text-sm" style={{ color: "var(--color-on-surface)" }}>
              {user?.name}
            </p>
            <p className="text-xs capitalize" style={{ color: "var(--color-on-surface-variant)" }}>
              {role?.replace("_", " ")}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{
              background: "var(--color-primary-fixed)",
              color: "var(--color-primary)",
              border: "2px solid var(--color-primary-fixed-dim)",
            }}
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              getInitials(user?.name ?? "U")
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
