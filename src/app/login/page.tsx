"use client";

import { useState } from "react";
import { Shield, Eye, EyeOff, ArrowRight, Github, Chrome } from "lucide-react";
import clsx from "clsx";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-hero noise items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>
        <div className="relative z-10 p-12 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">AI Insurance</h1>
              <p className="text-xs text-white/60">Operations Platform</p>
            </div>
          </div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Automate Claims with Intelligence
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            AI-powered claims processing, risk scoring, and human-in-the-loop workflows.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: "68%", label: "Faster" },
              { value: "40%", label: "Automated" },
              { value: "99.9%", label: "Uptime" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Shield className="text-white" size={18} />
            </div>
            <span className="font-extrabold text-lg">AI Insurance</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black tracking-tight">Welcome back</h2>
            <p className="text-gray-400 text-sm mt-1">Sign in to your operations dashboard</p>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all">
              <Github size={16} />
              GitHub
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all">
              <Chrome size={16} />
              Google
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-gray-600 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@insurance.ai"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-600 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500/20" />
                Remember me
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">Create one</a>
          </p>
        </div>
      </div>
    </div>
  );
}