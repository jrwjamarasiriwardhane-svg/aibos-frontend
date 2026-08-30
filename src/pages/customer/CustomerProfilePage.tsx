import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Mail, Phone, ShieldCheck, User, Save } from "lucide-react";
import AccountOverview from "./components/AccountOverview";

export default function CustomerProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  const [fullName, setFullName] = useState(user.fullName || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [email] = useState(user.email || "");
  const [message, setMessage] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...user, fullName, phone };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    setMessage("Profile details saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleImageChange = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    const updatedUser = { ...user, profileImage: previewUrl };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const handleImageDelete = () => {
    const updatedUser = { ...user, profileImage: "" };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/customer/dashboard")}
              className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              <ArrowLeft size={16} />
              Dashboard
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-sm font-bold text-slate-800">My Profile</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <ShieldCheck size={16} className="text-blue-600" />
            Customer Account
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Account Settings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your personal profile, contact information, and avatar.
          </p>
        </div>

        {message && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            <CheckCircle2 size={18} className="text-emerald-600" />
            {message}
          </div>
        )}

        {/* Profile Card & Avatar */}
        <AccountOverview
          user={user}
          onImageChange={handleImageChange}
          onImageDelete={handleImageDelete}
        />

        {/* Edit Form */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
          <p className="mt-1 text-sm text-slate-500">
            Update your name and primary contact details.
          </p>

          <form onSubmit={handleSave} className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-500 outline-none"
                />
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Email address is linked to your account authentication and cannot be changed here.
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
