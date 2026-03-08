import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Index from "./pages/Index";
import Tools from "./pages/Tools";
import BelgiumFinder from "./pages/BelgiumFinder";
import FranceFinder from "./pages/FranceFinder";
import USAFinder from "./pages/USAFinder";
import CanadaFinder from "./pages/CanadaFinder";
import ChinaFinder from "./pages/ChinaFinder";
import ScholarshipTest from "./pages/ScholarshipTest";
import Services from "./pages/Services";
import Destinations from "./pages/Destinations";
import CountryDetail from "./pages/CountryDetail";
import Scholarships from "./pages/Scholarships";
import Blog from "./pages/Blog";
import Testimonials from "./pages/Testimonials";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import StudentPlatform from "./pages/StudentPlatform";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CompleteProfile from "./pages/CompleteProfile";
import Dashboard from "./pages/Dashboard";
import Questionnaire from "./pages/Questionnaire";
import Orientation from "./pages/Orientation";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminScholarships from "./pages/admin/AdminScholarships";
import AdminAdmissions from "./pages/admin/AdminAdmissions";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  if (loading) return null;
  if (user) {
    return <Navigate to={profile?.profile_completed ? "/dashboard" : "/complete-profile"} replace />;
  }
  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const CompleteProfileRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.profile_completed) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  if (authLoading || roleLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Admin routes — no Header/Footer */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="scholarships" element={<AdminScholarships />} />
                <Route path="admissions" element={<AdminAdmissions />} />
                <Route path="requests" element={<AdminRequests />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Public/student routes — with Header/Footer */}
              <Route path="*" element={
                <>
                  <Header />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/tools" element={<Tools />} />
                    <Route path="/tools/belgium" element={<BelgiumFinder />} />
                    <Route path="/tools/france" element={<FranceFinder />} />
                    <Route path="/tools/usa" element={<USAFinder />} />
                    <Route path="/tools/canada" element={<CanadaFinder />} />
                    <Route path="/tools/china" element={<ChinaFinder />} />
                    <Route path="/tools/scholarship-test" element={<ScholarshipTest />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/destinations" element={<Destinations />} />
                    <Route path="/destinations/:country" element={<CountryDetail />} />
                    <Route path="/scholarships" element={<Scholarships />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/student-platform" element={<StudentPlatform />} />
                    <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
                    <Route path="/signup" element={<AuthRoute><SignUp /></AuthRoute>} />
                    <Route path="/complete-profile" element={<CompleteProfileRoute><CompleteProfile /></CompleteProfileRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/questionnaire" element={<Questionnaire />} />
                    <Route path="/orientation" element={<ProtectedRoute><Orientation /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Footer />
                  <WhatsAppButton />
                </>
              } />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
