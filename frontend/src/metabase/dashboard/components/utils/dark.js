export const canShowDarkMode = dashboard => {
  const isGrowth = window.location.pathname.startsWith("/growth");
  return dashboard?.creator?.id === 10 ||
    dashboard?.creator?.id === 15671 ||
    isGrowth;
};

export const isDark = () => {
  const isGrowth = window.location.pathname.startsWith("/growth");
  return isGrowth;
};
