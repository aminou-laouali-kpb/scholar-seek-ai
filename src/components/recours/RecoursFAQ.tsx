import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Est-ce que cet outil garantit qu'un recours va fonctionner ?",
    a: "Non. Cet outil fournit une orientation structurée basée sur ta situation, mais la décision finale appartient toujours à l'établissement. Aucun outil ne peut garantir le résultat d'un recours gracieux.",
  },
  {
    q: "Que faire si l'outil me recommande plutôt une école privée ?",
    a: "Si ton profil montre que le recours a peu de chances d'aboutir, il est souvent plus stratégique de sécuriser une admission en école privée pour ne pas perdre une année. KPB peut t'accompagner dans cette démarche.",
  },
  {
    q: "Combien de temps faut-il pour utiliser l'outil ?",
    a: "Le formulaire prend environ 5 minutes à remplir. Le résultat est immédiat après soumission.",
  },
  {
    q: "Dois-je créer un compte ?",
    a: "Non, l'outil est accessible sans inscription. Tu fournis simplement tes coordonnées pour recevoir ta recommandation.",
  },
  {
    q: "Puis-je utiliser l'outil sur téléphone ?",
    a: "Oui, l'outil est entièrement optimisé pour une utilisation sur smartphone.",
  },
  {
    q: "Mes données sont-elles protégées ?",
    a: "Oui, tes informations sont stockées de manière sécurisée et ne sont jamais partagées avec des tiers.",
  },
];

const RecoursFAQ = () => (
  <section className="py-16 px-4 bg-background">
    <div className="max-w-2xl mx-auto">
      <h2 className="font-heading text-2xl font-bold text-foreground text-center mb-8">
        Questions fréquentes
      </h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-xl px-4">
            <AccordionTrigger className="text-left font-medium text-sm md:text-base">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default RecoursFAQ;
