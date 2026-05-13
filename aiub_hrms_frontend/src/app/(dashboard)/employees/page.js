"use client";

import { useState, useEffect } from "react";
import { employeeApi, departmentApi, designationApi } from "@/lib/api";
import { formatBDT, statusClass } from "@/lib/utils/format";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [filterDept, setFilterDept] = useState("");

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>Employees</h1>
          <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
            Manage university staff and faculty members
          </p>
        </div>
        <div className="flex gap-4">
          <select
            className="px-4 py-2 rounded-lg text-sm border outline-none"
            style={{ borderColor: "var(--color-outline-variant)", background: "var(--color-surface-container-lowest)" }}
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <Link href="/employees/new">
            <button
              className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-all"
              style={{ background: "var(--color-primary)", color: "white" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
              Add Employee
            </button>
          </Link>
        </div>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "var(--color-surface-container-lowest)",
          border: "1px solid var(--color-outline-variant)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr style={{ background: "var(--color-surface-container-low)" }}>
                <th className="px-6 py-4 font-bold" style={{ color: "var(--color-on-surface-variant)" }}>Employee</th>
                <th className="px-6 py-4 font-bold" style={{ color: "var(--color-on-surface-variant)" }}>ID</th>
                <th className="px-6 py-4 font-bold" style={{ color: "var(--color-on-surface-variant)" }}>Department</th>
                <th className="px-6 py-4 font-bold" style={{ color: "var(--color-on-surface-variant)" }}>Designation</th>
                <th className="px-6 py-4 font-bold" style={{ color: "var(--color-on-surface-variant)" }}>Status</th>
                <th className="px-6 py-4 font-bold text-right" style={{ color: "var(--color-on-surface-variant)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">Loading employees...</td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">No employees found.</td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-[var(--color-surface-container-low)] transition-colors"
                    style={{ borderBottom: "1px solid var(--color-outline-variant)" }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs"
                             style={{ color: "var(--color-primary)" }}>
                          {emp.photo ? (
                            <img src={emp.photo} className="w-full h-full rounded-full object-cover" alt="" />
                          ) : (
                            emp.first_name[0] + emp.last_name[0]
                          )}
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: "var(--color-on-surface)" }}>{emp.first_name} {emp.last_name}</p>
                          <p className="text-xs text-gray-500">{emp.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">{emp.employee_id}</td>
                    <td className="px-6 py-4 text-gray-600">{emp.department?.name || '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{emp.designation?.title || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${statusClass(emp.status)}`}>
                        {emp.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/employees/${emp.id}`}>
                        <button className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
