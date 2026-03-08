import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const WA_LINK = "https://wa.me/33768674292";

const ChinaFinder = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const features = isEn
    ? ["Search Chinese universities by program and city", "Explore CSC (Chinese Government Scholarship) options", "Find English-taught programs across China", "Compare tuition fees and living costs", "Learn about student visa requirements"]
    : ["Rechercher des universités chinoises par programme et ville", "Explorer les options de bourses CSC (Bourse du Gouvernement Chinois)", "Trouver des programmes en anglais à travers la Chine", "Comparer les frais de scolarité et le coût de la vie", "En savoir plus sur les exigences de visa étudiant"];

  const faqs = isEn
    ? [
        { q: "Can I study in English in China?", a: "Yes! Many Chinese universities offer English-taught programs, especially at the master's and PhD level in fields like engineering, medicine, and business." },
        { q: "What is the CSC Scholarship?", a: "The Chinese Government Scholarship (CSC) is a fully funded scholarship covering tuition, accommodation, stipend, and insurance for international students." },
        { q: "How much does it cost to study in China?", a: "Tuition ranges from $2,000 to $10,000/year depending on the program. Living costs are very affordable — around $300–$500/month." },
      ]
    : [
        { q: "Peut-on étudier en anglais en Chine ?", a: "Oui ! De nombreuses universités chinoises offrent des programmes en anglais, surtout au niveau master et doctorat en ingénierie, médecine et commerce." },
        { q: "Qu'est-ce que la bourse CSC ?", a: "La bourse du gouvernement chinois (CSC) est une bourse complète couvrant les frais de scolarité, le logement, une allocation mensuelle et l'assurance pour les étudiants internationaux." },
        { q: "Combien coûtent les études en Chine ?", a: "Les frais de scolarité vont de 2 000 à 10 000 $/an selon le programme. Le coût de la vie est très abordable — environ 300–500 $/mois." },
      ];

  return (
    <div className="min-h-screen">
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-2 mb-6">
              <Search className="w-4 h-4 text-accent" />
              <span className="text-primary-foreground/80 text-sm font-medium">
                {isEn ? "Discover opportunities in China" : "Découvrez les opportunités en Chine"}
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">
              {isEn ? "China University Finder" : "Recherche d'Universités en Chine"}
            </h1>
            <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              {isEn
                ? "Find the best Chinese university for your profile. Explore CSC scholarships, English programs, and affordable study options."
                : "Trouvez la meilleure université chinoise pour votre profil. Explorez les bourses CSC, les programmes en anglais et les options abordables."}
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
          <h2 className="font-heading font-bold text-3xl text-accent-foreground">{isEn ? "Ready to Study in China?" : "Prêt à Étudier en Chine ?"}</h2>
          <p className="mt-3 text-accent-foreground/80">{isEn ? "Our advisors can help you apply for CSC scholarships and more" : "Nos conseillers peuvent vous aider à postuler pour les bourses CSC et plus"}</p>
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

export default ChinaFinder;
