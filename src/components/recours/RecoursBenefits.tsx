import { CheckCircle2, Smartphone, Clock, ShieldAlert, Globe, Zap } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  { icon: Zap, label: "Analyse structurée" },
  { icon: Clock, label: "Orientation rapide" },
  { icon: Globe, label: "Pensé pour les étudiants francophones" },
  { icon: Smartphone, label: "Compatible mobile" },
  { icon: ShieldAlert, label: "Aucune garantie trompeuse" },
  { icon: CheckCircle2, label: "Solution claire pour agir rapidement" },
];

const RecoursBenefits = () => (
  <section className="py-12 px-4 bg-secondary/30">
    <div className="max-w-4xl mx-auto">
      <h2 className="font-heading text-2xl font-bold text-foreground text-center mb-8">
        Pourquoi utiliser cet outil ?
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {benefits.map((b, i) => {
          const Icon = b.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-sm border border-border"
            >
              <Icon className="w-5 h-5 text-success shrink-0" />
              <span className="text-sm font-medium text-foreground">{b.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default RecoursBenefits;
