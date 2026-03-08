import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, GraduationCap, Award, ArrowRight, BookOpen, Globe2, Users, CheckCircle2, Star, FileText, MessageCircle, ShieldCheck, MapPin, Compass, ClipboardCheck } from "lucide-react";
import heroImg from "@/assets/hero-students.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Index = () => {
  const { t } = useLanguage();

  const toolIcons = [Search, Globe2, Award];
  const toolKeys = ["belgium", "france", "scholarship"];
  const toolRoutes = ["/tools/belgium", "/tools/france", "/tools/scholarship-test"];

  const serviceIcons = [Compass, GraduationCap, Award, FileText, ClipboardCheck, Users];
  const whyIcons = [MapPin, Search, CheckCircle2, MessageCircle];

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" className="text-center lg:text-left">
              <motion.h1 variants={fadeUp} custom={0} className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-6xl text-primary-foreground leading-tight">
                {t("hero.title")}{" "}
                <span className="text-gradient-accent inline-block">{t("hero.titleHighlight")}</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={1} className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-primary-foreground/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t("hero.subtitle")}
              </motion.p>
              <motion.div variants={fadeUp} custom={2} className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link to="/questionnaire" className="w-full sm:w-auto">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">{t("hero.cta1")} <ArrowRight className="w-5 h-5" /></Button>
                </Link>
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">{t("hero.cta2")}</Button>
                </Link>
              </motion.div>
              <motion.div variants={fadeUp} custom={3} className="mt-6 md:mt-10 flex flex-wrap gap-4 md:gap-6 justify-center lg:justify-start">
                {Object.values(t("hero.stats") as Record<string, string>).map((stat, i) => (
                  <div key={i} className="text-primary-foreground/90 text-sm font-semibold">
                    <span className="text-accent">✦</span> {stat}
                  </div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="hidden lg:block">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-hero">
                  <img src={heroImg} alt="Students celebrating graduation" className="w-full h-[420px] object-cover" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-card rounded-xl p-4 shadow-card-hover">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-foreground text-sm">500+</p>
                      <p className="text-muted-foreground text-xs">{t("hero.stats.students")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TOOLS SPOTLIGHT ===== */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">{t("tools.sectionTitle")}</h2>
            <p className="mt-4 text-muted-foreground text-lg">{t("tools.sectionSubtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {toolKeys.map((key, i) => {
              const Icon = toolIcons[i];
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover:border-accent/30"
                >
                  <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-accent-foreground" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-2">{t(`tools.${key}.title`)}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">{t(`tools.${key}.description`)}</p>
                  <p className="text-sm font-semibold text-accent mb-5">{t(`tools.${key}.benefit`)}</p>
                  <Link to={toolRoutes[i]}>
                    <Button variant="default" size="sm" className="w-full">{t(`tools.${key}.cta`)} <ArrowRight className="w-4 h-4" /></Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section-padding bg-secondary/50">
        <div className="container-narrow mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">{t("howItWorks.title")}</h2>
            <p className="mt-4 text-muted-foreground text-lg">{t("howItWorks.subtitle")}</p>
          </div>
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
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">{t("services.sectionTitle")}</h2>
            <p className="mt-4 text-muted-foreground text-lg">{t("services.sectionSubtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(t("services.items") as Array<{ title: string; desc: string }>).map((item, i) => {
              const Icon = serviceIcons[i];
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-card-hover transition-all">
                  <Icon className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-heading font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link to="/services"><Button variant="default" size="lg">{t("services.cta")} <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* ===== WHY KPB ===== */}
      <section className="section-padding gradient-hero">
        <div className="container-narrow mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-foreground">{t("whyKPB.title")}</h2>
            <p className="mt-4 text-primary-foreground/70 text-lg">{t("whyKPB.subtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {(t("whyKPB.points") as Array<{ title: string; desc: string }>).map((point, i) => {
              const Icon = whyIcons[i];
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/10">
                  <Icon className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-heading font-bold text-primary-foreground text-lg mb-2">{point.title}</h3>
                  <p className="text-primary-foreground/70 text-sm leading-relaxed">{point.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">{t("testimonials.title")}</h2>
            <p className="mt-4 text-muted-foreground text-lg">{t("testimonials.subtitle")}</p>
          </div>
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
          <div className="text-center mt-10">
            <Link to="/testimonials"><Button variant="outline" size="lg">{t("testimonials.cta")} <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* ===== BLOG PREVIEW ===== */}
      <section className="section-padding bg-secondary/50">
        <div className="container-narrow mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground">{t("blogPreview.title")}</h2>
            <p className="mt-4 text-muted-foreground text-lg">{t("blogPreview.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {(t("blogPreview.articles") as Array<{ title: string; category: string; date: string }>).map((article, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl overflow-hidden shadow-card border border-border hover:shadow-card-hover transition-all group">
                <div className="h-40 gradient-hero flex items-center justify-center">
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
          <div className="text-center mt-10">
            <Link to="/blog"><Button variant="outline" size="lg">{t("blogPreview.cta")} <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ PREVIEW ===== */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto max-w-3xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground text-center mb-10">{t("faqPreview.title")}</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {(t("faqPreview.items") as Array<{ q: string; a: string }>).map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl border border-border px-6 shadow-card">
                <AccordionTrigger className="font-heading font-semibold text-foreground text-left py-5">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="text-center mt-8">
            <Link to="/faq"><Button variant="ghost" size="lg">{t("faqPreview.cta")} <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="gradient-accent section-padding">
        <div className="container-narrow mx-auto text-center">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-accent-foreground">{t("finalCTA.title")}</h2>
          <p className="mt-4 text-accent-foreground/80 text-lg max-w-xl mx-auto">{t("finalCTA.subtitle")}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/questionnaire"><Button variant="default" size="xl">{t("finalCTA.cta1")} <ArrowRight className="w-5 h-5" /></Button></Link>
            <Link to="/contact"><Button variant="heroOutline" size="xl">{t("finalCTA.cta2")}</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
