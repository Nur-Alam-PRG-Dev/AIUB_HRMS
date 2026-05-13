import api from "@/lib/axios";

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  verifyEmail: (data) => api.post("/auth/verify-email", data),
  resendOtp: (data) => api.post("/auth/resend-otp", data),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  me: () => api.get("/auth/me"),
  googleRedirect: () => api.get("/auth/google/redirect"),
};

export const employeeApi = {
  list: (params) => api.get("/employees", { params }),
  get: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post("/employees", data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  remove: (id) => api.delete(`/employees/${id}`),
  uploadPhoto: (id, formData) =>
    api.post(`/employees/${id}/photo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export const departmentApi = {
  list: () => api.get("/departments"),
  get: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post("/departments", data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  remove: (id) => api.delete(`/departments/${id}`),
};

export const designationApi = {
  list: (params) => api.get("/designations", { params }),
  create: (data) => api.post("/designations", data),
  update: (id, data) => api.put(`/designations/${id}`, data),
  remove: (id) => api.delete(`/designations/${id}`),
};

export const salaryApi = {
  list: (params) => api.get("/salary-structures", { params }),
  get: (id) => api.get(`/salary-structures/${id}`),
  create: (data) => api.post("/salary-structures", data),
  revisions: (params) => api.get("/salary-revisions", { params }),
  createRevision: (data) => api.post("/salary-revisions", data),
};

export const payrollApi = {
  list: (params) => api.get("/payroll-runs", { params }),
  get: (id) => api.get(`/payroll-runs/${id}`),
  create: (data) => api.post("/payroll-runs", data),
  generate: (id) => api.post(`/payroll-runs/${id}/generate`),
  approve: (id) => api.post(`/payroll-runs/${id}/approve`),
  markPaid: (id) => api.post(`/payroll-runs/${id}/mark-paid`),
  items: (id, params) => api.get(`/payroll-runs/${id}/items`, { params }),
  exportPdf: (id) =>
    api.get(`/payroll-runs/${id}/export-pdf`, { responseType: "blob" }),
  payslipPdf: (itemId) =>
    api.get(`/payroll-items/${itemId}/payslip-pdf`, { responseType: "blob" }),
};

export const leaveApi = {
  types: () => api.get("/leave-types"),
  createType: (data) => api.post("/leave-types", data),
  list: (params) => api.get("/leave-applications", { params }),
  apply: (data) => api.post("/leave-applications", data),
  review: (id, data) => api.put(`/leave-applications/${id}/review`, data),
};

export const attendanceApi = {
  list: (params) => api.get("/attendance", { params }),
  mark: (data) => api.post("/attendance", data),
  summary: (params) => api.get("/attendance/summary", { params }),
};

export const announcementApi = {
  list: () => api.get("/announcements"),
  get: (id) => api.get(`/announcements/${id}`),
  create: (data) => api.post("/announcements", data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  remove: (id) => api.delete(`/announcements/${id}`),
};

export const dashboardApi = {
  stats: () => api.get("/dashboard/stats"),
  recentActivities: () => api.get("/dashboard/recent-activities"),
};

export const adminApi = {
  users: (params) => api.get("/admin/users", { params }),
  updateRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  logs: (params) => api.get("/admin/activity-logs", { params }),
  systemStats: () => api.get("/admin/system-stats"),
};
