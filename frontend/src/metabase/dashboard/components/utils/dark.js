export const canShowDarkMode = dashboard => {
  return dashboard?.creator?.id === 10 ||
    dashboard?.creator?.id === 15671;
};
