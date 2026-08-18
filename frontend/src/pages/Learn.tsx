import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, Play } from "lucide-react";
import { SUBJECT_DEFS, RECENT_LESSONS } from "../data";
import { Breadcrumb } from "../components/Breadcrumb";

const GRADE_DATA = [
  { grade: "9", title: "Grade 9", subtitle: "Foundation Year", subjects: 9, chapters: 58, progress: 45, color: "from-blue-500 to-blue-700", light: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=480&h=300&fit=crop&auto=format" },
  { grade: "10", title: "Grade 10", subtitle: "Core Development", subjects: 9, chapters: 58, progress: 28, color: "from-violet-500 to-violet-700", light: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=480&h=300&fit=crop&auto=format" },
  { grade: "11", title: "Grade 11", subtitle: "Pre-Exam Preparation", subjects: 8, chapters: 52, progress: 12, color: "from-emerald-500 to-emerald-700", light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=480&h=300&fit=crop&auto=format" },
  { grade: "12", title: "Grade 12", subtitle: "National Exam Year", subjects: 8, chapters: 52, progress: 72, color: "from-orange-500 to-rose-600", light: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", img: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=480&h=300&fit=crop&auto=format" },
];

export default function Learn() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Learn" }]} />
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-3xl text-slate-900 mt-3 mb-1">Choose Your Grade</h1>
          <p className="text-slate-500">Select your grade to access subject lessons, chapters, and practice materials.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Grade cards */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-14">
          {GRADE_DATA.map(g => (
            <Link key={g.grade} to={`/learn/${g.grade}`}
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="relative h-36 overflow-hidden">
                <img src={g.img} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute inset-0 bg-gradient-to-t ${g.color} opacity-75`} />
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <span className="self-start px-2.5 py-1 bg-white/20 border border-white/30 text-white text-xs font-bold rounded-lg backdrop-blur-sm">{g.subtitle}</span>
                  <div>
                    <div className="text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans',sans-serif] leading-none">{g.grade}</div>
                    <div className="text-white/80 text-sm font-medium">{g.title}</div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex gap-4 mb-4 text-sm">
                  <div className={`flex items-center gap-1.5 ${g.text}`}><BookOpen className="w-4 h-4" /><span className="font-semibold">{g.subjects} subjects</span></div>
                  <div className="flex items-center gap-1.5 text-slate-500"><Play className="w-4 h-4" /><span>{g.chapters} chapters</span></div>
                </div>
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs"><span className="text-slate-500">Progress</span><span className={`font-bold ${g.text}`}>{g.progress}%</span></div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${g.color} rounded-full transition-all`} style={{ width: `${g.progress}%` }} />
                  </div>
                </div>
                <div className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm ${g.light} ${g.text} border ${g.border} group-hover:shadow-md transition-all`}>
                  {g.progress > 0 ? "Continue Learning" : "Start Learning"} <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Continue learning */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-2"><div className="w-1 h-5 rounded-full bg-[#2563EB]" /><span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest">Pick Up Where You Left Off</span></div>
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-2xl text-slate-900 mb-6">Continue Learning</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RECENT_LESSONS.map(l => (
              <Link key={l.title} to={`/learn/${l.grade}/${l.subject.toLowerCase()}`}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 p-4">
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
            ))}
          </div>
        </div>

        {/* All subjects overview */}
        <div>
          <div className="flex items-center gap-2 mb-2"><div className="w-1 h-5 rounded-full bg-[#2563EB]" /><span className="text-xs font-bold text-[#2563EB] uppercase tracking-widest">All Subjects</span></div>
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-2xl text-slate-900 mb-6">Browse by Subject</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {SUBJECT_DEFS.map(s => {
              const Icon = s.icon;
              return (
                <Link key={s.id} to={`/learn/12/${s.id}`}
                  style={{ background: s.bg, borderColor: s.iconBg }}
                  className="group flex items-center gap-3 p-4 rounded-2xl border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform" style={{ background: s.iconBg }}>
                    <Icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate" style={{ color: s.color }}>{s.name}</div>
                    <div className="text-xs" style={{ color: s.color, opacity: 0.65 }}>{s.chapters} chapters</div>
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

