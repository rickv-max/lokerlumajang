import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About({ darkMode, setDarkMode }) {
  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="pt-24 min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors">
        {/* HERO */}
        <section className="max-w-6xl mx-auto px-6 mb-16">
          <div className="bg-indigo-600 rounded-3xl p-10 md:p-14 text-white shadow-2xl shadow-indigo-600/20">
            <h1 className="text-3xl md:text-4xl font-black mb-4">
              Tentang LokerLumajang.id
            </h1>
            <p className="text-indigo-100 max-w-2xl leading-relaxed">
              Platform informasi lowongan kerja terpercaya untuk masyarakat
              Kabupaten Lumajang dan sekitarnya.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-800 transition-colors">
            <Section
              title="Visi Kami"
              content={`Menjadi platform informasi lowongan kerja lokal yang terpercaya, transparan, dan membantu masyarakat Lumajang mendapatkan pekerjaan dengan mudah.`}
            />

            <Divider />

            <Section
              title="Misi Kami"
              content={`- Menyediakan informasi lowongan kerja yang jelas dan terstruktur
- Membantu perusahaan lokal menjangkau kandidat potensial
- Mengedukasi pencari kerja melalui artikel dan panduan
- Mengurangi risiko penipuan lowongan kerja`}
            />

            <Divider />

            <Section
              title="Apa yang Kami Lakukan?"
              content={`LokerLumajang.id mengumpulkan dan mempublikasikan informasi lowongan kerja dari berbagai sumber terpercaya seperti:
- Kiriman langsung dari perusahaan
- Media sosial resmi perusahaan
- Sumber publik lainnya

Kami menampilkan informasi secara detail agar mudah dipahami oleh pencari kerja.`}
            />

            <Divider />

            <Section
              title="Komitmen Keamanan"
              content={`Kami berkomitmen untuk menjaga keamanan informasi pengguna dan terus meningkatkan kualitas layanan.

Kami juga mengingatkan pengguna untuk selalu waspada terhadap lowongan yang meminta biaya administrasi.`}
            />

            <Divider />

            <Section
              title="Hubungi Kami"
              content={`Jika Anda memiliki pertanyaan, ingin memasang lowongan, atau menemukan informasi yang perlu diperbaiki, silakan hubungi kami melalui halaman Kontak.`}
            />

            <div className="mt-12 p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800">
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                LokerLumajang.id hadir untuk membantu masyarakat Lumajang
                mendapatkan akses informasi kerja yang lebih mudah dan aman.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer darkMode={darkMode} />
    </>
  );
}

/* COMPONENTS */

function Section({ title, content }) {
  return (
    <div className="py-6">
      <h2 className="text-lg md:text-xl font-bold mb-4 text-slate-900 dark:text-white">
        {title}
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
