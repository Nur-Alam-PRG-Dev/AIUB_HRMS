"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authApi.register(data);
      toast.success("Registration successful! Check your email for OTP.");
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await authApi.googleRedirect();
      window.location.href = res.data.data.url;
    } catch {
      toast.error("Google login unavailable");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 py-12"
      style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 60%, var(--color-surface) 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 24px 48px rgba(0,30,64,0.25)" }}
        >
          {/* Header */}
          <div
            className="px-8 py-7 text-center"
            style={{ background: "var(--color-primary)" }}
          >
            <div
              className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: "var(--color-secondary-container)" }}
            >
              <span className="material-symbols-outlined" style={{ color: "var(--color-primary)", fontSize: "28px" }}>
                school
              </span>
            </div>
            <h1 className="font-extrabold text-white text-2xl">Join AIUB HRMS</h1>
            <p className="text-white/70 text-sm mt-1">Create your employee account</p>
          </div>

          {/* Form */}
          <div className="p-8" style={{ background: "var(--color-surface-container-lowest)" }}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 tracking-wider" style={{ color: "var(--color-on-surface-variant)" }}>
                  FULL NAME
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm"
                  style={{
                    background: "var(--color-surface-container-low)",
                    border: errors.name ? "2px solid var(--color-error)" : "1px solid var(--color-outline-variant)",
                    color: "var(--color-on-surface)",
                  }}
                />
                {errors.name && (
                  <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 tracking-wider" style={{ color: "var(--color-on-surface-variant)" }}>
                  EMAIL ADDRESS
                </label>
                <input
                  {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/, message: "Invalid email" } })}
                  type="email"
                  placeholder="your@aiub.edu"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all text-sm"
                  style={{
                    background: "var(--color-surface-container-low)",
                    border: errors.email ? "2px solid var(--color-error)" : "1px solid var(--color-outline-variant)",
                    color: "var(--color-on-surface)",
                  }}
                />
                {errors.email && (
                  <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 tracking-wider" style={{ color: "var(--color-on-surface-variant)" }}>
                  PASSWORD
                </label>
                <input
                  {...register("password", { required: "Password is required", minLength: { value: 8, message: "Minimum 8 characters" } })}
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                  style={{
                    background: "var(--color-surface-container-low)",
                    border: errors.password ? "2px solid var(--color-error)" : "1px solid var(--color-outline-variant)",
                    color: "var(--color-on-surface)",
                  }}
                />
                {errors.password && (
                  <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 tracking-wider" style={{ color: "var(--color-on-surface-variant)" }}>
                  CONFIRM PASSWORD
                </label>
                <input
                  {...register("password_confirmation", { 
                    required: "Confirm your password",
                    validate: value => value === password || "Passwords do not match"
                  })}
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                  style={{
                    background: "var(--color-surface-container-low)",
                    border: errors.password_confirmation ? "2px solid var(--color-error)" : "1px solid var(--color-outline-variant)",
                    color: "var(--color-on-surface)",
                  }}
                />
                {errors.password_confirmation && (
                  <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>{errors.password_confirmation.message}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all mt-4"
                style={{ background: loading ? "var(--color-primary-container)" : "var(--color-primary)" }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Registering...
                  </>
                ) : "Create Account"}
              </motion.button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: "var(--color-outline-variant)" }} />
              <span className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>OR</span>
              <div className="flex-1 h-px" style={{ background: "var(--color-outline-variant)" }} />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                border: "1px solid var(--color-outline-variant)",
                color: "var(--color-on-surface)",
                background: "var(--color-surface-container-low)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </motion.button>

            <p className="text-center text-sm mt-5" style={{ color: "var(--color-on-surface-variant)" }}>
              Already have an account?{" "}
              <Link href="/login" className="font-bold" style={{ color: "var(--color-primary)" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
