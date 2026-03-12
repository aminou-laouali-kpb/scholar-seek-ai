import { useLanguage } from "@/i18n/LanguageContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";

const FAQ = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  const faqSections = isEn ? [
    { cat: "General", items: [
      { q: "What is KPB Education?", a: "KPB Education is a study abroad platform that combines smart tools with expert guidance to help African students find universities, scholarships, and succeed in their applications." },
      { q: "Is KPB Education free?", a: "Our tools are free. Personalized guidance packages are available at various price points." },
    ]},
    { cat: "Tools", items: [
      { q: "How do the university finders work?", a: "Our finders let you search and filter universities by country, language, program, tuition, and admission requirements." },
      { q: "Is the scholarship test accurate?", a: "It provides a strong indication of your eligibility based on your profile. Final decisions depend on scholarship providers." },
    ]},
    { cat: "For Parents", items: [
      { q: "How can I be sure my child is in good hands?", a: "KPB Education has guided 500+ students with a 95% success rate. We provide transparent guidance and regular updates." },
      { q: "What does the guidance package include?", a: "University selection, application support, scholarship strategy, visa assistance, and ongoing follow-up." },
    ]},
  ] : [
    { cat: "Général", items: [
      { q: "Qu'est-ce que KPB Education ?", a: "KPB Education est une plateforme d'études à l'étranger qui combine des outils intelligents et un accompagnement expert pour aider les étudiants africains." },
      { q: "KPB Education est-il gratuit ?", a: "Nos outils sont gratuits. Des formules d'accompagnement personnalisé sont disponibles à différents tarifs." },
    ]},
    { cat: "Outils", items: [
      { q: "Comment fonctionnent les moteurs de recherche ?", a: "Nos moteurs vous permettent de rechercher et filtrer les universités par pays, langue, programme, frais et critères d'admission." },
      { q: "Le test de bourses est-il fiable ?", a: "Il donne une forte indication de votre éligibilité basée sur votre profil. Les décisions finales dépendent des organismes de bourses." },
    ]},
    { cat: "Pour les Parents", items: [
      { q: "Comment être sûr que mon enfant est entre de bonnes mains ?", a: "KPB Education a guidé plus de 500 étudiants avec un taux de réussite de 95%. Nous offrons un accompagnement transparent et des mises à jour régulières." },
      { q: "Que comprend la formule d'accompagnement ?", a: "Choix d'université, support de candidature, stratégie de bourses, assistance visa et suivi continu." },
    ]},
  ];

  return (
    <div className="min-h-screen">
      <SEOHead title={t("faqPage.title") + " — KPB Education"} description={String(t("faqPage.subtitle"))} />
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">{t("faqPage.title")}</h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">{t("faqPage.subtitle")}</p>
        </div>
      </section>
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto max-w-3xl space-y-12">
          {faqSections.map((section, si) => (
            <div key={si}>
              <h2 className="font-heading font-bold text-2xl text-foreground mb-5">{section.cat}</h2>
              <Accordion type="single" collapsible className="space-y-3">
                {section.items.map((item, i) => (
                  <AccordionItem key={i} value={`${si}-${i}`} className="bg-card rounded-xl border border-border px-6">
                    <AccordionTrigger className="font-heading font-semibold text-foreground text-left py-4">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FAQ;
