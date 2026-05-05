import React, { useState } from "react";
import Sidebar from "./components/layout/Sidebar.jsx";
import AuthView from "./views/AuthView.jsx";
import OnboardingView from "./views/OnboardingView.jsx";
import DashboardView from "./views/DashboardView.jsx";
import WorkoutView from "./views/WorkoutView.jsx";
import ReportsView from "./views/ReportsView.jsx";
import CalendarView from "./views/CalendarView.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { user } = useAuth();

  // Em vez de derivar de state, derivamos do user
  const [currentView, setCurrentView] = useState("dashboard");

  if (!user) {
    return <AuthView />;
  }

  if (!user.onboarded) {
    return <OnboardingView onComplete={() => setCurrentView("dashboard")} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-[#0e0e0e] overflow-hidden text-white">
      <Sidebar currentView={currentView} setView={setCurrentView} />

      <main className="flex-1 overflow-hidden flex flex-col bg-[#0e0e0e]">
        {currentView === "dashboard" && <DashboardView setView={setCurrentView} />}
        {currentView === "workout"   && <WorkoutView   setView={setCurrentView} />}
        {currentView === "reports"   && <ReportsView />}
        {currentView === "calendar"  && <CalendarView  setView={setCurrentView} />}
      </main>
    </div>
  );
}
