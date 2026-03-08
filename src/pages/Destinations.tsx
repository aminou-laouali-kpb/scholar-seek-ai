import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const countryFlags: Record<string, string> = {
  belgium: "🇧🇪", france: "🇫🇷", canada: "🇨🇦", uk: "🇬🇧", usa: "🇺🇸",
  germany: "🇩🇪", spain: "🇪🇸", turkey: "🇹🇷", uae: "🇦🇪",
};

const Destinations = () => {
  const { t } = useLanguage();
  const countries = Object.keys(countryFlags);

  return (
    <div className="min-h-screen">
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">{t("destinationsPage.title")}</h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">{t("destinationsPage.subtitle")}</p>
        </div>
      </section>
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((key, i) => (
              <Link key={key} to={`/destinations/${key}`}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-card-hover hover:border-accent/30 transition-all group cursor-pointer h-full">
                  <div className="text-5xl mb-4">{countryFlags[key]}</div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">{t(`destinationsPage.countries.${key}.name`)}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{t(`destinationsPage.countries.${key}.desc`)}</p>
                  <span className="text-accent text-sm font-semibold group-hover:underline inline-flex items-center gap-1">
                    {t("services.cta")} <ArrowRight className="w-3 h-3" />
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Destinations;
