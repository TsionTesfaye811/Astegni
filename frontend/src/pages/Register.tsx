import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, GraduationCap, School } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const GRADES = ["9", "10", "11", "12"];

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    grade: "12",
    school: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  if (user) return <Navigate to="/learn" replace />;

  const validation = useMemo(() => {
    const issues: string[] = [];
    if (form.name.trim().length < 2) issues.push("Full name must be at least 2 characters.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) issues.push("Enter a valid email address.");
    if (form.password.length < 6) issues.push("Password must be at least 6 characters.");
    if (form.password !== form.confirmPassword) issues.push("Passwords do not match.");
    if (!form.school.trim()) issues.push("School name is required.");
    return issues;
  }, [form]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (validation.length > 0) {
      setError(validation[0]);
      return;
    }
    const result = register({
      name: form.name,
      email: form.email,
      password: form.password,
      grade: form.grade,
      school: form.school,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/learn", { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFC] px-4 py-10">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-10">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-slate-900">Join Astegni</h1>
          <p className="mt-2 text-sm text-slate-500">Create your student account to start learning Grades 9–12.</p>
        </div>

        <form onSubmit={submit} className="space-y-5" noValidate>
          <Field label="Full name">
            <input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Your full name" className={inputClass} />
          </Field>
          <Field label="Email address">
            <input type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" className={inputClass} />
          </Field>

          <Field label="Password">
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={event => setForm({ ...form, password: event.target.value })}
                placeholder="At least 6 characters"
                className={`${inputClass} mt-0 pr-11`}
              />
              <button type="button" onClick={() => setShowPassword(value => !value)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle password visibility">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>

          <Field label="Confirm password">
            <div className="relative mt-2">
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={event => setForm({ ...form, confirmPassword: event.target.value })}
                placeholder="Re-enter your password"
                className={`${inputClass} mt-0 pr-11`}
              />
              <button type="button" onClick={() => setShowConfirm(value => !value)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle confirm password visibility">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Grade">
              <select value={form.grade} onChange={event => setForm({ ...form, grade: event.target.value })} className={inputClass}>
                {GRADES.map(grade => <option key={grade} value={grade}>Grade {grade}</option>)}
              </select>
            </Field>
            <Field label="School">
              <div className="relative">
                <School className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={form.school} onChange={event => setForm({ ...form, school: event.target.value })} placeholder="Your school name" className={`${inputClass} pl-10`} />
              </div>
            </Field>
          </div>

          {(error || (touched && validation.length > 0)) && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error || validation[0]}
            </div>
          )}

          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">
            Create student account <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-bold text-[#2563EB]">Log in</Link>
        </p>
        <p className="mt-3 text-center text-xs text-slate-400">
          Want to teach? Register as a student first, then apply to become a tutor from your account.
        </p>
      </div>
    </div>
  );
}

const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold text-slate-700">{label}{children}</label>;
}
