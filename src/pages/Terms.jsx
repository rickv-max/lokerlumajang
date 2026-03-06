import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Terms({ darkMode, setDarkMode }) {
  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="pt-24 min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors">
        {/* HERO */}
        <section className="max-w-6xl mx-auto px-6 mb-16">
          <div className="bg-indigo-600 rounded-3xl p-10 md:p-14 text-white shadow-2xl shadow-indigo-600/20">
            <h1 className="text-3xl md:text-4xl font-black mb-4">
              Syarat & Ketentuan
            </h1>
            <p className="text-indigo-100 max-w-2xl leading-relaxed">
              Dengan mengakses dan menggunakan LokerLumajang.id, Anda menyetujui
              seluruh syarat dan ketentuan yang berlaku di halaman ini.
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
              title="Ketentuan Umum"
              content={`Website ini menyediakan informasi lowongan kerja di wilayah Kabupaten Lumajang dan sekitarnya.

Pengguna diwajibkan menggunakan website ini secara bijak dan tidak melanggar hukum yang berlaku.`}
            />

            <Divider />

            <Section
              number="2"
              title="Akurasi Informasi"
              content={`Kami berusaha menampilkan informasi lowongan secara akurat.

Namun, kami tidak menjamin bahwa semua informasi selalu lengkap, terbaru, atau bebas dari kesalahan.

Pengguna disarankan untuk melakukan verifikasi langsung kepada pihak perusahaan.`}
            />

            <Divider />

            <Section
              number="3"
              title="Tanggung Jawab Pengguna"
              content={`Pengguna bertanggung jawab atas:
- Informasi yang dikirimkan melalui formulir
- Komunikasi dengan perusahaan
- Keputusan melamar pekerjaan

LokerLumajang.id tidak terlibat dalam proses rekrutmen langsung.`}
            />

            <Divider />

            <Section
              number="4"
              title="Larangan"
              content={`Pengguna dilarang:
- Menyalahgunakan website untuk aktivitas ilegal
- Menyebarkan spam atau konten berbahaya
- Menggunakan data website tanpa izin

Pelanggaran dapat menyebabkan pembatasan akses.`}
            />

            <Divider />

            <Section
              number="5"
              title="Hak Kekayaan Intelektual"
              content={`Seluruh desain, logo, dan konten website ini adalah milik LokerLumajang.id kecuali disebutkan lain.

Dilarang menyalin atau mendistribusikan tanpa izin tertulis.`}
            />

            <Divider />

            <Section
              number="6"
              title="Perubahan Layanan"
              content={`Kami berhak mengubah, menghentikan, atau memperbarui layanan tanpa pemberitahuan sebelumnya.`}
            />

            <Divider />

            <Section
              number="7"
              title="Batasan Tanggung Jawab"
              content={`LokerLumajang.id tidak bertanggung jawab atas:
- Kerugian akibat kesalahan informasi
- Penipuan yang dilakukan oleh pihak ketiga
- Gangguan teknis di luar kendali kami`}
            />

            <Divider />

            <Section
              number="8"
              title="Perubahan Syarat & Ketentuan"
              content={`Syarat & Ketentuan ini dapat diperbarui sewaktu-waktu dan berlaku segera setelah dipublikasikan.`}
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
      Dengan mengakses website ini, Anda dianggap telah membaca, memahami, dan
      menyetujui seluruh isi Syarat & Ketentuan yang berlaku.
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
