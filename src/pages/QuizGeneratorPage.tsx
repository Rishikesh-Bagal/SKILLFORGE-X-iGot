import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { LearningMaterial, Quiz } from "../types";
import { useAuth } from "../context/AuthContext";
import {
  Sparkles,
  FileUp,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  FileText,
  Sliders,
  Cpu,
  Layers
} from "lucide-react";

interface QuizGeneratorPageProps {
  onStartQuiz: (quizId: string) => void;
}

export const QuizGeneratorPage: React.FC<QuizGeneratorPageProps> = ({ onStartQuiz }) => {
  const { role } = useAuth();
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("mat-na-01");
  const [customText, setCustomText] = useState("");
  const [useCustomText, setUseCustomText] = useState(false);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [questionType, setQuestionType] = useState<string>("scenario-based");
  const [loading, setLoading] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // File upload simulation
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);

  useEffect(() => {
    api.getMaterials().then((res) => {
      setMaterials(res.materials);
      if (res.materials.length > 0) {
        setSelectedMaterialId(res.materials[0].id);
      }
    });
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFileName(file.name);
      setUseCustomText(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCustomText(text || "Sample content from uploaded document...");
      };
      reader.readAsText(file);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);
    setGeneratedQuiz(null);

    try {
      const selectedMat = materials.find((m) => m.id === selectedMaterialId);
      const payload: any = {
        questionCount,
        difficulty,
        questionType
      };

      if (useCustomText && customText.trim()) {
        payload.materialText = customText;
        payload.title = uploadFileName ? `Assessment: ${uploadFileName}` : "AI Assessment from Uploaded Text";
        payload.competency = "Official Statistical Methodology";
        payload.domain = "statistical";
      } else {
        payload.materialId = selectedMaterialId;
        payload.title = `AI Assessment: ${selectedMat?.title || "Curriculum Document"}`;
        payload.competency = selectedMat?.associatedCompetency || "Statistical Methodology";
        payload.domain = selectedMat?.associatedDomain || "statistical";
      }

      const res = await api.generateAIQuiz(payload);
      setGeneratedQuiz(res.quiz);
    } catch (err: any) {
      console.error("AI quiz generation error", err);
      setErrorMsg(err.message || "Failed to generate AI quiz from material");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Server-Side Gemini 3.8 Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">AI Material-to-MCQ Generator</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Upload official MoSPI guidelines, research monographs, or NSSTA training handbooks. SkillForge AI reads
            subtle nuances and synthesizes 4-option scenario MCQs with official references and automated competency
            scoring.
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg text-left text-xs shrink-0 max-w-xs">
          <div className="font-bold text-purple-900 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-purple-600" />
            <span>Zero-Hallucination Engine</span>
          </div>
          <p className="text-[11px] text-purple-800 mt-0.5">
            Strictly grounded on input document corpus. Generates detailed explanations for every option.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-300 text-red-800 rounded-lg text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form: Input Material & Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Document Selection & Text */}
        <div className="lg:col-span-2 space-y-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">Source Learning Material</h3>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setUseCustomText(false)}
                className={`px-3 py-1 rounded font-semibold transition-colors ${
                  !useCustomText ? "bg-purple-100 text-purple-900" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Pre-Loaded Handbooks
              </button>
              <button
                type="button"
                onClick={() => setUseCustomText(true)}
                className={`px-3 py-1 rounded font-semibold transition-colors ${
                  useCustomText ? "bg-purple-100 text-purple-900" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Upload / Paste Custom Text
              </button>
            </div>
          </div>

          {!useCustomText ? (
            /* Pre-loaded handbooks selection */
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 block">
                Select Official MoSPI / NSSTA Document:
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {materials.map((mat) => (
                  <div
                    key={mat.id}
                    onClick={() => setSelectedMaterialId(mat.id)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      selectedMaterialId === mat.id
                        ? "border-purple-500 bg-purple-50/50 shadow-xs ring-1 ring-purple-500/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-md border border-slate-200 text-purple-700 shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{mat.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {mat.filename} • Competency: {mat.associatedCompetency}
                        </p>
                      </div>
                    </div>
                    {selectedMaterialId === mat.id && (
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Upload or Paste Document */
            <div className="space-y-3">
              {/* Drag and drop box */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors bg-slate-50">
                <FileUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">
                  {uploadFileName ? uploadFileName : "Click or drag files here to upload"}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Supports official training handbooks (.txt, .pdf, .docx, .pptx)
                </p>
                <input
                  type="file"
                  accept=".txt,.pdf,.docx,.doc"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload-input"
                />
                <label
                  htmlFor="file-upload-input"
                  className="mt-3 inline-block px-4 py-1.5 rounded-md bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-xs"
                >
                  Browse Document
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Or paste text excerpt directly:
                </label>
                <textarea
                  rows={6}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Paste section from NSS Report, National Accounts Guidelines, or Statistical Legislation..."
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:border-purple-500 font-mono"
                ></textarea>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: MCQ Configuration Controls */}
        <div className="space-y-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-600" />
                <span>MCQ Generation Controls</span>
              </h3>
              <p className="text-xs text-slate-500">Fine-tune difficulty & assessment goals</p>
            </div>

            {/* Question Count */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Question Count</label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                      questionCount === cnt
                        ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {cnt} MCQs
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="easy">Foundational / Conceptual (Easy)</option>
                <option value="medium">Standard ISS Cadre Level (Medium)</option>
                <option value="hard">Advanced Operational Synthesis (Hard)</option>
                <option value="mixed">Adaptive Mixed Distribution</option>
              </select>
            </div>

            {/* Question Type */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Question Archetype</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="scenario-based">Scenario / Case-Study Based (Recommended)</option>
                <option value="conceptual">Methodological & Formulas</option>
                <option value="factual">Factual & Statutory Definitions</option>
                <option value="application">Field Application & Data Cleaning</option>
              </select>
            </div>

            <div className="p-3 bg-purple-50/60 rounded-lg border border-purple-100 text-[11px] text-purple-900 leading-relaxed">
              <strong>Assessment Potential:</strong> Passing will yield an estimated{" "}
              <strong>+{questionCount * 1.5} points</strong> competency score uplift.
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Gemini Extracting Nuances...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Official MCQs</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Quiz Result Preview Card */}
      {generatedQuiz && (
        <div className="bg-white rounded-xl border-2 border-purple-400 p-6 shadow-md animate-in fade-in space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                AI Quiz Generated Successfully
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{generatedQuiz.title}</h3>
              <p className="text-xs text-slate-500">
                {generatedQuiz.questionCount} Questions • Time Limit: {generatedQuiz.timeLimitMinutes} minutes •
                Competency: {generatedQuiz.competency}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onStartQuiz(generatedQuiz.id)}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>Take Quiz Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Question List Preview */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Generated Questions Preview
            </h4>
            {generatedQuiz.questions.map((q, qIndex) => (
              <div key={q.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-slate-900">
                    Q{qIndex + 1}: {q.questionText}
                  </span>
                  <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono shrink-0">
                    {q.marks} Mark
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {q.options.map((opt, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-2 rounded border text-[11px] ${
                        optIndex === q.correctOptionIndex
                          ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold"
                          : "bg-white border-slate-200 text-slate-600"
                      }`}
                    >
                      <span className="font-mono text-slate-400 mr-1.5">{String.fromCharCode(65 + optIndex)}.</span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-100 mt-1">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
