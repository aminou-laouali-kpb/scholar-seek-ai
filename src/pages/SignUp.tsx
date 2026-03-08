import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

const COUNTRY_KEYS = [
  "cameroon", "congo", "drc", "senegal", "ivoryCoast", "gabon", "chad", "togo",
  "benin", "mali", "guinea", "burkinaFaso", "niger", "madagascar", "rwanda", "burundi",
  "morocco", "tunisia", "algeria", "nigeria", "ghana", "kenya", "southAfrica", "tanzania",
  "uganda", "ethiopia", "other",
];

const STUDY_LEVEL_KEYS = ["highSchool", "bachelor", "master", "phd", "other"];

const SignUp = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [dontKnowProgram, setDontKnowProgram] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", whatsapp: "",
    countryOfBirth: "", countryOfResidence: "", studyLevel: "",
    desiredProgram: "", password: "", confirmPassword: "",
  });

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store in localStorage for now (Phase 2 — no backend yet)
    const profile = { ...form, dontKnowProgram, orientationResult: null };
    localStorage.setItem("kpb-student-profile", JSON.stringify(profile));

    if (dontKnowProgram) {
      navigate("/orientation");
    } else {
      navigate("/dashboard");
    }
  };

  const studyLevels = t("signup.studyLevels") as Record<string, string>;
  const countriesMap = t("countries") as Record<string, string>;

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl text-foreground">{t("signup.title")}</h1>
            <p className="text-muted-foreground mt-2">{t("signup.subtitle")}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Names */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.firstNamePassport")}</label>
                <Input value={form.firstName} onChange={e => update("firstName", e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.lastNamePassport")}</label>
                <Input value={form.lastName} onChange={e => update("lastName", e.target.value)} required />
              </div>
            </div>

            {/* Email & WhatsApp */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.email")}</label>
                <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.whatsapp")}</label>
                <Input type="tel" placeholder={t("signup.whatsappPlaceholder")} value={form.whatsapp} onChange={e => update("whatsapp", e.target.value)} required />
              </div>
            </div>

            {/* Country of birth & residence */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.countryOfBirth")}</label>
                <Select value={form.countryOfBirth} onValueChange={v => update("countryOfBirth", v)}>
                  <SelectTrigger><SelectValue placeholder={t("signup.selectCountry")} /></SelectTrigger>
                  <SelectContent>
                    {COUNTRY_KEYS.map(key => (
                      <SelectItem key={key} value={key}>{countriesMap[key]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.countryOfResidence")}</label>
                <Select value={form.countryOfResidence} onValueChange={v => update("countryOfResidence", v)}>
                  <SelectTrigger><SelectValue placeholder={t("signup.selectCountry")} /></SelectTrigger>
                  <SelectContent>
                    {COUNTRY_KEYS.map(key => (
                      <SelectItem key={key} value={key}>{countriesMap[key]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Study Level */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.studyLevel")}</label>
              <Select value={form.studyLevel} onValueChange={v => update("studyLevel", v)}>
                <SelectTrigger><SelectValue placeholder={t("signup.selectLevel")} /></SelectTrigger>
                <SelectContent>
                  {STUDY_LEVEL_KEYS.map(key => (
                    <SelectItem key={key} value={key}>{studyLevels[key]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Desired Program */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.desiredProgram")}</label>
              {!dontKnowProgram && (
                <Input
                  placeholder={t("signup.desiredProgramPlaceholder")}
                  value={form.desiredProgram}
                  onChange={e => update("desiredProgram", e.target.value)}
                />
              )}
              <div className="flex items-center gap-2 mt-2">
                <Checkbox
                  id="dont-know"
                  checked={dontKnowProgram}
                  onCheckedChange={(checked) => {
                    setDontKnowProgram(!!checked);
                    if (checked) update("desiredProgram", "");
                  }}
                />
                <label htmlFor="dont-know" className="text-sm text-muted-foreground cursor-pointer">
                  {t("signup.dontKnowProgram")}
                </label>
              </div>
              {dontKnowProgram && (
                <div className="mt-2 flex items-start gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{t("signup.orientationNote")}</p>
                </div>
              )}
            </div>

            {/* Passwords */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.password")}</label>
                <Input type="password" value={form.password} onChange={e => update("password", e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.confirmPassword")}</label>
                <Input type="password" value={form.confirmPassword} onChange={e => update("confirmPassword", e.target.value)} required />
              </div>
            </div>

            <Button variant="accent" size="lg" className="w-full" type="submit">{t("signup.cta")}</Button>
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
