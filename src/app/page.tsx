export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">AI Insurance Operations Platform</h1>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
        An AI-powered platform that automates insurance claims intake, triage, and risk analysis
        while keeping humans in the loop for critical decisions.
      </p>
      <div className="flex gap-4 justify-center">
        <a href="/submit" className="bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700">
          Submit a Claim
        </a>
        <a href="/dashboard" className="bg-white text-brand-600 border border-brand-200 px-6 py-3 rounded-lg hover:bg-brand-50">
          View Dashboard
        </a>
      </div>
    </div>
  );
}
