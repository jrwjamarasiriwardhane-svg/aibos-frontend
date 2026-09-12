import React from "react";
import {
  FileText,
  CheckCircle2,
  X,
  Printer,
  ShieldCheck,
} from "lucide-react";

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  customerName: string;
  customerEmail?: string;
  customerAddress?: string;
  providerName: string;
  providerRole?: string;
  serviceCategory: string;
  description: string;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
  subtotal: number;
  platformFee: number;
  tax?: number;
  total: number;
  status: "paid" | "pending" | "refunded";
  paymentMethod?: string;
}

interface InvoiceViewProps {
  invoice: InvoiceData;
  onClose: () => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({
  invoice,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] print:border-none print:shadow-none print:max-h-none">
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white print:hidden">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            <span className="font-bold text-sm text-slate-800">
              Tax Invoice #{invoice.invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 print:p-0">
          {/* Header Branding */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  AIBOS
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  OS Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                AI Business Operating System Platform
              </p>
              <p className="text-xs text-slate-400">
                Colombo, Sri Lanka &bull; support@aibos.io
              </p>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  invoice.status === "paid"
                    ? "bg-emerald-100 text-emerald-800"
                    : invoice.status === "pending"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                <CheckCircle2 size={12} />
                {invoice.status.toUpperCase()}
              </span>
              <p className="text-xs text-slate-500 font-mono mt-2">
                Invoice: {invoice.invoiceNumber}
              </p>
              <p className="text-xs text-slate-500 font-mono">
                Date: {invoice.date}
              </p>
            </div>
          </div>

          {/* Parties Grid */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div>
              <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px] mb-1">
                Billed To (Client)
              </p>
              <p className="font-bold text-slate-800 text-sm">{invoice.customerName}</p>
              {invoice.customerEmail && (
                <p className="text-slate-500 mt-0.5">{invoice.customerEmail}</p>
              )}
              {invoice.customerAddress && (
                <p className="text-slate-500 mt-0.5">{invoice.customerAddress}</p>
              )}
            </div>

            <div className="text-right">
              <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px] mb-1">
                Service Provider
              </p>
              <p className="font-bold text-slate-800 text-sm">{invoice.providerName}</p>
              <p className="text-slate-500 mt-0.5">{invoice.serviceCategory}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1">
                <ShieldCheck size={11} /> Verified Specialist
              </span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3 text-right">Rate</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                    <td className="px-4 py-3 text-right font-mono">
                      LKR {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold font-mono">
                      LKR {(item.quantity * item.unitPrice).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-mono">LKR {invoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Platform Service Fee</span>
                <span className="font-mono">LKR {invoice.platformFee.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Due</span>
                <span className="text-blue-600 font-mono">
                  LKR {invoice.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="border-t border-slate-200 pt-4 text-[11px] text-slate-400 text-center">
            <p>Thank you for using AIBOS Autonomous Dispatch & Operating System.</p>
            <p className="mt-0.5">Automated cryptographic receipt &bull; No physical signature required</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
