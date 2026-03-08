import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, Globe2, Award, ArrowRight, MapPin, GraduationCap } from "lucide-react";

const Tools = () => {
  const { t } = useLanguage();
  const tools = [
    { key: "belgium", icon: Search, route: "/tools/belgium", color: "gradient-hero" },
    { key: "france", icon: Globe2, route: "/tools/france", color: "gradient-hero" },
    { key: "usa", icon: GraduationCap, route: "/tools/usa", color: "gradient-hero" },
    { key: "canada", icon: MapPin, route: "/tools/canada", color: "gradient-hero" },
    { key: "china", icon: Globe2, route: "/tools/china", color: "gradient-hero" },
    { key: "scholarship", icon: Award, route: "/tools/scholarship-test", color: "gradient-accent" },
  ];

  return (
    <div className="min-h-screen">
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">{t("toolsPage.title")}</h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">{t("toolsPage.subtitle")}</p>
        </div>
      </section>
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {tools.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.div key={tool.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all border border-border group">
                  <div className={`${tool.color} p-8 flex items-center justify-center`}>
                    <Icon className="w-16 h-16 text-primary-foreground/40 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-xl text-foreground mb-2">{t(`tools.${tool.key}.title`)}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">{t(`tools.${tool.key}.description`)}</p>
                    <p className="text-sm font-semibold text-accent mb-5">{t(`tools.${tool.key}.benefit`)}</p>
                    <Link to={tool.route}><Button variant="default" className="w-full">{t(`tools.${tool.key}.cta`)} <ArrowRight className="w-4 h-4" /></Button></Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tools;
