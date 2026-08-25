const CONTENT_API = "https://api.asteghi.com/api";

export interface ApiChapter {
  id: number;
  attachement?: string | null;
  subject_id: number;
  grade_id: number;
  name: string;
  description: string;
}

/** Backend subject ids we know so far. Mathematics is the only seeded subject. */
export const SUBJECT_API_IDS: Record<string, number> = {
  mathematics: 1,
};

/** Backend grade ids are sequential records, not 9–12. */
const GRADE_API_IDS: Record<string, number> = {
  "9": 1,
  "10": 2,
  "11": 3,
  "12": 4,
};

export async function getChapters(): Promise<ApiChapter[]> {
  const response = await fetch(`${CONTENT_API}/chapter`);
  if (!response.ok) throw new Error("Unable to load chapters.");
  const payload = await response.json().catch(() => null);
  return Array.isArray(payload?.data) ? payload.data as ApiChapter[] : [];
}

export function chaptersForSubjectAndGrade(chapters: ApiChapter[], subjectSlug: string, grade: string) {
  const subjectId = SUBJECT_API_IDS[subjectSlug];
  if (!subjectId) return [];

  const bySubject = chapters.filter(chapter => chapter.subject_id === subjectId);
  const gradeId = GRADE_API_IDS[grade];
  const byGrade = gradeId ? bySubject.filter(chapter => chapter.grade_id === gradeId) : [];
  return byGrade.length > 0 ? byGrade : bySubject;
}

export function findChapter(chapters: ApiChapter[], id: number) {
  return chapters.find(chapter => chapter.id === id);
}
