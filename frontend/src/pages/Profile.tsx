import { useState } from "react";
import { User, TrendingUp, Bookmark, Settings, LogOut, Star, Award, BookOpen, Bell, Moon, Sun, Globe, ChevronRight, CheckCircle2, Camera } from "lucide-react";
import { SUBJECT_DEFS } from "../data";
import { Link } from "react-router-dom";

const STAT_STYLES = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
} as const;

const PROGRESS_DATA = SUBJECT_DEFS.slice(0, 6).map((s, i) => ({ ...s, progress: [72, 45, 30, 88, 95, 55][i] }));

const BOOKMARKS = [
  { title: "Quadratic Equations & Their Roots", subject: "Mathematics", grade: "12", to: "/learn/12/mathematics/1" },
  { title: "Newton's Laws of Motion", subject: "Physics", grade: "11", to: "/learn/11/physics/1" },
  { title: "Cell Division: Mitosis & Meiosis", subject: "Biology", grade: "12", to: "/learn/12/biology/1" },
  { title: "The Adwa Victory", subject: "History", grade: "9", to: "/learn/9/history/3" },
];

const ACHIEVEMENTS = [
  { title: "First Lesson", desc: "Completed your first lesson", icon: "🎯", earned: true },
  { title: "Week Streak", desc: "Studied 7 days in a row", icon: "🔥", earned: true },
  { title: "Quiz Master", desc: "Scored 100% on a quiz", icon: "⭐", earned: true },
  { title: "Half Way", desc: "50% progress in one subject", icon: "🏅", earned: true },
  { title: "Top Performer", desc: "Scored 90%+ on a mock exam", icon: "🏆", earned: false },
  { title: "All Subjects", desc: "Started all 8 subjects", icon: "📚", earned: false },
];

const SIDEBAR = [
  { id: "profile", label: "Personal Info", icon: User },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Profile() {
  const [active, setActive] = useState("profile");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState("English");
  const [notifications, setNotifications] = useState({ email: true, push: false, weekly: true });
  const [saved, setSaved] = useState(false);

  const overall = Math.round(PROGRESS_DATA.reduce((a, s) => a + s.progress, 0) / PROGRESS_DATA.length);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg">S</div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:border-blue-300 transition-colors">
                <Camera className="w-3 h-3 text-slate-500" />
              </button>
            </div>
            <div>
              <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-xl text-slate-900">Selamawit Tesfaye</h1>
              <p className="text-slate-500 text-sm">Grade 12 · Addis Ababa</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4 achievements
                </div>
                <div className="text-xs text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  {overall}% Overall Progress
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[220px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-1">
            {SIDEBAR.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActive(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active === id ? "bg-[#EFF6FF] text-[#2563EB]" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
            <div className="pt-3 mt-3 border-t border-slate-200">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>

          {/* Main */}
          <div>
            {/* Personal Info */}
            {active === "profile" && (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-slate-900 mb-5">Personal Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[{ label: "Full Name", val: "Selamawit Tesfaye" }, { label: "Email", val: "selamawit@gmail.com" }, { label: "Grade", val: "Grade 12" }, { label: "School", val: "Addis Ketema Secondary" }, { label: "City", val: "Addis Ababa" }, { label: "Member Since", val: "January 2026" }].map(({ label, val }) => (
                      <div key={label}>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">{label}</label>
                        <input defaultValue={val} className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all" />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
                    className="mt-5 px-6 py-2.5 bg-[#2563EB] text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors">
                    {saved ? "✓ Saved!" : "Save Changes"}
                  </button>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-slate-900 mb-5">Achievements</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {ACHIEVEMENTS.map(a => (
                      <div key={a.title} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border text-center transition-all ${a.earned ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-100 opacity-50"}`}>
                        <span className="text-2xl">{a.icon}</span>
                        <span className="text-[10px] font-bold text-slate-700 leading-tight">{a.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Progress */}
            {active === "progress" && (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-slate-900 mb-2">Learning Progress</h2>
                  <p className="text-sm text-slate-500 mb-6">Grade 12 — Overall: <span className="font-bold text-[#2563EB]">{overall}%</span></p>
                  <div className="space-y-4">
                    {PROGRESS_DATA.map(s => {
                      const Icon = s.icon;
                      return (
                        <div key={s.id} className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg }}>
                            <Icon className="w-4 h-4" style={{ color: s.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm font-semibold text-slate-800">{s.name}</span>
                              <span className="text-xs font-bold" style={{ color: s.color }}>{s.progress}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.progress}%`, background: s.color }} />
                            </div>
                          </div>
                          <Link to={`/learn/12/${s.id}`}
                            className="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors shrink-0">Resume →</Link>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {([{ icon: BookOpen, v: "42", l: "Lessons Completed", c: "blue" }, { icon: CheckCircle2, v: "187", l: "Quiz Questions", c: "emerald" }, { icon: Award, v: "4", l: "Achievements", c: "amber" }] as const).map(({ icon: I, v, l, c }) => (
                    <div key={l} className="bg-white rounded-2xl border border-slate-100 p-5 text-center shadow-sm">
                      <div className={`w-10 h-10 rounded-xl ${STAT_STYLES[c].bg} flex items-center justify-center mx-auto mb-2`}><I className={`w-5 h-5 ${STAT_STYLES[c].text}`} /></div>
                      <div className={`text-2xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] ${STAT_STYLES[c].text}`}>{v}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bookmarks */}
            {active === "bookmarks" && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-slate-900 mb-5">Bookmarks</h2>
                {BOOKMARKS.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No bookmarks yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {BOOKMARKS.map(b => (
                      <Link key={b.title} to={b.to}
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800 group-hover:text-[#2563EB] transition-colors">{b.title}</div>
                            <div className="text-xs text-slate-500">{b.subject} · Grade {b.grade}</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#2563EB] transition-colors" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings */}
            {active === "settings" && (
              <div className="space-y-5">
                {/* Language */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-slate-900">Language</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["English", "Amharic"].map(l => (
                      <button key={l} onClick={() => setLang(l)}
                        className={`flex items-center gap-2.5 p-4 rounded-xl border transition-all ${lang === l ? "border-[#2563EB] bg-blue-50 text-[#2563EB]" : "border-slate-200 text-slate-700 hover:border-slate-300"}`}>
                        <span className="text-lg">{l === "English" ? "🇬🇧" : "🇪🇹"}</span>
                        <span className="font-semibold text-sm">{l}</span>
                        {lang === l && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <Sun className="w-5 h-5 text-amber-500" />
                    <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-slate-900">Theme</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {(["light", "dark"] as const).map(t => (
                      <button key={t} onClick={() => setTheme(t)}
                        className={`flex items-center gap-2.5 p-4 rounded-xl border capitalize transition-all ${theme === t ? "border-[#2563EB] bg-blue-50 text-[#2563EB]" : "border-slate-200 text-slate-700 hover:border-slate-300"}`}>
                        {t === "light" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        <span className="font-semibold text-sm">{t === "light" ? "Light Mode" : "Dark Mode"}</span>
                        {theme === t && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-5"><Bell className="w-5 h-5 text-blue-600" /><h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-lg text-slate-900">Notifications</h2></div>
                  <div className="space-y-4">
                    {[{ key: "email" as const, label: "Email Notifications", desc: "Receive updates via email" }, { key: "push" as const, label: "Push Notifications", desc: "Browser and mobile alerts" }, { key: "weekly" as const, label: "Weekly Summary", desc: "Weekly progress report" }].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                        <div><div className="text-sm font-semibold text-slate-800">{label}</div><div className="text-xs text-slate-500">{desc}</div></div>
                        <button onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                          className={`w-11 h-6 rounded-full transition-colors relative ${notifications[key] ? "bg-[#2563EB]" : "bg-slate-200"}`}>
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${notifications[key] ? "left-5.5 left-[22px]" : "left-0.5"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
