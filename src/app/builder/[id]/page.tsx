"use client";

import { useState, useEffect, useRef, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Sparkles, Download, Eye, ChevronLeft,
  Plus, Trash2, GripVertical, Wand2, LayoutTemplate,
  Globe, Settings, ChevronDown, ChevronRight,
  Briefcase, GraduationCap, Code, Award, User, EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useCredits } from "@/context/CreditsContext";
import { useResumes } from "@/context/ResumesContext";
import { calcAtsScore } from "@/lib/ats";

type Section = "personal" | "summary" | "experience" | "education" | "skills" | "certifications";

const SECTIONS: { id: Section; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "summary", label: "Professional Summary", icon: FileText },
  { id: "experience", label: "Work Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Code },
  { id: "certifications", label: "Certifications", icon: Award },
];

const TEMPLATES = [
  { id: "modern",    name: "Modern",    headerBg: "from-slate-900 to-slate-800",    accent: "#7C3AED", accentText: "text-purple-300" },
  { id: "minimal",   name: "Minimal",   headerBg: "from-blue-700 to-blue-900",      accent: "#3B82F6", accentText: "text-blue-200" },
  { id: "executive", name: "Executive", headerBg: "from-amber-900 to-amber-700",    accent: "#D97706", accentText: "text-amber-200" },
  { id: "creative",  name: "Creative",  headerBg: "from-pink-700 to-fuchsia-900",   accent: "#EC4899", accentText: "text-pink-200" },
  { id: "tech",      name: "Tech",      headerBg: "from-emerald-900 to-slate-900",  accent: "#10B981", accentText: "text-emerald-300" },
];

type EducationItem = { id: string; degree: string; institution: string; year: string; gpa: string };
type CertItem     = { id: string; name: string; org: string; year: string; credentialId: string };
type ExpItem      = { id: string; role: string; company: string; location: string; period: string; description: string };

function mkEdu(): EducationItem { return { id: String(Date.now()), degree: "", institution: "", year: "", gpa: "" }; }
function mkCert(): CertItem     { return { id: String(Date.now()), name: "", org: "", year: "", credentialId: "" }; }
function mkExp(): ExpItem       { return { id: String(Date.now()), role: "", company: "", location: "", period: "", description: "" }; }

const EMPTY_FORM = {
  name: "", title: "", email: "", phone: "", location: "", linkedin: "", website: "",
  summary: "",
  skills: [] as string[],
  experience: [] as ExpItem[],
  education: [] as EducationItem[],
  certifications: [] as CertItem[],
};

export default function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { fetchResume, saveResume } = useResumes();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeSection, setActiveSection]   = useState<Section>("personal");
  const [activeTemplate, setActiveTemplate] = useState("modern");
  const [showTemplates, setShowTemplates]   = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [aiImproving, setAiImproving]             = useState(false);
  const [aiSuggestingSkills, setAiSuggestingSkills] = useState(false);
  const [aiImprovingExp, setAiImprovingExp]         = useState<number | null>(null);
  const [previewMode, setPreviewMode]       = useState(false);
  const [newSkill, setNewSkill]             = useState("");
  const [saved, setSaved]                   = useState(false);

  const [formData, setFormData] = useState(EMPTY_FORM);

  // Load from Supabase on mount
  useEffect(() => {
    fetchResume(id).then((resume) => {
      if (resume) {
        setActiveTemplate(resume.template ?? "modern");
        if (resume.formData && Object.keys(resume.formData).length > 0) {
          setFormData(resume.formData as typeof EMPTY_FORM);
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Auto-save with debounce
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const atsScore = calcAtsScore(formData as Record<string, unknown>);
      saveResume(id, { formData: formData as Record<string, unknown>, template: activeTemplate, title: formData.title || formData.name || "Untitled Resume", status: atsScore >= 60 ? "complete" : "draft", atsScore });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 800);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [formData, activeTemplate, id, saveResume]);

  const { deductCredit, openPurchase } = useCredits();
  const template = TEMPLATES.find((t) => t.id === activeTemplate) ?? TEMPLATES[0];

  const callAI = async (message: string, type: string): Promise<string> => {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, type }),
    });
    if (!res.ok) throw new Error("API error");
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let result = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }
    return result.trim();
  };

  const handleAiImprove = async () => {
    if (!(await deductCredit())) { openPurchase(); return; }
    setAiImproving(true);
    try {
      const improved = await callAI(
        `Improve this professional summary for a ${formData.title}:\n\n${formData.summary}`,
        "improve_summary"
      );
      setFormData((prev) => ({ ...prev, summary: improved }));
    } catch {
      // silent
    } finally {
      setAiImproving(false);
    }
  };

  const handleAiSuggestSkills = async () => {
    if (!(await deductCredit())) { openPurchase(); return; }
    setAiSuggestingSkills(true);
    try {
      const result = await callAI(
        `Job title: ${formData.title}. Current skills: ${formData.skills.join(", ")}. Suggest 5 additional relevant skills.`,
        "suggest_skills"
      );
      const newSkills = result
        .split(",")
        .map((s) => s.trim().replace(/^[-•*]\s*/, ""))
        .filter((s) => s && !formData.skills.includes(s))
        .slice(0, 5);
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, ...newSkills] }));
    } catch {
      // fallback silently
    } finally {
      setAiSuggestingSkills(false);
    }
  };

  const updateExp = (i: number, field: keyof ExpItem, value: string) => {
    const updated = [...formData.experience];
    updated[i] = { ...updated[i], [field]: value };
    setFormData((p) => ({ ...p, experience: updated }));
  };

  const updateEdu = (i: number, field: keyof EducationItem, value: string) => {
    const updated = [...formData.education];
    updated[i] = { ...updated[i], [field]: value };
    setFormData((p) => ({ ...p, education: updated }));
  };

  const updateCert = (i: number, field: keyof CertItem, value: string) => {
    const updated = [...formData.certifications];
    updated[i] = { ...updated[i], [field]: value };
    setFormData((p) => ({ ...p, certifications: updated }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((p) => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
      setNewSkill("");
    }
  };

  return (
    <div className="flex h-screen bg-[#07070F] overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-56 bg-[#0A0A15] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#64748B] hover:text-white text-xs mb-3 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          <h2 className="text-sm font-semibold text-white">Resume Builder</h2>
        </div>

        {/* Template selector */}
        <div className="p-3 border-b border-white/5">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg glass-card text-xs text-[#94A3B8] hover:text-white transition-all"
          >
            <div className="flex items-center gap-2">
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>Template: <span className="text-white capitalize">{activeTemplate}</span></span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTemplates ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showTemplates && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2 space-y-1">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setActiveTemplate(t.id); setShowTemplates(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${activeTemplate === t.id ? "bg-white/8 text-white" : "text-[#64748B] hover:bg-white/5 hover:text-white"}`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: t.accent }} />
                    {t.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section nav */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <p className="text-xs text-[#475569] uppercase tracking-widest px-2 mb-2 font-medium">Sections</p>
          <div className="space-y-1">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const active = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all ${active ? "nav-item-active text-purple-300 font-medium" : "text-[#64748B] hover:text-[#94A3B8] hover:bg-white/5"}`}
                >
                  <GripVertical className="w-3 h-3 text-[#475569] shrink-0" />
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {section.label}
                  {active && <ChevronRight className="w-3 h-3 ml-auto text-purple-400" />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-white/5 space-y-2">
          <button
            onClick={handleAiImprove}
            disabled={aiImproving}
            className="w-full flex items-center justify-center gap-2 btn-primary py-2.5 rounded-xl text-xs font-semibold text-white disabled:opacity-60"
          >
            {aiImproving ? (
              <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Improving...</>
            ) : (
              <><Wand2 className="w-3.5 h-3.5" />AI Improve All</>
            )}
          </button>
          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs text-[#64748B] hover:text-white border border-white/8 hover:bg-white/5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Center — Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={formData.title || formData.name || "Untitled Resume"}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="text-sm font-medium text-white bg-transparent border-none outline-none hover:bg-white/5 focus:bg-white/5 px-2 py-1 rounded-lg transition-all cursor-pointer"
            />
            <span className={`text-xs px-2 py-0.5 rounded-full transition-all ${saved ? "text-green-400 bg-green-500/10" : "text-[#475569] bg-white/5"}`}>
              {saved ? "Saved ✓" : "Auto-save"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobilePreview(!showMobilePreview)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#64748B] hover:text-white hover:bg-white/5 transition-all"
            >
              {showMobilePreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              Preview
            </button>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${previewMode ? "bg-white/10 text-white" : "text-[#64748B] hover:text-white hover:bg-white/5"}`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#64748B] hover:text-white hover:bg-white/5 transition-all">
              <Globe className="w-3.5 h-3.5" />
              Language
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#64748B] hover:text-white hover:bg-white/5 transition-all">
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Editor content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-5">
            <AnimatePresence mode="wait">
              {/* Personal */}
              {activeSection === "personal" && (
                <motion.div key="personal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <SectionHeader title="Personal Information" icon={User} />
                  <div className="grid grid-cols-2 gap-4">
                    <FieldGroup label="Full Name">
                      <input className="w-full input-dark rounded-xl px-4 py-3 text-sm" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} />
                    </FieldGroup>
                    <FieldGroup label="Email">
                      <input className="w-full input-dark rounded-xl px-4 py-3 text-sm" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} />
                    </FieldGroup>
                    <FieldGroup label="Phone">
                      <input className="w-full input-dark rounded-xl px-4 py-3 text-sm" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} />
                    </FieldGroup>
                    <FieldGroup label="Location">
                      <input className="w-full input-dark rounded-xl px-4 py-3 text-sm" value={formData.location} onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))} />
                    </FieldGroup>
                    <FieldGroup label="LinkedIn">
                      <input className="w-full input-dark rounded-xl px-4 py-3 text-sm" value={formData.linkedin} onChange={(e) => setFormData((p) => ({ ...p, linkedin: e.target.value }))} />
                    </FieldGroup>
                    <FieldGroup label="Website (optional)">
                      <input className="w-full input-dark rounded-xl px-4 py-3 text-sm" value={formData.website} onChange={(e) => setFormData((p) => ({ ...p, website: e.target.value }))} placeholder="yoursite.com" />
                    </FieldGroup>
                  </div>
                </motion.div>
              )}

              {/* Summary */}
              {activeSection === "summary" && (
                <motion.div key="summary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <SectionHeader title="Professional Summary" icon={FileText} />
                  <div className="relative">
                    <textarea
                      className="w-full input-dark rounded-xl px-4 py-3 text-sm resize-none min-h-36"
                      value={formData.summary}
                      onChange={(e) => setFormData((p) => ({ ...p, summary: e.target.value }))}
                      placeholder="Write a compelling professional summary..."
                    />
                    <button
                      onClick={handleAiImprove}
                      disabled={aiImproving}
                      className="absolute bottom-3 right-3 btn-primary text-xs font-medium text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 disabled:opacity-60"
                    >
                      {aiImproving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      AI Improve
                    </button>
                  </div>
                  <p className="text-xs text-[#64748B]">Tip: A strong summary is 2-4 sentences highlighting your years of experience, specialization, and key achievements.</p>
                </motion.div>
              )}

              {/* Experience */}
              {activeSection === "experience" && (
                <motion.div key="experience" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <SectionHeader title="Work Experience" icon={Briefcase} />
                  {formData.experience.map((exp, i) => (
                    <div key={exp.id} className="glass-card rounded-xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#64748B]">Position {i + 1}</span>
                        <button
                          onClick={() => setFormData((p) => ({ ...p, experience: p.experience.filter((_, si) => si !== i) }))}
                          className="text-[#475569] hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <FieldGroup label="Job Title">
                          <input className="w-full input-dark rounded-xl px-3 py-2.5 text-sm" value={exp.role} onChange={(e) => updateExp(i, "role", e.target.value)} />
                        </FieldGroup>
                        <FieldGroup label="Company">
                          <input className="w-full input-dark rounded-xl px-3 py-2.5 text-sm" value={exp.company} onChange={(e) => updateExp(i, "company", e.target.value)} />
                        </FieldGroup>
                        <FieldGroup label="Period">
                          <input className="w-full input-dark rounded-xl px-3 py-2.5 text-sm" value={exp.period} onChange={(e) => updateExp(i, "period", e.target.value)} />
                        </FieldGroup>
                        <FieldGroup label="Location">
                          <input className="w-full input-dark rounded-xl px-3 py-2.5 text-sm" value={exp.location} onChange={(e) => updateExp(i, "location", e.target.value)} />
                        </FieldGroup>
                      </div>
                      <FieldGroup label="Description">
                        <div className="relative">
                          <textarea
                            className="w-full input-dark rounded-xl px-3 py-2.5 text-sm resize-none min-h-24"
                            value={exp.description}
                            onChange={(e) => updateExp(i, "description", e.target.value)}
                          />
                          <button
                            disabled={aiImprovingExp === i}
                            onClick={async () => {
                              if (!exp.description.trim()) return;
                              if (!(await deductCredit())) { openPurchase(); return; }
                              setAiImprovingExp(i);
                              try {
                                const improved = await callAI(
                                  `Role: ${exp.role} at ${exp.company}.\n\nImprove this description:\n${exp.description}`,
                                  "improve_bullet"
                                );
                                updateExp(i, "description", improved);
                              } catch { /* silent */ } finally {
                                setAiImprovingExp(null);
                              }
                            }}
                            className="absolute bottom-2 right-2 btn-primary text-xs text-white px-2.5 py-1 rounded-lg flex items-center gap-1 disabled:opacity-60"
                          >
                            {aiImprovingExp === i
                              ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              : <Sparkles className="w-3 h-3" />}
                            AI
                          </button>
                        </div>
                      </FieldGroup>
                    </div>
                  ))}
                  <button
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/10 hover:border-purple-500/30 text-xs text-[#64748B] hover:text-purple-400 transition-all"
                    onClick={() => setFormData((p) => ({ ...p, experience: [...p.experience, mkExp()] }))}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Experience
                  </button>
                </motion.div>
              )}

              {/* Education */}
              {activeSection === "education" && (
                <motion.div key="education" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <SectionHeader title="Education" icon={GraduationCap} />
                  {formData.education.map((edu, i) => (
                    <div key={edu.id} className="glass-card rounded-xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#64748B]">Education {i + 1}</span>
                        <button
                          onClick={() => setFormData((p) => ({ ...p, education: p.education.filter((_, si) => si !== i) }))}
                          className="text-[#475569] hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <FieldGroup label="Degree">
                          <input className="w-full input-dark rounded-xl px-3 py-2.5 text-sm" value={edu.degree} onChange={(e) => updateEdu(i, "degree", e.target.value)} placeholder="B.S. Computer Science" />
                        </FieldGroup>
                        <FieldGroup label="Institution">
                          <input className="w-full input-dark rounded-xl px-3 py-2.5 text-sm" value={edu.institution} onChange={(e) => updateEdu(i, "institution", e.target.value)} placeholder="Stanford University" />
                        </FieldGroup>
                        <FieldGroup label="Year">
                          <input className="w-full input-dark rounded-xl px-3 py-2.5 text-sm" value={edu.year} onChange={(e) => updateEdu(i, "year", e.target.value)} placeholder="2020" />
                        </FieldGroup>
                        <FieldGroup label="GPA (optional)">
                          <input className="w-full input-dark rounded-xl px-3 py-2.5 text-sm" value={edu.gpa} onChange={(e) => updateEdu(i, "gpa", e.target.value)} placeholder="3.9/4.0" />
                        </FieldGroup>
                      </div>
                    </div>
                  ))}
                  <button
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/10 hover:border-purple-500/30 text-xs text-[#64748B] hover:text-purple-400 transition-all"
                    onClick={() => setFormData((p) => ({ ...p, education: [...p.education, mkEdu()] }))}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Education
                  </button>
                </motion.div>
              )}

              {/* Skills */}
              {activeSection === "skills" && (
                <motion.div key="skills" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <SectionHeader title="Skills" icon={Code} />
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.skills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                        <span className="text-xs text-[#94A3B8]">{skill}</span>
                        <button
                          onClick={() => setFormData((p) => ({ ...p, skills: p.skills.filter((_, si) => si !== i) }))}
                          className="text-[#475569] hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 input-dark rounded-xl px-4 py-2.5 text-sm"
                      placeholder="Add a skill (e.g. React, Python...)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                    />
                    <button
                      onClick={handleAiSuggestSkills}
                      disabled={aiSuggestingSkills}
                      className="btn-primary text-white px-4 rounded-xl text-sm font-medium flex items-center gap-1.5 disabled:opacity-60"
                    >
                      {aiSuggestingSkills ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      AI Suggest
                    </button>
                  </div>
                  <p className="text-xs text-[#64748B]">Press Enter to add a skill, or click AI Suggest to auto-fill based on your job title.</p>
                </motion.div>
              )}

              {/* Certifications */}
              {activeSection === "certifications" && (
                <motion.div key="certifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <SectionHeader title="Certifications" icon={Award} />
                  {formData.certifications.length === 0 && (
                    <p className="text-xs text-[#64748B] text-center py-4">No certifications yet. Add one below.</p>
                  )}
                  {formData.certifications.map((cert, i) => (
                    <div key={cert.id} className="glass-card rounded-xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#64748B]">Certification {i + 1}</span>
                        <button
                          onClick={() => setFormData((p) => ({ ...p, certifications: p.certifications.filter((_, si) => si !== i) }))}
                          className="text-[#475569] hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <FieldGroup label="Certification">
                          <input className="w-full input-dark rounded-xl px-3 py-2.5 text-sm" value={cert.name} onChange={(e) => updateCert(i, "name", e.target.value)} placeholder="AWS Solutions Architect" />
                        </FieldGroup>
                        <FieldGroup label="Issuing Organization">
                          <input className="w-full input-dark rounded-xl px-3 py-2.5 text-sm" value={cert.org} onChange={(e) => updateCert(i, "org", e.target.value)} placeholder="Amazon Web Services" />
                        </FieldGroup>
                        <FieldGroup label="Year">
                          <input className="w-full input-dark rounded-xl px-3 py-2.5 text-sm" value={cert.year} onChange={(e) => updateCert(i, "year", e.target.value)} placeholder="2023" />
                        </FieldGroup>
                        <FieldGroup label="Credential ID">
                          <input className="w-full input-dark rounded-xl px-3 py-2.5 text-sm" value={cert.credentialId} onChange={(e) => updateCert(i, "credentialId", e.target.value)} placeholder="ABC-123-XYZ" />
                        </FieldGroup>
                      </div>
                    </div>
                  ))}
                  <button
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/10 hover:border-purple-500/30 text-xs text-[#64748B] hover:text-purple-400 transition-all"
                    onClick={() => setFormData((p) => ({ ...p, certifications: [...p.certifications, mkCert()] }))}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Certification
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right — Live Preview */}
      <div className={`print-panel ${showMobilePreview ? "fixed inset-0 z-50 lg:relative lg:inset-auto" : "hidden lg:flex"} w-full lg:w-[420px] bg-[#0A0A15] border-l border-white/5 flex-col shrink-0`}>
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-medium text-white">Live Preview</span>
          </div>
          <div className="flex items-center gap-2">
            {(() => {
              const score = calcAtsScore(formData as Record<string, unknown>);
              const color = score >= 70 ? "text-green-400" : score >= 40 ? "text-amber-400" : "text-red-400";
              const dot   = score >= 70 ? "bg-green-400"  : score >= 40 ? "bg-amber-400"  : "bg-red-400";
              return (
                <span className={`text-xs ${color} flex items-center gap-1`}>
                  <span className={`w-1.5 h-1.5 ${dot} rounded-full`} />
                  ATS: {score}%
                </span>
              );
            })()}
            <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 btn-primary rounded-lg text-xs font-medium text-white">
              <Download className="w-3 h-3" />
              PDF
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="print-resume bg-white rounded-lg shadow-2xl overflow-hidden text-xs" style={{ fontFamily: "Georgia, serif" }}>
            {/* Header — changes with template */}
            <div className={`bg-gradient-to-r ${template.headerBg} px-6 py-6 text-white`}>
              <h2 className="text-lg font-bold">{formData.name || "Your Name"}</h2>
              {formData.title && <p className={`${template.accentText} text-xs mt-0.5`}>{formData.title}</p>}
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-[10px] text-slate-300">
                {formData.email && <span>{formData.email}</span>}
                {formData.phone && <><span>•</span><span>{formData.phone}</span></>}
                {formData.location && <><span>•</span><span>{formData.location}</span></>}
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              {formData.summary && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5" style={{ color: template.accent }}>Summary</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{formData.summary}</p>
                </div>
              )}

              {formData.experience.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: template.accent }}>Experience</h3>
                  <div className="space-y-3">
                    {formData.experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[11px] font-bold text-slate-800">{exp.role || "Role"}</p>
                            <p className="text-[10px]" style={{ color: template.accent }}>{exp.company || "Company"}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0">{exp.period}</span>
                        </div>
                        {exp.description && <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.education.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: template.accent }}>Education</h3>
                  <div className="space-y-2">
                    {formData.education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-start">
                        <div>
                          <p className="text-[11px] font-bold text-slate-800">{edu.degree || "Degree"}</p>
                          <p className="text-[10px] text-slate-500">{edu.institution}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400">{edu.year}</span>
                          {edu.gpa && <p className="text-[10px] text-slate-400">GPA: {edu.gpa}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.skills.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: template.accent }}>Skills</h3>
                  <div className="flex flex-wrap gap-1">
                    {formData.skills.map((skill) => (
                      <span key={skill} className="text-[10px] px-2 py-0.5 rounded font-medium text-slate-700" style={{ background: template.accent + "22" }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {formData.certifications.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: template.accent }}>Certifications</h3>
                  <div className="space-y-1.5">
                    {formData.certifications.map((cert) => (
                      <div key={cert.id} className="flex justify-between">
                        <div>
                          <p className="text-[11px] font-bold text-slate-800">{cert.name}</p>
                          <p className="text-[10px] text-slate-500">{cert.org}</p>
                        </div>
                        <span className="text-[10px] text-slate-400">{cert.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon: Icon }: { title: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-center gap-3 pb-3 border-b border-white/5">
      <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-purple-400" />
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#64748B] mb-1.5">{label}</label>
      {children}
    </div>
  );
}
