import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ArrowRight, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { analyzeRecours, type RecoursInput, type RecoursResult } from "@/lib/recoursEngine";
import { track } from "@/lib/analytics";

const STORAGE_KEY = "kpb_recours_draft";
const TOTAL_STEPS = 5;

interface FormData {
  fullName: string;
  email: string;
  whatsapp: string;
  countryOfResidence: string;
  nationality: string;
  currentLevel: string;
  targetLevel: string;
  fieldOfStudy: string;
  institutionsApplied: string;
  programApplied: string;
  numRefusals: number;
  refusalDate: string;
  refusalReason: string;
  situationDescription: string;
  whyContestable: string;
  hasPendingApplications: boolean;
  openToPrivate: boolean;
  budgetRange: string;
  preferredCities: string;
  urgencyLevel: string;
}

const defaultData: FormData = {
  fullName: "",
  email: "",
  whatsapp: "",
  countryOfResidence: "",
  nationality: "",
  currentLevel: "",
  targetLevel: "",
  fieldOfStudy: "",
  institutionsApplied: "",
  programApplied: "",
  numRefusals: 1,
  refusalDate: "",
  refusalReason: "",
  situationDescription: "",
  whyContestable: "",
  hasPendingApplications: false,
  openToPrivate: false,
  budgetRange: "",
  preferredCities: "",
  urgencyLevel: "normal",
};

const countries = [
  "Cameroun", "Côte d'Ivoire", "Sénégal", "Gabon", "Congo", "RDC", "Bénin",
  "Togo", "Burkina Faso", "Mali", "Guinée", "Niger", "Tchad", "Madagascar",
  "Comores", "Maroc", "Tunisie", "Algérie", "Autre",
];

const levels = [
  { value: "bac", label: "Baccalauréat" },
  { value: "bac+1", label: "Bac+1" },
  { value: "bac+2", label: "Bac+2" },
  { value: "bac+3", label: "Bac+3 / Licence" },
  { value: "bac+4", label: "Bac+4" },
  { value: "bac+5", label: "Bac+5 / Master" },
  { value: "doctorat", label: "Doctorat" },
];

const targetLevels = [
  { value: "licence", label: "Licence (L1/L2/L3)" },
  { value: "master", label: "Master (M1/M2)" },
  { value: "bachelor", label: "Bachelor" },
  { value: "doctorat", label: "Doctorat" },
  { value: "autre", label: "Autre" },
];

interface RecoursFormProps {
  onResult: (result: RecoursResult, submissionId: string) => void;
}

const RecoursForm = ({ onResult }: RecoursFormProps) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    } catch {
      return defaultData;
    }
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    track("recours_form_started");
  }, []);

  const update = useCallback(
    (field: keyof FormData, value: any) => setData((d) => ({ ...d, [field]: value })),
    []
  );

  const canNext = (): boolean => {
    if (step === 1) return !!(data.fullName && data.email && data.whatsapp && data.countryOfResidence && data.nationality);
    if (step === 2) return !!(data.currentLevel && data.targetLevel && data.fieldOfStudy);
    if (step === 3) return !!(data.institutionsApplied && data.programApplied && data.numRefusals >= 1);
    return true;
  };

  const goNext = () => {
    if (step < TOTAL_STEPS) {
      track("recours_step_completed", { step });
      setStep(step + 1);
    }
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!data.email || !data.whatsapp) {
      setError("Email et WhatsApp sont requis pour recevoir ton résultat.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      // Upload file if present
      let docUrl: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("refusal-documents")
          .upload(path, file);
        if (!uploadErr) {
          docUrl = path;
          track("recours_document_uploaded");
        }
      }

      // Run engine
      const engineInput: RecoursInput = {
        currentLevel: data.currentLevel,
        targetLevel: data.targetLevel,
        fieldOfStudy: data.fieldOfStudy,
        numRefusals: data.numRefusals,
        refusalReason: data.refusalReason,
        situationDescription: data.situationDescription,
        whyContestable: data.whyContestable,
        hasPendingApplications: data.hasPendingApplications,
        openToPrivate: data.openToPrivate,
        budgetRange: data.budgetRange,
        urgencyLevel: data.urgencyLevel,
      };
      const result = analyzeRecours(engineInput);

      // Save to DB
      const { data: row, error: dbErr } = await supabase
        .from("recours_submissions")
        .insert({
          full_name: data.fullName,
          email: data.email,
          whatsapp: data.whatsapp,
          country_of_residence: data.countryOfResidence,
          nationality: data.nationality,
          current_level: data.currentLevel,
          target_level: data.targetLevel,
          field_of_study: data.fieldOfStudy,
          institutions_applied: data.institutionsApplied,
          program_applied: data.programApplied,
          num_refusals: data.numRefusals,
          refusal_date: data.refusalDate,
          refusal_reason: data.refusalReason,
          situation_description: data.situationDescription,
          why_contestable: data.whyContestable,
          has_pending_applications: data.hasPendingApplications,
          open_to_private: data.openToPrivate,
          budget_range: data.budgetRange,
          preferred_cities: data.preferredCities,
          urgency_level: data.urgencyLevel,
          result_category: result.category,
          result_details: result as any,
          refusal_document_url: docUrl,
        } as any)
        .select("id")
        .single();

      if (dbErr) throw dbErr;

      track("recours_form_submitted");
      track("recours_result_generated", { category: result.category });
      localStorage.removeItem(STORAGE_KEY);
      onResult(result, row?.id ?? "");
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue. Réessaie.");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = (step / TOTAL_STEPS) * 100;

  const fieldClass = "space-y-2";
  const inputClass = "h-12 text-base";

  return (
    <section id="recours-form" className="py-12 px-4 bg-background">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Étape {step} / {TOTAL_STEPS}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              {step === 1 && (
                <div className="space-y-5">
                  <h3 className="font-heading font-semibold text-xl text-foreground">Tes coordonnées</h3>
                  <p className="text-muted-foreground text-sm">Pour recevoir ta recommandation personnalisée.</p>
                  <div className={fieldClass}>
                    <Label htmlFor="fullName">Nom complet *</Label>
                    <Input id="fullName" className={inputClass} placeholder="Ex: Jean Dupont" value={data.fullName} onChange={(e) => update("fullName", e.target.value)} />
                  </div>
                  <div className={fieldClass}>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" className={inputClass} placeholder="ton.email@exemple.com" value={data.email} onChange={(e) => update("email", e.target.value)} />
                  </div>
                  <div className={fieldClass}>
                    <Label htmlFor="whatsapp">Numéro WhatsApp *</Label>
                    <Input id="whatsapp" className={inputClass} placeholder="+237 6XX XXX XXX" value={data.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
                  </div>
                  <div className={fieldClass}>
                    <Label>Pays de résidence *</Label>
                    <Select value={data.countryOfResidence} onValueChange={(v) => update("countryOfResidence", v)}>
                      <SelectTrigger className={inputClass}><SelectValue placeholder="Choisis ton pays" /></SelectTrigger>
                      <SelectContent>{countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className={fieldClass}>
                    <Label>Nationalité *</Label>
                    <Select value={data.nationality} onValueChange={(v) => update("nationality", v)}>
                      <SelectTrigger className={inputClass}><SelectValue placeholder="Choisis ta nationalité" /></SelectTrigger>
                      <SelectContent>{countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h3 className="font-heading font-semibold text-xl text-foreground">Ton profil académique</h3>
                  <div className={fieldClass}>
                    <Label>Niveau actuel *</Label>
                    <Select value={data.currentLevel} onValueChange={(v) => update("currentLevel", v)}>
                      <SelectTrigger className={inputClass}><SelectValue placeholder="Ton niveau actuel" /></SelectTrigger>
                      <SelectContent>{levels.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className={fieldClass}>
                    <Label>Niveau visé en France *</Label>
                    <Select value={data.targetLevel} onValueChange={(v) => update("targetLevel", v)}>
                      <SelectTrigger className={inputClass}><SelectValue placeholder="Le niveau que tu vises" /></SelectTrigger>
                      <SelectContent>{targetLevels.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className={fieldClass}>
                    <Label htmlFor="field">Domaine d'études *</Label>
                    <Input id="field" className={inputClass} placeholder="Ex: Informatique, Gestion, Médecine..." value={data.fieldOfStudy} onChange={(e) => update("fieldOfStudy", e.target.value)} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <h3 className="font-heading font-semibold text-xl text-foreground">Détails de ta candidature</h3>
                  <div className={fieldClass}>
                    <Label htmlFor="institutions">Établissement(s) demandé(s) *</Label>
                    <Input id="institutions" className={inputClass} placeholder="Ex: Université de Lyon 2" value={data.institutionsApplied} onChange={(e) => update("institutionsApplied", e.target.value)} />
                  </div>
                  <div className={fieldClass}>
                    <Label htmlFor="program">Formation demandée *</Label>
                    <Input id="program" className={inputClass} placeholder="Ex: Licence Informatique" value={data.programApplied} onChange={(e) => update("programApplied", e.target.value)} />
                  </div>
                  <div className={fieldClass}>
                    <Label>Nombre de refus reçus *</Label>
                    <Select value={String(data.numRefusals)} onValueChange={(v) => update("numRefusals", parseInt(v))}>
                      <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((n) => <SelectItem key={n} value={String(n)}>{n} refus</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className={fieldClass}>
                    <Label htmlFor="refusalDate">Date du refus (approximative)</Label>
                    <Input id="refusalDate" type="date" className={inputClass} value={data.refusalDate} onChange={(e) => update("refusalDate", e.target.value)} />
                  </div>
                  <div className={fieldClass}>
                    <Label htmlFor="refusalReason">Motif du refus (si indiqué)</Label>
                    <Textarea id="refusalReason" placeholder="Copie le motif tel qu'il apparaît dans ton espace Campus France, si disponible." value={data.refusalReason} onChange={(e) => update("refusalReason", e.target.value)} className="min-h-[80px]" />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5">
                  <h3 className="font-heading font-semibold text-xl text-foreground">Ta situation</h3>
                  <div className={fieldClass}>
                    <Label htmlFor="situation">Explique brièvement ta situation</Label>
                    <Textarea id="situation" placeholder="Contexte, parcours, motivations..." value={data.situationDescription} onChange={(e) => update("situationDescription", e.target.value)} className="min-h-[100px]" />
                  </div>
                  <div className={fieldClass}>
                    <Label htmlFor="contest">Pourquoi penses-tu que le refus est discutable ?</Label>
                    <Textarea id="contest" placeholder="Éléments qui selon toi justifient un recours..." value={data.whyContestable} onChange={(e) => update("whyContestable", e.target.value)} className="min-h-[100px]" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label htmlFor="pending" className="cursor-pointer">As-tu d'autres candidatures en cours ?</Label>
                    <Switch id="pending" checked={data.hasPendingApplications} onCheckedChange={(v) => update("hasPendingApplications", v)} />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label htmlFor="private" className="cursor-pointer">Es-tu ouvert(e) aux écoles privées ?</Label>
                    <Switch id="private" checked={data.openToPrivate} onCheckedChange={(v) => update("openToPrivate", v)} />
                  </div>
                  <div className={fieldClass}>
                    <Label>Budget pour les frais de scolarité</Label>
                    <Select value={data.budgetRange} onValueChange={(v) => update("budgetRange", v)}>
                      <SelectTrigger className={inputClass}><SelectValue placeholder="Sélectionne une tranche" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Pas de budget</SelectItem>
                        <SelectItem value="low">Moins de 3 000 €/an</SelectItem>
                        <SelectItem value="medium">3 000 – 6 000 €/an</SelectItem>
                        <SelectItem value="high">6 000 – 10 000 €/an</SelectItem>
                        <SelectItem value="premium">Plus de 10 000 €/an</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className={fieldClass}>
                    <Label htmlFor="cities">Villes ou régions préférées</Label>
                    <Input id="cities" className={inputClass} placeholder="Ex: Paris, Lyon, Toulouse..." value={data.preferredCities} onChange={(e) => update("preferredCities", e.target.value)} />
                  </div>
                  <div className={fieldClass}>
                    <Label>Niveau d'urgence</Label>
                    <Select value={data.urgencyLevel} onValueChange={(v) => update("urgencyLevel", v)}>
                      <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Pas urgent — j'ai du temps</SelectItem>
                        <SelectItem value="normal">Normal — prochaine rentrée</SelectItem>
                        <SelectItem value="high">Urgent — je ne veux pas perdre l'année</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-5">
                  <h3 className="font-heading font-semibold text-xl text-foreground">Document (optionnel)</h3>
                  <p className="text-muted-foreground text-sm">
                    Si tu as une capture d'écran ou un PDF de ton refus, tu peux le joindre ici. Ce n'est pas obligatoire.
                  </p>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                    <label className="cursor-pointer">
                      <span className="text-primary font-medium text-sm hover:underline">
                        {file ? file.name : "Clique pour ajouter un fichier"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f && f.size <= 10 * 1024 * 1024) setFile(f);
                        }}
                      />
                    </label>
                    <p className="text-xs text-muted-foreground mt-2">JPG, PNG ou PDF • Max 10 Mo</p>
                  </div>

                  {error && (
                    <p className="text-destructive text-sm font-medium">{error}</p>
                  )}

                  <div className="bg-secondary/50 rounded-xl p-4 text-sm text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">Récapitulatif</p>
                    <p>👤 {data.fullName} • {data.email}</p>
                    <p>🎓 {data.currentLevel} → {data.targetLevel} en {data.fieldOfStudy}</p>
                    <p>❌ {data.numRefusals} refus • {data.institutionsApplied}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
            <Button variant="ghost" onClick={goBack} disabled={step === 1} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Retour
            </Button>
            {step < TOTAL_STEPS ? (
              <Button onClick={goNext} disabled={!canNext()} className="gap-2 bg-primary text-primary-foreground px-6 h-12">
                Suivant <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 px-6 h-12 font-semibold">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Obtenir ma recommandation
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecoursForm;
