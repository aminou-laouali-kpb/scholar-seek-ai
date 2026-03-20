import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Award, ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const WA_LINK = "https://wa.me/33768674292";

const ScholarshipTest = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleCTA = () => {
    if (!user) { navigate("/login?redirect=/tools/scholarship-test"); return; }
    navigate("/dashboard");
  };

  const criteria = isEn
    ? ["Academic background & GPA", "Country of origin", "Desired destination", "Degree level", "Financial situation", "Field of study"]
    : ["Parcours académique & moyenne", "Pays d'origine", "Destination souhaitée", "Niveau de diplôme", "Situation financière", "Domaine d'études"];

  const faqs = isEn
    ? [
        { q: "How long does the test take?", a: "About 3-5 minutes. Just answer questions about your profile." },
        { q: "Is the result guaranteed?", a: "Results indicate eligibility potential. Final decisions are made by scholarship providers." },
      ]
    : [
        { q: "Combien de temps dure le test ?", a: "Environ 3 à 5 minutes. Répondez simplement aux questions sur votre profil." },
        { q: "Le résultat est-il garanti ?", a: "Les résultats indiquent un potentiel d'éligibilité. Les décisions finales sont prises par les organismes de bourses." },
      ];

  return (
    <div className="min-h-screen">
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-2 mb-6">
              <Award className="w-4 h-4 text-accent" />
              <span className="text-primary-foreground/80 text-sm font-medium">{t("tools.scholarship.benefit")}</span>
            </div>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">{t("tools.scholarship.title")}</h1>
            <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">{t("tools.scholarship.description")}</p>
            <div className="mt-8">
              <Button variant="hero" size="xl" onClick={handleCTA}>{t("tools.scholarship.cta")} <ArrowRight className="w-5 h-5" /></Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto max-w-4xl">
          <h2 className="font-heading font-bold text-3xl text-foreground text-center mb-10">{isEn ? "Criteria We Evaluate" : "Critères Évalués"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {criteria.map((c, i) => (
              <div key={i} className="flex items-start gap-3 bg-card p-4 rounded-xl border border-border">
                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <span className="text-foreground text-sm">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/50">
        <div className="container-narrow mx-auto max-w-3xl">
          <h2 className="font-heading font-bold text-2xl text-foreground text-center mb-8">{isEn ? "FAQ" : "Questions Fréquentes"}</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl border border-border px-6">
                <AccordionTrigger className="font-heading font-semibold text-foreground text-left py-4">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="gradient-accent section-padding">
        <div className="container-narrow mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl text-accent-foreground">{isEn ? "Want Help Applying?" : "Besoin d'Aide pour Postuler ?"}</h2>
          <p className="mt-3 text-accent-foreground/80">{isEn ? "Our team can help you maximize your scholarship chances." : "Notre équipe peut vous aider à maximiser vos chances de bourse."}</p>
          <div className="mt-6">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <Button variant="default" size="lg"><MessageCircle className="w-4 h-4" /> {isEn ? "Chat with an Advisor" : "Discuter avec un Conseiller"}</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScholarshipTest;
