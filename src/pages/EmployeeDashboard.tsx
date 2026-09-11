import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import {
  Competency,
  SkillGapItem,
  IGOTCourse,
  NSSTATrainingProgramme,
  LearningPath,
  Quiz
} from "../types";
import {
  Award,
  BookOpen,
  Target,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  GraduationCap,
  ChevronRight,
  RefreshCw,
  Flame,
  FileCheck2,
  Layers
} from "lucide-react";

interface EmployeeDashboardProps {
  onStartQuiz: (quizId: string) => void;
  onSelectCourse: (courseId: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  onStartQuiz,
  onSelectCourse
}) => {
  const { user, setActiveTab, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>([]);
  const [recommendations, setRecommendations] = useState<IGOTCourse[]>([]);
  const [programmes, setProgrammes] = useState<NSSTATrainingProgramme[]>([]);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [enrollSuccessMsg, setEnrollSuccessMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [gapRes, recRes, progRes, lpRes, qzRes] = await Promise.all([
        api.getMySkillGaps(),
        api.getRecommendations(),
        api.getNSSTAProgrammes(),
        api.getLearningPath(),
        api.getQuizList()
      ]);
      setSkillGaps(gapRes.top5);
      setRecommendations(recRes.recommendations.slice(0, 4));
      setProgrammes(progRes.programmes.slice(0, 2));
      setLearningPath(lpRes.learningPath);
      setQuizzes(qzRes.quizzes.slice(0, 3));
    } catch (err) {
      console.error("Error loading dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    try {
      const res = await api.enrollCourse(courseId);
      setEnrollSuccessMsg(`Enrolled in ${res.course.title}! Added to your learning path.`);
      await refreshUser();
      setTimeout(() => setEnrollSuccessMsg(null), 4000);
    } catch (err) {
      console.error("Enrollment failed", err);
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading || !user) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 font-medium">Loading Statistical Officer Intelligence Portfolio...</p>
      </div>
    );
  }

  const primaryGap = skillGaps[0];

  return (
    <div className="space-y-6">
      {/* Officer Identity & Status Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-[#0B2545] to-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-white">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-mono font-bold px-2 py-0.5 rounded">
                {user.employeeId}
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <FileCheck2 className="w-3 h-3" />
                <span>Verified Officer</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {user.designation} • {user.department}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-1.5">
              <span>Cadre: <strong>Indian Statistical Service (ISS)</strong></span>
              <span>•</span>
              <span>Cadre Seniority: <strong>Level 10 (7th CPC)</strong></span>
            </div>
          </div>
        </div>

        {/* Learning Streak & Quick Score */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          <div className="bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <div>
              <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Learning Streak</div>
              <div className="text-sm font-black text-amber-900">14 Days</div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-lg text-right">
            <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Overall Competency</div>
            <div className="text-lg font-black text-blue-900 leading-none mt-0.5">
              {user.overallCompetency}%
            </div>
          </div>
        </div>
      </div>

      {/* Enroll notification toast */}
      {enrollSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{enrollSuccessMsg}</span>
        </div>
      )}

      {/* Priority Skill-Gap Action Alert Banner */}
      {primaryGap && (
        <div className="rounded-xl bg-gradient-to-r from-red-900 via-rose-900 to-slate-900 text-white p-5 shadow-sm border border-red-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-red-800/80 rounded-lg border border-red-700 shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-red-700/80 text-amber-300 px-2 py-0.5 rounded">
                  Top Priority Skill Gap
                </span>
                <span className="text-xs text-red-200">Deficit: {primaryGap.gapPoints} Points</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">{primaryGap.competencyName}</h3>
              <p className="text-xs text-slate-200 mt-0.5 max-w-xl leading-relaxed">
                Your current proficiency is {primaryGap.currentScore}%, while your job role as {user.designation} requires a target of {primaryGap.targetScore}%.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onStartQuiz("quiz-na-01")}
              className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Take Diagnostic Quiz (+8 pts)</span>
            </button>
            <button
              onClick={() => setActiveTab("igot-courses")}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition-colors"
            >
              View Modules
            </button>
          </div>
        </div>
      )}

      {/* Core Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overall Competency</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{user.overallCompetency}%</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+6% this quarter</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">High-Priority Gaps</span>
            <div className="text-2xl font-black text-red-600 mt-1">{skillGaps.length}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              Ranked by urgency
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed iGOT Hours</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">{user.completedHours} hrs</div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              Target: 50 hrs / year
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quizzes Completed</span>
            <div className="text-2xl font-black text-purple-700 mt-1">{user.quizzesCompleted}</div>
            <div className="text-[11px] text-purple-600 font-semibold mt-0.5">
              Verified by Gemini
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Learning Path Progress (Left) & Priority Skill Gaps (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col (2 spans): Active Learning Path & Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Personalized Learning Path Tracker */}
          {learningPath && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                    AI Curated Pathway
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{learningPath.title}</h3>
                </div>
                <button
                  onClick={() => setActiveTab("learning-path")}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                >
                  <span>Detailed Path</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-600">
                    Progress: {learningPath.phases.filter((p) => p.status === "completed").length} of {learningPath.phases.length} Phases Completed
                  </span>
                  <span className="font-bold text-blue-700">{learningPath.progressPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${learningPath.progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Phase Preview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {learningPath.phases.slice(0, 3).map((phase) => (
                  <div
                    key={phase.phaseNumber}
                    className={`p-3 rounded-lg border text-xs ${
                      phase.status === "completed"
                        ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                        : phase.status === "in_progress"
                        ? "bg-blue-50/60 border-blue-300 text-blue-950 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 opacity-80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold uppercase">
                        Phase {phase.phaseNumber}
                      </span>
                      {phase.status === "completed" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : phase.status === "in_progress" ? (
                        <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">
                          Active
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400">Locked</span>
                      )}
                    </div>
                    <div className="font-bold text-xs truncate">{phase.title}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{phase.estimatedDuration}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended iGOT Karmayogi Curricula */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Targeted Skill Remediation
                </div>
                <h3 className="font-bold text-base text-slate-900">Recommended iGOT Courses</h3>
              </div>
              <button
                onClick={() => setActiveTab("igot-courses")}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
              >
                <span>View All Catalogue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {recommendations.map((course) => (
                <div
                  key={course.courseId}
                  className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                        {course.relevanceScore}% Gap Match
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                        {course.difficulty}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {course.duration}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 truncate">{course.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{course.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => onSelectCourse(course.courseId)}
                      className="px-2.5 py-1.5 rounded text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleEnroll(course.courseId)}
                      disabled={enrollingId === course.courseId}
                      className="px-3 py-1.5 rounded text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {enrollingId === course.courseId ? (
                        <span className="animate-pulse">Enrolling...</span>
                      ) : (
                        <>
                          <span>Enroll</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col (1 span): Priority Skill Gaps & Available Quizzes */}
        <div className="space-y-6">
          {/* Top Priority Skill Gaps Ranked List */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Ranked Skill Gaps</h3>
                <p className="text-[11px] text-slate-500">Deficits vs Official Target</p>
              </div>
              <button
                onClick={() => setActiveTab("skill-gaps")}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900"
              >
                Radar View
              </button>
            </div>

            <div className="space-y-3">
              {skillGaps.map((item, idx) => (
                <div key={item.competencyId} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span className="truncate pr-2">{item.competencyName}</span>
                    <span className="text-red-600 font-mono text-[11px] shrink-0 font-bold">
                      -{item.gapPoints} pts
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Score: <strong>{item.currentScore}%</strong></span>
                    <span>Target: <strong>{item.targetScore}%</strong></span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${(item.currentScore / item.targetScore) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Quizzes to Boost Competency */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Active Quizzes</h3>
                <p className="text-[11px] text-slate-500">Official Diagnostic Assessments</p>
              </div>
              <button
                onClick={() => setActiveTab("quiz-generator")}
                className="text-xs font-semibold text-purple-700 hover:text-purple-900"
              >
                AI Generator
              </button>
            </div>

            <div className="space-y-2.5">
              {quizzes.map((qz) => (
                <div
                  key={qz.id}
                  className="p-3 rounded-lg border border-purple-100 bg-purple-50/30 hover:bg-purple-50/60 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{qz.title}</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">
                      +{qz.competencyBoostPotential} pts
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{qz.competency}</p>
                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-purple-100/60">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {qz.questionCount} Questions • {qz.timeLimitMinutes}m
                    </span>
                    <button
                      onClick={() => onStartQuiz(qz.id)}
                      className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>Take Quiz</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming NSSTA Residential Training */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-700" />
                <span>NSSTA Greater Noida</span>
              </h3>
              <button
                onClick={() => setActiveTab("nssta-training")}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900"
              >
                All TPAC
              </button>
            </div>
            {programmes.map((p) => (
              <div key={p.id} className="p-2.5 rounded-lg bg-blue-50/40 border border-blue-100 mb-2 last:mb-0">
                <span className="text-[10px] font-mono text-blue-700 font-bold uppercase">{p.code}</span>
                <h4 className="font-bold text-xs text-slate-900 mt-0.5">{p.programmeName}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>{p.duration}</span>
                  <span className="text-emerald-700 font-semibold">{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
