import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Clock, Download, FileText, FolderOpen, HelpCircle, Play, Star, Users, X } from "lucide-react";
import { SUBJECT_DEFS, CHAPTERS_BY_SUBJECT } from "../data";
import { Breadcrumb } from "../components/Breadcrumb";

type Tab = "overview" | "notes" | "quiz" | "textbook" | "videos" | "resources";
interface ProgressState { pagesRead: number[]; quizDone: boolean; score?: number }
interface LearningFile { title: string; meta: string; content: string }

const QUIZ = [
  { question: "Which approach is best when beginning an unfamiliar problem?", options: ["Guess immediately", "Identify the knowns and key concept", "Skip all working", "Memorize the answer"], correctIndex: 1 },
  { question: "Why are worked examples useful?", options: ["They replace definitions", "They show how concepts are applied step by step", "They remove the need to practice", "They only provide final answers"], correctIndex: 1 },
  { question: "What is the strongest final revision habit?", options: ["Read once only", "Avoid checking errors", "Explain the idea and solve a new example", "Copy notes word for word"], correctIndex: 2 },
];

function readProgress(key: string): ProgressState {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as ProgressState : { pagesRead: [], quizDone: false };
  } catch {
    return { pagesRead: [], quizDone: false };
  }
}

export default function ChapterLearning() {
  const { grade = "12", subject = "mathematics", chapter = "1" } = useParams();
  const chapterNumber = Number(chapter) || 1;
  const subjectDef = SUBJECT_DEFS.find(item => item.id === subject) ?? SUBJECT_DEFS[0];
  const chapters = CHAPTERS_BY_SUBJECT[subject] ?? CHAPTERS_BY_SUBJECT.mathematics;
  const chapterTitle = chapters[chapterNumber - 1] ?? chapters[0];
  const progressKey = `astegni_chapter_progress_${grade}_${subject}_${chapter}`;
  const [tab, setTab] = useState<Tab>("overview");
  const [notePage, setNotePage] = useState(0);
  const [chapterProgress, setChapterProgress] = useState<ProgressState>(() => readProgress(progressKey));
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const [submitted, setSubmitted] = useState(false);
  const [reader, setReader] = useState<LearningFile | null>(null);
  const Icon = subjectDef.icon;

  useEffect(() => {
    setChapterProgress(readProgress(progressKey));
    setTab("overview");
    setNotePage(0);
    setAnswers([null, null, null]);
    setSubmitted(false);
  }, [progressKey]);

  useEffect(() => {
    localStorage.setItem(progressKey, JSON.stringify(chapterProgress));
  }, [chapterProgress, progressKey]);

  const progress = Math.round(((chapterProgress.pagesRead.length / 3) * 50) + (chapterProgress.quizDone ? 50 : 0));
  const notes = useMemo(() => [
    {
      eyebrow: "Core ideas & definitions",
      title: `Understanding ${chapterTitle}`,
      body: `${chapterTitle} is a central part of Grade ${grade} ${subjectDef.name}. Begin by identifying the vocabulary, quantities, events, or processes involved, then connect each definition to a concrete example.`,
      points: [`Define ${chapterTitle} using precise curriculum language.`, "Distinguish the main idea from closely related concepts.", "Use a simple diagram, table, or sentence to represent the relationship."],
      callout: `Key definition: ${chapterTitle} describes a structured relationship that can be observed, analyzed, and applied to solve subject-specific problems.`,
    },
    {
      eyebrow: "Methods & formulas",
      title: "Apply the key relationships",
      body: `Turn the chapter's ideas into a repeatable method: list what is known, identify what must be found, choose the relevant rule, and check whether the result is reasonable.`,
      points: ["Known information → governing principle → substitution or evidence → conclusion.", "Keep symbols, terminology, and units consistent.", "Explain why each step follows from the one before it."],
      callout: subject === "mathematics" ? "Useful pattern: input → operation or rule → output; verify by substitution." : `Useful pattern: cause or condition → process → observable result in ${subjectDef.name}.`,
    },
    {
      eyebrow: "Worked example & exam check",
      title: "From concept to exam answer",
      body: `Example: an exam question presents a new situation involving ${chapterTitle}. Underline the command word, recall the matching concept, work through the evidence step by step, and end with a direct answer.`,
      points: ["State the relevant principle before applying it.", "Show enough reasoning to earn method marks.", "Review common errors: skipped steps, vague terminology, and unsupported conclusions."],
      callout: `Self-check: Can you explain ${chapterTitle} in two sentences and solve or analyze one fresh example without looking at the notes?`,
    },
  ], [chapterTitle, grade, subject, subjectDef.name]);

  const files: Record<"textbook" | "resources", LearningFile[]> = {
    textbook: [
      { title: `Grade ${grade} ${subjectDef.name} Textbook — Chapter ${chapterNumber}`, meta: "Official chapter extract · 18 pages", content: `${chapterTitle}\n\nThis textbook extract introduces the chapter vocabulary, explains the principal relationships, and demonstrates how each idea is used. Read the definitions first, then follow the worked examples. Complete the review prompts by stating the principle used at every step.\n\nSummary\n${notes.map((item, index) => `${index + 1}. ${item.title}: ${item.body}`).join("\n")}` },
      { title: "Teacher's Guide Notes", meta: "Instructional guide · 8 pages", content: `${chapterTitle} — Teacher's Guide\n\nLearning goal: students should define the core ideas, apply the standard method, and explain their reasoning. Check understanding using one recall question, one guided example, and one independent exam-style task.` },
      { title: "Supplementary Worksheets", meta: "Practice set · 12 activities", content: `${chapterTitle} Practice\n\n1. Write the key definition in your own words.\n2. Give one correct example and one non-example.\n3. Apply the chapter method to a new situation.\n4. Explain one common error and how to avoid it.\n5. Create a two-minute summary for exam revision.` },
    ],
    resources: [
      { title: "Chapter Quick Revision Sheet", meta: "One-page summary", content: `${chapterTitle} — Quick Revision\n\nDefinition: ${notes[0].callout}\n\nMethod: ${notes[1].points.join(" ")}\n\nExam check: ${notes[2].callout}` },
      { title: "Practice Problem Set", meta: "10 exam-style prompts", content: `${chapterTitle} — Practice Set\n\nAnswer each prompt using complete reasoning.\n\n1. Define the central concept.\n2. Identify the correct method for a familiar example.\n3. Compare two related ideas.\n4. Analyze a new situation.\n5. Explain and correct a common misconception.` },
      { title: "National Exam Checklist", meta: "Study checklist", content: `${chapterTitle} — Exam Checklist\n\n□ I can define every key term.\n□ I can reproduce the main relationship or process.\n□ I can solve or analyze an unfamiliar example.\n□ I can check my answer.\n□ I can explain a common mistake.` },
    ],
  };

  const openNotes = (page: number) => {
    setTab("notes");
    setNotePage(page);
    setChapterProgress(current => current.pagesRead.includes(page) ? current : { ...current, pagesRead: [...current.pagesRead, page] });
  };
  const submitQuiz = () => {
    const score = answers.filter((answer, index) => answer === QUIZ[index].correctIndex).length;
    setSubmitted(true);
    setChapterProgress(current => ({ ...current, quizDone: true, score }));
  };
  const download = (file: LearningFile) => {
    const blob = new Blob([file.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${file.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const switchTab = (next: Tab) => next === "notes" ? openNotes(notePage) : setTab(next);
  const learningPath: { label: string; tab: Tab; done: boolean; page?: number }[] = [
    { label: "Overview", tab: "overview", done: chapterProgress.pagesRead.length > 0 },
    ...notes.map((_, index) => ({ label: `Notes · Page ${index + 1}`, tab: "notes" as Tab, page: index, done: chapterProgress.pagesRead.includes(index) })),
    { label: "Practice Quiz", tab: "quiz", done: chapterProgress.quizDone },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Learn", to: "/learn" }, { label: `Grade ${grade}`, to: `/learn/${grade}` }, { label: subjectDef.name, to: `/learn/${grade}/${subject}` }, { label: `Chapter ${chapterNumber}` }]} />
          <div className="mt-4 flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: subjectDef.bg }}><Icon className="h-6 w-6" style={{ color: subjectDef.color }} /></div><div><div className="text-xs font-bold uppercase tracking-wider" style={{ color: subjectDef.color }}>{subjectDef.name} · Chapter {chapterNumber}</div><h1 className="mt-1 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-slate-900">{chapterTitle}</h1><div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500"><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />~45 min</span><span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />3,240 students</span><span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />4.9</span></div></div></div>
          <div className="mt-6 flex items-center gap-4"><div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#2563EB] transition-all duration-500" style={{ width: `${progress}%` }} /></div><span className="text-sm font-extrabold text-[#2563EB]">{progress}% complete</span>{progress === 100 && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}</div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">{([
          ["overview", "Overview", BookOpen], ["notes", "Notes", FileText], ["quiz", "Practice Quiz", HelpCircle], ["textbook", "Textbook", BookOpen], ["videos", "Videos", Play], ["resources", "Resources", FolderOpen],
        ] as const).map(([id, label, NavIcon]) => <button key={id} onClick={() => switchTab(id)} className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3.5 text-sm font-semibold transition ${tab === id ? "border-[#2563EB] text-[#2563EB]" : "border-transparent text-slate-500 hover:text-slate-800"}`}><NavIcon className="h-4 w-4" />{label}</button>)}</nav>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_270px] lg:px-8">
        <div>
          {tab === "overview" && <section className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm"><span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Your guided path</span><h2 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-slate-900">Chapter Overview</h2><p className="mt-4 leading-7 text-slate-600">Build a confident understanding of <strong>{chapterTitle}</strong>. You will read three concise note pages, apply the central ideas, and finish with a practice quiz.</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{["1 · Learn the concepts", "2 · Work through examples", "3 · Check your knowledge"].map(item => <div key={item} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700">{item}</div>)}</div><button onClick={() => openNotes(0)} className="mt-7 flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">Next: Notes <ChevronRight className="h-4 w-4" /></button></section>}

          {tab === "notes" && <section className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm"><div className="mb-6 flex items-center justify-between gap-4"><div><span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Page {notePage + 1} of 3</span><h2 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-slate-900">{notes[notePage].title}</h2></div><span className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">{chapterProgress.pagesRead.includes(notePage) ? "✓ Read" : "Reading"}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-[#2563EB]" style={{ width: `${((notePage + 1) / 3) * 100}%` }} /></div><p className="mt-2 text-xs font-semibold text-slate-400">{notes[notePage].eyebrow}</p><p className="mt-6 leading-7 text-slate-600">{notes[notePage].body}</p><div className="mt-5 rounded-2xl border-l-4 border-blue-500 bg-blue-50 p-5 text-sm leading-6 text-slate-700">{notes[notePage].callout}</div><ul className="mt-6 space-y-3">{notes[notePage].points.map(point => <li key={point} className="flex gap-3 text-sm leading-6 text-slate-600"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />{point}</li>)}</ul><div className="mt-8 flex flex-wrap items-center justify-between gap-3"><button disabled={notePage === 0} onClick={() => openNotes(notePage - 1)} className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 disabled:opacity-40"><ChevronLeft className="h-4 w-4" />Previous</button>{notePage < 2 ? <button onClick={() => openNotes(notePage + 1)} className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white">Next page <ChevronRight className="h-4 w-4" /></button> : <button onClick={() => setTab("quiz")} className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200">Take Practice Quiz <ChevronRight className="h-4 w-4" /></button>}</div></section>}

          {tab === "quiz" && <section className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm"><h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-slate-900">Practice Quiz</h2><p className="mt-2 text-sm text-slate-500">Answer all three questions to complete the chapter.</p><div className="mt-7 space-y-5">{QUIZ.map((item, questionIndex) => <div key={item.question} className="rounded-2xl border border-slate-100 p-5"><h3 className="mb-4 text-sm font-bold text-slate-800"><span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700">{questionIndex + 1}</span>{item.question}</h3><div className="grid gap-2 sm:grid-cols-2">{item.options.map((option, optionIndex) => { const selected = answers[questionIndex] === optionIndex; const correct = submitted && optionIndex === item.correctIndex; const wrong = submitted && selected && !correct; return <button disabled={submitted} key={option} onClick={() => setAnswers(current => current.map((answer, index) => index === questionIndex ? optionIndex : answer))} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold ${correct ? "border-emerald-300 bg-emerald-50 text-emerald-800" : wrong ? "border-red-300 bg-red-50 text-red-800" : selected ? "border-blue-400 bg-blue-50 text-blue-800" : "border-slate-200 bg-slate-50 text-slate-700"}`}>{option}</button>; })}</div></div>)}</div>{!submitted ? <button disabled={answers.some(answer => answer === null)} onClick={submitQuiz} className="mt-6 w-full rounded-xl bg-[#2563EB] py-3.5 font-bold text-white disabled:bg-slate-300">Submit answers</button> : <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center"><CheckCircle2 className="mx-auto h-9 w-9 text-emerald-500" /><h3 className="mt-2 font-bold text-emerald-900">Chapter complete!</h3><p className="mt-1 text-sm text-emerald-700">Score: {chapterProgress.score}/{QUIZ.length} · Your progress is now 100%.</p></div>}</section>}

          {(tab === "textbook" || tab === "resources") && <FileLibrary title={tab === "textbook" ? "Textbook Library" : "Additional Resources"} files={files[tab]} onRead={setReader} onDownload={download} />}
          {tab === "videos" && <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"><div className="relative flex aspect-video items-center justify-center bg-slate-900"><img src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=900&h=500&fit=crop&auto=format" alt="Lesson preview" className="h-full w-full object-cover opacity-45" /><button className="absolute flex h-16 w-16 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-xl"><Play className="h-7 w-7 fill-white" /></button></div><div className="p-6"><h2 className="font-bold text-slate-900">{chapterTitle}: guided video lesson</h2><p className="mt-1 text-sm text-slate-500">Optional enrichment · 22 minutes</p></div></section>}

          <div className="mt-6 flex justify-between">{chapterNumber > 1 ? <Link to={`/learn/${grade}/${subject}/${chapterNumber - 1}`} className="flex items-center gap-2 text-sm font-bold text-slate-500"><ChevronLeft className="h-4 w-4" />Previous chapter</Link> : <span />}{chapterNumber < chapters.length && <Link to={`/learn/${grade}/${subject}/${chapterNumber + 1}`} className="flex items-center gap-2 text-sm font-bold text-[#2563EB]">Next chapter<ChevronRight className="h-4 w-4" /></Link>}</div>
        </div>
        <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><h3 className="mb-4 text-sm font-bold text-slate-800">Learning path</h3>{learningPath.map((item, index) => <button key={item.label} onClick={() => item.tab === "notes" ? openNotes(item.page ?? 0) : setTab(item.tab)} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${tab === item.tab && (item.tab !== "notes" || notePage === item.page) ? "bg-blue-50 font-bold text-[#2563EB]" : "text-slate-600 hover:bg-slate-50"}`}><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${item.done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{item.done ? "✓" : index + 1}</span>{item.label}</button>)}</aside>
      </main>

      {reader && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onClick={() => setReader(null)}><div role="dialog" aria-modal="true" className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={event => event.stopPropagation()}><div className="flex items-center justify-between border-b border-slate-200 p-5"><div><h2 className="font-bold text-slate-900">{reader.title}</h2><p className="text-xs text-slate-500">{reader.meta}</p></div><button onClick={() => setReader(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="max-h-[60vh] overflow-y-auto whitespace-pre-line p-7 leading-7 text-slate-700">{reader.content}</div><div className="border-t border-slate-200 p-4 text-right"><button onClick={() => download(reader)} className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white"><Download className="h-4 w-4" />Download</button></div></div></div>}
    </div>
  );
}

function FileLibrary({ title, files, onRead, onDownload }: { title: string; files: LearningFile[]; onRead: (file: LearningFile) => void; onDownload: (file: LearningFile) => void }) {
  return <section><h2 className="mb-5 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-slate-900">{title}</h2><div className="grid gap-4">{files.map(file => <article key={file.title} className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50"><FileText className="h-6 w-6 text-[#2563EB]" /></div><div className="flex-1"><h3 className="font-bold text-slate-900">{file.title}</h3><p className="mt-1 text-xs text-slate-500">{file.meta}</p></div><div className="flex gap-2"><button onClick={() => onRead(file)} className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100">Read</button><button onClick={() => onDownload(file)} className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"><Download className="h-4 w-4" />Download</button></div></article>)}</div></section>;
}
