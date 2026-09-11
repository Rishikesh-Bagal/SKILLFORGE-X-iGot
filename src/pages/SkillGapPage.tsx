import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { SkillGapItem, Competency } from "../types";
import {
  Target,
  AlertTriangle,
  BookOpen,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Clock,
  CheckCircle2,
  BarChart3
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

interface SkillGapPageProps {
  onStartQuiz: (quizId: string) => void;
  onSelectCourse: (courseId: string) => void;
}

export const SkillGapPage: React.FC<SkillGapPageProps> = ({
  onStartQuiz,
  onSelectCourse
}) => {
  const [loading, setLoading] = useState(true);
  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>([]);
  const [top5, setTop5] = useState<SkillGapItem[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getMySkillGaps(), api.getMyCompetencies()])
      .then(([gapRes, compRes]) => {
        setSkillGaps(gapRes.skillGaps);
        setTop5(gapRes.top5);
        setCompetencies(compRes.competencies);
      })
      .catch((err) => console.error("Error loading skill gaps", err))
      .finally(() => setLoading(false));
  }, []);

  // Prepare radar chart data
  const radarData = [
    { subject: "Survey Sampling", current: 82, target: 85, fullMark: 100 },
    { subject: "National Accounts", current: 58, target: 86, fullMark: 100 },
    { subject: "Price Statistics", current: 65, target: 80, fullMark: 100 },
    { subject: "Python Microdata", current: 48, target: 80, fullMark: 100 },
    { subject: "SQL Data Warehouse", current: 75, target: 85, fullMark: 100 },
    { subject: "DPDP Act 2023", current: 60, target: 80, fullMark: 100 },
    { subject: "Statistical Lead", current: 68, target: 82, fullMark: 100 }
  ];

  // Bar chart data for top deficits
  const barData = top5.map((g) => ({
    name: g.competencyName.length > 22 ? g.competencyName.slice(0, 20) + "..." : g.competencyName,
    deficit: g.gapPoints,
    current: g.currentScore,
    target: g.targetScore
  }));

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
            <Target className="w-4 h-4" />
            <span>Target vs Reality Diagnostics</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Statistical Skill-Gap Intelligence</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Autonomous differential analysis contrasting your assessed proficiencies against official ISS Job Role
            benchmarks. Priority ranked for high-impact capacity remediation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg text-center">
            <div className="text-[10px] uppercase font-bold text-red-700 tracking-wider">Top Priority Gaps</div>
            <div className="text-2xl font-black text-red-800">{top5.length}</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg text-center">
            <div className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">Est. Hours to Close</div>
            <div className="text-2xl font-black text-blue-900">42 hrs</div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Radar Chart + Deficit Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart: Current vs Benchmark */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Multi-Domain Competency Radar</h3>
            <p className="text-xs text-slate-500">Comparing Current Assessed Level vs ISS Level 10 Target</p>
          </div>

          <div className="h-72 sm:h-80 w-full py-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Radar
                  name="Current Assessed"
                  dataKey="current"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.4}
                />
                <Radar
                  name="ISS Target Benchmark"
                  dataKey="target"
                  stroke="#dc2626"
                  fill="#dc2626"
                  fillOpacity={0.15}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <strong>Key Takeaway:</strong> Significant inward deviation in <em>National Accounts</em> (-28 pts) and{" "}
            <em>Python Microdata</em> (-32 pts) requiring targeted intervention.
          </div>
        </div>

        {/* Deficit Bar Chart: Ranked Point Deltas */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Deficit Points by Competency</h3>
            <p className="text-xs text-slate-500">Ranked by absolute point difference (Target - Current)</p>
          </div>

          <div className="h-72 sm:h-80 w-full py-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 40]} tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fill: "#334155", fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} points deficit`, "Gap"]}
                  contentStyle={{ backgroundColor: "#0f172a", color: "#fff", borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="deficit" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <strong>Remediation Strategy:</strong> Completing the mapped iGOT modules will close up to 85% of these
            deficits within 4 weeks.
          </div>
        </div>
      </div>

      {/* Top 5 Priority Skill Gaps - Action Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Prioritized Remediation Pathways</h3>
            <p className="text-xs text-slate-500">1-click direct actions to close identified deficits</p>
          </div>
          <button
            onClick={() => onStartQuiz("quiz-na-01")}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast-Track Diagnostic (+8 pts)</span>
          </button>
        </div>

        <div className="space-y-3">
          {top5.map((item, index) => (
            <div
              key={item.competencyId}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-red-100 text-red-800 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                  #{index + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">{item.competencyName}</h4>
                    <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded font-mono">
                      -{item.gapPoints} pts deficit
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded capitalize">
                      {item.domain}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.recommendedAction}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2 font-medium">
                    <span>
                      Current: <strong className="text-slate-800">{item.currentScore}%</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Target: <strong className="text-blue-700">{item.targetScore}%</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.estimatedHoursToClose} hrs to close</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <button
                  onClick={() => onSelectCourse(item.suggestedCourses[0] || "igot-na-001")}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>iGOT Module</span>
                </button>

                <button
                  onClick={() => onStartQuiz("quiz-na-01")}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verify Skill</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
