/**
 * Recours Gracieux Eligibility Engine — V1
 * Rule-based scoring. No AI claims. Transparent and editable.
 */

export interface RecoursInput {
  currentLevel: string;
  targetLevel: string;
  fieldOfStudy: string;
  numRefusals: number;
  refusalReason: string;
  situationDescription: string;
  whyContestable: string;
  hasPendingApplications: boolean;
  openToPrivate: boolean;
  budgetRange: string;
  urgencyLevel: string;
}

export type RecoursCategory = "A" | "B" | "C" | "D";

export interface RecoursResult {
  category: RecoursCategory;
  score: number;
  verdict: string;
  explanation: string;
  nextStep: string;
  reasons: string[];
  ctaLabel: string;
  ctaType: string;
}

const LEVEL_PROGRESSION: Record<string, number> = {
  bac: 1,
  "bac+1": 2,
  "bac+2": 3,
  "bac+3": 4,
  licence: 4,
  "bac+4": 5,
  "bac+5": 6,
  master: 6,
  doctorat: 7,
};

function normalizeLevel(level: string): number {
  const key = level.toLowerCase().trim();
  return LEVEL_PROGRESSION[key] ?? 3;
}

function scoreCoherence(current: string, target: string): number {
  const c = normalizeLevel(current);
  const t = normalizeLevel(target);
  const diff = t - c;
  if (diff === 1) return 100; // natural progression
  if (diff === 0) return 70; // lateral
  if (diff === 2) return 50; // skip
  if (diff < 0) return 20; // downgrade
  return 30; // large gap
}

export function analyzeRecours(input: RecoursInput): RecoursResult {
  const reasons: string[] = [];
  let totalScore = 0;

  // 1. Number of refusals (weight 20%)
  let refusalScore: number;
  if (input.numRefusals === 1) {
    refusalScore = 80;
    reasons.push("Un seul refus — le recours est plus pertinent.");
  } else if (input.numRefusals === 2) {
    refusalScore = 50;
    reasons.push("Deux refus — le recours reste envisageable mais moins évident.");
  } else {
    refusalScore = 20;
    reasons.push("Plusieurs refus — le recours sera plus difficile à justifier.");
  }
  totalScore += refusalScore * 0.2;

  // 2. Refusal reason clarity (weight 15%)
  const hasReason = input.refusalReason.trim().length > 10;
  const reasonScore = hasReason ? 80 : 30;
  if (hasReason) {
    reasons.push("Motif de refus identifié — cela facilite l'argumentation.");
  } else {
    reasons.push("Motif de refus peu clair — cela complique le recours.");
  }
  totalScore += reasonScore * 0.15;

  // 3. Contestability argument (weight 20%)
  const hasArg = input.whyContestable.trim().length > 20;
  const argScore = hasArg ? 85 : 25;
  if (hasArg) {
    reasons.push("Tu as des arguments pour contester la décision — c'est un bon signe.");
  } else {
    reasons.push("Peu d'éléments pour contester — le recours serait plus risqué.");
  }
  totalScore += argScore * 0.2;

  // 4. Project coherence (weight 15%)
  const coherenceScore = scoreCoherence(input.currentLevel, input.targetLevel);
  if (coherenceScore >= 70) {
    reasons.push("Ton projet d'études est cohérent avec ton parcours actuel.");
  } else {
    reasons.push("Le lien entre ton niveau actuel et ta formation visée pourrait être questionné.");
  }
  totalScore += coherenceScore * 0.15;

  // 5. Urgency (weight 10%)
  let urgencyScore: number;
  if (input.urgencyLevel === "high") {
    urgencyScore = 40;
    reasons.push("L'urgence est élevée — un plan B est fortement recommandé.");
  } else if (input.urgencyLevel === "medium") {
    urgencyScore = 60;
  } else {
    urgencyScore = 80;
    reasons.push("Tu as du temps — tu peux explorer le recours sereinement.");
  }
  totalScore += urgencyScore * 0.1;

  // 6. Open to private (weight 10%)
  const privateScore = input.openToPrivate ? 70 : 50;
  totalScore += privateScore * 0.1;

  // 7. Budget (weight 10%)
  const hasBudget = input.budgetRange && input.budgetRange !== "none" && input.budgetRange.trim().length > 0;
  const budgetScore = hasBudget ? 70 : 40;
  totalScore += budgetScore * 0.1;

  const score = Math.round(totalScore);

  // Determine category
  let category: RecoursCategory;
  if (score >= 70) {
    category = "A";
  } else if (score >= 40 && input.openToPrivate) {
    category = "D";
  } else if (score >= 40) {
    category = "B";
  } else {
    category = "C";
  }

  // Build result
  const results: Record<RecoursCategory, Omit<RecoursResult, "score" | "reasons" | "category">> = {
    A: {
      verdict: "Recours recommandé",
      explanation:
        "Ton dossier présente des éléments solides pour contester la décision. Un recours gracieux bien rédigé pourrait aboutir à une révision favorable.",
      nextStep:
        "Rédige un recours gracieux structuré rapidement. L'accompagnement d'un conseiller peut augmenter tes chances.",
      ctaLabel: "Je veux être aidé pour rédiger mon recours",
      ctaType: "recours",
    },
    B: {
      verdict: "Recours possible mais faible",
      explanation:
        "Ton dossier présente quelques éléments pour un recours, mais les chances de succès sont incertaines. Il est important de bien préparer ton argumentation.",
      nextStep:
        "Tu peux tenter un recours, mais prépare aussi un plan alternatif pour ne pas perdre de temps.",
      ctaLabel: "Voir mes options de recours et mes alternatives",
      ctaType: "alternatives",
    },
    C: {
      verdict: "Recours peu pertinent",
      explanation:
        "Dans ta situation actuelle, un recours gracieux a peu de chances d'aboutir. Il serait plus stratégique de te tourner vers d'autres options.",
      nextStep:
        "Explore les admissions en écoles privées pour sécuriser ta rentrée. De nombreuses options existent avec des intakes proches.",
      ctaLabel: "Découvrir mes options en écoles privées",
      ctaType: "private",
    },
    D: {
      verdict: "Recours + plan B écoles privées recommandé",
      explanation:
        "Ton dossier permet de tenter un recours, mais les résultats ne sont pas garantis. En parallèle, sécurise un plan B en école privée pour ne pas perdre une année.",
      nextStep:
        "Lance les deux démarches en même temps : recours gracieux et candidatures en écoles privées.",
      ctaLabel: "Sécuriser un plan B rapidement",
      ctaType: "both",
    },
  };

  return {
    category,
    score,
    reasons,
    ...results[category],
  };
}
