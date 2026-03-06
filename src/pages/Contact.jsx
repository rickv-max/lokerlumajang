import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact({ darkMode, setDarkMode }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Pesan berhasil dikirim (demo mode)");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="pt-24 min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors">
        {/* HERO */}
        <section className="max-w-6xl mx-auto px-6 mb-16">
          <div className="bg-indigo-600 rounded-3xl p-10 md:p-14 text-white shadow-2xl shadow-indigo-600/20">
            <h1 className="text-3xl md:text-4xl font-black mb-4">
              Hubungi Kami
            </h1>
            <p className="text-indigo-100 max-w-2xl leading-relaxed">
              Punya pertanyaan, ingin memasang lowongan, atau menemukan
              informasi yang perlu diperbaiki? Hubungi kami melalui formulir
              berikut.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-800 transition-colors">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Masukkan nama Anda"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Masukkan email Anda"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Pesan
                </label>
                <textarea
                  required
                  rows="5"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tulis pesan Anda di sini..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition"
              >
                Kirim Pesan
              </button>
            </form>

            <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8">
              <h3 className="font-bold mb-4 text-slate-900 dark:text-white">
                Informasi Kontak Alternatif
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Email: support@lokerlumajang.id
              </p>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                Kabupaten Lumajang, Jawa Timur, Indonesia
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer darkMode={darkMode} />
    </>
  );
}
