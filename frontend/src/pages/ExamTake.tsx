import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Clock, RotateCcw, Trophy, XCircle } from "lucide-react";
import { EXAMS } from "../data/exams";
import { Breadcrumb } from "../components/Breadcrumb";

export default function ExamTake() {
  const { examId } = useParams<{ examId: string }>();
  const exam = EXAMS.find(item => item.id === examId);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(exam?.questions.length ?? 0).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState<number[]>([]);
  const score = useMemo(() => exam?.questions.filter((question, index) => answers[index] === question.correctIndex).length ?? 0, [answers, exam]);

  if (!exam) return <div className="min-h-screen bg-[#F8FAFC] px-4 py-24 text-center"><h1 className="text-2xl font-bold text-slate-900">Exam not found</h1><Link to="/exam" className="mt-4 inline-block font-bold text-[#2563EB]">Return to exam hub</Link></div>;

  const submit = () => {
    setSubmitted(true);
    localStorage.setItem(`astegni_exam_score_${exam.id}`, JSON.stringify({ score, total: exam.questions.length, completedAt: new Date().toISOString() }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const reset = () => {
    setAnswers(Array(exam.questions.length).fill(null));
    setSubmitted(false);
    setRevealed([]);
  };
  const percentage = Math.round((score / exam.questions.length) * 100);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-7 sm:px-6">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Exam Hub", to: "/exam" }, { label: exam.title }]} />
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div><span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">{exam.kind} exam</span><h1 className="mt-1 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-slate-900">{exam.title}</h1><p className="mt-2 max-w-2xl text-sm text-slate-500">{exam.description}</p></div>
            <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700"><Clock className="h-4 w-4" />{exam.duration}</div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {submitted && (
          <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A1F5C] to-[#2563EB] p-7 text-white shadow-xl">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
              <div><div className="flex items-center gap-2 text-blue-100"><Trophy className="h-5 w-5 text-amber-300" /> Exam complete</div><div className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-4xl font-extrabold">{score}/{exam.questions.length} correct</div><p className="mt-1 text-blue-100">{percentage}% · Review every answer and explanation below.</p></div>
              <button onClick={reset} className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-[#2563EB]"><RotateCcw className="h-4 w-4" />Try again</button>
            </div>
          </div>
        )}

        <div className="space-y-5">
          {exam.questions.map((question, questionIndex) => {
            const isCorrect = answers[questionIndex] === question.correctIndex;
            const showExplanation = submitted || revealed.includes(questionIndex);
            return (
              <section key={question.question} className={`rounded-2xl border bg-white p-6 shadow-sm ${submitted ? isCorrect ? "border-emerald-200" : "border-red-200" : "border-slate-100"}`}>
                <div className="mb-4 flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-extrabold text-blue-700">{questionIndex + 1}</span><h2 className="pt-1 text-base font-bold text-slate-900">{question.question}</h2>{submitted && (isCorrect ? <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-emerald-500" /> : <XCircle className="ml-auto h-5 w-5 shrink-0 text-red-500" />)}</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {question.options.map((option, optionIndex) => {
                    const selected = answers[questionIndex] === optionIndex;
                    const correct = showExplanation && optionIndex === question.correctIndex;
                    const wrong = showExplanation && selected && !correct;
                    return <button disabled={submitted} key={option} onClick={() => setAnswers(current => current.map((answer, index) => index === questionIndex ? optionIndex : answer))} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${correct ? "border-emerald-300 bg-emerald-50 text-emerald-800" : wrong ? "border-red-300 bg-red-50 text-red-800" : selected ? "border-blue-400 bg-blue-50 text-blue-800" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300"}`}>{String.fromCharCode(65 + optionIndex)}. {option}</button>;
                  })}
                </div>
                <button type="button" onClick={() => setRevealed(current => current.includes(questionIndex) ? current.filter(index => index !== questionIndex) : [...current, questionIndex])} className="mt-4 flex items-center gap-1 text-xs font-bold text-[#2563EB]">{showExplanation ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}{showExplanation ? "Hide" : "Show"} answer & explanation</button>
                {showExplanation && <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-relaxed text-slate-700"><strong className="text-blue-800">Answer: {question.options[question.correctIndex]}.</strong> {question.explanation}</div>}
              </section>
            );
          })}
        </div>

        {!submitted && <button disabled={answers.some(answer => answer === null)} onClick={submit} className="mt-7 w-full rounded-xl bg-[#2563EB] py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">Submit exam</button>}
        <Link to="/exam" className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-[#2563EB]"><ArrowLeft className="h-4 w-4" />Back to exam hub</Link>
      </main>
    </div>
  );
}
