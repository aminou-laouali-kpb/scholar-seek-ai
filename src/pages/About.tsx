import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Target, Eye, BookOpen, Heart, ArrowRight } from "lucide-react";

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">{t("aboutPage.title")}</h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">{t("aboutPage.subtitle")}</p>
        </div>
      </section>
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto max-w-4xl space-y-16">
          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl p-8 shadow-card border border-border">
              <Target className="w-10 h-10 text-accent mb-4" />
              <h2 className="font-heading font-bold text-2xl text-foreground mb-3">{t("aboutPage.mission")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("aboutPage.missionText")}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-8 shadow-card border border-border">
              <Eye className="w-10 h-10 text-accent mb-4" />
              <h2 className="font-heading font-bold text-2xl text-foreground mb-3">{t("aboutPage.vision")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("aboutPage.visionText")}</p>
            </motion.div>
          </div>

          {/* Story */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-secondary/50 rounded-2xl p-8 md:p-12">
            <BookOpen className="w-10 h-10 text-accent mb-4" />
            <h2 className="font-heading font-bold text-2xl text-foreground mb-4">{t("aboutPage.story")}</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{t("aboutPage.storyText")}</p>
          </motion.div>

          <div className="text-center">
            <Link to="/contact"><Button variant="accent" size="xl">{t("hero.cta2")} <ArrowRight className="w-5 h-5" /></Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
