"use client";

import { useState } from "react";
import { submitClaim } from "@/lib/api";

export default function SubmitClaim() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Claim Submitted</h2>
          <p className="text-green-700 mb-4">Your claim has been received successfully.</p>
          <div className="bg-white rounded-lg p-4 text-left mb-4">
            <p className="text-sm text-gray-500">Claim ID</p>
            <p className="font-mono text-sm">{result.id}</p>
            <p className="text-sm text-gray-500 mt-2">Status</p>
            <p className="font-medium capitalize">{result.status}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <a href="/dashboard" className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 text-sm">
              View Dashboard
            </a>
            <button onClick={() => { setResult(null); setForm({ customer_name: "", customer_email: "", raw_description: "", policy_number: "", incident_type: "", incident_date: "", incident_location: "", estimated_amount: "" }); }} className="bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Submit an Insurance Claim</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input type="text" required value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" required value={form.customer_email} onChange={e => setForm({ ...form, customer_email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description of Incident *</label>
          <textarea required rows={4} value={form.raw_description} onChange={e => setForm({ ...form, raw_description: e.target.value })} placeholder="Describe what happened in detail..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
            <input type="text" value={form.policy_number} onChange={e => setForm({ ...form, policy_number: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Incident Type</label>
            <select value={form.incident_type} onChange={e => setForm({ ...form, incident_type: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500">
              <option value="">Select type</option>
              <option value="Car accident">Car Accident</option>
              <option value="Theft">Theft</option>
              <option value="Fire">Fire</option>
              <option value="Water damage">Water Damage</option>
              <option value="Natural disaster">Natural Disaster</option>
              <option value="Liability">Liability</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Incident</label>
            <input type="date" value={form.incident_date} onChange={e => setForm({ ...form, incident_date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" value={form.incident_location} onChange={e => setForm({ ...form, incident_location: e.target.value })} placeholder="City" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Amount ($)</label>
            <input type="number" value={form.estimated_amount} onChange={e => setForm({ ...form, estimated_amount: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50">
          {loading ? "Submitting..." : "Submit Claim"}
        </button>
      </form>
    </div>
  );
}
