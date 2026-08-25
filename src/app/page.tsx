"use client";

import { Shield, Zap, Brain, Users, ArrowRight, CheckCircle2, Clock, AlertTriangle, TrendingUp, Eye, Lock, BarChart3 } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Extraction",
    description: "Automatically extract structured data from unstructured claim descriptions using GPT-4o-mini.",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    icon: Zap,
    title: "Instant Risk Scoring",
    description: "Rule-based risk assessment with explainable signals, classifying claims in real-time.",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: Users,
    title: "Human-in-the-Loop",
    description: "High-risk decisions require human approval, ensuring AI safety and governance.",
    color: "from-blue-500 to-cyan-600",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Lock,
    title: "Audit Trail",
    description: "Complete logging of all actions for compliance, governance, and transparency.",
    color: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

const steps = [
  { num: "01", title: "Submit", description: "Customer submits claim", icon: Clock },
  { num: "02", title: "Extract", description: "AI extracts information", icon: Brain },
  { num: "03", title: "Score", description: "Risk analysis performed", icon: BarChart3 },
  { num: "04", title: "Review", description: "Human reviews if needed", icon: Eye },
  { num: "05", title: "Decide", description: "Final decision made", icon: CheckCircle2 },
];

export default function Home() {
  return (
    <div className="space-y-8 pb-12">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden rounded-3xl gradient-hero noise">
        {/* Animated blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
        </div>

        <div className="relative z-10 p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
              <span className="text-sm text-white/90 font-medium">AI-Powered Operations Platform</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
              Automate Insurance Claims with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-200 to-purple-200">
                Intelligence
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-white/75 mb-10 max-w-xl leading-relaxed text-balance">
              An AI-powered platform that automates claims intake, triage, and risk analysis
              while keeping humans in the loop for critical decisions.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <a href="/submit" className="group inline-flex items-center gap-2.5 bg-white text-blue-700 px-7 py-4 rounded-2xl font-bold shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                Submit a Claim
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/dashboard" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/25 px-7 py-4 rounded-2xl font-bold hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                View Dashboard
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="relative z-10 mt-14 grid grid-cols-3 gap-6 max-w-md">
            {[
              { value: 68, suffix: "%", label: "Time Saved", color: "text-green-300" },
              { value: 40, suffix: "%", label: "Automated", color: "text-blue-300" },
              { value: 5, suffix: "", label: "Sample Claims", color: "text-purple-300" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={`text-3xl lg:text-4xl font-black ${stat.color}`}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-white/50 mt-1 font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
            <Zap size={14} /> Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Powerful AI Features</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Built with modern AI and engineering best practices to demonstrate real operational value.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
          {features.map((f) => (
            <div key={f.title} className="card card-hover p-6 group cursor-default">
              <div className={`w-12 h-12 ${f.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className={f.iconColor} size={22} />
              </div>
              <h3 className="font-bold text-[15px] mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="card p-8 sm:p-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
            <ArrowRight size={14} /> Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">How It Works</h2>
          <p className="text-gray-500 mt-3">From submission to decision in 5 steps</p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-2 stagger-children">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center gap-4 flex-1 w-full md:w-auto">
              <div className="flex flex-col items-center text-center flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] mb-3 group-hover:scale-110 transition-transform">
                  <step.icon size={24} />
                </div>
                <p className="font-bold text-sm">{step.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block flex-1 h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 mt-[-24px]" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== METRICS PREVIEW ===== */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {[
          { title: "Processing Time", before: "25 min", after: "8 min", saved: "68%", icon: Clock, color: "from-blue-500 to-cyan-500" },
          { title: "Automation Rate", value: "40%", sub: "of claims auto-processed", icon: Zap, color: "from-green-500 to-emerald-500" },
          { title: "Risk Detection", value: "3", sub: "risk levels (Low/Med/High)", icon: Shield, color: "from-purple-500 to-pink-500" },
        ].map((m) => (
          <div key={m.title} className="card card-hover p-6">
            <div className={`w-10 h-10 bg-gradient-to-br ${m.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
              <m.icon className="text-white" size={18} />
            </div>
            <h3 className="font-bold text-sm text-gray-500 mb-1">{m.title}</h3>
            {m.before ? (
              <div className="flex items-baseline gap-2">
                <span className="text-lg text-gray-400 line-through">{m.before}</span>
                <ArrowRight size={14} className="text-gray-300" />
                <span className="text-3xl font-black text-gray-900">{m.after}</span>
              </div>
            ) : (
              <p className="text-3xl font-black">{m.value}</p>
            )}
            <p className="text-sm text-gray-400 mt-1">{m.sub || `Saved ${m.saved}`}</p>
          </div>
        ))}
      </section>

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden rounded-3xl gradient-brand noise p-10 sm:p-14 text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-300/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to Transform Your Operations?</h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">
            See how AI can reduce processing time by 68% and automate 40% of claims.
          </p>
          <a href="/submit" className="group inline-flex items-center gap-2.5 bg-white text-blue-700 px-8 py-4 rounded-2xl font-bold shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
            Get Started
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>
    </div>
  );
}