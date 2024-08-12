import { parseHashOptions } from "../../../lib/browser";

export const isDark = () => {
  const options = parseHashOptions(location.hash);
  const isFgaVC = window.location.pathname.startsWith("/portfolio-fga");
  const isFgaGrowth = window.location.pathname.startsWith("/growthly");
  const isLandPage = window.location.pathname === ("/") ||
    window.location.pathname.startsWith("/solution/");
  const isMyStudio = window.location.pathname.startsWith("/studio");
  const isGrowth = isGrowthNeedDark() || isABNeedDark();
  const isResearch = window.location.pathname.startsWith("/research") || window.location.pathname.startsWith("/public/research");
  const isPublicDashboardNight = options?.theme === 'night' && window.location.pathname.startsWith("/public/dashboard");
  return isLandPage || isGrowth || isResearch || isMyStudio || isPublicDashboardNight || isFgaVC || isFgaGrowth;
};

export const canShowDarkMode = dashboard => {
  return dashboard?.creator?.id === 15671 || dashboard?.creator?.id === 25995 || isDark();
};

export const isGrowthNeedDark = () => {
  return (
    window.location.pathname === "/growth" ||
    window.location.pathname.startsWith("/growth/project")||
    window.location.pathname.startsWith("/growth/@")||
    window.location.pathname.startsWith("/growth/public")||
    window.location.pathname.startsWith("/growth/guest")||
    window.location.pathname.startsWith("/growth/pricing")||
    window.location.pathname.startsWith("/growth/submit")||
    window.location.pathname.startsWith("/growth/dashboard")||
    window.location.pathname.startsWith("/growth/chart")||
    window.location.pathname.startsWith("/growth/campaign")
  );
};

export const isStudio = () => window.location.pathname.startsWith("/studio");

export const isABNeedDark = () => {
  return (
    window.location.pathname.startsWith("/fga")
  );
};
