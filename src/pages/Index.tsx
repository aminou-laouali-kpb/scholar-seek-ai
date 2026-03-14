import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { Search, GraduationCap, Award, ArrowRight, BookOpen, Globe2, Users, CheckCircle2, Star, FileText, MessageCircle, ShieldCheck, MapPin, Compass, ClipboardCheck, ChevronRight } from "lucide-react";
import heroImg from "@/assets/hero-students.jpg";
import SEOHead from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRef, useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const WA_LINK = "https://wa.me/33768674292";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

/* ─── Horizontal scroll section wrapper ─── */
const HScrollSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide ${className}`}>
    {children}
  </div>
);

const AnimatedStatPill = ({ target, suffix, label }: { target: number; suffix: string; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let frame: number;
    const duration = 1500;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView, target]);

  return (
    <div ref={ref} className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/15 rounded-full px-4 py-1.5 text-primary-foreground/90 text-xs sm:text-sm font-semibold">
      <span className="text-accent mr-1">✦</span>
      {count}{suffix} {label}
    </div>
  );
};

const Index = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const toolIcons = [Search, Globe2, GraduationCap, MapPin, Globe2, Award];
  const toolKeys = ["belgium", "france", "usa", "canada", "china", "scholarship"];
  const toolRoutes = ["/tools/belgium", "/tools/france", "/tools/usa", "/tools/canada", "/tools/china", "/tools/scholarship-test"];

  const serviceIcons = [Compass, GraduationCap, Award, FileText, ClipboardCheck, Users];
  const whyIcons = [MapPin, Search, CheckCircle2, MessageCircle];

  return (
    <div className="min-h-screen">
      <SEOHead
        title={t("hero.title") + " — KPB Education"}
        description={String(t("hero.subtitle"))}
        ogTitle="KPB Education — Study Abroad Platform"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "KPB Education",
          description: String(t("hero.subtitle")),
          url: "https://kpbeducation.com",
        }}
      />
      {/* ===== HERO — Split layout: image first on mobile ===== */}
      <section className="bg-[hsl(220,72%,14%)] overflow-hidden">
        {/* Mobile: hero image FIRST */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:hidden px-4 pt-8"
        >
          <div className="relative">
            <img src={heroImg} alt="Students celebrating" className="w-full rounded-2xl shadow-hero object-cover h-48 sm:h-64" />
            <div className="absolute -bottom-4 left-3 right-3">
              <div className="bg-card/95 backdrop-blur-md rounded-xl p-3 shadow-card-hover flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-heading font-bold text-foreground text-sm">{t("hero.stats.students")}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-accent text-accent" />)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 lg:pt-32 pb-12 md:pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div initial="hidden" animate="visible" className="text-center lg:text-left">
              <motion.h1 variants={fadeUp} custom={0} className="font-heading font-extrabold text-[2rem] leading-[1.15] sm:text-4xl lg:text-6xl text-primary-foreground">
                {t("hero.title")}
                <span className="block text-gradient-accent mt-1 sm:mt-2">{t("hero.titleHighlight")}</span>
              </motion.h1>

              <motion.p variants={fadeUp} custom={1} className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-primary-foreground/85 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t("hero.subtitle")}
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} custom={2} className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto text-base sm:text-lg h-14 sm:h-14">
                    {t("hero.ctaSignup")} <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button variant="heroOutline" size="xl" className="w-full sm:w-auto h-14 sm:h-14">
                    <MessageCircle className="w-5 h-5" /> {t("hero.cta2")}
                  </Button>
                </a>
                <Link to="/tools" className="w-full sm:w-auto">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto text-primary-foreground/70 hover:text-primary-foreground">
                    {t("hero.ctaTools")} <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>

              {/* Stats as pill badges */}
              <motion.div variants={fadeUp} custom={3} className="mt-6 md:mt-10 flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
                <AnimatedStatPill target={500} suffix="+" label={String(t("hero.statLabels.students") || "students guided")} />
                <AnimatedStatPill target={95} suffix="%" label={String(t("hero.statLabels.success") || "success rate")} />
                <AnimatedStatPill target={10} suffix="+" label={String(t("hero.statLabels.countries") || "countries")} />
              </motion.div>
            </motion.div>

            {/* Desktop: hero image on the right */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="hidden lg:block">
              <img src={heroImg} alt="Students celebrating" className="w-full rounded-2xl shadow-hero object-cover max-h-[480px]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TOOLS SPOTLIGHT ===== */}
      <section className="section-padding-compact bg-background">
        <div className="container-narrow mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-14">
            <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground">{t("tools.sectionTitle")}</h2>
            <p className="mt-3 text-muted-foreground text-sm md:text-lg">{t("tools.sectionSubtitle")}</p>
          </div>

          {isMobile ? (
            <HScrollSection>
              {toolKeys.map((key, i) => {
                const Icon = toolIcons[i];
                return (
                  <div key={key} className="min-w-[75vw] snap-start bg-card rounded-2xl p-5 shadow-card border border-border">
                    <div className="w-11 h-11 rounded-xl gradient-accent flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-foreground mb-1">{t(`tools.${key}.title`)}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-1.5">{t(`tools.${key}.description`)}</p>
                    <p className="text-xs font-semibold text-accent mb-3">{t(`tools.${key}.benefit`)}</p>
                    <Link to={toolRoutes[i]}>
                      <Button variant="default" size="sm" className="w-full">{t(`tools.${key}.cta`)} <ArrowRight className="w-4 h-4" /></Button>
                    </Link>
                  </div>
                );
              })}
            </HScrollSection>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {toolKeys.map((key, i) => {
                const Icon = toolIcons[i];
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover:border-accent/30"
                  >
                    <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-foreground mb-2">{t(`tools.${key}.title`)}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-2">{t(`tools.${key}.description`)}</p>
                    <p className="text-sm font-semibold text-accent mb-4">{t(`tools.${key}.benefit`)}</p>
                    <Link to={toolRoutes[i]}>
                      <Button variant="default" size="sm" className="w-full">{t(`tools.${key}.cta`)} <ArrowRight className="w-4 h-4" /></Button>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section-padding-compact bg-secondary/50">
        <div className="container-narrow mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-14">
            <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground">{t("howItWorks.title")}</h2>
            <p className="mt-3 text-muted-foreground text-sm md:text-lg">{t("howItWorks.subtitle")}</p>
          </div>

          {isMobile ? (
            /* Mobile: compact horizontal steps */
            <div className="flex gap-2 items-start">
              {["step1", "step2", "step3"].map((step, i) => (
                <div key={step} className="flex-1 text-center">
                  <div className="w-11 h-11 rounded-full gradient-hero flex items-center justify-center mx-auto mb-3 text-primary-foreground font-heading font-bold text-lg">
                    {i + 1}
                  </div>
                  <h3 className="font-heading font-bold text-xs text-foreground mb-1 leading-tight">{t(`howItWorks.${step}.title`)}</h3>
                  <p className="text-muted-foreground text-[11px] leading-snug">{t(`howItWorks.${step}.desc`)}</p>
                  {i < 2 && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground mx-auto mt-2 rotate-0 hidden" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {["step1", "step2", "step3"].map((step, i) => (
                <motion.div key={step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center">
                  <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center mx-auto mb-5 text-primary-foreground font-heading font-bold text-2xl">
                    {i + 1}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">{t(`howItWorks.${step}.title`)}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{t(`howItWorks.${step}.desc`)}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="section-padding-compact bg-background">
        <div className="container-narrow mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-14">
            <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground">{t("services.sectionTitle")}</h2>
            <p className="mt-3 text-muted-foreground text-sm md:text-lg">{t("services.sectionSubtitle")}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {(t("services.items") as Array<{ title: string; desc: string }>).map((item, i) => {
              const Icon = serviceIcons[i];
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl p-4 md:p-6 shadow-card border border-border hover:shadow-card-hover transition-all">
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-accent mb-3 md:mb-4" />
                  <h3 className="font-heading font-bold text-foreground text-sm md:text-base mb-1 md:mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-8 md:mt-10">
            <Link to="/services"><Button variant="default" size="lg" className="w-full sm:w-auto">{t("services.cta")} <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* ===== DESTINATIONS AT A GLANCE ===== */}
      <section className="section-padding-compact bg-secondary/40">
        <div className="container-narrow mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-6 md:mb-10">
            <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground">{t("destinationsGlance.title")}</h2>
            <p className="mt-2 text-muted-foreground text-sm md:text-lg">{t("destinationsGlance.subtitle")}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {[
              { key: "belgium", flag: "🇧🇪" }, { key: "france", flag: "🇫🇷" }, { key: "canada", flag: "🇨🇦" },
              { key: "usa", flag: "🇺🇸" }, { key: "china", flag: "🇨🇳" }, { key: "uk", flag: "🇬🇧" },
              { key: "germany", flag: "🇩🇪" }, { key: "spain", flag: "🇪🇸" }, { key: "turkey", flag: "🇹🇷" }, { key: "uae", flag: "🇦🇪" },
            ].map(({ key, flag }) => (
              <Link key={key} to={`/destinations/${key}`}>
                <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 bg-card rounded-full px-4 py-2.5 shadow-card border border-border hover:border-accent/30 hover:shadow-card-hover transition-all cursor-pointer">
                  <span className="text-2xl">{flag}</span>
                  <span className="font-heading font-semibold text-foreground text-sm">{t(`destinationsPage.countries.${key}.name`)}</span>
                </motion.div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/destinations"><Button variant="ghost" size="sm">{t("destinationsGlance.cta")} <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* ===== WHY KPB ===== */}
      <section className="section-padding-compact gradient-hero">
        <div className="container-narrow mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-14">
            <h2 className="font-heading font-bold text-2xl md:text-4xl text-primary-foreground">{t("whyKPB.title")}</h2>
            <p className="mt-3 text-primary-foreground/70 text-sm md:text-lg">{t("whyKPB.subtitle")}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            {(t("whyKPB.points") as Array<{ title: string; desc: string }>).map((point, i) => {
              const Icon = whyIcons[i];
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-primary-foreground/10">
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-accent mb-3 md:mb-4" />
                  <h3 className="font-heading font-bold text-primary-foreground text-sm md:text-lg mb-1 md:mb-2">{point.title}</h3>
                  <p className="text-primary-foreground/70 text-xs md:text-sm leading-relaxed">{point.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== STUDENT PLATFORM PROMO ===== */}
      <section className="section-padding-compact bg-background">
        <div className="container-narrow mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-r from-primary/5 to-accent/10 rounded-2xl p-8 md:p-12 border border-accent/20">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-7 h-7 text-accent-foreground" />
              </div>
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">{t("platformPromo.title")}</h2>
              <p className="mt-3 text-muted-foreground text-sm md:text-lg leading-relaxed">{t("platformPromo.subtitle")}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {(t("platformPromo.badges") as string[]).map((badge, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-accent/10 text-accent-foreground text-xs font-semibold rounded-full px-3 py-1.5 border border-accent/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> {badge}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/signup"><Button variant="accent" size="lg">{t("platformPromo.ctaPrimary")} <ArrowRight className="w-4 h-4" /></Button></Link>
                <Link to="/student-platform"><Button variant="outline" size="lg">{t("platformPromo.ctaSecondary")} <ArrowRight className="w-4 h-4" /></Button></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section-padding-compact bg-background">
        <div className="container-narrow mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-14">
            <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground">{t("testimonials.title")}</h2>
            <p className="mt-3 text-muted-foreground text-sm md:text-lg">{t("testimonials.subtitle")}</p>
          </div>

          {isMobile ? (
            <HScrollSection>
              {(t("testimonials.items") as Array<{ name: string; country: string; quote: string }>).map((item, i) => (
                <div key={i} className="min-w-[80vw] snap-start bg-card rounded-xl p-5 shadow-card border border-border">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-accent text-accent" />)}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed italic mb-4">"{item.quote}"</p>
                  <div>
                    <p className="font-heading font-bold text-foreground text-sm">{item.name}</p>
                    <p className="text-muted-foreground text-xs">{item.country}</p>
                  </div>
                </div>
              ))}
            </HScrollSection>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {(t("testimonials.items") as Array<{ name: string; country: string; quote: string }>).map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="bg-card rounded-xl p-6 shadow-card border border-border">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-accent text-accent" />)}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed italic mb-5">"{item.quote}"</p>
                  <div>
                    <p className="font-heading font-bold text-foreground text-sm">{item.name}</p>
                    <p className="text-muted-foreground text-xs">{item.country}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:mt-10">
            <Link to="/testimonials"><Button variant="outline" size="lg" className="w-full sm:w-auto">{t("testimonials.cta")} <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* ===== BLOG PREVIEW ===== */}
      <section className="section-padding-compact bg-secondary/50">
        <div className="container-narrow mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-14">
            <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground">{t("blogPreview.title")}</h2>
            <p className="mt-3 text-muted-foreground text-sm md:text-lg">{t("blogPreview.subtitle")}</p>
          </div>

          {isMobile ? (
            <HScrollSection>
              {(t("blogPreview.articles") as Array<{ title: string; category: string; date: string }>).map((article, i) => (
                <div key={i} className="min-w-[75vw] snap-start bg-card rounded-xl overflow-hidden shadow-card border border-border">
                  <div className="h-28 gradient-hero flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-primary-foreground/30" />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">{article.category}</span>
                    <h3 className="font-heading font-bold text-foreground text-sm mt-1 mb-1 leading-tight">{article.title}</h3>
                    <p className="text-muted-foreground text-xs">{article.date}</p>
                  </div>
                </div>
              ))}
            </HScrollSection>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {(t("blogPreview.articles") as Array<{ title: string; category: string; date: string }>).map((article, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl overflow-hidden shadow-card border border-border hover:shadow-card-hover transition-all group">
                  <div className="h-32 md:h-40 gradient-hero flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-primary-foreground/30" />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">{article.category}</span>
                    <h3 className="font-heading font-bold text-foreground mt-2 mb-2 group-hover:text-accent transition-colors">{article.title}</h3>
                    <p className="text-muted-foreground text-xs">{article.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:mt-10">
            <Link to="/blog"><Button variant="outline" size="lg" className="w-full sm:w-auto">{t("blogPreview.cta")} <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ PREVIEW ===== */}
      <section className="section-padding-compact bg-background">
        <div className="container-narrow mx-auto max-w-3xl">
          <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground text-center mb-8 md:mb-10">{t("faqPreview.title")}</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {(t("faqPreview.items") as Array<{ q: string; a: string }>).map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl border border-border px-4 md:px-6 shadow-card">
                <AccordionTrigger className="font-heading font-semibold text-foreground text-left py-4 md:py-5 text-sm md:text-base">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4 md:pb-5 text-sm">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="text-center mt-6 md:mt-8">
            <Link to="/faq"><Button variant="ghost" size="lg">{t("faqPreview.cta")} <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="gradient-accent section-padding-compact">
        <div className="container-narrow mx-auto text-center">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-accent-foreground">{t("finalCTA.title")}</h2>
          <p className="mt-3 md:mt-4 text-accent-foreground/80 text-sm md:text-lg max-w-xl mx-auto">{t("finalCTA.subtitle")}</p>
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
           <Link to="/signup" className="w-full sm:w-auto">
              <Button variant="default" size="xl" className="w-full sm:w-auto">{t("hero.ctaSignup")} <ArrowRight className="w-5 h-5" /></Button>
            </Link>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button variant="heroOutline" size="xl" className="w-full sm:w-auto"><MessageCircle className="w-5 h-5" /> {t("finalCTA.cta2")}</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
