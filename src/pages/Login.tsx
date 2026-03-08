import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const Login = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl text-foreground">{t("login.title")}</h1>
            <p className="text-muted-foreground mt-2">{t("login.subtitle")}</p>
          </div>
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.email")}</label>
              <Input type="email" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.password")}</label>
              <Input type="password" />
            </div>
            <div className="text-right">
              <button type="button" className="text-sm text-accent hover:underline">{t("login.forgot")}</button>
            </div>
            <Button variant="accent" size="lg" className="w-full">{t("login.cta")}</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("login.noAccount")}{" "}
            <Link to="/signup" className="text-accent font-semibold hover:underline">{t("login.signupLink")}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
