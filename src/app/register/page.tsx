"use client";

import { useState } from "react";
import { Shield, Eye, EyeOff, ArrowRight, Github, Chrome, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

const benefits = [
  "AI-powered claims extraction",
  "Real-time risk scoring",
  "Human-in-the-loop workflows",
  "Complete audit trail",
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "operator" });
  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

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
            Start Automating Today
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            Join operations teams using AI to process claims faster.
          </p>
          <div className="space-y-3">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-green-300 flex-shrink-0" />
                <span className="text-white/80 text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Shield className="text-white" size={18} />
            </div>
            <span className="font-extrabold text-lg">AI Insurance</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black tracking-tight">Create account</h2>
            <p className="text-gray-400 text-sm mt-1">Get started with the platform</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all">
              <Github size={16} /> GitHub
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all">
              <Chrome size={16} /> Google
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-gray-600 mb-2">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="John Doe" className="input-field" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-600 mb-2">Email</label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="john@company.com" className="input-field" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-600 mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Min 8 characters" className="input-field pr-11" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-600 mb-2">Role</label>
              <select value={form.role} onChange={(e) => update("role", e.target.value)} className="input-field">
                <option value="operator">Claims Operator</option>
                <option value="adjuster">Claims Adjuster</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-500 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-500 focus:ring-blue-500/20" />
              <span>I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a></span>
            </label>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              Create Account <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}