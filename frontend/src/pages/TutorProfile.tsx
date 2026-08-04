import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, MapPin, Mail, Phone, BookOpen, Award, ChevronLeft, CheckCircle2, Clock, Calendar, Users } from "lucide-react";
import { getTutorById, SUBJECT_DEFS } from "../data";
import { Breadcrumb } from "../components/Breadcrumb";

const REVIEWS = [
  { name: "Selamawit T.", grade: "Grade 12", text: "Absolutely brilliant teacher. My Physics score jumped from 55% to 89% after just 8 sessions. Highly recommended!", rating: 5, date: "June 2026" },
  { name: "Dawit M.", grade: "Grade 11", text: "Very patient and explains concepts in multiple ways until you understand. The best tutor I have worked with.", rating: 5, date: "May 2026" },
  { name: "Hiwot B.", grade: "Grade 12", text: "Excellent command of the subject and a very structured teaching style. Helped me build real exam confidence.", rating: 5, date: "April 2026" },
];

function subjectSlug(name: string) {
  return SUBJECT_DEFS.find(s => s.name.toLowerCase() === name.toLowerCase())?.id ?? name.toLowerCase().replace(/\s+/g, "-");
}

export default function TutorProfile() {
  const { id } = useParams<{ id: string }>();
  const tutor = getTutorById(id);
  const [activeTab, setActiveTab] = useState("about");

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

  const showSampleReviews = tutor.reviews > 0;

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Tutors", to: "/tutors" }, { label: tutor.name }]} />
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
                    <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-500">
                      <MapPin className="w-4 h-4" />{tutor.location}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-extrabold text-slate-800">{tutor.rating}</span>
                      <span className="text-xs text-slate-500">({tutor.reviews})</span>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${tutor.available ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"}`}>
                      {tutor.available ? "✓ Available Now" : "Unavailable"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  {[{ v: `${tutor.experience}`, l: "Years Experience" }, { v: tutor.students.toLocaleString(), l: "Students" }, { v: `${tutor.reviews}`, l: "Reviews" }].map(({ v, l }) => (
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

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
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
                      {["Experienced in Ethiopian MOE curriculum", "Fluent in Amharic and English", "Proven exam success record", "Patient, structured teaching method"].map(h => (
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
                        <Link to={`/learn/12/${subjectSlug(sub)}`}
                          className="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors">View lessons →</Link>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
                      <div className="text-4xl font-extrabold text-slate-800">{tutor.rating}</div>
                      <div>
                        <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}</div>
                        <div className="text-sm text-slate-500 mt-1">Based on {tutor.reviews} reviews</div>
                      </div>
                    </div>
                    {showSampleReviews ? REVIEWS.map((r, i) => (
                      <div key={i} className="pb-5 border-b border-slate-100 last:border-0">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">{r.name.charAt(0)}</div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">{r.name}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex gap-0.5">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />)}</div>
                              <span className="text-xs text-slate-400">{r.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed ml-12">"{r.text}"</p>
                      </div>
                    )) : (
                      <p className="text-sm text-slate-500">No student reviews yet. Contact this tutor to get started.</p>
                    )}
                  </div>
                )}

                {activeTab === "availability" && (
                  <div>
                    <h3 className="font-bold text-slate-800 mb-4">Weekly Schedule</h3>
                    <div className="grid grid-cols-7 gap-1.5 mb-5">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                        <div key={d} className="text-center">
                          <div className="text-xs text-slate-500 mb-1">{d}</div>
                          <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-xs font-bold ${[0, 1, 3, 4].includes(i) ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                            {[0, 1, 3, 4].includes(i) ? "✓" : "–"}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" />Sessions: 60–90 minutes</div>
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500" />Arrange via contact details</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact only — no in-app chat */}
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
