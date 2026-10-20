"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const benefits = [
  "AI-powered claims extraction",
  "Explainable risk scoring",
  "Human-in-the-loop governance",
  "Complete audit trail",
];

const roles = [
  { value: "adjuster", label: "Claims Adjuster" },
  { value: "underwriter", label: "Underwriter" },
  { value: "manager", label: "Operations Manager" },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", role: "adjuster" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof typeof form, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register({
        email: form.email,
        full_name: `${form.first_name} ${form.last_name}`.trim(),
        password: form.password,
        role: form.role,
      });
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white" size={18} />
          </div>
          <h1 className="text-xl font-bold">Create an account</h1>
          <p className="text-sm text-zinc-500 mt-1">Operations workspace access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">{error}</div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-zinc-700 mb-1.5">First Name</label>
              <input id="first_name" type="text" required autoComplete="given-name" value={form.first_name} onChange={(e) => update("first_name", e.target.value)} placeholder="John" className="input-field" />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-zinc-700 mb-1.5">Last Name</label>
              <input id="last_name" type="text" autoComplete="family-name" value={form.last_name} onChange={(e) => update("last_name", e.target.value)} placeholder="Doe" className="input-field" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1.5">Email</label>
            <input id="email" type="email" required autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" className="input-field" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="At least 8 characters"
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-zinc-700 mb-1.5">Role</label>
            <select id="role" value={form.role} onChange={(e) => update("role", e.target.value)} className="input-field">
              {roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? "Creating account..." : "Create Account"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-zinc-900 font-medium hover:underline">Sign in</a>
        </p>

        <div className="mt-8 pt-6 border-t border-zinc-100">
          <p className="text-xs text-zinc-400 font-medium mb-3">What you get:</p>
          <div className="space-y-2">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-2 text-sm text-zinc-500">
                <Check size={14} className="text-zinc-400" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
