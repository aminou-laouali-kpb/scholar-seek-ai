import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { track } from "@/lib/analytics";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

function computeResults(answers: Record<number, string>): string[] {
  const scores: Record<string, number> = {
    engineering: 0, business: 0, health: 0, arts: 0, law: 0, sciences: 0,
  };
  const subjectMap: Record<string, string[]> = { sciences: ["sciences", "engineering"], technology: ["engineering"], business: ["business"], arts: ["arts"], health: ["health"], law: ["law"] };
  (subjectMap[answers[0]] || []).forEach(f => scores[f] += 3);
  const workMap: Record<string, string[]> = { people: ["business", "health", "law"], data: ["engineering", "sciences"], ideas: ["arts", "law"], hands: ["engineering", "sciences"] };
  (workMap[answers[1]] || []).forEach(f => scores[f] += 2);
  const envMap: Record<string, string[]> = { office: ["business", "law"], lab: ["sciences", "health", "engineering"], outdoors: ["sciences", "engineering"], creative: ["arts"] };
  (envMap[answers[2]] || []).forEach(f => scores[f] += 1);
  const careerMap: Record<string, string[]> = { salary: ["engineering", "business"], impact: ["health", "law"], creativity: ["arts"], stability: ["sciences", "business"] };
  (careerMap[answers[3]] || []).forEach(f => scores[f] += 1);
  const mathMap: Record<string, string[]> = { love: ["engineering", "sciences"], okay: ["business", "health"], avoid: ["arts", "law"] };
  (mathMap[answers[4]] || []).forEach(f => scores[f] += 2);
  const aspMap: Record<string, string[]> = { leadership: ["business"], expertise: ["sciences", "engineering"], entrepreneurship: ["business", "engineering"], service: ["health", "law"] };
  (aspMap[answers[5]] || []).forEach(f => scores[f] += 1);
  return Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([key]) => key);
}

const Orientation = () => {
  const { t } = useLanguage();
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  const steps = t("orientation.steps") as Array<{ title: string; subtitle: string; options: Array<{ value: string; label: string }> }>;
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const selectAnswer = (value: string) => setAnswers({ ...answers, [currentStep]: value });
  const next = () => currentStep < totalSteps - 1 ? setCurrentStep(currentStep + 1) : setShowResult(true);
  const prev = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  const recommendedFields = useMemo(() => showResult ? computeResults(answers) : [], [showResult, answers]);
  const fieldsData = t("orientation.result.fields") as Record<string, { title: string; desc: string }>;

  const selectField = async (fieldKey: string) => {
    if (user) {
      await supabase.from("profiles").update({
        orientation_result: fieldKey,
        desired_program: fieldsData[fieldKey]?.title || fieldKey,
      }).eq("user_id", user.id);
      await refreshProfile();
      // Fire-and-forget activity log
      supabase
        .from("activity_logs")
        .insert({ user_id: user.id, action: "orientation_completed", details: { field: fieldKey } } as any)
        .then(() => {});
    }
    navigate("/dashboard");
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-background">
        <section className="gradient-hero py-10 md:py-14">
          <div className="container-narrow mx-auto px-4 text-center">
            <Sparkles className="w-10 h-10 text-accent mx-auto mb-3" />
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-primary-foreground">{t("orientation.result.title")}</h1>
            <p className="text-primary-foreground/70 text-lg mt-2 max-w-2xl mx-auto">{t("orientation.result.subtitle")}</p>
          </div>
        </section>
        <section className="section-padding">
          <div className="container-narrow mx-auto max-w-3xl">
            <div className="grid gap-4">
              {recommendedFields.map((key, i) => {
                const field = fieldsData[key];
                if (!field) return null;
                return (
                  <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border hover:border-accent/30 hover:shadow-card-hover transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {i === 0 && <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded">#1 Match</span>}
                        </div>
                        <h3 className="font-heading font-bold text-xl text-foreground mb-2">{field.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{field.desc}</p>
                      </div>
                      <Button variant="accent" size="sm" onClick={() => selectField(key)} className="shrink-0">
                        <CheckCircle2 className="w-4 h-4" />{t("orientation.result.selectCta")}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="gradient-hero py-10 md:py-14">
        <div className="container-narrow mx-auto px-4 text-center">
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-primary-foreground mb-2">{t("orientation.pageTitle")}</h1>
          <p className="text-primary-foreground/70 text-lg">{t("orientation.pageSubtitle")}</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-narrow mx-auto max-w-2xl">
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{t("orientation.step")} {currentStep + 1} / {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="bg-card rounded-2xl p-5 md:p-10 shadow-card border border-border">
              <h2 className="font-heading font-bold text-2xl text-foreground mb-2">{steps[currentStep].title}</h2>
              <p className="text-muted-foreground mb-8">{steps[currentStep].subtitle}</p>
              <div className="grid gap-3">
                {steps[currentStep].options.map((option) => (
                  <button key={option.value} onClick={() => selectAnswer(option.value)} className={`w-full text-left px-4 py-4 md:px-5 rounded-xl border-2 transition-all duration-200 font-medium text-sm md:text-base ${answers[currentStep] === option.value ? "border-primary bg-primary/5 text-foreground shadow-sm" : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-secondary/50"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${answers[currentStep] === option.value ? "border-primary bg-primary" : "border-muted-foreground/30"}`}>
                        {answers[currentStep] === option.value && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                      </div>
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-between mt-8">
            <Button variant="outline" size="lg" onClick={prev} disabled={currentStep === 0}><ArrowLeft className="w-4 h-4" /> {t("orientation.prev")}</Button>
            <Button variant="default" size="lg" onClick={next} disabled={answers[currentStep] === undefined}>{currentStep === totalSteps - 1 ? t("orientation.finish") : t("orientation.next")}<ArrowRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Orientation;
