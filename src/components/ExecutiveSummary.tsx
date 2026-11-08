import { Star, ShieldAlert, Target, Lightbulb } from "lucide-react";

export function ExecutiveSummary() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Executive Summary</h2>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          PamojaPesa targets a massive, proven behavioral habit in Tanzania: communal savings through VICOBA (Village Community Banks), SACCOs, and informal groups. By digitizing the ledger and automating contributions and loans via major mobile money networks (M-Pesa, Airtel Money, Tigo Pesa, HaloPesa), the platform eliminates the most common failure points of informal groups: theft, mismanagement, manual tallying errors, and lack of transparency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-emerald-900 text-lg">Investment Readiness</h3>
          </div>
          <div>
            <div className="text-5xl font-bold text-emerald-700 mb-2">8.5<span className="text-2xl text-emerald-500">/10</span></div>
            <p className="text-emerald-800 text-sm">
              Highly scalable due to pre-existing market behavior. Execution risk lies primarily in regulatory compliance and managing MNO (Mobile Network Operator) API reliability.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 flex flex-col">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-amber-900 text-lg">Primary Risk Factor</h3>
          </div>
          <p className="text-amber-800 text-sm leading-relaxed mt-auto">
            Holding member funds directly requires strict Bank of Tanzania (BoT) Microfinance licensing. The initial MVP must act as a 'Digital Ledger Only' or partner with a licensed commercial bank for the trust/escrow account to avoid crushing early compliance burdens.
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          The Core Value Proposition
        </h3>
        <p className="text-gray-600">
          In rural and urban Tanzania, trust is the currency of VICOBA. Treasurers face immense pressure, and members often dispute contributions. PamojaPesa acts as the immutable third-party truth. When a member contributes via USSD or App, the group's digital ledger updates instantly for all to see. Automated reminders replace awkward phone calls to defaulters.
        </p>
      </div>
    </div>
  );
}
