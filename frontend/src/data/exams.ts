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
  description: string;
  duration: string;
  questions: ExamQuestion[];
}

const CORE_QUESTIONS: ExamQuestion[] = [
  { question: "If f(x) = 2x + 3, what is f(4)?", options: ["8", "10", "11", "14"], correctIndex: 2, explanation: "Substitute x = 4: f(4) = 2(4) + 3 = 11." },
  { question: "Which organelle is the main site of cellular respiration?", options: ["Nucleus", "Mitochondrion", "Ribosome", "Vacuole"], correctIndex: 1, explanation: "Mitochondria release usable energy from nutrients through cellular respiration." },
  { question: "A body moving at constant velocity has:", options: ["Increasing acceleration", "Zero net force", "Increasing momentum", "Zero mass"], correctIndex: 1, explanation: "Constant velocity means zero acceleration, so Newton's second law gives zero net force." },
  { question: "A solution with pH 3 is best described as:", options: ["Strongly acidic", "Neutral", "Weakly basic", "Strongly basic"], correctIndex: 0, explanation: "Any pH below 7 is acidic; pH 3 indicates a distinctly acidic solution." },
  { question: "Choose the grammatically correct sentence.", options: ["She have completed the work.", "She has completed the work.", "She completed has the work.", "She having completed work."], correctIndex: 1, explanation: "The singular subject 'she' takes 'has' in the present perfect tense." },
];

function exam(id: string, title: string, kind: ExamDefinition["kind"], duration: string): ExamDefinition {
  return { id, title, kind, duration, description: kind === "past" ? "A representative EUEE paper covering core Grade 12 concepts." : "A timed mixed-subject simulation designed for final exam preparation.", questions: CORE_QUESTIONS };
}

export const EXAMS: ExamDefinition[] = [
  exam("past-2015", "EUEE 2015 E.C.", "past", "75 minutes"),
  exam("past-2014", "EUEE 2014 E.C.", "past", "75 minutes"),
  exam("past-2013", "EUEE 2013 E.C.", "past", "75 minutes"),
  exam("past-2012", "EUEE 2012 E.C.", "past", "75 minutes"),
  exam("mock-a", "Full Mock Exam — Set A", "mock", "60 minutes"),
  exam("mock-b", "Full Mock Exam — Set B", "mock", "60 minutes"),
  exam("mock-math", "Mathematics Focused Mock", "mock", "45 minutes"),
  exam("mock-science", "Natural Sciences Mock", "mock", "50 minutes"),
];

export const PAST_EXAM_CARDS = EXAMS.filter(item => item.kind === "past");
export const MOCK_EXAM_CARDS = EXAMS.filter(item => item.kind === "mock");
