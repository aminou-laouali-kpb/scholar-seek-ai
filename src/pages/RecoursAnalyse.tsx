import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import RecoursHero from "@/components/recours/RecoursHero";
import RecoursHowItWorks from "@/components/recours/RecoursHowItWorks";
import RecoursBenefits from "@/components/recours/RecoursBenefits";
import RecoursForm from "@/components/recours/RecoursForm";
import RecoursResultView from "@/components/recours/RecoursResult";
import RecoursFAQ from "@/components/recours/RecoursFAQ";
import RecoursReassurance from "@/components/recours/RecoursReassurance";
import { track } from "@/lib/analytics";
import type { RecoursResult } from "@/lib/recoursEngine";

const RecoursAnalyse = () => {
  const [showForm, setShowForm] = useState(false);
  const [result, setResult] = useState<RecoursResult | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    track("recours_page_viewed");
  }, []);

  const handleStart = () => {
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleResult = (res: RecoursResult, _submissionId: string) => {
    setResult(res);
    setShowForm(false);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <SEOHead
        title="Analyse gratuite – Éligibilité au recours gracieux | KPB Éducation"
        description="Découvre gratuitement si un recours gracieux est pertinent après un refus sur Études en France. Outil gratuit KPB Éducation pour étudiants francophones."
      />

      {!result && <RecoursHero onStart={handleStart} />}

      {!showForm && !result && (
        <>
          <RecoursHowItWorks />
          <RecoursBenefits />
        </>
      )}

      {showForm && !result && (
        <div ref={formRef}>
          <RecoursForm onResult={handleResult} />
        </div>
      )}

      {result && (
        <div ref={resultRef}>
          <RecoursResultView result={result} />
        </div>
      )}

      {!result && <RecoursFAQ />}
      <RecoursReassurance />
    </>
  );
};

export default RecoursAnalyse;
