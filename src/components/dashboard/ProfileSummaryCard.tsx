import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Edit, MapPin, GraduationCap, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { countries } from "@/data/countries";

const ProfileSummaryCard = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const { profile } = useAuth();

  const getCountryName = (code: string | null) => {
    if (!code) return null;
    const c = countries.find((c) => c.code === code);
    return c ? (isEn ? c.nameEn : c.nameFr) : code;
  };

  // Calculate profile completion
  const fields = [
    profile?.first_name,
    profile?.last_name,
    profile?.whatsapp,
    profile?.country_of_birth,
    profile?.country_of_residence,
    profile?.study_level,
    profile?.desired_program || profile?.orientation_result,
    profile?.preferred_destinations?.length ? "yes" : null,
  ];
  const filled = fields.filter(Boolean).length;
  const completion = Math.round((filled / fields.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 shadow-card border border-border"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground">
              {profile?.first_name} {profile?.last_name}
            </h3>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
          </div>
        </div>
        <Link to="/complete-profile">
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
            {isEn ? "Edit" : "Modifier"}
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {isEn ? "Profile completion" : "Profil complété"}
          </span>
          <span className="text-xs font-bold text-primary">{completion}%</span>
        </div>
        <Progress value={completion} className="h-2" />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {profile?.country_of_residence && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{getCountryName(profile.country_of_residence)}</span>
          </div>
        )}
        {profile?.study_level && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{(t("signup.studyLevels") as Record<string, string>)[profile.study_level] || profile.study_level}</span>
          </div>
        )}
        {(profile?.desired_program || profile?.orientation_result) && (
          <div className="flex items-center gap-2 text-muted-foreground col-span-2">
            <Compass className="w-3.5 h-3.5" />
            <span>{profile?.desired_program || profile?.orientation_result}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileSummaryCard;
