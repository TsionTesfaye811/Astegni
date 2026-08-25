import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Eye, EyeOff, GraduationCap, LockKeyhole, Mail } from "lucide-react";
import { getRememberedEmail, useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const rememberedEmail = getRememberedEmail();
  const [email, setEmail] = useState(rememberedEmail);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedEmail));
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fromPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  if (user) {
    return <Navigate to={fromPath && fromPath !== "/login" ? fromPath : "/learn"} replace />;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await login(email, password, rememberMe);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      navigate(fromPath && fromPath !== "/login" ? fromPath : "/learn", { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFC] px-4 py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[1fr_1.05fr]">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#0A1F5C] via-[#1344C8] to-[#2563EB] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-2 font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold"><GraduationCap className="h-7 w-7 text-amber-300" /> Astegni</div>
          <div className="relative">
            <span className="mb-4 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-blue-100">WELCOME BACK</span>
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl font-extrabold leading-tight">Continue building your future.</h1>
            <p className="mt-4 text-blue-100/80">Return to your lessons, progress, tutors, and national exam preparation in one focused learning space.</p>
          </div>
          <div className="relative flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-blue-50"><BookOpen className="h-5 w-5 text-amber-300" /> Ethiopian curriculum · Grades 9–12</div>
        </div>

        <div className="p-7 sm:p-12">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-widest text-[#2563EB]">Sign in</p>
            <h2 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">Use your account email to continue learning.</p>
          </div>
          <form onSubmit={submit} className="space-y-5" noValidate>
            <label className="block text-sm font-semibold text-slate-700">Email address
              <div className="relative mt-2"><Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50" /></div>
            </label>
            <label className="block text-sm font-semibold text-slate-700">Password
              <div className="relative mt-2"><LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type={showPassword ? "text" : "password"} value={password} onChange={event => setPassword(event.target.value)} placeholder="Your password" className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-11 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50" /><button type="button" onClick={() => setShowPassword(value => !value)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle password visibility">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={event => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm font-bold text-[#2563EB] hover:text-blue-700">Forgot password?</Link>
            </div>

            {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">{submitting ? "Logging in..." : "Log in"} <ArrowRight className="h-4 w-4" /></button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-500">Don&apos;t have an account? <Link to="/register" className="font-bold text-[#2563EB]">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
}
