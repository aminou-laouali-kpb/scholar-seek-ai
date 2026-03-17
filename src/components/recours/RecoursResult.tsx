import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, Layers, ArrowRight, MessageCircle } from "lucide-react";
import { track } from "@/lib/analytics";
import type { RecoursResult as RecoursResultType } from "@/lib/recoursEngine";

const WA_NUMBER = "33768674292";

const categoryConfig = {
  A: { color: "bg-success text-success-foreground", icon: CheckCircle2, label: "Recours recommandé" },
  B: { color: "bg-accent text-accent-foreground", icon: AlertTriangle, label: "Recours possible mais faible" },
  C: { color: "bg-destructive text-destructive-foreground", icon: XCircle, label: "Recours peu pertinent" },
  D: { color: "bg-primary text-primary-foreground", icon: Layers, label: "Recours + plan B recommandé" },
};

interface Props {
  result: RecoursResultType;
}

const RecoursResultView = ({ result }: Props) => {
  const config = categoryConfig[result.category];
  const Icon = config.icon;

  const handleCtaClick = () => {
    track("recours_cta_clicked", { ctaType: result.ctaType, category: result.category });
    const msg = encodeURIComponent(
      `Bonjour, j'ai utilisé l'outil d'analyse de recours KPB et ma recommandation est : "${result.verdict}". J'aimerais être accompagné(e).`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  };

  const handlePrivateCta = () => {
    track("recours_private_school_cta_clicked", { category: result.category });
    const msg = encodeURIComponent(
      `Bonjour, je souhaite explorer les admissions en écoles privées en France. J'ai reçu un refus sur Études en France.`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <section className="py-12 px-4 bg-background">
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-4"
        >
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full ${config.color} font-semibold text-base`}>
            <Icon className="w-5 h-5" />
            {config.label}
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            {result.verdict}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-5"
        >
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-2">Ce que cela signifie</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{result.explanation}</p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-2">Prochaine étape recommandée</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{result.nextStep}</p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-2">Éléments analysés</h3>
            <ul className="space-y-2">
              {result.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-secondary/50 rounded-xl p-4 text-xs text-muted-foreground">
            <strong>Avertissement :</strong> Cette analyse est une orientation structurée et ne constitue pas un avis juridique.
            La décision finale appartient toujours à l'établissement concerné. KPB Éducation ne garantit aucun résultat.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-4"
        >
          <Button
            size="lg"
            onClick={handleCtaClick}
            className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-base font-semibold rounded-xl gap-2 w-full md:w-auto"
          >
            <MessageCircle className="w-5 h-5" />
            {result.ctaLabel}
          </Button>
        </motion.div>

        {/* Plan B Upsell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-primary/5 border border-primary/10 rounded-2xl p-6 space-y-4"
        >
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Ne perds pas de temps pendant l'attente
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Même si un recours est possible, les résultats peuvent prendre du temps.
            Sécurise dès maintenant un plan B en école privée pour ne pas risquer de perdre une année entière.
            De nombreuses écoles ont encore des places disponibles.
          </p>
          <Button variant="outline" onClick={handlePrivateCta} className="gap-2">
            Découvrir les écoles privées <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default RecoursResultView;
