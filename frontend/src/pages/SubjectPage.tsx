import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, BookOpen, Play, FileText, Download, HelpCircle, FolderOpen, CheckCircle2, Lock, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { SUBJECT_DEFS, CHAPTERS_BY_SUBJECT } from "../data";
import { Breadcrumb } from "../components/Breadcrumb";

const CHAPTER_PROGRESS = [100, 100, 65, 30, 0, 0, 0, 0, 0];

const TABS = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "textbook", label: "Textbook", icon: Download },
  { id: "videos", label: "Videos", icon: Play },
  { id: "quiz", label: "Practice Quiz", icon: HelpCircle },
  { id: "resources", label: "Resources", icon: FolderOpen },
];

export default function SubjectPage() {
  const { grade, subject } = useParams<{ grade: string; subject: string }>();
  const g = grade ?? "12";
  const subjectId = subject ?? "mathematics";

  const subjectDef = SUBJECT_DEFS.find(s => s.id === subjectId) ?? SUBJECT_DEFS[0];
  const chapters = CHAPTERS_BY_SUBJECT[subjectId] ?? CHAPTERS_BY_SUBJECT.mathematics;
  const [expandedChapter, setExpandedChapter] = useState<number | null>(0);

  const Icon = subjectDef.icon;
  const overallProgress = Math.round(CHAPTER_PROGRESS.slice(0, chapters.length).reduce((a, b) => a + b, 0) / chapters.length);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={[
            { label: "Home", to: "/" },
            { label: "Learn", to: "/learn" },
            { label: `Grade ${g}`, to: `/learn/${g}` },
            { label: subjectDef.name },
          ]} />
          <div className="flex items-start gap-5 mt-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md shrink-0" style={{ background: subjectDef.bg }}>
              <Icon className="w-8 h-8" style={{ color: subjectDef.color }} />
            </div>
            <div className="flex-1">
              <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-2xl text-slate-900 mb-1">{subjectDef.name}</h1>
              <p className="text-slate-500 text-sm">{subjectDef.description} · Grade {g}</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600"><BookOpen className="w-4 h-4" /><span>{chapters.length} chapters</span></div>
                <div className="flex-1 max-w-xs">
                  <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Overall Progress</span><span className="font-bold" style={{ color: subjectDef.color }}>{overallProgress}%</span></div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${overallProgress}%`, background: subjectDef.color }} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Chapters list */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-5 rounded-full bg-[#2563EB]" />
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-xl text-slate-900">Chapters</h2>
            </div>

            <div className="space-y-3">
              {chapters.map((chapterTitle, i) => {
                const progress = CHAPTER_PROGRESS[i] ?? 0;
                const isLocked = i > 3;
                const isExpanded = expandedChapter === i;
                const status = progress === 100 ? "done" : progress > 0 ? "inprogress" : isLocked ? "locked" : "available";

                return (
                  <div key={i} className={`bg-white rounded-2xl border transition-all duration-200 ${isExpanded ? "border-blue-200 shadow-lg shadow-blue-100" : "border-slate-100 hover:border-slate-200 hover:shadow-md"}`}>
                    <button
                      onClick={() => !isLocked && setExpandedChapter(isExpanded ? null : i)}
                      className="w-full flex items-center gap-4 p-5 text-left"
                    >
                      {/* Chapter number / status */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                        status === "done" ? "bg-emerald-100 text-emerald-600" :
                        status === "inprogress" ? "bg-blue-100 text-blue-600" :
                        status === "locked" ? "bg-slate-100 text-slate-400" :
                        "bg-slate-100 text-slate-600"}`}>
                        {status === "done" ? <CheckCircle2 className="w-5 h-5" /> :
                         status === "locked" ? <Lock className="w-4 h-4" /> :
                         <span>{i + 1}</span>}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-slate-800 truncate">{chapterTitle}</h3>
                        <div className="flex items-center gap-3 mt-1.5">
                          {progress > 0 && (
                            <div className="flex items-center gap-2 flex-1 max-w-[180px]">
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-blue-500" style={{ width: `${progress}%` }} />
                              </div>
                              <span className="text-xs text-blue-600 font-semibold shrink-0">{progress}%</span>
                            </div>
                          )}
                          {status === "available" && <span className="text-xs text-slate-400">Not started</span>}
                          {status === "locked" && <span className="text-xs text-slate-400">Complete previous chapter</span>}
                          <span className="flex items-center gap-1 text-xs text-slate-400"><Clock className="w-3 h-3" />~45 min</span>
                        </div>
                      </div>

                      {!isLocked && (isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />)}
                    </button>

                    {/* Expanded: resource tabs */}
                    {isExpanded && !isLocked && (
                      <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {TABS.map(tab => {
                            const TabIcon = tab.icon;
                            return (
                              <Link key={tab.id} to={`/learn/${g}/${subjectId}/${i + 1}?tab=${tab.id}`}
                                className="group flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all text-center">
                                <TabIcon className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                                <span className="text-[10px] font-semibold text-slate-600 group-hover:text-blue-600 leading-tight">{tab.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Link to={`/learn/${g}/${subjectId}/${i + 1}`}
                            className="flex-1 text-center py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors">
                            {progress > 0 ? "Continue Chapter" : "Start Chapter"} →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Progress card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-bold text-sm text-slate-700 mb-4">Your Progress</h3>
              <div className="text-center mb-4">
                <div className="relative w-24 h-24 mx-auto">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke={subjectDef.color} strokeWidth="8"
                      strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallProgress / 100)}`} className="transition-all duration-700" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-extrabold text-slate-800">{overallProgress}%</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">{Math.round((overallProgress / 100) * chapters.length)} of {chapters.length} chapters complete</p>
              </div>
              <div className="space-y-2">
                {[["Completed", `${CHAPTER_PROGRESS.filter(p => p === 100).length}`, "text-emerald-600"], ["In Progress", `${CHAPTER_PROGRESS.filter(p => p > 0 && p < 100).length}`, "text-blue-600"], ["Remaining", `${chapters.length - CHAPTER_PROGRESS.filter(p => p > 0).length}`, "text-slate-500"]].map(([l, v, c]) => (
                  <div key={l} className="flex justify-between text-sm"><span className="text-slate-600">{l}</span><span className={`font-bold ${c}`}>{v}</span></div>
                ))}
              </div>
            </div>

            {/* Other subjects */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-bold text-sm text-slate-700 mb-4">Other Subjects</h3>
              <div className="space-y-2">
                {SUBJECT_DEFS.filter(s => s.id !== subjectId).slice(0, 5).map(s => {
                  const SI = s.icon;
                  return (
                    <Link key={s.id} to={`/learn/${g}/${s.id}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: s.bg }}>
                        <SI className="w-4 h-4" style={{ color: s.color }} />
                      </div>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-[#2563EB] flex-1 truncate">{s.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
