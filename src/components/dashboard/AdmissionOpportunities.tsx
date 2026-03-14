import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, ArrowRight, Star, MessageCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CardSkeleton } from "@/components/ui/CardSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { matchAdmissions } from "@/lib/matching";
import { useSavedItems } from "@/hooks/useSavedItems";
import { track } from "@/lib/analytics";
import { Link } from "react-router-dom";
import type { AdmissionOpportunity } from "@/data/admissions";

const WA_LINK = "https://wa.me/33768674292";

const MATCH_TIER_STYLES: Record<string, string> = {
  strong: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  good: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  explore: "bg-secondary text-muted-foreground",
};

interface Props {
  onApply: (itemType: string, itemId: string, itemName: string) => void;
}

const AdmissionOpportunities = ({ onApply }: Props) => {
  const { language } = useLanguage();
  const isEn = language === "en";
  const { profile } = useAuth();
  const { isSaved, toggleSave } = useSavedItems();
  const [dbAdmissions, setDbAdmissions] = useState<AdmissionOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPartnersOnly, setShowPartnersOnly] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("admin_admissions")
        .select("*")
        .eq("is_published", true);
      if (data) {
        setDbAdmissions(
          data.map((d: any) => ({
            id: d.id,
            country: d.country,
            countryFlag: d.country_flag,
            institutionName: d.institution_name,
            institutionType: d.institution_type,
            programs: d.programs,
            levels: d.levels,
            intake: d.intake,
            description: { en: d.description_en, fr: d.description_fr },
            whyFit: { en: d.why_fit_en, fr: d.why_fit_fr },
            budgetLevel: d.budget_level,
            relevanceTags: d.relevance_tags || [],
          }))
        );
      }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="font-heading font-bold text-xl text-foreground mb-5">
          {isEn ? "Universities Accepting Students Like You" : "Universités qui accueillent des étudiants comme vous"}
        </h2>
        <CardSkeleton count={6} />
      </div>
    );
  }

  const matchedResults = matchAdmissions(dbAdmissions, profile || {});
  const filteredResults = showPartnersOnly
    ? matchedResults.filter(r => r.item.relevanceTags?.includes("partner"))
    : matchedResults;
  const results = filteredResults.slice(0, 6);

  const isPartner = (tags?: string[]) => tags?.includes("partner");

  if (results.length === 0) {
    return (
      <div>
        <h2 className="font-heading font-bold text-xl text-foreground mb-2">
          {isEn ? "Universities Accepting Students Like You" : "Universités qui accueillent des étudiants comme vous"}
        </h2>
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border text-center">
          <p className="text-muted-foreground mb-3">
            {showPartnersOnly
              ? (isEn
                ? "No partner schools match your current profile yet. Try adjusting your preferences or browse all universities."
                : "Aucune école partenaire ne correspond encore à votre profil. Ajustez vos préférences ou explorez toutes les universités.")
              : (isEn
                ? "Update your profile to see universities that match your goals and study level."
                : "Mettez à jour votre profil pour voir les universités qui correspondent à vos objectifs.")}
          </p>
          <Link to="/complete-profile">
            <Button variant="default" size="sm">
              {isEn ? "Update Profile" : "Mettre à jour le profil"}
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="font-heading font-bold text-xl text-foreground mb-1">
            {isEn ? "Universities Accepting Students Like You" : "Universités qui accueillent des étudiants comme vous"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isEn
              ? "Active admission opportunities aligned with your goals and preferences."
              : "Opportunités d'admission actives alignées avec vos objectifs et préférences."}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Switch
            id="partner-filter"
            checked={showPartnersOnly}
            onCheckedChange={setShowPartnersOnly}
          />
          <label
            htmlFor="partner-filter"
            className="text-sm font-medium text-foreground cursor-pointer flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-accent" />
            {isEn ? "KPB Partners Only" : "Partenaires KPB uniquement"}
          </label>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {results.map((r, i) => (
          <motion.div
            key={r.item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card rounded-2xl p-5 shadow-card border border-border hover:shadow-card-hover transition-all group relative"
          >
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {isPartner(r.item.relevanceTags) && (
                <Badge variant="default" className="bg-accent text-accent-foreground text-[10px] px-2 py-0.5">
                  <Award className="w-3 h-3 mr-1" />
                  {isEn ? "KPB Partner" : "Partenaire KPB"}
                </Badge>
              )}
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${MATCH_TIER_STYLES[r.matchTier]}`}>
                {isEn ? r.matchLabel.en : r.matchLabel.fr}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3 mt-6">
              <span className="text-2xl">{r.item.countryFlag}</span>
              <div>
                <h3 className="font-heading font-bold text-sm text-foreground leading-tight">
                  {r.item.institutionName}
                </h3>
                <span className="text-xs text-muted-foreground capitalize">
                  {r.item.institutionType === "community-college"
                    ? "Community College"
                    : r.item.institutionType === "grande-ecole"
                    ? "Grande École"
                    : isEn ? "University" : "Université"}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {isEn ? r.item.description.en : r.item.description.fr}
            </p>

            {r.reasons.length > 0 && (
              <div className="bg-primary/5 border border-primary/10 rounded-lg px-3 py-2 mb-3">
                <p className="text-xs font-semibold text-primary mb-1">
                  {isEn ? "Why this fits:" : "Pourquoi ça correspond :"}
                </p>
                <ul className="space-y-0.5">
                  {r.reasons.slice(0, 3).map((reason, j) => (
                    <li key={j} className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star className="w-3 h-3 text-primary shrink-0" />
                      {isEn ? reason.en : reason.fr}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-muted-foreground mb-3">
              <span className="font-medium">{isEn ? "Intake:" : "Rentrée :"}</span> {r.item.intake}
            </p>

            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={() => {
                  track("recommendation_clicked", { type: "admission", id: r.item.id, name: r.item.institutionName });
                  onApply("admission", r.item.id, r.item.institutionName);
                }}
              >
                {isEn ? "Check Eligibility" : "Vérifier l'éligibilité"}
                <ArrowRight className="w-3 h-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => toggleSave("admission", r.item.id)}>
                {isSaved("admission", r.item.id) ? <BookmarkCheck className="w-4 h-4 text-accent" /> : <Bookmark className="w-4 h-4" />}
              </Button>
            </div>

            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="mt-2 block">
              <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                <MessageCircle className="w-3.5 h-3.5" />
                {isEn ? "Talk to Advisor" : "Parler à un conseiller"}
              </Button>
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdmissionOpportunities;
