import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import {
  Brain,
  Bell,
  Search,
  User,
  Shield,
  GraduationCap,
  Sparkles,
  Award,
  BookOpen,
  Target,
  BarChart3,
  FileText,
  Compass,
  ChevronDown,
  LogOut,
  RefreshCw,
  ExternalLink
} from "lucide-react";

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadNotifsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenNotifications,
  unreadNotifsCount
}) => {
  const { user, role, switchRole, activeTab, setActiveTab, logout, firebaseConnected } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleRoleChange = async (targetRole: UserRole) => {
    setRoleDropdownOpen(false);
    await switchRole(targetRole);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Official Government of India Top Strip */}
      <div className="bg-[#0B2545] text-white text-xs py-1 px-4 sm:px-8 flex flex-wrap items-center justify-between border-b border-blue-900/50">
        <div className="flex items-center space-x-3">
          <div className="flex h-3 w-6 rounded-xs overflow-hidden shadow-xs border border-white/20">
            <div className="w-1/3 bg-[#FF9933]"></div>
            <div className="w-1/3 bg-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full border-[0.5px] border-[#000080]"></div>
            </div>
            <div className="w-1/3 bg-[#138808]"></div>
          </div>
          <span className="font-medium tracking-wide">भारत सरकार | Government of India</span>
          <span className="hidden md:inline text-blue-300">|</span>
          <span className="hidden md:inline text-slate-200">
            Ministry of Statistics & Programme Implementation (MoSPI)
          </span>
        </div>

        <div className="flex items-center space-x-4 text-[11px] text-blue-200">
          <span className="hidden lg:inline bg-blue-900/80 px-2 py-0.5 rounded-xs font-mono text-amber-300 border border-blue-700">
            SIH 2026 Problem: SIH26101
          </span>
          <span className="hidden sm:inline bg-blue-950 px-2 py-0.5 rounded-xs text-blue-300">
            Team: CODE2FIX (SE-SW-06)
          </span>
          <a
            href="https://igotkarmayogi.gov.in"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>iGOT Karmayogi Portal</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        {/* Logo & Identity */}
        <div
          onClick={() => setActiveTab("landing")}
          className="flex items-center gap-3 cursor-pointer group"
          id="header-brand-logo"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#133E87] to-[#0B2545] flex items-center justify-center text-white shadow-sm ring-2 ring-blue-600/20 group-hover:scale-105 transition-transform">
            <Brain className="w-6 h-6 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-[#0B2545]">
                SKILLFORGE <span className="text-blue-600">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-xs bg-amber-100 text-amber-800 border border-amber-300">
                Official Stats
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none hidden sm:block">
              Competency Intelligence & Learning Copilot for India's Official Statistics
            </p>
          </div>
        </div>

        {/* Global Controls: Search, Notifications, Demo Role Switcher, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud Firestore Live Status */}
          <div
            id="badge-firebase-status"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 border border-slate-200"
            title="Firebase Firestore & Authentication Status"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                firebaseConnected ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-amber-400"
              }`}
            ></span>
            <span className="text-slate-700 font-semibold">Firebase</span>
            <span className={firebaseConnected ? "text-emerald-700 font-bold" : "text-amber-700"}>
              {firebaseConnected ? "Live" : "Ready"}
            </span>
          </div>

          {/* Quick Search Button */}
          <button
            id="btn-global-search"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-slate-600 bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200"
            title="Search Competencies, Courses, Quizzes (Cmd/Ctrl + K)"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span className="hidden md:inline text-xs text-slate-500">Quick search...</span>
            <kbd className="hidden lg:inline text-[10px] bg-white border border-slate-300 px-1.5 rounded text-slate-500">
              ⌘K
            </kbd>
          </button>

          {/* Notifications Button */}
          <button
            id="btn-header-notifications"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
            title="Official Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Quick Demo Role Switcher */}
          <div className="relative">
            <button
              id="btn-demo-role-switcher"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 transition-colors"
              title="Switch demo persona for evaluation"
            >
              {role === "admin" ? (
                <Shield className="w-3.5 h-3.5 text-purple-600" />
              ) : role === "trainer" ? (
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Award className="w-3.5 h-3.5 text-blue-600" />
              )}
              <span className="capitalize hidden sm:inline">Role:</span>
              <span className="font-bold text-blue-800 uppercase text-[11px]">{role}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase text-[10px] border-b border-slate-100 flex items-center justify-between">
                  <span>SIH 2026 Demo Personas</span>
                  <span className="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">1-Click</span>
                </div>

                <button
                  onClick={() => handleRoleChange("employee")}
                  className={`w-full text-left px-3 py-2 flex items-start gap-2 hover:bg-blue-50 transition-colors ${
                    role === "employee" ? "bg-blue-50/70 font-semibold text-blue-900" : "text-slate-700"
                  }`}
                >
                  <Award className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900">Statistical Officer</div>
                    <div className="text-[11px] text-slate-500">Rajesh Kumar (MoSPI NAD)</div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleChange("trainer")}
                  className={`w-full text-left px-3 py-2 flex items-start gap-2 hover:bg-emerald-50 transition-colors ${
                    role === "trainer" ? "bg-emerald-50/70 font-semibold text-emerald-900" : "text-slate-700"
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900">Trainer / Content Lead</div>
                    <div className="text-[11px] text-slate-500">Dr. Ananya Sharma (NSSTA Faculty)</div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleChange("admin")}
                  className={`w-full text-left px-3 py-2 flex items-start gap-2 hover:bg-purple-50 transition-colors ${
                    role === "admin" ? "bg-purple-50/70 font-semibold text-purple-900" : "text-slate-700"
                  }`}
                >
                  <Shield className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-900">Administrator / HR Lead</div>
                    <div className="text-[11px] text-slate-500">Dr. V. K. Malhotra (MoSPI HAG)</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Menu */}
          {user ? (
            <div className="relative">
              <button
                id="btn-user-profile-menu"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-[#133E87] text-white flex items-center justify-center font-bold text-xs">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-lg bg-white shadow-xl border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                    <p className="text-slate-500 text-[11px]">{user.designation}</p>
                    <p className="text-blue-700 font-medium text-[11px]">{user.department}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded font-mono">
                        {user.employeeId}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                        Score: {user.overallCompetency}%
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setActiveTab("onboarding");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                      <span>Re-run Onboarding & Self-Assessment</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setActiveTab("competency-profile");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <span>View Official Competency Passport</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("login")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#0B2545] text-white hover:bg-blue-900 transition-colors shadow-2xs cursor-pointer"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Primary Role-Aware Navigation Bar */}
      <div className="bg-[#F8FAFC] border-t border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center overflow-x-auto no-scrollbar py-1">
          {/* Landing shortcut */}
          <button
            onClick={() => setActiveTab("landing")}
            className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "landing"
                ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-slate-500" />
            <span>Overview</span>
          </button>

          {/* EMPLOYEE NAVIGATION */}
          {role === "employee" && (
            <>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === "dashboard"
                    ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Employee Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab("competency-profile")}
                className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === "competency-profile"
                    ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Competency Framework</span>
              </button>

              <button
                onClick={() => setActiveTab("skill-gaps")}
                className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === "skill-gaps"
                    ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Target className="w-3.5 h-3.5 text-red-500" />
                <span>Skill-Gap Analysis</span>
              </button>

              <button
                onClick={() => setActiveTab("learning-path")}
                className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === "learning-path"
                    ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                <span>Personalized Pathway</span>
              </button>

              <button
                onClick={() => setActiveTab("igot-courses")}
                className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === "igot-courses"
                    ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>iGOT Recommendations</span>
              </button>

              <button
                onClick={() => setActiveTab("nssta-training")}
                className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === "nssta-training"
                    ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                <span>NSSTA TPAC Programmes</span>
              </button>

              <button
                onClick={() => setActiveTab("quiz-generator")}
                className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === "quiz-generator"
                    ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>AI Quiz Generator</span>
              </button>

              <button
                onClick={() => setActiveTab("copilot")}
                className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === "copilot"
                    ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Brain className="w-3.5 h-3.5 text-cyan-600" />
                <span>SkillForge Copilot</span>
              </button>
            </>
          )}

          {/* TRAINER NAVIGATION */}
          {role === "trainer" && (
            <>
              <button
                onClick={() => setActiveTab("trainer")}
                className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === "trainer"
                    ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Trainer Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab("quiz-generator")}
                className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === "quiz-generator"
                    ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Upload Material & Generate MCQs</span>
              </button>

              <button
                onClick={() => setActiveTab("competency-profile")}
                className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === "competency-profile"
                    ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Official Competency Registry</span>
              </button>

              <button
                onClick={() => setActiveTab("nssta-training")}
                className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === "nssta-training"
                    ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                <span>Manage TPAC Curricula</span>
              </button>
            </>
          )}

          {/* ADMIN NAVIGATION */}
          {role === "admin" && (
            <>
              <button
                onClick={() => setActiveTab("admin")}
                className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === "admin"
                    ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>Workforce Intelligence Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab("skill-gaps")}
                className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === "skill-gaps"
                    ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Target className="w-3.5 h-3.5 text-red-500" />
                <span>Workforce Skill-Gap Heatmap</span>
              </button>

              <button
                onClick={() => setActiveTab("igot-courses")}
                className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === "igot-courses"
                    ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>iGOT Course Catalogue & Adapter</span>
              </button>

              <button
                onClick={() => setActiveTab("nssta-training")}
                className={`px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === "nssta-training"
                    ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                <span>Manage NSSTA TPAC Programmes</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
