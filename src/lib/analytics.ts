/**
 * Lightweight analytics tracking utility.
 * Logs events in development; ready for GA / Mixpanel / PostHog integration.
 */
export function track(event: string, properties?: Record<string, unknown>) {
  if (import.meta.env.DEV) {
    console.log("[analytics]", event, properties);
  }
  // Future integration:
  // window.gtag?.('event', event, properties);
  // window.posthog?.capture(event, properties);
}
