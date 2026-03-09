import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useCallback } from "react";

export const useActivityLog = () => {
  const { user } = useAuth();

  const logActivity = useCallback(
    (action: string, details?: Record<string, unknown>) => {
      if (!user) return;
      // Fire-and-forget
      supabase
        .from("activity_logs")
        .insert({ user_id: user.id, action, details: details ?? {} } as any)
        .then(({ error }) => {
          if (error) console.warn("Activity log failed:", error.message);
        });
    },
    [user]
  );

  return { logActivity };
};
