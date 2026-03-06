import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Privacy({ darkMode, setDarkMode }) {
  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="pt-24 min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors">
        {/* HERO */}
        <section className="max-w-6xl mx-auto px-6 mb-16">
          <div className="bg-indigo-600 rounded-3xl p-10 md:p-14 text-white shadow-2xl shadow-indigo-600/20">
            <h1 className="text-3xl md:text-4xl font-black mb-4">
              Kebijakan Privasi
            </h1>
            <p className="text-indigo-100 max-w-2xl leading-relaxed">
              Halaman ini menjelaskan bagaimana LokerLumajang.id mengumpulkan,
              menggunakan, dan melindungi informasi pengguna.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-800 transition-colors">
            <Intro />

            <Divider />

            <Section
              number="1"
              title="Informasi yang Kami Kumpulkan"
              content={`Kami dapat mengumpulkan informasi seperti:
- Nama dan alamat email (jika pengguna mengisi formulir)
- Alamat IP dan data perangkat
- Aktivitas pengguna di dalam website

Informasi ini dikumpulkan untuk meningkatkan kualitas layanan dan pengalaman pengguna.`}
            />

            <Divider />

            <Section
              number="2"
              title="Penggunaan Informasi"
              content={`Informasi digunakan untuk:
- Menyediakan layanan informasi lowongan kerja
- Menjawab pertanyaan pengguna
- Meningkatkan keamanan dan performa website
- Analisis statistik penggunaan website`}
            />

            <Divider />

            <Section
              number="3"
              title="Cookie dan Teknologi Pelacakan"
              content={`Website ini menggunakan cookie untuk memahami preferensi pengguna dan meningkatkan pengalaman browsing.

Pengguna dapat menonaktifkan cookie melalui pengaturan browser, namun beberapa fitur mungkin tidak berfungsi optimal.`}
            />

            <Divider />

            <Section
              number="4"
              title="Keamanan Data"
              content={`Kami menerapkan langkah-langkah keamanan teknis yang wajar untuk melindungi data pengguna dari akses yang tidak sah.

Namun, perlu dipahami bahwa tidak ada sistem transmisi data melalui internet yang 100% aman.`}
            />

            <Divider />

            <Section
              number="5"
              title="Tautan ke Pihak Ketiga"
              content={`Website ini dapat berisi tautan ke situs eksternal seperti WhatsApp atau email perusahaan.

Kami tidak bertanggung jawab atas kebijakan privasi atau konten di situs pihak ketiga tersebut.`}
            />

            <Divider />

            <Section
              number="6"
              title="Perubahan Kebijakan"
              content={`Kebijakan Privasi ini dapat diperbarui sewaktu-waktu.

Perubahan akan berlaku segera setelah dipublikasikan di halaman ini.`}
            />

            <p className="mt-12 text-sm text-slate-500 dark:text-slate-500">
              Terakhir diperbarui: 2026
            </p>
          </div>
        </section>
      </main>

      <Footer darkMode={darkMode} />
    </>
  );
}

/* COMPONENTS */

function Intro() {
  return (
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
      LokerLumajang.id menghargai privasi setiap pengguna. Kebijakan ini dibuat
      untuk menjelaskan bagaimana kami mengelola informasi yang dikumpulkan
      melalui website ini.
    </p>
  );
}

function Section({ number, title, content }) {
  return (
    <div className="py-6">
      <h2 className="text-lg md:text-xl font-bold mb-4 text-slate-900 dark:text-white">
        {number}. {title}
      </h2>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}

function Divider() {
  return (
    <div className="border-t border-slate-200 dark:border-slate-800 my-6"></div>
  );
}
