import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SIHDemoBanner } from "./components/SIHDemoBanner";
import { NotificationModal } from "./components/NotificationModal";
import { SearchModal } from "./components/SearchModal";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { EmployeeDashboard } from "./pages/EmployeeDashboard";
import { CompetencyProfilePage } from "./pages/CompetencyProfilePage";
import { SkillGapPage } from "./pages/SkillGapPage";
import { LearningPathPage } from "./pages/LearningPathPage";
import { IGOTCoursesPage } from "./pages/IGOTCoursesPage";
import { NSSTATrainingPage } from "./pages/NSSTATrainingPage";
import { QuizGeneratorPage } from "./pages/QuizGeneratorPage";
import { ActiveQuizPage } from "./pages/ActiveQuizPage";
import { AICopilotPage } from "./pages/AICopilotPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { TrainerDashboard } from "./pages/TrainerDashboard";
import { api } from "./services/api";
import { NotificationItem } from "./types";

const MainContent: React.FC = () => {
  const { user, role, activeTab, setActiveTab } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState<string>("quiz-na-01");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Fetch notifications
  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications();
      setNotifications(res.notifications);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  // Global Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMarkNotifRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  const handleStartQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
    setActiveTab("active-quiz");
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveTab("igot-courses");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Official Government Header */}
      <Header
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenNotifications={() => setIsNotifModalOpen(true)}
        unreadNotifsCount={unreadCount}
      />

      {/* SIH 2026 Evaluation Fast-Track Walkthrough Banner */}
      <SIHDemoBanner onStartQuiz={handleStartQuiz} />

      {/* Primary Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "landing" && (
          <LandingPage
            onStartDemo={() => {
              setActiveTab("dashboard");
            }}
          />
        )}

        {activeTab === "login" && (
          <LoginPage onSwitchToSignup={() => setActiveTab("signup")} />
        )}

        {activeTab === "signup" && (
          <SignupPage onSwitchToLogin={() => setActiveTab("login")} />
        )}

        {activeTab === "onboarding" && (
          <OnboardingPage onCompleted={() => setActiveTab("dashboard")} />
        )}

        {activeTab === "dashboard" && (
          <EmployeeDashboard
            onStartQuiz={handleStartQuiz}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {activeTab === "competency-profile" && (
          <CompetencyProfilePage
            onStartQuiz={handleStartQuiz}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {activeTab === "skill-gaps" && (
          <SkillGapPage
            onStartQuiz={handleStartQuiz}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {activeTab === "learning-path" && (
          <LearningPathPage
            onStartQuiz={handleStartQuiz}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {activeTab === "igot-courses" && (
          <IGOTCoursesPage
            initialSelectedId={selectedCourseId}
            onStartQuiz={handleStartQuiz}
          />
        )}

        {activeTab === "nssta-training" && <NSSTATrainingPage />}

        {activeTab === "quiz-generator" && (
          <QuizGeneratorPage onStartQuiz={handleStartQuiz} />
        )}

        {activeTab === "active-quiz" && (
          <ActiveQuizPage
            quizId={activeQuizId}
            onExit={() => setActiveTab("dashboard")}
            onGoToRadar={() => setActiveTab("skill-gaps")}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {activeTab === "copilot" && <AICopilotPage />}

        {activeTab === "admin" && <AdminDashboard />}

        {activeTab === "trainer" && (
          <TrainerDashboard onStartQuiz={handleStartQuiz} />
        )}
      </main>

      {/* Modals */}
      <NotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotifRead}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectCourse={handleSelectCourse}
        onSelectQuiz={handleStartQuiz}
      />

      {/* Official Government Institutional Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
