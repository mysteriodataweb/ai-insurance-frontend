"use client";

import { useState } from "react";
import { submitClaim, uploadAttachments } from "@/lib/api";
import type { Claim, ClaimInput } from "@/lib/types";
import { ArrowLeft, ArrowRight, CheckCircle, User, FileText, Upload, AlertTriangle } from "lucide-react";
import clsx from "clsx";
import FileUpload from "@/components/FileUpload";

const steps = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Details", icon: FileText },
  { id: 3, label: "Review", icon: CheckCircle },
];

const MIN_DESCRIPTION = 20;
const EMPTY_FORM = {
  customer_name: "", customer_email: "", raw_description: "",
  policy_number: "", incident_type: "", incident_date: "",
  incident_location: "", estimated_amount: "",
};

function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function validateStep(step: number, form: typeof EMPTY_FORM): string {
  if (step === 1) {
    if (!form.customer_name.trim()) return "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email.trim())) return "Please enter a valid email address.";
  }
  if (step === 2) {
    if (form.raw_description.trim().length < MIN_DESCRIPTION) return `Please describe what happened (at least ${MIN_DESCRIPTION} characters).`;
    if (form.incident_date && form.incident_date > todayISO()) return "The incident date cannot be in the future.";
    if (form.estimated_amount && !(Number(form.estimated_amount) >= 0)) return "The estimated amount must be a positive number.";
  }
  return "";
}

export default function SubmitClaim() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Claim | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadedCount, setUploadedCount] = useState(0);
  const [error, setError] = useState("");
  const [formKey, setFormKey] = useState(0);

  const update = (field: keyof typeof EMPTY_FORM, value: string) => setForm({ ...form, [field]: value });

  const goNext = () => {
    const message = validateStep(step, form);
    setError(message);
    if (!message) setStep(Math.min(3, step + 1));
  };

  const handleSubmit = async () => {
    const message = validateStep(1, form) || validateStep(2, form) || (consent ? "" : "Please accept the processing of your claim.");
    setError(message);
    if (message) return;

    setLoading(true);
    try {
      const data: ClaimInput = {
        customer_name: form.customer_name.trim(),
        customer_email: form.customer_email.trim(),
        raw_description: form.raw_description.trim(),
        estimated_amount: form.estimated_amount ? Number(form.estimated_amount) : null,
        incident_date: form.incident_date || null,
        policy_number: form.policy_number.trim() || null,
        incident_type: form.incident_type || null,
        incident_location: form.incident_location.trim() || null,
      };
      const claim = await submitClaim(data);
      if (files.length) {
        try {
          const uploaded = await uploadAttachments(claim.id, files);
          setUploadedCount(uploaded.length);
        } catch (err) {
          setUploadError(err instanceof Error ? err.message : "Upload failed");
        }
      }
      setResult(claim);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setStep(1);
    setFiles([]);
    setConsent(false);
    setUploadError("");
    setUploadedCount(0);
    setForm(EMPTY_FORM);
    setFormKey((k) => k + 1);
  };

  if (result) {
    return (
      <div className="max-w-lg mx-auto py-12">
        <div className="card p-10 text-center">
          <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-bold mb-1">Claim Submitted</h2>
          <p className="text-sm text-zinc-500 mb-8">
            Your claim has been received. Our AI assistant is analyzing it now; an agent will contact you at {result.customer_email} if anything is missing.
          </p>
          <div className="card p-4 mb-6 text-left">
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-4">
                <span className="text-zinc-400 text-sm">Claim reference</span>
                <span className="font-mono text-xs bg-zinc-100 px-2 py-1 rounded break-all">{result.id}</span>
              </div>
              <div className="h-px bg-zinc-100" />
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Attachments</span>
                <span className="text-sm font-medium">{uploadedCount} file(s) received</span>
              </div>
            </div>
          </div>
          {uploadError && (
            <div className="flex items-start gap-2 bg-amber-50 text-amber-800 p-3 rounded-lg mb-6 text-sm border border-amber-200 text-left">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>Your claim was saved, but the documents could not be uploaded: {uploadError}</span>
            </div>
          )}
          <button onClick={reset} className="btn-secondary">Submit Another</button>
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
                <label htmlFor="customer_name" className="block text-sm font-medium text-zinc-700 mb-1.5">Full Name *</label>
                <input id="customer_name" type="text" required maxLength={255} autoComplete="name" value={form.customer_name} onChange={e => update("customer_name", e.target.value)} placeholder="John Doe" className="input-field" />
              </div>
              <div>
                <label htmlFor="customer_email" className="block text-sm font-medium text-zinc-700 mb-1.5">Email *</label>
                <input id="customer_email" type="email" required maxLength={255} autoComplete="email" value={form.customer_email} onChange={e => update("customer_email", e.target.value)} placeholder="john@example.com" className="input-field" />
              </div>
              <div>
                <label htmlFor="policy_number" className="block text-sm font-medium text-zinc-700 mb-1.5">Policy Number</label>
                <input id="policy_number" type="text" maxLength={50} value={form.policy_number} onChange={e => update("policy_number", e.target.value)} placeholder="POL-2024-XXX" className="input-field" />
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
                <label htmlFor="raw_description" className="block text-sm font-medium text-zinc-700 mb-1.5">Description *</label>
                <textarea id="raw_description" required rows={4} maxLength={5000} value={form.raw_description} onChange={e => update("raw_description", e.target.value)} placeholder="Describe what happened in detail: when, where, what was damaged, the estimated cost..." className="input-field resize-none" />
                <p className="text-xs text-zinc-400 mt-1">{form.raw_description.trim().length}/5000 characters (minimum {MIN_DESCRIPTION})</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="incident_type" className="block text-sm font-medium text-zinc-700 mb-1.5">Incident Type</label>
                  <select id="incident_type" value={form.incident_type} onChange={e => update("incident_type", e.target.value)} className="input-field">
                    <option value="">Select type</option>
                    {["Car accident", "Theft", "Fire", "Water damage", "Natural disaster", "Liability", "Other"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="incident_date" className="block text-sm font-medium text-zinc-700 mb-1.5">Date</label>
                  <input id="incident_date" type="date" max={todayISO()} value={form.incident_date} onChange={e => update("incident_date", e.target.value)} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="incident_location" className="block text-sm font-medium text-zinc-700 mb-1.5">Location</label>
                  <input id="incident_location" type="text" maxLength={255} value={form.incident_location} onChange={e => update("incident_location", e.target.value)} placeholder="City" className="input-field" />
                </div>
                <div>
                  <label htmlFor="estimated_amount" className="block text-sm font-medium text-zinc-700 mb-1.5">Estimated Amount ($)</label>
                  <input id="estimated_amount" type="number" min={0} step="0.01" value={form.estimated_amount} onChange={e => update("estimated_amount", e.target.value)} placeholder="5000" className="input-field" />
                </div>
              </div>
              <div>
                <span className="block text-sm font-medium text-zinc-700 mb-1.5">Supporting Documents</span>
                <FileUpload key={formKey} initialFiles={files} onFilesChange={setFiles} />
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
                  <div className="flex justify-between items-center py-2.5 gap-4">
                    <span className="text-zinc-400 text-sm">{item.label}</span>
                    <span className="text-sm font-medium text-right break-all">{item.value}</span>
                  </div>
                  {i < 7 && <div className="h-px bg-zinc-100" />}
                </div>
              ))}
              {form.raw_description && (
                <div className="mt-3 p-4 bg-zinc-50 rounded-lg">
                  <p className="text-xs text-zinc-400 font-medium mb-1.5">Description</p>
                  <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">{form.raw_description}</p>
                </div>
              )}
            </div>
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 rounded border-zinc-300" />
              <span className="text-xs text-zinc-500 leading-relaxed">
                I agree that my claim, including its description, is processed by an AI assistant from a third-party provider
                to speed up its review. Every decision on my claim is made by a person.
              </span>
            </label>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-zinc-100">
          <button onClick={() => { setError(""); setStep(Math.max(1, step - 1)); }} disabled={step === 1} className="btn-ghost disabled:opacity-30 flex items-center gap-2">
            <ArrowLeft size={16} /> Previous
          </button>
          {step < 3 ? (
            <button onClick={goNext} className="btn-primary flex items-center gap-2">
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading || !consent} className="btn-primary flex items-center gap-2 disabled:opacity-60">
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
