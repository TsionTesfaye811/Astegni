import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const { user, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (user) return <Navigate to="/learn" replace />;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Please enter your account email.");
      return;
    }
    if (password.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = resetPassword(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSuccess(true);
    setTimeout(() => navigate("/login", { replace: true }), 1500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFC] px-4 py-12">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-10">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-slate-900">Reset password</h1>
          <p className="mt-2 text-sm text-slate-500">Enter your account email and choose a new password.</p>
        </div>

        <form onSubmit={submit} className="space-y-5" noValidate>
          <label className="block text-sm font-semibold text-slate-700">Email address
            <div className="relative mt-2">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50" />
            </div>
          </label>

          <label className="block text-sm font-semibold text-slate-700">New password
            <div className="relative mt-2">
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" className="w-full rounded-xl border border-slate-200 py-3 px-4 pr-11 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50" />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
          </label>

          <label className="block text-sm font-semibold text-slate-700">Confirm new password
            <div className="relative mt-2">
              <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" className="w-full rounded-xl border border-slate-200 py-3 px-4 pr-11 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50" />
              <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">{showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
          </label>

          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Password updated. Redirecting to login…</div>}

          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">
            Update password <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          Remembered it? <Link to="/login" className="font-bold text-[#2563EB]">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
