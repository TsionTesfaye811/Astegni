import { Calculator, Zap, FlaskConical, Leaf, Languages, BookMarked, Landmark, MapPin, Scale } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SubjectDef {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  iconBg: string;
  chapters: number;
  description: string;
}

export const SUBJECT_DEFS: SubjectDef[] = [
  { id: "mathematics", name: "Mathematics", icon: Calculator, color: "#2563EB", bg: "#EFF6FF", iconBg: "#DBEAFE", chapters: 8, description: "Algebra, calculus, statistics and more" },
  { id: "physics", name: "Physics", icon: Zap, color: "#7C3AED", bg: "#F5F3FF", iconBg: "#EDE9FE", chapters: 7, description: "Mechanics, electromagnetism and optics" },
  { id: "chemistry", name: "Chemistry", icon: FlaskConical, color: "#DB2777", bg: "#FDF2F8", iconBg: "#FCE7F3", chapters: 9, description: "Organic, inorganic and physical chemistry" },
  { id: "biology", name: "Biology", icon: Leaf, color: "#059669", bg: "#ECFDF5", iconBg: "#D1FAE5", chapters: 8, description: "Cell biology, genetics and ecology" },
  { id: "english", name: "English", icon: Languages, color: "#0284C7", bg: "#F0F9FF", iconBg: "#E0F2FE", chapters: 6, description: "Reading, writing and communication" },
  { id: "amharic", name: "Amharic", icon: BookMarked, color: "#D97706", bg: "#FFFBEB", iconBg: "#FEF3C7", chapters: 7, description: "Language, literature and grammar" },
  { id: "history", name: "History", icon: Landmark, color: "#EA580C", bg: "#FFF7ED", iconBg: "#FFEDD5", chapters: 8, description: "Ethiopian, African and world history" },
  { id: "geography", name: "Geography", icon: MapPin, color: "#0F766E", bg: "#F0FDFA", iconBg: "#CCFBF1", chapters: 6, description: "Physical, human and environmental geography" },
  { id: "civics", name: "Civics", icon: Scale, color: "#6D28D9", bg: "#F5F3FF", iconBg: "#EDE9FE", chapters: 5, description: "Constitutional rights and civic duties" },
];

export type StreamId = "natural" | "social";

export const STREAMS: Array<{
  id: StreamId;
  name: string;
  description: string;
  subjects: string[];
  color: string;
  gradient: string;
  light: string;
  border: string;
}> = [
  {
    id: "natural",
    name: "Natural Science",
    description: "Mathematics, Physics, Chemistry, Biology, and shared language courses for science-focused learners.",
    subjects: ["mathematics", "physics", "chemistry", "biology", "english", "amharic"],
    color: "#059669",
    gradient: "from-emerald-500 to-teal-700",
    light: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    id: "social",
    name: "Social Science",
    description: "History, Geography, Civics, Mathematics, and shared language courses for social-focused learners.",
    subjects: ["mathematics", "history", "geography", "civics", "english", "amharic"],
    color: "#EA580C",
    gradient: "from-orange-500 to-rose-600",
    light: "bg-orange-50",
    border: "border-orange-200",
  },
];

export function isStreamId(value: string | undefined): value is StreamId {
  return value === "natural" || value === "social";
}

export function getStream(streamId: string | undefined) {
  return STREAMS.find(stream => stream.id === streamId);
}

export function getSubjectsForStream(streamId: string | undefined) {
  const stream = getStream(streamId);
  if (!stream) return SUBJECT_DEFS;
  return stream.subjects
    .map(id => SUBJECT_DEFS.find(subject => subject.id === id))
    .filter((subject): subject is SubjectDef => Boolean(subject));
}

export function getStreamForSubject(subjectId: string): StreamId {
  if (STREAMS.find(stream => stream.id === "natural")?.subjects.includes(subjectId)) return "natural";
  return "social";
}

export const CHAPTERS_BY_SUBJECT: Record<string, string[]> = {
  mathematics: [
    "Relations and Functions", "Polynomials", "Exponential & Logarithmic Functions",
    "Trigonometry", "Sequences & Series", "Statistics & Probability",
    "Coordinate Geometry", "Vectors in 2D & 3D",
  ],
  physics: [
    "Mechanics & Motion", "Work, Energy & Power", "Electric Fields",
    "Magnetic Fields & Induction", "Waves & Optics", "Modern Physics", "Thermodynamics",
  ],
  chemistry: [
    "Atomic Structure & Periodicity", "Chemical Bonding", "States of Matter",
    "Stoichiometry", "Chemical Kinetics", "Acids & Bases",
    "Electrochemistry", "Organic Chemistry", "Industrial Chemistry",
  ],
  biology: [
    "Cell Biology & Biochemistry", "Genetics & Heredity", "Evolution & Natural Selection",
    "Ecology & Environment", "Human Physiology", "Plant Biology",
    "Microorganisms & Disease", "Biotechnology",
  ],
  english: [
    "Reading Comprehension", "Grammar & Vocabulary", "Writing Skills",
    "Literature Analysis", "Listening & Speaking", "Exam Techniques",
  ],
  amharic: [
    "ስነ-ፅሁፍ ንባብ", "ሰዋስው ትምህርት", "ጽሁፍ ስራ", "ግጥም ትንተና",
    "ታሪካዊ ፅሁፍ", "ቃለ-መጠይቅ ቴክኒኮች", "ፈተና ዝግጅት",
  ],
  history: [
    "Ancient Civilizations", "Medieval Ethiopia", "The Adwa Victory",
    "Modern Ethiopian History", "African History & Colonialism",
    "World War I & II", "Cold War Era", "Contemporary Ethiopian History",
  ],
  geography: [
    "Physical Geography of Ethiopia", "Human & Economic Geography",
    "Ethiopian River Systems", "African Geography",
    "World Geography", "Environmental Geography & Climate",
  ],
  civics: [
    "Constitutional Rights & Freedoms", "Democratic Institutions",
    "Rule of Law & Justice", "Ethiopian Federal System",
    "Civic Responsibilities & Participation",
  ],
};

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  subjects: string[];
  experience: number;
  rating: number;
  reviews: number;
  students: number;
  available: boolean;
  location: string;
  education: string;
  bio: string;
  email?: string;
  phone?: string;
  age?: number;
  highlights?: string[];
  availabilityDays?: string[];
  sessionMinutes?: number;
}

const DEFAULT_HIGHLIGHTS = [
  "Experienced in Ethiopian MOE curriculum",
  "Fluent in Amharic and English",
  "Proven exam success record",
  "Patient, structured teaching method",
];

export const TUTORS: Tutor[] = [
  {
    id: "1", name: "Dr. Mekdes Alemu",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&auto=format",
    subjects: ["Physics", "Mathematics"], experience: 8, rating: 4.9, reviews: 312,
    students: 1240, available: true, location: "Addis Ababa",
    education: "PhD Physics, Addis Ababa University",
    email: "mekdes.alemu@astegni.et", phone: "+251 911 234 567", age: 34,
    highlights: DEFAULT_HIGHLIGHTS, availabilityDays: ["Mon", "Tue", "Thu", "Fri"], sessionMinutes: 90,
    bio: "Dr. Mekdes Alemu is a passionate educator with over 8 years of teaching experience at both high school and university levels. She specializes in making complex Physics concepts intuitive and accessible to all students.",
  },
  {
    id: "2", name: "Ato Belay Tadesse",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
    subjects: ["Mathematics", "Physics"], experience: 12, rating: 4.8, reviews: 487,
    students: 2100, available: true, location: "Addis Ababa",
    education: "MSc Mathematics, Jimma University",
    email: "belay.tadesse@astegni.et", phone: "+251 911 345 678", age: 41,
    highlights: DEFAULT_HIGHLIGHTS, availabilityDays: ["Mon", "Wed", "Fri", "Sat"], sessionMinutes: 60,
    bio: "With 12 years of classroom experience, Ato Belay has a proven track record of helping students significantly improve their national exam scores in Mathematics.",
  },
  {
    id: "3", name: "W/ro Tigist Haile",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&auto=format",
    subjects: ["Biology", "Chemistry"], experience: 6, rating: 4.7, reviews: 198,
    students: 890, available: false, location: "Bahir Dar",
    education: "BSc Biology, Bahir Dar University",
    email: "tigist.haile@astegni.et", phone: "+251 911 456 789", age: 29,
    highlights: DEFAULT_HIGHLIGHTS, availabilityDays: ["Tue", "Thu"], sessionMinutes: 75,
    bio: "W/ro Tigist brings energy and clarity to natural sciences. Her students consistently praise her ability to connect textbook concepts to real-world Ethiopian examples.",
  },
  {
    id: "4", name: "Ato Solomon Girma",
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=200&h=200&fit=crop&auto=format",
    subjects: ["History", "Geography", "Civics"], experience: 10, rating: 4.9, reviews: 265,
    students: 1560, available: true, location: "Hawassa",
    education: "MA History, Hawassa University",
    email: "solomon.girma@astegni.et", phone: "+251 911 567 890", age: 38,
    highlights: DEFAULT_HIGHLIGHTS, availabilityDays: ["Mon", "Tue", "Wed", "Fri"], sessionMinutes: 60,
    bio: "Ato Solomon is a gifted storyteller who brings Ethiopian and world history to life. His passion for the subject is infectious and his exam pass rates are among the highest nationally.",
  },
  {
    id: "5", name: "Mrs. Sara Tekeste",
    avatar: "https://images.unsplash.com/photo-1520810627419-35e592be37f3?w=200&h=200&fit=crop&auto=format",
    subjects: ["English", "Amharic"], experience: 7, rating: 4.8, reviews: 341,
    students: 1780, available: true, location: "Mekelle",
    education: "MA English Literature, Mekelle University",
    email: "sara.tekeste@astegni.et", phone: "+251 911 678 901", age: 33,
    highlights: DEFAULT_HIGHLIGHTS, availabilityDays: ["Mon", "Thu", "Sat", "Sun"], sessionMinutes: 45,
    bio: "Mrs. Sara specializes in language arts and has helped hundreds of students achieve excellence in both English and Amharic. Her approach focuses on practical communication skills.",
  },
  {
    id: "6", name: "Dr. Hana Bekele",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&auto=format",
    subjects: ["Chemistry", "Biology"], experience: 9, rating: 4.6, reviews: 156,
    students: 720, available: true, location: "Dire Dawa",
    education: "PhD Chemistry, Haramaya University",
    email: "hana.bekele@astegni.et", phone: "+251 911 789 012", age: 36,
    highlights: DEFAULT_HIGHLIGHTS, availabilityDays: ["Tue", "Wed", "Fri", "Sat"], sessionMinutes: 90,
    bio: "Dr. Hana combines rigorous scientific knowledge with patient, student-centered teaching. She is especially skilled at preparing students for the chemistry portions of the National Exam for Grade 12.",
  },
];

/** Merge built-in tutors with tutors registered in this browser. */
export function getAllTutors(): Tutor[] {
  let saved: Tutor[] = [];
  try {
    saved = JSON.parse(localStorage.getItem("astegni_tutors") ?? "[]") as Tutor[];
  } catch {
    saved = [];
  }

  let accounts: { id: string; email?: string }[] = [];
  try {
    accounts = JSON.parse(localStorage.getItem("astegni_accounts") ?? "[]") as { id: string; email?: string }[];
  } catch {
    accounts = [];
  }

  const withContact = saved.map(tutor => {
    if (tutor.email) return tutor;
    const account = accounts.find(item => item.id === tutor.id);
    return account?.email ? { ...tutor, email: account.email } : tutor;
  });

  return [...TUTORS, ...withContact.filter(item => !TUTORS.some(tutor => tutor.id === item.id))];
}

export function getTutorById(id: string | undefined): Tutor | undefined {
  if (!id) return undefined;
  return getAllTutors().find(tutor => tutor.id === id);
}

export const EXAM_SUBJECTS = [
  { name: "Mathematics", chapters: 8, progress: 72, color: "#2563EB" },
  { name: "Physics", chapters: 7, progress: 58, color: "#7C3AED" },
  { name: "Chemistry", chapters: 9, progress: 45, color: "#DB2777" },
  { name: "Biology", chapters: 8, progress: 80, color: "#059669" },
  { name: "English", chapters: 6, progress: 90, color: "#0284C7" },
  { name: "History", chapters: 8, progress: 35, color: "#EA580C" },
];

export const EXAM_TIPS = [
  { title: "Time Management", tip: "Allocate 1.5 minutes per mark. If stuck on a question, move on and return later." },
  { title: "Read Carefully", tip: "Read each question at least twice before answering. Underline key terms." },
  { title: "Show Your Work", tip: "For math and science, always show step-by-step working for partial marks." },
  { title: "Past Papers", tip: "Practice at least 5 years of past EUEE papers under timed conditions." },
  { title: "Sleep & Nutrition", tip: "Get 8 hours of sleep the night before. Eat a proper breakfast on exam day." },
  { title: "Review Weak Areas", tip: "Spend extra time on chapters where you scored below 60% in practice tests." },
];

export const RECENT_LESSONS = [
  { title: "Quadratic Equations & Their Roots", subject: "Mathematics", grade: "12", chapter: 2, progress: 65, image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=220&fit=crop&auto=format" },
  { title: "Newton's Laws of Motion", subject: "Physics", grade: "11", chapter: 1, progress: 40, image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=220&fit=crop&auto=format" },
  { title: "Cell Division: Mitosis & Meiosis", subject: "Biology", grade: "12", chapter: 1, progress: 90, image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=220&fit=crop&auto=format" },
];
