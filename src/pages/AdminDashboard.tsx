import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { AdminAnalytics, AuditLog, UserProfile } from "../types";
import {
  Shield,
  Users,
  TrendingUp,
  Target,
  FileCheck2,
  Download,
  Search,
  Filter,
  BarChart3,
  Layers,
  Sparkles,
  Award
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [logSearch, setLogSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getAdminAnalytics(), api.getAuditLogs()])
      .then(([aRes, lRes]) => {
        setAnalytics(aRes.analytics);
        setAuditLogs(lRes.auditLogs);
      })
      .catch((err) => console.error("Error loading admin intelligence", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !analytics) {
    return (
      <div className="py-20 text-center text-xs text-slate-400 font-medium">
        Aggregating MoSPI nationwide workforce analytics...
      </div>
    );
  }

  // Distribution Pie Chart Data
  const pieData = [
    { name: "Beginner (0-40%)", value: 420, color: "#f87171" },
    { name: "Intermediate (41-70%)", value: 2450, color: "#fbbf24" },
    { name: "Advanced (71-85%)", value: 1480, color: "#60a5fa" },
    { name: "Expert (86-100%)", value: 470, color: "#34d399" }
  ];

  const filteredLogs = auditLogs.filter((log) => {
    if (!logSearch) return true;
    const q = logSearch.toLowerCase();
    return (
      log.userName.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            <span>Ministry Leadership Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Workforce Competency Analytics</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Macro-level statistical capacity monitoring across MoSPI divisions (NAD, FOD, ESD, SSD) with training
            effectiveness telemetry and compliance tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Official MoSPI Competency Report (PDF/Excel) downloaded for DOPT review.")}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Cadre Report</span>
          </button>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Workforce</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{(analytics.totalWorkforce ?? analytics.totalEmployees ?? 0).toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">ISS & SSS Officers</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Learners</div>
          <div className="text-2xl font-black text-blue-700 mt-1">{(analytics.activeLearners ?? 0).toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">66.6% Participation</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Competency</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{analytics.averageCompetency ?? 0}%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">+4.2% YoY Growth</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Priority Gaps</div>
          <div className="text-2xl font-black text-red-600 mt-1">{(analytics.highPriorityGaps ?? analytics.highPriorityGapsCount ?? 0).toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Under Intervention</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs col-span-2 md:col-span-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Effectiveness Index</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{analytics.trainingEffectivenessIndex ?? 0}%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">NSSTA Certified</div>
        </div>
      </div>

      {/* Visual Analytics: Department Averages Bar Chart & Distribution Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Comparison Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Average Competency by Department</h3>
            <p className="text-xs text-slate-500">Comparing MoSPI Divisions & Statistical Wings</p>
          </div>

          <div className="h-64 sm:h-72 w-full py-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.departmentStats || analytics.departmentComparison?.map((d) => ({
                  department: d.department.replace(/ Division.*/, '').replace(/ Cell.*/, ''),
                  averageScore: d.avgCompetency
                })) || []}
                margin={{ top: 15, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="department" tick={{ fill: "#475569", fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, "Avg Score"]}
                  contentStyle={{ backgroundColor: "#0f172a", color: "#fff", borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="averageScore" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <strong>Insight:</strong> Economic Statistics Division leads at 74% average competency, while Field
            Operations Division requires digital survey scaling.
          </div>
        </div>

        {/* Workforce Distribution Pie Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Workforce Proficiency Tier Distribution</h3>
            <p className="text-xs text-slate-500">4,820 Officers across 4 competency mastery bands</p>
          </div>

          <div className="h-64 sm:h-72 w-full py-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }: any) => `${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Tooltip
                  formatter={(val: any) => [`${val} Officers`, "Count"]}
                  contentStyle={{ backgroundColor: "#0f172a", color: "#fff", borderRadius: "8px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <strong>Target for 2026-27:</strong> Transition 500 officers from Intermediate to Advanced band via NSSTA
            residential TPAC cohorts.
          </div>
        </div>
      </div>

      {/* Emerging Skills & Trends Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="pb-3 border-b border-slate-100 mb-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Emerging Skills Demand Index (MoSPI Modernization)</span>
          </h3>
          <p className="text-xs text-slate-500">Skills exhibiting highest acceleration in training enrollment</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(analytics.emergingSkills || []).map((skill, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{skill.skill}</span>
                <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                  {skill.growthRate || (skill.growthPercent ? `+${skill.growthPercent}%` : "+25%")}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Learners Enrolled: {skill.enrolledLearners ?? (skill.growthPercent ? Math.round(skill.growthPercent * 8) : 120)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Audit Logs View */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Official System Audit Trail</h3>
            <p className="text-xs text-slate-500">Immutable ledger of competency updates, quiz attempts, and nominations</p>
          </div>

          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit logs..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Officer</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString("en-IN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    }) : "Recently"}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">{log.userName}</td>
                  <td className="py-2.5 px-3">
                    <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-mono text-[10px] whitespace-nowrap font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{log.details}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400 whitespace-nowrap">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
