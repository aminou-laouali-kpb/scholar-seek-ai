import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Compass, GraduationCap, Award, FileText, ClipboardCheck, Users, ArrowRight } from "lucide-react";

const Services = () => {
  const { t } = useLanguage();
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
                  <Link to="/contact"><Button variant="outline" size="sm">{t("hero.cta2")}</Button></Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
