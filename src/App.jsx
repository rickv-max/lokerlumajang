import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { auth, db, appId } from "./firebase";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  increment,
  getDoc,
  query,
} from "firebase/firestore";
import {
  Search,
  MapPin,
  Briefcase,
  Plus,
  X,
  Building2,
  ChevronRight,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Share2,
  Clock,
  Moon,
  Sun,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
  AlertCircle,
} from "lucide-react";

import Admin from "./pages/Admin";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";
import Security from "./pages/Security";
import Panduan from "./pages/Panduan";
import CookieBanner from "./components/CookieBanner";
/* FIREBASE CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyADkAgveVJtQZnCO-Hea4PlbvGCKK2E7hg",
  authDomain: "loker-lumajang.firebaseapp.com",
  projectId: "loker-lumajang",
  storageBucket: "loker-lumajang.firebasestorage.app",
  messagingSenderId: "815271096812",
  appId: "1:815271096812:web:81b5e1de2e2cedf78210c9",
};

const KECAMATAN = [
  "Lumajang",
  "Sukodono",
  "Pasirian",
  "Tempeh",
  "Senduro",
  "Pasrujambe",
  "Gucialit",
  "Yosowilangun",
  "Kunir",
  "Tekung",
  "Rowokangkung",
  "Jatiroto",
  "Randuagung",
  "Kedungjajang",
  "Klakah",
  "Ranuyoso",
  "Pronojiwo",
  "Candipuro",
  "Tempursari",
  "Sumbersuko",
  "Padang",
];

const KATEGORI = [
  "Semua",
  "Administrasi",
  "Kesehatan",
  "Pendidikan",
  "Teknologi",
  "Restoran/Cafe",
  "Toko/Retail",
  "Lainnya",
];

const formatWhatsApp = (number) => {
  if (!number) return "";

  let cleaned = number.replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }

  if (cleaned.startsWith("62")) {
    return cleaned;
  }

  return cleaned;
};

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKecamatan, setFilterKecamatan] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [showAddModal, setShowAddModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "Lumajang",
    category: "Lainnya",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: "",
    benefits: "",
    companyDescription: "",
    deadline: "",
    contact: "",
    source: "",
    status: "published",
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const trackVisitor = async () => {
      const today = new Date().toISOString().split("T")[0];

      const visitorRef = doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        "visitors",
        today,
      );

      const visitorSnap = await getDoc(visitorRef);

      if (visitorSnap.exists()) {
        await updateDoc(visitorRef, {
          count: increment(1),
        });
      } else {
        await setDoc(visitorRef, {
          count: 1,
          date: today,
        });
      }
    };

    trackVisitor();
  }, []);

  useEffect(() => {
    const jobsRef = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "jobs",
    );

    const unsubscribe = onSnapshot(
      query(jobsRef),
      (snapshot) => {
        const jobsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setJobs(
          jobsData.sort(
            (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
          ),
        );

        setLoading(false); // Loading berhenti setelah data masuk
      },
      (error) => {
        console.error("Error ambil data:", error);
        setLoading(false); // Tetap matikan loading meski error agar tidak blank
      },
    );

    return () => unsubscribe();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesKec = filterKecamatan
        ? job.location === filterKecamatan
        : true;

      const matchesKat =
        filterKategori !== "Semua" ? job.category === filterKategori : true;

      const isPublic = job.status === "published";

      return matchesSearch && matchesKec && matchesKat && isPublic;
    });
  }, [jobs, searchTerm, filterKecamatan, filterKategori]);

  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!user) return;

    await addDoc(collection(db, "artifacts", appId, "public", "data", "jobs"), {
      ...newJob,
      postedBy: user.uid,
      createdAt: serverTimestamp(),
    });

    setShowAddModal(false);
  };

  const deleteJob = async (id) => {
    await deleteDoc(doc(db, "artifacts", appId, "public", "data", "jobs", id));
  };

  /* ================= RENDER ================= */

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-300 ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}
    >
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            user && user.email === "rickpipor@gmail.com" ? (
              <Admin
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                user={user}
                db={db}
                appId={appId}
                jobs={jobs}
              />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/*"
          element={
            <HomeUI
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filteredJobs={filteredJobs}
              filterKecamatan={filterKecamatan}
              setFilterKecamatan={setFilterKecamatan}
              filterKategori={filterKategori}
              setFilterKategori={setFilterKategori}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              loading={loading}
              navigate={navigate}
              showAddModal={showAddModal}
              setShowAddModal={setShowAddModal}
              newJob={newJob}
              setNewJob={setNewJob}
              handleAddJob={handleAddJob}
            />
          }
        />
        <Route
          path="/about"
          element={<About darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route
          path="/contact"
          element={<Contact darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route
          path="/privacy"
          element={<Privacy darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route
          path="/terms"
          element={<Terms darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route
          path="/disclaimer"
          element={<Disclaimer darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route
          path="/security"
          element={<Security darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route
          path="/panduan"
          element={<Panduan darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
      </Routes>
      <CookieBanner darkMode={darkMode} />
    </div>
  );
}

/* ================= HOME UI ================= */

function HomeUI({
  searchTerm,
  setSearchTerm,
  filteredJobs,
  filterKecamatan,
  setFilterKecamatan,
  filterKategori,
  setFilterKategori,
  darkMode,
  setDarkMode,
  loading,
  navigate,
  showAddModal,
  setShowAddModal,
  newJob,
  setNewJob,
  handleAddJob,
}) {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;

  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterKecamatan, filterKategori]);

  const handleCopyLink = () => {
    if (!selectedJob) return;
    const text = `Cek loker ${selectedJob.title} di ${selectedJob.company}`;
    navigator.clipboard.writeText(text);
  };

  const shareWhatsApp = () => {
    const url = window.location.href;

    const text = `Lowongan Kerja Lumajang

Posisi: ${selectedJob.title}
Perusahaan: ${selectedJob.company}
Lokasi: ${selectedJob.location}

Lihat detail:
${url}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareFacebook = () => {
    const url = window.location.href;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link berhasil disalin!");
  };

  const Section = ({ title, content, darkMode }) => (
    <section className="space-y-3">
      <h4
        className={`text-lg font-black ${
          darkMode ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h4>
      <div
        className={`whitespace-pre-line text-sm p-5 rounded-2xl ${
          darkMode
            ? "bg-slate-800 text-slate-300"
            : "bg-slate-50 text-slate-600"
        }`}
      >
        {content}
      </div>
    </section>
  );

  const InfoItem = ({ label, value }) => (
    <div>
      <p className="text-xs uppercase text-slate-400 font-bold">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );

  const PremiumSection = ({ title, content, darkMode }) => (
    <section
      className={`rounded-3xl p-8 border shadow-sm ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
      }`}
    >
      <h2 className="text-xl font-black mb-6">{title}</h2>
      <div className="whitespace-pre-line text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {content}
      </div>
    </section>
  );
  return (
    <>
      {/* NAVBAR TANPA TOMBOL LOGIN ADMIN */}
      <nav
        className={`sticky top-0 z-50 border-b backdrop-blur-lg ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"}`}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigate(null)}
          >
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Briefcase className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-black tracking-tight ">
              Loker<span className="text-indigo-600">Lumajang.id</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl ${darkMode ? "bg-slate-800 text-yellow-400" : "bg-slate-100 text-slate-500"}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      {!selectedJob && (
        <main className="max-w-6xl mx-auto px-4 py-12">
          {/* HERO SECTION */}
          <header
            className={`py-16 px-4 border-b transition-colors ${darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100"}`}
          >
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-600 text-xs font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Portal Loker di Lumajang
              </div>
              <h2
                className={`text-4xl md:text-5xl font-black tracking-tight leading-tight transition-colors ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                Temukan{" "}
                <span className="text-indigo-600 underline">Karirmu</span> di
                Lumajang
              </h2>
              <p
                className={`text-sm md:text-base max-w-2xl mx-auto transition-colors ${darkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Platform pencarian kerja lokal yang menghubungkan talenta
                terbaik dengan perusahaan impian di seluruh wilayah Kabupaten
                Lumajang.
              </p>
            </div>
          </header>
          {/* SUMMARY INFO (ELITE VERSION) */}
          <div className="relative mb-12 group">
            {/* DECORATIVE LIGHT GLOW (BELAKANG) */}
            <div
              className={`absolute -left-10 -top-10 w-40 h-40 rounded-full blur-[100px] opacity-20 transition-all duration-700 group-hover:opacity-30 ${
                darkMode ? "bg-indigo-600" : "bg-indigo-400"
              }`}
            />

            <div
              className={`relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500 ${
                darkMode
                  ? "bg-slate-900/40 border-slate-800 backdrop-blur-xl"
                  : "bg-white border-slate-100 shadow-[0_20px_50px_-20px_rgba(79,70,229,0.1)]"
              }`}
            >
              <div className="flex items-center gap-6">
                {/* COUNTER BADGE DENGAN ANGKA BESAR */}
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-600 blur-xl opacity-20 animate-pulse" />
                  <div
                    className={`relative w-20 h-20 rounded-[1.8rem] flex flex-col items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:-rotate-3 shadow-2xl ${
                      darkMode
                        ? "bg-indigo-600 border border-slate-700 text-white"
                        : "bg-indigo-600 text-white shadow-indigo-200"
                    }`}
                  >
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-80">
                      total
                    </span>
                    <span className="text-3xl font-black leading-none mb-0.5 tracking-tighter">
                      {filteredJobs.length}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-80">
                      Loker
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3
                    className={`text-2xl md:text-3xl font-black tracking-tighter leading-none ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Eksplorasi <span className="text-indigo-600">Karir</span>
                  </h3>
                  <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-6 h-[2px] bg-indigo-500 rounded-full" />
                    Temukan Masa Depanmu di Lumajang
                  </div>
                </div>
              </div>

              {/* LIVE STATUS INDICATOR (GLASS STYLE) */}
              <div className="flex items-center self-end md:self-center">
                <div
                  className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border backdrop-blur-md transition-all duration-300 ${
                    darkMode
                      ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400"
                      : "bg-emerald-50 border-emerald-100 text-emerald-600"
                  }`}
                >
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Live Update Hari ini
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* SEARCH BOX */}
          <div
            className={`mt-8 p-2 rounded-2xl shadow-xl border flex flex-col md:flex-row gap-2 transition-all ${darkMode ? "bg-slate-900 border-slate-700 shadow-none" : "bg-white border-slate-200 shadow-slate-200/50"}`}
          >
            <div className="relative flex-[2]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari posisi (Staff, Kasir, Kurir...)"
                className={`w-full pl-12 pr-4 py-3 bg-transparent outline-none text-sm transition-colors ${darkMode ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div
              className={`flex flex-1 gap-2 border-t md:border-t-0 md:border-l p-1 md:pl-2 transition-colors ${darkMode ? "border-slate-700" : "border-slate-200"}`}
            >
              <div className="relative flex-1">
                {/* Trigger */}
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl transition-colors ${
                    darkMode
                      ? "bg-slate-800 text-slate-300"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <span>{filterKecamatan || "Semua Wilayah"}</span>
                  <span
                    className={`transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div
                    className={`absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-2xl shadow-2xl border ${
                      darkMode
                        ? "bg-slate-900 border-slate-700"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div
                      onClick={() => {
                        setFilterKecamatan("");
                        setIsOpen(false);
                      }}
                      className="px-4 py-3 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-grey-800 transition-colors"
                    >
                      Semua Wilayah
                    </div>

                    {KECAMATAN.map((k) => (
                      <div
                        key={k}
                        onClick={() => {
                          setFilterKecamatan(k);
                          setIsOpen(false);
                        }}
                        className="px-4 py-3 text-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-grey-800 transition-colors"
                      >
                        {k}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors">
                <Search size={18} />
              </button>
            </div>
          </div>
          &nbsp;
          {/* CATEGORY TABS */}
          <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
            {KATEGORI.map((kat) => (
              <button
                key={kat}
                onClick={() => setFilterKategori(kat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  filterKategori === kat
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : darkMode
                      ? "bg-slate-900 border-slate-800 text-slate-400 hover:border-indigo-500/50 hover:text-indigo-400"
                      : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
          {/* GRID LOKER */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {loading ? (
              Array(6)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className={`h-72 rounded-[2rem] md:rounded-[2.5rem] animate-pulse ${
                      darkMode ? "bg-slate-900/50" : "bg-slate-200"
                    }`}
                  />
                ))
            ) : filteredJobs.length > 0 ? (
              currentJobs.map((job) => {
                const isNew =
                  job.createdAt?.seconds &&
                  Date.now() / 1000 - job.createdAt.seconds < 86400 * 2;

                return (
                  <div
                    key={job.id}
                    onClick={() => {
                      setSelectedJob(job);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="group relative cursor-pointer"
                  >
                    {/* OUTER GLOW (Hanya muncul di Desktop saat Hover) */}
                    <div
                      className={`absolute -inset-0.5 rounded-[2rem] md:rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl hidden md:block
            ${darkMode ? "bg-indigo-500/20" : "bg-indigo-200/50"}`}
                    />

                    {/* MAIN CARD */}
                    <div
                      className={`relative h-full rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-300 overflow-hidden flex flex-col
            ${
              darkMode
                ? "bg-slate-900/40 border-slate-800 backdrop-blur-md group-hover:bg-slate-900 group-hover:border-indigo-500/50"
                : "bg-white border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] group-hover:shadow-xl group-hover:shadow-indigo-500/10 group-hover:border-indigo-200"
            }`}
                    >
                      {/* CARD CONTENT */}
                      <div className="p-6 md:p-8 flex flex-col h-full">
                        {/* HEADER: BADGES & LOGO */}
                        <div className="flex justify-between items-start mb-6 md:mb-8">
                          <div
                            className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm
                  ${darkMode ? "bg-slate-800 text-indigo-400 border border-slate-700" : "bg-indigo-50 text-indigo-600 border border-indigo-100"}`}
                          >
                            <Building2 size={24} className="md:w-7 md:h-7" />
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            {isNew && (
                              <span className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white text-[9px] md:text-[10px] font-black rounded-full shadow-lg shadow-indigo-500/30">
                                <span className="w-1 h-1 bg-white rounded-full animate-ping" />
                                NEW
                              </span>
                            )}
                            <span
                              className={`px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider
                    ${darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}
                            >
                              {job.type}
                            </span>
                          </div>
                        </div>

                        {/* TITLE & COMPANY */}
                        <div className="mb-6">
                          <h3
                            className={`text-lg md:text-xl font-black leading-tight mb-2 line-clamp-2 transition-colors
                  ${darkMode ? "text-white group-hover:text-indigo-400" : "text-slate-900 group-hover:text-indigo-600"}`}
                          >
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-sm font-bold ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                            >
                              {job.company}
                            </span>
                            <CheckCircle
                              size={14}
                              className="text-indigo-500"
                            />
                          </div>
                        </div>

                        {/* CHIPS: FLEX WRAP UNTUK MOBILE */}
                        <div className="flex flex-wrap gap-2 mb-8">
                          <div
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] md:text-[11px] font-bold border
                  ${darkMode ? "bg-slate-800/50 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-500"}`}
                          >
                            <MapPin size={12} className="text-indigo-500" />
                            {job.location}
                          </div>
                          <div
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] md:text-[11px] font-bold border
                  ${darkMode ? "bg-slate-800/50 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-500"}`}
                          >
                            <Briefcase size={12} className="text-indigo-500" />
                            {job.category}
                          </div>
                        </div>

                        {/* FOOTER: SALARY & BUTTON */}
                        <div
                          className={`mt-auto pt-5 border-t flex items-center justify-between
                ${darkMode ? "border-slate-800" : "border-slate-50"}`}
                        >
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                              Estimasi Gaji
                            </span>
                            <span
                              className={`text-base md:text-lg font-black ${darkMode ? "text-white" : "text-indigo-600"}`}
                            >
                              {job.salary || "-"}
                            </span>
                          </div>

                          <div
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300
                  ${
                    darkMode
                      ? "bg-slate-800 text-white group-hover:bg-indigo-600"
                      : "bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white"
                  }`}
                          >
                            <ArrowLeft
                              size={18}
                              className="rotate-180 md:w-5 md:h-5"
                              strokeWidth={3}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* EMPTY STATE RESPONSIVE */
              <div className="col-span-full py-20 md:py-32 text-center">
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-[2rem] mb-6
        ${darkMode ? "bg-slate-900 text-slate-700" : "bg-slate-50 text-slate-200"}`}
                >
                  <Search size={40} />
                </div>
                <h3
                  className={`text-xl md:text-2xl font-black mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  Loker tidak ditemukan
                </h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto px-4">
                  Coba gunakan kata kunci lain atau ubah filter kecamatan.
                </p>
              </div>
            )}
          </div>
          {/* PAGINATION PREMIUM */}
          <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
            {/* PREV */}
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(currentPage - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all
    ${
      currentPage === 1
        ? "opacity-40 cursor-not-allowed"
        : darkMode
          ? "bg-slate-900 border-slate-700 hover:border-indigo-500 hover:text-indigo-400"
          : "bg-white border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
    }`}
            >
              ← Prev
            </button>

            {/* PAGE NUMBERS */}
            {[...Array(totalPages)].slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-10 h-10 rounded-xl text-sm font-bold border transition-all
      ${
        currentPage === i + 1
          ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20"
          : darkMode
            ? "bg-slate-900 border-slate-700 hover:border-indigo-500 hover:text-indigo-400"
            : "bg-white border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
      }`}
              >
                {i + 1}
              </button>
            ))}

            {/* ELLIPSIS */}
            {totalPages > 5 && (
              <span className="px-2 text-slate-400 font-bold">...</span>
            )}

            {/* LAST PAGE */}
            {totalPages > 5 && (
              <button
                onClick={() => {
                  setCurrentPage(totalPages);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-10 h-10 rounded-xl text-sm font-bold border transition-all
      ${
        currentPage === totalPages
          ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20"
          : darkMode
            ? "bg-slate-900 border-slate-700 hover:border-indigo-500 hover:text-indigo-400"
            : "bg-white border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
      }`}
              >
                {totalPages}
              </button>
            )}

            {/* NEXT */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(currentPage + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all
    ${
      currentPage === totalPages
        ? "opacity-40 cursor-not-allowed"
        : darkMode
          ? "bg-slate-900 border-slate-700 hover:border-indigo-500 hover:text-indigo-400"
          : "bg-white border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
    }`}
            >
              Next →
            </button>
          </div>
          {/* WHATSAPP CHANNEL */}
          <section
            className={`py-20 px-4 transition-colors ${
              darkMode ? "bg-slate-950" : "bg-slate-50"
            }`}
          >
            <div className="max-w-6xl mx-auto">
              <div
                className={`rounded-3xl p-10 md:p-14 relative overflow-hidden border ${
                  darkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200"
                }`}
              >
                {/* Background Glow */}
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-green-500/20 blur-3xl rounded-full"></div>

                <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
                  {/* TEXT */}
                  <div className="space-y-6">
                    <h2
                      className={`text-3xl md:text-4xl font-black leading-tight ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Ikuti Saluran WhatsApp
                      <span className="text-green-500"> Loker Lumajang</span>
                    </h2>

                    <p className="text-slate-400 max-w-lg">
                      Dapatkan update lowongan kerja terbaru di Lumajang setiap
                      hari. Kami membagikan informasi loker terpercaya langsung
                      ke WhatsApp Channel.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <a
                        href="https://whatsapp.com/channel/0029VbC3byZKgsNtyw34XB1n"
                        target="_blank"
                        className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-green-600/20 transition-all"
                      >
                        Gabung Saluran
                      </a>

                      <span className="text-sm text-slate-400 flex items-center">
                        Gratis • Update setiap hari
                      </span>
                    </div>
                  </div>

                  {/* CARD INFO */}
                  <div
                    className={`p-8 rounded-2xl border ${
                      darkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                          1
                        </div>
                        <p className="text-sm text-slate-400">
                          Ikuti saluran WhatsApp LokerLumajang.id
                        </p>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                          2
                        </div>
                        <p className="text-sm text-slate-400">
                          Dapatkan info lowongan kerja terbaru setiap hari
                        </p>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                          3
                        </div>
                        <p className="text-sm text-slate-400">
                          Klik link dan langsung kirim lamaran kerja
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* CTA ADMIN */}
            <div className="mt-20 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left space-y-4">
                  <h3 className="text-2xl md:text-4xl font-black">
                    Punya Lowongan Kerja?
                  </h3>

                  <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                    <a
                      href={`https://wa.me/6285856618965?text=${encodeURIComponent(
                        `Halo Admin LokerLumajang.id,

Saya ingin memasang lowongan kerja di website LokerLumajang.id.

Berikut detail singkatnya:
Nama Perusahaan:
Posisi yang Dibuka:
Lokasi:
Kontak Perusahaan:


Terima kasih.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-indigo-600 px-8 py-3.5 rounded-2xl font-black shadow-xl hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                      <MessageCircle size={20} /> Hubungi Admin
                    </a>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center p-8 backdrop-blur-sm border border-white/20">
                    <Briefcase size={80} className="text-white opacity-80" />
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
            </div>
          </section>
        </main>
      )}

      {/* ================= DETAIL PAGE PREMIUM ================= */}
      {selectedJob && (
        <main className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in duration-500">
          {/* BACK BUTTON */}
          <button
            onClick={() => setSelectedJob(null)}
            className="flex items-center gap-2 text-sm font-bold mb-10 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={18} /> Kembali ke Beranda
          </button>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* ================= LEFT CONTENT ================= */}
            <div className="lg:col-span-2 space-y-10">
              {/* HERO CARD */}
              <div
                className={`rounded-3xl p-10 shadow-2xl border relative overflow-hidden ${
                  darkMode
                    ? "bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800"
                    : "bg-gradient-to-br from-indigo-50 to-white border-slate-100"
                }`}
              >
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <span className="px-4 py-1 text-xs font-black rounded-full bg-indigo-600 text-white tracking-widest uppercase">
                      {selectedJob.category}
                    </span>

                    {selectedJob.deadline && (
                      <span className="px-4 py-1 text-xs font-bold rounded-full bg-red-100 text-red-600">
                        Deadline: {selectedJob.deadline}
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl md:text-4xl font-black leading-tight">
                    {selectedJob.title}
                  </h1>

                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <Building2 size={18} />
                    <span className="font-semibold">{selectedJob.company}</span>
                  </div>

                  <div className="flex flex-wrap gap-6 pt-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      {selectedJob.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} />
                      {selectedJob.type}
                    </div>
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      💰 {selectedJob.salary || "-"}
                    </div>
                  </div>
                </div>
              </div>

              {/* DESKRIPSI */}
              <PremiumSection
                title="Deskripsi Pekerjaan"
                content={selectedJob.description}
                darkMode={darkMode}
              />

              {selectedJob.requirements && (
                <PremiumSection
                  title="Kualifikasi"
                  content={selectedJob.requirements}
                  darkMode={darkMode}
                />
              )}

              {selectedJob.benefits && (
                <PremiumSection
                  title="Benefit & Fasilitas"
                  content={selectedJob.benefits}
                  darkMode={darkMode}
                />
              )}

              {selectedJob.companyDescription && (
                <PremiumSection
                  title="Tentang Perusahaan"
                  content={selectedJob.companyDescription}
                  darkMode={darkMode}
                />
              )}
              {selectedJob.source && (
                <div className="rounded-2xl p-6 border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-widest">
                    Sumber Informasi
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Lowongan ini dipublikasikan berdasarkan informasi dari{" "}
                    <span className="font-semibold">{selectedJob.source}</span>
                  </p>
                </div>
              )}
            </div>

            {/* ================= SIDEBAR ================= */}
            <div className="space-y-6">
              <div
                className={`rounded-3xl p-8 border shadow-xl sticky top-24 ${
                  darkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-100"
                }`}
              >
                <h3 className="font-black text-lg mb-6">Lamar Sekarang</h3>

                <div className="flex flex-col sm:flex-row gap-4">
                  {selectedJob.link && (
                    <a
                      href={selectedJob.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center bg-violet-600 hover:bg-violet-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1"
                    >
                      Lamar via Website / Form
                    </a>
                  )}
                  {/* WHATSAPP BUTTON */}
                  {selectedJob.contact && (
                    <a
                      href={`https://wa.me/${formatWhatsApp(selectedJob.contact)}?text=${encodeURIComponent(
                        `Halo Admin ${selectedJob.company}, saya tertarik dengan lowongan ${selectedJob.title} di ${selectedJob.location}.

Saya melihat informasi ini di website :
https://lokerlumajang.vercel.app

Mohon info lebih lanjut, terima kasih.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all"
                    >
                      Kirim Lamaran via WhatsApp
                    </a>
                  )}

                  {/* EMAIL BUTTON */}
                  {selectedJob.email && (
                    <a
                      href={`mailto:${selectedJob.email}?subject=${encodeURIComponent(
                        `Lamaran - ${selectedJob.title}`,
                      )}&body=${encodeURIComponent(
                        `Halo ${selectedJob.company},

Saya tertarik dengan posisi ${selectedJob.title} di ${selectedJob.location}.

Saya mengetahui informasi ini dari:
https://lokerlumajang.vercel.app

Berikut CV saya terlampir.

Terima kasih.`,
                      )}`}
                      className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all"
                    >
                      Kirim Lamaran via Email
                    </a>
                  )}
                </div>
                <div className="mt-6 space-y-3">
                  <p className="text-xs text-slate-400 font-bold uppercase">
                    Bagikan Lowongan
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={shareWhatsApp}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700"
                    >
                      <MessageCircle size={16} /> WhatsApp
                    </button>

                    <button
                      onClick={copyLink}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-300"
                    >
                      <Share2 size={16} /> Copy Link
                    </button>
                  </div>
                </div>

                <div className="mt-6 text-xs text-slate-400 leading-relaxed">
                  Pastikan Anda membaca detail lowongan dengan teliti sebelum
                  menghubungi perusahaan.
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer
        className={`border-t py-20 px-4 transition-colors ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Briefcase className="text-white w-4 h-4" />
              </div>
              <span
                className={`font-black text-xl tracking-tighter transition-colors ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                Loker<span className="text-indigo-600">Lumajang.id</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Solusi cerdas mencari kerja di Kabupaten Lumajang. Menyediakan
              informasi lowongan terpercaya setiap hari untuk masyarakat.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className={`p-2 rounded-lg text-slate-400 transition-colors ${darkMode ? "bg-slate-800 hover:text-indigo-400 hover:bg-slate-700" : "bg-slate-100 hover:text-indigo-600 hover:bg-slate-200"}`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <ul className="space-y-4 text-sm font-medium">
            <li>
              <Link
                to="/"
                className="text-slate-400 hover:text-indigo-500 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-slate-400 hover:text-indigo-500 transition-colors"
              >
                Tentang Kami
              </Link>
            </li>

            <li>
              <Link
                to="/disclaimer"
                className="text-slate-400 hover:text-indigo-500 transition-colors"
              >
                Disclaimer
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="text-slate-400 hover:text-indigo-500 transition-colors"
              >
                Hubungi Kami
              </Link>
            </li>
          </ul>

          <ul className="space-y-4 text-sm font-medium">
            <li>
              <Link
                to="/security"
                className="text-slate-400 hover:text-indigo-500 transition-colors"
              >
                Pusat Keamanan
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-slate-400 hover:text-indigo-500 transition-colors"
              >
                Syarat & Ketentuan
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="text-slate-400 hover:text-indigo-500 transition-colors"
              >
                Kebijakan Privasi
              </Link>
            </li>
            <li>
              <Link
                to="/panduan"
                className="text-slate-400 hover:text-indigo-500 transition-colors"
              >
                Panduan Lamar Kerja
              </Link>
            </li>
          </ul>

          <div
            className={`p-6 rounded-3xl transition-colors ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}
          >
            <h4
              className={`font-bold mb-2 text-sm transition-colors ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              Berlangganan Loker
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Dapatkan update loker via Email setiap pagi.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Email Anda"
                className={`flex-1 px-3 py-2 rounded-xl text-xs outline-none border transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white focus:border-indigo-500" : "bg-white border-slate-200 text-slate-900 focus:border-indigo-400"}`}
              />
              <button className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
        <div
          className={`max-w-6xl mx-auto pt-16 mt-16 border-t text-center transition-colors ${darkMode ? "border-slate-800" : "border-slate-100"}`}
        >
          <p className="text-xs text-slate-400 font-medium">
            © 2026 LokerLumajang.id
          </p>
        </div>
      </footer>

      {/* MODAL: TAMBAH LOKER */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          ></div>
          <form
            onSubmit={handleAddJob}
            className={`w-full max-w-xl relative p-8 space-y-6 max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in duration-300 transition-colors ${darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black">Pasang Lowongan Baru</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className={`p-2 rounded-full transition-colors ${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: "Judul Lowongan",
                  key: "title",
                  placeholder: "Contoh: Kasir Toko",
                },
                {
                  label: "Nama Perusahaan",
                  key: "company",
                  placeholder: "Contoh: PT Maju Jaya",
                },
              ].map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    {field.label}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder={field.placeholder}
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all ${darkMode ? "bg-slate-800 border-slate-700 focus:border-indigo-500" : "bg-slate-50 border-slate-200 focus:border-indigo-400"}`}
                    value={newJob[field.key]}
                    onChange={(e) =>
                      setNewJob({ ...newJob, [field.key]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Wilayah Kecamatan
                </label>
                <select
                  className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all ${darkMode ? "bg-slate-800 border-slate-700 focus:border-indigo-500" : "bg-slate-50 border-slate-200 focus:border-indigo-400"}`}
                  value={newJob.location}
                  onChange={(e) =>
                    setNewJob({ ...newJob, location: e.target.value })
                  }
                >
                  {KECAMATAN.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Kategori
                </label>
                <select
                  className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all ${darkMode ? "bg-slate-800 border-slate-700 focus:border-indigo-500" : "bg-slate-50 border-slate-200 focus:border-indigo-400"}`}
                  value={newJob.category}
                  onChange={(e) =>
                    setNewJob({ ...newJob, category: e.target.value })
                  }
                >
                  {KATEGORI.filter((k) => k !== "Semua").map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">
                Rentang Gaji (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: 1.5jt - 2jt atau Nego"
                className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all ${darkMode ? "bg-slate-800 border-slate-700 focus:border-indigo-500" : "bg-slate-50 border-slate-200 focus:border-indigo-400"}`}
                value={newJob.salary}
                onChange={(e) =>
                  setNewJob({ ...newJob, salary: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">
                Deskripsi & Syarat
              </label>
              <textarea
                required
                rows="4"
                placeholder="Tuliskan syarat, kualifikasi, dan cara melamar..."
                className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all ${darkMode ? "bg-slate-800 border-slate-700 focus:border-indigo-500" : "bg-slate-50 border-slate-200 focus:border-indigo-400"}`}
                value={newJob.description}
                onChange={(e) =>
                  setNewJob({ ...newJob, description: e.target.value })
                }
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400">
                WhatsApp CP (Pelamar akan chat kesini)
              </label>
              <input
                required
                type="text"
                placeholder="Contoh: 08123456789"
                className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all ${darkMode ? "bg-slate-800 border-slate-700 focus:border-indigo-500" : "bg-slate-50 border-slate-200 focus:border-indigo-400"}`}
                value={newJob.contact}
                onChange={(e) =>
                  setNewJob({ ...newJob, contact: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98]"
            >
              Publikasikan Sekarang
            </button>
          </form>
        </div>
      )}
    </>
  );
}
