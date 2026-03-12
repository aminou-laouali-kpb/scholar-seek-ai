import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
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
import { toast } from "sonner";

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

const SignUp = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [dontKnowProgram, setDontKnowProgram] = useState(false);
  const [otherProgram, setOtherProgram] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCountry: "CM",
    whatsapp: "",
    countryOfBirth: "",
    countryOfResidence: "",
    studyLevel: "",
    desiredProgram: "",
    password: "",
    confirmPassword: "",
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleGoogleSignUp = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error(String(error));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error(t("signup.passwordMismatch") as string || "Passwords don't match");
      return;
    }
    setLoading(true);

    const phonePrefix = countries.find((c) => c.code === form.phoneCountry)?.dialCode || "+237";
    const program = form.desiredProgram === "other" ? otherProgram : form.desiredProgram;

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          whatsapp: `${phonePrefix}${form.whatsapp}`,
          phone_country: form.phoneCountry,
          country_of_birth: form.countryOfBirth,
          country_of_residence: form.countryOfResidence,
          study_level: form.studyLevel,
          desired_program: program,
          dont_know_program: dontKnowProgram,
          profile_completed: !dontKnowProgram,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/check-email");
  };

  const studyLevels = t("signup.studyLevels") as Record<string, string>;
  const programs = t("signup.programs") as Record<string, string>;

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl text-foreground">{t("signup.title")}</h1>
            <p className="text-muted-foreground mt-2">{t("signup.subtitle")}</p>
          </div>

          {/* Google button */}
          <Button variant="outline" size="lg" className="w-full mb-6 gap-3" onClick={handleGoogleSignUp}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {t("signup.google")}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">{t("signup.or")}</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Names */}
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

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.email")}</label>
              <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
            </div>

            {/* WhatsApp with prefix */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.whatsapp")}</label>
              <div className="flex gap-2">
                <PhonePrefixCombobox value={form.phoneCountry} onValueChange={(v) => update("phoneCountry", v)} language={language} />
                <Input type="tel" placeholder={t("signup.whatsappPlaceholder")} value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} className="flex-1" required />
              </div>
            </div>

            {/* Country of birth & residence */}
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

            {/* Study Level */}
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

            {/* Desired Program */}
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
                <Checkbox id="dont-know" checked={dontKnowProgram} onCheckedChange={(checked) => { setDontKnowProgram(!!checked); if (checked) { update("desiredProgram", ""); setOtherProgram(""); } }} />
                <label htmlFor="dont-know" className="text-sm text-muted-foreground cursor-pointer">{t("signup.dontKnowProgram")}</label>
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
                <Input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t("signup.confirmPassword")}</label>
                <Input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required />
              </div>
            </div>

            <Button variant="accent" size="lg" className="w-full" type="submit" disabled={loading}>
              {loading ? "..." : t("signup.cta")}
            </Button>
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
