import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
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
import Dashboard from "./pages/Dashboard";
import Questionnaire from "./pages/Questionnaire";
import Orientation from "./pages/Orientation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/belgium" element={<BelgiumFinder />} />
            <Route path="/tools/france" element={<FranceFinder />} />
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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/orientation" element={<Orientation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <WhatsAppButton />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
