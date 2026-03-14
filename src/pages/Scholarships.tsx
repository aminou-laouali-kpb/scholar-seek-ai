import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CardSkeleton } from "@/components/ui/CardSkeleton";
import { motion } from "framer-motion";
import { Award, ArrowRight, MessageCircle, Search, ExternalLink, Calendar, GraduationCap } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const WA_LINK = "https://wa.me/33768674292";

interface Scholarship {
  id: string;
  name: string;
  country: string;
  country_flag: string;
  levels: string[];
  programs: string[];
  description_en: string;
  description_fr: string;
  eligibility_en: string;
  eligibility_fr: string;
  deadline: string;
  funding_type: string;
  status: string;
  external_link: string | null;
  is_featured: boolean;
}

const Scholarships = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterFunding, setFilterFunding] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("admin_scholarships")
        .select("id, name, country, country_flag, levels, programs, description_en, description_fr, eligibility_en, eligibility_fr, deadline, funding_type, status, external_link, is_featured")
        .eq("is_published", true)
        .order("is_featured", { ascending: false });
      setScholarships((data as Scholarship[]) || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const allCountries = [...new Set(scholarships.map((s) => s.country))].sort();
  const allLevels = [...new Set(scholarships.flatMap((s) => s.levels))].sort();
  const allFunding = [...new Set(scholarships.map((s) => s.funding_type))].sort();

  const filtered = scholarships.filter((s) => {
    const q = search.toLowerCase();
    if (q && !s.name.toLowerCase().includes(q) && !s.country.toLowerCase().includes(q)) return false;
    if (filterCountry && s.country !== filterCountry) return false;
    if (filterLevel && !s.levels.some((l) => l.toLowerCase().includes(filterLevel.toLowerCase()))) return false;
    if (filterFunding && s.funding_type !== filterFunding) return false;
    return true;
  });

  const fundingLabel = (type: string) => {
    if (type === "full") return isEn ? "Full Funding" : "Financement complet";
    if (type === "partial") return isEn ? "Partial Funding" : "Financement partiel";
    if (type === "tuition-only") return isEn ? "Tuition Only" : "Frais de scolarité uniquement";
    return type;
  };

  const statusLabel = (status: string) => {
    if (status === "open") return isEn ? "Open" : "Ouvert";
    if (status === "upcoming") return isEn ? "Upcoming" : "À venir";
    if (status === "closed") return isEn ? "Closed" : "Fermé";
    return status;
  };

  return (
    <div className="min-h-screen">
      <SEOHead title={t("scholarshipsPage.title") + " — KPB Education"} description={String(t("scholarshipsPage.subtitle"))} />
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">{t("scholarshipsPage.title")}</h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">{t("scholarshipsPage.subtitle")}</p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto max-w-6xl">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder={isEn ? "Search scholarships..." : "Rechercher des bourses..."} className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="border border-input rounded-md px-3 py-2 text-sm bg-background" value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}>
              <option value="">{isEn ? "All Countries" : "Tous les pays"}</option>
              {allCountries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="border border-input rounded-md px-3 py-2 text-sm bg-background" value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
              <option value="">{isEn ? "All Levels" : "Tous les niveaux"}</option>
              {allLevels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <select className="border border-input rounded-md px-3 py-2 text-sm bg-background" value={filterFunding} onChange={(e) => setFilterFunding(e.target.value)}>
              <option value="">{isEn ? "All Funding" : "Tous les financements"}</option>
              {allFunding.map((f) => <option key={f} value={f}>{fundingLabel(f)}</option>)}
            </select>
          </div>

          {/* Results count */}
          {!loading && (
            <p className="text-sm text-muted-foreground mb-6">
              {filtered.length} {isEn ? "scholarship" : "bourse"}{filtered.length !== 1 ? "s" : ""} {isEn ? "found" : "trouvée" + (filtered.length !== 1 ? "s" : "")}
            </p>
          )}

          {loading ? (
            <CardSkeleton count={6} />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-card rounded-2xl p-8 shadow-card border border-border max-w-md mx-auto">
                <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-foreground font-medium mb-2">{isEn ? "No scholarships found" : "Aucune bourse trouvée"}</p>
                <p className="text-muted-foreground text-sm mb-4">{isEn ? "Try adjusting your filters or search terms." : "Essayez de modifier vos filtres ou termes de recherche."}</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={() => { setSearch(""); setFilterCountry(""); setFilterLevel(""); setFilterFunding(""); }}>
                    {isEn ? "Reset Filters" : "Réinitialiser les filtres"}
                  </Button>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                    <Button variant="accent" size="sm"><MessageCircle className="w-3.5 h-3.5" />{isEn ? "Ask an Advisor" : "Demander à un conseiller"}</Button>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 6) * 0.06 }}
                  className="bg-card rounded-2xl p-5 shadow-card border border-border hover:shadow-card-hover transition-all relative"
                >
                  {s.is_featured && (
                    <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground text-[10px]">⭐ {isEn ? "Featured" : "En vedette"}</Badge>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{s.country_flag}</span>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-foreground leading-tight pr-16">{s.name}</h3>
                      <span className="text-xs text-muted-foreground">{s.country}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <Badge variant="secondary" className="text-[10px]">
                      {fundingLabel(s.funding_type)}
                    </Badge>
                    <Badge variant={s.status === "open" ? "default" : "outline"} className="text-[10px]">
                      {statusLabel(s.status)}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {isEn ? s.description_en : s.description_fr}
                  </p>

                  {s.levels.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <GraduationCap className="w-3 h-3 shrink-0" />
                      <span className="truncate">{s.levels.join(", ")}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>{isEn ? "Deadline:" : "Date limite :"} {s.deadline || (isEn ? "Varies" : "Variable")}</span>
                  </div>

                  <div className="flex gap-2">
                    {s.external_link ? (
                      <a href={s.external_link} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="accent" size="sm" className="w-full">
                          {isEn ? "Learn More" : "En savoir plus"}
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </a>
                    ) : (
                      <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="accent" size="sm" className="w-full">
                          {isEn ? "Get Details" : "Obtenir les détails"}
                          <MessageCircle className="w-3 h-3" />
                        </Button>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Personalized CTA */}
      <section className="py-10 bg-secondary/30">
        <div className="container-narrow mx-auto text-center">
          <p className="text-foreground font-heading font-semibold text-lg mb-3">
            {isEn ? "Want personalized scholarship matches?" : "Vous voulez des bourses personnalisées ?"}
          </p>
          <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto">
            {isEn ? "Create your free account and get scholarship recommendations tailored to your profile." : "Créez votre compte gratuit et recevez des recommandations de bourses adaptées à votre profil."}
          </p>
          <Link to="/signup">
            <Button variant="accent" size="lg">
              {isEn ? "Create My Free Account" : "Créer Mon Compte Gratuit"} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Scholarship Test CTA */}
      <section className="gradient-accent section-padding">
        <div className="container-narrow mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl text-accent-foreground">
            {isEn ? "Not sure which scholarships you qualify for?" : "Pas sûr des bourses auxquelles vous êtes éligible ?"}
          </h2>
          <p className="mt-3 text-accent-foreground/80 max-w-xl mx-auto">
            {isEn ? "Take our free eligibility test and get personalized scholarship recommendations." : "Faites notre test d'éligibilité gratuit et obtenez des recommandations de bourses personnalisées."}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/tools/scholarship-test">
              <Button variant="default" size="lg">
                {t("tools.scholarship.cta")} <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="border-accent-foreground/20 text-accent-foreground hover:bg-accent-foreground/10">
                <MessageCircle className="w-4 h-4" /> {t("hero.cta2")}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Scholarships;
