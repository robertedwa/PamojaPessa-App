import { Languages, Scale, BookOpen, UserCheck } from "lucide-react";

export function UXAndCompliance() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">UX & Regulatory Compliance</h2>
        <p className="mt-4 text-gray-600">
          Succeeding in Tanzania requires localized design patterns and strict adherence to emerging financial regulations.
        </p>
      </div>

      {/* UX Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
         <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2 flex items-center">
           <UserCheck className="w-5 h-5 mr-2 text-indigo-600" /> User Experience Design
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 flex items-center mb-2">
                <Languages className="w-4 h-4 mr-2" /> Bilingual By Default
              </h4>
              <p className="text-sm text-gray-600">
                Swahili (Kiswahili) must be the default, unabbreviated language for all USSD flows and app interfaces. English acts as a secondary toggle. Financial terms (e.g., "Hisa", "Faini", "Mkopo") must use standardized local idioms.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 flex items-center mb-2">
                <BookOpen className="w-4 h-4 mr-2" /> Low-Literacy Optimization
              </h4>
              <p className="text-sm text-gray-600">
                The Android app relies heavily on color-coding (Green for received, Red for arrears) and distinct iconography. Key actions use large, highly visible touch-targets.
              </p>
            </div>
         </div>
      </div>

      {/* Compliance Section */}
      <div className="bg-rose-50 p-6 rounded-xl border border-rose-100">
         <h3 className="text-xl font-semibold text-rose-900 mb-4 border-b border-rose-200 pb-2 flex items-center">
           <Scale className="w-5 h-5 mr-2 text-rose-700" /> Regulatory Terrain (Tanzania)
         </h3>
         
         <div className="space-y-4 text-rose-800 text-sm">
            <div className="bg-white/60 p-4 rounded-lg">
              <strong className="block text-base mb-1 text-rose-900">1. Bank of Tanzania (BoT) Microfinance Act, 2018</strong>
              <p>
                VICOBA and informal groups fall under Tier 4 Microfinance providers. If PamojaPesa aggregates and holds member funds directly in its corporate wallets, it risks being classified as a Tier 3 or Tier 2 provider, requiring enormous capital reserves. <strong>Strategic Mitigation:</strong> Operate strictly as a SaaS technology provider. Ensure the actual trust account holding the funds belongs directly to a licensed partner bank (e.g., NMB or CRDB), maintaining PamojaPesa's status as a pure tech vendor.
              </p>
            </div>
            
            <div className="bg-white/60 p-4 rounded-lg">
              <strong className="block text-base mb-1 text-rose-900">2. Data Protection Act (DPA 2022)</strong>
              <p>
                Strict enforcement of data sovereignty means all primary database servers storing Tanzanian citizens' KYC data (NIDA numbers, phone histories) must be legally compliant with local hosting or cross-border transfer laws managed by the Personal Data Protection Commission (PDPC).
              </p>
            </div>
            
            <div className="bg-white/60 p-4 rounded-lg">
              <strong className="block text-base mb-1 text-rose-900">3. TCRA Mobile Money Regulations</strong>
              <p>
                Integration through MNOs requires navigating strict Consumer Protection thresholds regarding fees disclosed to users before USSD PIN entry.
              </p>
            </div>
         </div>
      </div>
    </div>
  );
}
