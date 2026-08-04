import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Star, Users, MapPin, Filter, ChevronRight } from "lucide-react";
import { getAllTutors, SUBJECT_DEFS } from "../data";
import { Breadcrumb } from "../components/Breadcrumb";

const SUBJECTS_FILTER = ["All", ...SUBJECT_DEFS.map(s => s.name)];

export default function Tutors() {
  const [query, setQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [availableOnly, setAvailableOnly] = useState(false);

  const allTutors = useMemo(() => getAllTutors(), []);
  const filtered = allTutors.filter(t => {
    const matchQ = !query || t.name.toLowerCase().includes(query.toLowerCase()) || t.subjects.some(s => s.toLowerCase().includes(query.toLowerCase()));
    const matchS = subjectFilter === "All" || t.subjects.includes(subjectFilter);
    const matchA = !availableOnly || t.available;
    return matchQ && matchS && matchA;
  });

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Tutors" }]} />
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-3xl text-slate-900 mt-3 mb-1">Find Your Tutor</h1>
          <p className="text-slate-500 mb-6">Connect with expert Ethiopian educators for one-on-one guidance.</p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search tutors or subjects…"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
            <label className="flex items-center gap-2.5 px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
              <input type="checkbox" checked={availableOnly} onChange={e => setAvailableOnly(e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
              <span className="text-sm font-medium text-slate-700">Available only</span>
            </label>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-1">
          {SUBJECTS_FILTER.slice(0, 10).map(s => (
            <button key={s} onClick={() => setSubjectFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${subjectFilter === s ? "bg-[#2563EB] text-white shadow-md shadow-blue-200" : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-[#2563EB]"}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-500"><span className="font-bold text-slate-800">{filtered.length}</span> tutors found</p>
          <div className="flex items-center gap-2 text-sm text-slate-500"><Filter className="w-4 h-4" /><span>Sort by: Top Rated</span></div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Users className="w-14 h-14 mx-auto mb-4 opacity-20" />
            <p className="font-semibold">No tutors found for "{query}"</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(tutor => (
              <div key={tutor.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 pb-0">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img src={tutor.avatar} alt={tutor.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-lg" />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${tutor.available ? "bg-emerald-500" : "bg-slate-300"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base text-slate-800 group-hover:text-[#2563EB] transition-colors truncate">{tutor.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{tutor.education}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /><span className="text-xs font-bold text-slate-700">{tutor.rating}</span></div>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500">{tutor.reviews} reviews</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 -mx-6 h-4 bg-white rounded-t-2xl" />
                </div>

                <div className="px-5 pb-5">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tutor.subjects.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">{s}</span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    {[
                      { v: `${tutor.experience}y`, l: "Experience" },
                      { v: tutor.students >= 1000 ? `${(tutor.students / 1000).toFixed(1)}K` : `${tutor.students}`, l: "Students" },
                      { v: tutor.available ? "Now" : "Busy", l: "Availability" },
                    ].map(({ v, l }) => (
                      <div key={l} className="bg-slate-50 rounded-xl py-2 border border-slate-100">
                        <div className="text-sm font-extrabold text-slate-800">{v}</div>
                        <div className="text-[10px] text-slate-500">{l}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                    <MapPin className="w-3.5 h-3.5" />{tutor.location}
                  </div>

                  <Link to={`/tutors/${tutor.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">
                    View Profile <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
