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

interface MatchResult<T> {
  item: T;
  score: number;
  percentage: number;
  reasons: { en: string; fr: string }[];
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
        reasons.push({ en: "Matches your preferred destination", fr: "Correspond à votre destination préférée" });
      } else if (s.country === profile.country_of_birth || s.country === profile.country_of_residence) {
        score += 15;
      }

      // Program match
      const programMatch = s.programs.some((p) => studentPrograms.includes(p));
      if (programMatch) {
        score += 30;
        reasons.push({ en: "Aligns with your field of study", fr: "Correspond à votre domaine d'études" });
      }

      // Level match
      if (studentLevel && s.levels.includes(studentLevel)) {
        score += 20;
        reasons.push({ en: "Available for your study level", fr: "Disponible pour votre niveau d'études" });
      }

      // Budget
      if (profile.budget_sensitivity === "low" && s.budgetFriendly) {
        score += 10;
        reasons.push({ en: "Budget-friendly option", fr: "Option adaptée à votre budget" });
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

      return { item: s, score, percentage, reasons };
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
        reasons.push({ en: "In your preferred destination", fr: "Dans votre destination préférée" });
      }

      // Program match
      const programMatch = a.programs.some((p) => studentPrograms.includes(p));
      if (programMatch) {
        score += 30;
        reasons.push({ en: "Offers your field of study", fr: "Propose votre domaine d'études" });
      }

      // Level match
      if (studentLevel && a.levels.includes(studentLevel)) {
        score += 20;
        reasons.push({ en: "Available for your study level", fr: "Disponible pour votre niveau d'études" });
      }

      // Budget match
      if (profile.budget_sensitivity === "low" && a.budgetLevel === "low") {
        score += 15;
        reasons.push({ en: "Affordable for your budget", fr: "Abordable pour votre budget" });
      } else if (profile.budget_sensitivity === "medium" && (a.budgetLevel === "low" || a.budgetLevel === "medium")) {
        score += 10;
        reasons.push({ en: "Within your budget range", fr: "Dans votre fourchette de budget" });
      } else if (profile.budget_sensitivity === "high") {
        score += 5;
      }

      if (score === 0) score = 5;

      const percentage = Math.min(Math.round((score / 95) * 100), 99);

      return { item: a, score, percentage, reasons };
    })
    .sort((a, b) => b.score - a.score);
}
