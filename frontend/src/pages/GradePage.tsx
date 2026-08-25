import { Link, Navigate, useParams } from "react-router-dom";
import { BookOpen, ChevronRight, Play } from "lucide-react";
import { getStream, isStreamId } from "../data";
import { Breadcrumb } from "../components/Breadcrumb";

const GRADE_DATA = [
  { grade: "9", title: "Grade 9", subtitle: "Foundation Year", subjects: 6, chapters: 40, progress: 45, color: "from-blue-500 to-blue-700", light: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=480&h=300&fit=crop&auto=format" },
  { grade: "10", title: "Grade 10", subtitle: "Core Development", subjects: 6, chapters: 42, progress: 28, color: "from-violet-500 to-violet-700", light: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=480&h=300&fit=crop&auto=format" },
  { grade: "11", title: "Grade 11", subtitle: "Pre-Exam Preparation", subjects: 6, chapters: 44, progress: 12, color: "from-emerald-500 to-emerald-700", light: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=480&h=300&fit=crop&auto=format" },
  { grade: "12", title: "Grade 12", subtitle: "National Exam Year", subjects: 6, chapters: 46, progress: 72, color: "from-orange-500 to-rose-600", light: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", img: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=480&h=300&fit=crop&auto=format" },
];

export default function GradePage() {
  const { stream } = useParams<{ stream: string }>();

  if (!isStreamId(stream)) {
    return <Navigate to="/learn" replace />;
  }

  const streamDef = getStream(stream)!;

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className={`bg-gradient-to-r ${streamDef.gradient} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumb items={[
            { label: "Home", to: "/" },
            { label: "Learn", to: "/learn" },
            { label: streamDef.name },
          ]} />
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-4xl mt-4 mb-2">Choose Your Grade</h1>
          <p className="text-white/80 text-base max-w-xl">
            You selected {streamDef.name}. Now pick Grade 9–12 to open the matching subjects.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {GRADE_DATA.map(g => (
            <Link
              key={g.grade}
              to={`/learn/${stream}/${g.grade}`}
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative h-36 overflow-hidden">
                <img src={g.img} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute inset-0 bg-gradient-to-t ${g.color} opacity-75`} />
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <span className="self-start px-2.5 py-1 bg-white/20 border border-white/30 text-white text-xs font-bold rounded-lg backdrop-blur-sm">{g.subtitle}</span>
                  <div>
                    <div className="text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans',sans-serif] leading-none">{g.grade}</div>
                    <div className="text-white/80 text-sm font-medium">{g.title}</div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex gap-4 mb-4 text-sm">
                  <div className={`flex items-center gap-1.5 ${g.text}`}><BookOpen className="w-4 h-4" /><span className="font-semibold">{streamDef.subjects.length} subjects</span></div>
                  <div className="flex items-center gap-1.5 text-slate-500"><Play className="w-4 h-4" /><span>{g.chapters} chapters</span></div>
                </div>
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs"><span className="text-slate-500">Progress</span><span className={`font-bold ${g.text}`}>{g.progress}%</span></div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${g.color} rounded-full transition-all`} style={{ width: `${g.progress}%` }} />
                  </div>
                </div>
                <div className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm ${g.light} ${g.text} border ${g.border} group-hover:shadow-md transition-all`}>
                  Open subjects <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
