import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Disclaimer({ darkMode, setDarkMode }) {
  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="pt-24 min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors">
        {/* HERO */}
        <section className="max-w-6xl mx-auto px-6 mb-16">
          <div className="bg-indigo-600 rounded-3xl p-10 md:p-14 text-white shadow-2xl shadow-indigo-600/20">
            <h1 className="text-3xl md:text-4xl font-black mb-4">Disclaimer</h1>
            <p className="text-indigo-100 max-w-2xl leading-relaxed">
              Informasi yang disediakan di LokerLumajang.id ditujukan untuk
              tujuan informasi umum mengenai lowongan kerja.
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
              title="Sumber Informasi"
              content={`Informasi lowongan kerja dapat berasal dari:
- Kiriman perusahaan
- Media sosial
- Sumber publik lainnya

Kami berusaha mencantumkan sumber jika tersedia.`}
            />

            <Divider />

            <Section
              number="2"
              title="Tidak Menjamin Rekrutmen"
              content={`LokerLumajang.id bukan bagian dari perusahaan yang membuka lowongan.

Kami tidak terlibat dalam proses seleksi, wawancara, maupun keputusan penerimaan kerja.`}
            />

            <Divider />

            <Section
              number="3"
              title="Tanggung Jawab Pengguna"
              content={`Segala keputusan melamar pekerjaan sepenuhnya menjadi tanggung jawab pengguna.

Pengguna disarankan untuk:
- Memastikan keaslian perusahaan
- Tidak mentransfer uang dalam proses rekrutmen
- Menghindari permintaan data sensitif yang mencurigakan`}
            />

            <Divider />

            <Section
              number="4"
              title="Kerugian dan Risiko"
              content={`Kami tidak bertanggung jawab atas:
- Kerugian finansial
- Penipuan oleh pihak ketiga
- Kesalahan informasi dari sumber asli`}
            />

            <Divider />

            <Section
              number="5"
              title="Iklan dan Konten Pihak Ketiga"
              content={`Website ini dapat menampilkan iklan pihak ketiga melalui Google AdSense atau platform lainnya.

Kami tidak memiliki kontrol atas konten atau kebijakan pihak pengiklan tersebut.`}
            />

            <Divider />

            <Section
              number="6"
              title="Perubahan Disclaimer"
              content={`Disclaimer ini dapat diperbarui sewaktu-waktu tanpa pemberitahuan sebelumnya.`}
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
      Semua informasi yang dipublikasikan di website ini disediakan dengan
      itikad baik dan untuk tujuan informasi umum saja.
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
