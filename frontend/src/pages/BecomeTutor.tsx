import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Pencil } from "lucide-react";
import { SUBJECT_DEFS, getTutorById } from "../data";
import { useAuth } from "../context/AuthContext";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const DEFAULT_HIGHLIGHTS = [
  "Experienced in Ethiopian MOE curriculum",
  "Fluent in Amharic and English",
  "Proven exam success record",
  "Patient, structured teaching method",
];

export default function BecomeTutor() {
  const { user, becomeTutor, updateTutorProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = location.pathname.includes("edit-tutor-profile");
  const existingTutor = useMemo(() => (user ? getTutorById(user.id) : undefined), [user]);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: { pathname: isEdit ? "/edit-tutor-profile" : "/become-tutor" } }} />;
  }

  // Students trying to edit → become tutor first
  if (isEdit && user.role !== "tutor") {
    return <Navigate to="/become-tutor" replace />;
  }

  // Existing tutors opening become-tutor → send to edit
  if (!isEdit && user.role === "tutor") {
    return <Navigate to="/edit-tutor-profile" replace />;
  }

  return (
    <TutorForm
      key={isEdit ? `edit-${user.id}` : "create"}
      isEdit={isEdit}
      userName={user.name}
      initial={{
        subjects: existingTutor?.subjects ?? [],
        days: existingTutor?.availabilityDays?.length ? existingTutor.availabilityDays : ["Mon", "Tue", "Thu", "Fri"],
        highlights: existingTutor?.highlights?.length ? existingTutor.highlights : DEFAULT_HIGHLIGHTS,
        phone: existingTutor?.phone || user.profile.phone || "",
        age: String(existingTutor?.age ?? user.profile.age ?? 25),
        bio: existingTutor?.bio || "",
        education: existingTutor?.education || "",
        location: existingTutor?.location || user.profile.city || "",
        experience: String(existingTutor?.experience ?? 1),
        sessionMinutes: String(existingTutor?.sessionMinutes ?? 60),
      }}
      onSubmit={(payload) => {
        if (isEdit) updateTutorProfile(payload);
        else becomeTutor(payload);
        navigate(`/tutors/${user.id}`, { replace: true });
      }}
    />
  );
}

function TutorForm({
  isEdit,
  initial,
  onSubmit,
}: {
  isEdit: boolean;
  userName: string;
  initial: {
    subjects: string[];
    days: string[];
    highlights: string[];
    phone: string;
    age: string;
    bio: string;
    education: string;
    location: string;
    experience: string;
    sessionMinutes: string;
  };
  onSubmit: (payload: {
    subjects: string[];
    phone: string;
    age: number;
    bio: string;
    education: string;
    highlights: string[];
    location: string;
    experience: number;
    availability: { days: string[]; sessionMinutes: number };
  }) => void;
}) {
  const [subjects, setSubjects] = useState<string[]>(initial.subjects);
  const [days, setDays] = useState<string[]>(initial.days);
  const [highlights, setHighlights] = useState<string[]>(initial.highlights);
  const [form, setForm] = useState({
    phone: initial.phone,
    age: initial.age,
    bio: initial.bio,
    education: initial.education,
    location: initial.location,
    experience: initial.experience,
    sessionMinutes: initial.sessionMinutes,
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const toggleSubject = (name: string) => setSubjects(current => current.includes(name) ? current.filter(item => item !== name) : [...current, name]);
  const toggleDay = (day: string) => setDays(current => current.includes(day) ? current.filter(item => item !== day) : [...current, day]);
  const toggleHighlight = (item: string) => setHighlights(current => current.includes(item) ? current.filter(value => value !== item) : [...current, item]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (subjects.length === 0) {
      setError("Select at least one subject.");
      return;
    }
    if (days.length === 0) {
      setError("Select at least one available day.");
      return;
    }
    if (highlights.length === 0) {
      setError("Select at least one teaching highlight.");
      return;
    }
    if (!form.phone.trim() || !form.bio.trim() || !form.education.trim() || !form.location.trim()) {
      setError("Please fill in phone, education, biography, and location.");
      return;
    }

    onSubmit({
      subjects,
      phone: form.phone.trim(),
      age: Number(form.age),
      bio: form.bio.trim(),
      education: form.education.trim(),
      highlights,
      location: form.location.trim(),
      experience: Number(form.experience),
      availability: { days, sessionMinutes: Number(form.sessionMinutes) },
    });
    setSaved(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFC] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className={`mb-6 rounded-3xl border p-7 shadow-xl ${isEdit ? "border-blue-200 bg-gradient-to-br from-blue-600 to-indigo-700 text-white" : "border-amber-200 bg-gradient-to-br from-amber-400 to-orange-500 text-amber-950"}`}>
          <div className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold ${isEdit ? "bg-white/20" : "bg-white/30"}`}>
            {isEdit ? <Pencil className="h-3.5 w-3.5" /> : <BriefcaseBusiness className="h-3.5 w-3.5" />}
            {isEdit ? "Edit Tutor Profile" : "Become a Tutor"}
          </div>
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold">
            {isEdit ? "Update your tutor profile" : "Share your expertise on Astegni"}
          </h1>
          <p className={`mt-2 ${isEdit ? "text-blue-100" : "text-amber-950/80"}`}>
            {isEdit
              ? "Change your subjects, bio, education, highlights, location, and weekly availability anytime."
              : "Fill in the same details students see on a tutor profile: subjects, bio, education, highlights, location, and weekly availability."}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <section className="space-y-4">
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-extrabold text-slate-900">Subjects you teach</h2>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_DEFS.map(subject => (
                <button key={subject.id} type="button" onClick={() => toggleSubject(subject.name)}
                  className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${subjects.includes(subject.name) ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 text-slate-600 hover:border-blue-300"}`}>
                  {subject.name}
                </button>
              ))}
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone number"><input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+251 9XX XXX XXX" /></Field>
            <Field label="Age"><input required min={18} max={80} type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} className={inputClass} /></Field>
            <Field label="Years of experience"><input required min={0} max={50} type="number" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className={inputClass} /></Field>
            <Field label="Location"><input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputClass} placeholder="Addis Ababa" /></Field>
          </div>

          <Field label="Education">
            <input required value={form.education} onChange={e => setForm({ ...form, education: e.target.value })} className={inputClass} placeholder="e.g. BSc Physics, Addis Ababa University" />
          </Field>

          <Field label="Biography">
            <textarea required rows={4} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
              className={`${inputClass} resize-none`}
              placeholder="Describe your teaching style, experience, and how you help students succeed..." />
          </Field>

          <section className="space-y-3">
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-extrabold text-slate-900">Teaching highlights</h2>
            <div className="space-y-2">
              {DEFAULT_HIGHLIGHTS.map(item => (
                <button key={item} type="button" onClick={() => toggleHighlight(item)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${highlights.includes(item) ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-600"}`}>
                  <CheckCircle2 className={`h-4 w-4 shrink-0 ${highlights.includes(item) ? "text-emerald-500" : "text-slate-300"}`} />
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-extrabold text-slate-900">Availability</h2>
            <p className="text-xs text-slate-500">Choose the days you can teach, and your session length.</p>
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS.map(day => (
                <button key={day} type="button" onClick={() => toggleDay(day)} className="text-center">
                  <div className="mb-1 text-xs text-slate-500">{day}</div>
                  <div className={`flex aspect-square w-full items-center justify-center rounded-xl text-xs font-bold ${days.includes(day) ? "bg-emerald-100 text-emerald-700" : "bg-white text-slate-400 border border-slate-200"}`}>
                    {days.includes(day) ? "✓" : "–"}
                  </div>
                </button>
              ))}
            </div>
            <Field label="Session duration (minutes)">
              <select required value={form.sessionMinutes} onChange={e => setForm({ ...form, sessionMinutes: e.target.value })} className={inputClass}>
                {[30, 45, 60, 75, 90, 120].map(mins => <option key={mins} value={mins}>{mins} minutes</option>)}
              </select>
            </Field>
          </section>

          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {saved && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Profile saved. Opening your public tutor page…</div>}

          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">
            {isEdit ? "Save tutor profile" : "Publish tutor profile"} <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-center text-sm text-slate-500">
            <Link to="/tutors" className="font-bold text-[#2563EB]">Browse tutors</Link>
            {" · "}
            <Link to="/profile" className="font-bold text-[#2563EB]">Back to profile</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold text-slate-700">{label}{children}</label>;
}
