import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { User, GraduationCap, Award, ClipboardCheck, FileText, MessageCircle } from "lucide-react";

const Dashboard = () => {
  const { t } = useLanguage();
  const cards = t("dashboard.cards") as Record<string, { title: string; desc: string }>;
  const icons = [User, GraduationCap, Award, ClipboardCheck, FileText, MessageCircle];
  const cardKeys = ["profile", "universities", "scholarships", "progress", "documents", "advisor"];

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="gradient-hero py-12 px-4">
        <div className="container-narrow mx-auto">
          <h1 className="font-heading font-bold text-3xl text-primary-foreground">{t("dashboard.title")}</h1>
          <p className="text-primary-foreground/70 mt-2">{t("dashboard.subtitle")}</p>
        </div>
      </div>
      <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardKeys.map((key, i) => {
            const Icon = icons[i];
            const card = cards[key];
            return (
              <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-card-hover transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-1">{card.title}</h3>
                <p className="text-muted-foreground text-sm">{card.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
