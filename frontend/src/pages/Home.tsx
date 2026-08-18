import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SUBJECT_DEFS, TUTORS, RECENT_LESSONS } from "../data";
import {
  Search, Play, Star, Users, ArrowRight, Sparkles,
  CheckCircle2, BookCheck, Target, TrendingUp, BarChart3,
  PlayCircle, Award, ChevronRight, Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useReviews } from "../context/ReviewsContext";

const UPDATES = [
  { type: "Exam Prep", typeColor: "bg-red-100 text-red-700", title: "Grade 12 National Exam Preparation Pack Released", excerpt: "A comprehensive review pack covering all subjects for the 2016 E.C. EUEE is now available.", date: "July 18, 2026", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=480&h=260&fit=crop&auto=format" },
  { type: "Live Event", typeColor: "bg-blue-100 text-blue-700", title: "Live Q&A with Top Instructors — July 25", excerpt: "Join our panel of expert teachers for a live session focused on Mathematics and Natural Sciences.", date: "July 15, 2026", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=480&h=260&fit=crop&auto=format" },
  { type: "Platform", typeColor: "bg-green-100 text-green-700", title: "Amharic Language Interface Now Available", excerpt: "Astegni now supports full Amharic navigation. Switch your language preference in account settings.", date: "July 10, 2026", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=480&h=260&fit=crop&auto=format" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { reviews, addReview } = useReviews();
  const [reviewForm, setReviewForm] = useState({ name: user?.name ?? "", grade: user?.role === "tutor" ? "Tutor" : "Student", rating: 5, text: "" });

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/learn?q=${encodeURIComponent(query)}`);
  };

  const submitReview = (event: FormEvent) => {
    event.preventDefault();
    addReview({ ...reviewForm, name: reviewForm.name.trim(), text: reviewForm.text.trim() });
    setReviewForm(current => ({ ...current, text: "", rating: 5 }));
  };

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1F5C] via-[#1344C8] to-[#1a6dd4] pt-20 pb-24">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(circle at 15% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 85% 20%, #6366f1 0%, transparent 40%)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Ethiopia's #1 Online Learning Platform · Grades 9–12
              </div>
              <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-5xl lg:text-[3.75rem] text-white leading-[1.08] mb-5">
                Learn Smarter,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">Score Higher.</span>
              </h1>
              <p className="text-blue-100/90 text-lg leading-relaxed mb-8 max-w-xl">
                Expert video lessons, adaptive practice tests, and exam prep packs — all aligned to Ethiopia's national curriculum.
              </p>

              <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mb-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                  <input value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="Search lessons, subjects, topics…"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/15 text-white placeholder:text-blue-200/60 text-sm font-medium focus:outline-none focus:bg-white/25 transition-all" />
                </div>
                <button type="submit" className="px-5 py-2.5 bg-[#F59E0B] hover:bg-amber-400 text-amber-900 font-bold text-sm rounded-xl transition-all shadow-lg whitespace-nowrap">
                  Search
                </button>
              </form>

              <div className="flex flex-wrap gap-2 mb-10">
                {["Grade 12 Math", "Physics", "Biology", "English"].map(s => (
                  <button key={s} onClick={() => setQuery(s)}
                    className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs font-medium hover:bg-white/20 transition-all">{s}</button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-5 pt-7 border-t border-white/10">
                {[{ icon: CheckCircle2, text: "MOE-Aligned" }, { icon: BookCheck, text: "1,200+ Lessons" }, { icon: Target, text: "87% Score Improvement" }].map(({ icon: I, text }) => (
                  <div key={text} className="flex items-center gap-2 text-blue-100/80 text-sm">
                    <I className="w-4 h-4 text-emerald-400" /> {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden lg:block relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/50 bg-blue-900 aspect-[4/4.2]">
                <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=680&h=720&fit=crop&auto=format" alt="Students learning" className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 via-transparent" />
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wide mb-0.5">Now Playing</div>
                    <div className="text-sm font-bold text-slate-800 truncate">Quadratic Equations</div>
                    <div className="h-1.5 mt-1.5 bg-blue-100 rounded-full"><div className="h-full w-[62%] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" /></div>
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">62%</span>
                </div>
              </div>
              <div className="absolute -left-10 top-10 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Users className="w-5 h-5 text-blue-600" /></div>
                <div><div className="text-lg font-extrabold text-slate-800">50K+</div><div className="text-xs text-slate-500">Active students</div></div>
              </div>
              <div className="absolute -right-8 top-1/3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl px-4 py-3 shadow-xl text-white">
                <div className="flex items-center gap-1.5 mb-1"><TrendingUp className="w-4 h-4" /><span className="text-xs font-semibold">Score Improvement</span></div>
                <div className="text-2xl font-extrabold">87%</div>
              </div>
              <div className="absolute -right-6 bottom-28 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /></div>
                <div><div className="text-base font-extrabold text-slate-800">4.8 / 5</div><div className="text-xs text-slate-500">Rating</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[{ v: "50K+", l: "Active Students", icon: Users, c: "text-blue-600", bg: "bg-blue-50" }, { v: "1,200+", l: "Video Lessons", icon: PlayCircle, c: "text-violet-600", bg: "bg-violet-50" }, { v: "87%", l: "Score Improvement", icon: BarChart3, c: "text-emerald-600", bg: "bg-emerald-50" }, { v: "4.8★", l: "Average Rating", icon: Star, c: "text-amber-600", bg: "bg-amber-50" }].map(({ v, l, icon: I, c, bg }) => (
              <div key={l} className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-2xl ${bg} flex items-center justify-center shrink-0`}><I className={`w-5 h-5 ${c}`} /></div>
                <div><div className={`text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] ${c}`}>{v}</div><div className="text-sm text-slate-500">{l}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Subjects ── */}
      <section className="py-18 pt-16 pb-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Browse by Subject" title="Popular Subjects" linkTo="/learn" linkText="All subjects" />
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-3">
            {SUBJECT_DEFS.map(s => {
              const Icon = s.icon;
              return (
                <Link key={s.id} to={`/learn/12/${s.id}`}
                  style={{ background: s.bg, borderColor: s.iconBg }}
                  className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl border hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform" style={{ background: s.iconBg }}>
                    <Icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <span className="text-[11px] font-bold text-center leading-tight" style={{ color: s.color }}>{s.name}</span>
                  <span className="text-[10px]" style={{ color: s.color, opacity: 0.65 }}>{s.chapters} chapters</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Recent / Continue Learning ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Continue Where You Left Off" title="Featured Lessons" linkTo="/learn" linkText="All lessons" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RECENT_LESSONS.map(lesson => (
              <Link key={lesson.title} to={`/learn/${lesson.grade}/${lesson.subject.toLowerCase()}`}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img src={lesson.image} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#2563EB] flex items-center justify-center shadow-xl">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 rounded-lg text-[11px] font-bold text-slate-700">Grade {lesson.grade}</span>
                </div>
                <div className="p-4">
                  <span className="text-xs font-bold text-[#2563EB]">{lesson.subject}</span>
                  <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-slate-800 mt-1 mb-3 line-clamp-2">{lesson.title}</h3>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Progress</span><span className="font-semibold text-[#2563EB]">{lesson.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full"><div className="h-full bg-[#2563EB] rounded-full transition-all" style={{ width: `${lesson.progress}%` }} /></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1F5C] via-[#1344C8] to-[#2563EB] p-10 md:p-14">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-bold mb-4">
                  <Award className="w-3.5 h-3.5" /> Grade 12 Exam Prep · 2016 E.C.
                </div>
                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-3xl text-white mb-3">Ready for the National Exam for Grade 12?</h2>
                <div className="flex flex-wrap gap-4 mt-4">
                  {["10 Subjects Covered", "5 Years of Past Papers", "Live Mock Exams"].map(item => (
                    <div key={item} className="flex items-center gap-2 text-blue-100/80 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />{item}
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/exam" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#F59E0B] hover:bg-amber-400 text-amber-900 font-extrabold rounded-2xl transition-all shadow-xl whitespace-nowrap">
                <Zap className="w-4 h-4" /> Start Exam Prep
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Updates ── */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="What's New" title="Latest Updates" linkTo="/about" linkText="All updates" />
          <div className="grid md:grid-cols-3 gap-6">
            {UPDATES.map(u => (
              <article key={u.title} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="relative aspect-[16/7] overflow-hidden bg-slate-100">
                  <img src={u.image} alt={u.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold ${u.typeColor}`}>{u.type}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm text-slate-800 leading-snug mb-2 group-hover:text-[#2563EB] transition-colors">{u.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">{u.excerpt}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <span className="text-xs text-slate-400">{u.date}</span>
                    <button className="flex items-center gap-1 text-xs font-bold text-[#2563EB]">Read <ChevronRight className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Student Stories" title="Loved by Students Across Ethiopia" />
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map(t => (
              <div key={t.id} className="bg-[#F8FAFC] rounded-2xl p-6 border border-blue-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex gap-0.5 mb-4">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />)}</div>
                <p className="text-slate-700 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-blue-100">
                  {t.avatar ? <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-md" /> : <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">{t.name.charAt(0)}</div>}
                  <div><div className="text-sm font-bold text-slate-800">{t.name}</div><div className="text-xs text-slate-500">{t.grade}</div></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {user ? (
              <form onSubmit={submitReview}>
                <div className="mb-5"><h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-slate-900">Share your Astegni story</h3><p className="mt-1 text-sm text-slate-500">Your feedback helps other learners choose with confidence.</p></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">Name<input required value={reviewForm.name} onChange={event => setReviewForm({ ...reviewForm, name: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50" /></label>
                  <label className="text-sm font-semibold text-slate-700">Grade or role<input required value={reviewForm.grade} onChange={event => setReviewForm({ ...reviewForm, grade: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50" /></label>
                </div>
                <div className="mt-4 flex items-center gap-3"><span className="text-sm font-semibold text-slate-700">Rating</span><div className="flex gap-1">{[1, 2, 3, 4, 5].map(rating => <button type="button" key={rating} aria-label={`${rating} stars`} onClick={() => setReviewForm({ ...reviewForm, rating })}><Star className={`h-6 w-6 ${rating <= reviewForm.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} /></button>)}</div></div>
                <textarea required minLength={10} rows={4} value={reviewForm.text} onChange={event => setReviewForm({ ...reviewForm, text: event.target.value })} placeholder="Tell students about your learning experience…" className="mt-4 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50" />
                <button className="mt-4 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-bold text-white hover:bg-blue-700">Submit review</button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row"><div><h3 className="font-bold text-slate-900">Have an Astegni story to share?</h3><p className="mt-1 text-sm text-slate-500">Sign in and help inspire Ethiopia's next generation of learners.</p></div><Link to="/login" className="whitespace-nowrap rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white">Log in to leave a review</Link></div>
            )}
          </div>
        </div>
      </section>

      {/* ── Tutors preview ── */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader label="Expert Educators" title="Meet Our Tutors" linkTo="/tutors" linkText="All tutors" />
            <Link to="/become-tutor" className="mb-8 inline-flex items-center gap-2 rounded-xl bg-[#F59E0B] px-5 py-3 text-sm font-extrabold text-amber-950 shadow-lg shadow-amber-100 transition hover:bg-amber-400">Register as Tutor <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TUTORS.slice(0, 3).map(t => (
              <Link key={t.id} to={`/tutors/${t.id}`}
                className="group bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-100 group-hover:ring-[#2563EB]/30 transition-all" />
                  <div>
                    <div className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base text-slate-800 group-hover:text-[#2563EB] transition-colors">{t.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{t.education}</div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-slate-700">{t.rating}</span>
                      <span className="text-xs text-slate-400">({t.reviews})</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {t.subjects.map(s => <span key={s} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">{s}</span>)}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-full ${t.available ? "bg-emerald-500" : "bg-slate-300"}`} /><span className="text-xs text-slate-500">{t.available ? "Available now" : "Unavailable"}</span></div>
                  <span className="text-xs font-bold text-[#2563EB] flex items-center gap-1">View Profile <ChevronRight className="w-3 h-3" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ label, title, linkTo, linkText }: { label: string; title: string; linkTo?: string; linkText?: string }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <div className="flex items-center gap-2 mb-2"><div className="w-1 h-5 rounded-full bg-[#2563EB]" /><span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest">{label}</span></div>
        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-2xl lg:text-3xl text-slate-900">{title}</h2>
      </div>
      {linkTo && linkText && (
        <Link to={linkTo} className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-[#2563EB] hover:text-blue-700 transition-colors group">
          {linkText} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}
