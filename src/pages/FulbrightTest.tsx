import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb, MessageCircle, Award, ShieldCheck,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { track } from "@/lib/analytics";
import { evaluateFulbright, type FulbrightInput, type FulbrightResult } from "@/lib/fulbrightEngine";
import { countries } from "@/data/countries";

const WA_LINK = "https://wa.me/33768674292";
const TOTAL_STEPS = 4;

const FulbrightTest = () => {
  const { profile } = useAuth();
  const { language } = useLanguage();
  const en = language === "en";

  const [step, setStep] = useState(1);
  const [result, setResult] = useState<FulbrightResult | null>(null);

  const [form, setForm] = useState({
    countryOfCitizenship: profile?.country_of_birth || "",
    countryOfResidence: profile?.country_of_residence || "",
    degreeLevel: "",
    graduationStatus: "",
    fieldOfStudy: profile?.desired_program || "",
    gpaRange: "",
    englishReadiness: "",
    studyProjectClarity: "",
    studyProjectText: "",
    leadershipExperience: "",
    communityEngagement: "",
    motivationUS: "",
    motivationText: "",
    futureGoalsClarity: "",
    futureGoalsText: "",
    applicationCommitment: "",
    timeline: "",
  });

  useEffect(() => { track("fulbright_test_started"); }, []);
  useEffect(() => { track("fulbright_step_completed", { step }); }, [step]);

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const canNext = () => {
    if (step === 1) return form.countryOfCitizenship && form.degreeLevel && form.graduationStatus;
    if (step === 2) return form.gpaRange && form.englishReadiness && form.studyProjectClarity;
    if (step === 3) return form.leadershipExperience && form.communityEngagement && form.motivationUS;
    return form.applicationCommitment;
  };

  const handleSubmit = () => {
    const input: FulbrightInput = {
      degreeLevel: form.degreeLevel,
      graduationStatus: form.graduationStatus,
      gpaRange: form.gpaRange,
      fieldOfStudy: form.fieldOfStudy,
      studyProjectClarity: form.studyProjectClarity,
      leadershipExperience: form.leadershipExperience,
      communityEngagement: form.communityEngagement,
      motivationUS: form.motivationUS,
      englishReadiness: form.englishReadiness,
      futureGoalsClarity: form.futureGoalsClarity,
      applicationCommitment: form.applicationCommitment,
      countryOfCitizenship: form.countryOfCitizenship,
    };
    const res = evaluateFulbright(input);
    setResult(res);
    localStorage.setItem("fulbright_result", JSON.stringify(res));
    track("fulbright_test_completed", { level: res.level, score: res.score });
  };

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
    exit: { opacity: 0, x: -40, transition: { duration: 0.25 } },
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      <Label className="text-foreground text-sm font-medium">{label}</Label>
      {children}
    </div>
  );

  if (result) {
    const levelColors: Record<string, string> = {
      strong: "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]",
      promising: "bg-accent text-accent-foreground",
      early: "bg-orange-500 text-white",
      needs_prep: "bg-destructive text-destructive-foreground",
    };
    const levelLabels: Record<string, { fr: string; en: string }> = {
      strong: { fr: "Profil prometteur", en: "Strong potential" },
      promising: { fr: "Profil intéressant", en: "Promising profile" },
      early: { fr: "Profil en développement", en: "Developing profile" },
      needs_prep: { fr: "Préparation nécessaire", en: "Needs preparation" },
    };

    return (
      <div className="min-h-screen bg-secondary/30 py-12 px-4">
        <SEOHead title={en ? "Your Fulbright Result | KPB Education" : "Votre résultat Fulbright | KPB Éducation"} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto space-y-6">
          {/* Badge */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-card rounded-full px-4 py-2 text-sm font-medium text-muted-foreground border border-border">
              <span>🇺🇸</span> Fulbright
            </div>
            <div className={`inline-block rounded-full px-5 py-2 text-sm font-bold ${levelColors[result.level]}`}>
              {en ? levelLabels[result.level]?.en : levelLabels[result.level]?.fr} — {result.score}/100
            </div>
          </div>

          {/* Verdict */}
          <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-card border border-border space-y-5">
            <h2 className="font-heading font-bold text-xl text-foreground">
              {en ? "Your assessment" : "Votre évaluation"}
            </h2>
            <p className="text-foreground leading-relaxed">{en ? result.verdict_en : result.verdict_fr}</p>

            {/* Strengths */}
            {result.strengths.length > 0 && (
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[hsl(var(--success))]" />
                  {en ? "Your strengths" : "Vos points forts"}
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-[hsl(var(--success))] shrink-0 mt-0.5" />
                      {en ? s.en : s.fr}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gaps */}
            {result.gaps.length > 0 && (
              <div>
                <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-accent" />
                  {en ? "Areas to improve" : "Points à améliorer"}
                </h3>
                <ul className="space-y-2">
                  {result.gaps.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <AlertTriangle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      {en ? g.en : g.fr}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps */}
            <div>
              <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                {en ? "Recommended next steps" : "Prochaines étapes recommandées"}
              </h3>
              <ul className="space-y-2">
                {result.nextSteps.map((ns, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {en ? ns.en : ns.fr}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="flex-1" onClick={() => track("fulbright_result_cta_clicked", { type: "whatsapp" })}>
              <Button variant="accent" size="lg" className="w-full">
                <MessageCircle className="w-5 h-5" />
                {en ? "Get KPB guidance" : "Obtenir un accompagnement KPB"}
              </Button>
            </a>
            <Button variant="outline" size="lg" onClick={() => { setResult(null); setStep(1); }} className="flex-1">
              {en ? "Retake test" : "Refaire le test"}
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 bg-card rounded-xl p-4 border border-border">
            <ShieldCheck className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-muted-foreground text-xs leading-relaxed">
              {en
                ? "This is a KPB Education guidance tool. Final eligibility and selection depend on the official Fulbright process in your country."
                : "Ceci est un outil d'orientation KPB Éducation. L'éligibilité et la sélection finales dépendent du processus Fulbright officiel dans votre pays."}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-8 px-4">
      <SEOHead title={en ? "Fulbright Eligibility Test | KPB Education" : "Test d'éligibilité Fulbright | KPB Éducation"} />
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span>🇺🇸</span>
            <span>{en ? "Fulbright Eligibility Test" : "Test d'éligibilité Fulbright"}</span>
          </div>
          <h1 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
            {en ? "Let's evaluate your Fulbright profile" : "Évaluons votre profil Fulbright"}
          </h1>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>{en ? `Step ${step} of ${TOTAL_STEPS}` : `Étape ${step} sur ${TOTAL_STEPS}`}</span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <Progress value={(step / TOTAL_STEPS) * 100} className="h-2" />
        </div>

        {/* Form Steps */}
        <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-card border border-border">
          <AnimatePresence mode="wait">
            <motion.div key={step} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-5">
              {step === 1 && (
                <>
                  <h2 className="font-heading font-semibold text-lg text-foreground">
                    {en ? "Your profile" : "Votre profil"}
                  </h2>
                  <Field label={en ? "Country of citizenship" : "Pays de citoyenneté"}>
                    <Select value={form.countryOfCitizenship} onValueChange={v => set("countryOfCitizenship", v)}>
                      <SelectTrigger><SelectValue placeholder={en ? "Select country" : "Sélectionnez"} /></SelectTrigger>
                      <SelectContent>{countries.map(c => <SelectItem key={c.code} value={c.code}>{en ? c.nameEn : c.nameFr}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label={en ? "Country of residence" : "Pays de résidence"}>
                    <Select value={form.countryOfResidence} onValueChange={v => set("countryOfResidence", v)}>
                      <SelectTrigger><SelectValue placeholder={en ? "Select country" : "Sélectionnez"} /></SelectTrigger>
                      <SelectContent>{countries.map(c => <SelectItem key={c.code} value={c.code}>{en ? c.nameEn : c.nameFr}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label={en ? "Current degree level" : "Niveau de diplôme actuel"}>
                    <Select value={form.degreeLevel} onValueChange={v => set("degreeLevel", v)}>
                      <SelectTrigger><SelectValue placeholder={en ? "Select" : "Sélectionnez"} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bachelor_completed">{en ? "Bachelor's completed" : "Licence terminée"}</SelectItem>
                        <SelectItem value="bachelor_in_progress">{en ? "Bachelor's in progress" : "Licence en cours"}</SelectItem>
                        <SelectItem value="master_completed">{en ? "Master's completed" : "Master terminé"}</SelectItem>
                        <SelectItem value="other">{en ? "Other" : "Autre"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={en ? "Graduation status" : "Statut de diplôme"}>
                    <Select value={form.graduationStatus} onValueChange={v => set("graduationStatus", v)}>
                      <SelectTrigger><SelectValue placeholder={en ? "Select" : "Sélectionnez"} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="graduated">{en ? "Already graduated" : "Déjà diplômé(e)"}</SelectItem>
                        <SelectItem value="final_year">{en ? "Final year" : "Dernière année"}</SelectItem>
                        <SelectItem value="earlier">{en ? "Not yet in final year" : "Pas encore en dernière année"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={en ? "Field of study" : "Domaine d'études"}>
                    <Input value={form.fieldOfStudy} onChange={e => set("fieldOfStudy", e.target.value)} placeholder={en ? "e.g. Computer Science" : "ex. Informatique"} />
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="font-heading font-semibold text-lg text-foreground">
                    {en ? "Academic profile" : "Profil académique"}
                  </h2>
                  <Field label={en ? "Academic performance" : "Performance académique"}>
                    <Select value={form.gpaRange} onValueChange={v => set("gpaRange", v)}>
                      <SelectTrigger><SelectValue placeholder={en ? "Select" : "Sélectionnez"} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">{en ? "Excellent (top 10%)" : "Excellent (top 10%)"}</SelectItem>
                        <SelectItem value="good">{en ? "Good (top 30%)" : "Bon (top 30%)"}</SelectItem>
                        <SelectItem value="average">{en ? "Average" : "Moyen"}</SelectItem>
                        <SelectItem value="below_average">{en ? "Below average" : "En dessous de la moyenne"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={en ? "English readiness" : "Niveau d'anglais"}>
                    <Select value={form.englishReadiness} onValueChange={v => set("englishReadiness", v)}>
                      <SelectTrigger><SelectValue placeholder={en ? "Select" : "Sélectionnez"} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fluent">{en ? "Fluent / C1+" : "Courant / C1+"}</SelectItem>
                        <SelectItem value="intermediate">{en ? "Intermediate / B1-B2" : "Intermédiaire / B1-B2"}</SelectItem>
                        <SelectItem value="beginner">{en ? "Beginner / A1-A2" : "Débutant / A1-A2"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={en ? "Study project clarity" : "Clarté du projet d'études"}>
                    <Select value={form.studyProjectClarity} onValueChange={v => set("studyProjectClarity", v)}>
                      <SelectTrigger><SelectValue placeholder={en ? "Select" : "Sélectionnez"} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clear_detailed">{en ? "Clear and detailed" : "Clair et détaillé"}</SelectItem>
                        <SelectItem value="somewhat_clear">{en ? "Somewhat clear" : "Assez clair"}</SelectItem>
                        <SelectItem value="vague">{en ? "Vague" : "Vague"}</SelectItem>
                        <SelectItem value="not_sure">{en ? "Not sure yet" : "Pas encore sûr(e)"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={en ? "Describe your study project (optional)" : "Décrivez votre projet d'études (optionnel)"}>
                    <Textarea value={form.studyProjectText} onChange={e => set("studyProjectText", e.target.value)} placeholder={en ? "What do you want to study and why?" : "Que voulez-vous étudier et pourquoi ?"} rows={3} />
                  </Field>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="font-heading font-semibold text-lg text-foreground">
                    {en ? "Leadership & motivation" : "Leadership et motivation"}
                  </h2>
                  <Field label={en ? "Leadership experience" : "Expérience de leadership"}>
                    <Select value={form.leadershipExperience} onValueChange={v => set("leadershipExperience", v)}>
                      <SelectTrigger><SelectValue placeholder={en ? "Select" : "Sélectionnez"} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="significant">{en ? "Significant (led teams, organizations)" : "Significative (équipes, organisations)"}</SelectItem>
                        <SelectItem value="moderate">{en ? "Moderate (some roles)" : "Modérée (quelques rôles)"}</SelectItem>
                        <SelectItem value="minimal">{en ? "Minimal" : "Minimale"}</SelectItem>
                        <SelectItem value="none">{en ? "None" : "Aucune"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={en ? "Community engagement" : "Engagement communautaire"}>
                    <Select value={form.communityEngagement} onValueChange={v => set("communityEngagement", v)}>
                      <SelectTrigger><SelectValue placeholder={en ? "Select" : "Sélectionnez"} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="significant">{en ? "Significant (active in community projects)" : "Significatif (projets communautaires actifs)"}</SelectItem>
                        <SelectItem value="moderate">{en ? "Moderate" : "Modéré"}</SelectItem>
                        <SelectItem value="minimal">{en ? "Minimal" : "Minimal"}</SelectItem>
                        <SelectItem value="none">{en ? "None" : "Aucun"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={en ? "Motivation for studying in the U.S." : "Motivation pour étudier aux USA"}>
                    <Select value={form.motivationUS} onValueChange={v => set("motivationUS", v)}>
                      <SelectTrigger><SelectValue placeholder={en ? "Select" : "Sélectionnez"} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strong_specific">{en ? "Strong and specific" : "Forte et spécifique"}</SelectItem>
                        <SelectItem value="general_interest">{en ? "General interest" : "Intérêt général"}</SelectItem>
                        <SelectItem value="not_sure">{en ? "Not sure yet" : "Pas encore sûr(e)"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={en ? "Describe your motivation (optional)" : "Décrivez votre motivation (optionnel)"}>
                    <Textarea value={form.motivationText} onChange={e => set("motivationText", e.target.value)} rows={3} placeholder={en ? "Why do you want to study in the U.S.?" : "Pourquoi voulez-vous étudier aux États-Unis ?"} />
                  </Field>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="font-heading font-semibold text-lg text-foreground">
                    {en ? "Readiness" : "Préparation"}
                  </h2>
                  <Field label={en ? "Clarity of future goals" : "Clarté de vos objectifs futurs"}>
                    <Select value={form.futureGoalsClarity} onValueChange={v => set("futureGoalsClarity", v)}>
                      <SelectTrigger><SelectValue placeholder={en ? "Select" : "Sélectionnez"} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clear">{en ? "Clear — I know what I want to do after" : "Clairs — je sais ce que je veux faire après"}</SelectItem>
                        <SelectItem value="somewhat">{en ? "Somewhat clear" : "Assez clairs"}</SelectItem>
                        <SelectItem value="unclear">{en ? "Still figuring it out" : "Encore en réflexion"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={en ? "Describe your future goals (optional)" : "Décrivez vos objectifs futurs (optionnel)"}>
                    <Textarea value={form.futureGoalsText} onChange={e => set("futureGoalsText", e.target.value)} rows={3} placeholder={en ? "What do you plan to do after your studies?" : "Que prévoyez-vous de faire après vos études ?"} />
                  </Field>
                  <Field label={en ? "Application commitment" : "Engagement pour la candidature"}>
                    <Select value={form.applicationCommitment} onValueChange={v => set("applicationCommitment", v)}>
                      <SelectTrigger><SelectValue placeholder={en ? "Select" : "Sélectionnez"} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fully_committed">{en ? "Fully committed to apply" : "Pleinement engagé(e) à postuler"}</SelectItem>
                        <SelectItem value="considering">{en ? "Seriously considering" : "En réflexion sérieuse"}</SelectItem>
                        <SelectItem value="exploring">{en ? "Just exploring" : "J'explore simplement"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 gap-3">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(s => s - 1)}>
                <ArrowLeft className="w-4 h-4" />
                {en ? "Back" : "Retour"}
              </Button>
            ) : <div />}
            {step < TOTAL_STEPS ? (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()}>
                {en ? "Next" : "Suivant"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canNext()} variant="accent">
                <Award className="w-4 h-4" />
                {en ? "See my result" : "Voir mon résultat"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FulbrightTest;
