import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Star, StarOff, Trash2, Award, GraduationCap, Globe2, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSavedItems, SavedItemType } from "@/hooks/useSavedItems";
import { scholarships } from "@/data/scholarships";
import { admissions } from "@/data/admissions";
import { track } from "@/lib/analytics";

const WA_LINK = "https://wa.me/33768674292";

const TABS: { key: "all" | SavedItemType; en: string; fr: string }[] = [
  { key: "all", en: "All", fr: "Tout" },
  { key: "scholarship", en: "Scholarships", fr: "Bourses" },
  { key: "admission", en: "Admissions", fr: "Admissions" },
  { key: "destination", en: "Destinations", fr: "Destinations" },
];

const SavedItems = () => {
  const { language } = useLanguage();
  const isEn = language === "en";
  const { items, toggleSave, togglePriority } = useSavedItems();
  const [activeTab, setActiveTab] = useState<"all" | SavedItemType>("all");

  const filtered = activeTab === "all" ? items : items.filter((i) => i.item_type === activeTab);
  const sorted = [...filtered].sort((a, b) => {
    if (a.is_priority && !b.is_priority) return -1;
    if (!a.is_priority && b.is_priority) return 1;
    return 0;
  });

  const getItemName = (type: SavedItemType, id: string): string => {
    if (type === "scholarship") {
      return scholarships.find((s) => s.id === id)?.name || id;
    }
    if (type === "admission") {
      return admissions.find((a) => a.id === id)?.institutionName || id;
    }
    return id;
  };

  const getItemIcon = (type: SavedItemType) => {
    if (type === "scholarship") return Award;
    if (type === "admission") return GraduationCap;
    return Globe2;
  };

  // Empty state
  if (items.length === 0) {
    return (
      <div>
        <h2 className="font-heading font-bold text-xl text-foreground mb-2">
          {isEn ? "Your Shortlist" : "Votre sélection"}
        </h2>
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border text-center">
          <Bookmark className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm mb-1">
            {isEn
              ? "You haven't saved anything yet."
              : "Vous n'avez encore rien sauvegardé."}
          </p>
          <p className="text-muted-foreground text-xs">
            {isEn
              ? "Browse scholarships or admissions above and bookmark the ones that interest you."
              : "Parcourez les bourses ou admissions ci-dessus et ajoutez en favoris celles qui vous intéressent."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-foreground mb-1">
        {isEn ? "Your Shortlist" : "Votre sélection"}
      </h2>
      <p className="text-muted-foreground text-sm mb-4">
        {isEn
          ? `${items.length} item${items.length > 1 ? "s" : ""} saved — review and take action`
          : `${items.length} élément${items.length > 1 ? "s" : ""} sauvegardé${items.length > 1 ? "s" : ""} — consultez et passez à l'action`}
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            }`}
          >
            {isEn ? tab.en : tab.fr}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {sorted.map((item) => {
            const Icon = getItemIcon(item.item_type);
            const name = getItemName(item.item_type, item.item_id);

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  item.is_priority
                    ? "bg-accent/5 border-accent/20"
                    : "bg-card border-border"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{item.item_type}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => togglePriority(item.item_type, item.item_id)}
                  >
                    {item.is_priority ? (
                      <Star className="w-4 h-4 text-accent fill-accent" />
                    ) : (
                      <StarOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleSave(item.item_type, item.item_id)}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Advisor CTA for saved items */}
      <div className="mt-4 bg-accent/5 border border-accent/10 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <p className="text-sm text-foreground flex-1">
          {isEn
            ? "Ready to move forward? Talk to an advisor about your shortlist."
            : "Prêt à avancer ? Parlez à un conseiller de votre sélection."}
        </p>
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
          <Button variant="accent" size="sm" onClick={() => track("whatsapp_clicked", { context: "saved_items" })}>
            <MessageCircle className="w-4 h-4" />
            {isEn ? "Chat on WhatsApp" : "Discuter sur WhatsApp"}
          </Button>
        </a>
      </div>
    </div>
  );
};

export default SavedItems;
