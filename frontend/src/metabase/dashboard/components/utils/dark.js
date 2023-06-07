

export const canShowDarkMode = dashboard => {
  const isGrowth = window.location.pathname.startsWith("/growth");
  const isResearch = window.location.pathname.startsWith("/research") || window.location.pathname.startsWith("/public/research");
  return dashboard?.creator?.id === 15671 ||
    isGrowth || isResearch;
};

export const isDark = () => {
  const isGrowth = window.location.pathname.startsWith("/growth");
  const isResearch = window.location.pathname.startsWith("/research") || window.location.pathname.startsWith("/public/research");
  return isGrowth || isResearch;
};
