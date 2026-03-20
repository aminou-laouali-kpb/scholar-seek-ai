import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, CheckCircle2, AlertTriangle } from "lucide-react";
import type { FulbrightResult } from "@/lib/fulbrightEngine";
import { track } from "@/lib/analytics";

const FulbrightModule = () => {
  const { language } = useLanguage();
  const en = language === "en";
  const [result, setResult] = useState<FulbrightResult | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("fulbright_result");
      if (stored) setResult(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const levelColors: Record<string, string> = {
    strong: "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]",
    promising: "bg-accent text-accent-foreground",
    early: "bg-orange-500 text-white",
    needs_prep: "bg-destructive text-destructive-foreground",
  };

  const levelLabels: Record<string, { fr: string; en: string }> = {
    strong: { fr: "Profil prometteur", en: "Strong potential" },
    promising: { fr: "Profil intéressant", en: "Promising" },
    early: { fr: "En développement", en: "Developing" },
    needs_prep: { fr: "Préparation nécessaire", en: "Needs prep" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card rounded-2xl p-5 sm:p-6 shadow-card border border-border"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-2xl">🇺🇸</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-heading font-bold text-foreground text-lg">
              {en ? "Fulbright Scholarship" : "Bourse Fulbright"}
            </h3>
            <span className="inline-flex items-center gap-1 bg-accent/15 text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              <Award className="w-3 h-3" />
              {en ? "Campaign" : "Campagne"}
            </span>
          </div>

          {result ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${levelColors[result.level]}`}>
                  {en ? levelLabels[result.level]?.en : levelLabels[result.level]?.fr} — {result.score}/100
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.strengths.slice(0, 2).map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs text-[hsl(var(--success))]">
                    <CheckCircle2 className="w-3 h-3" /> {en ? s.en : s.fr}
                  </span>
                ))}
                {result.gaps.slice(0, 1).map((g, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs text-accent-foreground">
                    <AlertTriangle className="w-3 h-3" /> {en ? g.en : g.fr}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Link to="/scholarships/fulbright/test" onClick={() => track("fulbright_dashboard_retake")}>
                  <Button variant="outline" size="sm">
                    {en ? "Retake test" : "Refaire le test"}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {en
                  ? "Find out if you're a strong candidate for the Fulbright scholarship. Free eligibility test."
                  : "Découvrez si vous êtes un(e) bon(ne) candidat(e) pour la bourse Fulbright. Test d'éligibilité gratuit."}
              </p>
              <Link to="/scholarships/fulbright/test" onClick={() => track("fulbright_dashboard_start")}>
                <Button variant="accent" size="sm">
                  {en ? "Start the test" : "Commencer le test"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FulbrightModule;
