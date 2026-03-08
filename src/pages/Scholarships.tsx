import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Award, ArrowRight, MessageCircle } from "lucide-react";

const WA_LINK = "https://wa.me/33768674292";

const Scholarships = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const types = t("scholarshipsPage.types") as string[];

  return (
    <div className="min-h-screen">
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">{t("scholarshipsPage.title")}</h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">{t("scholarshipsPage.subtitle")}</p>
        </div>
      </section>
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto max-w-4xl">
          <h2 className="font-heading font-bold text-3xl text-foreground text-center mb-10">{isEn ? "Types of Scholarships" : "Types de Bourses"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {types.map((type, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-center gap-3 bg-card p-5 rounded-xl border border-border shadow-card">
                <Award className="w-6 h-6 text-accent shrink-0" />
                <span className="font-heading font-semibold text-foreground">{type}</span>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/tools/scholarship-test"><Button variant="accent" size="xl">{t("tools.scholarship.cta")} <ArrowRight className="w-5 h-5" /></Button></Link>
          </div>
        </div>
      </section>
      <section className="gradient-accent section-padding">
        <div className="container-narrow mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl text-accent-foreground">{isEn ? "Need Scholarship Guidance?" : "Besoin d'Aide pour les Bourses ?"}</h2>
          <p className="mt-3 text-accent-foreground/80 max-w-xl mx-auto">{isEn ? "Our advisors can help you find and apply to the right scholarships." : "Nos conseillers peuvent vous aider à trouver et postuler aux bonnes bourses."}</p>
          <div className="mt-6">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <Button variant="default" size="lg"><MessageCircle className="w-4 h-4" /> {t("hero.cta2")}</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Scholarships;
