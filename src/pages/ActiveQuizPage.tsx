import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { Quiz, QuizAttempt, EvaluatedAnswer, Competency, UserProfile } from "../types";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  BookOpen,
  Check
} from "lucide-react";

interface ActiveQuizPageProps {
  quizId: string;
  onExit: () => void;
  onGoToRadar: () => void;
  onSelectCourse: (courseId: string) => void;
}

export const ActiveQuizPage: React.FC<ActiveQuizPageProps> = ({
  quizId,
  onExit,
  onGoToRadar,
  onSelectCourse
}) => {
  const { refreshUser } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes default
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Result state
  const [attemptResult, setAttemptResult] = useState<{
    attempt: QuizAttempt;
    evaluatedAnswers: EvaluatedAnswer[];
    competency: Competency;
    user: UserProfile;
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .getQuizById(quizId)
      .then((res) => {
        setQuiz(res.quiz);
        setTimeLeft(res.quiz.timeLimitMinutes * 60);
      })
      .catch((err) => console.error("Error loading quiz", err))
      .finally(() => setLoading(false));
  }, [quizId]);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || loading || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, loading, timeLeft]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting || isSubmitted || !quiz) return;
    setIsSubmitting(true);
    try {
      const timeTaken = quiz.timeLimitMinutes * 60 - timeLeft;
      const res = await api.submitQuiz({
        quizId: quiz.id,
        answers: selectedAnswers,
        timeTakenSeconds: Math.max(15, timeTaken)
      });
      setAttemptResult(res);
      setIsSubmitted(true);
      await refreshUser();

      // Trigger celebration confetti if passed
      if (res.attempt.passed) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !quiz) {
    return (
      <div className="py-20 text-center text-xs text-slate-400 font-medium">
        Loading official diagnostic assessment...
      </div>
    );
  }

  const currentQ = quiz.questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Top Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
            Diagnostic Assessment
          </span>
          <h2 className="text-base font-bold text-slate-900 mt-0.5">{quiz.title}</h2>
          <span className="text-xs text-slate-500 font-medium">Competency: {quiz.competency}</span>
        </div>

        {!isSubmitted ? (
          <div className="flex items-center gap-3">
            {/* Countdown timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono font-bold text-xs ${
              timeLeft < 120 ? "bg-red-50 text-red-700 border-red-200 animate-pulse" : "bg-slate-50 text-slate-700 border-slate-200"
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
            </div>

            <button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <span>{isSubmitting ? "Evaluating..." : "Submit Assessment"}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onExit}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
          >
            Return to Dashboard
          </button>
        )}
      </div>

      {/* If Not Submitted: Question Taking View */}
      {!isSubmitted ? (
        <div className="space-y-6">
          {/* Progress Strip & Jump Palette */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {quiz.questions.map((q, idx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-8 h-8 rounded-lg font-bold text-xs shrink-0 transition-all ${
                      isCurrent
                        ? "bg-purple-600 text-white shadow-xs"
                        : isAnswered
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-slate-500 font-medium shrink-0">
              Answered: <strong>{answeredCount}</strong> / {quiz.questions.length}
            </div>
          </div>

          {/* Current Question Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider font-mono">
                Question {currentIndex + 1} of {quiz.questions.length}
              </span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                {currentQ.marks} Mark
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQ.questionText}
            </h3>

            {/* Radio Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === optIdx;
                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "border-purple-600 bg-purple-50/60 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? "border-purple-600 bg-purple-600 text-white"
                            : "border-slate-300 text-slate-500"
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-slate-800">{opt}</span>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-purple-600 shrink-0" />}
                  </div>
                );
              })}
            </div>

            {/* Navigation buttons: Prev / Next */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-30 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {currentIndex < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Finish & Submit</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Evaluation & Rescoring Screen */
        attemptResult && (
          <div className="space-y-6 animate-in fade-in">
            {/* Score & Competency Boost Hero */}
            <div
              className={`rounded-2xl p-6 sm:p-8 text-white shadow-lg border ${
                attemptResult.attempt.passed
                  ? "bg-gradient-to-br from-emerald-900 via-teal-900 to-[#0B2545] border-emerald-700"
                  : "bg-gradient-to-br from-amber-900 via-slate-900 to-[#0B2545] border-amber-700"
              }`}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-amber-300 border border-white/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Evaluation Completed</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black">
                    {attemptResult.attempt.passed ? "Diagnostic Assessment Passed!" : "Assessment Complete"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
                    Score: <strong>{attemptResult.attempt.score} / {attemptResult.attempt.totalQuestions} ({attemptResult.attempt.percentage}%)</strong>
                  </p>
                </div>

                {/* Big Boost Badge */}
                {attemptResult.attempt.competencyBoosted && (
                  <div className="bg-white/10 border-2 border-amber-300/40 p-4 rounded-xl text-center backdrop-blur-xs shrink-0 animate-bounce">
                    <Award className="w-8 h-8 text-amber-300 mx-auto mb-1" />
                    <div className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                      Competency Rescored
                    </div>
                    <div className="text-2xl font-black text-white mt-0.5">
                      +{attemptResult.attempt.competencyDelta} Points
                    </div>
                    <div className="text-[11px] text-emerald-300 font-semibold mt-1">
                      {attemptResult.competency.name}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons after submission */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <button
                onClick={onGoToRadar}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Updated Skill-Gap Radar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onSelectCourse("igot-na-001")}
                className="px-4 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span>Continue Mapped iGOT Course</span>
              </button>

              <button
                onClick={onExit}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Exit Assessment
              </button>
            </div>

            {/* Weak Areas Identified */}
            {attemptResult.attempt.weakAreas && attemptResult.attempt.weakAreas.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Identified Knowledge Gaps for Targeted Review</span>
                </h4>
                <div className="space-y-1 text-xs text-amber-900">
                  {attemptResult.attempt.weakAreas.map((w, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span>•</span>
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Questions Review */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Item-by-Item Methodological Review</h4>
              {attemptResult.evaluatedAnswers.map((ea, idx) => (
                <div
                  key={ea.questionId}
                  className={`p-5 rounded-xl border bg-white shadow-xs space-y-3 ${
                    ea.isCorrect ? "border-emerald-200" : "border-red-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-bold text-xs text-slate-900">
                      Q{idx + 1}: {ea.questionText}
                    </span>
                    {ea.isCorrect ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className={`p-2.5 rounded-lg border ${
                      ea.isCorrect ? "bg-emerald-50/60 border-emerald-200 text-emerald-950" : "bg-red-50/60 border-red-200 text-red-950"
                    }`}>
                      <div className="text-[10px] font-bold uppercase text-slate-400">Your Answer</div>
                      <div className="font-semibold mt-0.5">{ea.selectedOptionText}</div>
                    </div>

                    {!ea.isCorrect && (
                      <div className="p-2.5 rounded-lg border bg-emerald-50/60 border-emerald-200 text-emerald-950">
                        <div className="text-[10px] font-bold uppercase text-emerald-800">Correct Answer</div>
                        <div className="font-semibold mt-0.5">{ea.correctOptionText}</div>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    <strong>Official Explanation & Citation:</strong> {ea.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};
