"use client";

import { useState } from "react";
import { submitClaim } from "@/lib/api";
import { ArrowLeft, ArrowRight, CheckCircle, User, FileText, MapPin, DollarSign, Upload } from "lucide-react";
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
      <div className="max-w-lg mx-auto py-12">
        <div className="card p-10 text-center">
          <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-bold mb-1">Claim Submitted</h2>
          <p className="text-sm text-zinc-500 mb-8">Your claim has been received and is being processed.</p>
          <div className="card p-4 mb-8 text-left">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Claim ID</span>
                <span className="font-mono text-xs bg-zinc-100 px-2 py-1 rounded">{result.id?.slice(0, 8)}...</span>
              </div>
              <div className="h-px bg-zinc-100" />
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Status</span>
                <span className="badge-blue">{result.status}</span>
              </div>
              {files.length > 0 && (
                <>
                  <div className="h-px bg-zinc-100" />
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400 text-sm">Attachments</span>
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
      <div className="flex items-center gap-3 mb-6">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div className={clsx(
                "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all",
                step >= s.id ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400"
              )}>
                {step > s.id ? <CheckCircle size={14} /> : s.id}
              </div>
              <span className={clsx("text-sm hidden sm:block", step >= s.id ? "text-zinc-900 font-medium" : "text-zinc-400")}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 mx-3">
                <div className={clsx("h-px transition-colors", step > s.id ? "bg-zinc-900" : "bg-zinc-200")} />
              </div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm border border-red-200">
          {error}
        </div>
      )}

      <div className="card p-8">
        {step === 1 && (
          <div className="space-y-5 animate-slide-up">
            <div>
              <h2 className="text-lg font-bold mb-0.5">Personal Information</h2>
              <p className="text-sm text-zinc-400">Tell us about yourself</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Full Name *</label>
                <input type="text" required value={form.customer_name} onChange={e => update("customer_name", e.target.value)} placeholder="John Doe" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email *</label>
                <input type="email" required value={form.customer_email} onChange={e => update("customer_email", e.target.value)} placeholder="john@example.com" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Policy Number</label>
                <input type="text" value={form.policy_number} onChange={e => update("policy_number", e.target.value)} placeholder="POL-2024-XXX" className="input-field" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-slide-up">
            <div>
              <h2 className="text-lg font-bold mb-0.5">Incident Details</h2>
              <p className="text-sm text-zinc-400">Describe what happened</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Description *</label>
                <textarea required rows={4} value={form.raw_description} onChange={e => update("raw_description", e.target.value)} placeholder="Describe what happened in detail..." className="input-field resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Incident Type</label>
                  <select value={form.incident_type} onChange={e => update("incident_type", e.target.value)} className="input-field">
                    <option value="">Select type</option>
                    {["Car accident", "Theft", "Fire", "Water damage", "Natural disaster", "Liability", "Other"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Date</label>
                  <input type="date" value={form.incident_date} onChange={e => update("incident_date", e.target.value)} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Location</label>
                  <input type="text" value={form.incident_location} onChange={e => update("incident_location", e.target.value)} placeholder="City" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Estimated Amount ($)</label>
                  <input type="number" value={form.estimated_amount} onChange={e => update("estimated_amount", e.target.value)} placeholder="5000" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Supporting Documents</label>
                <FileUpload onFilesChange={setFiles} />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-slide-up">
            <div>
              <h2 className="text-lg font-bold mb-0.5">Review Your Claim</h2>
              <p className="text-sm text-zinc-400">Verify everything before submitting</p>
            </div>
            <div className="space-y-0">
              {[
                { label: "Name", value: form.customer_name },
                { label: "Email", value: form.customer_email },
                { label: "Policy", value: form.policy_number || "Not provided" },
                { label: "Type", value: form.incident_type || "Not specified" },
                { label: "Date", value: form.incident_date || "Not specified" },
                { label: "Location", value: form.incident_location || "Not specified" },
                { label: "Amount", value: form.estimated_amount ? `$${Number(form.estimated_amount).toLocaleString()}` : "Not specified" },
                { label: "Attachments", value: files.length > 0 ? `${files.length} file(s)` : "None" },
              ].map((item, i) => (
                <div key={item.label}>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-zinc-400 text-sm">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                  {i < 7 && <div className="h-px bg-zinc-100" />}
                </div>
              ))}
              {form.raw_description && (
                <div className="mt-3 p-4 bg-zinc-50 rounded-lg">
                  <p className="text-xs text-zinc-400 font-medium mb-1.5">Description</p>
                  <p className="text-sm text-zinc-600 leading-relaxed">{form.raw_description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-zinc-100">
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
                <><Upload size={16} /> Submit Claim</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
