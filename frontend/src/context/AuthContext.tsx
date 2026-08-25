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
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }>;
  register: (details: { name: string; email: string; password: string; confirmPassword: string; grade: string; school: string }) => Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }>;
  requestPasswordReset: (email: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  resetPassword: (details: { token: string; email: string; password: string; passwordConfirmation: string }) => Promise<{ ok: true } | { ok: false; error: string }>;
  updateProfile: (profile: Partial<StudentProfile> & { name?: string; email?: string }) => Promise<{ ok: true; user: AuthUser } | { ok: false; error: string }>;
  completeProfile: (profile: Partial<StudentProfile>) => void;
  becomeTutor: (application: TutorApplication) => void;
  updateTutorProfile: (application: TutorApplication) => void;
  logout: () => void;
}

const AUTH_KEY = "astegni_auth";
const ACCOUNTS_KEY = "astegni_accounts";
const TUTORS_KEY = "astegni_tutors";
const TOKEN_KEY = "astegni_token";
const REMEMBER_EMAIL_KEY = "astegni_remember_email";
const API_BASE_URL = "https://apiv2.asteghi.com/api";

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
    id: String(raw.id),
    name: raw.name,
    email: raw.email,
    role: raw.role === "tutor" ? "tutor" : "student",
    profile: defaultProfile(raw.profile),
  };
}

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;

  const message = "message" in payload && typeof payload.message === "string" ? payload.message : "";
  const errors = "errors" in payload && payload.errors && typeof payload.errors === "object"
    ? Object.values(payload.errors as Record<string, unknown>)
    : [];

  for (const value of errors) {
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    if (typeof value === "string") return value;
  }

  return message || fallback;
}

function authStorage(rememberMe = true) {
  return rememberMe ? localStorage : sessionStorage;
}

function clearAuthStorage() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

function readUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(AUTH_KEY) ?? sessionStorage.getItem(AUTH_KEY);
    return stored ? normalizeUser(JSON.parse(stored) as AuthUser) : null;
  } catch {
    return null;
  }
}

function readToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function getRememberedEmail(): string {
  return localStorage.getItem(REMEMBER_EMAIL_KEY) ?? "";
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

function leaksAccountExistence(message: string) {
  return /not found|doesn'?t exist|does not exist|no account|no user|cannot find/i.test(message);
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

  const saveUser = (nextUser: AuthUser | null, rememberMe?: boolean) => {
    setUser(nextUser);
    if (!nextUser) {
      clearAuthStorage();
      return;
    }

    const preferRemember = rememberMe ?? Boolean(localStorage.getItem(AUTH_KEY) || localStorage.getItem(TOKEN_KEY));
    const storage = authStorage(preferRemember);
    const token = readToken();
    clearAuthStorage();
    storage.setItem(AUTH_KEY, JSON.stringify(nextUser));
    if (token) storage.setItem(TOKEN_KEY, token);
    upsertAccount(nextUser);
  };

  const login: AuthContextValue["login"] = async (email, password, rememberMe = true) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) return { ok: false, error: "Email and password are required." };

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        return { ok: false, error: extractErrorMessage(payload, "Login failed. Please try again.") };
      }

      const data = payload && typeof payload === "object" && "data" in payload ? payload.data as Record<string, unknown> : null;
      const rawUser = data?.user as Record<string, unknown> | undefined;
      const token = typeof data?.token === "string" ? data.token : null;

      if (!rawUser || !token || typeof rawUser.name !== "string" || typeof rawUser.email !== "string" || rawUser.id == null) {
        return { ok: false, error: "The server returned an unexpected login response." };
      }

      const existing = readAccounts().find(profile => profile.email.toLowerCase() === normalizedEmail);
      const nextUser = normalizeUser({
        id: String(rawUser.id),
        name: rawUser.name,
        email: rawUser.email,
        role: existing?.role ?? "student",
        profile: defaultProfile({
          ...existing?.profile,
          grade: rawUser.grade != null ? String(rawUser.grade) : (existing?.profile.grade ?? ""),
        }),
      });

      clearAuthStorage();
      authStorage(rememberMe).setItem(TOKEN_KEY, token);
      if (rememberMe) localStorage.setItem(REMEMBER_EMAIL_KEY, normalizedEmail);
      else localStorage.removeItem(REMEMBER_EMAIL_KEY);
      saveUser(nextUser, rememberMe);
      return { ok: true, user: nextUser };
    } catch {
      return { ok: false, error: "Unable to reach the server. Check your internet connection and try again." };
    }
  };

  const register: AuthContextValue["register"] = async ({ name, email, password, confirmPassword, grade, school }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();
    const trimmedSchool = school.trim();

    if (trimmedName.length < 2) return { ok: false, error: "Please enter your full name." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return { ok: false, error: "Please enter a valid email address." };
    if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    if (password !== confirmPassword) return { ok: false, error: "Passwords do not match." };
    if (!trimmedSchool) return { ok: false, error: "Please enter your school name." };

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: normalizedEmail,
          password,
          password_confirmation: confirmPassword,
          grade: Number(grade),
          school: trimmedSchool,
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        return { ok: false, error: extractErrorMessage(payload, "Registration failed. Please try again.") };
      }

      const data = payload && typeof payload === "object" && "data" in payload ? payload.data as Record<string, unknown> : null;
      const rawUser = data?.user as Record<string, unknown> | undefined;
      const token = typeof data?.token === "string" ? data.token : null;

      if (!rawUser || !token || typeof rawUser.name !== "string" || typeof rawUser.email !== "string" || rawUser.id == null) {
        return { ok: false, error: "The server returned an unexpected registration response." };
      }

      const nextUser = normalizeUser({
        id: String(rawUser.id),
        name: rawUser.name,
        email: rawUser.email,
        role: "student",
        profile: defaultProfile({
          grade: rawUser.grade != null ? String(rawUser.grade) : grade,
          school: trimmedSchool,
          profileComplete: false,
        }),
      });

      localStorage.setItem(TOKEN_KEY, token);
      saveUser(nextUser);
      return { ok: true, user: nextUser };
    } catch {
      return { ok: false, error: "Unable to reach the server. Check your internet connection and try again." };
    }
  };

  const requestPasswordReset: AuthContextValue["requestPasswordReset"] = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { ok: false, error: "Please enter a valid email address." };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const error = extractErrorMessage(payload, "Unable to send a reset link. Please try again.");
        if (leaksAccountExistence(error)) return { ok: true };
        return { ok: false, error };
      }

      return { ok: true };
    } catch {
      return { ok: false, error: "Unable to reach the server. Check your internet connection and try again." };
    }
  };

  const resetPassword: AuthContextValue["resetPassword"] = async ({ token, email, password, passwordConfirmation }) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!token) return { ok: false, error: "This reset link is missing a token. Please request a new one." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { ok: false, error: "This reset link is missing a valid email. Please request a new one." };
    }
    if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
    if (password !== passwordConfirmation) return { ok: false, error: "Passwords do not match." };

    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email: normalizedEmail,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        return { ok: false, error: extractErrorMessage(payload, "Unable to reset your password. Please try again.") };
      }

      return { ok: true };
    } catch {
      return { ok: false, error: "Unable to reach the server. Check your internet connection and try again." };
    }
  };

  const updateProfile: AuthContextValue["updateProfile"] = async (updates) => {
    if (!user) return { ok: false, error: "Please log in to update your profile." };

    const token = readToken();
    if (!token) return { ok: false, error: "Your session expired. Please log in again." };

    const nextName = updates.name?.trim() || user.name;
    const nextEmail = updates.email?.trim().toLowerCase() || user.email;
    const nextGrade = updates.grade != null && String(updates.grade).trim() !== ""
      ? String(updates.grade)
      : user.profile.grade;

    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: nextName,
          email: nextEmail,
          grade: Number(nextGrade) || nextGrade,
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        return { ok: false, error: extractErrorMessage(payload, "Unable to update your profile. Please try again.") };
      }

      const data = payload && typeof payload === "object" && "data" in payload ? payload.data as Record<string, unknown> : null;
      const rawUser = data?.user as Record<string, unknown> | undefined;

      const nextUser: AuthUser = {
        ...user,
        id: rawUser?.id != null ? String(rawUser.id) : user.id,
        name: typeof rawUser?.name === "string" ? rawUser.name : nextName,
        email: typeof rawUser?.email === "string" ? rawUser.email : nextEmail,
        profile: {
          ...user.profile,
          ...updates,
          grade: rawUser?.grade != null ? String(rawUser.grade) : nextGrade,
          preferredSubjects: updates.preferredSubjects ?? user.profile.preferredSubjects,
          profileComplete: updates.profileComplete ?? user.profile.profileComplete,
        },
      };

      saveUser(nextUser);
      return { ok: true, user: nextUser };
    } catch {
      return { ok: false, error: "Unable to reach the server. Check your internet connection and try again." };
    }
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
      requestPasswordReset,
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
