export const canShowDarkMode = dashboard => {
  const isGrowth = window.location.pathname.startsWith("/growth");
  const isResearch = window.location.pathname.startsWith("/research");
  return dashboard?.creator?.id === 15671 || isGrowth || isResearch;
};

export const isDark = () => {
  const isGrowth = isGrowthNeedDark();
  const isResearch = window.location.pathname.startsWith("/research");
  return isGrowth || isResearch;
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
    window.location.pathname.startsWith("/growth/campaign")
  );
};
