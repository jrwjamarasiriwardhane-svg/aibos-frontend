import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock3,
  AlertCircle,
  TrendingUp,
  Plus,
  Search,
  ChevronRight,
  Star,
  MapPin,
  Phone,
  Mail,
  FileText,
  Sparkles,
  ShieldCheck,
  Layers,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  UserPlus,
  Eye,
  Trash2,
  Check,
  BarChart3,
  Wrench,
  Zap,
  Snowflake,
  Paintbrush,
  Hammer,
  Sparkle,
  HardHat,
  Download,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export interface CompanyUser {
  id?: string;
  _id?: string;
  fullName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  role?: string;
  profileImage?: string;
  businessAddress?: string;
  regNumber?: string;
  taxId?: string;
  serviceRadius?: number;
  categories?: string[];
  isVerified?: boolean;
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  status: "available" | "on_job" | "off_duty";
  skills: string[];
  rating: number;
  completedJobs: number;
  currentJobId?: string;
  avatarBg?: string;
}

export interface CompanyServiceJob {
  _id: string;
  category: string;
  description: string;
  location: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  budget?: number;
  status: "pending" | "matched" | "accepted" | "in_progress" | "completed" | "cancelled";
  urgency: "normal" | "high" | "urgent";
  preferredDate?: string;
  preferredTime?: string;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  quoteAmount?: number;
  createdAt: string;
}

export interface Quotation {
  id: string;
  jobId?: string;
  clientName: string;
  title: string;
  items: { description: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
  status: "draft" | "sent" | "accepted" | "rejected";
  validUntil: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "job" | "team" | "quote" | "system";
  isRead: boolean;
}

// ============================================================================
// INITIAL DATA
// ============================================================================

const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: "tech-1",
    name: "Kasun Silva",
    role: "Senior HVAC Specialist",
    phone: "+94 77 123 4567",
    email: "kasun.s@company.lk",
    status: "available",
    skills: ["AC Repair", "HVAC Maintenance"],
    rating: 4.9,
    completedJobs: 18,
    avatarBg: "bg-blue-600",
  },
  {
    id: "tech-2",
    name: "Dilshan Perera",
    role: "Master Electrician",
    phone: "+94 71 987 6543",
    email: "dilshan.p@company.lk",
    status: "available",
    skills: ["Wiring", "Switchboards"],
    rating: 4.8,
    completedJobs: 14,
    avatarBg: "bg-amber-600",
  },
];

const INITIAL_JOBS: CompanyServiceJob[] = [];

const INITIAL_QUOTES: Quotation[] = [];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-1",
    title: "Company Workspace Active",
    message: "Your enterprise dispatch workspace is ready. Incoming service requests will appear here.",
    time: "Just now",
    type: "system",
    isRead: false,
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CompanyDashBoard() {
  const navigate = useNavigate();

  // Navigation / Tabs
  const [activeTab, setActiveTab] = useState<
    "overview" | "requests" | "team" | "quotations" | "analytics" | "settings"
  >("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<"available" | "busy" | "offline">("available");

  // User / Company Profile State
  const [user, setUser] = useState<CompanyUser>(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          companyName: parsed.companyName || parsed.fullName || "Apex Engineering & Facility Solutions",
          email: parsed.email || "enterprise@apexsolutions.lk",
          phone: parsed.phone || "+94 11 234 5678",
          businessAddress: parsed.businessAddress || "Level 14, Orion City IT Park, Colombo 09",
          regNumber: parsed.regNumber || "PV-109283-LK",
          taxId: parsed.taxId || "TIN-99482710",
          serviceRadius: parsed.serviceRadius || 45,
          categories: parsed.categories || ["Electrician", "AC Repair", "Plumber", "Carpentry", "Cleaning", "Painter"],
          isVerified: true,
        };
      }
    } catch {
      // ignore
    }
    return {
      fullName: "Apex Solutions Admin",
      companyName: "Apex Engineering & Facility Solutions",
      email: "enterprise@apexsolutions.lk",
      phone: "+94 11 234 5678",
      role: "company",
      businessAddress: "Level 14, Orion City IT Park, Colombo 09",
      regNumber: "PV-109283-LK",
      taxId: "TIN-99482710",
      serviceRadius: 45,
      categories: ["Electrician", "AC Repair", "Plumber", "Carpentry", "Cleaning", "Painter"],
      isVerified: true,
    };
  });

  // Data Collections (with LocalStorage Sync)
  const [jobs, setJobs] = useState<CompanyServiceJob[]>(() => {
    try {
      const saved = localStorage.getItem("company_jobs");
      return saved ? JSON.parse(saved) : INITIAL_JOBS;
    } catch {
      return INITIAL_JOBS;
    }
  });

  const [technicians, setTechnicians] = useState<Technician[]>(() => {
    try {
      const saved = localStorage.getItem("company_technicians");
      return saved ? JSON.parse(saved) : INITIAL_TECHNICIANS;
    } catch {
      return INITIAL_TECHNICIANS;
    }
  });

  const [quotes, setQuotes] = useState<Quotation[]>(() => {
    try {
      const saved = localStorage.getItem("company_quotes");
      return saved ? JSON.parse(saved) : INITIAL_QUOTES;
    } catch {
      return INITIAL_QUOTES;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals State
  const [selectedJobForAssign, setSelectedJobForAssign] = useState<CompanyServiceJob | null>(null);
  const [selectedJobDetails, setSelectedJobDetails] = useState<CompanyServiceJob | null>(null);
  const [addTechModalOpen, setAddTechModalOpen] = useState(false);
  const [newQuoteModalOpen, setNewQuoteModalOpen] = useState(false);

  // New Tech Form State
  const [newTechData, setNewTechData] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    skills: "",
    rating: "4.8",
  });

  // New Quote Form State
  const [newQuoteData, setNewQuoteData] = useState({
    clientName: "",
    title: "",
    validUntil: "2026-09-30",
    items: [{ description: "Initial On-Site Diagnostics & Service", quantity: 1, unitPrice: 15000 }],
  });

  // Settings Edit State
  const [settingsForm, setSettingsForm] = useState({
    companyName: user.companyName || "",
    email: user.email || "",
    phone: user.phone || "",
    businessAddress: user.businessAddress || "",
    regNumber: user.regNumber || "",
    taxId: user.taxId || "",
    serviceRadius: user.serviceRadius || 45,
  });

  // Sync with Backend safely without sending malformed requests
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchRealCompanyJobs = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/service-requests/available`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data && Array.isArray(data.requests) && data.requests.length > 0) {
            const formattedJobs: CompanyServiceJob[] = data.requests.map((r: any) => ({
              _id: r._id,
              category: r.category || "General",
              description: r.description || "",
              location: r.location || "Local area",
              customerName: (typeof r.customer === "object" && r.customer?.fullName) || "Customer",
              customerPhone: (typeof r.customer === "object" && r.customer?.phone) || "",
              customerEmail: (typeof r.customer === "object" && r.customer?.email) || "",
              budget: r.budget || 0,
              status: r.status || "pending",
              urgency: "normal",
              preferredDate: r.preferredDate || "",
              preferredTime: r.preferredTime || "",
              createdAt: r.createdAt || new Date().toISOString(),
            }));
            setJobs(formattedJobs);
          }
        }
      } catch (err) {
        console.warn("Notice: Backend company jobs sync:", err);
      }
    };

    fetchRealCompanyJobs();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("company_jobs", JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem("company_technicians", JSON.stringify(technicians));
  }, [technicians]);

  useEffect(() => {
    localStorage.setItem("company_quotes", JSON.stringify(quotes));
  }, [quotes]);

  // Trigger Toast Notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/company/login");
  };

  // ============================================================================
  // BUSINESS LOGIC HANDLERS
  // ============================================================================

  // Assign Technician to Job
  const handleAssignTechnician = (jobId: string, technicianId: string) => {
    const tech = technicians.find((t) => t.id === technicianId);
    if (!tech) return;

    setJobs((prev) =>
      prev.map((job) => {
        if (job._id === jobId) {
          return {
            ...job,
            status: "in_progress",
            assignedTechnicianId: tech.id,
            assignedTechnicianName: tech.name,
          };
        }
        return job;
      })
    );

    setTechnicians((prev) =>
      prev.map((t) => {
        if (t.id === technicianId) {
          return { ...t, status: "on_job", currentJobId: jobId };
        }
        return t;
      })
    );

    setSelectedJobForAssign(null);
    showToast(`Assigned ${tech.name} to job successfully!`);
  };

  // Update Job Status
  const handleUpdateJobStatus = (jobId: string, newStatus: CompanyServiceJob["status"]) => {
    setJobs((prev) =>
      prev.map((job) => {
        if (job._id === jobId) {
          return { ...job, status: newStatus };
        }
        return job;
      })
    );

    // If marked completed, free up the technician
    if (newStatus === "completed") {
      const job = jobs.find((j) => j._id === jobId);
      if (job?.assignedTechnicianId) {
        setTechnicians((prev) =>
          prev.map((t) => {
            if (t.id === job.assignedTechnicianId) {
              return { ...t, status: "available", completedJobs: t.completedJobs + 1, currentJobId: undefined };
            }
            return t;
          })
        );
      }
    }

    showToast(`Job status updated to ${newStatus.replace("_", " ").toUpperCase()}`);
  };

  // Add New Technician
  const handleAddTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechData.name || !newTechData.role || !newTechData.phone) {
      alert("Please fill in required fields");
      return;
    }

    const colors = ["bg-blue-600", "bg-emerald-600", "bg-purple-600", "bg-amber-600", "bg-indigo-600", "bg-teal-600"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newTech: Technician = {
      id: `tech-${Date.now()}`,
      name: newTechData.name,
      role: newTechData.role,
      phone: newTechData.phone,
      email: newTechData.email || `${newTechData.name.toLowerCase().replace(/\s+/g, ".")}@aibos.lk`,
      status: "available",
      skills: newTechData.skills ? newTechData.skills.split(",").map((s) => s.trim()) : ["General Technician"],
      rating: parseFloat(newTechData.rating) || 4.8,
      completedJobs: 0,
      avatarBg: randomColor,
    };

    setTechnicians((prev) => [newTech, ...prev]);
    setAddTechModalOpen(false);
    setNewTechData({ name: "", role: "", phone: "", email: "", skills: "", rating: "4.8" });
    showToast(`Technician ${newTech.name} added to team!`);
  };

  // Remove Technician
  const handleRemoveTechnician = (techId: string) => {
    if (window.confirm("Are you sure you want to remove this technician from the company roster?")) {
      setTechnicians((prev) => prev.filter((t) => t.id !== techId));
      showToast("Technician removed from team.");
    }
  };

  // Create Quotation
  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteData.clientName || !newQuoteData.title || newQuoteData.items.length === 0) {
      alert("Please provide client name, title and items");
      return;
    }

    const total = newQuoteData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    const newQuote: Quotation = {
      id: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: newQuoteData.clientName,
      title: newQuoteData.title,
      items: newQuoteData.items,
      totalAmount: total,
      status: "sent",
      validUntil: newQuoteData.validUntil,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setQuotes((prev) => [newQuote, ...prev]);
    setNewQuoteModalOpen(false);
    setNewQuoteData({
      clientName: "",
      title: "",
      validUntil: "2026-09-30",
      items: [{ description: "Initial On-Site Diagnostics & Service", quantity: 1, unitPrice: 15000 }],
    });
    showToast(`Quotation ${newQuote.id} created & sent to ${newQuote.clientName}!`);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...user,
      companyName: settingsForm.companyName,
      email: settingsForm.email,
      phone: settingsForm.phone,
      businessAddress: settingsForm.businessAddress,
      regNumber: settingsForm.regNumber,
      taxId: settingsForm.taxId,
      serviceRadius: Number(settingsForm.serviceRadius),
    };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    showToast("Company profile & operational parameters saved successfully!");
  };

  // ============================================================================
  // CALCULATED METRICS
  // ============================================================================

  const totalRevenue = useMemo(() => {
    return quotes
      .filter((q) => q.status === "accepted")
      .reduce((acc, q) => acc + q.totalAmount, 0) + 145000;
  }, [quotes]);

  const activeJobsCount = useMemo(() => {
    return jobs.filter((j) => j.status === "in_progress" || j.status === "pending" || j.status === "accepted").length;
  }, [jobs]);

  const pendingRequestsCount = useMemo(() => {
    return jobs.filter((j) => j.status === "pending").length;
  }, [jobs]);

  const availableTechsCount = useMemo(() => {
    return technicians.filter((t) => t.status === "available").length;
  }, [technicians]);

  // Filtered Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" ? true : job.status === statusFilter;
      const matchesCategory = categoryFilter === "all" ? true : job.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [jobs, searchQuery, statusFilter, categoryFilter]);

  // Helper icon by category
  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "ac repair":
        return <Snowflake size={16} className="text-cyan-500" />;
      case "electrician":
        return <Zap size={16} className="text-amber-500" />;
      case "plumber":
        return <Wrench size={16} className="text-blue-500" />;
      case "carpentry":
      case "carpenter":
        return <Hammer size={16} className="text-rose-500" />;
      case "painter":
        return <Paintbrush size={16} className="text-purple-500" />;
      case "cleaning":
        return <Sparkle size={16} className="text-emerald-500" />;
      default:
        return <HardHat size={16} className="text-indigo-500" />;
    }
  };

  const getStatusBadge = (status: CompanyServiceJob["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending Dispatch
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            In Progress
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Accepted / Scheduled
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 size={13} className="text-emerald-600" />
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200/60">
            <AlertCircle size={13} className="text-rose-600" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* =========================================================================
          TOAST NOTIFICATION
      ========================================================================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-white shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <Check size={18} />
          </div>
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* =========================================================================
          SIDEBAR (DESKTOP & MOBILE DRAWER)
      ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Building2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">AIBOS</span>
                <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-xs font-medium text-slate-400">Company Portal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* COMPANY BADGE INFO */}
        <div className="mx-4 my-4 rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <p className="truncate text-xs font-bold text-slate-900">{user.companyName}</p>
                <ShieldCheck size={14} className="text-blue-600 shrink-0" />
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px]">
            <span className="text-slate-500">Dispatch Status:</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Online & Ready
            </span>
          </div>
        </div>

        {/* SIDEBAR NAVIGATION ITEMS */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab("overview");
              setMobileMenuOpen(false);
            }}
            className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
              activeTab === "overview"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers size={19} className={activeTab === "overview" ? "text-white" : "text-slate-400 group-hover:text-blue-600"} />
              <span>Overview</span>
            </div>
            <Sparkles size={15} className={activeTab === "overview" ? "text-blue-200" : "text-slate-400"} />
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("requests");
              setMobileMenuOpen(false);
            }}
            className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
              activeTab === "requests"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <Briefcase size={19} className={activeTab === "requests" ? "text-white" : "text-slate-400 group-hover:text-blue-600"} />
              <span>Client Requests & Jobs</span>
            </div>
            {pendingRequestsCount > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  activeTab === "requests" ? "bg-white text-blue-700" : "bg-amber-100 text-amber-800"
                }`}
              >
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("team");
              setMobileMenuOpen(false);
            }}
            className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
              activeTab === "team"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <Users size={19} className={activeTab === "team" ? "text-white" : "text-slate-400 group-hover:text-blue-600"} />
              <span>Team & Technicians</span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                activeTab === "team" ? "bg-white text-blue-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              {technicians.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("quotations");
              setMobileMenuOpen(false);
            }}
            className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
              activeTab === "quotations"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText size={19} className={activeTab === "quotations" ? "text-white" : "text-slate-400 group-hover:text-blue-600"} />
              <span>Quotations & Invoices</span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                activeTab === "quotations" ? "bg-white text-blue-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              {quotes.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("analytics");
              setMobileMenuOpen(false);
            }}
            className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
              activeTab === "analytics"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <BarChart3 size={19} className={activeTab === "analytics" ? "text-white" : "text-slate-400 group-hover:text-blue-600"} />
              <span>Analytics & Reports</span>
            </div>
            <TrendingUp size={15} className={activeTab === "analytics" ? "text-blue-200" : "text-slate-400"} />
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("settings");
              setMobileMenuOpen(false);
            }}
            className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
              activeTab === "settings"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings size={19} className={activeTab === "settings" ? "text-white" : "text-slate-400 group-hover:text-blue-600"} />
              <span>Company Profile</span>
            </div>
            <ShieldCheck size={15} className={activeTab === "settings" ? "text-blue-200" : "text-emerald-500"} />
          </button>
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-sm">
                {user.companyName?.charAt(0) || "C"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900">{user.companyName}</p>
                <p className="truncate text-[11px] text-slate-500">Enterprise Verified</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE BACKDROP */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* =========================================================================
          MAIN CONTENT AREA
      ========================================================================= */}
      <div className="lg:pl-72 flex min-h-screen flex-col">
        {/* =========================================================================
            TOP HEADER
        ========================================================================= */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-md">
          {/* LEFT: MOBILE TOGGLE & SEARCH */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="relative hidden md:block w-80 lg:w-96">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs, customers, technicians..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
              />
            </div>
          </div>

          {/* RIGHT: AVAILABILITY TOGGLE, NOTIFICATIONS & QUICK ACTIONS */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Real-time Status Switcher */}
            <div className="hidden sm:flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => {
                  setAvailabilityStatus("available");
                  showToast("Status updated: Accepting all incoming jobs");
                }}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  availabilityStatus === "available"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Available
              </button>
              <button
                type="button"
                onClick={() => {
                  setAvailabilityStatus("busy");
                  showToast("Status updated: At High Capacity");
                }}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  availabilityStatus === "busy"
                    ? "bg-white text-amber-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                High Load
              </button>
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              >
                <Bell size={18} />
                {notifications.some((n) => !n.isRead) && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </button>

              {/* Notification Popup */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Bell size={16} className="text-blue-600" />
                      <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                        showToast("Marked all as read");
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="mt-3 max-h-80 space-y-2.5 overflow-y-auto">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-xl p-3 text-left transition ${
                          item.isRead ? "bg-slate-50/70" : "bg-blue-50/60 border border-blue-100"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-xs font-bold text-slate-900">{item.title}</p>
                          <span className="text-[10px] text-slate-400">{item.time}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Create Quote Quick Action */}
            <button
              type="button"
              onClick={() => setNewQuoteModalOpen(true)}
              className="hidden sm:flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
            >
              <Plus size={15} />
              <span>Create Quote</span>
            </button>
          </div>
        </header>

        {/* =========================================================================
            TAB CONTENT VIEWS
        ========================================================================= */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {/* =====================================================================
              1. OVERVIEW TAB
          ===================================================================== */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* HERO BANNER */}
              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-8 sm:p-10 text-white shadow-xl">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="absolute -bottom-20 right-40 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="relative z-10 max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1.5 backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                      ENTERPRISE DISPATCH ENGINE · ACTIVE
                    </span>
                  </div>

                  <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Welcome, {user.companyName} 👋
                  </h1>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base max-w-2xl">
                    Manage real-time customer service bookings, field technician dispatching, smart quotations, and performance metrics across your enterprise territory.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab("requests")}
                      className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-blue-700 shadow-lg hover:bg-slate-100 transition"
                    >
                      <Briefcase size={16} />
                      <span>Manage Client Requests ({pendingRequestsCount} Pending)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewQuoteModalOpen(true)}
                      className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-semibold text-white backdrop-blur hover:bg-white/20 transition"
                    >
                      <Plus size={16} />
                      <span>Send New Quotation</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddTechModalOpen(true)}
                      className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-semibold text-white backdrop-blur hover:bg-white/20 transition"
                    >
                      <UserPlus size={16} />
                      <span>Add Technician</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* STATS METRIC CARDS */}
              <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue YTD</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <DollarSign size={20} />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-black text-slate-900">
                    LKR {(totalRevenue).toLocaleString()}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                    <TrendingUp size={14} />
                    <span>+18.4% compared to last month</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Service Jobs</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Briefcase size={20} />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-black text-slate-900">{activeJobsCount}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span className="font-bold text-amber-600">{pendingRequestsCount} new</span> awaiting assignment
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Technicians</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Users size={20} />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-black text-slate-900">
                    {availableTechsCount} <span className="text-lg font-medium text-slate-400">/ {technicians.length}</span>
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-indigo-600">
                    <span>{technicians.filter((t) => t.status === "on_job").length} currently deployed on-site</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Rating</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Star size={20} className="fill-amber-500 text-amber-500" />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-black text-slate-900">
                    4.92 <span className="text-lg font-medium text-slate-400">/ 5.0</span>
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>98.6% On-time completion rate</span>
                  </div>
                </div>
              </section>

              {/* AIBOS SMART AI INSIGHTS CARD */}
              <section className="rounded-3xl border border-blue-200/70 bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-white p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">AIBOS AI Smart Dispatch Insights</h3>
                        <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-white tracking-wider">
                          AI OPTIMIZER
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-slate-600 leading-relaxed max-w-3xl">
                        Based on current booking traffic in Colombo & Gampaha, commercial HVAC and 3-phase electrical demands are up 35%. Technician <span className="font-semibold text-slate-900">Dilshan Perera</span> is available within 4.2 km of the pending Emerald Logistics job.
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const pendingJob = jobs.find((j) => j.status === "pending");
                        if (pendingJob) {
                          setSelectedJobForAssign(pendingJob);
                        } else {
                          showToast("No pending jobs requiring assignment right now!");
                        }
                      }}
                      className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/10 hover:bg-blue-700 transition"
                    >
                      Auto-Match & Assign
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("analytics")}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      View Trends →
                    </button>
                  </div>
                </div>
              </section>

              {/* TWO-COLUMN SPLIT: RECENT SERVICE REQUESTS & TEAM AVAILABILITY */}
              <div className="grid gap-8 lg:grid-cols-3">
                {/* LEFT: PRIORITY JOBS QUEUE (2 COLUMNS) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Live Client Requests Queue</h3>
                      <p className="text-xs text-slate-500">Real-time service orders dispatched to your company</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("requests")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <span>View All ({jobs.length})</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {jobs.slice(0, 4).map((job) => (
                      <div
                        key={job._id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3.5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                              {getCategoryIcon(job.category)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-bold text-slate-900">{job.customerName}</h4>
                                <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                                  {job.category}
                                </span>
                                {getStatusBadge(job.status)}
                              </div>
                              <p className="mt-1 text-xs text-slate-600 line-clamp-1">{job.description}</p>
                              <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} className="text-slate-400" />
                                  {job.location}
                                </span>
                                {job.budget && (
                                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                                    <DollarSign size={12} className="text-emerald-600" />
                                    Budget: LKR {job.budget.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* ACTION BUTTON */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 gap-2 shrink-0">
                            {job.assignedTechnicianName ? (
                              <div className="text-right">
                                <p className="text-[11px] text-slate-400">Assigned To:</p>
                                <p className="text-xs font-bold text-blue-600">{job.assignedTechnicianName}</p>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setSelectedJobForAssign(job)}
                                className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
                              >
                                Assign Tech
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setSelectedJobDetails(job)}
                              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                            >
                              Details →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: ACTIVE TEAM STATUS (1 COLUMN) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Field Technicians</h3>
                      <p className="text-xs text-slate-500">Availability & deployment roster</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("team")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      Manage
                    </button>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                    {technicians.slice(0, 5).map((tech) => (
                      <div key={tech.id} className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-xs ${
                              tech.avatarBg || "bg-blue-600"
                            }`}
                          >
                            {tech.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{tech.name}</p>
                            <p className="text-[11px] text-slate-500">{tech.role}</p>
                          </div>
                        </div>

                        <div>
                          {tech.status === "available" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Free
                            </span>
                          )}
                          {tech.status === "on_job" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                              On Job
                            </span>
                          )}
                          {tech.status === "off_duty" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              Off Duty
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => setAddTechModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-2.5 text-xs font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600 transition"
                    >
                      <Plus size={14} />
                      <span>Add New Team Member</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              2. CLIENT REQUESTS & DISPATCH TAB
          ===================================================================== */}
          {activeTab === "requests" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Client Service Requests & Jobs</h2>
                  <p className="text-sm text-slate-500">
                    Track, quote, assign and complete enterprise service requests dispatched to your company
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewQuoteModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition self-start sm:self-auto"
                >
                  <Plus size={16} />
                  <span>Send Direct Quotation</span>
                </button>
              </div>

              {/* SEARCH & FILTERS TOOLBAR */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="relative w-full lg:w-96">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by client, location, description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                  {/* Category Filter */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="ac repair">AC Repair / HVAC</option>
                    <option value="electrician">Electrical</option>
                    <option value="plumber">Plumbing</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="painter">Painting</option>
                  </select>

                  {/* Status Filter Buttons */}
                  <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                    {["all", "pending", "in_progress", "completed"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatusFilter(st)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${
                          statusFilter === st ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {st === "in_progress" ? "In Progress" : st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* REQUESTS LIST */}
              {filteredJobs.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                  <Briefcase size={40} className="mx-auto text-slate-300" />
                  <h3 className="mt-4 text-base font-bold text-slate-900">No service requests found</h3>
                  <p className="mt-1 text-xs text-slate-500">Try adjusting your filters or search keywords.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredJobs.map((job) => (
                    <div
                      key={job._id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* LEFT DETAILS */}
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                            {getCategoryIcon(job.category)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-bold text-slate-900">{job.customerName}</h3>
                              <span className="rounded-lg bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                                {job.category}
                              </span>
                              {getStatusBadge(job.status)}
                              {job.urgency === "urgent" && (
                                <span className="rounded-lg bg-rose-50 px-2 py-0.5 text-[10px] font-extrabold uppercase text-rose-700 tracking-wider">
                                  Urgent Priority
                                </span>
                              )}
                            </div>

                            <p className="mt-2 text-xs text-slate-600 leading-relaxed max-w-2xl">{job.description}</p>

                            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <MapPin size={13} className="text-slate-400" />
                                {job.location}
                              </span>
                              {job.preferredDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar size={13} className="text-slate-400" />
                                  {job.preferredDate} {job.preferredTime && `at ${job.preferredTime}`}
                                </span>
                              )}
                              {job.budget && (
                                <span className="flex items-center gap-1 font-bold text-slate-900">
                                  <DollarSign size={13} className="text-emerald-600" />
                                  Client Budget: LKR {job.budget.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* RIGHT ACTIONS & ASSIGNMENT */}
                        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 gap-3 shrink-0">
                          {job.assignedTechnicianName ? (
                            <div className="text-left lg:text-right">
                              <span className="text-[11px] text-slate-400">Field Specialist:</span>
                              <p className="text-xs font-bold text-slate-900">{job.assignedTechnicianName}</p>
                              <button
                                type="button"
                                onClick={() => setSelectedJobForAssign(job)}
                                className="mt-0.5 text-[11px] font-semibold text-blue-600 hover:underline"
                              >
                                Change Tech
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedJobForAssign(job)}
                              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
                            >
                              Assign Technician
                            </button>
                          )}

                          <div className="flex items-center gap-2">
                            {/* Status Changer Dropdown */}
                            <select
                              value={job.status}
                              onChange={(e) => handleUpdateJobStatus(job._id, e.target.value as any)}
                              className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="accepted">Accepted</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => setSelectedJobDetails(job)}
                              className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                            >
                              <Eye size={13} />
                              <span>Details</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              3. TEAM & TECHNICIANS TAB
          ===================================================================== */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Workforce & Field Technicians</h2>
                  <p className="text-sm text-slate-500">
                    Manage your company's certified professionals, job statuses and skill deployments
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAddTechModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition self-start sm:self-auto"
                >
                  <UserPlus size={16} />
                  <span>Add New Technician</span>
                </button>
              </div>

              {/* TECHNICIANS GRID */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {technicians.map((tech) => (
                  <div
                    key={tech.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white font-bold text-sm shadow-sm ${
                            tech.avatarBg || "bg-blue-600"
                          }`}
                        >
                          {tech.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{tech.name}</h3>
                          <p className="text-xs text-slate-500">{tech.role}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveTechnician(tech.id)}
                        className="text-slate-400 hover:text-rose-600 transition"
                        title="Remove Technician"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* STATUS BADGE */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-xs text-slate-400">Current Status:</span>
                      {tech.status === "available" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          Ready for Dispatch
                        </span>
                      )}
                      {tech.status === "on_job" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                          Deployed On-Site
                        </span>
                      )}
                      {tech.status === "off_duty" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                          Off Duty
                        </span>
                      )}
                    </div>

                    {/* SKILLS */}
                    <div className="mt-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Certified Skills</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {tech.skills.map((skill) => (
                          <span key={skill} className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CONTACT & STATS */}
                    <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Phone size={12} />
                          {tech.phone}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-amber-600">
                          <Star size={12} className="fill-amber-500 text-amber-500" />
                          {tech.rating}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Mail size={12} />
                          {tech.email}
                        </span>
                        <span className="font-semibold text-slate-700">{tech.completedJobs} Jobs</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              4. QUOTATIONS & INVOICES TAB
          ===================================================================== */}
          {activeTab === "quotations" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Commercial Quotations & Proposals</h2>
                  <p className="text-sm text-slate-500">
                    Generate professional estimates, track approval stages, and collect enterprise payments
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewQuoteModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition self-start sm:self-auto"
                >
                  <Plus size={16} />
                  <span>Create Quotation</span>
                </button>
              </div>

              {/* QUOTATION SUMMARY CARDS */}
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Sent Quotes</span>
                  <p className="mt-2 text-2xl font-black text-slate-900">{quotes.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Accepted Proposals</span>
                  <p className="mt-2 text-2xl font-black text-emerald-600">
                    {quotes.filter((q) => q.status === "accepted").length}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quoted Value Pipeline</span>
                  <p className="mt-2 text-2xl font-black text-blue-600">
                    LKR {quotes.reduce((sum, q) => sum + q.totalAmount, 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* QUOTATIONS TABLE */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-4">Quote ID</th>
                        <th className="px-6 py-4">Client Name & Project</th>
                        <th className="px-6 py-4">Total Amount</th>
                        <th className="px-6 py-4">Valid Until</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {quotes.map((quote) => (
                        <tr key={quote.id} className="hover:bg-slate-50/70 transition">
                          <td className="px-6 py-4 font-mono font-bold text-blue-600">{quote.id}</td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{quote.clientName}</p>
                            <p className="text-[11px] text-slate-500">{quote.title}</p>
                          </td>
                          <td className="px-6 py-4 font-black text-slate-900">
                            LKR {quote.totalAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-slate-600">{quote.validUntil}</td>
                          <td className="px-6 py-4">
                            {quote.status === "accepted" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                                <CheckCircle2 size={12} />
                                Accepted
                              </span>
                            )}
                            {quote.status === "sent" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                                <Clock3 size={12} />
                                Sent / Reviewing
                              </span>
                            )}
                            {quote.status === "draft" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                                Draft
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => showToast(`Quotation ${quote.id} PDF downloaded successfully!`)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-100 transition"
                            >
                              <Download size={12} />
                              <span>PDF</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              5. ANALYTICS & REPORTS TAB
          ===================================================================== */}
          {activeTab === "analytics" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Financials & Performance Analytics</h2>
                <p className="text-sm text-slate-500">
                  Comprehensive insights into revenue trajectories, service category distribution and client retention
                </p>
              </div>

              {/* GRAPHS & METRIC BREAKDOWN */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* CATEGORY DISTRIBUTION */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Revenue by Service Category</h3>
                      <p className="text-xs text-slate-500">Highest grossing enterprise service sectors</p>
                    </div>
                    <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      +24% Growth
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {[
                      { name: "AC Repair & Industrial HVAC", percent: 42, color: "bg-cyan-500", amount: "LKR 84,000" },
                      { name: "3-Phase Commercial Electrical", percent: 28, color: "bg-amber-500", amount: "LKR 56,000" },
                      { name: "Commercial Plumbing & Drainage", percent: 18, color: "bg-blue-500", amount: "LKR 36,000" },
                      { name: "Corporate Carpentry & Finishing", percent: 12, color: "bg-rose-500", amount: "LKR 24,000" },
                    ].map((item) => (
                      <div key={item.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-800">{item.name}</span>
                          <span className="text-slate-600">
                            {item.amount} ({item.percent}%)
                          </span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.color} transition-all duration-500`}
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* OPERATIONAL BENCHMARKS */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                  <h3 className="text-base font-bold text-slate-900">Operational KPIs</h3>

                  <div className="space-y-4">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500 font-semibold uppercase">Avg Response Time</p>
                      <p className="mt-1 text-xl font-black text-slate-900">18 Minutes</p>
                      <p className="mt-0.5 text-[11px] text-emerald-600 font-medium">Faster than 94% of providers</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500 font-semibold uppercase">First-Time Fix Rate</p>
                      <p className="mt-1 text-xl font-black text-slate-900">96.4%</p>
                      <p className="mt-0.5 text-[11px] text-blue-600 font-medium">High customer retention</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500 font-semibold uppercase">Repeat Enterprise Clients</p>
                      <p className="mt-1 text-xl font-black text-slate-900">82%</p>
                      <p className="mt-0.5 text-[11px] text-indigo-600 font-medium">18 Active contract partners</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              6. COMPANY PROFILE & SETTINGS TAB
          ===================================================================== */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Company Profile & Operations Settings</h2>
                <p className="text-sm text-slate-500">
                  Manage your business registration, licensed capabilities, service radius and public verified credentials
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-3">
                {/* SETTINGS FORM */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                  <form onSubmit={handleSaveSettings} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                        Registered Company Name
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.companyName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                          Corporate Email
                        </label>
                        <input
                          type="email"
                          required
                          value={settingsForm.email}
                          onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                          Hotline / Support Phone
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.phone}
                          onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                        Corporate Headquarters Address
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.businessAddress}
                        onChange={(e) => setSettingsForm({ ...settingsForm, businessAddress: e.target.value })}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                          Business Reg No
                        </label>
                        <input
                          type="text"
                          value={settingsForm.regNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, regNumber: e.target.value })}
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                          Tax ID / TIN
                        </label>
                        <input
                          type="text"
                          value={settingsForm.taxId}
                          onChange={(e) => setSettingsForm({ ...settingsForm, taxId: e.target.value })}
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                          Service Radius (Km)
                        </label>
                        <input
                          type="number"
                          value={settingsForm.serviceRadius}
                          onChange={(e) => setSettingsForm({ ...settingsForm, serviceRadius: Number(e.target.value) })}
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <button
                        type="submit"
                        className="rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
                      >
                        Save Company Profile
                      </button>
                    </div>
                  </form>
                </div>

                {/* VERIFICATION & BADGE STATUS */}
                <div className="space-y-5">
                  <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">Verified Enterprise Provider</h4>
                        <p className="text-xs text-blue-700">AIBOS Tier-1 Partner</p>
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-slate-600 leading-relaxed">
                      Your business identity, trade insurance, and professional certifications have been verified by the AIBOS Compliance Board.
                    </p>

                    <div className="mt-4 space-y-2 text-xs font-semibold text-slate-700">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <CheckCircle2 size={14} />
                        <span>Corporate Tax Certificate Valid</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700">
                        <CheckCircle2 size={14} />
                        <span>Workforce Background Checks Cleared</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700">
                        <CheckCircle2 size={14} />
                        <span>Direct Customer Escrow Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          MODAL: ASSIGN TECHNICIAN
      ========================================================================= */}
      {selectedJobForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Assign Technician to Job</h3>
                <p className="text-xs text-slate-500">
                  {selectedJobForAssign.customerName} · {selectedJobForAssign.category}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJobForAssign(null)}
                className="rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-xs text-slate-600 mb-3">{selectedJobForAssign.description}</p>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Available Technicians</h4>

              <div className="max-h-64 space-y-2 overflow-y-auto">
                {technicians.map((tech) => (
                  <div
                    key={tech.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:border-blue-500 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-white font-bold text-xs ${
                          tech.avatarBg || "bg-blue-600"
                        }`}
                      >
                        {tech.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{tech.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {tech.role} · <span className="font-semibold text-amber-600">★ {tech.rating}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAssignTechnician(selectedJobForAssign._id, tech.id)}
                      className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                    >
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW TECHNICIAN
      ========================================================================= */}
      {addTechModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add Field Technician</h3>
                <p className="text-xs text-slate-500">Add a staff member or specialist to your company roster</p>
              </div>
              <button
                type="button"
                onClick={() => setAddTechModalOpen(false)}
                className="rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddTechnician} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ruwan Jayawardena"
                  value={newTechData.name}
                  onChange={(e) => setNewTechData({ ...newTechData, name: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Job Title / Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Electrician"
                    value={newTechData.role}
                    onChange={(e) => setNewTechData({ ...newTechData, role: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+94 77 000 0000"
                    value={newTechData.phone}
                    onChange={(e) => setNewTechData({ ...newTechData, phone: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="technician@company.lk"
                  value={newTechData.email}
                  onChange={(e) => setNewTechData({ ...newTechData, email: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Wiring, DB Board, Inverters"
                  value={newTechData.skills}
                  onChange={(e) => setNewTechData({ ...newTechData, skills: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddTechModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700"
                >
                  Add Technician
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CREATE QUOTATION
      ========================================================================= */}
      {newQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create Commercial Quotation</h3>
                <p className="text-xs text-slate-500">Send an official estimate to client with breakdown</p>
              </div>
              <button
                type="button"
                onClick={() => setNewQuoteModalOpen(false)}
                className="rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Client / Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vertex Media Towers"
                  value={newQuoteData.clientName}
                  onChange={(e) => setNewQuoteData({ ...newQuoteData, clientName: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Project / Quotation Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commercial HVAC Inspection & Refill"
                  value={newQuoteData.title}
                  onChange={(e) => setNewQuoteData({ ...newQuoteData, title: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* LINE ITEMS */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Itemized Cost Breakdown</label>
                  <button
                    type="button"
                    onClick={() =>
                      setNewQuoteData({
                        ...newQuoteData,
                        items: [...newQuoteData.items, { description: "Additional Labor & Materials", quantity: 1, unitPrice: 5000 }],
                      })
                    }
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {newQuoteData.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...newQuoteData.items];
                          updated[idx].description = e.target.value;
                          setNewQuoteData({ ...newQuoteData, items: updated });
                        }}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900"
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => {
                          const updated = [...newQuoteData.items];
                          updated[idx].quantity = Number(e.target.value);
                          setNewQuoteData({ ...newQuoteData, items: updated });
                        }}
                        className="w-16 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-center text-slate-900"
                      />
                      <input
                        type="number"
                        placeholder="Unit Price"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const updated = [...newQuoteData.items];
                          updated[idx].unitPrice = Number(e.target.value);
                          setNewQuoteData({ ...newQuoteData, items: updated });
                        }}
                        className="w-24 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900"
                      />
                      {newQuoteData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = newQuoteData.items.filter((_, i) => i !== idx);
                            setNewQuoteData({ ...newQuoteData, items: updated });
                          }}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="mt-3 flex justify-between rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-900">
                  <span>Estimated Total Amount:</span>
                  <span className="text-blue-600">
                    LKR{" "}
                    {newQuoteData.items
                      .reduce((sum, it) => sum + it.quantity * it.unitPrice, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setNewQuoteModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700"
                >
                  Create & Send Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: JOB DETAILS
      ========================================================================= */}
      {selectedJobDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{selectedJobDetails.customerName}</h3>
                  {getStatusBadge(selectedJobDetails.status)}
                </div>
                <p className="text-xs text-slate-500">Category: {selectedJobDetails.category}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJobDetails(null)}
                className="rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <p className="font-bold uppercase tracking-wider text-slate-400">Description</p>
                <p className="mt-1 text-slate-700 leading-relaxed">{selectedJobDetails.description}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="font-semibold text-slate-400">Location</p>
                  <p className="font-bold text-slate-800">{selectedJobDetails.location}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-400">Customer Contact</p>
                  <p className="font-bold text-slate-800">{selectedJobDetails.customerPhone || "Not provided"}</p>
                  <p className="text-[11px] text-slate-500">{selectedJobDetails.customerEmail}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-400">Preferred Schedule</p>
                  <p className="font-bold text-slate-800">
                    {selectedJobDetails.preferredDate || "Immediate"} {selectedJobDetails.preferredTime}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-slate-400">Client Budget</p>
                  <p className="font-black text-emerald-600">
                    {selectedJobDetails.budget ? `LKR ${selectedJobDetails.budget.toLocaleString()}` : "Open for Quote"}
                  </p>
                </div>
              </div>

              {selectedJobDetails.assignedTechnicianName && (
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                  <p className="text-[11px] text-blue-600 font-semibold">Assigned Field Specialist</p>
                  <p className="text-sm font-bold text-slate-900">{selectedJobDetails.assignedTechnicianName}</p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedJobDetails(null)}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 font-bold text-white hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
