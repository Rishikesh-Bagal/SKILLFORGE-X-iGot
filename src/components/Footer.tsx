import React from "react";
import { ExternalLink, ShieldCheck, Award, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B2545] text-white border-t-4 border-blue-600 mt-16">
      {/* Upper Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Problem Statement */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
                SF
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                SKILLFORGE <span className="text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              AI-Powered Competency Intelligence & Learning Copilot engineered for India's Official Statistical System.
            </p>
            <div className="bg-blue-950/80 p-2.5 rounded border border-blue-800/80 text-[11px] text-blue-200">
              <div className="font-semibold text-amber-300">Smart India Hackathon 2026</div>
              <div>Problem Statement ID: <span className="font-mono text-white">26101 (SIH26101)</span></div>
              <div>Team: <span className="text-white font-medium">CODE2FIX (SE-SW-06)</span></div>
              <div>Theme: <span className="text-white">Smart Education</span></div>
            </div>
          </div>

          {/* Col 2: Official Ecosystem */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-3 border-b border-blue-800 pb-1">
              Official Ecosystem
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a
                  href="https://mospi.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Ministry of Statistics & PI (MoSPI)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://igotkarmayogi.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>iGOT Karmayogi Bharat Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.nssta.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>NSSTA Greater Noida (Training Academy)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://ndap.niti.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>National Data & Analytics Platform (NDAP)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Core Capabilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-3 border-b border-blue-800 pb-1">
              Core Capabilities
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>• AI Competency Gap Identification</li>
              <li>• Personalized Adaptive Pathways</li>
              <li>• iGOT Karmayogi Adapter Layer</li>
              <li>• Material-to-MCQ Gemini Engine</li>
              <li>• NSSTA TPAC Training Nominations</li>
              <li>• Automated Competency Rescoring</li>
              <li>• DPDP Act 2023 & Statistical Ethics</li>
            </ul>
          </div>

          {/* Col 4: Prototype & Security Disclosure */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-3 border-b border-blue-800 pb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Hackathon Compliance</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Designed according to Karmayogi Competency Model & NSSTA curricular directives. Integrations utilize a mock
              adapter with standardized contracts for seamless transition to live government APIs.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/80">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>Zero-knowledge client security: AI keys restricted to server runtime.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Stripe */}
      <div className="bg-[#07172B] py-3 border-t border-blue-900/60 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 Government of India / MoSPI. Solution by <strong className="text-white">Team CODE2FIX</strong> for Smart India Hackathon.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Accessibility Compliant (GIGW)</span>
            <span>•</span>
            <span>DPDP Act 2023 Compliant</span>
            <span>•</span>
            <span className="text-blue-300">v1.0.0-SIH2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
