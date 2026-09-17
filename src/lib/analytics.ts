/**
 * Lightweight funnel tracking for the order flow.
 * Events are POSTed to an n8n webhook so downstream automations (e.g. abandoned
 * cart follow-up) can react to them. No-ops silently when no webhook is
 * configured, and never throws or blocks the UI on failure.
 */

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;

const SESSION_KEY = "mimo_session_id";

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // sessionStorage unavailable (e.g. privacy mode) — fall back to a
    // per-call id rather than crashing the caller.
    return crypto.randomUUID();
  }
}

export type AnalyticsEvent =
  | "page_view"
  | "add_to_cart"
  | "remove_from_cart"
  | "checkout_started"
  | "lead_captured"
  | "order_completed";

interface TrackPayload {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Sends a funnel event to the configured n8n webhook.
 * Fire-and-forget: failures are logged (dev only) and never surfaced to the user.
 */
export function trackEvent(event: AnalyticsEvent, payload: TrackPayload = {}): void {
  if (!WEBHOOK_URL) return;

  const body = JSON.stringify({
    event,
    sessionId: getSessionId(),
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
    ...payload,
  });

  try {
    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch((err) => {
      if (import.meta.env.DEV) console.warn("[analytics] failed to send event", event, err);
    });
  } catch (err) {
    if (import.meta.env.DEV) console.warn("[analytics] failed to send event", event, err);
  }
}
