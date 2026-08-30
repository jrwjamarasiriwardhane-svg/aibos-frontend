import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Star,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface ProfessionalItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  hourlyRate: number;
  location: string;
  skills: string[];
  isVerified: boolean;
  avatarText: string;
  bio: string;
}

const SAMPLE_PROFESSIONALS: ProfessionalItem[] = [
  {
    id: "p1",
    name: "Rohan Sharma",
    category: "Electrical",
    rating: 4.9,
    reviewsCount: 142,
    experienceYears: 6,
    hourlyRate: 350,
    location: "Mumbai",
    skills: ["Wiring", "Short Circuit Repair", "Inverter Setup", "Appliance Hookup"],
    isVerified: true,
    avatarText: "RS",
    bio: "Certified residential & commercial electrician with 6+ years experience in quick turnaround diagnostics and safety rewiring.",
  },
  {
    id: "p2",
    name: "Anil Deshmukh",
    category: "AC & Cooling",
    rating: 4.8,
    reviewsCount: 98,
    experienceYears: 8,
    hourlyRate: 500,
    location: "Mumbai",
    skills: ["Gas Refill", "Compressor Servicing", "Split AC Ducting", "PCB Repair"],
    isVerified: true,
    avatarText: "AD",
    bio: "HVAC specialist focused on split/window AC installation, emergency refrigerant charging, and seasonal servicing.",
  },
  {
    id: "p3",
    name: "Prakash Verma",
    category: "Plumbing",
    rating: 4.9,
    reviewsCount: 176,
    experienceYears: 10,
    hourlyRate: 300,
    location: "Delhi",
    skills: ["Pipe Leakage", "Sanitary Fitting", "Water Tank Cleaning", "Geyser Setup"],
    isVerified: true,
    avatarText: "PV",
    bio: "Master plumber covering water line installations, blockage removal, bathroom fittings, and residential pipeline overhauls.",
  },
  {
    id: "p4",
    name: "Sanjay Mistri",
    category: "Carpentry",
    rating: 4.7,
    reviewsCount: 64,
    experienceYears: 5,
    hourlyRate: 400,
    location: "Bangalore",
    skills: ["Furniture Assembly", "Door Locks", "Modular Kitchen", "Wood Polishing"],
    isVerified: true,
    avatarText: "SM",
    bio: "Precision woodwork and modular cabinetry specialist. Expertise in modern locks, hinges, and bespoke furniture repairs.",
  },
  {
    id: "p5",
    name: "Sunil Kumar",
    category: "Painting",
    rating: 4.8,
    reviewsCount: 112,
    experienceYears: 7,
    hourlyRate: 350,
    location: "Mumbai",
    skills: ["Interior Emulsion", "Waterproofing", "Texture Painting", "Exterior Coat"],
    isVerified: true,
    avatarText: "SK",
    bio: "Eco-friendly painting and damp-proofing expert. Fast, clean and uniform finish for apartments, villas, and offices.",
  },
  {
    id: "p6",
    name: "Manoj Rathod",
    category: "Cleaning",
    rating: 4.9,
    reviewsCount: 89,
    experienceYears: 4,
    hourlyRate: 250,
    location: "Colombo",
    skills: ["Deep Sanitization", "Sofa Shampooing", "Kitchen Degreasing", "Move-in Clean"],
    isVerified: true,
    avatarText: "MR",
    bio: "Professional deep cleaning team lead using industrial grade sanitizers and fabric extractors for sparkling clean spaces.",
  },
];

const ALL_CATEGORIES = [
  "All Services",
  "Electrical",
  "AC & Cooling",
  "Plumbing",
  "Carpentry",
  "Painting",
  "Cleaning",
  "Appliance Repair",
];

export default function FindProfessionals() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryCategory = searchParams.get("category") || searchParams.get("q") || "All Services";
  const queryLocation = searchParams.get("location") || "All Locations";

  const [selectedCategory, setSelectedCategory] = useState(queryCategory);
  const [selectedLocation, setSelectedLocation] = useState(queryLocation);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  useEffect(() => {
    if (searchParams.get("category")) {
      setSelectedCategory(searchParams.get("category") || "All Services");
    }
  }, [searchParams]);

  // Filter professionals
  const filteredProfessionals = SAMPLE_PROFESSIONALS.filter((item) => {
    const matchesCategory =
      selectedCategory === "All Services" ||
      item.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(item.category.toLowerCase());

    const matchesLocation =
      selectedLocation === "All Locations" ||
      item.location.toLowerCase() === selectedLocation.toLowerCase();

    const matchesSearch =
      !searchTerm.trim() ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.bio.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesLocation && matchesSearch;
  });

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (category === "All Services") {
        params.delete("category");
      } else {
        params.set("category", category);
      }
      return params;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xl font-bold text-slate-900">
              AIBOS
            </Link>
            <span className="text-slate-300">/</span>
            <p className="text-sm font-semibold text-slate-600">
              Find Professionals
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/customer/dashboard")}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Dashboard
            </button>
            <button
              onClick={() => navigate("/request-service")}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              + Request Service
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* INTRO HERO */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-8 text-white shadow-xl sm:p-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
              <Sparkles size={14} />
              VERIFIED WORKFORCE DIRECTORY
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Discover verified professionals
            </h1>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">
              Browse top-rated professionals, inspect skills & verification badges, or let AI match you in minutes.
            </p>
          </div>

          {/* Search Controls Bar */}
          <div className="mt-8 grid gap-3 sm:grid-cols-12">
            <div className="relative sm:col-span-6">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by skill, name or keywords..."
                className="w-full rounded-2xl border border-white/10 bg-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 outline-none backdrop-blur focus:border-blue-400 focus:bg-white/20"
              />
            </div>

            <div className="relative sm:col-span-3">
              <MapPin
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-900/90 py-3 pl-10 pr-8 text-sm text-white outline-none focus:border-blue-400"
              >
                <option value="All Locations">All Locations</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Colombo">Colombo</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All Services");
                  setSelectedLocation("All Locations");
                  setSearchTerm("");
                }}
                className="w-full rounded-2xl border border-white/20 bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* CATEGORY CHIPS */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {ALL_CATEGORIES.map((cat) => {
            const active =
              selectedCategory === cat ||
              (cat === "All Services" && selectedCategory === "All Services");
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* RESULTS COUNT */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600">
            Showing <strong className="text-slate-900">{filteredProfessionals.length}</strong> verified professionals
          </p>
        </div>

        {/* PROFESSIONAL CARDS GRID */}
        {filteredProfessionals.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={26} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No matching professionals found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Try adjusting your search keywords, location or category filter to discover more professionals.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All Services");
                setSelectedLocation("All Locations");
                setSearchTerm("");
              }}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Show All Professionals
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProfessionals.map((pro) => (
              <div
                key={pro.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
              >
                <div>
                  {/* Top Row: Avatar, Name & Verification */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 font-bold text-blue-700 shadow-inner">
                        {pro.avatarText}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-slate-900">{pro.name}</h3>
                          {pro.isVerified && (
                            <span title="Verified Professional">
                              <CheckCircle2 size={16} className="text-blue-600 fill-blue-50" />
                            </span>
                          )}
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                          {pro.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      {pro.rating}
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="mt-4 text-xs leading-relaxed text-slate-600 line-clamp-3">
                    {pro.bio}
                  </p>

                  {/* Badges / Stats */}
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2.5 text-center text-xs">
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">Experience</p>
                      <p className="font-bold text-slate-800">{pro.experienceYears} Years</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">Location</p>
                      <p className="font-bold text-slate-800">📍 {pro.location}</p>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {pro.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <span className="text-[10px] font-medium text-slate-400">Rate approx.</span>
                    <p className="text-sm font-bold text-slate-900">₹{pro.hourlyRate}/hr</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/customer/request-service?category=${encodeURIComponent(pro.category)}`)}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
                  >
                    Hire / Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}