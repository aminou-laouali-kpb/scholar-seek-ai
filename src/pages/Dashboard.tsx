import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, Globe2, Search } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import ProfileSummaryCard from "@/components/dashboard/ProfileSummaryCard";
import NextSteps from "@/components/dashboard/NextSteps";
import ScholarshipRecommendations from "@/components/dashboard/ScholarshipRecommendations";
import AdmissionOpportunities from "@/components/dashboard/AdmissionOpportunities";
import SavedItems from "@/components/dashboard/SavedItems";
import ApplicationModal from "@/components/dashboard/ApplicationModal";
import RecoursStatusCard from "@/components/dashboard/RecoursStatusCard";
import { track } from "@/lib/analytics";
import { useLeadScore } from "@/hooks/useLeadScore";

const WA_LINK = "https://wa.me/33768674292";

const Dashboard = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const { profile } = useAuth();
  useLeadScore();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ itemType: "", itemId: "", itemName: "" });
  const [recoursData, setRecoursData] = useState<{ hasRecours: boolean; openToPrivate: boolean; category: string | null }>({ hasRecours: false, openToPrivate: false, category: null });
  const boostPrivate = recoursData.hasRecours && (recoursData.openToPrivate || recoursData.category === "C" || recoursData.category === "D");

  const handleApply = (itemType: string, itemId: string, itemName: string) => {
    track("application_started", { itemType, itemId, itemName });
    setModalData({ itemType, itemId, itemName });
    setModalOpen(true);
  };

  const destinations = [
    { key: "france", flag: "🇫🇷", route: "/tools/france", icon: Search },
    { key: "belgium", flag: "🇧🇪", route: "/tools/belgium", icon: Search },
    { key: "canada", flag: "🇨🇦", route: "/tools/canada", icon: Search },
    { key: "china", flag: "🇨🇳", route: "/tools/china", icon: Globe2 },
    { key: "usa", flag: "🇺🇸", route: "/tools/usa", icon: Globe2 },
  ];

  const destDescriptions: Record<string, { en: string; fr: string }> = {
    france: { en: "Find the best private school for your profile", fr: "Trouvez la meilleure école privée selon votre profil" },
    belgium: { en: "Find the best university for your profile", fr: "Trouvez la meilleure université selon votre profil" },
    canada: { en: "Find the best university for your profile", fr: "Trouvez la meilleure université selon votre profil" },
    china: { en: "Find the best university for your profile", fr: "Trouvez la meilleure université selon votre profil" },
    usa: { en: "Find the best university or community college for your profile", fr: "Trouvez la meilleure université ou community college selon votre profil" },
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <SEOHead title={isEn ? "Dashboard — KPB Education" : "Tableau de bord — KPB Éducation"} description={isEn ? "Your personalized study abroad dashboard." : "Votre tableau de bord personnalisé."} />
      {/* Hero Banner */}
      <div className="gradient-hero py-10 px-4">
        <div className="container-narrow mx-auto">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-primary-foreground">
            {profile?.first_name
              ? isEn
                ? `Welcome back, ${profile.first_name}!`
                : `Bon retour, ${profile.first_name} !`
              : t("dashboard.title")}
          </h1>
          <p className="text-primary-foreground/70 mt-1 text-sm">
            {isEn
              ? "Your personalized roadmap to studying abroad — everything in one place."
              : "Votre feuille de route personnalisée pour étudier à l'étranger — tout en un seul endroit."}
          </p>
        </div>
      </div>

      <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Profile Summary */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProfileSummaryCard />
          </div>
          <div className="lg:col-span-2">
            <NextSteps />
          </div>
        </div>

        {/* Recours Status */}
        <RecoursStatusCard onRecoursData={setRecoursData} />

        {/* Admission Opportunities — boosted if recours user open to private */}
        {boostPrivate && (
          <div>
            <h2 className="font-heading font-bold text-xl text-foreground mb-1">
              {isEn ? "🔒 Secure Your Plan B" : "🔒 Sécurise ton plan B"}
            </h2>
            <p className="text-muted-foreground text-sm mb-5">
              {isEn
                ? "While waiting for your appeal result, secure a spot in a private school."
                : "Pendant l'attente de ton recours, sécurise une place en école privée."}
            </p>
            <AdmissionOpportunities onApply={handleApply} />
          </div>
        )}

        {/* Scholarship Recommendations */}
        {recoursData.hasRecours && (
          <div>
            <h2 className="font-heading font-bold text-xl text-foreground mb-1">
              {isEn ? "💡 Explore Scholarships While You Wait" : "💡 Explore les bourses en attendant"}
            </h2>
            <p className="text-muted-foreground text-sm mb-5">
              {isEn
                ? "Don't wait — start applying to scholarships now to maximize your options."
                : "N'attends pas — commence à postuler aux bourses dès maintenant pour maximiser tes options."}
            </p>
          </div>
        )}
        <ScholarshipRecommendations onApply={handleApply} />

        {/* Admission Opportunities (normal order if not boosted) */}
        {!boostPrivate && <AdmissionOpportunities onApply={handleApply} />}

        {/* Destinations & Tools */}
        <div>
          <h2 className="font-heading font-bold text-xl text-foreground mb-1">
            {isEn ? "Find the Right University for Your Goals" : "Trouvez l'université idéale pour vos objectifs"}
          </h2>
          <p className="text-muted-foreground text-sm mb-5">
            {isEn ? "Use our destination tools to discover the best universities and programs for your profile." : "Utilisez nos outils de destination pour découvrir les meilleures universités et programmes selon votre profil."}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {destinations.map((dest, i) => {
              const DestIcon = dest.icon;
              return (
                <motion.div
                  key={dest.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-card rounded-2xl p-5 shadow-card border border-border hover:shadow-card-hover transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{dest.flag}</span>
                    <h3 className="font-heading font-bold text-foreground">
                      {t(`destinationsPage.countries.${dest.key}.name`)}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {destDescriptions[dest.key]?.[isEn ? "en" : "fr"]}
                  </p>
                  <div className="flex flex-col gap-2">
                    <Link to={dest.route}>
                      <Button variant="default" size="sm" className="w-full">
                        <DestIcon className="w-4 h-4" />
                        {isEn ? "Open Tool" : "Ouvrir l'outil"}
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                    <a href={WA_LINK} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_clicked", { context: "destination_tool", destination: dest.key })}>
                      <Button variant="outline" size="sm" className="w-full">
                        <MessageCircle className="w-4 h-4" />
                        {isEn ? "Talk to Advisor" : "Parler à un conseiller"}
                      </Button>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Saved Items */}
        <div id="saved-section">
          <SavedItems />
        </div>

        {/* Advisor CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card rounded-2xl p-6 sm:p-8 shadow-card border border-border text-center"
        >
          <h2 className="font-heading font-bold text-xl text-foreground mb-2">
            {isEn ? "Need Personalized Guidance?" : "Besoin d'un accompagnement personnalisé ?"}
          </h2>
          <p className="text-muted-foreground text-sm mb-4 max-w-lg mx-auto">
            {isEn
              ? "Our expert advisors are ready to help you with university selection, application reviews, visa support, and more."
              : "Nos conseillers experts sont prêts à vous aider pour le choix des universités, la relecture des candidatures, l'aide au visa, et plus encore."}
          </p>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_clicked", { context: "dashboard_cta" })}>
            <Button variant="accent" size="lg">
              <MessageCircle className="w-5 h-5" />
              {isEn ? "Chat with an Advisor" : "Discuter avec un conseiller"}
            </Button>
          </a>
        </motion.div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        itemType={modalData.itemType}
        itemId={modalData.itemId}
        itemName={modalData.itemName}
      />
    </div>
  );
};

export default Dashboard;
