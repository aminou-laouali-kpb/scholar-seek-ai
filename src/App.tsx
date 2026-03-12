import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import { useAdminRole } from "@/hooks/useAdminRole";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";

// Lazy-loaded pages
const Index = lazy(() => import("./pages/Index"));
const Tools = lazy(() => import("./pages/Tools"));
const BelgiumFinder = lazy(() => import("./pages/BelgiumFinder"));
const FranceFinder = lazy(() => import("./pages/FranceFinder"));
const USAFinder = lazy(() => import("./pages/USAFinder"));
const CanadaFinder = lazy(() => import("./pages/CanadaFinder"));
const ChinaFinder = lazy(() => import("./pages/ChinaFinder"));
const ScholarshipTest = lazy(() => import("./pages/ScholarshipTest"));
const Services = lazy(() => import("./pages/Services"));
const Destinations = lazy(() => import("./pages/Destinations"));
const CountryDetail = lazy(() => import("./pages/CountryDetail"));
const Scholarships = lazy(() => import("./pages/Scholarships"));
const Blog = lazy(() => import("./pages/Blog"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const StudentPlatform = lazy(() => import("./pages/StudentPlatform"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const CompleteProfile = lazy(() => import("./pages/CompleteProfile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Questionnaire = lazy(() => import("./pages/Questionnaire"));
const Orientation = lazy(() => import("./pages/Orientation"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Partners = lazy(() => import("./pages/Partners"));
const CheckEmail = lazy(() => import("./pages/CheckEmail"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminScholarships = lazy(() => import("./pages/admin/AdminScholarships"));
const AdminAdmissions = lazy(() => import("./pages/admin/AdminAdmissions"));
const AdminPartnerPrograms = lazy(() => import("./pages/admin/AdminPartnerPrograms"));
const AdminRequests = lazy(() => import("./pages/admin/AdminRequests"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminContactRequests = lazy(() => import("./pages/admin/AdminContactRequests"));
const AdminQuestionnaire = lazy(() => import("./pages/admin/AdminQuestionnaire"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
);

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
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Admin login — public, no Header/Footer */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin routes — no Header/Footer */}
                <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="scholarships" element={<AdminScholarships />} />
                  <Route path="admissions" element={<AdminAdmissions />} />
                  <Route path="partner-programs" element={<AdminPartnerPrograms />} />
                  <Route path="requests" element={<AdminRequests />} />
                  <Route path="contact-requests" element={<AdminContactRequests />} />
                  <Route path="questionnaire" element={<AdminQuestionnaire />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="blog" element={<AdminBlog />} />
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
                      <Route path="/partners" element={<Partners />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogPost />} />
                      <Route path="/testimonials" element={<Testimonials />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/student-platform" element={<StudentPlatform />} />
                      <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
                      <Route path="/signup" element={<AuthRoute><SignUp /></AuthRoute>} />
                      <Route path="/check-email" element={<CheckEmail />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
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
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
