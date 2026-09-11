import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { LearningPath, LearningPhase, LearningPathItem } from "../types";
import {
  Compass,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  ArrowRight,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from "lucide-react";

interface LearningPathPageProps {
  onStartQuiz: (quizId: string) => void;
  onSelectCourse: (courseId: string) => void;
}

export const LearningPathPage: React.FC<LearningPathPageProps> = ({
  onStartQuiz,
  onSelectCourse
}) => {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
    5: false
  });

  useEffect(() => {
    setLoading(true);
    api
      .getLearningPath()
      .then((res) => setLearningPath(res.learningPath))
      .catch((err) => console.error("Error loading learning path", err))
      .finally(() => setLoading(false));
  }, []);

  const togglePhase = (num: number) => {
    setExpandedPhases((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  if (loading || !learningPath) {
    return (
      <div className="py-20 text-center text-xs text-slate-400 font-medium">
        Synthesizing personalized learning trajectory...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>AI-Synthesized Cadre Pathway</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">{learningPath.title}</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {learningPath.description} Generated specifically for Indian Statistical Service Senior Statistical Officers.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-lg text-center">
            <div className="text-[10px] uppercase font-bold text-indigo-800 tracking-wider">Overall Trajectory</div>
            <div className="text-2xl font-black text-indigo-900">{learningPath.progressPercent}%</div>
          </div>
        </div>
      </div>

      {/* Trajectory Progress Bar Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
          <span>Current Position: Phase 2 of 5 (National Accounts GVA & Macroeconomic Synthesis)</span>
          <span className="text-indigo-600 font-bold">{learningPath.progressPercent}% Complete</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${learningPath.progressPercent}%` }}
          ></div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
          <span>Target Completion: Q3 2026</span>
          <span className="font-semibold text-slate-700">Estimated Effort: 62 Learning Hours</span>
        </div>
      </div>

      {/* Detailed Phases Accordion */}
      <div className="space-y-4">
        {learningPath.phases.map((phase) => {
          const isExpanded = !!expandedPhases[phase.phaseNumber];
          const isDone = phase.status === "completed";
          const isActive = phase.status === "in_progress";

          return (
            <div
              key={phase.phaseNumber}
              className={`rounded-xl border transition-all overflow-hidden bg-white shadow-xs ${
                isActive
                  ? "border-blue-300 ring-2 ring-blue-500/10"
                  : isDone
                  ? "border-emerald-200"
                  : "border-slate-200"
              }`}
            >
              {/* Phase Header */}
              <div
                onClick={() => togglePhase(phase.phaseNumber)}
                className={`p-4 sm:p-5 flex items-center justify-between cursor-pointer transition-colors ${
                  isActive ? "bg-blue-50/40" : isDone ? "bg-emerald-50/20" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${
                      isDone
                        ? "bg-emerald-600 text-white"
                        : isActive
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : `P${phase.phaseNumber}`}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Phase {phase.phaseNumber}
                      </span>
                      {isActive && (
                        <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.2 rounded">
                          Current Focus
                        </span>
                      )}
                      {isDone && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded">
                          Completed
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-0.5">{phase.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{phase.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-xs text-slate-500 font-medium">
                    {phase.estimatedDuration}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Phase Milestones & Items */}
              {isExpanded && (
                <div className="p-4 sm:p-5 border-t border-slate-100 space-y-3 bg-white">
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{phase.description}</p>

                  <div className="space-y-2.5">
                    {phase.items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          item.completed
                            ? "bg-slate-50 border-slate-200 text-slate-600"
                            : "bg-white border-blue-100 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5">
                            {item.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0"></div>
                            )}
                          </div>
                          <div>
                            <span
                              className={`font-semibold ${
                                item.completed ? "line-through text-slate-400" : "text-slate-900"
                              }`}
                            >
                              {item.title}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                              <span className="capitalize">{item.type.replace("_", " ")}</span>
                              <span>•</span>
                              <span>{item.duration}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          {item.type === "igot_course" && item.courseId && (
                            <button
                              onClick={() => onSelectCourse(item.courseId!)}
                              className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <BookOpen className="w-3 h-3 text-emerald-600" />
                              <span>iGOT Module</span>
                            </button>
                          )}
                          {item.type === "quiz" && (
                            <button
                              onClick={() => onStartQuiz(item.quizId || "quiz-na-01")}
                              className="px-2.5 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3 text-purple-600" />
                              <span>Take Quiz</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
