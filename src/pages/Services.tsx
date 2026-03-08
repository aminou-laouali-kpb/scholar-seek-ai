import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Compass, GraduationCap, Award, FileText, ClipboardCheck, Users, ArrowRight, MessageCircle } from "lucide-react";

const WA_LINK = "https://wa.me/33768674292";

const Services = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const icons = [Compass, GraduationCap, Award, FileText, ClipboardCheck, Users];

  return (
    <div className="min-h-screen">
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">{t("servicesPage.title")}</h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">{t("servicesPage.subtitle")}</p>
        </div>
      </section>
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(t("services.items") as Array<{ title: string; desc: string }>).map((item, i) => {
              const Icon = icons[i];
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl p-8 shadow-card border border-border hover:shadow-card-hover transition-all">
                  <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-accent-foreground" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">{item.desc}</p>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm"><MessageCircle className="w-4 h-4" /> {t("hero.cta2")}</Button>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="gradient-accent section-padding">
        <div className="container-narrow mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl text-accent-foreground">
            {isEn ? "Ready to Start Your Journey?" : "Prêt à Commencer Votre Aventure ?"}
          </h2>
          <p className="mt-3 text-accent-foreground/80 max-w-xl mx-auto">
            {isEn ? "Our advisors are ready to help you plan your study abroad journey." : "Nos conseillers sont prêts à vous aider à planifier votre projet d'études à l'étranger."}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/questionnaire"><Button variant="default" size="lg">{t("hero.cta1")} <ArrowRight className="w-4 h-4" /></Button></Link>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <Button variant="heroOutline" size="lg"><MessageCircle className="w-4 h-4" /> {t("hero.cta2")}</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
