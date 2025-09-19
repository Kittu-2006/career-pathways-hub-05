import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LoginPage } from "@/components/LoginPage";
import { Header } from "@/components/Header";
import { StudentDashboard } from "@/components/StudentDashboard";
import { MentorDashboard } from "@/components/MentorDashboard";
import { PlacementCellDashboard } from "@/components/PlacementCellDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { user, isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case "student":
        return <StudentDashboard />;
      case "mentor":
        return <MentorDashboard />;
      case "placement_cell":
        return <PlacementCellDashboard />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={renderDashboard()} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
