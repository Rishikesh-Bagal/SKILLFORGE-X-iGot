import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Sparkles,
  Award,
  BookOpen,
  Target,
  FileUp,
  Brain,
  Shield,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

interface SIHDemoBannerProps {
  onStartQuiz: (quizId: string) => void;
}

export const SIHDemoBanner: React.FC<SIHDemoBannerProps> = ({ onStartQuiz }) => {
  const { role, switchRole, setActiveTab } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside aria-label="SIH 2026 Evaluation Navigator" className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0B2545] text-white border-b border-indigo-700/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              SIH 2026 Jury Fast-Track
            </span>
            <span className="hidden sm:inline text-xs text-blue-200">
              | Complete 6-Step Demonstration Workflow
            </span>
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-1 text-xs text-blue-200 hover:text-white transition-colors"
          >
            <span>{collapsed ? "Show Workflow Actions" : "Hide Bar"}</span>
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {!collapsed && (
          <div className="mt-2 pt-2 border-t border-blue-800/60 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            {/* Step 1 */}
            <button
              onClick={async () => {
                await switchRole("employee");
                setActiveTab("competency-profile");
              }}
              className="flex items-center gap-1.5 p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-left border border-white/10"
              title="View 33 competencies across 4 domains"
            >
              <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-blue-300 font-semibold">Step 1</div>
                <div className="font-medium text-white truncate">Competencies</div>
              </div>
            </button>

            {/* Step 2 */}
            <button
              onClick={async () => {
                await switchRole("employee");
                setActiveTab("skill-gaps");
              }}
              className="flex items-center gap-1.5 p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-left border border-white/10"
              title="Analyze gap radar & priority skills"
            >
              <Target className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-blue-300 font-semibold">Step 2</div>
                <div className="font-medium text-white truncate">Skill Gaps</div>
              </div>
            </button>

            {/* Step 3 */}
            <button
              onClick={async () => {
                await switchRole("employee");
                setActiveTab("igot-courses");
              }}
              className="flex items-center gap-1.5 p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-left border border-white/10"
              title="See iGOT recommendations matched to gaps"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-blue-300 font-semibold">Step 3</div>
                <div className="font-medium text-white truncate">iGOT Courses</div>
              </div>
            </button>

            {/* Step 4 */}
            <button
              onClick={async () => {
                await switchRole("employee");
                setActiveTab("quiz-generator");
              }}
              className="flex items-center gap-1.5 p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-left border border-white/10"
              title="Generate MCQs from MoSPI Handbooks"
            >
              <FileUp className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-blue-300 font-semibold">Step 4</div>
                <div className="font-medium text-white truncate">AI Quiz Gen</div>
              </div>
            </button>

            {/* Step 5 */}
            <button
              onClick={() => {
                onStartQuiz("quiz-na-01");
              }}
              className="flex items-center gap-1.5 p-1.5 rounded bg-amber-500/30 hover:bg-amber-500/40 text-amber-100 transition-colors text-left border border-amber-400/30"
              title="Take National Accounts Quiz & Boost Competency"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-amber-300 font-semibold">Step 5 (Live)</div>
                <div className="font-bold text-white truncate">Take Quiz (+8 pts)</div>
              </div>
            </button>

            {/* Step 6 */}
            <button
              onClick={async () => {
                await switchRole("admin");
                setActiveTab("admin");
              }}
              className="flex items-center gap-1.5 p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-left border border-white/10"
              title="Switch to Administrator to view workforce analytics"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-blue-300 font-semibold">Step 6</div>
                <div className="font-medium text-white truncate">Admin Analytics</div>
              </div>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
