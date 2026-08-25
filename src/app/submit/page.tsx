"use client";

import { useState } from "react";
import { submitClaim } from "@/lib/api";
import { ArrowLeft, ArrowRight, CheckCircle, User, FileText, MapPin, DollarSign } from "lucide-react";
import clsx from "clsx";

const steps = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Details", icon: FileText },
  { id: 3, label: "Review", icon: CheckCircle },
];

export default function SubmitClaim() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    raw_description: "",
    policy_number: "",
    incident_type: "",
    incident_date: "",
    incident_location: "",
    estimated_amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const data = {
        ...form,
        estimated_amount: form.estimated_amount ? Number(form.estimated_amount) : null,
        incident_date: form.incident_date || null,
        policy_number: form.policy_number || null,
        incident_type: form.incident_type || null,
        incident_location: form.incident_location || null,
      };
      const res = await submitClaim(data);
      setResult(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600" size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Claim Submitted!</h2>
        <p className="text-gray-500 mb-6">Your claim has been received and is being processed.</p>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 text-left">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Claim ID</span>
              <span className="font-mono text-sm">{result.id?.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Status</span>
              <span className="text-sm font-medium capitalize">{result.status}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <a href="/dashboard" className="btn-primary">View Dashboard</a>
          <button onClick={() => { setResult(null); setStep(1); setForm({ customer_name: "", customer_email: "", raw_description: "", policy_number: "", incident_type: "", incident_date: "", incident_location: "", estimated_amount: "" }); }} className="btn-secondary">
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                step >= s.id ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-400"
              )}>
                {step > s.id ? <CheckCircle size={18} /> : s.id}
              </div>
              <span className={clsx("text-sm font-medium hidden sm:block", step >= s.id ? "text-brand-600" : "text-gray-400")}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && <div className={clsx("w-12 h-0.5", step > s.id ? "bg-brand-600" : "bg-gray-200")} />}
          </div>
        ))}
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm">{error}</div>}

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        {/* Step 1: Personal */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-xl font-bold mb-6">Personal Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input type="text" required value={form.customer_name} onChange={e => update("customer_name", e.target.value)} placeholder="John Doe" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input type="email" required value={form.customer_email} onChange={e => update("customer_email", e.target.value)} placeholder="john@example.com" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Policy Number</label>
              <input type="text" value={form.policy_number} onChange={e => update("policy_number", e.target.value)} placeholder="POL-2024-XXX" className="input-field" />
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-xl font-bold mb-6">Incident Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea required rows={4} value={form.raw_description} onChange={e => update("raw_description", e.target.value)} placeholder="Describe what happened in detail..." className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Incident Type</label>
                <select value={form.incident_type} onChange={e => update("incident_type", e.target.value)} className="input-field">
                  <option value="">Select type</option>
                  {["Car accident", "Theft", "Fire", "Water damage", "Natural disaster", "Liability", "Other"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input type="date" value={form.incident_date} onChange={e => update("incident_date", e.target.value)} className="input-field" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input type="text" value={form.incident_location} onChange={e => update("incident_location", e.target.value)} placeholder="City" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Amount ($)</label>
                <input type="number" value={form.estimated_amount} onChange={e => update("estimated_amount", e.target.value)} placeholder="5000" className="input-field" />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-xl font-bold mb-6">Review Your Claim</h2>
            <div className="space-y-3">
              {[
                { label: "Name", value: form.customer_name },
                { label: "Email", value: form.customer_email },
                { label: "Policy", value: form.policy_number || "Not provided" },
                { label: "Type", value: form.incident_type || "Not specified" },
                { label: "Date", value: form.incident_date || "Not specified" },
                { label: "Location", value: form.incident_location || "Not specified" },
                { label: "Amount", value: form.estimated_amount ? $ : "Not specified" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500 text-sm">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
              {form.raw_description && (
                <div className="mt-4">
                  <p className="text-gray-500 text-sm mb-2">Description</p>
                  <p className="text-sm bg-gray-50 rounded-xl p-4">{form.raw_description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="btn-secondary disabled:opacity-30 flex items-center gap-2">
            <ArrowLeft size={16} /> Previous
          </button>
          {step < 3 ? (
            <button onClick={() => setStep(Math.min(3, step + 1))} className="btn-primary flex items-center gap-2">
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Claim <ArrowRight size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
