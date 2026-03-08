import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, GraduationCap, MapPin, BookOpen, Users, Building2 } from "lucide-react";

const WA_LINK = "https://wa.me/33768674292";

const countryFlags: Record<string, string> = {
  belgium: "🇧🇪", france: "🇫🇷", canada: "🇨🇦", usa: "🇺🇸", china: "🇨🇳",
  uk: "🇬🇧", germany: "🇩🇪", spain: "🇪🇸", turkey: "🇹🇷", uae: "🇦🇪",
};

// Countries with dedicated app tools
const countryToolRoutes: Record<string, string> = {
  belgium: "/tools/belgium",
  france: "/tools/france",
  usa: "/tools/usa",
  canada: "/tools/canada",
  china: "/tools/china",
};

const CountryDetail = () => {
  const { country } = useParams<{ country: string }>();
  const { t } = useLanguage();

  if (!country || !countryFlags[country]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Country not found.</p>
      </div>
    );
  }

  const flag = countryFlags[country];
  const name = t(`destinationsPage.countries.${country}.name`);
  const data = t(`countryDetail.countries.${country}`) as {
    tagline: string;
    whyPoints: string[];
    stats: { universities: string; avgTuition: string; language: string; popularFields: string };
    topUnis: string[];
    admissions: string;
    studentLife: string;
  };
  const statsLabels = t("countryDetail.statsLabels") as Record<string, string>;

  const hasTool = !!countryToolRoutes[country];
  const primaryLink = hasTool ? countryToolRoutes[country] : WA_LINK;
  const primaryIsExternal = !hasTool;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <div className="text-6xl mb-4">{flag}</div>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">{name}</h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">{data.tagline}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            {primaryIsExternal ? (
              <a href={primaryLink} target="_blank" rel="noopener noreferrer">
                <Button variant="hero" size="xl">
                  <MessageCircle className="w-5 h-5" />
                  {t("countryDetail.primaryCta")}
                </Button>
              </a>
            ) : (
              <Link to={primaryLink}>
                <Button variant="hero" size="xl">
                  <GraduationCap className="w-5 h-5" />
                  {hasTool ? t("countryDetail.exploreTool") : t("countryDetail.primaryCta")}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            )}
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <Button variant="heroOutline" size="xl">
                <MessageCircle className="w-5 h-5" />
                {t("countryDetail.secondaryCta")}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground text-center mb-10">{t("countryDetail.keyStats")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: "universities", icon: Building2, value: data.stats.universities },
              { key: "avgTuition", icon: BookOpen, value: data.stats.avgTuition },
              { key: "language", icon: Users, value: data.stats.language },
              { key: "popularFields", icon: GraduationCap, value: data.stats.popularFields },
            ].map(({ key, icon: Icon, value }, i) => (
              <motion.div key={key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl p-5 shadow-card border border-border text-center">
                <Icon className="w-8 h-8 text-accent mx-auto mb-3" />
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{statsLabels[key]}</p>
                <p className="font-heading font-bold text-foreground text-sm">{value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Study */}
      <section className="section-padding bg-secondary/50">
        <div className="container-narrow mx-auto max-w-3xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground text-center mb-10">
            {t("countryDetail.whyStudy")} {name}
          </h2>
          <div className="grid gap-4">
            {data.whyPoints.map((point, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4 bg-card rounded-xl p-5 shadow-card border border-border">
                <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-accent-foreground" />
                </div>
                <p className="text-foreground text-sm leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Universities */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto max-w-3xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground text-center mb-10">{t("countryDetail.topUniversities")}</h2>
          <div className="grid gap-3">
            {data.topUnis.map((uni, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-center gap-4 bg-card rounded-xl px-5 py-4 shadow-card border border-border">
                <span className="font-heading font-bold text-accent text-lg">{i + 1}</span>
                <span className="text-foreground font-medium text-sm">{uni}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions */}
      <section className="section-padding bg-secondary/50">
        <div className="container-narrow mx-auto max-w-3xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground text-center mb-8">{t("countryDetail.admissionRequirements")}</h2>
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border">
            <p className="text-muted-foreground leading-relaxed">{data.admissions}</p>
          </div>
        </div>
      </section>

      {/* Student Life */}
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto max-w-3xl">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground text-center mb-8">{t("countryDetail.studentLife")}</h2>
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border">
            <p className="text-muted-foreground leading-relaxed">{data.studentLife}</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="gradient-accent section-padding">
        <div className="container-narrow mx-auto text-center">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-accent-foreground mb-4">
            {t("countryDetail.primaryCta")}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryIsExternal ? (
              <a href={primaryLink} target="_blank" rel="noopener noreferrer">
                <Button variant="default" size="xl"><MessageCircle className="w-5 h-5" /> {t("countryDetail.primaryCta")}</Button>
              </a>
            ) : (
              <Link to={primaryLink}>
                <Button variant="default" size="xl"><GraduationCap className="w-5 h-5" /> {t("countryDetail.exploreTool")} <ArrowRight className="w-5 h-5" /></Button>
              </Link>
            )}
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <Button variant="heroOutline" size="xl"><MessageCircle className="w-5 h-5" /> {t("countryDetail.secondaryCta")}</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CountryDetail;
