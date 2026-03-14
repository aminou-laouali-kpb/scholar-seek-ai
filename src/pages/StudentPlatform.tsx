import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  UserCheck, Globe2, GraduationCap, Bookmark, ListChecks,
  Headphones, ArrowRight, LogIn, MessageCircle,
  BarChart3, Star, ClipboardList, Heart, CheckCircle2, ShieldCheck
} from "lucide-react";

const WA_LINK = "https://wa.me/33768674292";

const StudentPlatform = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  if (loading) return null;

  const sp = t("studentPlatform") as Record<string, any>;
  const featureCards = sp.featureCards as { title: string; description: string }[];

  const icons = [UserCheck, Globe2, GraduationCap, Bookmark, ListChecks, Headphones];

  const previewCards = [
    { icon: BarChart3, title: isEn ? "Profile & Progress" : "Profil & Progression", desc: isEn ? "See your completion status and personalized guidance at a glance." : "Visualisez votre avancement et vos recommandations en un coup d'œil.", mock: isEn ? "Profile 80% complete" : "Profil complété à 80%" },
    { icon: Star, title: isEn ? "Scholarship Matches" : "Bourses Recommandées", desc: isEn ? "Scholarships ranked by relevance to your profile." : "Des bourses classées par pertinence selon votre profil.", mock: isEn ? "3 scholarships matched" : "3 bourses correspondantes" },
    { icon: ClipboardList, title: isEn ? "Next Steps" : "Prochaines Étapes", desc: isEn ? "Clear action items to keep your journey on track." : "Des actions claires pour avancer dans votre parcours.", mock: isEn ? "2 next steps pending" : "2 étapes en attente" },
    { icon: Heart, title: isEn ? "Saved & Priorities" : "Favoris & Priorités", desc: isEn ? "Bookmark opportunities and mark your top choices." : "Sauvegardez vos opportunités et marquez vos priorités.", mock: isEn ? "5 items saved" : "5 éléments sauvegardés" },
  ];

  const trustBadges = isEn
    ? ["Free account", "No commitment", "Guided by KPB advisors"]
    : ["Compte gratuit", "Sans engagement", "Guidé par les conseillers KPB"];

  const howItWorksSteps = isEn
    ? [
        { step: "1", title: "Sign Up", desc: "Create your free account in under 2 minutes." },
        { step: "2", title: "Complete Your Profile", desc: "Tell us about your goals, level, and preferences." },
        { step: "3", title: "Get Matched", desc: "Receive personalized scholarships, admissions, and next steps." },
      ]
    : [
        { step: "1", title: "Inscrivez-vous", desc: "Créez votre compte gratuit en moins de 2 minutes." },
        { step: "2", title: "Complétez votre profil", desc: "Parlez-nous de vos objectifs, niveau et préférences." },
        { step: "3", title: "Soyez mis en relation", desc: "Recevez des bourses, admissions et étapes personnalisées." },
      ];

  return (
    <div className="min-h-screen">
      <SEOHead title={isEn ? "Student Platform — KPB Education" : "Espace Étudiant — KPB Éducation"} description={String(sp.heroSubtitle)} />
      {/* Hero */}
      <section className="gradient-hero section-padding py-20 md:py-28">
        <div className="container-narrow mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-primary-foreground leading-tight">
              {sp.heroTitle}
            </h1>
            <p className="mt-5 text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {sp.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="accent" size="xl" className="w-full sm:w-auto">
                  {sp.ctaSignup} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="heroOutline" size="lg" className="w-full sm:w-auto">
                  <LogIn className="w-5 h-5" /> {sp.ctaLogin}
                </Button>
              </Link>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="heroOutline" size="lg" className="w-full sm:w-auto">
                  <MessageCircle className="w-5 h-5" /> {sp.ctaAdvisor}
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-accent/5 border-b border-accent/10 py-4">
        <div className="container-narrow mx-auto flex flex-wrap justify-center gap-3 md:gap-6">
          {trustBadges.map((badge, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
              <ShieldCheck className="w-4 h-4 text-accent" /> {badge}
            </span>
          ))}
        </div>
      </section>

      {/* What you can do */}
      <section className="section-padding bg-background py-16 md:py-24">
        <div className="container-narrow mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">{sp.whatYouCanDo}</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card, i) => {
              const Icon = icons[i] || UserCheck;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground text-lg mb-2">{card.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-secondary/30 py-16 md:py-20">
        <div className="container-narrow mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
              {isEn ? "How It Works" : "Comment Ça Marche"}
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {howItWorksSteps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="text-center">
                <div className="w-14 h-14 rounded-full gradient-hero flex items-center justify-center mx-auto mb-4 text-primary-foreground font-heading font-bold text-xl">
                  {step.step}
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="section-padding bg-background py-16 md:py-24">
        <div className="container-narrow mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">{sp.previewTitle}</h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">{sp.previewSubtitle}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {previewCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-card"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <card.icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground">{card.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary/40 rounded-full" style={{ width: `${60 + i * 10}%` }} />
                </div>
                <p className="mt-2 text-xs font-medium text-accent">{card.mock}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Parents */}
      <section className="bg-secondary/20 py-10 md:py-14">
        <div className="container-narrow mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <ShieldCheck className="w-10 h-10 text-accent mx-auto mb-3" />
            <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-2">
              {isEn ? "For Parents" : "Pour les Parents"}
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              {isEn
                ? "Parents, your child is in good hands. KPB Education provides structured guidance, verified partner schools, and personalized support at every step of the journey."
                : "Parents, votre enfant est entre de bonnes mains. KPB Education offre un accompagnement structuré, des écoles partenaires vérifiées et un suivi personnalisé à chaque étape du parcours."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-background py-16 md:py-20">
        <div className="container-narrow mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">{sp.finalCtaTitle}</h2>
            <p className="mt-3 text-muted-foreground text-lg">{sp.finalCtaSubtitle}</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="accent" size="xl" className="w-full sm:w-auto">
                  {sp.ctaSignup} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <MessageCircle className="w-5 h-5" /> {sp.ctaAdvisor}
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default StudentPlatform;
