import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, MessageCircle, GraduationCap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StepOption {
  value: string;
  label: string;
  icon?: string;
}

const Questionnaire = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);

  const steps = t("questionnaire.steps") as Array<{
    title: string;
    subtitle: string;
    options: Array<{ value: string; label: string }>;
  }>;

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const selectAnswer = (value: string) => {
    setAnswers({ ...answers, [currentStep]: value });
  };

  const next = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // Determine result: if self-funded + clear destination → student platform, else → advisor
  const needsAdvisor = answers[3] !== "self-funded" || answers[4] === "not-sure";

  if (showResult) {
    return (
      <div className="min-h-screen bg-background">
        <section className="section-padding">
          <div className="container-narrow mx-auto max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-2xl p-8 md:p-12 shadow-card border border-border text-center"
            >
              <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-foreground mb-4">
                {t("questionnaire.result.title")}
              </h1>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                {needsAdvisor ? t("questionnaire.result.advisorDesc") : t("questionnaire.result.platformDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {needsAdvisor ? (
                  <>
                    <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                      <Button variant="hero" size="xl">
                        <MessageCircle className="w-5 h-5" />
                        {t("questionnaire.result.whatsapp")}
                      </Button>
                    </a>
                    <Button variant="default" size="xl" onClick={() => navigate("/contact")}>
                      {t("questionnaire.result.contact")}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="hero" size="xl" onClick={() => navigate("/signup")}>
                      <GraduationCap className="w-5 h-5" />
                      {t("questionnaire.result.signup")}
                    </Button>
                    <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                      <Button variant="default" size="xl">
                        <MessageCircle className="w-5 h-5" />
                        {t("questionnaire.result.whatsapp")}
                      </Button>
                    </a>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero bar */}
      <section className="gradient-hero py-10 md:py-14">
        <div className="container-narrow mx-auto px-4 text-center">
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-primary-foreground mb-2">
            {t("questionnaire.pageTitle")}
          </h1>
          <p className="text-primary-foreground/70 text-lg">
            {t("questionnaire.pageSubtitle")}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow mx-auto max-w-2xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{t("questionnaire.step")} {currentStep + 1} / {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl p-8 md:p-10 shadow-card border border-border"
            >
              <h2 className="font-heading font-bold text-2xl text-foreground mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-muted-foreground mb-8">{steps[currentStep].subtitle}</p>

              <div className="grid gap-3">
                {steps[currentStep].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => selectAnswer(option.value)}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 font-medium ${
                      answers[currentStep] === option.value
                        ? "border-primary bg-primary/5 text-foreground shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        answers[currentStep] === option.value ? "border-primary bg-primary" : "border-muted-foreground/30"
                      }`}>
                        {answers[currentStep] === option.value && (
                          <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={prev}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4" />
              {t("questionnaire.prev")}
            </Button>
            <Button
              variant="default"
              size="lg"
              onClick={next}
              disabled={answers[currentStep] === undefined}
            >
              {currentStep === totalSteps - 1 ? t("questionnaire.finish") : t("questionnaire.next")}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Questionnaire;
