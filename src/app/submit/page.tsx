"use client";

import { useState } from "react";
import { submitClaim } from "@/lib/api";
import { ArrowLeft, ArrowRight, CheckCircle, User, FileText, MapPin, DollarSign, Sparkles } from "lucide-react";
import clsx from "clsx";
import FileUpload from "@/components/FileUpload";

const steps = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Details", icon: FileText },
  { id: 3, label: "Review", icon: CheckCircle },
];

export default function SubmitClaim() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    customer_name: "", customer_email: "", raw_description: "",
    policy_number: "", incident_type: "", incident_date: "",
    incident_location: "", estimated_amount: "",
  });
  const [files, setFiles] = useState<File[]>([]);
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
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  if (result) {
    return (
      <div className="max-w-lg mx-auto py-12 animate-scale-in">
        <div className="card p-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_8px_24px_rgba(34,197,94,0.3)]">
            <CheckCircle className="text-white" size={40} />
          </div>
          <h2 className="text-2xl font-black mb-2">Claim Submitted!</h2>
          <p className="text-gray-500 mb-8">Your claim has been received and is being processed.</p>
          <div className="card p-5 mb-8 text-left bg-gray-50/50">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Claim ID</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-lg">{result.id?.slice(0, 8)}...</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Status</span>
                <span className="badge-blue">{result.status}</span>
              </div>
              {files.length > 0 && (
                <>
                  <div className="h-px bg-gray-200" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Attachments</span>
                    <span className="text-sm font-medium">{files.length} file(s)</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <a href="/dashboard" className="btn-primary">View Dashboard</a>
            <button onClick={() => { setResult(null); setStep(1); setFiles([]); setForm({ customer_name: "", customer_email: "", raw_description: "", policy_number: "", incident_type: "", incident_date: "", incident_location: "", estimated_amount: "" }); }} className="btn-secondary">
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Indicator */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300",
                  step >= s.id
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-gray-100 text-gray-400"
                )}>
                  {step > s.id ? <CheckCircle size={18} /> : s.id}
                </div>
                <div className="hidden sm:block">
                  <p className={clsx("text-sm font-bold", step >= s.id ? "text-gray-900" : "text-gray-400")}>{s.label}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className={clsx("h-1 rounded-full transition-all duration-500", step > s.id ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-gray-100")} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          {error}
        </div>
      )}

      <div className="card p-8">
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <h2 className="text-xl font-black mb-1">Personal Information</h2>
              <p className="text-sm text-gray-400">Tell us about yourself</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-gray-600 mb-2">Full Name *</label>
                <input type="text" required value={form.customer_name} onChange={e => update("customer_name", e.target.value)} placeholder="John Doe" className="input-field" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-600 mb-2">Email *</label>
                <input type="email" required value={form.customer_email} onChange={e => update("customer_email", e.target.value)} placeholder="john@example.com" className="input-field" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-600 mb-2">Policy Number</label>
                <input type="text" value={form.policy_number} onChange={e => update("policy_number", e.target.value)} placeholder="POL-2024-XXX" className="input-field" />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <h2 className="text-xl font-black mb-1">Incident Details</h2>
              <p className="text-sm text-gray-400">Describe what happened</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-gray-600 mb-2">Description *</label>
                <textarea required rows={4} value={form.raw_description} onChange={e => update("raw_description", e.target.value)} placeholder="Describe what happened in detail..." className="input-field resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-600 mb-2">Incident Type</label>
                  <select value={form.incident_type} onChange={e => update("incident_type", e.target.value)} className="input-field">
                    <option value="">Select type</option>
                    {["Car accident", "Theft", "Fire", "Water damage", "Natural disaster", "Liability", "Other"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-600 mb-2">Date</label>
                  <input type="date" value={form.incident_date} onChange={e => update("incident_date", e.target.value)} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-600 mb-2">Location</label>
                  <input type="text" value={form.incident_location} onChange={e => update("incident_location", e.target.value)} placeholder="City" className="input-field" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-600 mb-2">Estimated Amount ($)</label>
                  <input type="number" value={form.estimated_amount} onChange={e => update("estimated_amount", e.target.value)} placeholder="5000" className="input-field" />
                </div>
              </div>
              {/* File Upload */}
              <div>
                <label className="block text-[13px] font-semibold text-gray-600 mb-2">Supporting Documents</label>
                <FileUpload onFilesChange={setFiles} />
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <h2 className="text-xl font-black mb-1">Review Your Claim</h2>
              <p className="text-sm text-gray-400">Verify everything before submitting</p>
            </div>
            <div className="space-y-1">
              {[
                { label: "Name", value: form.customer_name, icon: User },
                { label: "Email", value: form.customer_email, icon: FileText },
                { label: "Policy", value: form.policy_number || "Not provided", icon: FileText },
                { label: "Type", value: form.incident_type || "Not specified", icon: FileText },
                { label: "Date", value: form.incident_date || "Not specified", icon: FileText },
                { label: "Location", value: form.incident_location || "Not specified", icon: MapPin },
                { label: "Amount", value: form.estimated_amount ? `$${Number(form.estimated_amount).toLocaleString()}` : "Not specified", icon: DollarSign },
                { label: "Attachments", value: files.length > 0 ? `${files.length} file(s)` : "None", icon: FileText },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <span className="text-gray-400 text-sm">{item.label}</span>
                  <span className="text-sm font-semibold">{item.value}</span>
                </div>
              ))}
              {form.raw_description && (
                <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                  <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{form.raw_description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="btn-ghost disabled:opacity-30 flex items-center gap-2">
            <ArrowLeft size={16} /> Previous
          </button>
          {step < 3 ? (
            <button onClick={() => setStep(Math.min(3, step + 1))} className="btn-primary flex items-center gap-2">
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
              ) : (
                <><Sparkles size={16} /> Submit Claim</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}