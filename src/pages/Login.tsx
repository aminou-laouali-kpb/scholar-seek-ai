import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";

const Login = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("profile_completed").eq("user_id", user.id).single();
        navigate(profile?.profile_completed ? "/dashboard" : "/complete-profile");
      }
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(isEn ? "Please enter your email" : "Veuillez entrer votre email");
      return;
    }
    setForgotLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(isEn ? "Password reset link sent! Check your email." : "Lien de réinitialisation envoyé ! Vérifiez votre email.");
      setForgotMode(false);
    }
    setForgotLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error(String(error));
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4 py-16">
      <SEOHead title={isEn ? "Log In — KPB Education" : "Connexion — KPB Éducation"} description={isEn ? "Log in to your KPB Education account." : "Connectez-vous à votre compte KPB Éducation."} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl text-foreground">
              {forgotMode ? (isEn ? "Reset Password" : "Réinitialiser le mot de passe") : t("login.title")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {forgotMode
                ? (isEn ? "Enter your email to receive a reset link" : "Entrez votre email pour recevoir un lien de réinitialisation")
                : t("login.subtitle")}
            </p>
          </div>

          {forgotMode ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.email")}</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button variant="accent" size="lg" className="w-full" disabled={forgotLoading}>
                {forgotLoading ? "..." : isEn ? "Send Reset Link" : "Envoyer le lien"}
              </Button>
              <button type="button" onClick={() => setForgotMode(false)} className="w-full text-sm text-accent hover:underline text-center">
                {isEn ? "Back to login" : "Retour à la connexion"}
              </button>
            </form>
          ) : (
            <>
              {/* Google button */}
              <Button variant="outline" size="lg" className="w-full mb-6 gap-3" onClick={handleGoogleLogin}>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {t("login.google")}
              </Button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">{t("login.or")}</span></div>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.email")}</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{t("login.password")}</label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="text-right">
                  <button type="button" onClick={() => setForgotMode(true)} className="text-sm text-accent hover:underline">
                    {t("login.forgot")}
                  </button>
                </div>
                <Button variant="accent" size="lg" className="w-full" disabled={loading}>
                  {loading ? "..." : t("login.cta")}
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-6">
                {t("login.noAccount")}{" "}
                <Link to="/signup" className="text-accent font-semibold hover:underline">{t("login.signupLink")}</Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
