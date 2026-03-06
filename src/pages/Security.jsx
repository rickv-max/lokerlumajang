import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Security({ darkMode, setDarkMode }) {
  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="pt-24 min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors">
        {/* HERO */}
        <section className="max-w-6xl mx-auto px-6 mb-16">
          <div className="bg-red-600 rounded-3xl p-10 md:p-14 text-white shadow-2xl shadow-red-600/20">
            <h1 className="text-3xl md:text-4xl font-black mb-4">
              Pusat Keamanan
            </h1>
            <p className="text-red-100 max-w-2xl leading-relaxed">
              Lindungi diri Anda dari penipuan lowongan kerja. Pelajari cara
              mengenali dan menghindari praktik rekrutmen palsu.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-800 transition-colors space-y-10">
            <Section
              number="1"
              title="Waspada Lowongan yang Meminta Biaya"
              content={`Perusahaan resmi tidak pernah meminta biaya administrasi, biaya pelatihan, atau biaya seragam sebelum proses kerja dimulai.

Jika Anda diminta transfer uang, segera hentikan komunikasi.`}
            />

            <Section
              number="2"
              title="Periksa Identitas Perusahaan"
              content={`Pastikan perusahaan memiliki:
- Alamat jelas
- Website resmi
- Kontak yang dapat diverifikasi

Cari nama perusahaan di Google untuk memastikan reputasinya.`}
            />

            <Section
              number="3"
              title="Jangan Berikan Data Sensitif"
              content={`Hindari memberikan:
- Foto KTP
- Nomor rekening
- Password akun pribadi
- Kode OTP

Data tersebut sangat sensitif dan dapat disalahgunakan.`}
            />

            <Section
              number="4"
              title="Gunakan Akal Sehat"
              content={`Jika tawaran kerja terdengar terlalu bagus untuk menjadi kenyataan (gaji tinggi tanpa pengalaman), maka kemungkinan besar itu mencurigakan.`}
            />

            <Section
              number="5"
              title="Laporkan Lowongan Mencurigakan"
              content={`Jika Anda menemukan lowongan yang mencurigakan di LokerLumajang.id, silakan hubungi kami melalui halaman Kontak agar dapat segera ditinjau dan ditindaklanjuti.`}
            />

            <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                Keamanan Anda adalah prioritas kami. Selalu berhati-hati dalam
                setiap proses melamar kerja.
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
