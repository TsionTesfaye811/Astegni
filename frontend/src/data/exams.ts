import { SUBJECT_DEFS } from "./index";

export interface ExamQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ExamDefinition {
  id: string;
  title: string;
  kind: "past" | "mock";
  subjectId: string;
  subjectName: string;
  description: string;
  duration: string;
  year?: string;
  questions: ExamQuestion[];
}

function subjectQuestions(subjectName: string): ExamQuestion[] {
  return [
    {
      question: `Which study approach best prepares you for ${subjectName} on the National Exam for Grade 12?`,
      options: ["Memorize without practice", "Define concepts, then solve new examples", "Skip weak chapters", "Only revise the night before"],
      correctIndex: 1,
      explanation: `Strong ${subjectName} performance comes from understanding definitions and applying them to unfamiliar questions.`,
    },
    {
      question: `In a timed ${subjectName} paper, what should you do first?`,
      options: ["Spend all time on one hard question", "Scan the paper and start with confident items", "Leave every question blank", "Ignore the instructions"],
      correctIndex: 1,
      explanation: "Scanning and securing easy marks early improves total score and reduces panic.",
    },
    {
      question: `A common ${subjectName} exam error is:`,
      options: ["Showing clear working", "Checking units/definitions", "Skipping the command word in the question", "Reviewing answers if time remains"],
      correctIndex: 2,
      explanation: "Command words (define, explain, calculate, compare) tell you what the marker expects.",
    },
    {
      question: `Which statement about ${subjectName} revision is most accurate?`,
      options: ["Past papers are unnecessary", "Short daily practice beats cramming", "Only reading notes is enough", "Mock exams do not help"],
      correctIndex: 1,
      explanation: "Consistent practice builds speed, accuracy, and exam stamina.",
    },
    {
      question: `When stuck on a ${subjectName} question you should:`,
      options: ["Leave it forever", "Mark it, move on, then return if time allows", "Guess randomly without reading", "Stop the exam"],
      correctIndex: 1,
      explanation: "Marking and returning later protects your overall score.",
    },
  ];
}

const PAST_YEARS = ["2015 E.C.", "2014 E.C.", "2013 E.C."];

export const EXAMS: ExamDefinition[] = SUBJECT_DEFS.flatMap(subject => {
  const past = PAST_YEARS.map((year, index) => ({
    id: `past-${subject.id}-${year.replace(/\s+/g, "-").toLowerCase()}`,
    title: `${subject.name} · National Exam ${year}`,
    kind: "past" as const,
    subjectId: subject.id,
    subjectName: subject.name,
    year,
    duration: "60 minutes",
    description: `Past National Exam style questions for Grade 12 ${subject.name}.`,
    questions: subjectQuestions(subject.name).map((q, qi) => ({
      ...q,
      question: index === 0 ? q.question : q.question.replace("National Exam for Grade 12", `${year} paper`),
      explanation: qi === 0 ? `${q.explanation} (Focus area: ${subject.description})` : q.explanation,
    })),
  }));

  const mocks = ["Set A", "Set B"].map(set => ({
    id: `mock-${subject.id}-${set.toLowerCase().replace(/\s+/g, "-")}`,
    title: `${subject.name} Mock Exam — ${set}`,
    kind: "mock" as const,
    subjectId: subject.id,
    subjectName: subject.name,
    duration: "45 minutes",
    description: `Timed Grade 12 ${subject.name} mock exam for national exam preparation.`,
    questions: subjectQuestions(subject.name),
  }));

  return [...past, ...mocks];
});

export const PAST_EXAM_CARDS = EXAMS.filter(item => item.kind === "past");
export const MOCK_EXAM_CARDS = EXAMS.filter(item => item.kind === "mock");

export function getExamsBySubject(subjectId: string, kind?: "past" | "mock") {
  return EXAMS.filter(exam => exam.subjectId === subjectId && (!kind || exam.kind === kind));
}
