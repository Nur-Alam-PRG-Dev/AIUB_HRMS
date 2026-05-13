"use client";

import { useEffect, useState } from "react";
import { dashboardApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { formatBDT } from "@/lib/utils/format";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await dashboardApi.getStats();
      setStats(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Total Employees", value: stats?.total_employees || 0, icon: "groups", color: "from-blue-500 to-indigo-600", bg: "bg-blue-50" },
    { title: "Active Departments", value: stats?.active_departments || 0, icon: "domain", color: "from-emerald-400 to-teal-500", bg: "bg-teal-50" },
    { title: "On Leave Today", value: stats?.on_leave_today || 0, icon: "event_busy", color: "from-amber-400 to-orange-500", bg: "bg-orange-50" },
    { title: "Monthly Payroll", value: formatBDT(stats?.monthly_payroll || 0), icon: "payments", color: "from-purple-500 to-pink-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Overview</h1>
          <p className="text-slate-500 font-medium mt-1">
            Welcome back, {user?.name?.split(" ")[0]}! Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl font-bold text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Report
          </button>
          <button className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Action
          </button>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
            key={idx}
            className="glass rounded-3xl p-6 relative overflow-hidden group interactive cursor-pointer"
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 bg-gradient-to-br ${card.color} blur-2xl group-hover:scale-150 transition-transform duration-700`} />
            
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${card.bg}`}>
              <span className={`material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br ${card.color}`}>
                {card.icon}
              </span>
            </div>
            <h3 className="text-slate-500 font-bold text-sm tracking-wide uppercase mb-1">{card.title}</h3>
            <div className="flex items-baseline gap-2">
              {loading ? (
                <div className="h-8 w-24 bg-slate-200 animate-pulse rounded-lg" />
              ) : (
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  {card.value}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activities and Quick Actions (Bento Box continuation) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-2 glass rounded-3xl p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Recent Activities</h2>
            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800">View All</button>
          </div>
          
          <div className="space-y-6">
            {loading ? (
              [1,2,3].map(i => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-slate-200 animate-pulse rounded" />
                    <div className="h-3 w-1/4 bg-slate-100 animate-pulse rounded" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-500 font-medium bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
                No recent activities found.
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="glass rounded-3xl p-8 bg-gradient-to-b from-white/60 to-indigo-50/30"
        >
          <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { icon: 'person_add', label: 'Add New Employee' },
              { icon: 'request_quote', label: 'Generate Payroll' },
              { icon: 'campaign', label: 'Post Announcement' },
            ].map((action, i) => (
              <button key={i} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all group text-left">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                  <span className="material-symbols-outlined text-slate-500 group-hover:text-indigo-600">
                    {action.icon}
                  </span>
                </div>
                <span className="font-bold text-sm text-slate-700 group-hover:text-indigo-700">{action.label}</span>
                <span className="material-symbols-outlined ml-auto text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all">
                  arrow_forward
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
