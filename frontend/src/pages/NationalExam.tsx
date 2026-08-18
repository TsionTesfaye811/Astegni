import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, Clock, BookOpen, FileText, Target, Lightbulb, CheckCircle2, Play, ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { EXAM_SUBJECTS, EXAM_TIPS, SUBJECT_DEFS } from "../data";
import { Breadcrumb } from "../components/Breadcrumb";
import { getExamRevision } from "../data/examRevision";
import { getExamsBySubject } from "../data/exams";

const STAT_STYLES = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  violet: { bg: "bg-violet-50", text: "text-violet-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
} as const;

const EXAM_DATE = new Date("2026-09-15");

function Countdown() {
  const [diff, setDiff] = useState(Math.max(0, EXAM_DATE.getTime() - Date.now()));
  useEffect(() => { const t = setInterval(() => setDiff(Math.max(0, EXAM_DATE.getTime() - Date.now())), 1000); return () => clearInterval(t); }, []);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return (
    <div className="flex gap-3">
      {[{ v: days, l: "Days" }, { v: hours, l: "Hours" }, { v: mins, l: "Minutes" }, { v: secs, l: "Seconds" }].map(({ v, l }) => (
        <div key={l} className="flex-1 bg-white/15 border border-white/20 rounded-2xl p-3 text-center backdrop-blur-sm">
          <div className="text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] text-white">{String(v).padStart(2, "0")}</div>
          <div className="text-white/60 text-[11px] mt-0.5">{l}</div>
        </div>
      ))}
    </div>
  );
}

export default function NationalExam() {
  const [activeRoadmap, setActiveRoadmap] = useState(0);
  const [revisionSubject, setRevisionSubject] = useState<string | null>(null);
  const [revisionChapter, setRevisionChapter] = useState<number | null>(null);
  const [examSubjectId, setExamSubjectId] = useState(SUBJECT_DEFS[0].id);
  const overallProgress = Math.round(EXAM_SUBJECTS.reduce((a, s) => a + s.progress, 0) / EXAM_SUBJECTS.length);
  const pastForSubject = getExamsBySubject(examSubjectId, "past");
  const mockForSubject = getExamsBySubject(examSubjectId, "mock");
  const selectedSubject = SUBJECT_DEFS.find(s => s.id === examSubjectId) ?? SUBJECT_DEFS[0];

  const roadmap = [
    { step: "1", title: "Assess Your Baseline", desc: "Take a diagnostic test to identify your strong and weak subjects.", done: true },
    { step: "2", title: "Subject-by-Subject Revision", desc: "Work through each subject chapter-by-chapter with notes and videos.", done: true },
    { step: "3", title: "Practice Chapter Quizzes", desc: "Complete all chapter-level quizzes to reinforce understanding.", done: false },
    { step: "4", title: "Past Exam Papers", desc: "Practice with 5 years of real EUEE past papers under timed conditions.", done: false },
    { step: "5", title: "Full Mock Exams", desc: "Take at least 2 full mock exams simulating real exam conditions.", done: false },
    { step: "6", title: "Final Revision Week", desc: "Review flashcards, key formulas, and exam tips in the final 7 days.", done: false },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-[#0A1F5C] via-[#1344C8] to-[#2563EB] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "National Exam for Grade 12" }]} />
          <div className="grid lg:grid-cols-2 gap-10 items-center mt-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-bold mb-4">
                <Trophy className="w-3.5 h-3.5" /> Ethiopian University Entrance Exam (EUEE)
              </div>
              <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-4xl mb-3">National Exam for<br />Grade 12</h1>
              <p className="text-blue-100/80 leading-relaxed mb-5">Everything you need to ace the Grade 12 national exam — past papers and mock exams for every subject, revision notes, and expert tips.</p>
              <div className="flex flex-wrap gap-3">
                <a href="#revision" className="px-5 py-2.5 bg-[#F59E0B] text-amber-900 font-bold rounded-xl hover:bg-amber-400 transition-colors">
                  Start Revision
                </a>
                <button className="px-5 py-2.5 bg-white/10 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors">
                  View Roadmap
                </button>
              </div>
            </div>
            <div>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-amber-300" />
                  <span className="font-bold text-white">Exam Countdown — 2016 E.C.</span>
                </div>
                <Countdown />
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-blue-200">Overall Readiness</span><span className="font-bold text-white">{overallProgress}%</span></div>
                  <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#F59E0B] rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {([{ icon: BookOpen, v: "10", l: "Subjects Covered", c: "blue" }, { icon: FileText, v: "50+", l: "Past Exam Papers", c: "violet" }, { icon: Target, v: "500+", l: "Practice Questions", c: "emerald" }, { icon: Trophy, v: "87%", l: "Pass Rate", c: "amber" }] as const).map(({ icon: I, v, l, c }) => (
            <div key={l} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
              <div className={`w-11 h-11 rounded-2xl ${STAT_STYLES[c].bg} flex items-center justify-center shrink-0`}>
                <I className={`w-5 h-5 ${STAT_STYLES[c].text}`} />
              </div>
              <div><div className={`text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] ${STAT_STYLES[c].text}`}>{v}</div><div className="text-xs text-slate-500">{l}</div></div>
            </div>
          ))}
        </div>

        {/* Subject Revision */}
        <div id="revision">
          <div className="flex items-center gap-2 mb-6"><div className="w-1 h-5 rounded-full bg-[#2563EB]" /><h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-xl text-slate-900">Subject Revision Progress</h2></div>
          {!revisionSubject ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {EXAM_SUBJECTS.map(s => (
                <button key={s.name} onClick={() => { setRevisionSubject(s.name.toLowerCase()); setRevisionChapter(null); }}
                  className="group bg-white text-left rounded-2xl border border-slate-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 group-hover:text-[#2563EB] transition-colors">{s.name}</h3>
                    <span className="text-sm font-extrabold font-['Plus_Jakarta_Sans',sans-serif]" style={{ color: s.color }}>{s.progress}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.progress}%`, background: s.color }} /></div>
                  <div className="flex items-center justify-between text-xs text-slate-500"><span>{s.chapters} short notes</span><span className="flex items-center gap-1 font-semibold" style={{ color: s.color }}>Open revision <ArrowRight className="w-3 h-3" /></span></div>
                </button>
              ))}
            </div>
          ) : (() => {
            const subjectDef = SUBJECT_DEFS.find(subject => subject.id === revisionSubject) ?? SUBJECT_DEFS[0];
            const notes = getExamRevision(revisionSubject);
            const selectedNote = revisionChapter === null ? null : notes[revisionChapter];
            const SubjectIcon = subjectDef.icon;
            return (
              <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                <button onClick={() => { if (selectedNote) setRevisionChapter(null); else setRevisionSubject(null); }} className="mb-5 flex items-center gap-1.5 text-sm font-bold text-[#2563EB]"><ChevronLeft className="h-4 w-4" />{selectedNote ? `All ${subjectDef.name} chapters` : "All subjects"}</button>
                {!selectedNote ? (
                  <>
                    <div className="mb-5 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: subjectDef.bg }}><SubjectIcon className="h-5 w-5" style={{ color: subjectDef.color }} /></div><div><h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold text-slate-900">{subjectDef.name} Revision</h3><p className="text-sm text-slate-500">Select a chapter for a concise exam-ready summary.</p></div></div>
                    <div className="grid gap-3 sm:grid-cols-2">{notes.map((note, index) => <button key={note.title} onClick={() => setRevisionChapter(index)} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"><div><span className="text-xs font-bold text-[#2563EB]">Chapter {index + 1}</span><div className="mt-1 text-sm font-bold text-slate-800">{note.title}</div></div><ChevronRight className="h-4 w-4 text-slate-400" /></button>)}</div>
                  </>
                ) : (
                  <div><span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Chapter {revisionChapter! + 1} · Short note</span><h3 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-slate-900">{selectedNote.title}</h3><p className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 leading-7 text-slate-700">{selectedNote.note}</p><div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900"><strong>Exam check:</strong> Can you define the topic, give one example, and explain one common mistake without checking your notes?</div></div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Roadmap */}
        <div>
          <div className="flex items-center gap-2 mb-6"><div className="w-1 h-5 rounded-full bg-[#2563EB]" /><h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-xl text-slate-900">Exam Roadmap</h2></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roadmap.map((step, i) => (
              <div key={i} onClick={() => setActiveRoadmap(i)}
                className={`bg-white rounded-2xl border p-5 cursor-pointer transition-all ${activeRoadmap === i ? "border-[#2563EB] shadow-md shadow-blue-100" : "border-slate-100 hover:border-slate-200 hover:shadow-md"}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${step.done ? "bg-emerald-100 text-emerald-600" : activeRoadmap === i ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                    {step.done ? <CheckCircle2 className="w-4 h-4" /> : step.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 mb-1">{step.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                    {step.done && <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600"><CheckCircle2 className="w-3 h-3" />Completed</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Exams & Mock Exams — all subjects */}
        <div id="exams">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1"><div className="w-1 h-5 rounded-full bg-[#2563EB]" /><h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-xl text-slate-900">Past & Mock Exams by Subject</h2></div>
              <p className="text-sm text-slate-500">Every Grade 12 subject includes its own past national exams and mock exams.</p>
            </div>
          </div>
          <div className="mb-6 flex flex-wrap gap-2">
            {SUBJECT_DEFS.map(subject => (
              <button key={subject.id} onClick={() => setExamSubjectId(subject.id)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${examSubjectId === subject.id ? "bg-[#2563EB] text-white shadow-md shadow-blue-200" : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300"}`}>
                {subject.name}
              </button>
            ))}
          </div>
          <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">
            Showing exams for <span className="font-extrabold">{selectedSubject.name}</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-5"><FileText className="w-4 h-4 text-blue-600" /><h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-lg text-slate-900">Past National Exams</h3></div>
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                {pastForSubject.map((exam, i) => (
                  <div key={exam.id} className={`flex items-center justify-between gap-3 p-4 transition-colors hover:bg-slate-50 ${i < pastForSubject.length - 1 ? "border-b border-slate-100" : ""}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0"><FileText className="w-4 h-4 text-blue-600" /></div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800 truncate">{exam.title}</div>
                        <div className="text-xs text-slate-500">{exam.questions.length} questions · {exam.duration}</div>
                      </div>
                    </div>
                    <Link to={`/exam/take/${exam.id}`} className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shrink-0"><Play className="w-3.5 h-3.5" /> Start</Link>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-5"><Clock className="w-4 h-4 text-amber-500" /><h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-lg text-slate-900">Mock Exams</h3></div>
              <div className="space-y-3">
                {mockForSubject.map(exam => (
                  <div key={exam.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-50 shrink-0"><Clock className="w-4 h-4 text-amber-500" /></div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800 truncate">{exam.title}</div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>{exam.duration}</span><span>·</span><span>{exam.questions.length} questions</span>
                        </div>
                      </div>
                    </div>
                    <Link to={`/exam/take/${exam.id}`} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap bg-[#2563EB] text-white hover:bg-blue-700 shrink-0"><Play className="w-3.5 h-3.5" /> Start</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Exam Tips */}
        <div>
          <div className="flex items-center gap-2 mb-6"><div className="w-1 h-5 rounded-full bg-[#2563EB]" /><h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-xl text-slate-900">Exam Tips</h2></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXAM_TIPS.map((tip, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0"><Lightbulb className="w-4 h-4 text-amber-500" /></div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 mb-1">{tip.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{tip.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
