"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiGoogleFill } from "react-icons/ri";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { fadeInUp, staggerContainer } from "@/lib/utils/motion";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      const { user, token } = res.data.data;
      useAuthStore.getState().setAuth(user, token);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);

      const params = new URLSearchParams(window.location.search);
      window.location.href = params.get("callbackUrl") || "/dashboard";
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google/redirect`;
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} className="space-y-1">
        <h2 className="text-2xl font-bold text-text tracking-tight">Sign in</h2>
        <p className="text-sm text-text-muted">Enter your credentials to access HRMS</p>
      </motion.div>

      {/* Google button */}
      <motion.button
        variants={fadeInUp}
        onClick={handleGoogleLogin}
        type="button"
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 text-sm font-semibold text-text group"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <RiGoogleFill className="text-[#4285F4] group-hover:scale-110 transition-transform" size={18} />
        Continue with Google
      </motion.button>

      {/* Divider */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-muted font-medium px-2">or sign in with email</span>
        <div className="flex-1 h-px bg-border" />
      </motion.div>

      {/* Form */}
      <motion.form variants={staggerContainer} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <motion.div variants={fadeInUp}>
          <label className="block text-sm font-medium text-text mb-1.5">Email address</label>
          <div className="relative">
            <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={17} />
            <input
              type="email"
              placeholder="you@aiub.edu"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
              })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium bg-surface transition-all duration-150 outline-none
                ${errors.email
                  ? "border-danger focus:ring-2 focus:ring-danger/20"
                  : "border-border focus:border-primary focus:ring-2 focus:ring-primary/15"
                }`}
            />
          </div>
          {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>}
        </motion.div>

        {/* Password */}
        <motion.div variants={fadeInUp}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-text">Password</label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={17} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
              className={`w-full pl-10 pr-12 py-3 rounded-xl border text-sm font-medium bg-surface transition-all duration-150 outline-none
                ${errors.password
                  ? "border-danger focus:ring-2 focus:ring-danger/20"
                  : "border-border focus:border-primary focus:ring-2 focus:ring-primary/15"
                }`}
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors">
              {showPassword ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-danger">{errors.password.message}</p>}
        </motion.div>

        {/* Submit */}
        <motion.button
          variants={fadeInUp}
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.99 }}
          className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </>
          ) : "Sign in"}
        </motion.button>
      </motion.form>

      <motion.p variants={fadeInUp} className="text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary font-semibold hover:underline">
          Request access
        </Link>
      </motion.p>
    </motion.div>
  );
}
