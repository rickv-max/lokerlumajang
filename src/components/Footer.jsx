import { Link } from "react-router-dom";
import {
  Briefcase,
  Instagram,
  Facebook,
  Twitter,
  ChevronRight,
} from "lucide-react";

export default function Footer({ darkMode }) {
  return (
    <footer
      className={`border-t py-20 px-4 transition-colors ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Briefcase className="text-white w-4 h-4" />
            </div>
            <span
              className={`font-black text-xl ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Loker<span className="text-indigo-600">Lumajang.id</span>
            </span>
          </div>

          <p className="text-sm text-slate-400">
            Solusi cerdas mencari kerja di Kabupaten Lumajang.
          </p>
        </div>

        <ul className="space-y-4 text-sm font-medium">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/about">Tentang Kami</Link>
          </li>
          <li>
            <Link to="/disclaimer">Disclaimer</Link>
          </li>
          <li>
            <Link to="/contact">Hubungi Kami</Link>
          </li>
        </ul>

        <ul className="space-y-4 text-sm font-medium">
          <li>
            <Link to="/security">Pusat Keamanan</Link>
          </li>
          <li>
            <Link to="/terms">Syarat & Ketentuan</Link>
          </li>
          <li>
            <Link to="/privacy">Kebijakan Privasi</Link>
          </li>
          <li>
            <Link to="/panduan">Panduan Lamar Kerja</Link>
          </li>
        </ul>

        <div
          className={`p-6 rounded-3xl ${
            darkMode ? "bg-slate-800" : "bg-slate-50"
          }`}
        >
          <h4 className="font-bold mb-2 text-sm">Berlangganan Loker</h4>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Email Anda"
              className="flex-1 px-3 py-2 rounded-xl text-xs border"
            />
            <button className="p-2 bg-indigo-600 text-white rounded-xl">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="text-center pt-16 mt-16 border-t text-xs text-slate-400">
        © 2026 LokerLumajang.id
      </div>
    </footer>
  );
}
