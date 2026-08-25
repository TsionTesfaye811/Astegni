import { Link } from "react-router-dom";
import { Atom, BookOpen, ChevronRight, Landmark } from "lucide-react";
import { STREAMS, RECENT_LESSONS, getStreamForSubject } from "../data";
import { Breadcrumb } from "../components/Breadcrumb";

export default function Learn() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Learn" }]} />
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-3xl text-slate-900 mt-3 mb-1">Choose Your Stream</h1>
          <p className="text-slate-500">Select Natural Science or Social Science first, then choose your grade.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-6 md:grid-cols-2 mb-14">
          {STREAMS.map(stream => {
            const Icon = stream.id === "natural" ? Atom : Landmark;
            return (
              <Link
                key={stream.id}
                to={`/learn/${stream.id}`}
                className={`group overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${stream.border}`}
              >
                <div className={`bg-gradient-to-br ${stream.gradient} p-8 text-white`}>
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold">{stream.name}</h2>
                  <p className="mt-3 max-w-md text-sm text-white/85">{stream.description}</p>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-2 text-sm text-slate-600">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-semibold">{stream.subjects.length} core subjects</span>
                  </div>
                  <div className="mb-5 flex flex-wrap gap-2">
                    {stream.subjects.map(subjectId => (
                      <span key={subjectId} className={`rounded-lg px-2.5 py-1 text-xs font-bold capitalize ${stream.light}`} style={{ color: stream.color }}>
                        {subjectId}
                      </span>
                    ))}
                  </div>
                  <div className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${stream.light}`} style={{ color: stream.color }}>
                    Continue to grades <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-5 rounded-full bg-[#2563EB]" />
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest">Pick Up Where You Left Off</span>
          </div>
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-2xl text-slate-900 mb-6">Continue Learning</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RECENT_LESSONS.map(l => {
              const streamId = getStreamForSubject(l.subject.toLowerCase());
              return (
                <Link
                  key={l.title}
                  to={`/learn/${streamId}/${l.grade}/${l.subject.toLowerCase()}`}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 p-4"
                >
                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img src={l.image} alt={l.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-[#2563EB]">{l.subject} · Grade {l.grade}</span>
                    <h3 className="text-sm font-bold text-slate-800 mt-0.5 truncate">{l.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full"><div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${l.progress}%` }} /></div>
                      <span className="text-xs font-semibold text-[#2563EB] shrink-0">{l.progress}%</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
