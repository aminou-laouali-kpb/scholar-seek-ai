import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

const ResetPassword = () => {
  const { language } = useLanguage();
  const isEn = language === "en";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    // Also check hash for type=recovery
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error(isEn ? "Passwords don't match" : "Les mots de passe ne correspondent pas");
      return;
    }
    if (password.length < 6) {
      toast.error(isEn ? "Password must be at least 6 characters" : "Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(isEn ? "Password updated! You can now log in." : "Mot de passe mis à jour ! Vous pouvez maintenant vous connecter.");
      navigate("/login");
    }
    setLoading(false);
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4 py-16">
        <div className="text-center text-muted-foreground">
          {isEn ? "Verifying your reset link..." : "Vérification de votre lien..."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <KeyRound className="w-8 h-8 text-accent" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-foreground text-center mb-2">
            {isEn ? "Set New Password" : "Nouveau mot de passe"}
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-6">
            {isEn ? "Enter your new password below." : "Entrez votre nouveau mot de passe ci-dessous."}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                {isEn ? "New Password" : "Nouveau mot de passe"}
              </label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                {isEn ? "Confirm Password" : "Confirmer le mot de passe"}
              </label>
              <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
            <Button variant="accent" size="lg" className="w-full" disabled={loading}>
              {loading ? "..." : isEn ? "Update Password" : "Mettre à jour"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
