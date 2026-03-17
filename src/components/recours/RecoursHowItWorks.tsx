import { ClipboardList, Brain, Compass } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: ClipboardList,
    title: "1. Remplis le formulaire",
    description: "Indique ta situation en quelques minutes. C'est simple et rapide.",
  },
  {
    icon: Brain,
    title: "2. Analyse automatique",
    description: "Notre outil évalue les éléments clés de ton dossier pour te donner une orientation.",
  },
  {
    icon: Compass,
    title: "3. Obtiens ta recommandation",
    description: "Recours, plan B ou les deux ? Tu sauras exactement quoi faire ensuite.",
  },
];

const RecoursHowItWorks = () => (
  <section className="py-16 px-4 bg-background">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-10">
        Comment ça marche ?
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default RecoursHowItWorks;
