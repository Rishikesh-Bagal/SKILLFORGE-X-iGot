import React, { useState, useEffect } from "react";
import { Search, X, Award, BookOpen, GraduationCap, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Competency, IGOTCourse, Quiz, NSSTATrainingProgramme } from "../types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse?: (courseId: string) => void;
  onSelectQuiz?: (quizId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCourse,
  onSelectQuiz
}) => {
  const { setActiveTab } = useAuth();
  const [query, setQuery] = useState("");
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [courses, setCourses] = useState<IGOTCourse[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [programmes, setProgrammes] = useState<NSSTATrainingProgramme[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([
        api.getCompetencies(),
        api.getCourses(),
        api.getQuizList(),
        api.getNSSTAProgrammes()
      ])
        .then(([compRes, courseRes, quizRes, progRes]) => {
          setCompetencies(compRes.competencies);
          setCourses(courseRes.courses);
          setQuizzes(quizRes.quizzes);
          setProgrammes(progRes.programmes);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredComps = q
    ? competencies.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.domainName.toLowerCase().includes(q)
      )
    : competencies.slice(0, 4);

  const filteredCourses = q
    ? courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.competency.toLowerCase().includes(q)
      )
    : courses.slice(0, 3);

  const filteredQuizzes = q
    ? quizzes.filter(
        (qz) =>
          qz.title.toLowerCase().includes(q) ||
          qz.description.toLowerCase().includes(q) ||
          qz.competency.toLowerCase().includes(q)
      )
    : quizzes.slice(0, 2);

  const filteredProgrammes = q
    ? programmes.filter(
        (p) =>
          p.programmeName.toLowerCase().includes(q) ||
          p.competency.toLowerCase().includes(q) ||
          p.venue.toLowerCase().includes(q)
      )
    : programmes.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            type="text"
            placeholder="Search competencies, official courses, quizzes, or training programmes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-slate-400 hover:text-slate-600 p-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto flex-1 p-4 space-y-6">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">Loading official statistical repository...</div>
          ) : (
            <>
              {/* Competencies */}
              {filteredComps.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                    <span>Official Competencies</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredComps.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onClose();
                          setActiveTab("competency-profile");
                        }}
                        className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-slate-900 group-hover:text-blue-700">
                            {c.name}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                            Score: {c.currentScore}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{c.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* iGOT Courses */}
              {filteredCourses.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>iGOT Karmayogi Curricula</span>
                  </div>
                  <div className="space-y-2">
                    {filteredCourses.map((crs) => (
                      <div
                        key={crs.courseId}
                        onClick={() => {
                          onClose();
                          if (onSelectCourse) onSelectCourse(crs.courseId);
                          setActiveTab("igot-courses");
                        }}
                        className="p-2.5 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all cursor-pointer flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <h5 className="font-semibold text-xs text-slate-900 truncate">{crs.title}</h5>
                          <p className="text-[11px] text-slate-500 truncate">
                            {crs.provider} • {crs.duration} • Competency: {crs.competency}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          {crs.relevanceScore}% Match
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quizzes */}
              {filteredQuizzes.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Assessments & AI Quizzes</span>
                  </div>
                  <div className="space-y-2">
                    {filteredQuizzes.map((qz) => (
                      <div
                        key={qz.id}
                        onClick={() => {
                          onClose();
                          if (onSelectQuiz) onSelectQuiz(qz.id);
                          setActiveTab("dashboard");
                        }}
                        className="p-2.5 rounded-lg border border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <h5 className="font-semibold text-xs text-slate-900">{qz.title}</h5>
                          <p className="text-[11px] text-slate-500">
                            {qz.questionCount} Questions • {qz.timeLimitMinutes} mins • {qz.competency}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded flex items-center gap-1">
                          <span>Take</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NSSTA Training Programmes */}
              {filteredProgrammes.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                    <span>NSSTA TPAC Programmes</span>
                  </div>
                  <div className="space-y-2">
                    {filteredProgrammes.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onClose();
                          setActiveTab("nssta-training");
                        }}
                        className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <h5 className="font-semibold text-xs text-slate-900">{p.programmeName}</h5>
                          <p className="text-[11px] text-slate-500">
                            {p.code} • {p.duration} • {p.deliveryMode}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Press ESC to close or click any item to navigate</span>
          <span className="font-mono text-slate-400">MoSPI Competency Graph v2.4</span>
        </div>
      </div>
    </div>
  );
};
