/**
 * Lightweight analytics tracking utility.
 * Logs events in development; ready for GA / Mixpanel / PostHog integration.
 * When a user is authenticated, also writes to activity_logs table.
 */
import { supabase } from "@/integrations/supabase/client";

export async function track(event: string, properties?: Record<string, unknown>) {
  if (import.meta.env.DEV) {
    console.log("[analytics]", event, properties);
  }

  // Write to activity_logs if user is authenticated
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      supabase
        .from("activity_logs")
        .insert({
          user_id: session.user.id,
          action: event,
          details: properties ?? {},
        } as any)
        .then(({ error }) => {
          if (error) console.warn("Activity log failed:", error.message);
        });
    }
  } catch {
    // Silent fail — analytics should never break the app
  }

  // Future integration:
  // window.gtag?.('event', event, properties);
  // window.posthog?.capture(event, properties);
}
