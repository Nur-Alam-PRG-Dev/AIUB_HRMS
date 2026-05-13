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
    <div className="min-h-screen relative flex items-center justify-center p-4 py-12 overflow-hidden bg-slate-50">
      {/* Abstract Animated Background */}
      <div className="absolute w-full max-w-lg">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[460px]"
      >
        <div className="glass rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl border border-white/40 bg-white/60">
          <div className="p-10">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br from-[#0a2540] to-[#1e3a5f] shadow-lg">
                <span className="material-symbols-outlined text-white text-3xl">school</span>
              </div>
              <h1 className="font-extrabold text-3xl text-[#0a2540] tracking-tight">Join AIUB HRMS</h1>
              <p className="text-[#64748b] text-sm mt-1 font-medium">Create your employee account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold mb-1.5 tracking-wide text-[#64748b]">FULL NAME</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">person</span>
                    <input
                      {...register("name", { required: "Name is required" })}
                      type="text"
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl outline-none text-sm bg-white/70 border border-gray-200 focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10 transition-all font-medium text-gray-800"
                    />
                  </div>
                  {errors.name && <p className="text-xs mt-1 text-red-500 font-medium">{errors.name.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold mb-1.5 tracking-wide text-[#64748b]">EMAIL ADDRESS</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">mail</span>
                    <input
                      {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/, message: "Invalid email" } })}
                      type="email"
                      placeholder="your@aiub.edu"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl outline-none text-sm bg-white/70 border border-gray-200 focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10 transition-all font-medium text-gray-800"
                    />
                  </div>
                  {errors.email && <p className="text-xs mt-1 text-red-500 font-medium">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 tracking-wide text-[#64748b]">PASSWORD</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">lock</span>
                    <input
                      {...register("password", { required: "Password required", minLength: { value: 8, message: "Min 8 chars" } })}
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl outline-none text-sm bg-white/70 border border-gray-200 focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10 transition-all font-medium text-gray-800"
                    />
                  </div>
                  {errors.password && <p className="text-xs mt-1 text-red-500 font-medium">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 tracking-wide text-[#64748b]">CONFIRM</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">lock_clock</span>
                    <input
                      {...register("password_confirmation", { 
                        required: "Confirm password",
                        validate: value => value === password || "Passwords mismatch"
                      })}
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl outline-none text-sm bg-white/70 border border-gray-200 focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10 transition-all font-medium text-gray-800"
                    />
                  </div>
                  {errors.password_confirmation && <p className="text-xs mt-1 text-red-500 font-medium">{errors.password_confirmation.message}</p>}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 10px 20px -10px rgba(79, 70, 229, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-[#0a2540] to-[#1e3a5f] shadow-lg disabled:opacity-70 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Registering...
                  </>
                ) : "Create Account"}
              </motion.button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-semibold text-gray-400 uppercase">Or continue with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.9)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-3 bg-white/70 border border-gray-200 text-gray-700 shadow-sm transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </motion.button>

            <p className="text-center text-sm mt-8 font-medium text-[#64748b]">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#4f46e5] hover:text-[#3730a3]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
