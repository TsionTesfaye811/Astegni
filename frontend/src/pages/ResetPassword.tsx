import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword() {
  const { user, resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/learn" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await resetPassword({
        token,
        email,
        password,
        passwordConfirmation: confirmPassword,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFC] px-4 py-12">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-10">
        {success ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-slate-900">Password Reset Successful</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your Astegni password has been changed successfully.
            </p>
            <Link
              to="/login"
              className="mt-8 flex w-full items-center justify-center rounded-xl bg-[#2563EB] py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              GO TO LOGIN
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-7 text-center">
              <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-slate-900">Reset Password</h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Create a new password for your Astegni account.
              </p>
            </div>

            {(!token || !email) && (
              <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                This reset link is missing required details. Please request a new reset link.
              </div>
            )}

            <form onSubmit={submit} className="space-y-5" noValidate>
              <label className="block text-sm font-semibold text-slate-700">New Password
                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter a new password"
                    className="w-full rounded-xl border border-slate-200 py-3 px-4 pr-11 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
                  />
                  <button type="button" onClick={() => setShowPassword(value => !value)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle password visibility">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <label className="block text-sm font-semibold text-slate-700">Confirm Password
                <div className="relative mt-2">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full rounded-xl border border-slate-200 py-3 px-4 pr-11 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
                  />
                  <button type="button" onClick={() => setShowConfirm(value => !value)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle confirm password visibility">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <p className="text-xs text-slate-500">Password must be at least 8 characters.</p>

              {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

              <button
                disabled={submitting || !token || !email}
                className="flex w-full items-center justify-center rounded-xl bg-[#2563EB] py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Resetting..." : "RESET PASSWORD"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
