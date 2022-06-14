export const isDefi360 = project => {
  return (project ? project : getProject()) === "defi360";
};

export const getProject = location => {
  const targetLocation = location || window.location;
  return targetLocation.pathname.startsWith("/defi360")
    ? "defi360"
    : "footprint";
};
