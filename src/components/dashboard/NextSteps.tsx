import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserCheck, Compass, Globe2, Bookmark, FileText,
  MessageCircle, ArrowRight, CheckCircle2, ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSavedItems } from "@/hooks/useSavedItems";
import { track } from "@/lib/analytics";

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
  priority: number;
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
  const isAdvanced = profileCompleted && hasProgram && hasDestinations;
  const wantsScholarships = profile?.scholarship_interest !== false;

  const allSteps: Step[] = [
    {
      id: "complete-profile",
      icon: UserCheck,
      title: { en: "Complete your profile", fr: "Complétez votre profil" },
      desc: {
        en: "The more we know about you, the better your recommendations will be.",
        fr: "Plus nous en savons sur vous, meilleures seront vos recommandations.",
      },
      cta: { en: "Complete Profile", fr: "Compléter le profil" },
      link: "/complete-profile",
      done: profileCompleted,
      priority: profileCompleted ? 99 : 1,
    },
    {
      id: "choose-program",
      icon: Compass,
      title: { en: "Discover your ideal program", fr: "Découvrez votre programme idéal" },
      desc: {
        en: "Take our quick orientation test to find the best study program for your goals.",
        fr: "Passez notre test d'orientation rapide pour trouver le programme qui correspond à vos objectifs.",
      },
      cta: { en: "Take Orientation Test", fr: "Passer le test d'orientation" },
      link: "/orientation",
      done: hasProgram,
      priority: hasProgram ? 99 : 2,
    },
    {
      id: "explore-destinations",
      icon: Globe2,
      title: { en: "Choose your destination", fr: "Choisissez votre destination" },
      desc: {
        en: "Explore our tools to find the best country and university for your profile.",
        fr: "Explorez nos outils pour trouver le meilleur pays et la meilleure université pour votre profil.",
      },
      cta: { en: "Explore Destinations", fr: "Explorer les destinations" },
      link: "/destinations",
      done: hasDestinations,
      priority: hasDestinations ? 99 : 3,
    },
    {
      id: "save-items",
      icon: Bookmark,
      title: { en: "Build your shortlist", fr: "Créez votre sélection" },
      desc: {
        en: "Browse recommendations below and save the scholarships or universities that interest you.",
        fr: "Parcourez les recommandations ci-dessous et sauvegardez les bourses ou universités qui vous intéressent.",
      },
      cta: { en: "Browse Scholarships", fr: "Voir les bourses" },
      link: "#scholarships-section",
      done: hasSaved,
      priority: hasSaved ? 99 : (wantsScholarships ? 3.5 : 5),
    },
    {
      id: "review-shortlist",
      icon: ClipboardList,
      title: { en: "Review your shortlist", fr: "Consultez votre sélection" },
      desc: {
        en: "You have saved items — review them and decide which ones to pursue.",
        fr: "Vous avez des éléments sauvegardés — consultez-les et décidez lesquels poursuivre.",
      },
      cta: { en: "View Shortlist", fr: "Voir la sélection" },
      link: "#saved-section",
      done: false,
      priority: hasSaved ? (isAdvanced ? 1 : 4) : 99,
    },
    {
      id: "prepare-docs",
      icon: FileText,
      title: { en: "Prepare your documents", fr: "Préparez vos documents" },
      desc: {
        en: "Get ready by gathering your transcripts, CV, and motivation letters.",
        fr: "Préparez-vous en rassemblant vos relevés de notes, CV et lettres de motivation.",
      },
      cta: { en: "Learn More", fr: "En savoir plus" },
      link: "/services",
      done: false,
      priority: isAdvanced ? 2 : 6,
    },
    {
      id: "contact-advisor",
      icon: MessageCircle,
      title: { en: "Talk to a KPB advisor", fr: "Parlez à un conseiller KPB" },
      desc: {
        en: "Get personalized guidance from our expert team — we're here to help.",
        fr: "Obtenez des conseils personnalisés de notre équipe d'experts — nous sommes là pour vous aider.",
      },
      cta: { en: "Chat on WhatsApp", fr: "Discuter sur WhatsApp" },
      link: WA_LINK,
      external: true,
      done: false,
      priority: isAdvanced ? 1.5 : 7,
    },
  ];

  // Sort by priority (lower = higher priority), filter out hidden ones (priority 99)
  const pending = allSteps.filter((s) => !s.done && s.priority < 99).sort((a, b) => a.priority - b.priority);
  const completed = allSteps.filter((s) => s.done);
  const displayed = pending.slice(0, 4);

  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-foreground mb-1">
        {isEn ? "Your Next Steps" : "Vos prochaines étapes"}
      </h2>
      <p className="text-muted-foreground text-sm mb-4">
        {isEn
          ? `${completed.length} of ${allSteps.filter(s => s.priority < 99 || s.done).length} steps completed — keep going!`
          : `${completed.length} sur ${allSteps.filter(s => s.priority < 99 || s.done).length} étapes complétées — continuez !`}
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
              <a key={step.id} href={step.link} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_clicked", { context: "next_steps" })}>
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
