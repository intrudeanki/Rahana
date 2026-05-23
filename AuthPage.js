import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Heart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AUTH_BG = "https://images.unsplash.com/photo-1765498068971-e2ab8f2a2ec0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwyfHxtaW5pbWFsaXN0JTIwc2FuZCUyMGR1bmVzJTIwYWVzdGhldGljfGVufDB8fHx8MTc3NDA4NzM1OHww&ixlib=rb-4.1.0&q=85";

export default function AuthPage({ api, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin ? { email, password } : { name, email, password };
      const { data } = await axios.post(`${api}${endpoint}`, payload);
      onLogin(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Let's try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen flex" data-testid="auth-page">
      {/* Left: Image */}
      <div className="hidden lg:block lg:w-[60%] relative overflow-hidden">
        <img
          src={AUTH_BG}
          alt="Calming sand dunes"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(1.05) saturate(0.9)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#F9F8F6]/30" />
        <div className="absolute bottom-12 left-12 max-w-md">
          <h2 className="text-3xl text-white font-light tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
            A companion that truly understands
          </h2>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-[40%] flex items-center justify-center px-8 py-12 bg-[#F9F8F6]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-full bg-[#8BA888]/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#8BA888]" strokeWidth={1.5} />
            </div>
            <span className="text-2xl tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2C332A" }}>
              EmoChat
            </span>
          </div>

          <h1
            className="text-3xl mb-2 font-light"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2C332A" }}
            data-testid="auth-title"
          >
            {isLogin ? "Welcome back" : "Begin your journey"}
          </h1>
          <p className="text-sm mb-10" style={{ color: "#8A9488" }}>
            {isLogin
              ? "Your companion is waiting for you."
              : "Create a space for meaningful conversations."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-xs tracking-wide uppercase mb-2" style={{ color: "#8A9488", fontFamily: "'Figtree', sans-serif" }}>
                    Your name
                  </label>
                  <input
                    data-testid="auth-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="How should I call you?"
                    required={!isLogin}
                    className="w-full px-5 py-3.5 rounded-full bg-white border border-stone-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#8BA888]/30 transition-colors duration-300 placeholder:text-[#8A9488]/60"
                    style={{ color: "#2C332A" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs tracking-wide uppercase mb-2" style={{ color: "#8A9488", fontFamily: "'Figtree', sans-serif" }}>
                Email
              </label>
              <input
                data-testid="auth-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-5 py-3.5 rounded-full bg-white border border-stone-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#8BA888]/30 transition-colors duration-300 placeholder:text-[#8A9488]/60"
                style={{ color: "#2C332A" }}
              />
            </div>

            <div>
              <label className="block text-xs tracking-wide uppercase mb-2" style={{ color: "#8A9488", fontFamily: "'Figtree', sans-serif" }}>
                Password
              </label>
              <div className="relative">
                <input
                  data-testid="auth-password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="A secret between us"
                  required
                  className="w-full px-5 py-3.5 rounded-full bg-white border border-stone-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#8BA888]/30 transition-colors duration-300 pr-12 placeholder:text-[#8A9488]/60"
                  style={{ color: "#2C332A" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A9488] hover:text-[#5C665A] transition-colors duration-300"
                  data-testid="toggle-password-visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs px-4 py-2.5 rounded-xl bg-[#D38C7D]/10 text-[#D38C7D]"
                data-testid="auth-error"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              data-testid="auth-submit-button"
              className="w-full py-3.5 rounded-full bg-[#8BA888] text-white text-sm font-medium flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg transition-transform duration-300 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  {isLogin ? "Welcome me in" : "Start my journey"}
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-8" style={{ color: "#8A9488" }}>
            {isLogin ? "New here? " : "Already have an account? "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-[#8BA888] hover:text-[#6B8868] underline underline-offset-4 transition-colors duration-300"
              data-testid="auth-toggle-mode"
            >
              {isLogin ? "Create a space" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
    </>
  );
}