import { Server, Smartphone, Database, Globe, Network } from "lucide-react";

export function TechnicalArchitecture() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Technical Architecture</h2>
        <p className="mt-4 text-gray-600">
          Designed for a low-bandwidth, high-reliability environment handling critical P2P financial data.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center">
             <Network className="w-5 h-5 mr-2 text-indigo-600" />
             <h3 className="font-semibold text-gray-900">System Topology</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
                <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider mb-3">Client Interfaces</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Smartphone className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <span className="block font-medium text-gray-900">Android App (React Native)</span>
                      <span className="block text-xs text-gray-500">Offline-first local DB (WatermelonDB). Syncs when connection restores.</span>
                    </div>
                  </li>
                   <li className="flex items-start">
                    <Server className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <span className="block font-medium text-gray-900">USSD Gateway</span>
                      <span className="block text-xs text-gray-500">Via Africa's Talking or Selcom. Essential for feature-phone users (70% of market).</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Globe className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <span className="block font-medium text-gray-900">Web Dashboard (React)</span>
                      <span className="block text-xs text-gray-500">For Treasurers, Admins, and complex PDF report generation.</span>
                    </div>
                  </li>
                </ul>
             </div>
             
             <div>
                <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider mb-3">Backend & Infrastructure</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-0.5 font-bold text-xs">GO</div>
                    <div>
                      <span className="block font-medium text-gray-900">Microservices (Go / Node.js)</span>
                      <span className="block text-xs text-gray-500">Go for high-concurrency webhook ingestion from MNOs. Node for business logic.</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Database className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <span className="block font-medium text-gray-900">PostgreSQL + Redis</span>
                      <span className="block text-xs text-gray-500">Strict ACID compliance for the exact ledger. Redis for USSD session state.</span>
                    </div>
                  </li>
                </ul>
             </div>
          </div>
        </div>

        {/* Database Modeling */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mt-4">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center">
             <Database className="w-5 h-5 mr-2 text-indigo-600" />
             <h3 className="font-semibold text-gray-900">Core Ledger Database Structure</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-mono text-gray-800">
               <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <div className="font-bold text-indigo-700 mb-2">users</div>
                  <div>id (uuid)</div>
                  <div>phone (varchar, unq)</div>
                  <div>nida_id (varchar)</div>
                  <div>kyc_level (int)</div>
               </div>
               <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <div className="font-bold text-indigo-700 mb-2">groups</div>
                  <div>id (uuid)</div>
                  <div>name (varchar)</div>
                  <div>cycle_start (timestamp)</div>
                  <div>share_value (decimal)</div>
               </div>
               <div className="bg-slate-50 p-4 rounded border border-slate-200">
                  <div className="font-bold text-indigo-700 mb-2">transactions</div>
                  <div>id (uuid)</div>
                  <div>group_id (fk)</div>
                  <div>user_id (fk)</div>
                  <div>amount (decimal)</div>
                  <div>tx_type (IN, OUT, LPF)</div>
                  <div>mno_receipt (varchar)</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
