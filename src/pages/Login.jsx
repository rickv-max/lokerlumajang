import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (userCredential.user.email !== "rickpipor@gmail.com") {
        setErrorMsg("Akun ini bukan admin.");
        setLoading(false);
        return;
      }

      navigate("/admin");
    } catch (error) {
      setErrorMsg("Email atau password salah.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full -top-20 -left-20"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full bottom-0 right-0"></div>

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-[380px] p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-300"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <ShieldCheck className="text-white" size={28} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Admin Login
          </h2>
          <p className="text-sm text-slate-400">LokerLumajang.id Dashboard</p>
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
          <input
            type="email"
            placeholder="Email admin"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3.5 text-slate-400 hover:text-white transition"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="text-sm text-red-400 text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Memproses..." : "Masuk ke Dashboard"}
        </button>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 pt-2">
          © 2026 LokerLumajang.id
        </div>
      </form>
    </div>
  );
}
