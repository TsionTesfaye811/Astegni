import { Link, useParams } from "react-router-dom";
import { ChevronRight, BookOpen, Play, CheckCircle2, Lock } from "lucide-react";
import { SUBJECT_DEFS } from "../data";
import { Breadcrumb } from "../components/Breadcrumb";

const PROGRESS_BY_SUBJECT: Record<string, number> = {
  mathematics: 72, physics: 45, chemistry: 30, biology: 88,
  english: 95, amharic: 55, history: 20, geography: 60, civics: 40,
};

const GRADE_INFO: Record<string, { title: string; description: string; color: string; gradient: string }> = {
  "9":  { title: "Grade 9", description: "Foundation Year — build strong core skills across all subjects.", color: "blue", gradient: "from-blue-500 to-blue-700" },
  "10": { title: "Grade 10", description: "Core Development — deepen your understanding and tackle harder concepts.", color: "violet", gradient: "from-violet-500 to-violet-700" },
  "11": { title: "Grade 11", description: "Pre-Exam Year — prepare for specialization and the national exit exam.", color: "emerald", gradient: "from-emerald-500 to-emerald-700" },
  "12": { title: "Grade 12", description: "National Exam Year — master every topic and pass with confidence.", color: "orange", gradient: "from-orange-500 to-rose-600" },
};

export default function GradePage() {
  const { grade } = useParams<{ grade: string }>();
  const g = grade ?? "12";
  const info = GRADE_INFO[g] ?? GRADE_INFO["12"];

  const subjects = g === "9" || g === "10" ? SUBJECT_DEFS : SUBJECT_DEFS.slice(0, 8);

  const totalChapters = subjects.reduce((a, s) => a + s.chapters, 0);
  const avgProgress = Math.round(subjects.reduce((a, s) => a + (PROGRESS_BY_SUBJECT[s.id] ?? 0), 0) / subjects.length);
  const completed = subjects.filter(s => (PROGRESS_BY_SUBJECT[s.id] ?? 0) === 100).length;

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className={`bg-gradient-to-r ${info.gradient} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Learn", to: "/learn" }, { label: info.title }]} />
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-4xl mt-4 mb-2">{info.title}</h1>
          <p className="text-white/80 text-base max-w-lg">{info.description}</p>
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { label: "Subjects", value: subjects.length },
              { label: "Total Chapters", value: totalChapters },
              { label: "Avg. Progress", value: `${avgProgress}%` },
              { label: "Completed", value: `${completed}/${subjects.length}` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif]">{value}</div>
                <div className="text-white/70 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 rounded-full bg-[#2563EB]" />
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-xl text-slate-900">All Subjects</h2>
          <span className="ml-1 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">{subjects.length}</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map(s => {
            const Icon = s.icon;
            const progress = PROGRESS_BY_SUBJECT[s.id] ?? 0;
            const isLocked = false;
            const chaptersCompleted = Math.round((progress / 100) * s.chapters);

            return (
              <Link key={s.id} to={`/learn/${g}/${s.id}`}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                {/* Subject color header */}
                <div className="h-2 w-full" style={{ background: s.color }} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: s.bg }}>
                        <Icon className="w-6 h-6" style={{ color: s.color }} />
                      </div>
                      <div>
                        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-base text-slate-800 group-hover:text-[#2563EB] transition-colors">{s.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>
                      </div>
                    </div>
                    {isLocked ? <Lock className="w-4 h-4 text-slate-400 shrink-0" /> :
                      progress === 100 ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : null}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />{s.chapters} chapters</span>
                    <span className="flex items-center gap-1.5"><Play className="w-3.5 h-3.5" />{chaptersCompleted} completed</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-bold" style={{ color: s.color }}>{progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: s.color }} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-1">
                      {Array.from({ length: Math.min(chaptersCompleted, 5) }).map((_, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-emerald-400 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-bold flex items-center gap-1" style={{ color: s.color }}>
                      {progress > 0 ? "Continue" : "Start"} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
