
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import CompanyProfile from "./pages/CompanyProfile";
import About from "./pages/About";
import JobDetails from "./pages/JobDetails";
import CategoryPage from "./pages/CategoryPage";
import ApplicationSuccess from "./pages/ApplicationSuccess";
import PostJob from "./pages/PostJob";
import Dashboard from "./pages/Dashboard";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import Auth from "./pages/Auth";
import CompanySignup from "./pages/CompanySignup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetails />} />
          <Route path="/company-profile/:id" element={<CompanyProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/application-success" element={<ApplicationSuccess />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/company-signup" element={<CompanySignup />} />
          
          {/* Protected Routes */}
          <Route path="/post-job" element={
            <ProtectedRoute requiredRole="employer">
              <PostJob />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="employer">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/applicant-dashboard" element={
            <ProtectedRoute requiredRole="applicant">
              <ApplicantDashboard />
            </ProtectedRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
