import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Award, Bookmark, BookmarkCheck, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scholarships } from "@/data/scholarships";
import { matchScholarships } from "@/lib/matching";
import { useSavedItems } from "@/hooks/useSavedItems";

interface Props {
  onApply: (itemType: string, itemId: string, itemName: string) => void;
}

const ScholarshipRecommendations = ({ onApply }: Props) => {
  const { language } = useLanguage();
  const isEn = language === "en";
  const { profile } = useAuth();
  const { isSaved, toggleSave } = useSavedItems();

  const results = matchScholarships(scholarships, profile || {}).slice(0, 6);

  return (
    <div id="scholarships-section">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-heading font-bold text-xl text-foreground">
          {isEn ? "Scholarships Recommended for Your Profile" : "Bourses recommandées pour votre profil"}
        </h2>
      </div>
      <p className="text-muted-foreground text-sm mb-5">
        {isEn
          ? "Based on your profile, here are scholarships that match your goals."
          : "Selon votre profil, voici les bourses qui correspondent à vos objectifs."}
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {results.map((r, i) => (
          <motion.div
            key={r.item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card rounded-2xl p-5 shadow-card border border-border hover:shadow-card-hover transition-all group relative"
          >
            {/* Match badge */}
            <div className="absolute top-4 right-4">
              <span className="text-xs font-bold bg-accent/15 text-accent px-2 py-0.5 rounded-full">
                {r.percentage}% {isEn ? "match" : "compatibilité"}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{r.item.countryFlag}</span>
              <div>
                <h3 className="font-heading font-bold text-sm text-foreground leading-tight pr-16">
                  {r.item.name}
                </h3>
                <span className="text-xs text-muted-foreground capitalize">
                  {r.item.fundingType === "full"
                    ? isEn ? "Full funding" : "Financement complet"
                    : isEn ? "Partial funding" : "Financement partiel"}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {isEn ? r.item.description.en : r.item.description.fr}
            </p>

            {/* Why it matches */}
            {r.reasons.length > 0 && (
              <div className="bg-accent/5 border border-accent/10 rounded-lg px-3 py-2 mb-3">
                <p className="text-xs font-semibold text-accent mb-1">
                  {isEn ? "Why this matches you:" : "Pourquoi ça vous correspond :"}
                </p>
                <ul className="space-y-0.5">
                  {r.reasons.slice(0, 3).map((reason, j) => (
                    <li key={j} className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star className="w-3 h-3 text-accent shrink-0" />
                      {isEn ? reason.en : reason.fr}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-muted-foreground mb-3">
              <span className="font-medium">{isEn ? "Deadline:" : "Date limite :"}</span> {r.item.deadline}
            </p>

            <div className="flex gap-2">
              <Button
                variant="accent"
                size="sm"
                className="flex-1"
                onClick={() => onApply("scholarship", r.item.id, r.item.name)}
              >
                {isEn ? "Start Application" : "Postuler"}
                <ArrowRight className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleSave("scholarship", r.item.id)}
              >
                {isSaved("scholarship", r.item.id) ? (
                  <BookmarkCheck className="w-4 h-4 text-accent" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ScholarshipRecommendations;
