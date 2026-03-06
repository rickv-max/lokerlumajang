import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
// PASTIKAN AreaChart dan Area diimport di sini
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import {
  LayoutDashboard,
  Sun,
  Moon,
  LogOut,
  Plus,
  Trash2,
  X,
  Briefcase,
  CheckCircle2,
  FileClock,
  CalendarDays,
  Search,
  Pencil,
} from "lucide-react";

/* ================= DATA ================= */
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

const KATEGORI_LIST = [
  "Administrasi",
  "Kesehatan",
  "Pendidikan",
  "Teknologi",
  "Restoran/Cafe",
  "Toko/Retail",
  "Lainnya",
];

const Admin = ({ darkMode, setDarkMode, user, db, appId, jobs }) => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [visitorData, setVisitorData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingJob, setEditingJob] = useState(null);
  const itemsPerPage = 8;

  const openEditModal = (job) => {
    setEditingJob(job);
    setNewJob(job); // Isi form dengan data yang sudah ada
    setShowAddModal(true);
  };

  // Ubah juga fungsi tutup modal agar reset state
  const closeAndResetModal = () => {
    setShowAddModal(false);
    setEditingJob(null);
    setNewJob(defaultJob);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingJob) {
        // LOGIKA EDIT (UPDATE)
        const jobRef = doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "jobs",
          editingJob.id,
        );
        await updateDoc(jobRef, {
          ...newJob,
          updatedAt: serverTimestamp(),
        });
        alert("Lowongan berhasil diperbarui!");
      } else {
        // LOGIKA TAMBAH BARU
        await addDoc(
          collection(db, "artifacts", appId, "public", "data", "jobs"),
          {
            ...newJob,
            postedBy: user.uid,
            createdAt: serverTimestamp(),
          },
        );
        alert("Lowongan berhasil diterbitkan!");
      }
      closeAndResetModal();
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan.");
    }
  };

  /* ================= TAMBAHKAN KODE INI ================= */
  const defaultJob = {
    title: "",
    company: "",
    location: "Lumajang",
    category: "Lainnya",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: "",
    benefits: "",
    deadline: "",
    companyDescription: "",
    source: "",
    contact: "",
    email: "",
    link: "",
    status: "published",
  };

  const [newJob, setNewJob] = useState(defaultJob);

  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(
        collection(db, "artifacts", appId, "public", "data", "jobs"),
        {
          ...newJob,
          postedBy: user.uid,
          createdAt: serverTimestamp(),
        },
      );

      setShowAddModal(false); // Tutup modal setelah sukses
      setNewJob(defaultJob); // Reset isi form
      alert("Lowongan berhasil diterbitkan!");
    } catch (error) {
      console.error("Error adding job: ", error);
      alert("Gagal menambah lowongan.");
    }
  };

  /* ================= STATS LOGIC ================= */
  const totalJobs = jobs.length;
  const publishedJobs = jobs.filter((j) => j.status === "published").length;
  const draftJobs = jobs.filter((j) => j.status === "draft").length;

  const todayJobs = jobs.filter((j) => {
    if (!j.createdAt?.seconds) return false;
    const created = new Date(j.createdAt.seconds * 1000);
    const today = new Date();
    return (
      created.getDate() === today.getDate() &&
      created.getMonth() === today.getMonth() &&
      created.getFullYear() === today.getFullYear()
    );
  }).length;

  const totalVisitors = visitorData.reduce(
    (acc, item) => acc + item.visitors,
    0,
  );

  const growth =
    visitorData.length > 1
      ? ((visitorData[visitorData.length - 1].visitors -
          visitorData[0].visitors) /
          visitorData[0].visitors) *
        100
      : 0;

  /* ================= EFFECT ================= */
  useEffect(() => {
    const visitorRef = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "visitors",
    );
    const unsubscribe = onSnapshot(visitorRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        date: doc.id,
        visitors: doc.data().count,
      }));
      const sorted = data.sort((a, b) => a.date.localeCompare(b.date));
      setVisitorData(sorted.slice(-7));
    });
    return () => unsubscribe();
  }, [db, appId]);

  /* ================= ACTIONS ================= */
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const deleteJob = async (id) => {
    if (window.confirm("Hapus lowongan ini?")) {
      await deleteDoc(
        doc(db, "artifacts", appId, "public", "data", "jobs", id),
      );
    }
  };

  const toggleStatus = async (job) => {
    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "jobs", job.id),
      {
        status: job.status === "published" ? "draft" : "published",
      },
    );
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${
        darkMode ? "bg-[#0f172a] text-slate-100" : "bg-[#f8fafc] text-slate-900"
      }`}
    >
      {/* NAVBAR */}
      <nav
        className={`sticky top-0 z-50 border-b backdrop-blur-md ${
          darkMode
            ? "bg-slate-900/90 border-slate-800"
            : "bg-white/90 border-slate-200"
        }`}
      >
        <div className="max-w-[1440px] mx-auto h-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <LayoutDashboard className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">
                LokerLmj<span className="text-indigo-600">.id</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
                Admin Panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-yellow-400" : "bg-slate-50 border-slate-200 text-slate-600"}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
            >
              <LogOut size={18} />{" "}
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto p-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-2">
              Dashboard Overview
            </h2>
            <p className="text-slate-500 font-medium">
              Monitoring performa loker Lumajang.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/25 hover:bg-indigo-700 transition-all"
          >
            <Plus size={20} strokeWidth={3} /> POST NEW LISTING
          </button>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            {
              title: "Total Listings",
              value: totalJobs,
              icon: Briefcase,
              color: "text-indigo-600",
              bg: "bg-indigo-500/10",
            },
            {
              title: "Active Jobs",
              value: publishedJobs,
              icon: CheckCircle2,
              color: "text-emerald-600",
              bg: "bg-emerald-500/10",
            },
            {
              title: "Draft / Pending",
              value: draftJobs,
              icon: FileClock,
              color: "text-amber-600",
              bg: "bg-amber-500/10",
            },
            {
              title: "Today's Intake",
              value: todayJobs,
              icon: CalendarDays,
              color: "text-blue-600",
              bg: "bg-blue-500/10",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-6 rounded-[1.5rem] border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                  <item.icon size={22} />
                </div>
                <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
                  Overview
                </span>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">
                {item.title}
              </p>
              <h3 className="text-3xl font-black tracking-tight">
                {item.value}
              </h3>
            </div>
          ))}
        </div>

        {/* CHART & SYSTEM INFO CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* BOX TRAFFIK (RASIO 16:9) */}
          <div
            className={`lg:col-span-2 p-6 md:p-8 rounded-[2.5rem] border flex flex-col justify-between ${
              darkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            {/* Header Box */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black tracking-tight">
                  Traffic Pulse
                </h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  7-Day Engagement
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-black text-indigo-600 leading-none">
                  {totalVisitors}
                </span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                  Total Visits
                </span>
              </div>
            </div>

            {/* CHART DENGAN RASIO 16:9 (ASPECT VIDEO) */}
            <div className="w-full aspect-video max-h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={visitorData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="premiumGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={darkMode ? "#1e293b" : "#f1f5f9"}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fontWeight: "800",
                      fill: darkMode ? "#475569" : "#94a3b8",
                    }}
                    dy={10}
                  />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "20px",
                      border: "none",
                      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                      backgroundColor: darkMode ? "#0f172a" : "#fff",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#6366f1"
                    strokeWidth={4}
                    fill="url(#premiumGradient)"
                    animationDuration={1500}
                    dot={{
                      fill: "#6366f1",
                      r: 4,
                      strokeWidth: 2,
                      stroke: darkMode ? "#0f172a" : "#fff",
                    }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SYSTEM INFO (PERSEGI PANJANG VERTIKAL) */}
          <div
            className={`p-8 rounded-[2.5rem] border flex flex-col justify-between ${
              darkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div>
              <h3 className="text-lg font-black tracking-tight mb-8 text-indigo-500">
                System Insights
              </h3>
              <div className="space-y-8">
                <div className="flex justify-between items-center group">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Database
                    </p>
                    <p className="text-sm font-bold">Main Server</p>
                  </div>
                  <span className="text-xs font-black text-emerald-500 flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                    LIVE
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Weekly Growth
                    </p>
                    <p className="text-sm font-bold">User Traction</p>
                  </div>
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full ${
                      growth >= 0
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {growth >= 0 ? "↑" : "↓"} {Math.abs(growth).toFixed(1)}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Admin Role
                    </p>
                    <p className="text-sm font-bold">Authorized</p>
                  </div>
                  <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-full uppercase">
                    Root
                  </span>
                </div>
              </div>
            </div>

            {/* Mini Footer Inside Box */}
            <div className="mt-8 pt-6 border-t border-slate-500/10 text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">
              System Secure • 2026
            </div>
          </div>
        </div>

        {/* TABLE LISTING */}
        <div
          className={`rounded-[2rem] border overflow-hidden ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}
        >
          <div className="p-8 border-b border-slate-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-lg font-black tracking-tight">
              Management Listings
            </h3>
            <div className="relative w-full max-w-sm">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                className={`w-full pl-12 pr-6 py-3 rounded-xl border-2 outline-none text-sm font-medium ${darkMode ? "bg-slate-800 border-slate-700 focus:border-indigo-500/50" : "bg-slate-50 border-slate-100 focus:border-indigo-500/30"}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`text-[10px] font-black uppercase tracking-[0.2em] border-b ${darkMode ? "bg-slate-800/50 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-400"}`}
                >
                  <th className="px-8 py-5">Job Listing</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${darkMode ? "divide-slate-800" : "divide-slate-100"}`}
              >
                {paginatedJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-indigo-500/[0.02]">
                    <td className="px-8 py-5">
                      <p className="font-black text-base">{job.title}</p>
                      <p className="text-[11px] font-bold text-slate-500 uppercase">
                        {job.company}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => toggleStatus(job)}
                        className={`mr-2 px-3 py-1 rounded-lg text-[10px] font-black border ${job.status === "published" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-amber-500/10 border-amber-500/20 text-amber-600"}`}
                      >
                        {job.status?.toUpperCase()}
                      </button>
                      <button
                        onClick={() => openEditModal(job)}
                        title="Edit Lowongan"
                        className={`p-2 rounded-xl transition-all duration-300 ${
                          darkMode
                            ? "hover:bg-indigo-500/20 text-indigo-400"
                            : "hover:bg-indigo-50 text-indigo-600"
                        }`}
                      >
                        <Pencil size={18} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="p-2 text-slate-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* PAGINATION (CLEAN & PROFESSIONAL) */}
            {totalPages > 1 && (
              <div
                className={`p-6 md:p-8 border-t flex items-center justify-between ${
                  darkMode ? "border-slate-800" : "border-slate-100"
                }`}
              >
                <div className="hidden md:block">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredJobs.length)}{" "}
                    of {filteredJobs.length} Listings
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((prev) => prev - 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`px-5 py-2.5 rounded-xl border text-[10px] font-black tracking-widest transition-all uppercase
                ${
                  currentPage === 1
                    ? "opacity-30 cursor-not-allowed"
                    : darkMode
                      ? "hover:bg-slate-800 border-slate-700 text-white"
                      : "hover:bg-slate-50 border-slate-200 text-slate-600"
                }`}
                  >
                    Previous
                  </button>

                  <div
                    className={`px-4 py-2 rounded-xl text-[10px] font-black border ${
                      darkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    {currentPage} / {totalPages}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((prev) => prev + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`px-5 py-2.5 rounded-xl border text-[10px] font-black tracking-widest transition-all uppercase
                ${
                  currentPage === totalPages
                    ? "opacity-30 cursor-not-allowed"
                    : darkMode
                      ? "hover:bg-slate-800 border-slate-700 text-white"
                      : "hover:bg-slate-50 border-slate-200 text-slate-600"
                }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* ================= MODAL: POST NEW LISTING (PREMIUM UI) ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowAddModal(false)}
          />

          {/* Modal Card */}
          <div
            className={`relative w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 ${
              darkMode
                ? "bg-slate-900 border border-slate-800"
                : "bg-white border border-slate-100"
            }`}
          >
            {/* Header Modal */}
            <div className="p-8 border-b border-slate-500/10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black tracking-tight">
                  {/* INI PERUBAHANNYA */}
                  {editingJob ? "Update Job Listing" : "Create New Listing"}
                </h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  {editingJob
                    ? "Perbarui detail lowongan"
                    : "Lengkapi detail lowongan kerja"}
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl hover:bg-slate-500/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form
              onSubmit={handleAddJob}
              className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase px-1">
                    Job Title
                  </label>
                  <input
                    required
                    placeholder="Contoh: Staff Admin"
                    className={`w-full px-5 py-3.5 rounded-2xl border-2 outline-none transition-all ${
                      darkMode
                        ? "bg-slate-800 border-slate-700 focus:border-indigo-500"
                        : "bg-slate-50 border-slate-100 focus:border-indigo-500/30"
                    }`}
                    value={newJob.title}
                    onChange={(e) =>
                      setNewJob({ ...newJob, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase px-1">
                    Company Name
                  </label>
                  <input
                    required
                    placeholder="Nama Perusahaan"
                    className={`w-full px-5 py-3.5 rounded-2xl border-2 outline-none transition-all ${
                      darkMode
                        ? "bg-slate-800 border-slate-700 focus:border-indigo-500"
                        : "bg-slate-50 border-slate-100 focus:border-indigo-500/30"
                    }`}
                    value={newJob.company}
                    onChange={(e) =>
                      setNewJob({ ...newJob, company: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase px-1">
                  Description
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Deskripsi pekerjaan..."
                  className={`w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all ${
                    darkMode
                      ? "bg-slate-800 border-slate-700 focus:border-indigo-500"
                      : "bg-slate-50 border-slate-100 focus:border-indigo-500/30"
                  }`}
                  value={newJob.description}
                  onChange={(e) =>
                    setNewJob({ ...newJob, description: e.target.value })
                  }
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <select
                  className={`px-4 py-3.5 rounded-2xl border-2 outline-none ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
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
                <select
                  className={`px-4 py-3.5 rounded-2xl border-2 outline-none ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
                  value={newJob.category}
                  onChange={(e) =>
                    setNewJob({ ...newJob, category: e.target.value })
                  }
                >
                  {KATEGORI_LIST.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
                <select
                  className={`px-4 py-3.5 rounded-2xl border-2 outline-none ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
                  value={newJob.type}
                  onChange={(e) =>
                    setNewJob({ ...newJob, type: e.target.value })
                  }
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>-</option>
                  <option>Shift</option>
                  <option>Magang</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <input
                  placeholder="Gaji (Contoh: 2jt - 3jt)"
                  className={`w-full px-5 py-3.5 rounded-2xl border-2 outline-none ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
                  value={newJob.salary}
                  onChange={(e) =>
                    setNewJob({ ...newJob, salary: e.target.value })
                  }
                />
                <input
                  required
                  placeholder="WhatsApp Contact (628...)"
                  className={`w-full px-5 py-3.5 rounded-2xl border-2 outline-none ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
                  value={newJob.contact}
                  onChange={(e) =>
                    setNewJob({ ...newJob, contact: e.target.value })
                  }
                />
              </div>
              {/* EMAIL FIELD (Full Width) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase px-1">
                  Email Perusahaan (Opsional)
                </label>
                <input
                  type="email"
                  placeholder="hrd@perusahaan.com"
                  className={`w-full px-5 py-3.5 rounded-2xl border-2 outline-none transition-all ${
                    darkMode
                      ? "bg-slate-800 border-slate-700 focus:border-indigo-500"
                      : "bg-slate-50 border-slate-100 focus:border-indigo-500/30"
                  }`}
                  value={newJob.email}
                  onChange={(e) =>
                    setNewJob({ ...newJob, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase px-1">
                  Link Pendaftaran (Opsional)
                </label>
                <input
                  type="url"
                  placeholder="https://bit.ly/form-loker atau https://perusahaan.com/career"
                  className={`w-full px-5 py-3.5 rounded-2xl border-2 outline-none transition-all ${
                    darkMode
                      ? "bg-slate-800 border-slate-700 focus:border-indigo-500"
                      : "bg-slate-50 border-slate-100 focus:border-indigo-500/30"
                  }`}
                  value={newJob.link}
                  onChange={(e) =>
                    setNewJob({ ...newJob, link: e.target.value })
                  }
                />
              </div>
            </form>

            {/* Footer Modal */}
            <div className="p-8 border-t border-slate-500/10 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => closeAndResetModal}
                className="px-6 py-3 text-sm font-black text-slate-500 hover:text-slate-700"
              >
                CANCEL
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95"
              >
                {editingJob ? "SAVE CHANGES" : "PUBLISH NOW"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
