import { parseHashOptions } from "../../../lib/browser";

export const isDark = () => {
  const options = parseHashOptions(location.hash);
  const isGrowth = window.location.pathname.startsWith("/growth");
  const isResearch = window.location.pathname.startsWith("/research") || window.location.pathname.startsWith("/public/research");
  const isPublicDashboardNight = options?.theme === 'night' && window.location.pathname.startsWith("/public/dashboard");
  return isGrowth || isResearch || isPublicDashboardNight;
};

export const canShowDarkMode = dashboard => {
  return dashboard?.creator?.id === 15671 || isDark();
};
