import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const WA_LINK = "https://wa.me/33768674292";

const CanadaFinder = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const features = isEn
    ? ["Search Canadian universities by program and province", "Compare tuition fees for international students", "Explore bilingual study options (English & French)", "Discover post-graduation work permit pathways", "Find scholarship opportunities for African students"]
    : ["Rechercher des universités canadiennes par programme et province", "Comparer les frais de scolarité pour étudiants internationaux", "Explorer les options d'études bilingues (Anglais & Français)", "Découvrir les parcours de permis de travail post-diplôme", "Trouver des bourses pour étudiants africains"];

  const faqs = isEn
    ? [
        { q: "Can I study in French in Canada?", a: "Yes! Québec and other provinces offer many French-language university programs. Canada is officially bilingual." },
        { q: "What is the post-graduation work permit?", a: "After completing your studies in Canada, you can obtain a work permit for up to 3 years, which can lead to permanent residency." },
        { q: "How much does it cost to study in Canada?", a: "Tuition for international students ranges from CAD $15,000 to $35,000 per year depending on the university and program." },
      ]
    : [
        { q: "Peut-on étudier en français au Canada ?", a: "Oui ! Le Québec et d'autres provinces offrent de nombreux programmes universitaires en français. Le Canada est officiellement bilingue." },
        { q: "Qu'est-ce que le permis de travail post-diplôme ?", a: "Après vos études au Canada, vous pouvez obtenir un permis de travail jusqu'à 3 ans, qui peut mener à la résidence permanente." },
        { q: "Combien coûtent les études au Canada ?", a: "Les frais pour les étudiants internationaux vont de 15 000 à 35 000 $ CAD par an selon l'université et le programme." },
      ];

  return (
    <div className="min-h-screen">
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-2 mb-6">
              <Search className="w-4 h-4 text-accent" />
              <span className="text-primary-foreground/80 text-sm font-medium">
                {isEn ? "Find your perfect match in Canada" : "Trouvez votre match parfait au Canada"}
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">
              {isEn ? "Canada University Finder" : "Recherche d'Universités au Canada"}
            </h1>
            <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              {isEn
                ? "Discover the best Canadian university for your profile. Compare programs, costs, and immigration pathways."
                : "Découvrez la meilleure université canadienne pour votre profil. Comparez les programmes, coûts et voies d'immigration."}
            </p>
            <div className="mt-8">
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                <Button variant="hero" size="xl"><MessageCircle className="w-5 h-5" /> {isEn ? "Get Started with an Advisor" : "Commencer avec un Conseiller"} <ArrowRight className="w-5 h-5" /></Button>
              </a>
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
          <h2 className="font-heading font-bold text-3xl text-accent-foreground">{isEn ? "Ready to Study in Canada?" : "Prêt à Étudier au Canada ?"}</h2>
          <p className="mt-3 text-accent-foreground/80">{isEn ? "Our advisors can help you choose the right Canadian university" : "Nos conseillers peuvent vous aider à choisir la bonne université canadienne"}</p>
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

export default CanadaFinder;
