// Format currency as BDT
export function formatBDT(amount) {
  if (!amount && amount !== 0) return "৳ 0.00";
  return "৳ " + Number(amount).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Format date
export function formatDate(date, options = {}) {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  });
}

// Download blob as file
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Status badge class
export function statusClass(status) {
  const map = {
    active: "badge-active",
    inactive: "badge-inactive",
    on_leave: "badge-on_leave",
    terminated: "badge-terminated",
    pending: "badge-pending",
    approved: "badge-approved",
    rejected: "badge-rejected",
    draft: "badge-draft",
    processing: "badge-processing",
    paid: "badge-paid",
    cancelled: "badge-cancelled",
    full_time: "badge-active",
    part_time: "badge-processing",
    contractual: "badge-on_leave",
    intern: "badge-inactive",
  };
  return map[status] ?? "badge-inactive";
}

// Initials from name
export function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}
