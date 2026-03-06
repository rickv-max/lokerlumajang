import { useNavigate } from "react-router-dom";
import { Briefcase, Sun, Moon } from "lucide-react";

export default function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  return (
    <nav
      className={`sticky top-0 z-50 border-b backdrop-blur-lg ${
        darkMode
          ? "bg-slate-900/80 border-slate-800"
          : "bg-white/80 border-slate-200"
      }`}
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

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-xl ${
            darkMode
              ? "bg-slate-800 text-yellow-400"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
}
