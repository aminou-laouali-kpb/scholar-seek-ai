import type { Scholarship } from "@/data/scholarships";
import type { AdmissionOpportunity } from "@/data/admissions";

interface ProfileForMatching {
  country_of_birth?: string | null;
  country_of_residence?: string | null;
  study_level?: string | null;
  desired_program?: string | null;
  orientation_result?: string | null;
  preferred_destinations?: string[] | null;
  budget_sensitivity?: string | null;
  scholarship_interest?: boolean | null;
}

export interface MatchResult<T> {
  item: T;
  score: number;
  percentage: number;
  matchLabel: { en: string; fr: string };
  matchTier: "strong" | "good" | "explore";
  reasons: { en: string; fr: string }[];
}

function getMatchLabel(percentage: number): { label: { en: string; fr: string }; tier: "strong" | "good" | "explore" } {
  if (percentage >= 70) return { label: { en: "Strong match", fr: "Très bon match" }, tier: "strong" };
  if (percentage >= 45) return { label: { en: "Good fit", fr: "Bon match" }, tier: "good" };
  return { label: { en: "Worth exploring", fr: "À explorer" }, tier: "explore" };
}

const COUNTRY_MAP: Record<string, string> = {
  FR: "france", BE: "belgium", CA: "canada", CN: "china", US: "usa",
};

const LEVEL_MAP: Record<string, string> = {
  highSchool: "bachelor",
  bachelor: "bachelor",
  master: "master",
  phd: "phd",
};

const FIELD_TO_PROGRAMS: Record<string, string[]> = {
  "Engineering & Technology": ["engineering", "computerScience", "civilEngineering", "mechanicalEngineering", "computerEngineering", "telecommunications"],
  "Business & Management": ["business", "businessAdmin", "economics", "accountingFinance", "marketing", "internationalBusiness", "humanResources", "hospitalityTourism"],
  "Health Sciences & Medicine": ["health", "medicine", "pharmacy", "nursing", "biology"],
  "Arts & Humanities": ["arts", "artsDesign", "languages", "communication", "sociology"],
  "Law & Political Science": ["law", "politicalScience", "internationalRelations"],
  "Natural Sciences & Research": ["sciences", "physics", "chemistry", "mathematics", "biology", "environmentalScience", "agriculture"],
};

function getStudentPrograms(profile: ProfileForMatching): string[] {
  const programs: string[] = [];
  if (profile.desired_program) programs.push(profile.desired_program);
  if (profile.orientation_result) {
    const mapped = FIELD_TO_PROGRAMS[profile.orientation_result];
    if (mapped) programs.push(...mapped);
  }
  return programs;
}

function getStudentDestinations(profile: ProfileForMatching): string[] {
  const dests: string[] = [];
  if (profile.preferred_destinations?.length) {
    dests.push(...profile.preferred_destinations);
  }
  return dests;
}

export function matchScholarships(
  scholarships: Scholarship[],
  profile: ProfileForMatching
): MatchResult<Scholarship>[] {
  const studentPrograms = getStudentPrograms(profile);
  const studentDests = getStudentDestinations(profile);
  const studentLevel = profile.study_level ? LEVEL_MAP[profile.study_level] || profile.study_level : null;

  return scholarships
    .map((s) => {
      let score = 0;
      const reasons: { en: string; fr: string }[] = [];

      // Country match
      const countryKey = COUNTRY_MAP[s.country];
      if (studentDests.includes(s.country) || studentDests.includes(countryKey || "")) {
        score += 30;
        reasons.push({
          en: "This scholarship is available in your preferred country",
          fr: "Cette bourse est disponible dans votre pays de préférence",
        });
      } else if (s.country === profile.country_of_birth || s.country === profile.country_of_residence) {
        score += 15;
      }

      // Program match
      const programMatch = s.programs.some((p) => studentPrograms.includes(p));
      if (programMatch) {
        score += 30;
        reasons.push({
          en: "Covers programs related to your field of study",
          fr: "Couvre des programmes liés à votre domaine d'études",
        });
      }

      // Level match
      if (studentLevel && s.levels.includes(studentLevel)) {
        score += 20;
        reasons.push({
          en: "Open to students at your current level",
          fr: "Ouverte aux étudiants de votre niveau actuel",
        });
      }

      // Budget
      if (profile.budget_sensitivity === "low" && s.budgetFriendly) {
        score += 10;
        reasons.push({
          en: "A budget-friendly option that fits your needs",
          fr: "Une option économique adaptée à vos besoins",
        });
      } else if (s.budgetFriendly) {
        score += 5;
      }

      // Scholarship interest
      if (profile.scholarship_interest !== false) {
        score += 10;
      }

      // Base relevance
      if (score === 0) score = 5;

      const percentage = Math.min(Math.round((score / 100) * 100), 99);
      const { label, tier } = getMatchLabel(percentage);

      return { item: s, score, percentage, matchLabel: label, matchTier: tier, reasons };
    })
    .sort((a, b) => b.score - a.score);
}

export function matchAdmissions(
  admissions: AdmissionOpportunity[],
  profile: ProfileForMatching
): MatchResult<AdmissionOpportunity>[] {
  const studentPrograms = getStudentPrograms(profile);
  const studentDests = getStudentDestinations(profile);
  const studentLevel = profile.study_level ? LEVEL_MAP[profile.study_level] || profile.study_level : null;

  return admissions
    .map((a) => {
      let score = 0;
      const reasons: { en: string; fr: string }[] = [];

      // Country match
      const countryKey = COUNTRY_MAP[a.country];
      if (studentDests.includes(a.country) || studentDests.includes(countryKey || "")) {
        score += 30;
        reasons.push({
          en: "Located in your preferred destination",
          fr: "Situé dans votre destination de préférence",
        });
      }

      // Program match
      const programMatch = a.programs.some((p) => studentPrograms.includes(p));
      if (programMatch) {
        score += 30;
        reasons.push({
          en: "Offers programs in your field of study",
          fr: "Propose des programmes dans votre domaine d'études",
        });
      }

      // Level match
      if (studentLevel && a.levels.includes(studentLevel)) {
        score += 20;
        reasons.push({
          en: "Open to students at your current level",
          fr: "Ouvert aux étudiants de votre niveau actuel",
        });
      }

      // Budget match
      if (profile.budget_sensitivity === "low" && a.budgetLevel === "low") {
        score += 15;
        reasons.push({
          en: "Affordable option that suits your budget",
          fr: "Option abordable adaptée à votre budget",
        });
      } else if (profile.budget_sensitivity === "medium" && (a.budgetLevel === "low" || a.budgetLevel === "medium")) {
        score += 10;
        reasons.push({
          en: "Within your budget range",
          fr: "Dans votre fourchette de budget",
        });
      } else if (profile.budget_sensitivity === "high") {
        score += 5;
      }

      if (score === 0) score = 5;

      const percentage = Math.min(Math.round((score / 95) * 100), 99);
      const { label, tier } = getMatchLabel(percentage);

      return { item: a, score, percentage, matchLabel: label, matchTier: tier, reasons };
    })
    .sort((a, b) => b.score - a.score);
}
