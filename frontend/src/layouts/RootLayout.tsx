import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";
import logoSrc from "../assets/images/logo.png";
import {
  Home, BookOpen, Trophy, Users, User, Info,
  Menu, X, Bell, GraduationCap, LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const SOCIALS = [
  { label: "Facebook", path: "M13.5 8H16V4.5h-2.5C10.5 4.5 9 6.3 9 9v2H6v3.5h3V22h3.8v-7.5h3l.5-3.5h-3.5V9.3c0-.9.3-1.3.7-1.3Z" },
  { label: "X", path: "M5 4l11.5 16M19 4 5 20" },
  { label: "YouTube", path: "M21 12s0-3.5-.4-5c-.2-.8-.8-1.4-1.6-1.6C17.5 5 12 5 12 5s-5.5 0-7 .4c-.8.2-1.4.8-1.6 1.6C3 8.5 3 12 3 12s0 3.5.4 5c.2.8.8 1.4 1.6 1.6 1.5.4 7 .4 7 .4s5.5 0 7-.4c.8-.2 1.4-.8 1.6-1.6.4-1.5.4-5 .4-5Zm-11 3V9l5 3-5 3Z" },
  { label: "Instagram", path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6-1.5h.01" },
];

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/exam", label: "National Exam", icon: Trophy },
  { to: "/tutors", label: "Tutors", icon: Users },
  { to: "/about", label: "About", icon: Info },
];

export default function RootLayout() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const active = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-[Inter,sans-serif] flex flex-col">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <ImageWithFallback src={logoSrc} alt="Astegni" className="w-8 h-8 rounded-xl object-cover" />
            <span className="text-lg font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-slate-900 tracking-tight">
              <span className="text-[#2563EB]">Ast</span>egni
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {(user ? NAV : NAV.slice(0, 1)).map(({ to, label }) => (
              <Link key={to} to={to}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  active(to)
                    ? "bg-[#EFF6FF] text-[#2563EB]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F59E0B] rounded-full ring-2 ring-white" />
                </button>
                <Link to="/profile" className="flex items-center gap-2 pl-3 pr-4 py-2 rounded-xl bg-[#EFF6FF] text-[#2563EB] text-sm font-semibold hover:bg-blue-100 transition-colors">
                  <User className="w-4 h-4" />{user.name.split(" ")[0]}
                </Link>
                <button onClick={logout} title="Log out" className="p-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"><LogOut className="w-4 h-4" /></button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-bold text-[#2563EB]">Log in</Link>
                <Link to="/register" className="px-4 py-2.5 rounded-xl bg-[#2563EB] text-sm font-bold text-white hover:bg-blue-700 transition-colors">Register</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            {(user ? NAV : NAV.slice(0, 1)).map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active(to) ? "bg-[#EFF6FF] text-[#2563EB]" : "text-slate-600 hover:bg-slate-50"
                }`}>
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"><User className="w-4 h-4" /> Profile</Link>
                <button onClick={() => { logout(); setOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50"><LogOut className="w-4 h-4" /> Log out</button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/login" onClick={() => setOpen(false)} className="rounded-xl border border-blue-200 py-2.5 text-center text-sm font-bold text-[#2563EB]">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="rounded-xl bg-[#2563EB] py-2.5 text-center text-sm font-bold text-white">Register</Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── Page content ── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-white pt-14 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 pb-10 border-b border-white/10">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <ImageWithFallback src={logoSrc} alt="Astegni" className="w-8 h-8 rounded-xl object-cover" />
                <span className="text-lg font-['Plus_Jakarta_Sans',sans-serif] font-extrabold">
                  <span className="text-blue-400">Ast</span>egni
                </span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed mb-5 max-w-xs">
                Ethiopia's premier online learning platform for high school students. Learn, practice, and succeed.
              </p>
              <div className="flex gap-2">
                {SOCIALS.map(({ label, path }) => (
                  <a key={label} href="#" aria-label={label}
                    className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            {[
              { heading: "Learn", links: [["Natural Science", "/learn/natural"], ["Social Science", "/learn/social"], ["Grade 12 Natural", "/learn/natural/12"], ["Grade 12 Social", "/learn/social/12"]] },
              { heading: "Platform", links: [["National Exam", "/exam"], ["Tutors", "/tutors"], ["Become a Tutor", "/become-tutor"], ["Profile", "/profile"], ["About", "/about"]] },
              { heading: "Subjects", links: [["Mathematics", "/learn/natural/12/mathematics"], ["Physics", "/learn/natural/12/physics"], ["Chemistry", "/learn/natural/12/chemistry"], ["Biology", "/learn/natural/12/biology"]] },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <h4 className="text-sm font-bold text-white mb-4">{heading}</h4>
                <ul className="space-y-2.5">
                  {links.map(([label, to]) => (
                    <li key={label}>
                      <Link to={user ? to : "/login"} className="text-sm text-white/40 hover:text-white transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/25">© 2026 Astegni Education PLC · Addis Ababa, Ethiopia</p>
            <div className="flex items-center gap-1 text-xs text-white/25">
              <GraduationCap className="w-3.5 h-3.5" />
              Aligned with Ethiopian MOE Curriculum · Grades 9–12
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
