import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Users,
  Clock,
  AlertTriangle,
  ArrowRight,
  Smartphone,
  Heart,
  MessageCircle,
  GraduationCap,
  FileSearch,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { track } from "@/lib/analytics";

const WA_NUMBER = "33768674292";

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
    show: { transition: { staggerChildren: 0.1 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <>
      <SEOHead
        title="Recours gracieux après refus Études en France | KPB Éducation"
        description="Refus sur Études en France ? Découvre si un recours gracieux est pertinent pour toi. Analyse gratuite, résultat immédiat. Outil KPB Éducation."
      />

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden py-20 md:py-28 px-4">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-95" />
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative max-w-3xl mx-auto text-center space-y-6"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-white/90">
            <ShieldCheck className="w-4 h-4" />
            Outil 100% gratuit
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.1]">
            Refusé sur Études en France ?
            <br />
            <span className="text-accent">Vérifie tes options en 5 min.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base md:text-lg text-white/75 max-w-xl mx-auto leading-relaxed">
            Recours gracieux, école privée, ou les deux ? Notre outil d'analyse
            gratuit t'aide à comprendre la meilleure suite à donner à ton dossier.
          </motion.p>

          <motion.div variants={fadeUp}>
            <Button
              size="lg"
              onClick={handleCTA}
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-base md:text-lg px-8 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all active:scale-[0.97]"
            >
              Tester gratuitement mon dossier
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 text-sm text-white/50">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 5 minutes</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> Mobile-friendly</span>
            <span>•</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Gratuit</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── What is a recours gracieux? ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="py-16 md:py-20 px-4 bg-background"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <motion.h2 variants={fadeUp} className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center">
            C'est quoi un recours gracieux ?
          </motion.h2>
          <motion.div variants={fadeUp} className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Un <strong className="text-foreground">recours gracieux</strong> est une demande formelle adressée
              à l'établissement qui t'a refusé(e), pour lui demander de reconsidérer sa décision.
              Ce n'est pas un procès, ce n'est pas compliqué, et c'est ton droit.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Il s'agit d'un courrier argumenté qui explique pourquoi ta candidature mérite une seconde lecture.
              Bien préparé, un recours peut ouvrir des portes qui semblaient fermées.
            </p>
            <div className="flex items-start gap-3 bg-secondary/50 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Important :</strong> un recours n'est pas toujours la meilleure option.
                Parfois, sécuriser une admission en école privée est plus stratégique.
                C'est exactement ce que notre outil t'aide à déterminer.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ─── How it works ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="py-16 md:py-20 px-4 bg-secondary/30"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2 variants={fadeUp} className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-12">
            Comment ça marche ?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ClipboardList, step: "1", title: "Remplis le formulaire", desc: "Quelques questions sur ta situation, tes refus et ton parcours. 5 minutes suffisent." },
              { icon: Brain, step: "2", title: "Analyse de ton dossier", desc: "Notre outil évalue la cohérence de ton projet, la force de tes arguments et tes options." },
              { icon: Compass, step: "3", title: "Ton plan d'action", desc: "Recours, plan B en école privée, ou les deux ? Tu repars avec une recommandation claire." },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <s.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── Who can do a recours? ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="py-16 md:py-20 px-4 bg-background"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          <motion.h2 variants={fadeUp} className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center">
            Qui peut faire un recours ?
          </motion.h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: GraduationCap, text: "Tu as postulé via Études en France (Campus France)" },
              { icon: FileSearch, text: "Tu as reçu un ou plusieurs refus d'admission" },
              { icon: Clock, text: "Ton refus date de moins de 2 mois (idéalement)" },
              { icon: CheckCircle2, text: "Tu penses avoir des arguments valides pour contester" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-start gap-3 bg-card border border-border rounded-xl p-5"
              >
                <item.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground leading-relaxed">{item.text}</span>
              </motion.div>
            ))}
          </div>
          <motion.p variants={fadeUp} className="text-center text-sm text-muted-foreground">
            Pas sûr(e) de remplir ces critères ? L'outil t'aidera à le déterminer.
          </motion.p>
        </div>
      </motion.section>

      {/* ─── Trust / Stats ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="py-16 md:py-20 px-4 bg-secondary/30"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2 variants={fadeUp} className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
            Pourquoi les étudiants nous font confiance
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { stat: "5 min", label: "Temps d'analyse" },
              { stat: "100%", label: "Gratuit" },
              { stat: "4", label: "Catégories de recommandation" },
              { stat: "24h", label: "Suivi personnalisé" },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-card border border-border rounded-xl p-5 text-center">
                <p className="font-heading text-2xl md:text-3xl font-bold text-primary">{s.stat}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── CTA intermédiaire ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="py-14 px-4 bg-background"
      >
        <motion.div variants={fadeUp} className="max-w-xl mx-auto text-center space-y-5">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">
            Prêt(e) à savoir quoi faire ?
          </h2>
          <p className="text-muted-foreground text-sm">
            L'analyse est gratuite, confidentielle et prend 5 minutes.
          </p>
          <Button
            size="lg"
            onClick={handleCTA}
            className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 rounded-xl font-semibold text-base active:scale-[0.97] transition-all"
          >
            Tester gratuitement mon dossier
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </motion.div>
      </motion.section>

      {/* ─── FAQ ─── */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="py-16 md:py-20 px-4 bg-secondary/30"
      >
        <div className="max-w-2xl mx-auto">
          <motion.h2 variants={fadeUp} className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
            Questions fréquentes
          </motion.h2>
          <Accordion type="single" collapsible className="space-y-2">
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
                a: "Le formulaire prend environ 5 minutes à remplir. Le résultat est immédiat.",
              },
              {
                q: "Dois-je créer un compte ?",
                a: "Oui, un compte gratuit est nécessaire pour accéder à l'outil. Cela te permet de retrouver tes résultats et d'accéder à des recommandations personnalisées sur ton tableau de bord.",
              },
              {
                q: "L'outil est-il vraiment gratuit ?",
                a: "Oui, à 100%. L'analyse d'éligibilité est entièrement gratuite. Si tu souhaites ensuite un accompagnement pour la rédaction du recours ou une admission en école privée, KPB propose des services payants.",
              },
              {
                q: "Mes données sont-elles protégées ?",
                a: "Oui. Tes informations sont stockées de manière sécurisée et ne sont jamais partagées avec des tiers.",
              },
            ].map((faq, i) => (
              <motion.div key={i} variants={fadeUp}>
                <AccordionItem value={`faq-${i}`} className="bg-card border border-border rounded-xl px-4">
                  <AccordionTrigger className="text-left font-medium text-sm md:text-base">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </motion.section>

      {/* ─── Reassurance ─── */}
      <section className="py-12 px-4 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Heart className="w-6 h-6 mx-auto opacity-80" />
          <p className="font-heading font-semibold text-lg">
            Tu n'es pas seul(e) dans cette situation.
          </p>
          <p className="text-primary-foreground/70 text-sm max-w-xl mx-auto leading-relaxed">
            Des milliers d'étudiants reçoivent des refus chaque année sur Études en France.
            L'important, c'est d'agir vite et de prendre la bonne décision.
            KPB Éducation est là pour t'aider.
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
