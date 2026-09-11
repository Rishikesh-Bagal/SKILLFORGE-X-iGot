import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { LearningMaterial, Quiz } from "../types";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  FileUp,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Edit,
  Save,
  Trash2,
  Plus,
  ArrowRight,
  Layers,
  AlertCircle
} from "lucide-react";

interface TrainerDashboardProps {
  onStartQuiz: (quizId: string) => void;
}

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({ onStartQuiz }) => {
  const { setActiveTab } = useAuth();
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editExplanation, setEditExplanation] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Material form
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDomain, setNewDomain] = useState("statistical");
  const [newCompetency, setNewCompetency] = useState("National Accounts & GVA Estimation");
  const [textContent, setTextContent] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, qRes] = await Promise.all([api.getMaterials(), api.getQuizList()]);
      setMaterials(mRes.materials);
      setQuizzes(qRes.quizzes);
      if (qRes.quizzes.length > 0) {
        setSelectedQuiz(qRes.quizzes[0]);
      }
    } catch (err) {
      console.error("Error loading trainer data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !textContent.trim()) return;

    try {
      const res = await api.uploadMaterial({
        title: newTitle,
        filename: `${newTitle.toLowerCase().replace(/\s+/g, "_")}.txt`,
        fileType: "text/plain",
        textContent,
        associatedDomain: newDomain,
        associatedCompetency: newCompetency
      });
      setShowUploadModal(false);
      setToastMsg(`Material "${newTitle}" uploaded! You can now generate AI MCQs.`);
      await fetchData();
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleSaveQuestionEdit = async (quizId: string, question: any) => {
    try {
      await api.updateQuizQuestion(quizId, {
        ...question,
        explanation: editExplanation || question.explanation
      });
      setEditingQuestionId(null);
      setToastMsg("Question updated in official repository!");
      await fetchData();
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err) {
      console.error("Failed to update question", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            <span>NSSTA Faculty & Content Curator Studio</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Curriculum & Assessment Management</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Upload official courseware, review and approve AI-synthesized MCQs, and monitor learner comprehension
            telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <FileUp className="w-4 h-4" />
            <span>Upload Courseware Material</span>
          </button>
          <button
            onClick={() => setActiveTab("quiz-generator")}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch AI MCQ Generator</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Grid: Uploaded Materials (Left) & Active Quizzes Review (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1: Uploaded Official Training Materials */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Official Materials ({materials.length})</h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
              MoSPI Corpus
            </span>
          </div>

          <div className="space-y-3">
            {materials.map((m) => (
              <div key={m.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-slate-900">{m.title}</h4>
                  <span className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-500">
                    {m.fileType.split("/")[1] || "text"}
                  </span>
                </div>
                <p className="text-[11px] text-blue-700 font-medium">Competency: {m.associatedCompetency}</p>
                <div className="text-[11px] text-slate-500 line-clamp-2 mt-1">{m.textContent}</div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {m.uploadedAt ? new Date(m.uploadedAt).toLocaleDateString() : "Recent"}
                  </span>
                  <button
                    onClick={() => setActiveTab("quiz-generator")}
                    className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Generate MCQs</span>
                    <Sparkles className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2 & 3: Quiz Review & Editor */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Official Quiz Bank & Question Validation</h3>
              <p className="text-xs text-slate-500">Inspect, edit options, and verify citations before publishing</p>
            </div>

            {/* Quiz Selector */}
            <select
              value={selectedQuiz?.id || ""}
              onChange={(e) => {
                const q = quizzes.find((item) => item.id === e.target.value);
                if (q) setSelectedQuiz(q);
              }}
              className="text-xs p-2 rounded-lg border border-slate-300 bg-white"
            >
              {quizzes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title} ({q.questionCount} Qs)
                </option>
              ))}
            </select>
          </div>

          {selectedQuiz ? (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-purple-900">{selectedQuiz.title}</span>
                  <span className="text-purple-700 ml-2">({selectedQuiz.competency})</span>
                </div>
                <button
                  onClick={() => onStartQuiz(selectedQuiz.id)}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold text-xs cursor-pointer"
                >
                  Test Assessment as Learner
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {selectedQuiz.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        Q{idx + 1}: {q.questionText}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                        {q.marks} Mark
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded border ${
                            oIdx === q.correctOptionIndex
                              ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold"
                              : "bg-slate-50 border-slate-200 text-slate-700"
                          }`}
                        >
                          <span className="font-mono text-slate-400 mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>

                    {/* Explanation / Citation edit */}
                    {editingQuestionId === q.id ? (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <label className="text-[11px] font-bold text-slate-700 block">
                          Edit Official Citation & Explanation:
                        </label>
                        <textarea
                          rows={3}
                          value={editExplanation}
                          onChange={(e) => setEditExplanation(e.target.value)}
                          className="w-full text-xs p-2 rounded border border-slate-300 font-sans"
                        ></textarea>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingQuestionId(null)}
                            className="px-2.5 py-1 text-xs text-slate-600"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveQuestionEdit(selectedQuiz.id, q)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold"
                          >
                            Save Explanation
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between gap-2">
                        <div className="text-[11px] text-slate-600 leading-relaxed">
                          <strong>Official Reference:</strong> {q.explanation}
                        </div>
                        <button
                          onClick={() => {
                            setEditingQuestionId(q.id);
                            setEditExplanation(q.explanation);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 shrink-0 font-medium flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">No quiz selected</div>
          )}
        </div>
      </div>

      {/* Upload Material Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">Upload Official Courseware</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadMaterial} className="p-5 space-y-3.5 overflow-y-auto">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. System of National Accounts 2008 Operational Guide"
                  className="w-full text-xs p-2 rounded border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Domain</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                  >
                    <option value="statistical">Statistical</option>
                    <option value="technical">Technical</option>
                    <option value="governance">Digital Governance</option>
                    <option value="behavioural">Behavioural</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Target Competency</label>
                  <input
                    type="text"
                    required
                    value={newCompetency}
                    onChange={(e) => setNewCompetency(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Courseware Text Content</label>
                <textarea
                  rows={8}
                  required
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Paste curriculum content or training module text..."
                  className="w-full text-xs p-2.5 rounded border border-slate-300 font-mono"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Save Material to Corpus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
