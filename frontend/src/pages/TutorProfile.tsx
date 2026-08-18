import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, MapPin, Mail, Phone, BookOpen, Award, ChevronLeft, CheckCircle2, Clock, Calendar, Users, Pencil } from "lucide-react";
import { getTutorById, SUBJECT_DEFS } from "../data";
import { Breadcrumb } from "../components/Breadcrumb";
import { useAuth } from "../context/AuthContext";

interface TutorReview {
  id: string;
  userId: string;
  name: string;
  grade: string;
  rating: number;
  text: string;
  date: string;
}

const SAMPLE_REVIEWS: TutorReview[] = [
  { id: "s1", userId: "sample", name: "Selamawit T.", grade: "Grade 12", text: "Absolutely brilliant teacher. My Physics score jumped from 55% to 89% after just 8 sessions. Highly recommended!", rating: 5, date: "June 2026" },
  { id: "s2", userId: "sample", name: "Dawit M.", grade: "Grade 11", text: "Very patient and explains concepts in multiple ways until you understand. The best tutor I have worked with.", rating: 5, date: "May 2026" },
  { id: "s3", userId: "sample", name: "Hiwot B.", grade: "Grade 12", text: "Excellent command of the subject and a very structured teaching style. Helped me build real exam confidence.", rating: 5, date: "April 2026" },
];

const DEFAULT_HIGHLIGHTS = [
  "Experienced in Ethiopian MOE curriculum",
  "Fluent in Amharic and English",
  "Proven exam success record",
  "Patient, structured teaching method",
];

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function subjectSlug(name: string) {
  return SUBJECT_DEFS.find(s => s.name.toLowerCase() === name.toLowerCase())?.id ?? name.toLowerCase().replace(/\s+/g, "-");
}

function reviewsKey(tutorId: string) {
  return `astegni_tutor_reviews_${tutorId}`;
}

function readReviews(tutorId: string): TutorReview[] {
  try {
    return JSON.parse(localStorage.getItem(reviewsKey(tutorId)) ?? "[]") as TutorReview[];
  } catch {
    return [];
  }
}

export default function TutorProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const tutor = getTutorById(id);
  const [activeTab, setActiveTab] = useState("about");
  const [studentReviews, setStudentReviews] = useState<TutorReview[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (id) setStudentReviews(readReviews(id));
  }, [id]);

  const allReviews = useMemo(() => {
    if (!tutor) return [];
    const seeded = tutor.reviews > 0 ? SAMPLE_REVIEWS : [];
    return [...studentReviews, ...seeded];
  }, [studentReviews, tutor]);

  const averageRating = useMemo(() => {
    if (!tutor) return 0;
    if (studentReviews.length === 0) return tutor.rating;
    const total = studentReviews.reduce((sum, review) => sum + review.rating, 0) + tutor.rating * Math.max(tutor.reviews, 1);
    const count = studentReviews.length + Math.max(tutor.reviews, 1);
    return Math.round((total / count) * 10) / 10;
  }, [studentReviews, tutor]);

  if (!tutor) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#F8FAFC] px-4 text-center">
        <Users className="mb-4 h-14 w-14 text-slate-300" />
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-slate-900">Tutor not found</h1>
        <p className="mt-2 max-w-md text-sm text-slate-500">This tutor profile is missing or was removed. Browse the tutors list to find someone else.</p>
        <Link to="/tutors" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">
          <ChevronLeft className="h-4 w-4" /> Back to tutors
        </Link>
      </div>
    );
  }

  const highlights = tutor.highlights?.length ? tutor.highlights : DEFAULT_HIGHLIGHTS;
  const availabilityDays = tutor.availabilityDays?.length ? tutor.availabilityDays : ["Mon", "Tue", "Thu", "Fri"];
  const sessionMinutes = tutor.sessionMinutes ?? 60;
  const reviewCount = tutor.reviews + studentReviews.length;
  const isOwnProfile = Boolean(user && user.id === tutor.id);

  const submitReview = (event: FormEvent) => {
    event.preventDefault();
    if (!user || !id || !comment.trim() || isOwnProfile) return;
    const nextReview: TutorReview = {
      id: crypto.randomUUID(),
      userId: user.id,
      name: user.name,
      grade: user.profile.grade ? `Grade ${user.profile.grade}` : "Student",
      rating,
      text: comment.trim(),
      date: new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
    };
    const next = [nextReview, ...studentReviews.filter(item => item.userId !== user.id)];
    localStorage.setItem(reviewsKey(id), JSON.stringify(next));
    setStudentReviews(next);
    setComment("");
    setRating(5);
    setSubmitted(true);
    setActiveTab("reviews");
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Tutors", to: "/tutors" }, { label: tutor.name }]} />
            {isOwnProfile && (
              <Link to="/edit-tutor-profile" className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
                <Pencil className="h-4 w-4" /> Edit tutor profile
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          <div>
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm mb-5">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 h-28 relative">
                <div className="absolute -bottom-10 left-6">
                  <div className="relative">
                    <img src={tutor.avatar} alt={tutor.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-xl" />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${tutor.available ? "bg-emerald-500" : "bg-slate-400"}`} />
                  </div>
                </div>
              </div>
              <div className="pt-14 pb-6 px-6">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-2xl text-slate-900">{tutor.name}</h1>
                    <p className="text-slate-500 text-sm mt-1">{tutor.education}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{tutor.location}</span>
                      {tutor.age ? <span>· Age {tutor.age}</span> : null}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-extrabold text-slate-800">{averageRating}</span>
                      <span className="text-xs text-slate-500">({reviewCount})</span>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${tutor.available ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"}`}>
                      {tutor.available ? "✓ Available Now" : "Unavailable"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  {[{ v: `${tutor.experience}`, l: "Years Experience" }, { v: tutor.students.toLocaleString(), l: "Students" }, { v: `${reviewCount}`, l: "Reviews" }].map(({ v, l }) => (
                    <div key={l} className="text-center bg-slate-50 rounded-xl py-3 border border-slate-100">
                      <div className="text-xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-slate-800">{v}</div>
                      <div className="text-xs text-slate-500">{l}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {tutor.subjects.map(s => (
                    <span key={s} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-xl border border-blue-100">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm mb-5">
              <div className="flex border-b border-slate-100">
                {["about", "subjects", "reviews", "availability"].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3.5 text-sm font-semibold capitalize transition-colors border-b-2 ${activeTab === tab ? "border-[#2563EB] text-[#2563EB]" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-6">
                {activeTab === "about" && (
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3">Biography</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-5">{tutor.bio}</p>
                    <h3 className="font-bold text-slate-800 mb-3">Education</h3>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0"><Award className="w-4 h-4 text-blue-600" /></div>
                      <div><div className="text-sm font-semibold text-slate-800">{tutor.education}</div><div className="text-xs text-slate-500">Verified Qualification</div></div>
                    </div>
                    <h3 className="font-bold text-slate-800 mt-5 mb-3">Teaching Highlights</h3>
                    <ul className="space-y-2">
                      {highlights.map(h => (
                        <li key={h} className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "subjects" && (
                  <div className="space-y-4">
                    {tutor.subjects.map(sub => (
                      <div key={sub} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center"><BookOpen className="w-4 h-4 text-blue-600" /></div>
                          <div><div className="font-semibold text-slate-800">{sub}</div><div className="text-xs text-slate-500">Grades 9–12</div></div>
                        </div>
                        <Link to={`/learn/12/${subjectSlug(sub)}`} className="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors">View lessons →</Link>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
                      <div className="text-4xl font-extrabold text-slate-800">{averageRating}</div>
                      <div>
                        <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />)}</div>
                        <div className="text-sm text-slate-500 mt-1">Based on {reviewCount} reviews</div>
                      </div>
                    </div>
                    {allReviews.length === 0 ? (
                      <p className="text-sm text-slate-500">No student reviews yet. Be the first to rate this tutor.</p>
                    ) : allReviews.map(r => (
                      <div key={r.id} className="pb-5 border-b border-slate-100 last:border-0">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">{r.name.charAt(0)}</div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">{r.name}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex gap-0.5">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />)}</div>
                              <span className="text-xs text-slate-400">{r.grade} · {r.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed ml-12">"{r.text}"</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "availability" && (
                  <div>
                    <h3 className="font-bold text-slate-800 mb-4">Weekly Schedule</h3>
                    <div className="grid grid-cols-7 gap-1.5 mb-5">
                      {WEEK.map(d => (
                        <div key={d} className="text-center">
                          <div className="text-xs text-slate-500 mb-1">{d}</div>
                          <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-xs font-bold ${availabilityDays.includes(d) ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                            {availabilityDays.includes(d) ? "✓" : "–"}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" />Sessions: {sessionMinutes} minutes</div>
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500" />Arrange via contact details</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Student rating & commenting */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold text-slate-900">Rate & comment</h2>
              <p className="mt-1 text-sm text-slate-500">Share your experience so other students can choose the right tutor.</p>
              {isOwnProfile ? (
                <p className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  You can’t rate your own tutor profile. Other students can leave ratings and comments here.
                </p>
              ) : user ? (
                <form onSubmit={submitReview} className="mt-5 space-y-4">
                  <div>
                    <div className="mb-2 text-sm font-semibold text-slate-700">Your rating</div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(value => (
                        <button key={value} type="button" onClick={() => setRating(value)} className="p-1">
                          <Star className={`h-7 w-7 ${value <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="block text-sm font-semibold text-slate-700">Your comment
                    <textarea required rows={4} value={comment} onChange={e => setComment(e.target.value)}
                      placeholder="What did you learn? How was the teaching style?"
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 resize-none" />
                  </label>
                  <button className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors">
                    {submitted ? "✓ Review submitted" : "Submit review"}
                  </button>
                </form>
              ) : (
                <p className="mt-4 text-sm text-slate-500">Log in as a student to leave a rating and comment.</p>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-1">Contact</h3>
              <p className="mb-4 text-xs text-slate-500">Reach this tutor directly using the details below. There is no in-app chat.</p>
              <div className="space-y-3">
                {tutor.email && (
                  <a href={`mailto:${tutor.email}`} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700 transition hover:border-blue-200 hover:bg-blue-50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100"><Mail className="h-4 w-4 text-blue-600" /></div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Email</div>
                      <div className="truncate font-semibold text-[#2563EB]">{tutor.email}</div>
                    </div>
                  </a>
                )}
                {tutor.phone && (
                  <a href={`tel:${tutor.phone.replace(/\s+/g, "")}`} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100"><Phone className="h-4 w-4 text-emerald-600" /></div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Phone</div>
                      <div className="font-semibold text-slate-800">{tutor.phone}</div>
                    </div>
                  </a>
                )}
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100"><MapPin className="h-4 w-4 text-amber-600" /></div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Location</div>
                    <div className="font-semibold text-slate-800">{tutor.location}, Ethiopia</div>
                  </div>
                </div>
              </div>
            </div>

            <Link to="/tutors" className="flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-blue-700 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to all tutors
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
