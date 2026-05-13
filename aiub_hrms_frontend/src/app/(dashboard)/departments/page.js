"use client";

import { useState, useEffect } from "react";
import { departmentApi } from "@/lib/api";
import toast from "react-hot-toast";

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
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>Departments</h1>
          <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
            Academic and administrative departments
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-all"
          style={{ background: "var(--color-primary)", color: "white" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
          New Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : departments.length === 0 ? (
          <p className="text-gray-500">No departments found.</p>
        ) : (
          departments.map((dept) => (
            <div
              key={dept.id}
              className="rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{
                background: "var(--color-surface-container-lowest)",
                border: "1px solid var(--color-outline-variant)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg"
                  style={{ background: "var(--color-primary-fixed)", color: "var(--color-primary)" }}
                >
                  {dept.code}
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${dept.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {dept.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1" style={{ color: "var(--color-on-surface)" }}>{dept.name}</h3>
              <p className="text-sm line-clamp-2 mb-4" style={{ color: "var(--color-on-surface-variant)" }}>
                {dept.description || "No description provided."}
              </p>
              <div className="flex items-center justify-between pt-4 mt-auto" style={{ borderTop: "1px solid var(--color-outline-variant)" }}>
                <div className="text-sm">
                  <span className="font-semibold">{dept.employees_count || 0}</span> <span className="text-gray-500">Employees</span>
                </div>
                <button className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
                  Manage
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
