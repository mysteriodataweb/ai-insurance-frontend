"use client";

import { Shield, ArrowRight, Brain, Zap, Users, Lock, Clock, Eye, CheckCircle2, BarChart3 } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

const features = [
  {
    icon: Brain,
    title: "AI Extraction",
    description: "Automatically extract structured data from unstructured claim descriptions.",
  },
  {
    icon: Zap,
    title: "Risk Scoring",
    description: "Rule-based risk assessment with explainable signals in real-time.",
  },
  {
    icon: Users,
    title: "Human-in-the-Loop",
    description: "High-risk decisions require human approval for AI safety.",
  },
  {
    icon: Lock,
    title: "Audit Trail",
    description: "Complete logging of all actions for compliance and governance.",
  },
];

const steps = [
  { num: "01", title: "Submit", description: "Customer submits claim", icon: FileText },
  { num: "02", title: "Extract", description: "AI extracts information", icon: Brain },
  { num: "03", title: "Score", description: "Risk analysis performed", icon: BarChart3 },
  { num: "04", title: "Review", description: "Human reviews if needed", icon: Eye },
  { num: "05", title: "Decide", description: "Final decision made", icon: CheckCircle2 },
];

import { FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero */}
      <section className="py-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={16} />
            </div>
            <span className="text-sm font-medium text-zinc-500">AI Insurance Platform</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.15] mb-5">
            Automate insurance claims with{" "}
            <span className="text-zinc-400">intelligence</span>
          </h1>
          <p className="text-lg text-zinc-500 max-w-xl leading-relaxed mb-8">
            An AI-powered platform that automates claims intake, triage, and risk analysis
            while keeping humans in the loop for critical decisions.
          </p>
          <div className="flex items-center gap-3">
            <a href="/submit" className="btn-primary inline-flex items-center gap-2">
              Submit a Claim
              <ArrowRight size={16} />
            </a>
            <a href="/dashboard" className="btn-secondary">
              View Dashboard
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md">
          {[
            { value: 68, suffix: "%", label: "Time Saved" },
            { value: 40, suffix: "%", label: "Automated" },
            { value: 5, suffix: "", label: "Sample Claims" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-zinc-900">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-zinc-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Features</h2>
          <p className="text-zinc-500 mt-2">
            Built with modern AI and engineering best practices.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          {features.map((f) => (
            <div key={f.title} className="card card-hover p-5">
              <f.icon size={20} className="text-zinc-400 mb-4" strokeWidth={1.5} />
              <h3 className="font-semibold text-sm mb-1.5">{f.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section className="card p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">How It Works</h2>
          <p className="text-zinc-500 mt-2">From submission to decision in 5 steps</p>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 stagger-children">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
                  <step.icon size={18} className="text-zinc-600" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-400">{step.num}</p>
                  <p className="text-sm font-medium">{step.title}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block flex-1 h-px bg-zinc-200 mx-4" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Processing Time", before: "25 min", after: "8 min", saved: "68%" },
          { title: "Automation Rate", value: "40%", sub: "of claims auto-processed" },
          { title: "Risk Detection", value: "3", sub: "risk levels (Low / Med / High)" },
        ].map((m) => (
          <div key={m.title} className="card p-5">
            <p className="text-sm text-zinc-500 mb-2">{m.title}</p>
            {m.before ? (
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-zinc-400 line-through">{m.before}</span>
                <ArrowRight size={12} className="text-zinc-300" />
                <span className="text-2xl font-bold">{m.after}</span>
              </div>
            ) : (
              <p className="text-2xl font-bold">{m.value}</p>
            )}
            <p className="text-xs text-zinc-400 mt-1">{m.sub || `Saved ${m.saved}`}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="card p-10 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to Transform Your Operations?</h2>
        <p className="text-zinc-500 mb-6 max-w-md mx-auto">
          See how AI can reduce processing time by 68% and automate 40% of claims.
        </p>
        <a href="/submit" className="btn-primary inline-flex items-center gap-2">
          Get Started
          <ArrowRight size={16} />
        </a>
      </section>
    </div>
  );
}
