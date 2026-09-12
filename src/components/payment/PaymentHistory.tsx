import React, { useState, useEffect } from "react";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import InvoiceView from "./InvoiceView";
import type { InvoiceData } from "./InvoiceView";

export interface Transaction {
  id: string;
  transactionId: string;
  title: string;
  category: string;
  counterpartyName: string;
  amount: number;
  type: "payment" | "payout";
  status: "completed" | "pending" | "failed";
  date: string;
  paymentMethod: string;
  invoiceData?: InvoiceData;
}

interface PaymentHistoryProps {
  userRole?: "customer" | "professional" | "company";
}

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  userRole = "customer",
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(
    null
  );
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/payments/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.transactions && data.transactions.length > 0) {
            setTransactions(data.transactions);
            return;
          }
        }
      } catch (e) {
        console.warn("Payment fetch fallback:", e);
      } finally {
        setLoading(false);
      }

      // Default initial ledger items for demonstration
      setTransactions([
        {
          id: "tx-101",
          transactionId: "TXN-78901234",
          title: "Precision Electrical Panel Repair",
          category: "Electrician",
          counterpartyName: "Sunil Perera (Master Electrician)",
          amount: 4500,
          type: userRole === "customer" ? "payment" : "payout",
          status: "completed",
          date: "2026-03-08",
          paymentMethod: "AIBOS Secure Escrow",
          invoiceData: {
            invoiceNumber: "INV-2026-00101",
            date: "2026-03-08",
            customerName: "Current User",
            providerName: "Sunil Perera",
            serviceCategory: "Electrician",
            description: "Main electrical distribution panel breaker diagnosis and wiring overhaul",
            items: [
              { name: "Fault diagnosis & safety inspection", quantity: 1, unitPrice: 2000 },
              { name: "30A Breaker replacement & rewiring", quantity: 1, unitPrice: 2000 },
            ],
            subtotal: 4000,
            platformFee: 500,
            total: 4500,
            status: "paid",
          },
        },
        {
          id: "tx-102",
          transactionId: "TXN-78901235",
          title: "Split AC Gas Top-up & Deep Cleaning",
          category: "AC Repair",
          counterpartyName: "Kandy Climate Pro",
          amount: 6000,
          type: userRole === "customer" ? "payment" : "payout",
          status: "completed",
          date: "2026-03-04",
          paymentMethod: "Visa Debit &bull;&bull; 4821",
          invoiceData: {
            invoiceNumber: "INV-2026-00102",
            date: "2026-03-04",
            customerName: "Current User",
            providerName: "Kandy Climate Pro",
            serviceCategory: "AC Repair",
            description: "R410A Eco Refrigerant recharge and evaporator coil high-pressure cleaning",
            items: [
              { name: "Dual unit deep chemical servicing", quantity: 1, unitPrice: 3500 },
              { name: "Eco gas cylinder pressure top-up", quantity: 1, unitPrice: 2000 },
            ],
            subtotal: 5500,
            platformFee: 500,
            total: 6000,
            status: "paid",
          },
        },
      ]);
    };

    fetchPayments();
  }, [token, userRole]);

  const filtered = transactions.filter((t) => {
    if (filter === "completed") return t.status === "completed";
    if (filter === "pending") return t.status === "pending";
    return true;
  });

  const totalAmount = transactions
    .filter((t) => t.status === "completed")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Ledger Summary Card */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {userRole === "customer" ? "Total Expenditure" : "Earned Volume"}
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                LKR {totalAmount.toLocaleString()}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
              <ShieldCheck size={14} />
              <span>Escrow Protected</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex rounded-xl bg-slate-200/70 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              filter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
          >
            All Ledger
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              filter === "completed" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600"
            }`}
          >
            Completed
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              filter === "pending" ? "bg-white text-amber-700 shadow-sm" : "text-slate-600"
            }`}
          >
            Pending
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          {filtered.length} {filtered.length === 1 ? "record" : "records"}
        </span>
      </div>

      {/* Transactions List */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 size={28} className="animate-spin text-blue-600" />
          <p className="text-xs">Loading payment transactions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-2">
          <FileText size={24} className="mx-auto text-slate-400" />
          <p className="text-sm font-bold text-slate-800">No Transactions Found</p>
          <p className="text-xs text-slate-500">
            Payment records will appear here as services are accepted and processed.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    t.type === "payment"
                      ? "bg-slate-100 text-slate-700"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {t.type === "payment" ? (
                    <ArrowUpRight size={18} />
                  ) : (
                    <ArrowDownLeft size={18} />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {t.title}
                    </h4>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {t.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    With {t.counterpartyName} &bull; {t.paymentMethod}
                  </p>

                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {t.date} &bull; {t.transactionId}
                  </p>
                </div>
              </div>

              {/* Amount & Invoice Action */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <div className="text-left sm:text-right">
                  <p className="text-base font-black text-slate-900 font-mono">
                    LKR {t.amount.toLocaleString()}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
                      t.status === "completed"
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {t.status === "completed" ? (
                      <CheckCircle2 size={10} />
                    ) : (
                      <Clock size={10} />
                    )}
                    {t.status}
                  </span>
                </div>

                {t.invoiceData && (
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(t.invoiceData!)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white hover:border-blue-300 hover:text-blue-600 transition shadow-xs cursor-pointer"
                    title="View Tax Invoice"
                  >
                    <Eye size={13} />
                    <span className="hidden xs:inline">Invoice</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Viewer Modal */}
      {selectedInvoice && (
        <InvoiceView
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default PaymentHistory;
