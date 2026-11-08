import { CheckSquare, XSquare, Zap, TrendingUp, HandCoins } from "lucide-react";

export function BusinessViability() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Business Viability</h2>
        <p className="mt-4 text-gray-600">
          Analyzing the strategic positioning, market demand, and revenue mechanics for the Tanzanian ecosystem.
        </p>
      </div>

      {/* SWOT Analysis */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">SWOT Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200">
             <div className="flex items-center text-emerald-600 font-medium mb-3">
               <Zap className="w-5 h-5 mr-2" /> Strengths
             </div>
             <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
               <li>Culturally embedded target behavior (VICOBA savings are ubiquitous).</li>
               <li>Built-in viral network effects (acquiring 1 Treasurer acquires ~30 members).</li>
               <li>MNO integration allows instant liquidity across rural areas without ATMs.</li>
             </ul>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200">
             <div className="flex items-center text-rose-500 font-medium mb-3">
               <XSquare className="w-5 h-5 mr-2" /> Weaknesses
             </div>
             <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
               <li>Heavy reliance on fragmented Mobile Money APIs (occasional downtime).</li>
               <li>MNO transaction fees can eat into micro-savings margins.</li>
               <li>Onboarding non-smartphone users requires robust USSD infrastructure.</li>
             </ul>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200">
             <div className="flex items-center text-blue-600 font-medium mb-3">
               <TrendingUp className="w-5 h-5 mr-2" /> Opportunities
             </div>
             <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
               <li>Generating Alternative Credit Scores for unbanked individuals.</li>
               <li>B2B partnerships with commercial banks (CRDB, NMB) to offer liquidity/credit to high-performing groups.</li>
               <li>Expansion to similar markets (Kenya, Uganda, Rwanda).</li>
             </ul>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200">
             <div className="flex items-center text-gray-700 font-medium mb-3">
               <ShieldAlert className="w-5 h-5 mr-2" /> Threats
             </div>
             <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
               <li>MNOs (like Vodacom) building native group-savings features directly into their USSD menus.</li>
               <li>Strict new edicts from the Bank of Tanzania regarding non-bank financial institutions.</li>
             </ul>
          </div>
        </div>
      </div>

      {/* Revenue Model */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
          <HandCoins className="w-5 h-5 mr-2 text-slate-600" /> Revenue & Pricing Strategy
        </h3>
        <div className="space-y-4 text-sm text-slate-700">
          <p>
            An aggressive, friction-free entry model is required. Avoid taxing individual contributions heavily, as it discourages saving.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white p-4 rounded border border-slate-100 shadow-sm">
              <div className="font-semibold text-slate-900">1. SaaS Freemium (Group Level)</div>
              <p className="text-slate-500 text-xs mt-1">Basic ledger is free. Advanced PDF reports, loan amortization, & predictive analytics cost a flat TZS 10,000/month per group.</p>
            </div>
            <div className="bg-white p-4 rounded border border-slate-100 shadow-sm">
              <div className="font-semibold text-slate-900">2. Withdrawal / Payout Fee</div>
              <p className="text-slate-500 text-xs mt-1">A micro-percentage (e.g., 0.5%) charged during the end-of-cycle fund distribution. Easier to swallow when members are receiving large lumpsums.</p>
            </div>
            <div className="bg-white p-4 rounded border border-slate-100 shadow-sm">
              <div className="font-semibold text-slate-900">3. Float Interest (Future)</div>
              <p className="text-slate-500 text-xs mt-1">If partnered with a bank, earn interest on the massive aggregated pool of funds sitting in the central trust account.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// Ensure ShieldAlert is imported for the threats block
import { ShieldAlert } from "lucide-react";
