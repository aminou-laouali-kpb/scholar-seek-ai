import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  UserCheck, Compass, Globe2, Bookmark, FileText, 
  MessageCircle, ArrowRight, CheckCircle2, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSavedItems } from "@/hooks/useSavedItems";

const WA_LINK = "https://wa.me/33768674292";

interface Step {
  id: string;
  icon: React.ElementType;
  title: { en: string; fr: string };
  desc: { en: string; fr: string };
  cta: { en: string; fr: string };
  link: string;
  external?: boolean;
  done?: boolean;
}

const NextSteps = () => {
  const { language } = useLanguage();
  const isEn = language === "en";
  const { profile } = useAuth();
  const { items: savedItems } = useSavedItems();

  const profileCompleted = !!profile?.profile_completed;
  const hasProgram = !!(profile?.desired_program || profile?.orientation_result);
  const hasDestinations = !!(profile?.preferred_destinations?.length);
  const hasSaved = savedItems.length > 0;

  const allSteps: Step[] = [
    {
      id: "complete-profile",
      icon: UserCheck,
      title: { en: "Complete your profile", fr: "Complétez votre profil" },
      desc: { en: "Add your details so we can give you better recommendations.", fr: "Ajoutez vos informations pour de meilleures recommandations." },
      cta: { en: "Complete Profile", fr: "Compléter le profil" },
      link: "/complete-profile",
      done: profileCompleted,
    },
    {
      id: "choose-program",
      icon: Compass,
      title: { en: "Choose your study program", fr: "Choisissez votre programme" },
      desc: { en: "Take our orientation test to discover the best program for you.", fr: "Passez notre test d'orientation pour découvrir le meilleur programme." },
      cta: { en: "Take Orientation Test", fr: "Passer le test" },
      link: "/orientation",
      done: hasProgram,
    },
    {
      id: "explore-destinations",
      icon: Globe2,
      title: { en: "Explore destination options", fr: "Explorez les destinations" },
      desc: { en: "Browse our destination tools and find the best country for you.", fr: "Parcourez nos outils de destination et trouvez le meilleur pays." },
      cta: { en: "Explore Destinations", fr: "Explorer" },
      link: "/destinations",
      done: hasDestinations,
    },
    {
      id: "save-items",
      icon: Bookmark,
      title: { en: "Save scholarships or universities", fr: "Sauvegardez des bourses ou universités" },
      desc: { en: "Browse recommendations below and save the ones that interest you.", fr: "Parcourez les recommandations ci-dessous et sauvegardez celles qui vous intéressent." },
      cta: { en: "Browse Scholarships", fr: "Voir les bourses" },
      link: "#scholarships-section",
      done: hasSaved,
    },
    {
      id: "prepare-docs",
      icon: FileText,
      title: { en: "Prepare your documents", fr: "Préparez vos documents" },
      desc: { en: "Get ready for applications by gathering transcripts, CV, and motivation letters.", fr: "Préparez vos candidatures en rassemblant relevés, CV et lettres de motivation." },
      cta: { en: "Learn More", fr: "En savoir plus" },
      link: "/services",
      done: false,
    },
    {
      id: "contact-advisor",
      icon: MessageCircle,
      title: { en: "Talk to a KPB advisor", fr: "Parlez à un conseiller KPB" },
      desc: { en: "Get personalized guidance from our expert team.", fr: "Obtenez des conseils personnalisés de notre équipe d'experts." },
      cta: { en: "Chat on WhatsApp", fr: "Discuter sur WhatsApp" },
      link: WA_LINK,
      external: true,
      done: false,
    },
  ];

  // Show undone steps first, limit to 4
  const pending = allSteps.filter((s) => !s.done);
  const completed = allSteps.filter((s) => s.done);
  const displayed = [...pending.slice(0, 4)];

  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-foreground mb-1">
        {isEn ? "Your Next Steps" : "Vos prochaines étapes"}
      </h2>
      <p className="text-muted-foreground text-sm mb-4">
        {isEn
          ? `${completed.length} of ${allSteps.length} steps completed`
          : `${completed.length} sur ${allSteps.length} étapes complétées`}
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {displayed.map((step, i) => {
          const Icon = step.icon;
          const content = (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-card rounded-xl p-4 shadow-card border border-border hover:shadow-card-hover transition-all group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading font-semibold text-sm text-foreground mb-0.5">
                    {isEn ? step.title.en : step.title.fr}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {isEn ? step.desc.en : step.desc.fr}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
                    {isEn ? step.cta.en : step.cta.fr}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          );

          if (step.external)
            return (
              <a key={step.id} href={step.link} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            );
          if (step.link.startsWith("#"))
            return (
              <a key={step.id} href={step.link}>
                {content}
              </a>
            );
          return (
            <Link key={step.id} to={step.link}>
              {content}
            </Link>
          );
        })}
      </div>

      {completed.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {completed.map((step) => (
            <span
              key={step.id}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full"
            >
              <CheckCircle2 className="w-3 h-3" />
              {isEn ? step.title.en : step.title.fr}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default NextSteps;
