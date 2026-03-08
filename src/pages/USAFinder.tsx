import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, GraduationCap, DollarSign, BookOpen, Globe2, Award, MessageCircle, CheckCircle2, Building2, School } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const WA_LINK = "https://wa.me/33768674292";

interface QuizStep {
  key: string;
  icon: any;
}

const STEPS: QuizStep[] = [
  { key: "studyLevel", icon: GraduationCap },
  { key: "field", icon: BookOpen },
  { key: "budget", icon: DollarSign },
  { key: "institution", icon: Building2 },
  { key: "scholarship", icon: Award },
  { key: "english", icon: Globe2 },
];

type Answers = Record<string, string>;

function computeResults(answers: Answers, isEn: boolean) {
  const results: { type: string; title: string; description: string; pros: string[]; cost: string; match: number }[] = [];

  const budgetLevel = answers.budget;
  const prefersCC = answers.institution === "community-college" || answers.institution === "both";
  const prefersUni = answers.institution === "university" || answers.institution === "both";
  const wantsScholarship = answers.scholarship === "yes" || answers.scholarship === "maybe";

  if (prefersCC || budgetLevel === "low") {
    results.push({
      type: "community-college",
      title: isEn ? "Community College → Transfer Pathway" : "Community College → Passerelle Universitaire",
      description: isEn
        ? "Start at an affordable community college, then transfer to a 4-year university. This is the smartest budget-friendly path to a US degree."
        : "Commencez dans un community college abordable, puis transférez vers une université de 4 ans. C'est la voie la plus intelligente et économique vers un diplôme américain.",
      pros: isEn
        ? ["Tuition as low as $5,000–$10,000/year", "Easier admission requirements", "2+2 transfer agreements with top universities", "Smaller class sizes, more support"]
        : ["Frais dès 5 000–10 000 $/an", "Conditions d'admission plus souples", "Accords de transfert 2+2 avec de grandes universités", "Petites classes, plus de soutien"],
      cost: isEn ? "$5,000 – $12,000/year" : "5 000 – 12 000 $/an",
      match: budgetLevel === "low" ? 95 : 80,
    });
  }

  if (prefersUni && (budgetLevel === "low" || budgetLevel === "medium")) {
    results.push({
      type: "state-university",
      title: isEn ? "Public State University" : "Université Publique d'État",
      description: isEn
        ? "State universities offer excellent education at more affordable rates than private institutions, with strong research programs and campus life."
        : "Les universités d'État offrent une excellente éducation à des tarifs plus abordables que les institutions privées, avec de solides programmes de recherche.",
      pros: isEn
        ? ["Lower tuition than private universities", "Strong research and career programs", "Large alumni networks", "Full campus experience"]
        : ["Frais inférieurs aux universités privées", "Programmes de recherche solides", "Grands réseaux d'anciens", "Expérience campus complète"],
      cost: isEn ? "$15,000 – $30,000/year" : "15 000 – 30 000 $/an",
      match: budgetLevel === "medium" ? 90 : 70,
    });
  }

  if (prefersUni && (budgetLevel === "medium" || budgetLevel === "high")) {
    results.push({
      type: "private-university",
      title: isEn ? "Private Research University" : "Université Privée de Recherche",
      description: isEn
        ? "Top-tier private universities with world-class faculty, cutting-edge research, and unmatched career opportunities. Many offer generous financial aid."
        : "Universités privées de premier rang avec des professeurs de renommée mondiale, une recherche de pointe et des opportunités de carrière inégalées.",
      pros: isEn
        ? ["World-renowned programs and faculty", "Strong financial aid packages", "Extensive career services", "Global alumni network"]
        : ["Programmes et professeurs de renommée mondiale", "Aides financières généreuses", "Services de carrière étendus", "Réseau mondial d'anciens"],
      cost: isEn ? "$35,000 – $60,000/year" : "35 000 – 60 000 $/an",
      match: budgetLevel === "high" ? 90 : 65,
    });
  }

  if (wantsScholarship) {
    results.push({
      type: "scholarship-path",
      title: isEn ? "Scholarship-Funded Pathway" : "Parcours Financé par Bourse",
      description: isEn
        ? "Many US institutions offer scholarships for international students. With the right strategy, you can significantly reduce your costs."
        : "De nombreuses institutions américaines offrent des bourses aux étudiants internationaux. Avec la bonne stratégie, vous pouvez réduire significativement vos coûts.",
      pros: isEn
        ? ["Merit & need-based scholarships available", "Athletic scholarships at many universities", "Community colleges offer international aid", "KPB advisors help identify opportunities"]
        : ["Bourses au mérite et selon les besoins disponibles", "Bourses sportives dans de nombreuses universités", "Les community colleges offrent des aides internationales", "Les conseillers KPB vous aident à identifier les opportunités"],
      cost: isEn ? "Varies — $0 to partial coverage" : "Variable — 0 $ à couverture partielle",
      match: 85,
    });
  }

  // Always have at least 2 results
  if (results.length < 2) {
    results.push({
      type: "state-university",
      title: isEn ? "Public State University" : "Université Publique d'État",
      description: isEn
        ? "A balanced choice offering quality education with reasonable costs and strong support for international students."
        : "Un choix équilibré offrant une éducation de qualité à des coûts raisonnables avec un bon soutien aux étudiants internationaux.",
      pros: isEn
        ? ["Affordable tuition", "Strong programs", "Campus life", "Career support"]
        : ["Frais abordables", "Programmes solides", "Vie de campus", "Soutien carrière"],
      cost: isEn ? "$15,000 – $30,000/year" : "15 000 – 30 000 $/an",
      match: 75,
    });
  }

  return results.sort((a, b) => b.match - a.match).slice(0, 4);
}

const USAFinder = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);

  const steps = t("usaFinder.steps") as { title: string; subtitle: string; options: { value: string; label: string }[] }[];

  const selectAnswer = (value: string) => {
    setAnswers({ ...answers, [STEPS[step].key]: value });
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else setShowResults(true);
  };

  const prev = () => {
    if (showResults) setShowResults(false);
    else if (step > 0) setStep(step - 1);
  };

  const results = computeResults(answers, isEn);

  const features = isEn
    ? [
        "Personalized university & community college recommendations",
        "Budget-based pathway matching",
        "Scholarship opportunity identification",
        "University vs community college comparison",
        "Transfer pathway planning",
        "Admissions readiness assessment",
      ]
    : [
        "Recommandations personnalisées d'universités et community colleges",
        "Matching de parcours basé sur le budget",
        "Identification d'opportunités de bourses",
        "Comparaison université vs community college",
        "Planification de parcours de transfert",
        "Évaluation de la préparation aux admissions",
      ];

  const faqs = isEn
    ? [
        { q: "What's the difference between a university and a community college?", a: "Universities offer 4-year bachelor's degrees and graduate programs. Community colleges offer 2-year associate degrees with the option to transfer to a university to complete a bachelor's — often at much lower cost." },
        { q: "Can I transfer from a community college to a top university?", a: "Yes! Many top universities including UCLA, UC Berkeley, and others have transfer agreements with community colleges. It's a proven pathway used by thousands of students." },
        { q: "How much does it cost to study in the USA?", a: "Costs vary widely: community colleges start around $5,000/year, state universities $15,000–$30,000/year, and private universities $35,000–$60,000/year. Scholarships and financial aid can significantly reduce these costs." },
        { q: "Are there scholarships for international students in the USA?", a: "Yes! Many US institutions offer merit-based and need-based scholarships for international students. Some community colleges also offer tuition waivers. Our advisors can help you find the best options." },
      ]
    : [
        { q: "Quelle est la différence entre une université et un community college ?", a: "Les universités offrent des diplômes de 4 ans (bachelor's) et des programmes de master/doctorat. Les community colleges offrent des diplômes de 2 ans avec possibilité de transfert vers une université — souvent à un coût bien inférieur." },
        { q: "Peut-on transférer d'un community college vers une grande université ?", a: "Oui ! De nombreuses grandes universités comme UCLA, UC Berkeley et d'autres ont des accords de transfert avec les community colleges. C'est un parcours éprouvé utilisé par des milliers d'étudiants." },
        { q: "Combien coûtent les études aux États-Unis ?", a: "Les coûts varient énormément : les community colleges débutent à ~5 000 $/an, les universités publiques 15 000–30 000 $/an, et les universités privées 35 000–60 000 $/an. Les bourses peuvent réduire considérablement ces coûts." },
        { q: "Existe-t-il des bourses pour les étudiants internationaux aux USA ?", a: "Oui ! De nombreuses institutions américaines offrent des bourses au mérite et selon les besoins aux étudiants internationaux. Nos conseillers peuvent vous aider à trouver les meilleures options." },
      ];

  const institutionTypes = isEn
    ? [
        { icon: Building2, title: "Universities", desc: "4-year institutions offering bachelor's, master's, and PhD programs. Include both public (state) and private universities." },
        { icon: School, title: "Colleges", desc: "Often smaller institutions focused on undergraduate education. Liberal arts colleges are known for personalized teaching." },
        { icon: GraduationCap, title: "Community Colleges", desc: "2-year institutions offering associate degrees and transfer pathways to universities. Most affordable option with strong student support." },
      ]
    : [
        { icon: Building2, title: "Universités", desc: "Institutions de 4 ans offrant des programmes de licence, master et doctorat. Incluent les universités publiques (d'État) et privées." },
        { icon: School, title: "Colleges", desc: "Institutions souvent plus petites axées sur l'enseignement de premier cycle. Les liberal arts colleges sont réputés pour un enseignement personnalisé." },
        { icon: GraduationCap, title: "Community Colleges", desc: "Institutions de 2 ans offrant des diplômes d'associé et des passerelles vers les universités. Option la plus abordable avec un fort soutien aux étudiants." },
      ];

  if (showResults) {
    return (
      <div className="min-h-screen">
        <section className="gradient-hero section-padding">
          <div className="container-narrow mx-auto text-center">
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-primary-foreground">
              {isEn ? "Your USA Study Recommendations" : "Vos Recommandations d'Études aux USA"}
            </h1>
            <p className="mt-3 text-primary-foreground/80 max-w-2xl mx-auto">
              {isEn ? "Based on your profile, here are the best pathways for you." : "Basé sur votre profil, voici les meilleurs parcours pour vous."}
            </p>
          </div>
        </section>
        <section className="section-padding bg-background">
          <div className="container-narrow mx-auto max-w-4xl">
            <div className="grid gap-6">
              {results.map((r, i) => (
                <motion.div key={r.type + i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl p-6 shadow-card border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading font-bold text-lg text-foreground">{r.title}</h3>
                    <span className="bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full">{r.match}% {isEn ? "match" : "compatibilité"}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{r.description}</p>
                  <div className="grid sm:grid-cols-2 gap-2 mb-4">
                    {r.pros.map((p, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                        <span className="text-foreground text-xs">{p}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-accent">{isEn ? "Estimated cost:" : "Coût estimé :"} {r.cost}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                <Button variant="default" size="xl">
                  <MessageCircle className="w-5 h-5" />
                  {isEn ? "Discuss with an Advisor" : "Discuter avec un Conseiller"}
                </Button>
              </a>
              <Button variant="outline" size="lg" onClick={() => { setShowResults(false); setStep(0); setAnswers({}); }}>
                {isEn ? "Retake the Quiz" : "Refaire le Quiz"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-2 mb-6">
              <Globe2 className="w-4 h-4 text-accent" />
              <span className="text-primary-foreground/80 text-sm font-medium">{t("tools.usa.benefit")}</span>
            </div>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">{t("tools.usa.title")}</h1>
            <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">{t("tools.usa.description")}</p>
          </motion.div>
        </div>
      </section>

      {/* Institution Types */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto max-w-4xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground text-center mb-8">
            {isEn ? "Types of US Institutions" : "Types d'Institutions Américaines"}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {institutionTypes.map((inst, i) => {
              const Icon = inst.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl p-6 border border-border shadow-card text-center">
                  <Icon className="w-10 h-10 text-accent mx-auto mb-4" />
                  <h3 className="font-heading font-bold text-foreground mb-2">{inst.title}</h3>
                  <p className="text-muted-foreground text-sm">{inst.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section className="section-padding bg-secondary/50">
        <div className="container-narrow mx-auto max-w-2xl">
          <h2 className="font-heading font-bold text-2xl text-foreground text-center mb-2">
            {isEn ? "Find Your Best USA Pathway" : "Trouvez Votre Meilleur Parcours aux USA"}
          </h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            {isEn ? "Answer 6 quick questions to get personalized recommendations." : "Répondez à 6 questions rapides pour des recommandations personnalisées."}
          </p>
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-muted-foreground">
                {t("usaFinder.step")} {step + 1} / {STEPS.length}
              </span>
            </div>
            <Progress value={((step + 1) / STEPS.length) * 100} className="mb-6 h-2" />
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
                <h3 className="font-heading font-bold text-lg text-foreground mb-1">{steps[step]?.title}</h3>
                <p className="text-muted-foreground text-sm mb-5">{steps[step]?.subtitle}</p>
                <div className="grid gap-3">
                  {steps[step]?.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => selectAnswer(opt.value)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                        answers[STEPS[step].key] === opt.value
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border bg-background text-foreground hover:border-accent/40"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={prev} disabled={step === 0}>
                <ArrowLeft className="w-4 h-4" /> {t("usaFinder.prev")}
              </Button>
              <Button variant="default" onClick={next} disabled={!answers[STEPS[step].key]}>
                {step === STEPS.length - 1 ? t("usaFinder.finish") : t("usaFinder.next")} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto max-w-4xl">
          <h2 className="font-heading font-bold text-2xl text-foreground text-center mb-8">
            {isEn ? "What This Tool Does" : "Ce Que Cet Outil Fait"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-card p-4 rounded-xl border border-border">
                <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <span className="text-foreground text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-secondary/50">
        <div className="container-narrow mx-auto max-w-3xl">
          <h2 className="font-heading font-bold text-2xl text-foreground text-center mb-8">
            {isEn ? "Frequently Asked Questions" : "Questions Fréquentes"}
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl border border-border px-6">
                <AccordionTrigger className="font-heading font-semibold text-foreground text-left py-4">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-accent section-padding">
        <div className="container-narrow mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl text-accent-foreground">
            {isEn ? "Need Personalized Help for the USA?" : "Besoin d'Aide Personnalisée pour les USA ?"}
          </h2>
          <p className="mt-3 text-accent-foreground/80">
            {isEn ? "Our advisors specialize in US admissions for African students" : "Nos conseillers sont spécialisés dans les admissions US pour les étudiants africains"}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <Button variant="default" size="lg"><MessageCircle className="w-4 h-4" /> {isEn ? "Chat with an Advisor" : "Discuter avec un Conseiller"}</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default USAFinder;
