import { useState } from "react";
import { Mail, MessageCircle, HelpCircle, ChevronDown, ChevronUp, Shield, FileText, Heart, Target, Eye, CheckCircle2, Phone, MapPin } from "lucide-react";
import { Breadcrumb } from "../components/Breadcrumb";

const VALUE_STYLES = {
  red: { bg: "bg-red-50", text: "text-red-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
} as const;

const FAQS = [
  { q: "Is Astegni free to use?", a: "Yes! Astegni offers a free tier with access to most lessons and chapter notes. Premium features like full mock exams and one-on-one tutor sessions are available with a subscription." },
  { q: "Which grades are covered?", a: "Astegni covers Grades 9, 10, 11, and 12 of the Ethiopian secondary education system, fully aligned with the Ministry of Education curriculum." },
  { q: "Is the content in Amharic?", a: "Yes. All lessons, notes, and interface elements are available in both Amharic and English. You can switch languages at any time in your profile settings." },
  { q: "How are the tutors verified?", a: "Every tutor on Astegni goes through a rigorous vetting process including credential verification, subject knowledge testing, and a background check before they can teach on the platform." },
  { q: "Can I download lessons for offline use?", a: "PDF notes and textbook excerpts can be downloaded for offline use. Video lessons require an active internet connection but are optimized for low-bandwidth connections." },
  { q: "How do I prepare for the National Exam for Grade 12?", a: "Use our dedicated National Exam section which includes a structured roadmap, past papers and mock exams for every subject, and subject-by-subject revision materials." },
];

export default function About() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0A1F5C] via-[#1344C8] to-[#2563EB] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "About" }]} />
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-4xl mt-4 mb-3">About Astegni</h1>
          <p className="text-blue-100/80 text-lg max-w-xl">Our mission is to make quality education accessible to every Ethiopian high school student, regardless of location or background.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-7 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-5"><Target className="w-6 h-6 text-blue-600" /></div>
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-xl text-slate-900 mb-3">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">To empower every Ethiopian high school student with access to world-class learning resources aligned to the national curriculum — making quality education available to all, regardless of geography or income.</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-7 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center mb-5"><Eye className="w-6 h-6 text-indigo-600" /></div>
            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-xl text-slate-900 mb-3">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed">A future where every Ethiopian student has the knowledge, skills, and confidence to pass the National Exam for Grade 12, access higher education, and contribute to their country's development.</p>
          </div>
        </div>

        {/* Core values */}
        <div>
          <div className="flex items-center gap-2 mb-6"><div className="w-1 h-5 rounded-full bg-[#2563EB]" /><h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-2xl text-slate-900">Our Values</h2></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {([
              { icon: Heart, title: "Accessibility", desc: "Free and affordable learning for every student in Ethiopia.", c: "red" },
              { icon: CheckCircle2, title: "Quality", desc: "Expert-led lessons rigorously aligned to MOE standards.", c: "emerald" },
              { icon: Shield, title: "Trust", desc: "A safe, verified platform students and parents can rely on.", c: "blue" },
              { icon: Target, title: "Impact", desc: "Measurable score improvements and university entry rates.", c: "amber" },
            ] as const).map(({ icon: I, title, desc, c }) => (
              <div key={title} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-center hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 rounded-2xl ${VALUE_STYLES[c].bg} flex items-center justify-center mx-auto mb-3`}><I className={`w-5 h-5 ${VALUE_STYLES[c].text}`} /></div>
                <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <div className="flex items-center gap-2 mb-6"><div className="w-1 h-5 rounded-full bg-[#2563EB]" /><h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-2xl text-slate-900">Frequently Asked Questions</h2></div>
          <div className="space-y-3 max-w-3xl">
            {FAQS.map((faq, i) => (
              <div key={i} className={`bg-white rounded-2xl border transition-all ${openFaq === i ? "border-blue-200 shadow-md shadow-blue-50" : "border-slate-100 hover:border-slate-200"}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left">
                  <span className="font-semibold text-slate-800 text-sm">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-[#2563EB] shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-slate-600 leading-relaxed border-t border-blue-50 pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact + Legal */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact form */}
          <div>
            <div className="flex items-center gap-2 mb-6"><div className="w-1 h-5 rounded-full bg-[#2563EB]" /><h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-2xl text-slate-900">Contact Us</h2></div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              {sent ? (
                <div className="text-center py-10">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-800 mb-1">Message sent!</h3>
                  <p className="text-sm text-slate-500">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {([{ label: "Your Name", key: "name", type: "text", placeholder: "Selamawit Tesfaye" }, { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" }] as const).map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">{label}</label>
                      <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Message</label>
                    <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="How can we help you?"
                      rows={4}
                      className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
                  </div>
                  <button onClick={() => setSent(true)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                    <MessageCircle className="w-4 h-4" /> Send Message
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-6"><div className="w-1 h-5 rounded-full bg-[#2563EB]" /><h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-2xl text-slate-900">Support</h2></div>
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              {[{ icon: Mail, label: "Email Support", val: "support@astegni.et" }, { icon: Phone, label: "Phone", val: "+251 11 234 5678" }, { icon: MapPin, label: "Location", val: "Bole, Addis Ababa, Ethiopia" }].map(({ icon: I, label, val }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0"><I className="w-4 h-4 text-blue-600" /></div>
                  <div><div className="text-xs text-slate-500">{label}</div><div className="text-sm font-semibold text-slate-800">{val}</div></div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Legal</h3>
              <div className="space-y-2">
                {[{ icon: Shield, label: "Privacy Policy" }, { icon: FileText, label: "Terms & Conditions" }, { icon: HelpCircle, label: "Cookie Policy" }].map(({ icon: I, label }) => (
                  <button key={label} className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                    <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700 group-hover:text-[#2563EB]">
                      <I className="w-4 h-4" />{label}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 -rotate-90" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
