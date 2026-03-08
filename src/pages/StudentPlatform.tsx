import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Sparkles, Rocket } from "lucide-react";

const StudentPlatform = () => {
  const { t } = useLanguage();
  const features = t("studentPlatform.features") as string[];

  return (
    <div className="min-h-screen">
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 gradient-accent text-accent-foreground rounded-full px-4 py-2 mb-6 font-semibold text-sm">
              <Sparkles className="w-4 h-4" /> {t("studentPlatform.comingSoon")}
            </div>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">{t("studentPlatform.title")}</h1>
            <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">{t("studentPlatform.subtitle")}</p>
          </motion.div>
        </div>
      </section>
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto max-w-4xl">
          <p className="text-muted-foreground text-lg leading-relaxed text-center mb-12">{t("studentPlatform.description")}</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-start gap-3 bg-card p-5 rounded-xl border border-border shadow-card">
                <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <span className="text-foreground text-sm font-medium">{f}</span>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/signup"><Button variant="accent" size="xl">{t("studentPlatform.cta")} <ArrowRight className="w-5 h-5" /></Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentPlatform;
