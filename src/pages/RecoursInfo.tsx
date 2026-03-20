import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ShieldCheck,
  ClipboardList,
  Brain,
  Compass,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Smartphone,
  Heart,
  GraduationCap,
  FileSearch,
  Zap,
  Shield,
  Users,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { track } from "@/lib/analytics";

const RecoursInfo = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleCTA = () => {
    track("recours_cta_start_clicked");
    if (!user) {
      navigate("/login?redirect=/recours-gracieux/analyse");
    } else if (!profile?.profile_completed) {
      navigate("/complete-profile?redirect=/recours-gracieux/analyse");
    } else {
      navigate("/recours-gracieux/analyse");
    }
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <>
      <SEOHead
        title="Recours gracieux après refus Études en France | KPB Éducation"
        description="Refus sur Études en France ? Découvre si un recours gracieux est pertinent pour toi. Analyse gratuite, résultat immédiat. Outil KPB Éducation."
      />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden gradient-hero py-24 md:py-32 px-5 sm:px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative max-w-2xl mx-auto text-center space-y-7"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-white"
          >
            <ShieldCheck className="w-4 h-4" />
            Outil 100 % gratuit · Résultat immédiat
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-heading text-[1.75rem] sm:text-4xl md:text-5xl font-bold text-white leading-[1.15] tracking-tight"
          >
            Ton dossier a été refusé sur
            <br className="hidden sm:block" />{" "}
            <span className="text-accent">Études en France</span> ?
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg text-white/85 max-w-xl mx-auto leading-relaxed"
          >
            Pas de panique. En <strong className="text-white">5 minutes</strong>,
            notre outil analyse ta situation et te dit{" "}
            <strong className="text-white">exactement quoi faire</strong> :
            recours gracieux, école privée, ou les deux.
          </motion.p>

          <motion.div variants={fadeUp}>
            <Button
              size="lg"
              onClick={handleCTA}
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-base sm:text-lg px-8 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all active:scale-[0.97]"
            >
              Tester gratuitement mon dossier
              <ArrowRight className="w-5 h-5 ml-1.5" />
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-2.5"
          >
            {[
              { icon: Clock, text: "5 min" },
              { icon: Smartphone, text: "Sur téléphone" },
              { icon: ShieldCheck, text: "Gratuit" },
            ].map((item) => (
              <span
                key={item.text}
                className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3.5 py-1.5 text-sm text-white/80"
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.text}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── C'EST QUOI ? ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="py-16 md:py-24 px-5 sm:px-6 bg-background"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <motion.h2
            variants={fadeUp}
            className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center"
          >
            C'est quoi un recours gracieux ?
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-5"
          >
            <p className="text-muted-foreground text-base leading-relaxed">
              Quand une université française refuse ta candidature, tu as le
              droit de lui demander de{" "}
              <strong className="text-foreground">
                reconsidérer sa décision
              </strong>
              . C'est ce qu'on appelle un{" "}
              <strong className="text-foreground">recours gracieux</strong>.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              Concrètement, c'est un courrier argumenté où tu expliques pourquoi
              ta candidature mérite une seconde lecture. Ce n'est pas un procès,
              ce n'est pas compliqué — et{" "}
              <strong className="text-foreground">c'est ton droit</strong>.
            </p>
            <div className="flex items-start gap-3 bg-accent/5 border border-accent/15 rounded-xl p-4 md:p-5">
              <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <p className="text-foreground text-sm sm:text-base leading-relaxed">
                <strong>Attention :</strong> un recours n'est pas toujours la
                meilleure stratégie. Parfois, sécuriser une place en école
                privée est plus intelligent. C'est exactement ce que notre outil
                t'aide à déterminer.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ─── COMMENT ÇA MARCHE ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="py-16 md:py-24 px-5 sm:px-6 bg-secondary/30"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            variants={fadeUp}
            className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-12"
          >
            Comment ça marche ?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                icon: ClipboardList,
                step: "1",
                title: "Réponds aux questions",
                desc: "Quelques questions simples sur tes refus, ton parcours et tes objectifs. Ça prend 5 minutes.",
              },
              {
                icon: Brain,
                step: "2",
                title: "On analyse ton dossier",
                desc: "Notre outil évalue la pertinence d'un recours selon ta situation. Résultat immédiat.",
              },
              {
                icon: Compass,
                step: "3",
                title: "Tu sais quoi faire",
                desc: "Recours, école privée, ou les deux ? Tu repars avec un plan d'action clair.",
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <s.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center shadow-md">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground">
                  {s.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed max-w-xs mx-auto">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── ES-TU CONCERNÉ(E) ? ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="py-16 md:py-24 px-5 sm:px-6 bg-background"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          <motion.h2
            variants={fadeUp}
            className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center"
          >
            Es-tu concerné(e) ?
          </motion.h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: GraduationCap,
                text: "Tu as postulé via Études en France (Campus France)",
              },
              {
                icon: FileSearch,
                text: "Tu as reçu un ou plusieurs refus d'admission",
              },
              {
                icon: Clock,
                text: "Ton refus date de moins de 2 mois (idéalement)",
              },
              {
                icon: CheckCircle2,
                text: "Tu penses avoir des arguments pour contester la décision",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-start gap-3.5 bg-card border border-border rounded-xl p-5 md:p-6"
              >
                <item.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-base text-foreground leading-relaxed">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
          <motion.p
            variants={fadeUp}
            className="text-center text-base text-muted-foreground"
          >
            Pas sûr(e) ? Lance l'analyse — l'outil te dira exactement où tu en
            es.
          </motion.p>
        </div>
      </motion.section>

      {/* ─── POURQUOI NOUS FAIRE CONFIANCE ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="py-16 md:py-24 px-5 sm:px-6 bg-secondary/30"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            variants={fadeUp}
            className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-10"
          >
            Pourquoi des milliers d'étudiants nous font confiance
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: Zap, stat: "5 min", label: "Pour obtenir ton résultat" },
              {
                icon: Shield,
                stat: "100%",
                label: "Gratuit, sans engagement",
              },
              {
                icon: Compass,
                stat: "Claire",
                label: "Recommandation personnalisée",
              },
              {
                icon: Users,
                stat: "24h",
                label: "Suivi par notre équipe",
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-card border border-border rounded-xl p-5 md:p-6 text-center space-y-2"
              >
                <s.icon className="w-5 h-5 text-primary mx-auto" />
                <p className="font-heading text-2xl md:text-3xl font-bold text-primary tabular-nums">
                  {s.stat}
                </p>
                <p className="text-sm text-muted-foreground leading-snug">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── CTA INTERMÉDIAIRE ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="py-16 px-5 sm:px-6 bg-background"
      >
        <motion.div
          variants={fadeUp}
          className="max-w-xl mx-auto text-center space-y-5"
        >
          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">
            Chaque jour compte après un refus.
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Plus tu agis vite, plus tu as de chances de trouver la bonne
            solution. L'analyse est gratuite et confidentielle.
          </p>
          <Button
            size="lg"
            onClick={handleCTA}
            className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 rounded-xl font-semibold text-base active:scale-[0.97] transition-all"
          >
            Tester gratuitement mon dossier
            <ArrowRight className="w-5 h-5 ml-1.5" />
          </Button>
        </motion.div>
      </motion.section>

      {/* ─── FAQ ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="py-16 md:py-24 px-5 sm:px-6 bg-secondary/30"
      >
        <div className="max-w-2xl mx-auto">
          <motion.h2
            variants={fadeUp}
            className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-8"
          >
            Questions fréquentes
          </motion.h2>
          <Accordion type="single" collapsible className="space-y-2.5">
            {[
              {
                q: "Est-ce que cet outil garantit qu'un recours va fonctionner ?",
                a: "Non. L'outil fournit une orientation structurée basée sur ta situation, mais la décision finale appartient toujours à l'établissement. Aucun outil ne peut garantir le résultat d'un recours.",
              },
              {
                q: "Que faire si l'outil me recommande une école privée ?",
                a: "Si ton profil montre que le recours a peu de chances, il est souvent plus stratégique de sécuriser une admission en école privée pour ne pas perdre une année. KPB peut t'accompagner dans cette démarche.",
              },
              {
                q: "Combien de temps prend l'analyse ?",
                a: "Le formulaire prend environ 5 minutes. Le résultat s'affiche immédiatement après.",
              },
              {
                q: "Dois-je créer un compte ?",
                a: "Oui, un compte gratuit est nécessaire pour accéder à l'outil. Cela te permet de retrouver tes résultats et de recevoir des recommandations personnalisées.",
              },
              {
                q: "L'outil est-il vraiment gratuit ?",
                a: "Oui, à 100 %. L'analyse d'éligibilité est entièrement gratuite. Si tu souhaites un accompagnement pour rédiger le recours ou une admission en école privée, KPB propose des services payants.",
              },
              {
                q: "Mes données sont-elles protégées ?",
                a: "Oui. Tes informations sont stockées de manière sécurisée et ne sont jamais partagées avec des tiers.",
              },
            ].map((faq, i) => (
              <motion.div key={i} variants={fadeUp}>
                <AccordionItem
                  value={`faq-${i}`}
                  className="bg-card border border-border rounded-xl px-5"
                >
                  <AccordionTrigger className="text-left font-medium text-base py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </motion.section>

      {/* ─── REASSURANCE ─── */}
      <section className="py-14 md:py-16 px-5 sm:px-6 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <Heart className="w-7 h-7 mx-auto opacity-80" />
          <p className="font-heading font-semibold text-lg md:text-xl">
            Tu n'es pas seul(e) face à ce refus.
          </p>
          <p className="text-primary-foreground/75 text-base max-w-xl mx-auto leading-relaxed">
            Des milliers d'étudiants vivent la même chose chaque année.
            L'important, c'est d'agir vite et de faire le bon choix. KPB
            Éducation est là pour t'aider à avancer.
          </p>
          <Button
            size="lg"
            onClick={handleCTA}
            className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-5 rounded-xl font-semibold text-base active:scale-[0.97] transition-all mt-2"
          >
            Commencer mon analyse gratuite
          </Button>
        </div>
      </section>
    </>
  );
};

export default RecoursInfo;
