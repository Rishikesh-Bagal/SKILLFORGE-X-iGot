import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { Competency, CompetencyDomain } from "../types";
import {
  Award,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  X
} from "lucide-react";

interface CompetencyProfilePageProps {
  onStartQuiz: (quizId: string) => void;
  onSelectCourse: (courseId: string) => void;
}

export const CompetencyProfilePage: React.FC<CompetencyProfilePageProps> = ({
  onStartQuiz,
  onSelectCourse
}) => {
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDomain, setActiveDomain] = useState<string>("all");
  const [filterGapOnly, setFilterGapOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComp, setSelectedComp] = useState<Competency | null>(null);

  const fetchCompetencies = async () => {
    setLoading(true);
    try {
      const res = await api.getCompetencies();
      setCompetencies(res.competencies);
    } catch (err) {
      console.error("Error fetching competencies", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetencies();
  }, []);

  const filtered = competencies.filter((c) => {
    if (activeDomain !== "all" && c.domain !== activeDomain) return false;
    if (filterGapOnly && c.currentScore >= c.targetScore) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.officialReference.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const domainCounts = {
    all: competencies.length,
    statistical: competencies.filter((c) => c.domain === "statistical").length,
    technical: competencies.filter((c) => c.domain === "technical").length,
    governance: competencies.filter((c) => c.domain === "governance").length,
    behavioural: competencies.filter((c) => c.domain === "behavioural").length
  };

  const getDomainColor = (domain: CompetencyDomain) => {
    switch (domain) {
      case "statistical":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "technical":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "governance":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "behavioural":
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Context */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-700">Official MoSPI Registry</div>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Statistical Competency Framework</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            33 standardized competencies categorized across Statistical, Technical, Digital Governance, and Behavioural
            domains with real-time gap tracking and iGOT course mapping.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-lg text-center">
            <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider">Total Benchmarks</span>
            <div className="text-xl font-black text-blue-900">{competencies.length}</div>
          </div>
          <div className="bg-red-50 border border-red-200 px-3.5 py-2 rounded-lg text-center">
            <span className="text-[10px] uppercase font-bold text-red-800 tracking-wider">Active Gaps</span>
            <div className="text-xl font-black text-red-700">
              {competencies.filter((c) => c.currentScore < c.targetScore).length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Domain Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: "all", label: "All Competencies", count: domainCounts.all },
            { id: "statistical", label: "Statistical (Domain A)", count: domainCounts.statistical },
            { id: "technical", label: "Technical (Domain B)", count: domainCounts.technical },
            { id: "governance", label: "Governance (Domain C)", count: domainCounts.governance },
            { id: "behavioural", label: "Managerial (Domain D)", count: domainCounts.behavioural }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDomain(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeDomain === tab.id
                  ? "bg-[#0B2545] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeDomain === tab.id ? "bg-blue-600 text-white" : "bg-white text-slate-500"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Gaps Only Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search competencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 whitespace-nowrap cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterGapOnly}
              onChange={(e) => setFilterGapOnly(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Deficit Gaps Only</span>
          </label>
        </div>
      </div>

      {/* Competency Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400 font-medium">Loading MoSPI framework...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          <Award className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-semibold text-slate-700">No competencies matched your filter</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting the domain filter or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((comp) => {
            const hasGap = comp.currentScore < comp.targetScore;
            const gap = comp.targetScore - comp.currentScore;
            return (
              <div
                key={comp.id}
                onClick={() => setSelectedComp(comp)}
                className={`bg-white rounded-xl border transition-all p-5 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between group ${
                  hasGap ? "border-slate-200 hover:border-red-300" : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs border ${getDomainColor(
                        comp.domain
                      )}`}
                    >
                      {comp.domainName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {comp.importance}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                    {comp.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {comp.description}
                  </p>
                </div>

                {/* Score meters */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium">Current:</span>
                      <span className="font-bold text-slate-900">{comp.currentScore}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium">Target:</span>
                      <span className="font-bold text-slate-700">{comp.targetScore}%</span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        hasGap ? "bg-amber-500" : "bg-emerald-600"
                      }`}
                      style={{ width: `${Math.min(100, comp.currentScore)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    {hasGap ? (
                      <span className="text-red-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Deficit: -{gap} pts</span>
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Proficient</span>
                      </span>
                    )}

                    <span className="text-blue-700 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      <span>Inspect</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Competency Deep Dive Modal */}
      {selectedComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getDomainColor(
                    selectedComp.domain
                  )}`}
                >
                  {selectedComp.domainName}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">{selectedComp.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official MoSPI Reference: <strong className="text-slate-700">{selectedComp.officialReference}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedComp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Scores & Delta */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Current Score</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">{selectedComp.currentScore}%</div>
                  <div className="text-[10px] text-slate-500 font-medium">Level: {selectedComp.proficiencyLevel}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Target Benchmark</div>
                  <div className="text-2xl font-black text-blue-900 mt-0.5">{selectedComp.targetScore}%</div>
                  <div className="text-[10px] text-slate-500 font-medium">ISS Cadre Expectation</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Delta Status</div>
                  <div
                    className={`text-2xl font-black mt-0.5 ${
                      selectedComp.currentScore < selectedComp.targetScore ? "text-red-600" : "text-emerald-700"
                    }`}
                  >
                    {selectedComp.currentScore < selectedComp.targetScore
                      ? `-${selectedComp.targetScore - selectedComp.currentScore}`
                      : "0"}
                  </div>
                  <div className="text-[10px] font-bold">
                    {selectedComp.currentScore < selectedComp.targetScore ? "Remediation Needed" : "Proficient"}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Official Competency Definition
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  {selectedComp.description}
                </p>
              </div>

              {/* Observable Indicators */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Observable Behavioral Indicators
                </h4>
                <div className="space-y-2">
                  {selectedComp.indicators.map((ind, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mapped Courses */}
              {selectedComp.suggestedCourses && selectedComp.suggestedCourses.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Mapped iGOT Karmayogi Curricula
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedComp.suggestedCourses.map((cId) => (
                      <button
                        key={cId}
                        onClick={() => {
                          setSelectedComp(null);
                          onSelectCourse(cId);
                        }}
                        className="px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold hover:bg-emerald-100 flex items-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                        <span>iGOT Module: {cId}</span>
                        <ExternalLink className="w-3 h-3 text-emerald-600" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setSelectedComp(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setSelectedComp(null);
                  onStartQuiz("quiz-na-01");
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Take Diagnostic Assessment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
