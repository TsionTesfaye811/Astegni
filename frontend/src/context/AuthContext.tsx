/* oxlint-disable react/only-export-components -- provider and hook are intentionally colocated */
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type UserRole = "student" | "tutor";

export interface StudentProfile {
  grade: string;
  school: string;
  phone?: string;
  city?: string;
  region?: string;
  gender?: string;
  dateOfBirth?: string;
  age?: number;
  stream?: string;
  preferredSubjects?: string[];
  studyGoal?: string;
  learningStyle?: string;
  parentContact?: string;
  bio?: string;
  profileComplete: boolean;
}

export interface TutorAvailability {
  days: string[];
  sessionMinutes: number;
}

export interface TutorApplication {
  subjects: string[];
  phone: string;
  age: number;
  bio: string;
  education: string;
  highlights: string[];
  location: string;
  experience: number;
  availability: TutorAvailability;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profile: StudentProfile;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => { ok: true; user: AuthUser } | { ok: false; error: string };
  register: (details: { name: string; email: string; password: string; grade: string; school: string }) => { ok: true; user: AuthUser } | { ok: false; error: string };
  resetPassword: (email: string, newPassword: string) => { ok: true } | { ok: false; error: string };
  updateProfile: (profile: Partial<StudentProfile> & { name?: string }) => void;
  completeProfile: (profile: Partial<StudentProfile>) => void;
  becomeTutor: (application: TutorApplication) => void;
  updateTutorProfile: (application: TutorApplication) => void;
  logout: () => void;
}

const AUTH_KEY = "astegni_auth";
const ACCOUNTS_KEY = "astegni_accounts";
const CREDENTIALS_KEY = "astegni_credentials";
const TUTORS_KEY = "astegni_tutors";

const AuthContext = createContext<AuthContextValue | null>(null);

function defaultProfile(partial?: Partial<StudentProfile>): StudentProfile {
  return {
    grade: partial?.grade ?? "",
    school: partial?.school ?? "",
    phone: partial?.phone,
    city: partial?.city,
    region: partial?.region,
    gender: partial?.gender,
    dateOfBirth: partial?.dateOfBirth,
    age: partial?.age,
    stream: partial?.stream,
    preferredSubjects: partial?.preferredSubjects ?? [],
    studyGoal: partial?.studyGoal,
    learningStyle: partial?.learningStyle,
    parentContact: partial?.parentContact,
    bio: partial?.bio,
    profileComplete: partial?.profileComplete ?? false,
  };
}

function normalizeUser(raw: Partial<AuthUser> & { id: string; name: string; email: string }): AuthUser {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    role: raw.role === "tutor" ? "tutor" : "student",
    profile: defaultProfile(raw.profile),
  };
}

function readUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? normalizeUser(JSON.parse(stored) as AuthUser) : null;
  } catch {
    return null;
  }
}

function readAccounts(): AuthUser[] {
  try {
    const raw = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? "[]") as AuthUser[];
    return raw.map(account => normalizeUser(account));
  } catch {
    return [];
  }
}

function writeAccounts(accounts: AuthUser[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function upsertAccount(user: AuthUser) {
  const accounts = readAccounts().filter(account => account.email !== user.email && account.id !== user.id);
  writeAccounts([...accounts, user]);
}

function readCredentials(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(CREDENTIALS_KEY) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

function setCredential(email: string, password: string) {
  const credentials = readCredentials();
  credentials[email.trim().toLowerCase()] = password;
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
}

function readSavedTutors() {
  try {
    return JSON.parse(localStorage.getItem(TUTORS_KEY) ?? "[]") as Array<Record<string, unknown> & { id: string }>;
  } catch {
    return [];
  }
}

function saveTutorProfile(nextUser: AuthUser, application: TutorApplication, existing?: Record<string, unknown>) {
  const savedTutors = readSavedTutors();
  const tutorProfile = {
    id: nextUser.id,
    name: nextUser.name,
    avatar: (existing?.avatar as string) || `https://ui-avatars.com/api/?name=${encodeURIComponent(nextUser.name)}&background=DBEAFE&color=2563EB`,
    subjects: application.subjects,
    experience: application.experience,
    rating: typeof existing?.rating === "number" ? existing.rating : 5,
    reviews: typeof existing?.reviews === "number" ? existing.reviews : 0,
    students: typeof existing?.students === "number" ? existing.students : 0,
    available: application.availability.days.length > 0,
    location: application.location,
    education: application.education,
    bio: application.bio,
    email: nextUser.email,
    phone: application.phone,
    age: application.age,
    highlights: application.highlights,
    availabilityDays: application.availability.days,
    sessionMinutes: application.availability.sessionMinutes,
  };
  localStorage.setItem(
    TUTORS_KEY,
    JSON.stringify([...savedTutors.filter(item => item.id !== nextUser.id), tutorProfile]),
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readUser);

  const saveUser = (nextUser: AuthUser | null) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser));
      upsertAccount(nextUser);
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  };

  const login: AuthContextValue["login"] = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) return { ok: false, error: "Email and password are required." };

    const existing = readAccounts().find(profile => profile.email.toLowerCase() === normalizedEmail);
    const credentials = readCredentials();
    const storedPassword = credentials[normalizedEmail];

    if (!existing || !storedPassword) {
      return { ok: false, error: "No account found with this email. Please register first." };
    }
    if (storedPassword !== password) {
      return { ok: false, error: "Incorrect password. Try again or reset it." };
    }

    saveUser(existing);
    return { ok: true, user: existing };
  };

  const register: AuthContextValue["register"] = ({ name, email, password, grade, school }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const trimmedSchool = school.trim();

    if (trimmedName.length < 2) return { ok: false, error: "Please enter your full name." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return { ok: false, error: "Please enter a valid email address." };
    if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    if (!trimmedSchool) return { ok: false, error: "Please enter your school name." };
    if (readAccounts().some(account => account.email === normalizedEmail)) {
      return { ok: false, error: "An account with this email already exists. Please log in." };
    }

    const nextUser = normalizeUser({
      id: crypto.randomUUID(),
      name: trimmedName,
      email: normalizedEmail,
      role: "student",
      profile: defaultProfile({ grade, school: trimmedSchool, profileComplete: false }),
    });
    setCredential(normalizedEmail, password);
    saveUser(nextUser);
    return { ok: true, user: nextUser };
  };

  const resetPassword: AuthContextValue["resetPassword"] = (email, newPassword) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { ok: false, error: "Please enter a valid email address." };
    }
    if (newPassword.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

    const existing = readAccounts().find(account => account.email === normalizedEmail);
    if (!existing) return { ok: false, error: "No account found with this email." };

    setCredential(normalizedEmail, newPassword);
    return { ok: true };
  };

  const updateProfile: AuthContextValue["updateProfile"] = (updates) => {
    if (!user) return;
    const nextUser: AuthUser = {
      ...user,
      name: updates.name?.trim() || user.name,
      profile: { ...user.profile, ...updates, preferredSubjects: updates.preferredSubjects ?? user.profile.preferredSubjects },
    };
    saveUser(nextUser);
  };

  const completeProfile: AuthContextValue["completeProfile"] = (updates) => {
    if (!user) return;
    const nextUser: AuthUser = {
      ...user,
      profile: {
        ...user.profile,
        ...updates,
        preferredSubjects: updates.preferredSubjects ?? user.profile.preferredSubjects,
        profileComplete: true,
      },
    };
    saveUser(nextUser);
  };

  const becomeTutor: AuthContextValue["becomeTutor"] = (application) => {
    if (!user) return;
    const nextUser: AuthUser = { ...user, role: "tutor" };
    saveTutorProfile(nextUser, application);
    saveUser(nextUser);
  };

  const updateTutorProfile: AuthContextValue["updateTutorProfile"] = (application) => {
    if (!user || user.role !== "tutor") return;
    const existing = readSavedTutors().find(item => item.id === user.id);
    saveTutorProfile(user, application, existing);
    // Keep role/user; refresh name on tutor card via profile save path
    saveUser({ ...user });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      resetPassword,
      updateProfile,
      completeProfile,
      becomeTutor,
      updateTutorProfile,
      logout: () => saveUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
