/* oxlint-disable react/only-export-components -- provider and hook are intentionally colocated */
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type UserRole = "student" | "tutor";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface TutorRegistration {
  subjects: string[];
  experience: number;
  location: string;
  phone?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => void;
  register: (details: { name: string; email: string; password: string; role: UserRole; tutor?: TutorRegistration }) => void;
  logout: () => void;
}

const AUTH_KEY = "astegni_auth";
const TUTORS_KEY = "astegni_tutors";

const AuthContext = createContext<AuthContextValue | null>(null);

function readUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) as AuthUser : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readUser);

  const saveUser = (nextUser: AuthUser | null) => {
    setUser(nextUser);
    if (nextUser) localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(AUTH_KEY);
  };

  const login = (email: string, _password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const profiles = JSON.parse(localStorage.getItem("astegni_accounts") ?? "[]") as AuthUser[];
    const existing = profiles.find(profile => profile.email.toLowerCase() === normalizedEmail);
    saveUser(existing ?? {
      id: crypto.randomUUID(),
      name: normalizedEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, letter => letter.toUpperCase()),
      email: normalizedEmail,
      role: "student",
    });
  };

  const register: AuthContextValue["register"] = ({ name, email, role, tutor }) => {
    const nextUser: AuthUser = { id: crypto.randomUUID(), name: name.trim(), email: email.trim().toLowerCase(), role };
    const accounts = JSON.parse(localStorage.getItem("astegni_accounts") ?? "[]") as AuthUser[];
    localStorage.setItem("astegni_accounts", JSON.stringify([...accounts.filter(account => account.email !== nextUser.email), nextUser]));

    if (role === "tutor" && tutor) {
      const savedTutors = JSON.parse(localStorage.getItem(TUTORS_KEY) ?? "[]") as { id: string }[];
      const tutorProfile = {
        id: nextUser.id,
        name: nextUser.name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(nextUser.name)}&background=DBEAFE&color=2563EB`,
        subjects: tutor.subjects,
        experience: tutor.experience,
        rating: 5,
        reviews: 0,
        students: 0,
        available: true,
        location: tutor.location,
        education: `${tutor.subjects[0] ?? "Subject"} Tutor`,
        bio: `${nextUser.name} is a registered Astegni tutor with ${tutor.experience} years of teaching experience in ${tutor.subjects.join(", ")}.`,
        email: nextUser.email,
        phone: tutor.phone?.trim() || undefined,
      };
      localStorage.setItem(
        TUTORS_KEY,
        JSON.stringify([...savedTutors.filter(item => item.id !== nextUser.id), tutorProfile]),
      );
    }
    saveUser(nextUser);
  };

  const value = useMemo(() => ({ user, login, register, logout: () => saveUser(null) }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
