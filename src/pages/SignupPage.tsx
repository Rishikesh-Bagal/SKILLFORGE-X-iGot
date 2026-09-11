import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Brain,
  Shield,
  Lock,
  Mail,
  User,
  Building2,
  Briefcase,
  BadgeCheck,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from "lucide-react";

interface SignupPageProps {
  onSwitchToLogin?: () => void;
}

const DEPARTMENTS = [
  "National Accounts Division (NAD)",
  "Field Operations Division (FOD)",
  "Social Statistics Division (SSD)",
  "Economic Statistics Division (ESD)",
  "National Statistical Systems Training Academy (NSSTA)",
  "Data Informatics and Innovation Division (DIID)",
  "Coordination and Publication Division (CPD)",
  "Ministry of Statistics & Programme Implementation (MoSPI) - General",
  "Other Ministry / State Directorate of Economics & Statistics"
];

const DESIGNATIONS = [
  "Junior Statistical Officer (JSO)",
  "Senior Statistical Officer (SSO)",
  "Assistant Director (Statistics)",
  "Deputy Director (Statistics)",
  "Joint Director (Statistics)",
  "Director / Additional Director General",
  "Statistical Investigator / Field Officer",
  "Research Fellow / Data Analyst"
];

export const SignupPage: React.FC<SignupPageProps> = ({ onSwitchToLogin }) => {
  const { register, setActiveTab } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [customDepartment, setCustomDepartment] = useState("");
  const [designation, setDesignation] = useState(DESIGNATIONS[1]);
  const [jobRole, setJobRole] = useState("National Accounts Compilation & Macroeconomic Aggregates");
  const [employeeId, setEmployeeId] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: "None", score: 0, color: "bg-slate-200" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { label: "Weak", score: 1, color: "bg-amber-500", text: "text-amber-700" };
    if (score <= 3) return { label: "Moderate", score: 2, color: "bg-blue-500", text: "text-blue-700" };
    return { label: "Strong", score: 3, color: "bg-emerald-600", text: "text-emerald-700" };
  };

  const strength = getPasswordStrength();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!fullName.trim()) {
      setError("Please enter your Full Official Name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid official email address (e.g., officer@mospi.gov.in).");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter both fields.");
      return;
    }

    const finalDepartment = department === "Other Ministry / State Directorate of Economics & Statistics" && customDepartment.trim()
      ? customDepartment.trim()
      : department;

    if (!finalDepartment) {
      setError("Please select or specify your government department.");
      return;
    }

    if (!designation.trim()) {
      setError("Please select or enter your official designation.");
      return;
    }

    if (!jobRole.trim()) {
      setError("Please specify your current job role or key responsibilities.");
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        department: finalDepartment,
        designation: designation.trim(),
        jobRole: jobRole.trim(),
        employeeId: employeeId.trim() || undefined,
        organization: "Ministry of Statistics & Programme Implementation (MoSPI)"
      });
      // AuthContext.register automatically sets activeTab to "onboarding"
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>SIH 2026 • Problem Statement 26101 • Team CODE2FIX</span>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-[#0B2545] text-white flex items-center justify-center mx-auto shadow-md border border-blue-900/50">
          <Brain className="w-8 h-8 text-cyan-300" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create Your <span className="text-blue-600">SKILLFORGE AI</span> Account
        </h1>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          AI-Powered Competency Intelligence & Learning Copilot for India&apos;s Official Statistical System (MoSPI / NSSTA)
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-blue-600" />
            <span>Official Government Cadre Registration</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Register your official profile. Once registered, you will be guided through the 5-step competency diagnostic wizard.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Registration Alert: </span>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name & Official Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vikramaditya Sharma"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Official Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@mospi.gov.in"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                {password && (
                  <span className={`text-[10px] font-bold ${strength.text}`}>
                    Strength: {strength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength Bars */}
              {password && (
                <div className="grid grid-cols-3 gap-1 mt-1.5">
                  <div className={`h-1 rounded-full ${strength.score >= 1 ? strength.color : "bg-slate-200"}`} />
                  <div className={`h-1 rounded-full ${strength.score >= 2 ? strength.color : "bg-slate-200"}`} />
                  <div className={`h-1 rounded-full ${strength.score >= 3 ? strength.color : "bg-slate-200"}`} />
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className={`w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border ${
                    confirmPassword && confirmPassword !== password
                      ? "border-rose-300 bg-rose-50/30"
                      : "border-slate-300 bg-slate-50/50"
                  } focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && confirmPassword === password && (
                <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Passwords match
                </p>
              )}
            </div>
          </div>

          {/* Department & Custom Department */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Department / Directorate <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50 appearance-none cursor-pointer"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            {department === "Other Ministry / State Directorate of Economics & Statistics" && (
              <input
                type="text"
                value={customDepartment}
                onChange={(e) => setCustomDepartment(e.target.value)}
                placeholder="Enter specific Ministry / Directorate name"
                className="w-full mt-2 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600"
              />
            )}
          </div>

          {/* Designation & Current Job Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Designation <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50 appearance-none cursor-pointer"
                >
                  {DESIGNATIONS.map((desig) => (
                    <option key={desig} value={desig}>
                      {desig}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Current Job Role <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Survey Data Compiler & Verification"
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Employee ID / Cadre Code (Optional) */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">
              Employee ID / Cadre Number <span className="text-slate-400 text-[10px]">(Optional • Auto-assigned if blank)</span>
            </label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="e.g. ISS-2024-8841 or Parichay ID"
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0B2545] hover:bg-blue-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-70 mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Official Account & Initializing Diagnostic...</span>
              </span>
            ) : (
              <>
                <span>Create Account & Proceed to Onboarding</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Link back to login */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            Already have an official account?{" "}
            <button
              type="button"
              onClick={() => {
                if (onSwitchToLogin) onSwitchToLogin();
                else setActiveTab("login");
              }}
              className="text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer ml-1"
            >
              Sign In here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
