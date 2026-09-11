export type UserRole = 'employee' | 'trainer' | 'admin';

export type CompetencyDomain = 'statistical' | 'technical' | 'digital_governance' | 'governance' | 'behavioural';

export type ProficiencyLevel = 'Beginner' | 'Developing' | 'Intermediate' | 'Advanced' | 'Expert';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId: string;
  designation: string;
  department: string;
  jobRole: string;
  currentAssignment: string;
  organization: string; // e.g., 'Ministry of Statistics & Programme Implementation (MoSPI)'
  cadre: string; // e.g., 'Indian Statistical Service (ISS)' or 'Subordinate Statistical Service (SSS)'
  postingLocation: string;
  education: string;
  experienceYears: number;
  previousTraining: string[];
  careerGoals: string[];
  avatarUrl?: string;
  overallCompetency: number; // 0 - 100
  learningHours: number;
  coursesCompleted: number;
  streakDays: number;
  onboardingCompleted: boolean;
  targetRole?: string;
  certifications?: string[];
  trainingHours?: number;
  skillsProfile?: Record<string, 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>;
  createdAt: string;
}

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface OnboardingPayload {
  fullName: string;
  department: string;
  designation: string;
  currentJobRole: string;
  currentAssignment: string;
  experienceYears: number;
  education: string;
  organization?: string;
  skills: Record<string, SkillProficiency>;
  previousCourses: string[];
  certifications: string[];
  previousGovtTraining: string[];
  trainingHours?: number;
  targetCareerRole: string;
}

export interface Competency {
  id: string;
  name: string;
  domain: CompetencyDomain;
  domainName: string;
  description: string;
  currentScore: number; // 0 - 100
  targetScore: number; // 0 - 100
  gapScore: number; // target - current (min 0)
  importance: PriorityLevel;
  proficiencyLevel: ProficiencyLevel;
  lastAssessedDate?: string;
  assessmentHistory: {
    date: string;
    score: number;
    source: string;
  }[];
  officialReference: string; // e.g., "NSSTA Competency Framework Sec 4.2"
}

export interface SkillGapItem {
  id: string;
  competencyId: string;
  competencyName: string;
  domain: CompetencyDomain;
  currentScore: number;
  targetScore: number;
  gapScore: number;
  priority: PriorityLevel;
  recommendedAction: string;
  urgencyReason: string;
  recommendedCourseId?: string;
}

export interface IGOTCourse {
  courseId: string;
  title: string;
  provider: string; // e.g., "NSSTA", "ISTM", "NIC", "NITI Aayog", "IIPA"
  category: string;
  domain: CompetencyDomain;
  competency: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string; // e.g. "4 Hours", "2 Weeks"
  durationMinutes: number;
  language: string;
  rating: number; // 0 - 5.0
  enrolledCount: number;
  description: string;
  url: string;
  source: 'iGOT Karmayogi' | 'NSSTA Portal' | 'Swayam Plus';
  relevanceScore: number; // 0 - 100
  recommendationReason: string;
  expectedBenefit: string;
  enrolled?: boolean;
  progressPercent?: number;
  completed?: boolean;
  thumbnailColor: string;
}

export interface LearningPathItem {
  id: string;
  title: string;
  type: 'course' | 'quiz' | 'reading' | 'practical_case';
  duration: string;
  completed: boolean;
}

export interface LearningPathPhase {
  phaseNumber: number;
  phaseName: string; // e.g. "Phase 1 — Foundation"
  title: string;
  competencyAddressed: string;
  duration: string;
  priority: PriorityLevel;
  reason: string;
  expectedImprovement: number; // e.g. +15 pts
  status: 'completed' | 'in_progress' | 'upcoming';
  courseId?: string;
  courseTitle?: string;
  items: LearningPathItem[];
}

export type LearningPhase = LearningPathPhase;

export interface LearningPath {
  id: string;
  userId: string;
  title: string;
  targetRole: string;
  overallProgress: number; // 0 - 100
  estimatedCompletionWeeks: number;
  phases: LearningPathPhase[];
  updatedAt: string;
}

export interface NSSTATrainingProgramme {
  id: string;
  programmeName: string;
  code: string;
  competency: string;
  domain: CompetencyDomain;
  targetAudience: string;
  duration: string;
  deliveryMode: 'Residential (NSSTA Greater Noida)' | 'Online Interactive' | 'Hybrid';
  eligibility: string;
  recommendationReason: string;
  status: 'Nominated' | 'Eligible' | 'Completed' | 'Application Open';
  commencementDate: string;
  seatsTotal: number;
  seatsFilled: number;
  venue: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'factual' | 'conceptual' | 'scenario-based' | 'application-based';
  competencyTag: string;
  sourceReference: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  materialId?: string;
  materialName?: string;
  domain: CompetencyDomain;
  competency: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  questionCount: number;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
  isPublished: boolean;
  createdBy: string;
  createdAt: string;
  totalAttempts?: number;
  averageScore?: number;
}

export interface EvaluatedAnswer {
  questionId: string;
  questionText: string;
  selectedOptionIndex: number;
  selectedOptionText: string;
  correctOptionIndex: number;
  correctOptionText: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  userId: string;
  userName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTakenSeconds: number;
  completedAt: string;
  competencyUpdated: string;
  competencyScoreDelta: number;
  passed?: boolean;
  competencyBoosted?: boolean;
  competencyDelta?: number;
  answers: {
    questionId: string;
    selectedOptionIndex: number;
    isCorrect: boolean;
  }[];
  strongAreas: string[];
  weakAreas: string[];
  recommendedNextLearning: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  filename: string;
  fileSizeKb: number;
  fileType: 'txt' | 'pdf' | 'docx' | 'pptx';
  contentSnippet: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  associatedDomain: CompetencyDomain;
  associatedCompetency: string;
  generatedQuizId?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'recommendation' | 'assessment' | 'quiz_result' | 'training' | 'competency_boost' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  details: string;
  ipAddress: string;
}

export interface AdminAnalytics {
  totalEmployees: number;
  totalWorkforce?: number;
  activeLearners: number;
  averageCompetency: number;
  highPriorityGapsCount: number;
  highPriorityGaps?: number;
  coursesCompletedTotal: number;
  quizzesTakenTotal: number;
  trainingEffectivenessIndex: number; // e.g. 87.4%
  competencyDistribution: {
    domain: string;
    avgScore: number;
    targetScore: number;
  }[];
  departmentComparison: {
    department: string;
    employeeCount: number;
    avgCompetency: number;
    gapScore: number;
  }[];
  departmentStats?: {
    department: string;
    averageScore: number;
    employeeCount?: number;
  }[];
  emergingSkills: {
    skill: string;
    domain?: string;
    growthPercent?: number;
    growthRate?: string;
    enrolledLearners?: number;
    demandLevel?: PriorityLevel;
  }[];
  recentActivity: {
    id: string;
    user: string;
    action: string;
    time: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedFollowUps?: string[];
}
