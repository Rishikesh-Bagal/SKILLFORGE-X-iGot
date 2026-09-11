import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { SkillProficiency, OnboardingPayload } from "../types";
import {
  Brain,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Target,
  Compass,
  Building2,
  Clock,
  ShieldCheck,
  Check,
  ChevronRight,
  AlertCircle,
  BarChart3,
  Lightbulb,
  FileCheck2,
  TrendingUp,
  Tag,
  Plus,
  X
} from "lucide-react";

const DEPARTMENTS = [
  "National Accounts Division (NAD)",
  "Field Operations Division (FOD)",
  "Social Statistics Division (SSD)",
  "Economic Statistics Division (ESD)",
  "National Statistical Systems Training Academy (NSSTA)",
  "Data Informatics and Innovation Division (DIID)",
  "Coordination and Publication Division (CPD)",
  "Ministry of Statistics & Programme Implementation (MoSPI) - General",
  "Other Ministry / State Directorate of Economics & Statistics"
];

const DESIGNATIONS = [
  "Junior Statistical Officer (JSO)",
  "Senior Statistical Officer (SSO)",
  "Assistant Director (Statistics)",
  "Deputy Director (Statistics)",
  "Joint Director (Statistics)",
  "Director / Additional Director General",
  "Statistical Investigator / Field Officer",
  "Research Fellow / Data Analyst"
];

const EDUCATION_OPTIONS = [
  "M.Sc. in Statistics",
  "M.A. in Economics / Econometrics",
  "Master of Statistics (M.Stat) - ISI",
  "M.Sc. in Mathematics / Operations Research",
  "B.Tech / M.Tech in Computer Science / Data Science",
  "Post Graduate Diploma in Official Statistics",
  "Ph.D. in Statistics / Economics",
  "Other Relevant Post Graduate Degree"
];

const TARGET_ROLES = [
  "Joint Director (Macroeconomic Accounts / Price Statistics)",
  "Director (Field Operations & Survey Supervision)",
  "Chief Data Scientist & Statistical Modeling Lead",
  "Deputy Director (Industrial Statistics & ASI)",
  "Senior Research Officer (Sustainable Development Goals)",
  "Data Privacy & Public Information Officer"
];

// Domains and their official skills
const SKILL_DOMAINS = [
  {
    id: "statistical",
    name: "Statistical Domain",
    icon: BarChart3,
    color: "blue",
    description: "Core statistical methodologies, survey designs, and official accounting frameworks",
    skills: [
      "Survey Design",
      "Sampling",
      "National Accounts",
      "Price Statistics",
      "Labour Statistics",
      "Agricultural Statistics",
      "Industrial Statistics",
      "SDG Indicators",
      "Metadata Standards",
      "Data Quality Frameworks"
    ]
  },
  {
    id: "technical",
    name: "Technical Domain",
    icon: Brain,
    color: "emerald",
    description: "Computational tools, statistical programming languages, data architectures, and AI",
    skills: [
      "Python",
      "R",
      "SQL",
      "Stata",
      "SPSS",
      "SAS",
      "GIS",
      "Data Visualization",
      "AI/ML",
      "Cloud Computing",
      "APIs",
      "Open Data"
    ]
  },
  {
    id: "governance",
    name: "Digital Governance Domain",
    icon: ShieldCheck,
    color: "purple",
    description: "Public data security, digital infrastructure, DPDP Act compliance, and e-governance",
    skills: [
      "Cybersecurity",
      "Data Privacy",
      "Digital Signatures",
      "Government Cloud",
      "Digital Public Infrastructure"
    ]
  },
  {
    id: "behavioural",
    name: "Behavioural & Managerial Domain",
    icon: Compass,
    color: "amber",
    description: "Administrative leadership, project management, professional ethics, and public policy delivery",
    skills: [
      "Leadership",
      "Communication",
      "Project Management",
      "Ethics",
      "Decision Making",
      "Change Management"
    ]
  }
];

const PROFICIENCY_LEVELS: { level: SkillProficiency; score: number; desc: string }[] = [
  { level: "Beginner", score: 38, desc: "Foundational knowledge, assisted execution" },
  { level: "Intermediate", score: 62, desc: "Independent application in routine tasks" },
  { level: "Advanced", score: 82, desc: "Deep proficiency, complex problem solving" },
  { level: "Expert", score: 94, desc: "Subject matter authority, mentoring capacity" }
];

export const OnboardingPage: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const { user, refreshUser, setActiveTab } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // STEP 1: Personal & Professional
  const [fullName, setFullName] = useState(user?.name || "");
  const [department, setDepartment] = useState(user?.department || DEPARTMENTS[0]);
  const [designation, setDesignation] = useState(user?.designation || DESIGNATIONS[1]);
  const [currentJobRole, setCurrentJobRole] = useState(user?.jobRole || "National Accounts Compilation & Macro Aggregates");
  const [currentAssignment, setCurrentAssignment] = useState(user?.currentAssignment || "Annual Survey of Industries & PLFS Microdata Verification");
  const [experienceYears, setExperienceYears] = useState<number>(user?.experienceYears ?? 4);
  const [education, setEducation] = useState(user?.education || EDUCATION_OPTIONS[0]);

  // STEP 2: Skills Inventory
  const [activeDomainTab, setActiveDomainTab] = useState("statistical");
  const [skills, setSkills] = useState<Record<string, SkillProficiency>>(() => {
    const initial: Record<string, SkillProficiency> = {};
    SKILL_DOMAINS.forEach((d) => {
      d.skills.forEach((s, idx) => {
        // Provide balanced initial default
        if (s === "National Accounts" || s === "Survey Design" || s === "Ethics" || s === "Communication") {
          initial[s] = "Advanced";
        } else if (s === "Sampling" || s === "Python" || s === "SQL" || s === "Data Privacy" || s === "Project Management") {
          initial[s] = "Intermediate";
        } else if (s === "AI/ML" || s === "Cybersecurity" || s === "GIS") {
          initial[s] = "Beginner";
        } else {
          initial[s] = idx % 2 === 0 ? "Intermediate" : "Beginner";
        }
      });
    });
    return initial;
  });

  // STEP 3: Previous Training & Certifications
  const [previousCourses, setPreviousCourses] = useState<string[]>([
    "Modern Survey Sampling & Weighting (NSSTA)",
    "System of National Accounts 2008 Overview (iGOT)"
  ]);
  const [newCourseInput, setNewCourseInput] = useState("");

  const [certifications, setCertifications] = useState<string[]>([
    "Digital Data Verification Certification (MoSPI)",
    "Python for Statistical Computations (NSSTA)"
  ]);
  const [newCertInput, setNewCertInput] = useState("");

  const [previousGovtTraining, setPreviousGovtTraining] = useState<string[]>([
    "NSSTA Residential Induction Training (Batch 2021)",
    "ISTM Workshop on Public Procurement & GeM Protocols"
  ]);
  const [newGovtTrainingInput, setNewGovtTrainingInput] = useState("");

  const [trainingHours, setTrainingHours] = useState<number>(36);

  // STEP 4: Career Aspirations & Target Role
  const [targetCareerRole, setTargetCareerRole] = useState(TARGET_ROLES[0]);
  const [customTargetRole, setCustomTargetRole] = useState("");
  const [areasOfInterest, setAreasOfInterest] = useState<string[]>([
    "AI & Machine Learning in Official Statistics",
    "Modern Econometrics & High-Frequency Indicators",
    "Data Privacy & DPDP Act 2023 Compliance"
  ]);
  const [newInterestInput, setNewInterestInput] = useState("");

  const [preferredLearningModes, setPreferredLearningModes] = useState<string[]>([
    "Self-paced iGOT e-Learning Courses",
    "Interactive AI Copilot Coaching & Quizzes",
    "Hands-on Statistical Microdata Labs"
  ]);

  // Sync user if available
  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.department) setDepartment(user.department);
      if (user.designation) setDesignation(user.designation);
      if (user.jobRole) setCurrentJobRole(user.jobRole);
      if (user.currentAssignment) setCurrentAssignment(user.currentAssignment);
      if (user.experienceYears !== undefined) setExperienceYears(user.experienceYears);
      if (user.education) setEducation(user.education);
    }
  }, [user]);

  // Skill updates
  const handleSetSkillLevel = (skillName: string, level: SkillProficiency) => {
    setSkills((prev) => ({ ...prev, [skillName]: level }));
  };

  const handleSetDomainAll = (domainId: string, level: SkillProficiency) => {
    const domain = SKILL_DOMAINS.find((d) => d.id === domainId);
    if (!domain) return;
    setSkills((prev) => {
      const updated = { ...prev };
      domain.skills.forEach((s) => {
        updated[s] = level;
      });
      return updated;
    });
  };

  // Add tag helpers
  const handleAddCourse = () => {
    if (newCourseInput.trim() && !previousCourses.includes(newCourseInput.trim())) {
      setPreviousCourses([...previousCourses, newCourseInput.trim()]);
      setNewCourseInput("");
    }
  };

  const handleRemoveCourse = (item: string) => {
    setPreviousCourses(previousCourses.filter((c) => c !== item));
  };

  const handleAddCert = () => {
    if (newCertInput.trim() && !certifications.includes(newCertInput.trim())) {
      setCertifications([...certifications, newCertInput.trim()]);
      setNewCertInput("");
    }
  };

  const handleRemoveCert = (item: string) => {
    setCertifications(certifications.filter((c) => c !== item));
  };

  const handleAddGovtTraining = () => {
    if (newGovtTrainingInput.trim() && !previousGovtTraining.includes(newGovtTrainingInput.trim())) {
      setPreviousGovtTraining([...previousGovtTraining, newGovtTrainingInput.trim()]);
      setNewGovtTrainingInput("");
    }
  };

  const handleRemoveGovtTraining = (item: string) => {
    setPreviousGovtTraining(previousGovtTraining.filter((t) => t !== item));
  };

  const handleAddInterest = () => {
    if (newInterestInput.trim() && !areasOfInterest.includes(newInterestInput.trim())) {
      setAreasOfInterest([...areasOfInterest, newInterestInput.trim()]);
      setNewInterestInput("");
    }
  };

  const handleRemoveInterest = (item: string) => {
    setAreasOfInterest(areasOfInterest.filter((i) => i !== item));
  };

  const toggleLearningMode = (mode: string) => {
    if (preferredLearningModes.includes(mode)) {
      setPreferredLearningModes(preferredLearningModes.filter((m) => m !== mode));
    } else {
      setPreferredLearningModes([...preferredLearningModes, mode]);
    }
  };

  // Calculations for Step 5 Review
  const calculateBaselineScore = () => {
    const values = Object.values(skills);
    if (values.length === 0) return 60;
    const scoreMap: Record<SkillProficiency, number> = {
      Beginner: 38,
      Intermediate: 62,
      Advanced: 82,
      Expert: 94
    };
    const sum = (values as SkillProficiency[]).reduce((acc, lvl) => acc + (scoreMap[lvl] || 60), 0);
    return Math.round(sum / values.length);
  };

  const getDomainAverage = (domainId: string) => {
    const domain = SKILL_DOMAINS.find((d) => d.id === domainId);
    if (!domain) return 60;
    const scoreMap: Record<SkillProficiency, number> = {
      Beginner: 38,
      Intermediate: 62,
      Advanced: 82,
      Expert: 94
    };
    const domainScores = domain.skills.map((s) => scoreMap[skills[s] || "Intermediate"]);
    return Math.round(domainScores.reduce((a, b) => a + b, 0) / domainScores.length);
  };

  // Step Navigation Validation
  const handleNextStep = () => {
    setError(null);
    if (currentStep === 1) {
      if (!fullName.trim()) {
        setError("Please provide your full official name.");
        return;
      }
      if (!department.trim()) {
        setError("Please select or enter your department.");
        return;
      }
      if (!designation.trim()) {
        setError("Please select or enter your designation.");
        return;
      }
      if (!currentJobRole.trim()) {
        setError("Please specify your current job role.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  const handlePrevStep = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Final Submission
  const handleSubmitOnboarding = async () => {
    setLoading(true);
    setError(null);

    const resolvedTargetRole = targetCareerRole === "Other / Custom Aspiration" && customTargetRole.trim()
      ? customTargetRole.trim()
      : targetCareerRole;

    const payload: OnboardingPayload = {
      fullName: fullName.trim(),
      department: department.trim(),
      designation: designation.trim(),
      currentJobRole: currentJobRole.trim(),
      currentAssignment: currentAssignment.trim(),
      experienceYears: Number(experienceYears) || 0,
      education: education.trim(),
      organization: "Ministry of Statistics & Programme Implementation (MoSPI)",
      skills,
      previousCourses,
      certifications,
      previousGovtTraining,
      trainingHours: Number(trainingHours) || 0,
      targetCareerRole: resolvedTargetRole
    };

    try {
      await api.submitOnboarding(payload);
      await refreshUser();
      if (onCompleted) {
        onCompleted();
      } else {
        setActiveTab("dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Onboarding calibration submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, title: "Personal & Professional", icon: Briefcase },
    { num: 2, title: "Skills Inventory", icon: BarChart3 },
    { num: 3, title: "Training & Certifications", icon: GraduationCap },
    { num: 4, title: "Career Aspirations", icon: Target },
    { num: 5, title: "Baseline Calibration", icon: Sparkles }
  ];

  const overallBaseline = calculateBaselineScore();

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Wizard Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Cadre Competency Intelligence &amp; Baseline Calibration</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Employee Onboarding &amp; Profile Completion Flow
        </h1>
        <p className="text-xs text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Calibrate your statistical, technical, digital governance, and managerial proficiency across India&apos;s Official Statistical System to auto-generate your tailored iGOT learning path.
        </p>

        {/* Step Progress Tracker */}
        <div className="pt-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            {stepsList.map((st, i) => {
              const isDone = st.num < currentStep;
              const isCurrent = st.num === currentStep;
              const Icon = st.icon;
              return (
                <React.Fragment key={st.num}>
                  <button
                    type="button"
                    onClick={() => {
                      if (st.num < currentStep) setCurrentStep(st.num);
                    }}
                    className={`flex flex-col items-center gap-1.5 transition-all ${
                      st.num < currentStep ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all shadow-2xs ${
                        isCurrent
                          ? "bg-[#0B2545] text-white ring-4 ring-blue-100"
                          : isDone
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-[10px] font-bold hidden sm:block ${
                        isCurrent ? "text-blue-900" : isDone ? "text-emerald-700" : "text-slate-400"
                      }`}
                    >
                      Step {st.num}
                    </span>
                  </button>
                  {i < stepsList.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full transition-colors ${
                        st.num < currentStep ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alert Banner if any */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Validation Notice: </span>
            {error}
          </div>
        </div>
      )}

      {/* Main Wizard Form Body Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* =========================================================================
            STEP 1: PERSONAL & PROFESSIONAL DETAILS
        ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span>Step 1: Personal &amp; Professional Details</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Confirm your official identity, cadre allocation, and current departmental placement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Department / Directorate <span className="text-rose-500">*</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50 cursor-pointer"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Official Designation <span className="text-rose-500">*</span>
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50 cursor-pointer"
                >
                  {DESIGNATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Current Job Role <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={currentJobRole}
                  onChange={(e) => setCurrentJobRole(e.target.value)}
                  placeholder="e.g. Macroeconomic Accounts Compilation"
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Current Assignment / Project <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={currentAssignment}
                  onChange={(e) => setCurrentAssignment(e.target.value)}
                  placeholder="e.g. Annual Survey of Industries &amp; PLFS Microdata Verification"
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Years of Experience in Official Statistics / Service
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-24 px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 text-center font-bold bg-slate-50/50"
                  />
                  <span className="text-xs text-slate-500">Years of continuous cadre service</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Highest Qualification / Education <span className="text-rose-500">*</span>
                </label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50 cursor-pointer"
                >
                  {EDUCATION_OPTIONS.map((edu) => (
                    <option key={edu} value={edu}>
                      {edu}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: SKILLS INVENTORY (4 Domains)
        ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Step 2: Skills Inventory across 4 Official Domains</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your current proficiency (Beginner, Intermediate, Advanced, Expert) for each competency.
                </p>
              </div>
              <div className="text-[11px] bg-blue-50 text-blue-800 font-bold px-3 py-1 rounded-lg border border-blue-200 shrink-0">
                33 Competencies Calibrated
              </div>
            </div>

            {/* Domain Navigation Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SKILL_DOMAINS.map((domain) => {
                const Icon = domain.icon;
                const isActive = activeDomainTab === domain.id;
                return (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => setActiveDomainTab(domain.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? "bg-[#0B2545] text-white border-[#0B2545] shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${isActive ? "text-cyan-300" : "text-blue-600"}`} />
                      <span className="text-xs font-bold truncate">{domain.name.replace(" Domain", "")}</span>
                    </div>
                    <span className={`text-[10px] ${isActive ? "text-blue-200" : "text-slate-400"}`}>
                      {domain.skills.length} competencies
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Domain Skills Table */}
            {(() => {
              const currentDomain = SKILL_DOMAINS.find((d) => d.id === activeDomainTab)!;
              return (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{currentDomain.name}</span>
                      <p className="text-[11px] text-slate-500">{currentDomain.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 hidden sm:inline">Quick set:</span>
                      <button
                        type="button"
                        onClick={() => handleSetDomainAll(currentDomain.id, "Intermediate")}
                        className="text-[10px] font-bold px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:border-blue-400 cursor-pointer"
                      >
                        All Intermediate
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetDomainAll(currentDomain.id, "Advanced")}
                        className="text-[10px] font-bold px-2 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:border-blue-400 cursor-pointer"
                      >
                        All Advanced
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentDomain.skills.map((skill) => {
                      const currentLevel = skills[skill] || "Intermediate";
                      return (
                        <div
                          key={skill}
                          className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all flex flex-col justify-between gap-2 shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{skill}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                currentLevel === "Expert"
                                  ? "bg-purple-100 text-purple-800"
                                  : currentLevel === "Advanced"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : currentLevel === "Intermediate"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {currentLevel}
                            </span>
                          </div>

                          {/* Proficiency Selection Pill Group */}
                          <div className="grid grid-cols-4 gap-1 pt-1">
                            {PROFICIENCY_LEVELS.map((p) => {
                              const isSelected = currentLevel === p.level;
                              return (
                                <button
                                  key={p.level}
                                  type="button"
                                  onClick={() => handleSetSkillLevel(skill, p.level)}
                                  className={`py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all text-center truncate cursor-pointer ${
                                    isSelected
                                      ? "bg-[#0B2545] text-white shadow-xs"
                                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                                  }`}
                                  title={`${p.level}: ${p.desc}`}
                                >
                                  {p.level}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* =========================================================================
            STEP 3: PREVIOUS TRAINING & CERTIFICATIONS
        ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span>Step 3: Previous Training &amp; Certifications</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Log completed courses on iGOT Karmayogi, NSSTA academies, and prior government trainings.
              </p>
            </div>

            {/* Courses Completed */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Courses Completed on iGOT Karmayogi or other platforms
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCourseInput}
                  onChange={(e) => setNewCourseInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCourse();
                    }
                  }}
                  placeholder="e.g. Econometric Modeling with R or Big Data Analytics"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={handleAddCourse}
                  className="px-3 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-blue-700 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {previousCourses.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs border border-blue-200"
                  >
                    <span>{c}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCourse(c)}
                      className="text-blue-400 hover:text-blue-700 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications Obtained */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Certifications Obtained
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCertInput}
                  onChange={(e) => setNewCertInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCert();
                    }
                  }}
                  placeholder="e.g. ISO 27001 Data Security or Google Data Analytics"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={handleAddCert}
                  className="px-3 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-blue-700 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {certifications.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs border border-emerald-200"
                  >
                    <span>{cert}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCert(cert)}
                      className="text-emerald-400 hover:text-emerald-700 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Prior Government Training Attended */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Prior Government &amp; Cadre Trainings Attended
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGovtTrainingInput}
                  onChange={(e) => setNewGovtTrainingInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddGovtTraining();
                    }
                  }}
                  placeholder="e.g. NSSTA Mid-Career Phase II or LBSNAA Governance Workshop"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={handleAddGovtTraining}
                  className="px-3 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-blue-700 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {previousGovtTraining.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-800 text-xs border border-purple-200"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGovtTraining(t)}
                      className="text-purple-400 hover:text-purple-700 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Total Training Hours Completed */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Total Official Training Hours Completed
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  max={1000}
                  value={trainingHours}
                  onChange={(e) => setTrainingHours(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 text-center font-bold bg-slate-50/50"
                />
                <span className="text-xs text-slate-500">
                  Accredited hours on iGOT Karmayogi &amp; NSSTA records
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: CAREER ASPIRATIONS & TARGET ROLE
        ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span>Step 4: Career Aspirations &amp; Target Role</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Specify your promotion target and desired technical specialization to align AI recommendations.
              </p>
            </div>

            {/* Target Role Dropdown */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Target Role / Promotion Aspiration <span className="text-rose-500">*</span>
              </label>
              <select
                value={targetCareerRole}
                onChange={(e) => setTargetCareerRole(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 bg-slate-50/50 cursor-pointer"
              >
                {TARGET_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
                <option value="Other / Custom Aspiration">Other / Custom Aspiration</option>
              </select>
              {targetCareerRole === "Other / Custom Aspiration" && (
                <input
                  type="text"
                  value={customTargetRole}
                  onChange={(e) => setCustomTargetRole(e.target.value)}
                  placeholder="Enter target role or cadre designation"
                  className="w-full mt-2 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600"
                />
              )}
            </div>

            {/* Areas of Interest */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Primary Areas of Technical &amp; Policy Interest
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInterestInput}
                  onChange={(e) => setNewInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddInterest();
                    }
                  }}
                  placeholder="e.g. Geospatial Statistics or Nowcasting"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="px-3 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-blue-700 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {areasOfInterest.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs border border-amber-200"
                  >
                    <span>{interest}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="text-amber-400 hover:text-amber-700 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Learning Modes */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-700 block">
                Preferred Learning Modes on SkillForge AI
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  "Self-paced iGOT e-Learning Courses",
                  "Interactive AI Copilot Coaching & Quizzes",
                  "NSSTA In-Person / Residential Workshops",
                  "Weekly Micro-Learning Modules (15 min/day)",
                  "Hands-on Statistical Microdata Labs",
                  "Peer Study Circles & Group Challenges"
                ].map((mode) => {
                  const isChecked = preferredLearningModes.includes(mode);
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => toggleLearningMode(mode)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? "bg-blue-50 border-blue-400 text-blue-900 font-bold shadow-2xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{mode}</span>
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 5: ONBOARDING REVIEW & COMPETENCY BASELINE
        ========================================================================= */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>Step 5: Onboarding Review &amp; Baseline Calibration</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify your capacity profile summary and baseline competency scores prior to final AI roadmap generation.
              </p>
            </div>

            {/* Profile Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-blue-800">
                  Cadre &amp; Placement Profile
                </span>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Official Name:</span>
                  <span className="font-bold text-slate-900">{fullName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-bold text-slate-900 text-right truncate ml-2">{department}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Designation:</span>
                  <span className="font-bold text-slate-900">{designation}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Current Role:</span>
                  <span className="font-bold text-slate-900 text-right truncate ml-2">{currentJobRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cadre Experience:</span>
                  <span className="font-bold text-slate-900">{experienceYears} Years</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-blue-800">
                  Aspiration &amp; Training Records
                </span>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Target Role:</span>
                  <span className="font-bold text-blue-700 text-right truncate ml-2">{targetCareerRole}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Courses Completed:</span>
                  <span className="font-bold text-slate-900">{previousCourses.length} accredited</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Certifications:</span>
                  <span className="font-bold text-slate-900">{certifications.length} verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recorded Hours:</span>
                  <span className="font-bold text-slate-900">{trainingHours} Hours</span>
                </div>
              </div>
            </div>

            {/* Visual Baseline Competency Score Meter */}
            <div className="bg-gradient-to-br from-[#0B2545] to-blue-950 text-white rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300">
                    Official Statistical Competency Baseline
                  </span>
                  <h3 className="text-lg font-extrabold text-white mt-0.5">
                    Calibrated Readiness Score: {overallBaseline}%
                  </h3>
                  <p className="text-xs text-blue-200">
                    Target baseline required for {targetCareerRole}: 85%
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center shrink-0">
                  <span className="text-2xl font-black text-white">{overallBaseline}%</span>
                  <span className="text-[9px] uppercase tracking-wider text-cyan-300 font-bold">Baseline</span>
                </div>
              </div>

              {/* Domain Breakdown Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {SKILL_DOMAINS.map((domain) => {
                  const avg = getDomainAverage(domain.id);
                  return (
                    <div key={domain.id} className="bg-white/5 rounded-xl p-3 border border-white/10 space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-200">{domain.name}</span>
                        <span className="text-cyan-300">{avg}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transition-all duration-500"
                          style={{ width: `${avg}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calibrated Skill Gaps Preview */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Diagnostic Assessment Output: Priority Focus Areas</span>
              </div>
              <p className="leading-relaxed text-amber-800">
                Based on your selected self-assessment and target role ({targetCareerRole}), SkillForge AI will prioritize:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-amber-900 font-medium">
                <li>
                  <span className="font-bold">National Accounts &amp; Macro Aggregates</span> — Gap of ~27 points to target level.
                </li>
                <li>
                  <span className="font-bold">Python for Microdata Processing</span> — Recommended for immediate iGOT Karmayogi enrollment.
                </li>
                <li>
                  <span className="font-bold">Data Privacy &amp; DPDP Act 2023 Compliance</span> — Statutory requirement for official survey supervisors.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl bg-[#0B2545] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ml-auto"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitOnboarding}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-70 ml-auto"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Calibrating Competencies &amp; Generating Roadmap...</span>
                </span>
              ) : (
                <>
                  <span>Complete Onboarding &amp; Generate Learning Copilot</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
