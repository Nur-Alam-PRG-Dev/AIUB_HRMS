"use client";

import { useState, useEffect } from "react";
import { employeeApi, departmentApi } from "@/lib/api";
import { statusClass } from "@/lib/utils/format";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [filterDept, setFilterDept] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, [filterDept]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, deptRes] = await Promise.all([
        employeeApi.list(filterDept ? { department_id: filterDept } : {}),
        departmentApi.list(),
      ]);
      setEmployees(empRes.data.data.data || []);
      setDepartments(deptRes.data.data || []);
    } catch (error) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    (emp.first_name + " " + emp.last_name).toLowerCase().includes(search.toLowerCase()) ||
    emp.employee_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Directory</h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage university staff and faculty members
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input
              type="text"
              placeholder="Search directory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 pr-4 py-3 rounded-xl text-sm font-medium outline-none bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm w-64"
            />
          </div>
          <select
            className="px-4 py-3 rounded-xl text-sm font-medium outline-none bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm cursor-pointer"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <Link href="/employees/new">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-full px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-blue-500 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              Add New
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-200/60"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/60">
                <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-wider text-xs">Employee</th>
                <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-wider text-xs">ID</th>
                <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-wider text-xs">Department & Role</th>
                <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-wider text-xs">Status</th>
                <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white/40">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-slate-400 text-3xl">person_off</span>
                    </div>
                    <p className="text-slate-500 font-medium">No employees found.</p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="group hover:bg-white/80 transition-all duration-300"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-sky-100 border border-white shadow-sm flex items-center justify-center font-bold text-indigo-600">
                          {emp.photo ? (
                            <img src={emp.photo} className="w-full h-full rounded-full object-cover" alt="" />
                          ) : (
                            emp.first_name[0] + emp.last_name[0]
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{emp.first_name} {emp.last_name}</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">{emp.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-md text-xs">{emp.employee_id}</span>
                    </td>
                    <td className="px-8 py-4">
                      <p className="font-bold text-slate-700">{emp.department?.name || '—'}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">{emp.designation?.title || '—'}</p>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-flex items-center gap-1.5 ${statusClass(emp.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {emp.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <Link href={`/employees/${emp.id}`}>
                        <button className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center justify-center shadow-sm ml-auto">
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
