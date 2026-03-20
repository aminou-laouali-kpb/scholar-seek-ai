import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  GraduationCap, Target, Users, Globe2, CheckCircle2, ArrowRight,
  MessageCircle, BookOpen, Award, Lightbulb, BarChart3, Clock, ShieldCheck,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { track } from "@/lib/analytics";

const WA_LINK = "https://wa.me/33768674292";

const FulbrightLanding = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const en = language === "en";

  const handleCTA = () => {
    track("fulbright_cta_clicked");
    if (!user) {
      navigate("/login?redirect=/scholarships/fulbright/test");
    } else if (!profile?.profile_completed) {
      navigate("/complete-profile?redirect=/scholarships/fulbright/test");
    } else {
      navigate("/scholarships/fulbright/test");
    }
  };

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const fadeUp = {
    hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  };

  return (
    <>
      <SEOHead
        title={en ? "Fulbright Scholarship Eligibility Test | KPB Education" : "Test d'éligibilité Fulbright | KPB Éducation"}
        description={en ? "Check your Fulbright eligibility and get your personalized application roadmap. Free pre-eligibility test by KPB Education." : "Testez votre éligibilité Fulbright et obtenez votre plan de candidature personnalisé. Test gratuit par KPB Éducation."}
      />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden gradient-hero py-24 md:py-32 px-5 sm:px-6">
        <motion.div variants={stagger} initial="hidden" animate="show" className="relative max-w-2xl mx-auto text-center space-y-7">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-white">
            <span>🇺🇸</span>
            <span>{en ? "Fulbright Scholarship Program" : "Programme de bourse Fulbright"}</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white leading-[1.1] tracking-tight">
            {en
              ? <>Study in the United States with a <span className="text-gradient-accent">fully funded</span> scholarship</>
              : <>Étudiez aux États-Unis avec une bourse <span className="text-gradient-accent">entièrement financée</span></>}
          </motion.h1>

          <motion.p variants={fadeUp} className="text-white/80 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            {en
              ? "Find out if your profile matches Fulbright requirements. Get a personalized readiness assessment and action plan in minutes."
              : "Découvrez si votre profil correspond aux exigences Fulbright. Obtenez une évaluation personnalisée et un plan d'action en quelques minutes."}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={handleCTA} size="lg" variant="accent" className="text-base px-8 py-6 w-full sm:w-auto">
              {en ? "Check my Fulbright eligibility" : "Tester mon éligibilité Fulbright"}
              <ArrowRight className="w-5 h-5" />
            </Button>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
                <MessageCircle className="w-5 h-5" />
                {en ? "Talk to an advisor" : "Parler à un conseiller"}
              </Button>
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 pt-2">
            {[
              { icon: Clock, label: en ? "5 min" : "5 min" },
              { icon: ShieldCheck, label: en ? "100% free" : "100% gratuit" },
              { icon: Target, label: en ? "Personalized result" : "Résultat personnalisé" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 text-xs text-white/90 font-medium">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── VALUE SECTION ─── */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="text-center mb-10">
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl sm:text-3xl text-foreground">
              {en ? "What you'll get from this test" : "Ce que ce test vous apporte"}
            </motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Target, title: en ? "Profile compatibility" : "Compatibilité du profil", desc: en ? "Know if your profile matches Fulbright criteria" : "Savoir si votre profil correspond aux critères Fulbright" },
              { icon: BarChart3, title: en ? "Strengths & gaps" : "Forces et lacunes", desc: en ? "Identify what makes you stand out and what to improve" : "Identifiez ce qui vous distingue et ce qu'il faut améliorer" },
              { icon: Lightbulb, title: en ? "Clear action plan" : "Plan d'action clair", desc: en ? "Get personalized next steps to strengthen your application" : "Obtenez des étapes concrètes pour renforcer votre candidature" },
              { icon: Clock, title: en ? "Save time" : "Gagnez du temps", desc: en ? "Stop guessing — know exactly where you stand" : "Arrêtez de deviner — sachez exactement où vous en êtes" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-card rounded-2xl p-6 shadow-card border border-border text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FULBRIGHT OVERVIEW ─── */}
      <section className="section-padding bg-secondary/30">
        <div className="container-narrow mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="max-w-3xl mx-auto">
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl sm:text-3xl text-foreground text-center mb-6">
              {en ? "What is Fulbright?" : "Qu'est-ce que Fulbright ?"}
            </motion.h2>
            <motion.div variants={fadeUp} className="bg-card rounded-2xl p-6 sm:p-8 shadow-card border border-border space-y-4">
              {[
                { icon: Award, text: en ? "A prestigious U.S. government-funded international exchange program" : "Un programme d'échange international prestigieux, financé par le gouvernement américain" },
                { icon: GraduationCap, text: en ? "Primarily for graduate-level study and research in the United States" : "Principalement destiné aux études de master et à la recherche aux États-Unis" },
                { icon: Globe2, text: en ? "Open to students worldwide — highly selective, with full funding" : "Ouvert aux étudiants du monde entier — très sélectif, avec financement complet" },
                { icon: Users, text: en ? "Designed for strong academic profiles with leadership potential" : "Conçu pour des profils académiques solides avec un potentiel de leadership" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <p className="text-foreground text-base leading-relaxed">{text}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── WHO IS THIS FOR ─── */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl sm:text-3xl text-foreground text-center mb-8">
              {en ? "This test is for you if…" : "Ce test est fait pour vous si…"}
            </motion.h2>
            <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                en ? "You want to study in the United States" : "Vous voulez étudier aux États-Unis",
                en ? "You hold or are completing a bachelor's degree" : "Vous avez ou terminez une licence",
                en ? "You have leadership experience or potential" : "Vous avez de l'expérience ou du potentiel en leadership",
                en ? "You have a serious academic or professional project" : "Vous avez un projet académique ou professionnel sérieux",
                en ? "You want to know if Fulbright is realistic for you" : "Vous voulez savoir si Fulbright est réaliste pour vous",
                en ? "You want a clear action plan" : "Vous voulez un plan d'action clair",
              ].map((text, i) => (
                <motion.div key={i} variants={fadeUp} className="flex items-start gap-3 bg-card rounded-xl p-4 border border-border">
                  <CheckCircle2 className="w-5 h-5 text-[hsl(var(--success))] shrink-0 mt-0.5" />
                  <p className="text-foreground text-sm leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── WHAT THE TEST EVALUATES ─── */}
      <section className="section-padding bg-secondary/30">
        <div className="container-narrow mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl sm:text-3xl text-foreground text-center mb-3">
              {en ? "What the test evaluates" : "Ce que le test évalue"}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground text-center text-sm mb-8 max-w-xl mx-auto">
              {en
                ? "Our assessment covers the key dimensions that Fulbright programs typically consider."
                : "Notre évaluation couvre les dimensions clés généralement considérées par les programmes Fulbright."}
            </motion.p>
            <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: GraduationCap, label: en ? "Academic level" : "Niveau académique" },
                { icon: BookOpen, label: en ? "Study project clarity" : "Clarté du projet d'études" },
                { icon: Users, label: en ? "Leadership & community" : "Leadership et communauté" },
                { icon: Globe2, label: en ? "English readiness" : "Niveau d'anglais" },
                { icon: Target, label: en ? "U.S. study motivation" : "Motivation pour les USA" },
                { icon: Lightbulb, label: en ? "Future goals clarity" : "Clarté des objectifs" },
                { icon: BarChart3, label: en ? "Application readiness" : "Préparation à candidater" },
              ].map(({ icon: Icon, label }, i) => (
                <motion.div key={i} variants={fadeUp} className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border">
                  <Icon className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-foreground text-sm font-medium">{label}</span>
                </motion.div>
              ))}
            </motion.div>
            <motion.p variants={fadeUp} className="text-muted-foreground text-xs text-center mt-5">
              {en
                ? "Note: Final Fulbright requirements vary by country and official program calls."
                : "Note : Les exigences finales de Fulbright varient selon les pays et les appels officiels."}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── WHAT YOU GET AFTER ─── */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="max-w-3xl mx-auto text-center">
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl sm:text-3xl text-foreground mb-8">
              {en ? "What you'll receive after the test" : "Ce que vous recevrez après le test"}
            </motion.h2>
            <motion.div variants={stagger} className="grid sm:grid-cols-2 gap-4 text-left">
              {[
                { icon: Target, text: en ? "Pre-eligibility result with your fit level" : "Résultat de pré-éligibilité avec votre niveau de compatibilité" },
                { icon: CheckCircle2, text: en ? "Key strengths identified in your profile" : "Points forts identifiés dans votre profil" },
                { icon: Lightbulb, text: en ? "Main gaps to address before applying" : "Principales lacunes à combler avant de postuler" },
                { icon: BookOpen, text: en ? "Personalized application roadmap" : "Feuille de route de candidature personnalisée" },
                { icon: ArrowRight, text: en ? "Recommended next steps" : "Prochaines étapes recommandées" },
                { icon: Users, text: en ? "Support options through KPB Education" : "Options d'accompagnement via KPB Éducation" },
              ].map(({ icon: Icon, text }, i) => (
                <motion.div key={i} variants={fadeUp} className="flex items-start gap-3 bg-card rounded-xl p-4 border border-border">
                  <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-foreground text-sm leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── MID CTA ─── */}
      <section className="py-16 px-5 sm:px-6 gradient-hero">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger} className="max-w-xl mx-auto text-center space-y-5">
          <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl sm:text-3xl text-white">
            {en ? "Ready to check your profile?" : "Prêt(e) à évaluer votre profil ?"}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/80 text-base">
            {en
              ? "It takes less than 5 minutes and it's completely free."
              : "Cela prend moins de 5 minutes et c'est entièrement gratuit."}
          </motion.p>
          <motion.div variants={fadeUp}>
            <Button onClick={handleCTA} size="lg" variant="accent" className="text-base px-8 py-6">
              {en ? "Start the test now" : "Commencer le test maintenant"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto max-w-2xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl sm:text-3xl text-foreground text-center mb-8">
              {en ? "Frequently asked questions" : "Questions fréquentes"}
            </motion.h2>
            <Accordion type="single" collapsible className="space-y-3">
              {[
                {
                  q: en ? "Is this the official Fulbright application?" : "Est-ce la candidature officielle Fulbright ?",
                  a: en ? "No. This is a free pre-eligibility assessment by KPB Education. It helps you understand your profile's fit before applying through official channels." : "Non. C'est une évaluation de pré-éligibilité gratuite par KPB Éducation. Elle vous aide à comprendre la compatibilité de votre profil avant de postuler via les canaux officiels.",
                },
                {
                  q: en ? "Does passing this test guarantee selection?" : "Réussir ce test garantit-il la sélection ?",
                  a: en ? "No. This test provides an indicative assessment. Final selection depends on the official Fulbright process in your country." : "Non. Ce test fournit une évaluation indicative. La sélection finale dépend du processus Fulbright officiel dans votre pays.",
                },
                {
                  q: en ? "Do I need a bachelor's degree?" : "Faut-il avoir une licence ?",
                  a: en ? "Fulbright programs typically require at least a bachelor's degree. You can still take the test if you're completing your degree." : "Les programmes Fulbright exigent généralement au moins une licence. Vous pouvez quand même passer le test si vous terminez votre diplôme.",
                },
                {
                  q: en ? "Can I take the test if I'm not sure about my chances?" : "Puis-je passer le test même si je ne suis pas sûr(e) de mes chances ?",
                  a: en ? "Absolutely. The test is designed to help you understand where you stand and what steps to take next." : "Absolument. Le test est conçu pour vous aider à comprendre où vous en êtes et quelles étapes suivre.",
                },
                {
                  q: en ? "What happens after I log in?" : "Que se passe-t-il après ma connexion ?",
                  a: en ? "You'll be directed to the eligibility test. After completing it, you'll receive your personalized result and action plan." : "Vous serez dirigé(e) vers le test d'éligibilité. Après l'avoir complété, vous recevrez votre résultat personnalisé et votre plan d'action.",
                },
                {
                  q: en ? "Is this test really free?" : "Ce test est-il vraiment gratuit ?",
                  a: en ? "Yes, 100% free. No payment required. It's a KPB Education guidance tool to help students explore opportunities." : "Oui, 100% gratuit. Aucun paiement requis. C'est un outil d'orientation KPB Éducation pour aider les étudiants à explorer les opportunités.",
                },
              ].map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl border border-border px-5">
                  <AccordionTrigger className="text-foreground text-sm sm:text-base font-medium text-left py-4">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ─── BOTTOM CTA + TRUST ─── */}
      <section className="section-padding bg-secondary/30">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger} className="container-narrow mx-auto text-center space-y-6">
          <motion.h2 variants={fadeUp} className="font-heading font-bold text-2xl sm:text-3xl text-foreground">
            {en ? "Take the first step toward Fulbright" : "Faites le premier pas vers Fulbright"}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground text-base max-w-lg mx-auto">
            {en
              ? "Join thousands of students who have used KPB Education tools to clarify their study abroad journey."
              : "Rejoignez des milliers d'étudiants qui ont utilisé les outils KPB Éducation pour clarifier leur projet d'études à l'étranger."}
          </motion.p>
          <motion.div variants={fadeUp}>
            <Button onClick={handleCTA} size="lg" variant="accent" className="text-base px-8 py-6">
              {en ? "Check my Fulbright eligibility" : "Tester mon éligibilité Fulbright"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
          <motion.p variants={fadeUp} className="text-muted-foreground text-xs max-w-md mx-auto">
            {en
              ? "This is a KPB Education guidance tool. Final eligibility and selection depend on the official Fulbright process in your country."
              : "Ceci est un outil d'orientation KPB Éducation. L'éligibilité et la sélection finales dépendent du processus Fulbright officiel dans votre pays."}
          </motion.p>
        </motion.div>
      </section>
    </>
  );
};

export default FulbrightLanding;
