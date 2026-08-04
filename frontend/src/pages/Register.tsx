import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, GraduationCap, MapPin, UserRound } from "lucide-react";
import { SUBJECT_DEFS } from "../data";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../context/AuthContext";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<UserRole>(searchParams.get("role") === "tutor" ? "tutor" : "student");
  const [form, setForm] = useState({ name: "", email: "", password: "", location: "", experience: 1, phone: "" });
  const [subjects, setSubjects] = useState<string[]>([]);

  if (user) return <Navigate to="/learn" replace />;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (role === "tutor" && subjects.length === 0) return;
    register({
      name: form.name,
      email: form.email,
      password: form.password,
      role,
      tutor: role === "tutor"
        ? { subjects, experience: form.experience, location: form.location, phone: form.phone }
        : undefined,
    });
    navigate(role === "tutor" ? "/tutors" : "/learn");
  };

  const toggleSubject = (subject: string) => setSubjects(current => current.includes(subject) ? current.filter(item => item !== subject) : [...current, subject]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFC] px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-10">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200"><GraduationCap className="h-6 w-6" /></div>
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-slate-900">Join Astegni</h1>
          <p className="mt-2 text-sm text-slate-500">Create your account and become part of Ethiopia's learning community.</p>
        </div>

        <div className="mb-7 grid grid-cols-2 gap-3 rounded-2xl bg-slate-100 p-1.5">
          {([{ id: "student", label: "I'm a Student", icon: UserRound }, { id: "tutor", label: "I'm a Tutor", icon: BriefcaseBusiness }] as const).map(option => {
            const Icon = option.icon;
            return <button type="button" key={option.id} onClick={() => setRole(option.id)} className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition ${role === option.id ? "bg-white text-[#2563EB] shadow-sm" : "text-slate-500"}`}><Icon className="h-4 w-4" />{option.label}</button>;
          })}
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name"><input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Your full name" className={inputClass} /></Field>
            <Field label="Email address"><input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" className={inputClass} /></Field>
          </div>
          <Field label="Password"><input required minLength={6} type="password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} placeholder="At least 6 characters" className={inputClass} /></Field>

          {role === "tutor" && (
            <div className="space-y-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
              <div>
                <div className="mb-3 text-sm font-semibold text-slate-700">Subjects you teach <span className="text-red-500">*</span></div>
                <div className="flex flex-wrap gap-2">{SUBJECT_DEFS.map(subject => <button type="button" key={subject.id} onClick={() => toggleSubject(subject.name)} className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${subjects.includes(subject.name) ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"}`}>{subject.name}</button>)}</div>
                {subjects.length === 0 && <p className="mt-2 text-xs text-slate-500">Select at least one subject.</p>}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Years of experience"><div className="relative"><BriefcaseBusiness className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required min={0} max={50} type="number" value={form.experience} onChange={event => setForm({ ...form, experience: Number(event.target.value) })} className={`${inputClass} pl-10`} /></div></Field>
                <Field label="Location"><div className="relative"><MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input required value={form.location} onChange={event => setForm({ ...form, location: event.target.value })} placeholder="Addis Ababa" className={`${inputClass} pl-10`} /></div></Field>
              </div>
              <Field label="Phone number"><input required value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} placeholder="+251 9XX XXX XXX" className={inputClass} /></Field>
            </div>
          )}

          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">Create {role} account <ArrowRight className="h-4 w-4" /></button>
        </form>
        <p className="mt-7 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="font-bold text-[#2563EB]">Log in</Link></p>
      </div>
    </div>
  );
}

const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold text-slate-700">{label}{children}</label>;
}
