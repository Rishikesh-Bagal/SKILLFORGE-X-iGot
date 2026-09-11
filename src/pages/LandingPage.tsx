import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  Brain,
  Award,
  BookOpen,
  Target,
  FileUp,
  Shield,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Database,
  BarChart3,
  Lock,
  ChevronRight,
  ExternalLink,
  Layers,
  Zap,
  TrendingUp
} from "lucide-react";

interface LandingPageProps {
  onStartDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartDemo }) => {
  const { setActiveTab, switchRole } = useAuth();

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B2545] via-[#133E87] to-[#1D4ED8] text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-blue-800">
        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Government & Hackathon Badge */}
          <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/80 border border-blue-400/30 text-xs font-medium text-blue-200 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="font-semibold text-amber-300">Smart India Hackathon 2026</span>
            <span className="text-blue-300">•</span>
            <span>Problem Statement ID: SIH26101</span>
            <span className="text-blue-300">•</span>
            <span className="text-white font-bold">Team CODE2FIX</span>
          </div>

          {/* Main Title & Tagline */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
              SKILLFORGE <span className="text-cyan-300">AI</span>
            </h1>
            <p className="text-lg sm:text-2xl font-semibold text-blue-100 tracking-tight">
              AI-Powered Competency Intelligence & Learning Copilot
            </p>
          </div>

          <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed font-normal">
            Identify competency gaps. Discover personalized learning pathways. Strengthen skills for India's evolving
            Official Statistical System in seamless alignment with the <strong>iGOT Karmayogi</strong> ecosystem.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              id="btn-hero-portal"
              onClick={async () => {
                await switchRole("employee");
                setActiveTab("dashboard");
              }}
              className="px-6 py-3 rounded-lg text-sm font-bold bg-white text-[#0B2545] hover:bg-blue-50 transition-all shadow-md flex items-center gap-2 group cursor-pointer"
            >
              <span>Access Employee Dashboard</span>
              <ArrowRight className="w-4 h-4 text-blue-700 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="btn-hero-demo"
              onClick={onStartDemo}
              className="px-6 py-3 rounded-lg text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch SIH 2026 Interactive Tour</span>
            </button>

            <button
              id="btn-hero-competencies"
              onClick={async () => {
                await switchRole("employee");
                setActiveTab("competency-profile");
              }}
              className="px-5 py-3 rounded-lg text-sm font-semibold bg-blue-950/60 hover:bg-blue-900 text-white border border-blue-400/40 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Explore 4-Domain Framework</span>
            </button>
          </div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none hidden md:block"></div>
      </section>

      {/* Official End-to-End Workflow Diagram */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 inline-block px-2.5 py-1 rounded-full">
            Autonomous Capacity Building Loop
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            How SKILLFORGE AI Solves Problem Statement 26101
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Converting static job descriptions into continuous, verified statistical capacity across India's cadre.
          </p>
        </div>

        {/* Responsive Horizontal Workflow Chain */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 relative">
          {[
            { step: "01", label: "Profile Setup", desc: "Role, Cadre & Posting", icon: <Award className="w-5 h-5 text-blue-600" /> },
            { step: "02", label: "Diagnostic", desc: "Domain Assessment", icon: <Target className="w-5 h-5 text-indigo-600" /> },
            { step: "03", label: "Gap Analysis", desc: "Prioritized Deltas", icon: <BarChart3 className="w-5 h-5 text-red-500" /> },
            { step: "04", label: "AI Pathway", desc: "Personalized Phases", icon: <CompassIcon className="w-5 h-5 text-purple-600" /> },
            { step: "05", label: "iGOT Learning", desc: "Official Modules", icon: <BookOpen className="w-5 h-5 text-emerald-600" /> },
            { step: "06", label: "MCQ Quizzes", desc: "AI From Handbooks", icon: <Sparkles className="w-5 h-5 text-amber-500" /> },
            { step: "07", label: "Instant Scoring", desc: "Weak Area Insights", icon: <CheckCircle2 className="w-5 h-5 text-teal-600" /> },
            { step: "08", label: "Verified Growth", desc: "Competency Boost", icon: <TrendingUp className="w-5 h-5 text-blue-700" /> }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 hover:bg-blue-50/60 transition-colors p-3.5 rounded-lg border border-slate-200 text-center flex flex-col items-center justify-center relative group"
            >
              <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold text-blue-700 font-mono">{item.step}</span>
              <h4 className="font-bold text-xs text-slate-900 mt-0.5">{item.label}</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The 4 Official Competency Domains */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-700">Official Statistical Framework</div>
            <h3 className="text-2xl font-bold text-slate-900">33 Standardized Competency Benchmarks</h3>
          </div>
          <button
            onClick={async () => {
              await switchRole("employee");
              setActiveTab("competency-profile");
            }}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            <span>View Complete Competency Matrix</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Domain A */}
          <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm mb-3">
                A
              </div>
              <h4 className="font-bold text-slate-900 text-base">Statistical Domain</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                Core methodologies for official government estimates, price indices, and macroeconomic accounts.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Survey Design & Multi-Stage Sampling</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>National Accounts (SNA 2008 & GVA)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Price Statistics (CPI / WPI Deflation)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Labour & PLFS Indicators</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>NQAF Data Quality Frameworks</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-blue-700 font-semibold">
              10 Official MoSPI Competencies →
            </div>
          </div>

          {/* Domain B */}
          <div className="bg-white rounded-xl border border-cyan-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-9 h-9 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-sm mb-3">
                B
              </div>
              <h4 className="font-bold text-slate-900 text-base">Technical Domain</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                Modern microdata engineering, automated cleaning pipelines, and statistical computing.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>Python for Microdata Processing</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>SQL & Enterprise Data Warehouse</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>R & Econometric Survey Modeling</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>AI / ML in Statistical Outliers</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>GIS & Bhuvan Spatial Mapping</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-cyan-700 font-semibold">
              12 Computing Competencies →
            </div>
          </div>

          {/* Domain C */}
          <div className="bg-white rounded-xl border border-pink-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-9 h-9 rounded-lg bg-pink-100 text-pink-800 flex items-center justify-center font-bold text-sm mb-3">
                C
              </div>
              <h4 className="font-bold text-slate-900 text-base">Digital Governance</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                Statutory data protection, citizen privacy preservation, and government cloud security.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                  <span>DPDP Act 2023 Statutory Duties</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                  <span>Statistical Anonymization & k-Anonymity</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                  <span>CERT-In Government Cybersecurity</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                  <span>e-Office & Digital Signatures (DSC)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                  <span>Digital Public Infrastructure (DPI)</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-pink-700 font-semibold">
              5 Governance Competencies →
            </div>
          </div>

          {/* Domain D */}
          <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-3">
                D
              </div>
              <h4 className="font-bold text-slate-900 text-base">Behavioural / Managerial</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                Field leadership, clear dissemination of uncertainty, and strict professional ethics.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Statistical Leadership & Field Mentorship</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Technical Communication & Press Notes</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Survey Field Operations & FOD Supervision</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Collection of Statistics Act 2008 Ethics</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Evidence-Based Decision Briefings</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-amber-700 font-semibold">
              6 Managerial Competencies →
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid: iGOT + Gemini MCQ Generator + Copilot */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: iGOT Karmayogi Adapter */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">iGOT Karmayogi Integration</h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                API Adapter
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Engineered with clean <code>IGOTService</code> interfaces. Automatically recommends validated training from
              NSSTA, ISTM, NIC, and IIPA mapped directly to each officer's competency delta.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={async () => {
                await switchRole("employee");
                setActiveTab("igot-courses");
              }}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <span>Explore iGOT Recommendations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: AI Quiz & MCQ Engine */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <FileUp className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">AI Material-to-MCQ Engine</h3>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                Gemini 3.8
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload official handbooks (.txt, .pdf, .docx). Server-side Gemini extracts nuanced concepts and synthesizes
              rigorous 4-option scenario MCQs with official references and automatic scoring.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={async () => {
                await switchRole("employee");
                setActiveTab("quiz-generator");
              }}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
            >
              <span>Upload Document & Generate MCQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: SkillForge Copilot */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
              <Brain className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">SkillForge Copilot</h3>
              <span className="text-[10px] bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded">
                Context-Aware
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              An intelligent learning assistant grounded in official Indian statistics. Clarifies National Accounts GDP
              deflators, sampling formulas, and NSSTA preparation tailored to the logged-in officer's gaps.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={async () => {
                await switchRole("employee");
                setActiveTab("copilot");
              }}
              className="text-xs font-semibold text-cyan-700 hover:text-cyan-900 flex items-center gap-1"
            >
              <span>Chat with SkillForge Copilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Institutional Call to Action */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6 shadow-xl border border-slate-800">
        <div className="inline-block p-3 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <GraduationCap className="w-8 h-8 mx-auto" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Ready to Experience Official Statistical Capacity Building?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Test the complete end-to-end prototype designed by Team CODE2FIX for Smart India Hackathon 2026.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={async () => {
              await switchRole("employee");
              setActiveTab("dashboard");
            }}
            className="px-6 py-3 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Enter Statistical Officer Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={async () => {
              await switchRole("admin");
              setActiveTab("admin");
            }}
            className="px-6 py-3 rounded-lg text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Open Administrator Intelligence</span>
          </button>
        </div>
      </section>
    </div>
  );
};

// Internal icon helper
const CompassIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" />
  </svg>
);
