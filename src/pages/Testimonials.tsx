import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star, ArrowRight, MessageCircle } from "lucide-react";

const WA_LINK = "https://wa.me/33768674292";

const Testimonials = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const items = t("testimonials.items") as Array<{ name: string; country: string; quote: string }>;
  const allItems = [...items, ...items];

  return (
    <div className="min-h-screen">
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">{t("testimonialsPage.title")}</h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">{t("testimonialsPage.subtitle")}</p>
        </div>
      </section>
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allItems.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.1 }} className="bg-card rounded-xl p-6 shadow-card border border-border">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-accent text-accent" />)}</div>
                <p className="text-foreground text-sm leading-relaxed italic mb-5">"{item.quote}"</p>
                <p className="font-heading font-bold text-foreground text-sm">{item.name}</p>
                <p className="text-muted-foreground text-xs">{item.country}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="gradient-accent section-padding">
        <div className="container-narrow mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl text-accent-foreground">{t("finalCTA.title")}</h2>
          <p className="mt-3 text-accent-foreground/80 max-w-xl mx-auto">{t("finalCTA.subtitle")}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/questionnaire"><Button variant="default" size="lg">{t("finalCTA.cta1")} <ArrowRight className="w-4 h-4" /></Button></Link>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <Button variant="heroOutline" size="lg"><MessageCircle className="w-4 h-4" /> {t("hero.cta2")}</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
