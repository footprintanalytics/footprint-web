export const APP_BAR_HEIGHT = "52px";
export const APP_SUBHEADER_HEIGHT = "48px";
export const APP_BAR_EXTENDED_HEIGHT = "98px";
export const ADMIN_NAVBAR_HEIGHT = "65px";
export const NAV_SIDEBAR_WIDTH = "324px";

export const VipLevel = {
  FREE: "free",
  BASIC: "basic",
  PRO: "pro",
  TEAM: "team",
  BUSINESS: "business",
  BUSINESS_TRIAL: "business_trial",
  ENTERPRISE: "enterprise",
};

export const VipLevelDataApi = {
  GROWTH: "growth",
  SCALE: "scale",
  SCALE_TRIAL: "scale_trial",
};

import { color, lighten } from "metabase/lib/colors";
export const DefaultSearchColor = lighten(color("nav"), 0.07);
