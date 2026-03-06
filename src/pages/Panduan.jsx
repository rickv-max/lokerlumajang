import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Panduan({ darkMode, setDarkMode }) {
  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="pt-24 min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors">
        {/* HERO */}
        <section className="max-w-6xl mx-auto px-6 mb-16">
          <div className="bg-indigo-600 rounded-3xl p-10 md:p-14 text-white shadow-2xl shadow-indigo-600/20">
            <h1 className="text-3xl md:text-4xl font-black mb-4">
              Panduan Lamar Kerja
            </h1>
            <p className="text-indigo-100 max-w-2xl leading-relaxed">
              Tips dan langkah praktis agar lamaran kerja Anda lebih menarik dan
              meningkatkan peluang diterima.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-800 transition-colors space-y-10">
            <Section
              number="1"
              title="Siapkan CV yang Profesional"
              content={`Pastikan CV Anda:
- Rapi dan mudah dibaca
- Tidak lebih dari 1–2 halaman
- Memuat pengalaman kerja relevan
- Mencantumkan kontak yang aktif

Gunakan bahasa yang jelas dan hindari kesalahan penulisan.`}
            />

            <Section
              number="2"
              title="Buat Surat Lamaran yang Singkat dan Jelas"
              content={`Surat lamaran sebaiknya:
- Disesuaikan dengan posisi yang dilamar
- Menjelaskan alasan Anda cocok untuk posisi tersebut
- Menggunakan bahasa formal dan sopan`}
            />

            <Section
              number="3"
              title="Perhatikan Detail Lowongan"
              content={`Sebelum melamar:
- Baca seluruh deskripsi pekerjaan
- Pastikan memenuhi kualifikasi
- Ikuti instruksi cara melamar dengan benar`}
            />

            <Section
              number="4"
              title="Persiapan Interview"
              content={`Jika dipanggil interview:
- Pelajari profil perusahaan
- Datang tepat waktu
- Berpakaian rapi dan sopan
- Jawab pertanyaan dengan percaya diri`}
            />

            <Section
              number="5"
              title="Waspada Penipuan"
              content={`Hindari lowongan yang:
- Meminta biaya administrasi
- Meminta transfer uang
- Meminta data pribadi sensitif secara berlebihan

Perusahaan resmi tidak akan meminta biaya dalam proses rekrutmen.`}
            />

            <Section
              number="6"
              title="Terus Tingkatkan Skill"
              content={`Tingkatkan kemampuan Anda melalui:
- Kursus online
- Pelatihan kerja
- Pengalaman magang
- Belajar mandiri

Semakin tinggi skill, semakin besar peluang diterima kerja.`}
            />

            <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800">
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                Semangat mencari kerja! Konsistensi dan usaha yang tepat akan
                membawa Anda lebih dekat ke pekerjaan impian.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer darkMode={darkMode} />
    </>
  );
}

/* COMPONENT */

function Section({ number, title, content }) {
  return (
    <div>
      <h2 className="text-lg md:text-xl font-bold mb-4 text-slate-900 dark:text-white">
        {number}. {title}
      </h2>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}
