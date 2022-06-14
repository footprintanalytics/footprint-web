import Settings from "metabase/lib/settings";
import { isProduction } from "metabase/env";

export const createTracker = () => {
  if (isTrackingEnabled()) {
    createGoogleAnalyticsTracker();
    document.body.addEventListener("click", handleStructEventClick, true);
  }
};

export const trackPageView = (url, type) => {
  console.log("[PAGE_VIEW]", [url, type]);
  if (isTrackingEnabled() && url) {
    trackGoogleAnalyticsPageView(url);
  }
};

export const trackStructEvent = (category, action, label, value) => {
  if (category && action) {
    trackGoogleAnalyticsStructEvent(category, action, label, value);
  } else if (category && !action) {
    trackGoogleAnalyticsStructEvent("Category", category, label, value);
  }
};

export const trackSchemaEvent = () => {
  // intentionally blank
};

const isTrackingEnabled = () => {
  // return isProduction && Settings.trackingEnabled();
  return isProduction;
};

const createGoogleAnalyticsTracker = () => {
  // const code = Settings.get("ga-code");
  // window.ga?.("create", code, "auto");

  // Settings.on("anon-tracking-enabled", enabled => {
  //   window[`ga-disable-${code}`] = enabled ? null : true;
  // });

  window.ga?.("create", "UA-17374783-45", "auto");
  window.gtag?.("config", "G-7X0SCJDJYL", { send_page_view: false });
};

const trackGoogleAnalyticsPageView = url => {
  const version = Settings.get("version", {});
  window.ga?.("set", "dimension1", version.tag);
  window.ga?.("set", "page", url);
  window.ga?.("send", "pageview", url);
  window.gtag?.("event", "page_view");
};

const trackGoogleAnalyticsStructEvent = (
  category,
  action = "Action",
  label = "Label",
  value = 1,
) => {
  const version = Settings.get("version", {});
  if (isTrackingEnabled()) {
    window.ga?.("set", "dimension1", version.tag);
    window.ga?.("send", "event", category, action, label, value);
    window.gtag?.("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
    localStorage.setItem("lastGTag", action);
  }
  console.log("[GTAG_EVENT]", [category, action, label, value, version]);
};

const handleStructEventClick = event => {
  if (!isTrackingEnabled()) {
    return;
  }

  for (let node = event.target; node != null; node = node.parentNode) {
    if (node.dataset && node.dataset.metabaseEvent) {
      const parts = node.dataset.metabaseEvent.split(";").map(p => p.trim());
      trackStructEvent(...parts);
    }
  }
};
