import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const CheckEmail = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4 py-16">
      <SEOHead title={isEn ? "Check Your Email — KPB Education" : "Vérifiez votre email — KPB Éducation"} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-accent" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-foreground mb-3">
            {isEn ? "Check Your Email" : "Vérifiez votre email"}
          </h1>
          <p className="text-muted-foreground mb-2">
            {isEn
              ? "We've sent you a confirmation link. Please check your inbox (and spam folder) to verify your account."
              : "Nous vous avons envoyé un lien de confirmation. Veuillez vérifier votre boîte de réception (et le dossier spam) pour activer votre compte."}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            {isEn
              ? "Once confirmed, you can log in and access your dashboard."
              : "Une fois confirmé, vous pourrez vous connecter et accéder à votre tableau de bord."}
          </p>
          <Link to="/login">
            <Button variant="accent" size="lg" className="w-full">
              <ArrowLeft className="w-4 h-4" />
              {isEn ? "Back to Login" : "Retour à la connexion"}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckEmail;
