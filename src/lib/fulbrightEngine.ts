/**
 * Fulbright Pre-Eligibility Scoring Engine
 * Rule-based weighted assessment — NOT official Fulbright selection.
 */

export interface FulbrightInput {
  degreeLevel: string;       // bachelor_completed | bachelor_in_progress | master_completed | other
  graduationStatus: string;  // graduated | final_year | earlier
  gpaRange: string;          // excellent | good | average | below_average
  fieldOfStudy: string;
  studyProjectClarity: string; // clear_detailed | somewhat_clear | vague | not_sure
  leadershipExperience: string; // significant | moderate | minimal | none
  communityEngagement: string;  // significant | moderate | minimal | none
  motivationUS: string;      // strong_specific | general_interest | not_sure
  englishReadiness: string;  // fluent | intermediate | beginner
  futureGoalsClarity: string; // clear | somewhat | unclear
  applicationCommitment: string; // fully_committed | considering | exploring
  countryOfCitizenship: string;
}

export interface FulbrightResult {
  level: "strong" | "promising" | "early" | "needs_prep";
  score: number;
  verdict_fr: string;
  verdict_en: string;
  strengths: { fr: string; en: string }[];
  gaps: { fr: string; en: string }[];
  nextSteps: { fr: string; en: string }[];
}

function score(input: FulbrightInput): { total: number; dimensions: Record<string, number> } {
  const d: Record<string, number> = {};

  // Academic level (15%)
  const degreeMap: Record<string, number> = { master_completed: 100, bachelor_completed: 85, bachelor_in_progress: 60, other: 30 };
  const gradMap: Record<string, number> = { graduated: 100, final_year: 80, earlier: 40 };
  d.academic = ((degreeMap[input.degreeLevel] ?? 50) + (gradMap[input.graduationStatus] ?? 50)) / 2;

  // Study project clarity (20%)
  const projectMap: Record<string, number> = { clear_detailed: 100, somewhat_clear: 65, vague: 30, not_sure: 10 };
  d.project = projectMap[input.studyProjectClarity] ?? 30;

  // Leadership (20%)
  const leaderMap: Record<string, number> = { significant: 100, moderate: 65, minimal: 30, none: 5 };
  d.leadership = leaderMap[input.leadershipExperience] ?? 30;

  // English (10%)
  const engMap: Record<string, number> = { fluent: 100, intermediate: 55, beginner: 15 };
  d.english = engMap[input.englishReadiness] ?? 30;

  // Community (15%)
  const commMap: Record<string, number> = { significant: 100, moderate: 65, minimal: 30, none: 5 };
  d.community = commMap[input.communityEngagement] ?? 30;

  // Motivation (10%)
  const motMap: Record<string, number> = { strong_specific: 100, general_interest: 55, not_sure: 15 };
  d.motivation = motMap[input.motivationUS] ?? 30;

  // Readiness (10%)
  const goalsMap: Record<string, number> = { clear: 100, somewhat: 55, unclear: 15 };
  const commitMap: Record<string, number> = { fully_committed: 100, considering: 55, exploring: 20 };
  d.readiness = ((goalsMap[input.futureGoalsClarity] ?? 50) + (commitMap[input.applicationCommitment] ?? 50)) / 2;

  // GPA bonus
  const gpaMap: Record<string, number> = { excellent: 15, good: 8, average: 0, below_average: -10 };
  const gpaBonus = gpaMap[input.gpaRange] ?? 0;

  const weights = { academic: 0.15, project: 0.20, leadership: 0.20, english: 0.10, community: 0.15, motivation: 0.10, readiness: 0.10 };
  let total = 0;
  for (const [k, w] of Object.entries(weights)) {
    total += (d[k] ?? 0) * w;
  }
  total = Math.min(100, Math.max(0, total + gpaBonus));

  return { total: Math.round(total), dimensions: d };
}

export function evaluateFulbright(input: FulbrightInput): FulbrightResult {
  const { total, dimensions } = score(input);

  const strengths: { fr: string; en: string }[] = [];
  const gaps: { fr: string; en: string }[] = [];

  if (dimensions.academic >= 70) strengths.push({ fr: "Niveau académique solide", en: "Strong academic level" });
  else gaps.push({ fr: "Renforcer le parcours académique", en: "Strengthen academic background" });

  if (dimensions.project >= 70) strengths.push({ fr: "Projet d'études bien défini", en: "Well-defined study project" });
  else gaps.push({ fr: "Clarifier le projet d'études et de recherche", en: "Clarify study and research project" });

  if (dimensions.leadership >= 70) strengths.push({ fr: "Expérience de leadership significative", en: "Significant leadership experience" });
  else gaps.push({ fr: "Développer des expériences de leadership", en: "Develop leadership experiences" });

  if (dimensions.english >= 70) strengths.push({ fr: "Bon niveau d'anglais", en: "Good English proficiency" });
  else gaps.push({ fr: "Améliorer le niveau d'anglais (TOEFL/IELTS)", en: "Improve English level (TOEFL/IELTS)" });

  if (dimensions.community >= 70) strengths.push({ fr: "Engagement communautaire fort", en: "Strong community engagement" });
  else gaps.push({ fr: "Renforcer l'engagement communautaire", en: "Strengthen community engagement" });

  if (dimensions.motivation >= 70) strengths.push({ fr: "Motivation claire pour les États-Unis", en: "Clear motivation for U.S. study" });
  else gaps.push({ fr: "Préciser la motivation pour étudier aux USA", en: "Clarify motivation for studying in the U.S." });

  if (dimensions.readiness >= 70) strengths.push({ fr: "Prêt à s'engager dans le processus", en: "Ready to commit to the process" });
  else gaps.push({ fr: "Renforcer la préparation à la candidature", en: "Strengthen application readiness" });

  let level: FulbrightResult["level"];
  let verdict_fr: string;
  let verdict_en: string;

  if (total >= 75) {
    level = "strong";
    verdict_fr = "Votre profil présente un fort potentiel pour Fulbright. Vous avez les atouts clés pour construire une candidature compétitive.";
    verdict_en = "Your profile shows strong potential for Fulbright. You have the key assets to build a competitive application.";
  } else if (total >= 50) {
    level = "promising";
    verdict_fr = "Votre profil est prometteur mais certains aspects peuvent être renforcés pour maximiser vos chances.";
    verdict_en = "Your profile is promising but some areas can be strengthened to maximize your chances.";
  } else if (total >= 25) {
    level = "early";
    verdict_fr = "Votre profil est en développement. Avec une préparation ciblée, Fulbright pourrait devenir une option réaliste.";
    verdict_en = "Your profile is developing. With targeted preparation, Fulbright could become a realistic option.";
  } else {
    level = "needs_prep";
    verdict_fr = "Votre profil nécessite un renforcement significatif avant d'envisager une candidature Fulbright compétitive.";
    verdict_en = "Your profile needs significant strengthening before considering a competitive Fulbright application.";
  }

  const nextSteps: { fr: string; en: string }[] = [];
  if (level === "strong") {
    nextSteps.push(
      { fr: "Préparer votre dossier de candidature Fulbright", en: "Prepare your Fulbright application package" },
      { fr: "Contacter KPB pour un accompagnement personnalisé", en: "Contact KPB for personalized guidance" },
      { fr: "Identifier les programmes qui correspondent à votre projet", en: "Identify programs that match your project" },
    );
  } else if (level === "promising") {
    nextSteps.push(
      { fr: "Travailler sur les points à améliorer identifiés", en: "Work on the identified areas for improvement" },
      { fr: "Renforcer votre profil dans les 3-6 prochains mois", en: "Strengthen your profile over the next 3-6 months" },
      { fr: "Prendre rendez-vous avec un conseiller KPB", en: "Schedule a session with a KPB advisor" },
    );
  } else {
    nextSteps.push(
      { fr: "Construire progressivement les éléments manquants", en: "Gradually build the missing elements" },
      { fr: "Explorer d'autres bourses en parallèle", en: "Explore other scholarships in parallel" },
      { fr: "Demander un plan de préparation personnalisé à KPB", en: "Request a personalized preparation plan from KPB" },
    );
  }

  return { level, score: total, verdict_fr, verdict_en, strengths, gaps, nextSteps };
}
