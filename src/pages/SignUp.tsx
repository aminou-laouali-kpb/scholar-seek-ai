import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const SignUp = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl text-foreground">{t("signup.title")}</h1>
            <p className="text-muted-foreground mt-2">{t("signup.subtitle")}</p>
          </div>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.firstName")}</label>
                <Input />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.lastName")}</label>
                <Input />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.email")}</label>
              <Input type="email" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.password")}</label>
              <Input type="password" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.confirmPassword")}</label>
              <Input type="password" />
            </div>
            <Button variant="accent" size="lg" className="w-full">{t("signup.cta")}</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("signup.hasAccount")}{" "}
            <Link to="/login" className="text-accent font-semibold hover:underline">{t("signup.loginLink")}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
