import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { track } from "@/lib/analytics";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { motion } from "framer-motion";
import { Info, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { countries, STUDY_PROGRAMS } from "@/data/countries";

const STUDY_LEVEL_KEYS = ["highSchool", "bachelor", "master", "phd", "other"];

const CountryCombobox = ({
  value, onValueChange, placeholder, language,
}: { value: string; onValueChange: (v: string) => void; placeholder: string; language: string }) => {
  const [open, setOpen] = useState(false);
  const sorted = useMemo(() => [...countries].sort((a, b) => {
    const nameA = language === "fr" ? a.nameFr : a.nameEn;
    const nameB = language === "fr" ? b.nameFr : b.nameEn;
    return nameA.localeCompare(nameB, language);
  }), [language]);
  const selected = countries.find((c) => c.code === value);
  const label = selected ? `${selected.flag} ${language === "fr" ? selected.nameFr : selected.nameEn}` : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between font-normal h-10 text-left">
          <span className={cn("truncate", !selected && "text-muted-foreground")}>{label}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>—</CommandEmpty>
            <CommandGroup>
              {sorted.map((c) => {
                const name = language === "fr" ? c.nameFr : c.nameEn;
                return (
                  <CommandItem key={c.code} value={`${name} ${c.code}`} onSelect={() => { onValueChange(c.code); setOpen(false); }}>
                    <Check className={cn("mr-2 h-4 w-4", value === c.code ? "opacity-100" : "opacity-0")} />
                    <span className="mr-2">{c.flag}</span>{name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const PhonePrefixCombobox = ({
  value, onValueChange, language,
}: { value: string; onValueChange: (v: string) => void; language: string }) => {
  const [open, setOpen] = useState(false);
  const sorted = useMemo(() => [...countries].sort((a, b) => {
    const nameA = language === "fr" ? a.nameFr : a.nameEn;
    const nameB = language === "fr" ? b.nameFr : b.nameEn;
    return nameA.localeCompare(nameB, language);
  }), [language]);
  const selected = countries.find((c) => c.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[110px] shrink-0 justify-between font-normal h-10 px-2">
          <span className="truncate text-sm">{selected ? `${selected.flag} ${selected.dialCode}` : "🌍"}</span>
          <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>—</CommandEmpty>
            <CommandGroup>
              {sorted.map((c) => {
                const name = language === "fr" ? c.nameFr : c.nameEn;
                return (
                  <CommandItem key={c.code} value={`${name} ${c.dialCode} ${c.code}`} onSelect={() => { onValueChange(c.code); setOpen(false); }}>
                    <Check className={cn("mr-2 h-4 w-4", value === c.code ? "opacity-100" : "opacity-0")} />
                    <span className="mr-1.5">{c.flag}</span>
                    <span className="flex-1 truncate">{name}</span>
                    <span className="ml-auto text-muted-foreground text-xs">{c.dialCode}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const CompleteProfile = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dontKnowProgram, setDontKnowProgram] = useState(false);
  const [otherProgram, setOtherProgram] = useState("");

  const isEditMode = !!profile?.profile_completed;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneCountry: "CM",
    whatsapp: "",
    countryOfBirth: "",
    countryOfResidence: "",
    studyLevel: "",
    desiredProgram: "",
    budgetSensitivity: "",
    preferredDestinations: [] as string[],
  });

  // Pre-populate form from existing profile data
  useEffect(() => {
    if (!profile) return;
    const phoneCountry = profile.phone_country || "CM";
    const prefix = countries.find((c) => c.code === phoneCountry)?.dialCode || "+237";
    const rawWhatsapp = profile.whatsapp || "";
    const whatsappNumber = rawWhatsapp.startsWith(prefix) ? rawWhatsapp.slice(prefix.length) : rawWhatsapp;

    const programValue = profile.desired_program || "";
    const isStandardProgram = (STUDY_PROGRAMS as readonly string[]).includes(programValue);

    setForm({
      firstName: profile.first_name || "",
      lastName: profile.last_name || "",
      phoneCountry,
      whatsapp: whatsappNumber,
      countryOfBirth: profile.country_of_birth || "",
      countryOfResidence: profile.country_of_residence || "",
      studyLevel: profile.study_level || "",
      desiredProgram: isStandardProgram ? programValue : (programValue ? "other" : ""),
      budgetSensitivity: profile.budget_sensitivity || "",
      preferredDestinations: profile.preferred_destinations || [],
    });
    setDontKnowProgram(!!profile.dont_know_program);
    if (!isStandardProgram && programValue) {
      setOtherProgram(programValue);
    }
  }, [profile]);

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const phonePrefix = countries.find((c) => c.code === form.phoneCountry)?.dialCode || "+237";
    const program = form.desiredProgram === "other" ? otherProgram : form.desiredProgram;

    const { error } = await supabase.from("profiles").update({
      first_name: form.firstName,
      last_name: form.lastName,
      whatsapp: `${phonePrefix}${form.whatsapp}`,
      phone_country: form.phoneCountry,
      country_of_birth: form.countryOfBirth,
      country_of_residence: form.countryOfResidence,
      study_level: form.studyLevel,
      desired_program: program,
      dont_know_program: dontKnowProgram,
      profile_completed: true,
      preferred_destinations: form.preferredDestinations,
      budget_sensitivity: form.budgetSensitivity || null,
      scholarship_interest: true,
    } as any).eq("user_id", user.id);

    if (!error) {
      await refreshProfile();
      if (isEditMode) {
        track("profile_updated", { study_level: form.studyLevel });
        navigate("/dashboard");
      } else {
        track("onboarding_completed", { study_level: form.studyLevel, country: form.countryOfResidence, destinations: form.preferredDestinations });
        navigate(dontKnowProgram ? "/orientation" : "/dashboard");
      }
    }
    setLoading(false);
  };

  const studyLevels = t("signup.studyLevels") as Record<string, string>;
  const programs = t("signup.programs") as Record<string, string>;

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl text-foreground">
              {isEditMode ? (isEn ? "Edit Your Profile" : "Modifier votre profil") : t("completeProfile.title")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isEditMode ? (isEn ? "Update your information to get better recommendations." : "Mettez à jour vos informations pour de meilleures recommandations.") : t("completeProfile.subtitle")}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.firstNamePassport")}</label>
                <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.lastNamePassport")}</label>
                <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.whatsapp")}</label>
              <div className="flex gap-2">
                <PhonePrefixCombobox value={form.phoneCountry} onValueChange={(v) => update("phoneCountry", v)} language={language} />
                <Input type="tel" placeholder={t("signup.whatsappPlaceholder")} value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} className="flex-1" required />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.countryOfBirth")}</label>
                <CountryCombobox value={form.countryOfBirth} onValueChange={(v) => update("countryOfBirth", v)} placeholder={t("signup.selectCountry")} language={language} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.countryOfResidence")}</label>
                <CountryCombobox value={form.countryOfResidence} onValueChange={(v) => update("countryOfResidence", v)} placeholder={t("signup.selectCountry")} language={language} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.studyLevel")}</label>
              <Select value={form.studyLevel} onValueChange={(v) => update("studyLevel", v)}>
                <SelectTrigger><SelectValue placeholder={t("signup.selectLevel")} /></SelectTrigger>
                <SelectContent>
                  {STUDY_LEVEL_KEYS.map((key) => (
                    <SelectItem key={key} value={key}>{studyLevels[key]}</SelectItem>
                  ))}
                </SelectContent>
            </Select>
            </div>

            {/* Preferred Destinations */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                {isEn ? "Preferred Destinations" : "Destinations préférées"}
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { code: "FR", flag: "🇫🇷", en: "France", fr: "France" },
                  { code: "BE", flag: "🇧🇪", en: "Belgium", fr: "Belgique" },
                  { code: "CA", flag: "🇨🇦", en: "Canada", fr: "Canada" },
                  { code: "CN", flag: "🇨🇳", en: "China", fr: "Chine" },
                  { code: "US", flag: "🇺🇸", en: "USA", fr: "États-Unis" },
                ].map((d) => {
                  const selected = form.preferredDestinations.includes(d.code);
                  return (
                    <button
                      key={d.code}
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          preferredDestinations: selected
                            ? prev.preferredDestinations.filter((c) => c !== d.code)
                            : [...prev.preferredDestinations, d.code],
                        }));
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        selected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary text-muted-foreground border-border hover:border-primary/30"
                      }`}
                    >
                      <span>{d.flag}</span>
                      {isEn ? d.en : d.fr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget Sensitivity */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                {isEn ? "Budget Sensitivity" : "Sensibilité au budget"}
              </label>
              <Select value={form.budgetSensitivity} onValueChange={(v) => update("budgetSensitivity", v)}>
                <SelectTrigger><SelectValue placeholder={isEn ? "Select your budget level" : "Sélectionnez votre niveau de budget"} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{isEn ? "Low — I need the most affordable option" : "Faible — J'ai besoin de l'option la plus abordable"}</SelectItem>
                  <SelectItem value="medium">{isEn ? "Medium — I can invest moderately" : "Moyen — Je peux investir modérément"}</SelectItem>
                  <SelectItem value="high">{isEn ? "High — Budget is not my main concern" : "Élevé — Le budget n'est pas ma préoccupation principale"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.desiredProgram")}</label>
              {!dontKnowProgram && (
                <>
                  <Select value={form.desiredProgram} onValueChange={(v) => update("desiredProgram", v)}>
                    <SelectTrigger><SelectValue placeholder={t("signup.selectProgram")} /></SelectTrigger>
                    <SelectContent>
                      {STUDY_PROGRAMS.map((key) => (
                        <SelectItem key={key} value={key}>{programs[key]}</SelectItem>
                      ))}
                      <SelectItem value="other">{t("signup.otherProgram")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.desiredProgram === "other" && (
                    <Input className="mt-2" placeholder={t("signup.otherProgramPlaceholder")} value={otherProgram} onChange={(e) => setOtherProgram(e.target.value)} />
                  )}
                </>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Checkbox id="dont-know-cp" checked={dontKnowProgram} onCheckedChange={(checked) => { setDontKnowProgram(!!checked); if (checked) { update("desiredProgram", ""); setOtherProgram(""); } }} />
                <label htmlFor="dont-know-cp" className="text-sm text-muted-foreground cursor-pointer">{t("signup.dontKnowProgram")}</label>
              </div>
              {dontKnowProgram && (
                <div className="mt-2 flex items-start gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{t("signup.orientationNote")}</p>
                </div>
              )}
            </div>

            <Button variant="accent" size="lg" className="w-full" type="submit" disabled={loading}>
              {loading ? "..." : isEditMode ? (isEn ? "Save Changes" : "Enregistrer") : t("completeProfile.cta")}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;
