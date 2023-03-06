export const getProject = location => {
  const targetLocation = location || window?.location;
  return targetLocation?.pathname?.startsWith("/defi360")
    ? "defi360"
    : "footprint";
};
export const isDefi360 = project => {
  return false;
  // return (project ? project : getProject()) === "defi360";
};

export const getLatestGAProjectId = () => {
  // if (!window.location.pathname.startsWith("/growth")) {
  //   return null;
  // }
  const projectIdStr = window.localStorage.getItem("LatestGAProjectId");
  let projectId;
  try {
    projectId = projectIdStr && parseInt(projectIdStr);
  } catch (e) {}
  return projectId;
};
