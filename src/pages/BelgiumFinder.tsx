import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const WA_LINK = "https://wa.me/33768674292";

const BelgiumFinder = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  const features = isEn
    ? ["Filter by language (French, Dutch, English)", "Search by field of study", "Compare tuition fees", "View admission requirements", "Save your favorites"]
    : ["Filtrer par langue (Français, Néerlandais, Anglais)", "Rechercher par domaine d'études", "Comparer les frais de scolarité", "Voir les critères d'admission", "Sauvegarder vos favoris"];

  const faqs = isEn
    ? [
        { q: "Is this tool free?", a: "Yes, the Belgium University Finder is completely free to use." },
        { q: "How many universities are listed?", a: "We cover all major Belgian universities and hautes écoles." },
        { q: "Can I filter by English programs?", a: "Yes, you can filter by language including English-taught programs." },
      ]
    : [
        { q: "Cet outil est-il gratuit ?", a: "Oui, le moteur de recherche d'universités belges est entièrement gratuit." },
        { q: "Combien d'universités sont répertoriées ?", a: "Nous couvrons toutes les grandes universités et hautes écoles belges." },
        { q: "Puis-je filtrer par programmes en anglais ?", a: "Oui, vous pouvez filtrer par langue, y compris les programmes en anglais." },
      ];

  return (
    <div className="min-h-screen">
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-2 mb-6">
              <Search className="w-4 h-4 text-accent" />
              <span className="text-primary-foreground/80 text-sm font-medium">{t("tools.belgium.benefit")}</span>
            </div>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">{t("tools.belgium.title")}</h1>
            <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">{t("tools.belgium.description")}</p>
            <div className="mt-8">
              <Button variant="hero" size="xl">{t("tools.belgium.cta")} <ArrowRight className="w-5 h-5" /></Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto max-w-4xl">
          <h2 className="font-heading font-bold text-3xl text-foreground text-center mb-10">{isEn ? "What You Can Do" : "Ce Que Vous Pouvez Faire"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-card p-4 rounded-xl border border-border">
                <CheckCircle2 className="w-5 h-5 text-success mt-0.5 shrink-0" />
                <span className="text-foreground text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/50">
        <div className="container-narrow mx-auto max-w-3xl">
          <h2 className="font-heading font-bold text-2xl text-foreground text-center mb-8">{isEn ? "Frequently Asked Questions" : "Questions Fréquentes"}</h2>
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
          <h2 className="font-heading font-bold text-3xl text-accent-foreground">{isEn ? "Need Personalized Help?" : "Besoin d'Aide Personnalisée ?"}</h2>
          <p className="mt-3 text-accent-foreground/80">{isEn ? "Our advisors can help you choose the right program in Belgium." : "Nos conseillers peuvent vous aider à choisir le bon programme en Belgique."}</p>
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

export default BelgiumFinder;
