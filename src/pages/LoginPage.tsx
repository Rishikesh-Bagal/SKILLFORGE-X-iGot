import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import { api } from "../services/api";
import {
  Brain,
  Shield,
  Award,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  KeyRound,
  X
} from "lucide-react";

interface LoginPageProps {
  onSwitchToSignup?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignup }) => {
  const { login, loginWithGoogle, switchRole, setActiveTab } = useAuth();
  
  const [email, setEmail] = useState("rajesh.kumar@mospi.gov.in");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your official email or employee ID.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
    } catch (err: any) {
      setError(err?.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle({
        email: "officer.sso@mospi.gov.in",
        name: "Statistical Officer (Google SSO)"
      });
    } catch (err: any) {
      setError(err?.message || "Google Single Sign-On failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleQuickDemoLogin = async (targetRole: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      await switchRole(targetRole);
    } catch (err: any) {
      setError(err?.message || "Fast-track persona switch failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    setForgotStatus(null);
    try {
      const res = await api.forgotPassword(forgotEmail.trim());
      setForgotStatus(res.message);
    } catch (err: any) {
      setForgotStatus(err?.message || "Could not dispatch reset email. Please contact MoSPI IT Helpdesk.");
    } finally {
      setForgotLoading(false);
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
          Sign In to <span className="text-blue-600">SKILLFORGE AI</span>
        </h1>
        <p className="text-xs font-medium text-slate-600 max-w-md mx-auto leading-relaxed">
          AI-Powered Competency Intelligence & Learning Copilot
        </p>
        <p className="text-[11px] text-slate-500">
          Official Statistical System • Ministry of Statistics & Programme Implementation (MoSPI)
        </p>
      </div>

      {/* 1-Click SIH 2026 Evaluation Personas Fast-Track */}
      <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>SIH 2026 1-Click Fast-Track Personas</span>
          </span>
          <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-md shadow-xs">
            Evaluator Demo Mode
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Select any verified official role to test complete end-to-end capacity building workflows:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Employee Persona */}
          <button
            type="button"
            onClick={() => handleQuickDemoLogin("employee")}
            disabled={loading}
            className="text-left p-3 rounded-xl bg-white border border-blue-200 hover:border-blue-500 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <Award className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-slate-900 group-hover:text-blue-700">
                Learner / Officer
              </span>
            </div>
            <div className="text-[10px] text-slate-500 line-clamp-1">Rajesh Kumar • SSO (NAD)</div>
            <div className="mt-2 text-[10px] text-blue-600 font-bold flex items-center gap-1">
              <span>Sign In as Learner</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Trainer Persona */}
          <button
            type="button"
            onClick={() => handleQuickDemoLogin("trainer")}
            disabled={loading}
            className="text-left p-3 rounded-xl bg-white border border-emerald-200 hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-slate-900 group-hover:text-emerald-700">
                Faculty / Trainer
              </span>
            </div>
            <div className="text-[10px] text-slate-500 line-clamp-1">Dr. Ananya Sharma • NSSTA</div>
            <div className="mt-2 text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <span>Sign In as Trainer</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Admin Persona */}
          <button
            type="button"
            onClick={() => handleQuickDemoLogin("admin")}
            disabled={loading}
            className="text-left p-3 rounded-xl bg-white border border-purple-200 hover:border-purple-500 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-slate-900 group-hover:text-purple-700">
                Administrator
              </span>
            </div>
            <div className="text-[10px] text-slate-500 line-clamp-1">Dr. V. K. Malhotra • MoSPI</div>
            <div className="mt-2 text-[10px] text-purple-600 font-bold flex items-center gap-1">
              <span>Sign In as Admin</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Main Login Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Official Credential Authentication
          </h2>
          <span className="text-[11px] text-slate-400">Jan Parichay &amp; NIC SSO Compatible</span>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Authentication Notice: </span>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleStandardLogin} className="space-y-4">
          {/* Email / Official ID Field */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Email Address / Official Employee ID <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@mospi.gov.in or MOSPI-ISS-8841"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Password Field with Show/Hide */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Password <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotStatus(null);
                  setIsForgotModalOpen(true);
                }}
                className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0B2545] hover:bg-blue-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating Official Credentials...</span>
              </span>
            ) : (
              <>
                <span>Sign In via Official Gateway</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Or Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-500 font-medium">Or continue with</span>
          </div>
        </div>

        {/* Continue with Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-2xs"
        >
          {googleLoading ? (
            <span className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        {/* Create Account Link */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span className="text-slate-600">New officer to the capacity building platform?</span>
          <button
            type="button"
            onClick={() => {
              if (onSwitchToSignup) onSwitchToSignup();
              else setActiveTab("signup");
            }}
            className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Create Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Reset Official Password</h3>
                  <p className="text-[11px] text-slate-500">Government Gateway Password Recovery</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotStatus ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Dispatch Confirmed</span>
                </div>
                <p className="leading-relaxed">{forgotStatus}</p>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full mt-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  Enter your registered official email or employee ID. A secure verification OTP and reset link will be sent to your government mailbox.
                </p>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Email / ID</label>
                  <input
                    type="text"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. officer@mospi.gov.in"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2 rounded-xl bg-[#0B2545] hover:bg-blue-900 text-white font-bold cursor-pointer disabled:opacity-70"
                  >
                    {forgotLoading ? "Dispatching..." : "Send Reset Link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
