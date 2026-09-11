import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { NSSTATrainingProgramme } from "../types";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Award,
  Sparkles,
  ArrowRight,
  Plus,
  X
} from "lucide-react";

export const NSSTATrainingPage: React.FC = () => {
  const { user, role } = useAuth();
  const [programmes, setProgrammes] = useState<NSSTATrainingProgramme[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedId, setAppliedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New programme form for Trainer/Admin
  const [newProg, setNewProg] = useState({
    programmeName: "",
    code: "",
    duration: "2 Weeks",
    deliveryMode: "Residential (NSSTA Greater Noida)",
    venue: "NSSTA Campus, Plot No. 22, Knowledge Park-II, Greater Noida",
    startDate: "2026-10-15",
    endDate: "2026-10-26",
    competency: "National Accounts & GVA Estimation",
    totalSeats: 30,
    eligibilityCriteria: "ISS / SSS Officers with minimum 2 years field experience"
  });

  const fetchProgrammes = async () => {
    setLoading(true);
    try {
      const res = await api.getNSSTAProgrammes();
      setProgrammes(res.programmes);
    } catch (err) {
      console.error("Error loading NSSTA programmes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const handleApply = (prog: NSSTATrainingProgramme) => {
    setAppliedId(prog.id);
    setToastMsg(
      `Nomination application submitted for "${prog.programmeName}". Forwarded to MoSPI Administration for Cadre Controlling Authority approval.`
    );
    setTimeout(() => setToastMsg(null), 5000);
  };

  const handleCreateProgramme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createNSSTAProgramme({
        ...newProg,
        status: "Nominations Open",
        filledSeats: 0
      });
      setShowAddModal(false);
      setToastMsg(`New NSSTA TPAC programme "${newProg.programmeName}" announced!`);
      await fetchProgrammes();
      setTimeout(() => setToastMsg(null), 5000);
    } catch (err) {
      console.error("Failed to create programme", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            <span>National Statistical Systems Training Academy (NSSTA)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">NSSTA TPAC Training Curricula</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Annual Training Programme Advisory Committee (TPAC) calendar for Indian Statistical Service & Subordinate
            Statistical Service officers at the Greater Noida campus and online.
          </p>
        </div>

        {(role === "admin" || role === "trainer") && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Announce New Programme</span>
          </button>
        )}
      </div>

      {/* Toast notification */}
      {toastMsg && (
        <div className="p-3 bg-blue-50 border border-blue-300 text-blue-900 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Grid of Programmes */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400 font-medium">Fetching NSSTA TPAC schedule...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {programmes.map((p) => {
            const isApplied = appliedId === p.id;
            return (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase">
                      {p.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      {p.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900">{p.programmeName}</h3>
                  <p className="text-xs text-blue-700 font-medium mt-0.5">Competency: {p.competency}</p>

                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {p.startDate} to {p.endDate} ({p.duration})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{p.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        Capacity: {p.filledSeats} / {p.totalSeats} Officers Nominated
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                    <strong>Eligibility:</strong> {p.eligibilityCriteria}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">{p.deliveryMode}</span>

                  {isApplied ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Nomination Pending Approval</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(p)}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <span>Apply for Nomination</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Programme Modal for Trainer/Admin */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">Announce NSSTA TPAC Programme</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProgramme} className="p-5 space-y-3.5 overflow-y-auto">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Programme Title</label>
                <input
                  type="text"
                  required
                  value={newProg.programmeName}
                  onChange={(e) => setNewProg({ ...newProg, programmeName: e.target.value })}
                  placeholder="e.g. Advanced System of National Accounts & Supply-Use Tables"
                  className="w-full text-xs p-2 rounded border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">TPAC Code</label>
                  <input
                    type="text"
                    required
                    value={newProg.code}
                    onChange={(e) => setNewProg({ ...newProg, code: e.target.value })}
                    placeholder="e.g. NSSTA-TPAC-2026-04"
                    className="w-full text-xs p-2 rounded border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={newProg.duration}
                    onChange={(e) => setNewProg({ ...newProg, duration: e.target.value })}
                    className="w-full text-xs p-2 rounded border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Competency Addressed</label>
                <input
                  type="text"
                  required
                  value={newProg.competency}
                  onChange={(e) => setNewProg({ ...newProg, competency: e.target.value })}
                  className="w-full text-xs p-2 rounded border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newProg.startDate}
                    onChange={(e) => setNewProg({ ...newProg, startDate: e.target.value })}
                    className="w-full text-xs p-2 rounded border border-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newProg.endDate}
                    onChange={(e) => setNewProg({ ...newProg, endDate: e.target.value })}
                    className="w-full text-xs p-2 rounded border border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Publish to TPAC Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
