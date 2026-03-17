import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface RecoursHeroProps {
  onStart: () => void;
}

const RecoursHero = ({ onStart }: RecoursHeroProps) => (
  <section className="relative overflow-hidden py-16 md:py-24 px-4">
    <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-95" />
    <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 bg-cover bg-center" />
    <div className="relative max-w-3xl mx-auto text-center space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-white/90"
      >
        <ShieldCheck className="w-4 h-4" />
        Outil gratuit KPB Éducation
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight"
      >
        Tu as reçu un refus sur{" "}
        <span className="text-accent">Études en France</span> ?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
      >
        Découvre gratuitement si un recours gracieux est pertinent dans ta
        situation. En quelques minutes, obtiens une orientation claire sur la
        meilleure suite à donner à ton dossier.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button
          size="lg"
          onClick={onStart}
          className="bg-accent text-accent-foreground hover:bg-accent/90 text-base md:text-lg px-8 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Tester gratuitement mon dossier
        </Button>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-white/50"
      >
        Aucune inscription requise • Résultat immédiat • 100% gratuit
      </motion.p>
    </div>
  </section>
);

export default RecoursHero;
