import { Map, Zap, AlertTriangle, ArrowRight } from "lucide-react";

export function RoadmapAndVerdict() {
  return (
    <div className="space-y-10 pb-12">
      
      {/* Product Roadmap */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Full Product Roadmap</h2>
        
        <div className="mt-8 relative border-l-2 border-gray-200 ml-3 space-y-8">
          
          <div className="relative pl-6">
            <div className="absolute w-4 h-4 rounded-full bg-blue-500 border-4 border-white -left-[9px] top-1"></div>
            <h3 className="font-bold text-lg text-gray-900">Phase 1: The Trust MVP (Months 1-4)</h3>
            <p className="text-sm text-gray-600 mt-2">
              Focus entirely on solving the "Transparency" problem. Deploy USSD interface and Web Dashboard. 
              Enable M-Pesa / Tigo Pesa collection (Paybill) and simple manual record keeping. Do not attempt automated outbound loans yet.
            </p>
          </div>
          
          <div className="relative pl-6">
            <div className="absolute w-4 h-4 rounded-full bg-gray-300 border-4 border-white -left-[9px] top-1"></div>
            <h3 className="font-bold text-lg text-gray-900">Phase 2: Automated Lending (Months 5-9)</h3>
            <p className="text-sm text-gray-600 mt-2">
              Integrate B2C APIs for automated disbursement of loans. Introduce dynamic Android App. Implement the dual-signature Multi-sig approval flow for Treasurers to release funds safely.
            </p>
          </div>
          
          <div className="relative pl-6">
            <div className="absolute w-4 h-4 rounded-full bg-gray-300 border-4 border-white -left-[9px] top-1"></div>
            <h3 className="font-bold text-lg text-gray-900">Phase 3: AI & Wealth Engine (Year 2+)</h3>
            <p className="text-sm text-gray-600 mt-2">
              <strong>AI Capabilities:</strong> Introduce a conversational AI (via WhatsApp bot) allowing members to query their balances naturally (e.g., "Nina kiasi gani kwenye kikundi cha Upendo?"). 
              <strong>Alternative Scoring:</strong> Package anonymized repayment histories to negotiate low-interest bulk liquidity loans from commercial banks for the best-performing groups.
            </p>
          </div>
        </div>
      </div>

      {/* The Verdict */}
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-8 rounded-2xl shadow-xl mt-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pt-4 pr-4">
           <AlertTriangle className="w-32 h-32" />
        </div>
        
        <h2 className="text-2xl font-bold mb-4 flex items-center relative z-10">
          <Zap className="w-6 h-6 mr-3 text-amber-400" />
          The Brutally Honest Verdict
        </h2>
        
        <div className="space-y-4 text-neutral-300 relative z-10 leading-relaxed text-sm md:text-base">
          <p>
            PamojaPesa is aiming at one of the most lucrative, structurally sound financial behaviors in Sub-Saharan Africa. The VICOBA market in Tanzania controls billions of shillings annually, completely informally. The demand for transparency and security is overwhelming.
          </p>
          <p>
            <strong>However, execution will be a regulatory minefield.</strong> If PamojaPesa attempts to hold member deposits in its own corporate accounts, it will be crushed by Bank of Tanzania licensing requirements and capital provisioning rules. 
          </p>
          <div className="bg-neutral-950/50 p-5 rounded-lg border border-neutral-700 mt-6 font-medium text-amber-100">
            <h4 className="text-white mb-2 flex items-center">
              <ArrowRight className="w-4 h-4 mr-2" /> The Path to Launch
            </h4>
            <p className="font-normal text-sm">
              Before writing a single line of code, PamojaPesa MUST secure a partnership agreement with a Tier-1 commercial bank (like CRDB or NMB) to act as the custodian of funds. PamojaPesa must position itself purely as the "Technology and Ledger SaaS" layer. Furthermore, treating the USSD gateway as an afterthought to the Android app will result in immediate failure, as the majority of rural group members do not have consistent smartphone access. 
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
