"use client";

import { Shield, Zap, Brain, Users, ArrowRight, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Extraction",
    description: "Automatically extract structured data from unstructured claim descriptions using GPT-4o-mini.",
  },
  {
    icon: Zap,
    title: "Instant Risk Scoring",
    description: "Rule-based risk assessment with explainable signals, classifying claims in real-time.",
  },
  {
    icon: Users,
    title: "Human-in-the-Loop",
    description: "High-risk decisions require human approval, ensuring AI safety and governance.",
  },
  {
    icon: Shield,
    title: "Audit Trail",
    description: "Complete logging of all actions for compliance, governance, and transparency.",
  },
];

const steps = [
  { num: "01", title: "Submit", description: "Customer submits claim" },
  { num: "02", title: "Extract", description: "AI extracts information" },
  { num: "03", title: "Score", description: "Risk analysis performed" },
  { num: "04", title: "Review", description: "Human reviews if needed" },
  { num: "05", title: "Decide", description: "Final decision made" },
];

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative gradient-hero rounded-3xl p-12 lg:p-16 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm">AI-Powered Operations</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Automate Insurance Claims with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
              Intelligence
            </span>
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-xl">
            An AI-powered platform that automates claims intake, triage, and risk analysis
            while keeping humans in the loop for critical decisions.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/submit" className="btn-primary bg-white text-brand-600 hover:bg-gray-100 flex items-center gap-2">
              Submit a Claim
              <ArrowRight size={16} />
            </a>
            <a href="/dashboard" className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20">
              View Dashboard
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 mt-12 grid grid-cols-3 gap-8 max-w-lg">
          <div>
            <p className="text-3xl font-bold"><AnimatedCounter value={68} suffix="%" /></p>
            <p className="text-sm text-white/70">Time Saved</p>
          </div>
          <div>
            <p className="text-3xl font-bold"><AnimatedCounter value={40} suffix="%" /></p>
            <p className="text-sm text-white/70">Automated</p>
          </div>
          <div>
            <p className="text-3xl font-bold"><AnimatedCounter value={5} /></p>
            <p className="text-sm text-white/70">Sample Claims</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Built with modern AI and engineering best practices to demonstrate
            real operational value.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl border border-gray-100 p-6 card-hover">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="text-brand-600" size={22} />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-500">From submission to decision in 5 steps</p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center gap-4">
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg mb-3">
                  {step.num}
                </div>
                <p className="font-semibold text-sm">{step.title}</p>
                <p className="text-xs text-gray-400">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block w-12 h-0.5 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-brand-600 to-purple-600 rounded-3xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Operations?</h2>
        <p className="text-white/80 mb-8 max-w-xl mx-auto">
          See how AI can reduce processing time by 68% and automate 40% of claims.
        </p>
        <a href="/submit" className="btn-primary bg-white text-brand-600 hover:bg-gray-100 inline-flex items-center gap-2">
          Get Started
          <ArrowRight size={16} />
        </a>
      </section>
    </div>
  );
}
