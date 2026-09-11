import {
  UserProfile,
  Competency,
  SkillGapItem,
  IGOTCourse,
  NSSTATrainingProgramme,
  LearningPath,
  Quiz,
  QuizAttempt,
  LearningMaterial,
  NotificationItem,
  AuditLog,
  AdminAnalytics,
  UserRole
} from "../types";

const BASE_URL = "/api";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    },
    ...options
  });

  if (!res.ok) {
    let errorMsg = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const errData = await res.json();
      if (errData.error) errorMsg = errData.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // Auth & Session
  getMe: () => fetchJson<{ user: UserProfile }>("/auth/me"),
  login: (input?: string | { email?: string; password?: string }) => {
    const payload = typeof input === "string" ? { email: input } : input || {};
    return fetchJson<{ user: UserProfile; message: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  loginWithGoogle: (data?: { email?: string; name?: string }) => fetchJson<{ user: UserProfile; message: string }>("/auth/google", {
    method: "POST",
    body: JSON.stringify(data || {})
  }),
  forgotPassword: (email: string) => fetchJson<{ message: string; success: boolean }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email })
  }),
  register: (data: {
    fullName: string;
    email: string;
    password?: string;
    employeeId?: string;
    department: string;
    designation: string;
    jobRole: string;
    organization?: string;
  }) => fetchJson<{ user: UserProfile; message?: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  switchDemoRole: (role: UserRole) => fetchJson<{ user: UserProfile; message: string }>("/auth/demo-switch", {
    method: "POST",
    body: JSON.stringify({ role })
  }),
  updateProfile: (data: Partial<UserProfile>) => fetchJson<{ user: UserProfile }>("/users/me", {
    method: "PUT",
    body: JSON.stringify(data)
  }),
  submitOnboarding: (data: any) => fetchJson<{ user: UserProfile; message: string }>("/users/onboarding", {
    method: "POST",
    body: JSON.stringify(data)
  }),

  // Competencies & Gaps
  getCompetencies: (domain?: string) => fetchJson<{ competencies: Competency[]; total: number }>(`/competencies${domain ? `?domain=${domain}` : ""}`),
  getMyCompetencies: () => fetchJson<{
    user: UserProfile;
    competencies: Competency[];
    skillGaps: SkillGapItem[];
    topPriorityGaps: SkillGapItem[];
    overallAverage: number;
    domainAverages: Record<string, number>;
  }>("/competencies/me"),
  getMySkillGaps: () => fetchJson<{
    skillGaps: SkillGapItem[];
    top5: SkillGapItem[];
    criticalCount: number;
    highCount: number;
  }>("/skill-gaps/me"),
  updateCompetencyScore: (competencyId: string, newScore?: number, delta?: number, reason?: string) =>
    fetchJson<{ competency: Competency; updatedOverall: number }>("/competencies/update-score", {
      method: "POST",
      body: JSON.stringify({ competencyId, newScore, delta, reason })
    }),

  // iGOT Courses & Recommendations
  getIGOTStatus: () => fetchJson<{
    mode: string;
    serviceInterface: string;
    activeImplementation: string;
    targetApiEndpoint: string;
    authReady: boolean;
    description: string;
  }>("/igot/status"),
  getCourses: (filters?: { domain?: string; difficulty?: string; provider?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.domain) params.append("domain", filters.domain);
    if (filters?.difficulty) params.append("difficulty", filters.difficulty);
    if (filters?.provider) params.append("provider", filters.provider);
    if (filters?.search) params.append("search", filters.search);
    return fetchJson<{ courses: IGOTCourse[]; count: number }>(`/courses?${params.toString()}`);
  },
  getCourseById: (id: string) => fetchJson<{ course: IGOTCourse }>(`/courses/${id}`),
  getRecommendations: () => fetchJson<{
    recommendations: IGOTCourse[];
    primaryFocus: IGOTCourse[];
    totalGapsAddressed: number;
  }>("/recommendations/me"),
  enrollCourse: (courseId: string) => fetchJson<{ message: string; course: IGOTCourse }>("/learning/enroll", {
    method: "POST",
    body: JSON.stringify({ courseId })
  }),
  updateCourseProgress: (courseId: string, progressPercent: number, hoursAdded?: number) =>
    fetchJson<{ message: string; course: IGOTCourse; user: UserProfile }>("/learning/progress", {
      method: "POST",
      body: JSON.stringify({ courseId, progressPercent, hoursAdded })
    }),

  // NSSTA TPAC Training
  getNSSTAProgrammes: () => fetchJson<{ programmes: NSSTATrainingProgramme[] }>("/nssta/programmes"),
  createNSSTAProgramme: (data: Partial<NSSTATrainingProgramme>) => fetchJson<{ programme: NSSTATrainingProgramme }>("/nssta/programmes", {
    method: "POST",
    body: JSON.stringify(data)
  }),

  // Learning Path
  getLearningPath: () => fetchJson<{ learningPath: LearningPath }>("/learning-path"),

  // Learning Materials
  getMaterials: () => fetchJson<{ materials: LearningMaterial[] }>("/materials"),
  getMaterialById: (id: string) => fetchJson<{ material: LearningMaterial }>(`/materials/${id}`),
  uploadMaterial: (data: {
    title: string;
    filename: string;
    fileType: string;
    textContent: string;
    associatedDomain?: string;
    associatedCompetency?: string;
  }) => fetchJson<{ material: LearningMaterial; message: string }>("/materials/upload", {
    method: "POST",
    body: JSON.stringify(data)
  }),

  // Quizzes
  getQuizList: () => fetchJson<{ quizzes: Quiz[] }>("/quiz/list"),
  getQuizById: (id: string) => fetchJson<{ quiz: Quiz }>(`/quiz/${id}`),
  generateAIQuiz: (data: {
    materialId?: string;
    materialText?: string;
    title?: string;
    competency?: string;
    domain?: string;
    questionCount?: number;
    difficulty?: string;
    questionType?: string;
  }) => fetchJson<{ quiz: Quiz; message: string }>("/quiz/generate", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  submitQuiz: (data: {
    quizId: string;
    answers: Record<string, number>;
    timeTakenSeconds: number;
  }) => fetchJson<{
    attempt: QuizAttempt;
    evaluatedAnswers: any[];
    competency: Competency;
    user: UserProfile;
  }>("/quiz/submit", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  getMyAttempts: () => fetchJson<{ attempts: QuizAttempt[] }>("/quiz/attempts/me"),
  updateQuizQuestion: (quizId: string, questionData: any) => fetchJson<{ quiz: Quiz; message: string }>(`/quiz/${quizId}/question`, {
    method: "PUT",
    body: JSON.stringify(questionData)
  }),

  // AI Copilot
  chatWithCopilot: (message: string) => fetchJson<{ reply: string; followUps: string[] }>("/ai/chat", {
    method: "POST",
    body: JSON.stringify({ message })
  }),

  // Admin
  getAdminAnalytics: () => fetchJson<{ analytics: AdminAnalytics }>("/admin/analytics"),
  getAdminUsers: () => fetchJson<{ users: UserProfile[] }>("/admin/users"),
  getAuditLogs: () => fetchJson<{ auditLogs: AuditLog[] }>("/admin/audit-logs"),

  // Notifications
  getNotifications: () => fetchJson<{ notifications: NotificationItem[] }>("/notifications"),
  markNotificationRead: (id: string) => fetchJson<{ success: boolean; notif: NotificationItem }>(`/notifications/${id}/read`, {
    method: "POST"
  })
};
