"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { dashboardApi, announcementApi } from "@/lib/api";
import { formatBDT, formatDate } from "@/lib/utils/format";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import toast from "react-hot-toast";

const COLORS = ["#001e40", "#fdc74b", "#50a0ed", "#ba1a1a"];

function StatCard({ label, value, icon, accent, trend, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="rounded-xl p-6 hover:shadow-lg transition-shadow"
      style={{
        background: "var(--color-surface-container-lowest)",
        border: "1px solid var(--color-outline-variant)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className="p-2 rounded-full"
          style={{ background: accent + "22" }}
        >
          <span className="material-symbols-outlined" style={{ color: accent, fontSize: "22px" }}>{icon}</span>
        </div>
        {trend && (
          <span className="text-xs font-bold" style={{ color: "var(--color-secondary)" }}>{trend}</span>
        )}
      </div>
      <p className="text-xs font-bold tracking-widest mb-1" style={{ color: "var(--color-on-surface-variant)" }}>
        {label}
      </p>
      <h3 className="font-extrabold" style={{ fontSize: "28px", color: "var(--color-on-surface)", lineHeight: 1 }}>
        {value}
      </h3>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.stats(),
      dashboardApi.recentActivities(),
      announcementApi.list(),
    ])
      .then(([s, a, ann]) => {
        setStats(s.data.data);
        setActivities(a.data.data);
        setAnnouncements(ann.data.data?.slice(0, 3) ?? []);
      })
      .catch(() => toast.error("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  // Dummy chart data for illustration
  const payrollChartData = [
    { month: "Dec", net: 3200000 },
    { month: "Jan", net: 3450000 },
    { month: "Feb", net: 3100000 },
    { month: "Mar", net: 3600000 },
    { month: "Apr", net: 3800000 },
    { month: "May", net: 4200000 },
  ];

  const leaveDistribution = [
    { name: "Sick", value: 45 },
    { name: "Casual", value: 30 },
    { name: "Annual", value: 15 },
    { name: "Others", value: 10 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-10 h-10 rounded-full border-4 animate-spin"
          style={{ borderColor: "var(--color-primary-fixed)", borderTopColor: "var(--color-primary)" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl p-8 text-white flex justify-between items-center"
        style={{ background: "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))" }}
      >
        <div className="relative z-10">
          <h2 className="font-extrabold mb-2" style={{ fontSize: "28px", letterSpacing: "-0.02em" }}>
            Welcome back 👋
          </h2>
          <p className="text-white/80 max-w-lg" style={{ fontSize: "15px" }}>
            {stats?.pending_leaves
              ? `You have ${stats.pending_leaves} pending leave requests awaiting review.`
              : "Everything is up to date. Have a productive day!"}
          </p>
          <div className="flex gap-3 mt-6">
            <a href="/employees/new">
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                style={{ background: "var(--color-secondary-container)", color: "var(--color-on-secondary-fixed-variant)" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>person_add</span>
                Add Employee
              </button>
            </a>
            <a href="/payroll/new">
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>account_balance_wallet</span>
                Run Payroll
              </button>
            </a>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute right-0 top-0 h-full opacity-10 pointer-events-none">
          <span className="material-symbols-outlined" style={{ fontSize: "240px", lineHeight: 1 }}>school</span>
        </div>
      </motion.section>

      {/* Stat Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard label="TOTAL EMPLOYEES" value={stats?.total_employees ?? 0} icon="groups" accent="var(--color-primary-fixed-dim)" trend="+2.4%" delay={0.05} />
        <StatCard label="PENDING LEAVES" value={stats?.pending_leaves ?? 0} icon="pending_actions" accent="var(--color-error)" trend="URGENT" delay={0.1} />
        <StatCard label="PRESENT TODAY" value={stats?.present_today ?? 0} icon="how_to_reg" accent="var(--color-on-tertiary-container)" delay={0.15} />
        <StatCard label="NEW JOINERS" value={stats?.new_joiners_this_month ?? 0} icon="person_add_alt" accent="var(--color-secondary)" trend={`This month`} delay={0.2} />
      </section>

      {/* Charts Row */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payroll Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl p-6"
          style={{
            background: "var(--color-surface-container-lowest)",
            border: "1px solid var(--color-outline-variant)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h3 className="font-bold mb-6" style={{ fontSize: "16px", color: "var(--color-primary)" }}>
            Monthly Net Payroll
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={payrollChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
              <XAxis dataKey="month" tick={{ fill: "var(--color-on-surface-variant)", fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `৳${(v / 1000000).toFixed(1)}M`} tick={{ fill: "var(--color-on-surface-variant)", fontSize: 11 }} />
              <Tooltip formatter={(v) => formatBDT(v)} />
              <Bar dataKey="net" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Leave Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-xl p-6"
          style={{
            background: "var(--color-surface-container-lowest)",
            border: "1px solid var(--color-outline-variant)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h3 className="font-bold mb-4" style={{ fontSize: "16px", color: "var(--color-primary)" }}>
            Leave Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={leaveDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {leaveDistribution.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </section>

      {/* Recent Activities */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl overflow-hidden"
        style={{
          background: "var(--color-surface-container-lowest)",
          border: "1px solid var(--color-outline-variant)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          className="px-6 py-4 flex justify-between items-center"
          style={{ borderBottom: "1px solid var(--color-outline-variant)" }}
        >
          <h3 className="font-bold" style={{ fontSize: "16px", color: "var(--color-primary)" }}>
            Recent Activity
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--color-surface-container-low)" }}>
                {["User", "Action", "Time"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-bold tracking-wider" style={{ color: "var(--color-on-surface-variant)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center px-6 py-8" style={{ color: "var(--color-on-surface-variant)" }}>
                    No recent activity
                  </td>
                </tr>
              ) : (
                activities.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-[var(--color-surface-container-low)] transition-colors"
                    style={{ borderBottom: "1px solid var(--color-outline-variant)" }}
                  >
                    <td className="px-6 py-4 font-medium">{log.user?.name ?? "System"}</td>
                    <td className="px-6 py-4" style={{ color: "var(--color-on-surface-variant)" }}>
                      {log.action.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-4" style={{ color: "var(--color-on-surface-variant)" }}>
                      {formatDate(log.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  );
}
