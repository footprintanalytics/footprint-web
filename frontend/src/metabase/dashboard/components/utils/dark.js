export const canShowDarkMode = dashboard => {
  const isGrowth = window.location.pathname.startsWith("/growth");
  const isResearch = window.location.pathname.startsWith("/research");
  return dashboard?.creator?.id === 15671 ||
    isGrowth || isResearch;
};

export const isDark = () => {
  const isGrowth = window.location.pathname.startsWith("/growth");
  const isResearch = window.location.pathname.startsWith("/research");
  return isGrowth || isResearch;
};
