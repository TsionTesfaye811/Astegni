import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const { user, requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/learn" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter the email associated with your Astegni account.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await requestPasswordReset(email);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFC] px-4 py-12">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-10">
        {sent ? (
          <>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                <Mail className="h-6 w-6" />
              </div>
              <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-slate-900">Check Your Email</h1>
            </div>
            <p className="text-center text-sm leading-6 text-slate-600">
              If an account exists for this email, we&apos;ve sent you a password reset link.
            </p>
            <p className="mt-3 text-center text-sm leading-6 text-slate-600">
              Please check your inbox and spam folder.
            </p>
            <Link to="/login" className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-[#2563EB] hover:text-blue-700">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </>
        ) : (
          <>
            <div className="mb-7 text-center">
              <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-slate-900">Forgot Password?</h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter the email associated with your Astegni account.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-5" noValidate>
              <label className="block text-sm font-semibold text-slate-700">Email
                <div className="relative mt-2">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </label>

              {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

              <button
                disabled={submitting}
                className="flex w-full items-center justify-center rounded-xl bg-[#2563EB] py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Sending..." : "SEND RESET LINK"}
              </button>
            </form>

            <Link to="/login" className="mt-7 flex items-center justify-center gap-2 text-sm font-bold text-[#2563EB] hover:text-blue-700">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
