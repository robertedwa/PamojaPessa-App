import { Lock, GitMerge, FileArchive, ShieldCheck } from "lucide-react";

export function SecurityAndOps() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Financial Ops & Security</h2>
        <p className="mt-4 text-gray-600">
          Ensuring zero-leakage workflows, immutable audit trails, and strict access controls.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <GitMerge className="w-5 h-5 mr-2 text-violet-600" /> Operational Workflows
        </h3>
        
        <div className="space-y-6">
          <div className="border-l-2 border-violet-200 pl-4">
            <h4 className="font-medium text-gray-900">1. Fund Collection (Push STK)</h4>
            <p className="text-sm text-gray-600 mt-1">
              At the weekly meeting, the Treasurer initiates the collection cycle. PamojaPesa sends an MNO Push USSD (STK Push) prompt directly to members' phones: *"Confirm TZS 10,000 contribution to Upendo Group. Enter PIN"*. Upon PIN entry, funds securely transfer to the escrow account, and the ledger automatically updates.
            </p>
          </div>
          
          <div className="border-l-2 border-violet-200 pl-4">
            <h4 className="font-medium text-gray-900">2. Loan Disbursement Workflow</h4>
            <p className="text-sm text-gray-600 mt-1">
              Member requests loan via SMS/USSD/App &rarr; Request alerts Treasurer/Committee &rarr; Multi-sig approval (requires 2 Committee PINs) &rarr; API triggers MNO B2C (Business to Consumer) payment directly to the member's mobile wallet.
            </p>
          </div>
          
          <div className="border-l-2 border-violet-200 pl-4">
            <h4 className="font-medium text-gray-900">3. End of Cycle Reconciliation</h4>
            <p className="text-sm text-gray-600 mt-1">
              Provides one-click calculation of dividends based on share volume and fine payments. The system generates individualized payout matrices and auto-disburses via bulk B2C APIs.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
           <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
             <ShieldCheck className="w-5 h-5 mr-2 text-emerald-600" /> Security Framework
           </h3>
           <ul className="space-y-2 text-sm text-slate-700">
             <li className="flex items-start">
               <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 mr-2 flex-shrink-0"></span>
               <strong>Identity Verification (KYC):</strong> Direct API hook into NIDA (National Identification Authority) to verify member identities against phone numbers.
             </li>
             <li className="flex items-start">
               <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 mr-2 flex-shrink-0"></span>
               <strong>M-of-N Access Control:</strong> Any funds leaving the system require multi-signature cryptographic approval from designated group leaders.
             </li>
             <li className="flex items-start">
               <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 mr-2 flex-shrink-0"></span>
               <strong>Transaction Monitoring:</strong> Velocity checks to prevent automated drain attacks or accidental duplicate B2C disbursements.
             </li>
           </ul>
        </div>
        
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
           <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
             <FileArchive className="w-5 h-5 mr-2 text-blue-600" /> Audit & Reporting
           </h3>
           <ul className="space-y-2 text-sm text-slate-700">
             <li className="flex items-start">
               <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0"></span>
               <strong>Immutable Ledger:</strong> Transactions, once confirmed by the MNO webhook, cannot be deleted or modified by any user, including admins.
             </li>
             <li className="flex items-start">
               <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0"></span>
               <strong>Bank-Grade Statements:</strong> Treasurers can export one-click PDF statements aligned with Tanzanian accounting formats for SACCO auditing.
             </li>
           </ul>
        </div>
      </div>
    </div>
  );
}
