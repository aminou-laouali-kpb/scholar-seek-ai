import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { Award, CheckCircle, MessageCircle, ArrowRight, GraduationCap, Building2, MapPin, Globe, Clock, Languages, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const WA_LINK = "https://wa.me/33768674292";

// Keep existing Omnes & Igensia hardcoded schools
const omnesSchools = [
  { id: "ece-paris", name: "ECE Paris", domains: { en: "IT, AI, Cybersecurity, Digital Engineering", fr: "Informatique, IA, Cybersécurité, Ingénierie numérique" }, levels: ["Bachelor", "Master", "PGE"], campus: "Paris, Lyon, Bordeaux, Toulouse, Marseille, Rennes", fees: "8 490 – 12 450 €" },
  { id: "esce-paris", name: "ESCE International Business School", domains: { en: "International Business, Finance, Marketing, Supply Chain", fr: "Commerce international, Finance, Marketing, Supply Chain" }, levels: ["Bachelor", "Master", "PGE"], campus: "Paris, Lyon", fees: "9 650 – 12 650 €" },
  { id: "heip-paris", name: "HEIP", domains: { en: "International Relations, Political Science, Diplomacy", fr: "Relations internationales, Sciences politiques, Diplomatie" }, levels: ["Bachelor", "Master"], campus: "Paris, Lyon, Bordeaux, Rennes", fees: "9 650 – 10 690 €" },
  { id: "inseec-france", name: "INSEEC", domains: { en: "Business, Finance, Marketing, HR, Luxury, Sports, Real Estate", fr: "Business, Finance, Marketing, RH, Luxe, Sport, Immobilier" }, levels: ["Bachelor", "Master", "PGE"], campus: "Paris, Lyon, Bordeaux, Marseille, Chambéry, Toulouse, Rennes", fees: "8 190 – 16 650 €" },
  { id: "ium-monaco", name: "IUM – International University of Monaco", domains: { en: "Finance, Luxury Management, Sports Business", fr: "Finance, Management du luxe, Sport Business" }, levels: ["Bachelor", "Master"], campus: "Monaco 🇲🇨", fees: "15 050 – 31 950 €" },
  { id: "sup-de-pub", name: "Sup de Pub", domains: { en: "Communication, Advertising, Digital Marketing, Events", fr: "Communication, Publicité, Marketing digital, Événementiel" }, levels: ["Bachelor", "Master"], campus: "Paris, Lyon, Bordeaux, Rennes, Toulouse", fees: "8 850 – 12 050 €" },
];

const igensiaSchools = [
  { id: "icd-business", name: "ICD Business School", domains: { en: "Business, Marketing, Management", fr: "Business, Marketing, Management" }, levels: ["Bachelor", "Master", "MBA"], campus: "Paris, Toulouse", fees: "8 450 – 10 500 €" },
  { id: "igs-rh", name: "IGS-RH", domains: { en: "Human Resources, Digital Transformation", fr: "Ressources Humaines, Transformation digitale" }, levels: ["Bachelor", "Master"], campus: "Paris, Lyon, Toulouse", fees: "8 450 – 10 500 €" },
  { id: "esam-paris", name: "ESAM", domains: { en: "Management, Finance, Law", fr: "Management, Finance, Droit" }, levels: ["Bachelor", "Master"], campus: "Paris, Lyon", fees: "8 450 – 10 500 €" },
  { id: "iscpa-france", name: "ISCPA", domains: { en: "Journalism, Communication", fr: "Journalisme, Communication" }, levels: ["Bachelor", "Master"], campus: "Paris, Lyon, Toulouse", fees: "8 450 – 10 500 €" },
  { id: "ffollozz-paris", name: "FFOLLOZZ", domains: { en: "Influencer Marketing, Social Media", fr: "Marketing d'influence, Réseaux sociaux" }, levels: ["Bachelor"], campus: "Paris", fees: "8 450 €" },
  { id: "ipi-france", name: "IPI", domains: { en: "IT, Cybersecurity, DevOps", fr: "Informatique, Cybersécurité, DevOps" }, levels: ["Bachelor", "Master"], campus: "Paris, Lyon, Toulouse", fees: "8 450 – 10 500 €" },
  { id: "abs-paris", name: "ABS Paris", domains: { en: "BBA, Fashion, Sports Management, MBA", fr: "BBA, Mode, Sport Management, MBA" }, levels: ["Bachelor", "Master", "MBA"], campus: "Paris", fees: "10 150 – 15 250 €" },
  { id: "imis-lyon", name: "IMIS Lyon", domains: { en: "Regulatory Affairs (Healthcare/Pharma)", fr: "Affaires réglementaires (Santé/Pharma)" }, levels: ["Master"], campus: "Lyon", fees: "12 500 €" },
];

interface DBProgram {
  id: string;
  school_name: string;
  school_slug: string;
  country: string;
  city: string;
  campus_name: string;
  program_name: string;
  program_family: string;
  degree_level: string;
  duration: string;
  language_of_instruction: string;
  tuition_amount: string;
  tuition_currency: string;
  tuition_period: string;
  application_intake: string;
  eligibility_academic: string;
  eligibility_language: string;
  scholarship_available: string;
  status: string;
  is_featured: boolean;
}

interface GroupedSchool {
  slug: string;
  name: string;
  country: string;
  city: string;
  programs: DBProgram[];
}

const benefits = [
  { icon: CheckCircle, title: { en: "Simplified Admission", fr: "Admission simplifiée" }, description: { en: "Streamlined application process with direct support from KPB advisors.", fr: "Processus de candidature simplifié avec accompagnement direct des conseillers KPB." } },
  { icon: GraduationCap, title: { en: "Personalized Guidance", fr: "Accompagnement personnalisé" }, description: { en: "One-on-one support throughout your application journey.", fr: "Accompagnement individuel tout au long de votre parcours de candidature." } },
  { icon: Award, title: { en: "Priority Processing", fr: "Traitement prioritaire" }, description: { en: "Your application gets priority review through our partnership.", fr: "Votre dossier bénéficie d'un examen prioritaire grâce à notre partenariat." } },
];

const Partners = () => {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [dbPrograms, setDbPrograms] = useState<DBProgram[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("partner_programs")
        .select("id, school_name, school_slug, country, city, campus_name, program_name, program_family, degree_level, duration, language_of_instruction, tuition_amount, tuition_currency, tuition_period, application_intake, eligibility_academic, eligibility_language, scholarship_available, status, is_featured")
        .eq("is_published", true)
        .order("school_name");
      setDbPrograms((data as DBProgram[]) || []);
    };
    fetch();
  }, []);

  // Group DB programs by school
  const groupedSchools: GroupedSchool[] = [];
  const slugMap = new Map<string, GroupedSchool>();
  dbPrograms.forEach((p) => {
    if (!slugMap.has(p.school_slug)) {
      const group: GroupedSchool = { slug: p.school_slug, name: p.school_name, country: p.country, city: p.city, programs: [] };
      slugMap.set(p.school_slug, group);
      groupedSchools.push(group);
    }
    slugMap.get(p.school_slug)!.programs.push(p);
  });

  // Filter DB programs
  const filteredGroups = groupedSchools.filter((g) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchSchool = g.name.toLowerCase().includes(q);
      const matchProgram = g.programs.some(p => p.program_name.toLowerCase().includes(q));
      if (!matchSchool && !matchProgram) return false;
    }
    if (filterCountry && !g.programs.some(p => p.country.toLowerCase().includes(filterCountry.toLowerCase()))) return false;
    if (filterLevel && !g.programs.some(p => p.degree_level.toLowerCase().includes(filterLevel.toLowerCase()))) return false;
    return true;
  });

  const allCountries = [...new Set(dbPrograms.map(p => p.country))].sort();
  const allLevels = [...new Set(dbPrograms.map(p => p.degree_level))].sort();

  const statusLabel = (s: string) => {
    if (s === "contact_us") return isEn ? "Contact advisor" : "Contacter un conseiller";
    if (s === "to_confirm") return isEn ? "Details to confirm" : "Détails à confirmer";
    if (s === "rolling") return isEn ? "Rolling admissions" : "Admissions continues";
    return isEn ? "Open" : "Ouvert";
  };

  // Legacy school card for Omnes/Igensia
  const LegacySchoolCard = ({ school }: { school: typeof omnesSchools[0] }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
      <Card className="h-full hover:shadow-card-hover transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-heading">{school.name}</CardTitle>
            <Badge variant="secondary" className="shrink-0 text-[10px]"><Award className="w-3 h-3 mr-1" />Partner</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2"><Building2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" /><p className="text-sm text-muted-foreground">{isEn ? school.domains.en : school.domains.fr}</p></div>
          <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-muted-foreground shrink-0" /><div className="flex flex-wrap gap-1">{school.levels.map((level) => (<Badge key={level} variant="outline" className="text-[10px] px-1.5 py-0">{level}</Badge>))}</div></div>
          <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" /><p className="text-xs text-muted-foreground">{school.campus}</p></div>
          <p className="text-sm font-semibold text-primary">{school.fees}/an</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container-narrow mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="default" className="mb-4 bg-accent text-accent-foreground"><Award className="w-4 h-4 mr-1" />{isEn ? "Official Partnership" : "Partenariat officiel"}</Badge>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">{isEn ? "Our Partner Schools" : "Nos Écoles Partenaires"}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {isEn ? "KPB Education has exclusive partnerships with leading education institutions worldwide, offering you simplified admission and personalized support." : "KPB Education bénéficie de partenariats exclusifs avec des établissements d'enseignement de premier plan dans le monde, vous offrant une admission simplifiée et un accompagnement personnalisé."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/dashboard"><Button variant="default" size="lg">{isEn ? "View Matching Schools" : "Voir les écoles correspondantes"}<ArrowRight className="w-4 h-4" /></Button></Link>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="lg"><MessageCircle className="w-4 h-4" />{isEn ? "Talk to an Advisor" : "Parler à un conseiller"}</Button></a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-secondary/30">
        <div className="container-narrow mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl p-6 shadow-card text-center">
                <benefit.icon className="w-10 h-10 text-accent mx-auto mb-3" />
                <h3 className="font-heading font-bold text-foreground mb-2">{isEn ? benefit.title.en : benefit.title.fr}</h3>
                <p className="text-sm text-muted-foreground">{isEn ? benefit.description.en : benefit.description.fr}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deadline Banner */}
      <section className="py-6 bg-accent">
        <div className="container-narrow mx-auto px-4 text-center">
          <p className="font-heading font-bold text-accent-foreground text-lg">
            ⏰ {isEn ? "Application Deadline: August 1, 2025 for September 2025 Intake" : "Date limite de candidature : 1er août 2025 pour la rentrée de septembre 2025"}
          </p>
        </div>
      </section>

      {/* Omnes Education */}
      <section className="py-16">
        <div className="container-narrow mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">Omnes Education</h2>
            <p className="text-muted-foreground max-w-3xl">{isEn ? "A leading French education group with 6 prestigious schools across France and Monaco." : "Un groupe d'enseignement français de premier plan avec 6 écoles prestigieuses en France et à Monaco."}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {omnesSchools.map((school) => <LegacySchoolCard key={school.id} school={school} />)}
          </div>
        </div>
      </section>

      {/* Igensia Education */}
      <section className="py-16 bg-secondary/20">
        <div className="container-narrow mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">Igensia Education</h2>
            <p className="text-muted-foreground max-w-3xl">{isEn ? "A dynamic education group with 8 specialized schools." : "Un groupe éducatif dynamique avec 8 écoles spécialisées."}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {igensiaSchools.map((school) => <LegacySchoolCard key={school.id} school={school} />)}
          </div>
        </div>
      </section>

      {/* New Partner Schools from Database */}
      {dbPrograms.length > 0 && (
        <section className="py-16">
          <div className="container-narrow mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
                {isEn ? "More Partner Schools & Programs" : "Plus d'Écoles et Programmes Partenaires"}
              </h2>
              <p className="text-muted-foreground max-w-3xl mb-6">
                {isEn ? "Explore our extended catalog of partner institutions worldwide." : "Explorez notre catalogue étendu d'institutions partenaires dans le monde entier."}
              </p>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <Input placeholder={isEn ? "Search schools or programs..." : "Rechercher écoles ou programmes..."} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-xs" />
                <select className="border border-input rounded-md px-3 py-2 text-sm bg-background" value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}>
                  <option value="">{isEn ? "All Countries" : "Tous les pays"}</option>
                  {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="border border-input rounded-md px-3 py-2 text-sm bg-background" value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
                  <option value="">{isEn ? "All Levels" : "Tous les niveaux"}</option>
                  {allLevels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </motion.div>

            <div className="space-y-8">
              {filteredGroups.map((group) => (
                <motion.div key={group.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
                  <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
                    {/* School header */}
                    <div className="bg-primary/5 px-6 py-4 border-b border-border">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <h3 className="font-heading text-xl font-bold text-foreground">{group.name}</h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{group.city}, {group.country}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px]"><Award className="w-3 h-3 mr-1" />{isEn ? "KPB Partner" : "Partenaire KPB"}</Badge>
                          <Badge variant="outline" className="text-[10px]">{group.programs.length} {isEn ? "programs" : "programmes"}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Program list */}
                    <div className="divide-y divide-border">
                      {group.programs
                        .filter(p => {
                          if (filterLevel && !p.degree_level.toLowerCase().includes(filterLevel.toLowerCase())) return false;
                          if (searchQuery && !p.program_name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.school_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                          return true;
                        })
                        .map((program) => (
                        <div key={program.id} className="px-6 py-4 hover:bg-muted/30 transition-colors">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-medium text-foreground">{program.program_name}</h4>
                                {program.is_featured && <Badge className="bg-accent text-accent-foreground text-[10px]">⭐ Featured</Badge>}
                                {(program.status === "to_confirm" || program.status === "contact_us") && (
                                  <Badge variant="outline" className="text-[10px] gap-1">
                                    <Info className="w-3 h-3" />
                                    {statusLabel(program.status)}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{program.degree_level}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{program.duration}</span>
                                <span className="flex items-center gap-1"><Languages className="w-3 h-3" />{program.language_of_instruction}</span>
                                {program.campus_name && program.campus_name !== program.city && (
                                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{program.campus_name}</span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right">
                                <p className="text-sm font-semibold text-primary">
                                  {program.tuition_amount ? `${program.tuition_amount} ${program.tuition_currency}` : (isEn ? "Contact advisor" : "Contacter conseiller")}
                                </p>
                                <p className="text-[10px] text-muted-foreground">{program.tuition_period}</p>
                              </div>
                              <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" variant="default">
                                  <MessageCircle className="w-3.5 h-3.5 mr-1" />
                                  {isEn ? "Apply" : "Postuler"}
                                </Button>
                              </a>
                            </div>
                          </div>

                          {/* Eligibility summary */}
                          {program.eligibility_academic && program.eligibility_academic !== "Program-specific; contact KPB for latest entry requirements." && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                              <span className="font-medium">{isEn ? "Eligibility:" : "Éligibilité :"}</span> {program.eligibility_academic}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredGroups.length === 0 && searchQuery && (
                <p className="text-center text-muted-foreground py-8">{isEn ? "No programs found matching your search." : "Aucun programme trouvé correspondant à votre recherche."}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="container-narrow mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 text-center">
            <Award className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">{isEn ? "Ready to Apply to a Partner School?" : "Prêt à postuler dans une école partenaire ?"}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">{isEn ? "Complete your profile to see personalized school recommendations, or talk to our advisors for guidance." : "Complétez votre profil pour voir les recommandations personnalisées, ou parlez à nos conseillers pour être guidé."}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/dashboard"><Button variant="default" size="lg">{isEn ? "Go to Dashboard" : "Accéder au tableau de bord"}<ArrowRight className="w-4 h-4" /></Button></Link>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="lg"><MessageCircle className="w-4 h-4" />{isEn ? "Contact an Advisor" : "Contacter un conseiller"}</Button></a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
