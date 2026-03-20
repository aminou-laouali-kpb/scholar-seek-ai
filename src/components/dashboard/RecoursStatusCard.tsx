import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, Layers, ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WA_NUMBER = "33768674292";

const categoryConfig: Record<string, { color: string; icon: any; label: string }> = {
  A: { color: "bg-success/10 text-success border-success/20", icon: CheckCircle2, label: "Recours recommandé" },
  B: { color: "bg-accent/10 text-accent border-accent/20", icon: AlertTriangle, label: "Recours possible mais faible" },
  C: { color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle, label: "Recours peu pertinent" },
  D: { color: "bg-primary/10 text-primary border-primary/20", icon: Layers, label: "Recours + plan B recommandé" },
};

interface RecoursSubmission {
  id: string;
  result_category: string | null;
  result_details: any;
  open_to_private: boolean | null;
  created_at: string;
}

interface RecoursStatusCardProps {
  onRecoursData?: (data: { hasRecours: boolean; openToPrivate: boolean; category: string | null }) => void;
}

const RecoursStatusCard = ({ onRecoursData }: RecoursStatusCardProps) => {
  const { user } = useAuth();
  const [submission, setSubmission] = useState<RecoursSubmission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetch = async () => {
      const { data } = await supabase
        .from("recours_submissions")
        .select("id, result_category, result_details, open_to_private, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);
      
      const sub = (data && data.length > 0) ? data[0] as RecoursSubmission : null;
      setSubmission(sub);
      onRecoursData?.({
        hasRecours: !!sub,
        openToPrivate: sub?.open_to_private ?? false,
        category: sub?.result_category ?? null,
      });
      setLoading(false);
    };
    fetch();
  }, [user]);

  if (loading || !submission || !submission.result_category) return null;

  const config = categoryConfig[submission.result_category] ?? categoryConfig.B;
  const Icon = config.icon;
  const details = submission.result_details as any;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border shadow-card p-5 md:p-6 space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${config.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-foreground text-sm">Analyse Recours Gracieux</h3>
          <Badge variant="secondary" className="text-xs mt-0.5">{config.label}</Badge>
        </div>
      </div>

      {details?.verdict && (
        <p className="text-sm text-muted-foreground leading-relaxed">{details.verdict}</p>
      )}

      {details?.nextStep && (
        <div className="bg-secondary/50 rounded-xl p-3">
          <p className="text-xs font-medium text-foreground mb-1">Prochaine étape</p>
          <p className="text-xs text-muted-foreground">{details.nextStep}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        {details?.ctaLabel && (
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
              `Bonjour, j'ai utilisé l'outil recours KPB. Ma recommandation : "${details.verdict}". J'aimerais être accompagné(e).`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              <MessageCircle className="w-4 h-4" />
              {details.ctaLabel}
            </Button>
          </a>
        )}
        <Link to="/recours-gracieux/analyse">
          <Button variant="outline" size="sm" className="w-full gap-2">
            Refaire l'analyse <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default RecoursStatusCard;
