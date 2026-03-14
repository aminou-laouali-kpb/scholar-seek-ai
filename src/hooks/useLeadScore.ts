import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { upsertLeadScore } from "@/lib/leadScoring";

/**
 * Fire-and-forget hook that computes and upserts the current user's
 * lead score on mount. Designed to run on dashboard load.
 */
export function useLeadScore() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    // Fire-and-forget
    upsertLeadScore(user.id).catch((err) =>
      console.warn("Lead score upsert failed:", err)
    );
  }, [user]);
}
