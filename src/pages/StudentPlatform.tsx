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
  BarChart3, Star, ClipboardList, Heart
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
    { icon: BarChart3, title: isEn ? "Profile & Progress" : "Profil & Progression", desc: isEn ? "See your completion status and personalized guidance at a glance." : "Visualisez votre avancement et vos recommandations en un coup d'œil." },
    { icon: Star, title: isEn ? "Scholarship Matches" : "Bourses Recommandées", desc: isEn ? "AI-matched scholarships ranked by relevance to your profile." : "Des bourses classées par pertinence selon votre profil." },
    { icon: ClipboardList, title: isEn ? "Next Steps" : "Prochaines Étapes", desc: isEn ? "Clear action items to keep your journey on track." : "Des actions claires pour avancer dans votre parcours." },
    { icon: Heart, title: isEn ? "Saved & Priorities" : "Favoris & Priorités", desc: isEn ? "Bookmark opportunities and mark your top choices." : "Sauvegardez vos opportunités et marquez vos priorités." },
  ];

  return (
    <div className="min-h-screen">
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
              <Link to="/signup">
                <Button variant="accent" size="xl">
                  {sp.ctaSignup} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="heroOutline" size="lg">
                  <LogIn className="w-5 h-5" /> {sp.ctaLogin}
                </Button>
              </Link>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                <Button variant="heroOutline" size="lg">
                  <MessageCircle className="w-5 h-5" /> {sp.ctaAdvisor}
                </Button>
              </a>
            </div>
          </motion.div>
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

      {/* Dashboard Preview */}
      <section className="section-padding bg-secondary/30 py-16 md:py-24">
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-background py-16 md:py-20">
        <div className="container-narrow mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">{sp.finalCtaTitle}</h2>
            <p className="mt-3 text-muted-foreground text-lg">{sp.finalCtaSubtitle}</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button variant="accent" size="xl">
                  {sp.ctaSignup} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg">
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
