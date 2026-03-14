import { supabase } from "@/integrations/supabase/client";

const STRONG_SIGNAL_ACTIONS = new Set([
  "application_started",
  "support_requested",
  "consultation_requested",
  "whatsapp_clicked",
]);

export type HeatLevel = "low" | "warm" | "hot";

export interface LeadScoreResult {
  heatLevel: HeatLevel;
  actionsCount: number;
  strongSignals: number;
  lastAction: string | null;
  lastActionAt: string | null;
}

export async function computeLeadScore(userId: string): Promise<LeadScoreResult> {
  // Fetch activity logs
  const { data: logs } = await supabase
    .from("activity_logs")
    .select("action, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  // Fetch saved items count
  const { count: savedCount } = await supabase
    .from("saved_items")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  // Fetch application intents count
  const { count: intentCount } = await supabase
    .from("application_intents")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  // Fetch consultation requests count
  const { count: consultCount } = await supabase
    .from("consultation_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  const allLogs = logs ?? [];
  const actionsCount = allLogs.length;
  const lastAction = allLogs[0]?.action ?? null;
  const lastActionAt = allLogs[0]?.created_at ?? null;

  // Count strong signals from activity logs
  let strongSignals = 0;
  const seenStrong = new Set<string>();
  for (const log of allLogs) {
    if (STRONG_SIGNAL_ACTIONS.has(log.action) && !seenStrong.has(log.action)) {
      strongSignals++;
      seenStrong.add(log.action);
    }
  }

  // Saved items >= 3 counts as a strong signal
  if ((savedCount ?? 0) >= 3) strongSignals++;
  // Application intents count as strong signal
  if ((intentCount ?? 0) > 0) strongSignals++;
  // Consultation requests count as strong signal
  if ((consultCount ?? 0) > 0) strongSignals++;

  // Determine heat level
  let heatLevel: HeatLevel = "low";
  if (strongSignals >= 3) {
    heatLevel = "hot";
  } else if (strongSignals >= 1) {
    heatLevel = "warm";
  } else {
    // Check for moderate signals
    const hasProfileCompleted = allLogs.some((l) => l.action === "profile_completed");
    const hasOrientation = allLogs.some((l) => l.action === "orientation_completed");
    if (hasProfileCompleted && hasOrientation) {
      heatLevel = "warm";
    }
  }

  return { heatLevel, actionsCount, strongSignals, lastAction, lastActionAt };
}

export async function upsertLeadScore(userId: string): Promise<LeadScoreResult> {
  const score = await computeLeadScore(userId);

  await supabase
    .from("lead_scores")
    .upsert(
      {
        user_id: userId,
        heat_level: score.heatLevel,
        actions_count: score.actionsCount,
        strong_signals: score.strongSignals,
        last_action: score.lastAction,
        last_action_at: score.lastActionAt,
      } as any,
      { onConflict: "user_id" }
    );

  return score;
}
