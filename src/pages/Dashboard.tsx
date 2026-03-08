import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { User, Compass, Award, GraduationCap, ClipboardCheck, MessageCircle, Lock, ArrowRight, Globe2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const WA_LINK = "https://wa.me/33768674292";

const Dashboard = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("kpb-student-profile");
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  const cards = t("dashboard.cards") as Record<string, { title: string; desc: string }>;

  const cardConfigs = [
    { key: "profile", icon: User, link: "#", enabled: true },
    { key: "orientation", icon: Compass, link: profile?.orientationResult ? "#" : "/orientation", enabled: true },
    { key: "scholarships", icon: Award, link: "#", enabled: false },
    { key: "admissions", icon: GraduationCap, link: "#", enabled: false },
    { key: "actions", icon: ClipboardCheck, link: "#", enabled: true },
    { key: "advisor", icon: MessageCircle, link: WA_LINK, enabled: true, external: true },
  ];

  const destinations = [
    { key: "france", flag: "🇫🇷", route: "/tools/france", icon: Search },
    { key: "belgium", flag: "🇧🇪", route: "/tools/belgium", icon: Search },
    { key: "canada", flag: "🇨🇦", route: "/tools/canada", icon: Search },
    { key: "china", flag: "🇨🇳", route: "/tools/china", icon: Globe2 },
    { key: "usa", flag: "🇺🇸", route: "/tools/usa", icon: Globe2 },
  ];

  const destDescriptions: Record<string, { en: string; fr: string }> = {
    france: {
      en: "Find the best private school for your profile",
      fr: "Trouve la meilleure école privée selon ton profil",
    },
    belgium: {
      en: "Find the best university according to your profile",
      fr: "Trouve la meilleure université selon ton profil",
    },
    canada: {
      en: "Find the best university according to your profile",
      fr: "Trouve la meilleure université selon ton profil",
    },
    china: {
      en: "Find the best university according to your profile",
      fr: "Trouve la meilleure université selon ton profil",
    },
    usa: {
      en: "Find the best university or community college for your profile",
      fr: "Trouve la meilleure université ou community college selon ton profil",
    },
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="gradient-hero py-12 px-4">
        <div className="container-narrow mx-auto">
          <h1 className="font-heading font-bold text-3xl text-primary-foreground">{t("dashboard.title")}</h1>
          <p className="text-primary-foreground/70 mt-2">{t("dashboard.subtitle")}</p>
          {profile && (
            <p className="text-primary-foreground/60 mt-1 text-sm">
              {profile.firstName} {profile.lastName}
            </p>
          )}
        </div>
      </div>
      <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Dashboard Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardConfigs.map(({ key, icon: Icon, link, enabled, external }, i) => {
            const card = cards[key];
            const isOrientation = key === "orientation";
            const hasOrientationResult = profile?.orientationResult;

            const content = (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`bg-card rounded-2xl p-6 shadow-card border border-border transition-all group relative overflow-hidden ${
                  enabled ? "hover:shadow-card-hover cursor-pointer" : "opacity-75"
                }`}
              >
                {!enabled && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2 py-1 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" /> {t("dashboard.comingSoon")}
                    </span>
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-1">{card.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{card.desc}</p>

                {isOrientation && hasOrientationResult && (
                  <div className="bg-accent/10 border border-accent/20 rounded-lg px-3 py-2 mb-2">
                    <p className="text-xs font-semibold text-accent">{t("dashboard.orientationDone")}</p>
                    <p className="text-sm font-bold text-foreground">{profile?.desiredProgram}</p>
                  </div>
                )}
                {isOrientation && !hasOrientationResult && (
                  <Button variant="accent" size="sm" className="mt-1">
                    {t("dashboard.orientationCta")} <ArrowRight className="w-3 h-3" />
                  </Button>
                )}
                {key === "advisor" && (
                  <Button variant="accent" size="sm" className="mt-1">
                    <MessageCircle className="w-4 h-4" /> {t("dashboard.advisorCta")}
                  </Button>
                )}
              </motion.div>
            );

            if (external) {
              return <a key={key} href={link} target="_blank" rel="noopener noreferrer">{content}</a>;
            }
            if (enabled && link !== "#") {
              return <Link key={key} to={link}>{content}</Link>;
            }
            return <div key={key}>{content}</div>;
          })}
        </div>

        {/* Destination Tools Section */}
        <div className="mt-14">
          <h2 className="font-heading font-bold text-2xl text-foreground mb-2">
            {isEn ? "Recommended Destinations & Tools for Your Profile" : "Destinations et outils recommandés pour votre profil"}
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            {isEn
              ? "Explore our destination tools to find the best universities and programs for you."
              : "Explorez nos outils de destination pour trouver les meilleures universités et programmes pour vous."}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest, i) => {
              const DestIcon = dest.icon;
              return (
                <motion.div
                  key={dest.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-card-hover transition-all group"
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
                        {isEn ? "Open Tool" : "Ouvrir l'Outil"}
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                    <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="w-full">
                        <MessageCircle className="w-4 h-4" />
                        {isEn ? "Talk to Advisor" : "Parler à un Conseiller"}
                      </Button>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
