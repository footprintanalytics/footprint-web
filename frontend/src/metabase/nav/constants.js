import { color, lighten } from "metabase/lib/colors";
export const DefaultSearchColor = lighten(color("nav"), 0.07);

export const VipLevel = {
  FREE: "free",
  BASIC: "basic",
  PRO: "pro",
  ENTERPRISE: "enterprise",
};
