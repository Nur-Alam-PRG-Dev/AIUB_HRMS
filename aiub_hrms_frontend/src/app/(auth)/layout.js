import { motion } from "framer-motion";

// Clean split-screen layout for all auth pages
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Left — Decorative panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-primary flex-col justify-between p-12 relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        {/* Floating shapes */}
        <div className="absolute top-20 right-16 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-32 left-8 w-64 h-64 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">AIUB HRMS</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
            Manage your<br />
            <span className="text-white/70">workforce</span><br />
            smarter.
          </h1>
          <p className="mt-6 text-white/60 text-lg leading-relaxed max-w-sm">
            A unified platform for HR, payroll, leave management, and more — built for AIUB.
          </p>
        </div>

        {/* Feature pills */}
        <div className="relative z-10 space-y-3">
          {["Employee Management", "Automated Payroll", "Leave & Attendance", "Role-Based Access"].map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <span className="text-white/80 text-sm font-medium">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-base-100">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
