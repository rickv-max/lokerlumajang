import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";

export default function CookieBanner({ darkMode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");

    if (!consent) {
      setTimeout(() => {
        setVisible(true);
      }, 1200); // delay biar smooth
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-xl animate-[slideUp_.4s_ease]">
      <div
        className={`rounded-2xl p-6 shadow-2xl border flex flex-col md:flex-row items-start md:items-center gap-4
        ${
          darkMode
            ? "bg-slate-900 border-slate-800 text-slate-300"
            : "bg-white border-slate-200 text-slate-600"
        }`}
      >
        {/* ICON */}
        <div className="p-2 rounded-xl bg-indigo-600 text-white">
          <Cookie size={20} />
        </div>

        {/* TEXT */}
        <p className="text-sm flex-1 leading-relaxed">
          Website ini menggunakan cookie untuk meningkatkan pengalaman pengguna.
          Dengan menggunakan website ini Anda menyetujui{" "}
          <a
            href="/privacy"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Kebijakan Privasi
          </a>
          .
        </p>

        {/* BUTTON */}
        <div className="flex gap-2">
          <button
            onClick={rejectCookies}
            className="px-4 py-2 text-sm rounded-xl border font-semibold
            hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Tolak
          </button>

          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700"
          >
            Terima
          </button>
        </div>
      </div>
    </div>
  );
}
