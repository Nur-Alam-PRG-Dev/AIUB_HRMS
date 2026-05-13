"use client";

import { useState, useEffect } from "react";
import { departmentApi } from "@/lib/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await departmentApi.list();
      setDepartments(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Departments</h1>
          <p className="text-slate-500 font-medium mt-1">
            Academic and administrative departments
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-blue-500 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Department
        </motion.button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="glass rounded-3xl p-6 h-48 animate-pulse bg-white/50" />
          ))
        ) : departments.length === 0 ? (
          <div className="col-span-full text-center py-16 glass rounded-3xl">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-slate-400 text-3xl">domain_disabled</span>
            </div>
            <p className="text-slate-500 font-medium">No departments found.</p>
          </div>
        ) : (
          departments.map((dept, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              key={dept.id}
              className="glass rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 group relative overflow-hidden bg-white/60"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl bg-gradient-to-br from-indigo-50 to-sky-50 border border-indigo-100 text-indigo-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {dept.code}
                </div>
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-flex items-center gap-1.5 ${dept.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {dept.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="relative z-10">
                <h3 className="font-extrabold text-xl mb-1 text-slate-800">{dept.name}</h3>
                <p className="text-sm line-clamp-2 mb-6 text-slate-500 font-medium h-10">
                  {dept.description || "No description provided."}
                </p>
              </div>

              <div className="flex items-center justify-between pt-5 mt-auto relative z-10 border-t border-slate-200/60">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">group</span>
                  <span className="text-sm font-bold text-slate-700">{dept.employees_count || 0}</span>
                  <span className="text-sm font-medium text-slate-500">Employees</span>
                </div>
                <button className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
