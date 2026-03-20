import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SEOHead from "@/components/SEOHead";
import RecoursForm from "@/components/recours/RecoursForm";
import RecoursResultView from "@/components/recours/RecoursResult";
import { track } from "@/lib/analytics";
import type { RecoursResult } from "@/lib/recoursEngine";

const RecoursAnalyse = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [result, setResult] = useState<RecoursResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    track("recours_page_viewed");
  }, []);

  // Auth gate is handled by ProtectedRoute in App.tsx
  // If profile incomplete, redirect to complete-profile with redirect back
  useEffect(() => {
    if (user && profile && !profile.profile_completed) {
      navigate("/complete-profile?redirect=/recours-gracieux/analyse", { replace: true });
    }
  }, [user, profile, navigate]);

  const handleResult = (res: RecoursResult, _submissionId: string) => {
    setResult(res);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Build pre-fill data from profile
  const prefill = profile ? {
    fullName: [profile.first_name, profile.last_name].filter(Boolean).join(" "),
    email: profile.email || "",
    whatsapp: profile.whatsapp || "",
    countryOfResidence: profile.country_of_residence || "",
    nationality: profile.country_of_birth || "",
    currentLevel: profile.study_level || "",
  } : undefined;

  return (
    <>
      <SEOHead
        title="Analyse gratuite – Éligibilité au recours gracieux | KPB Éducation"
        description="Découvre gratuitement si un recours gracieux est pertinent après un refus sur Études en France. Outil gratuit KPB Éducation pour étudiants francophones."
      />

      {!result && (
        <RecoursForm onResult={handleResult} prefillData={prefill} userId={user?.id} />
      )}

      {result && (
        <div ref={resultRef}>
          <RecoursResultView result={result} />
        </div>
      )}
    </>
  );
};

export default RecoursAnalyse;
