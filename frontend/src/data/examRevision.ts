import { CHAPTERS_BY_SUBJECT } from "./index";

export interface RevisionChapter {
  title: string;
  note: string;
}

const subjectFocus: Record<string, string> = {
  mathematics: "identify the given quantities, choose the correct relationship, and show each algebraic step",
  physics: "draw a simple model, track units carefully, and connect the governing law to the observation",
  chemistry: "relate particle-level behavior to the equation, conditions, and measurable result",
  biology: "connect structure with function and explain the process in a clear cause-and-effect sequence",
  english: "look for context, purpose, organization, and precise language before choosing an answer",
  history: "place events in sequence, compare causes and consequences, and support claims with evidence",
};

export function getExamRevision(subjectId: string): RevisionChapter[] {
  const chapters = CHAPTERS_BY_SUBJECT[subjectId] ?? [];
  const focus = subjectFocus[subjectId] ?? "define the key terms, connect the main ideas, and apply them to an exam-style example";
  return chapters.map(title => ({
    title,
    note: `${title} is tested through both core concepts and their practical application. For revision, ${focus}. Finish by summarizing the chapter in your own words and attempting one question without notes.`,
  }));
}
