import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { IGOTCourse } from "../types";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  Layers,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
  ShieldCheck,
  X
} from "lucide-react";

interface IGOTCoursesPageProps {
  initialSelectedId?: string | null;
  onStartQuiz: (quizId: string) => void;
}

export const IGOTCoursesPage: React.FC<IGOTCoursesPageProps> = ({
  initialSelectedId,
  onStartQuiz
}) => {
  const { user, refreshUser } = useAuth();
  const [courses, setCourses] = useState<IGOTCourse[]>([]);
  const [recommendations, setRecommendations] = useState<IGOTCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<IGOTCourse | null>(null);
  const [tab, setTab] = useState<"recommended" | "all">("recommended");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [igotStatus, setIgotStatus] = useState<any>(null);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [progressVal, setProgressVal] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [courseRes, recRes, statusRes] = await Promise.all([
        api.getCourses(),
        api.getRecommendations(),
        api.getIGOTStatus()
      ]);
      setCourses(courseRes.courses);
      setRecommendations(recRes.recommendations);
      setIgotStatus(statusRes);

      if (initialSelectedId) {
        const found = courseRes.courses.find((c) => c.courseId === initialSelectedId);
        if (found) {
          setSelectedCourse(found);
          setProgressVal(found.progressPercent || 0);
        }
      }
    } catch (err) {
      console.error("Error loading iGOT courses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [initialSelectedId]);

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    try {
      const res = await api.enrollCourse(courseId);
      setToastMsg(`Successfully enrolled in "${res.course.title}"! Added to active learning trajectory.`);
      await refreshUser();
      await fetchData();
      if (selectedCourse?.courseId === courseId) {
        setSelectedCourse(res.course);
      }
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err) {
      console.error("Enrollment failed", err);
    } finally {
      setEnrollingId(null);
    }
  };

  const handleUpdateProgress = async (courseId: string, newProgress: number) => {
    try {
      const res = await api.updateCourseProgress(courseId, newProgress, 2);
      setSelectedCourse(res.course);
      setToastMsg(`Progress recorded: ${newProgress}%! User hours updated.`);
      await refreshUser();
      await fetchData();
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err) {
      console.error("Update progress failed", err);
    }
  };

  const displayedCourses = (tab === "recommended" ? recommendations : courses).filter((c) => {
    if (selectedDomain !== "all" && c.domain !== selectedDomain) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.competency.toLowerCase().includes(q) ||
        c.provider.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title & Architecture Indicator */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Mission Karmayogi Bharat Ecosystem</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">iGOT Karmayogi Curricula & Adapter</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Standardized training modules curated by NSSTA, ISTM, NIC, and IIPA. Automatically matched to the officer's
            competency deficits through the SkillForge AI recommendation engine.
          </p>
        </div>

        {/* Integration Status Badge */}
        {igotStatus && (
          <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-lg text-left text-xs max-w-xs shrink-0">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{igotStatus.serviceInterface}</span>
            </div>
            <div className="text-[11px] text-emerald-800 mt-0.5 font-mono">
              Status: <span className="font-bold">{igotStatus.mode}</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 truncate" title={igotStatus.targetApiEndpoint}>
              Target: {igotStatus.targetApiEndpoint}
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Tab Switcher & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab("recommended")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              tab === "recommended"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Recommended for My Gaps ({recommendations.length})</span>
          </button>
          <button
            onClick={() => setTab("all")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              tab === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Courses ({courses.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search iGOT modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-slate-300 bg-white text-slate-700"
          >
            <option value="all">All Domains</option>
            <option value="statistical">Statistical</option>
            <option value="technical">Technical</option>
            <option value="governance">Digital Governance</option>
            <option value="behavioural">Behavioural</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400 font-medium">Fetching iGOT Karmayogi catalog...</div>
      ) : displayedCourses.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-semibold text-slate-700">No courses match your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedCourses.map((course) => (
            <div
              key={course.courseId}
              className="bg-white rounded-xl border border-slate-200 hover:border-emerald-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                    {course.relevanceScore}% Gap Match
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{course.difficulty}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Provider:</span>
                    <span className="font-semibold text-slate-800">{course.provider}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Competency:</span>
                    <span className="font-semibold text-blue-700 truncate">{course.competency}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Duration:</span>
                    <span className="font-mono text-slate-700">{course.duration}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedCourse(course);
                    setProgressVal(course.progressPercent || 0);
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  View Details
                </button>

                {course.enrolled ? (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Enrolled ({course.progressPercent || 0}%)</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleEnroll(course.courseId)}
                    disabled={enrollingId === course.courseId}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {enrollingId === course.courseId ? (
                      <span>Enrolling...</span>
                    ) : (
                      <>
                        <span>Enroll Now</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                    {selectedCourse.relevanceScore}% Gap Match
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded uppercase font-semibold">
                    {selectedCourse.provider}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-2">{selectedCourse.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Duration: {selectedCourse.duration} • Difficulty: {selectedCourse.difficulty}
                </p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Module Summary
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {selectedCourse.description}
                </p>
              </div>

              {/* Modules List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Curriculum Modules ({selectedCourse.modules.length})
                </h4>
                <div className="space-y-2">
                  {selectedCourse.modules.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 text-[10px]">0{idx + 1}</span>
                        <span className="font-medium text-slate-800">{m.title}</span>
                      </div>
                      <span className="text-slate-500 font-mono text-[11px]">{m.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* If enrolled: progress slider simulator */}
              {selectedCourse.enrolled && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span>Simulate Officer Course Progress</span>
                    <span>{progressVal}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={progressVal}
                    onChange={(e) => setProgressVal(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700">
                      Slide to simulate module completions & test automatic score updates
                    </span>
                    <button
                      onClick={() => handleUpdateProgress(selectedCourse.courseId, progressVal)}
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold cursor-pointer"
                    >
                      Save Progress
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedCourse(null);
                    onStartQuiz("quiz-na-01");
                  }}
                  className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Take Module Quiz</span>
                </button>

                {!selectedCourse.enrolled && (
                  <button
                    onClick={() => handleEnroll(selectedCourse.courseId)}
                    disabled={enrollingId === selectedCourse.courseId}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Enroll on iGOT</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
