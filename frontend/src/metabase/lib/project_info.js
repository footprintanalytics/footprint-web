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

//为了动态替换 sql 的 table 参数，for web2
export const getLatestGAProjectId = () => {
  // return null;
  const userId = window.localStorage.getItem("GAUserId");
  const isFgaDemoProject = window.localStorage.getItem("IsFgaDemoProject");
  if (userId === null || isFgaDemoProject === "true") {
    return null;
  }
  if (!window.location.pathname.startsWith("/growth") && userId !== "6") {
    return null;
  }
  if (window.location.pathname.startsWith("/fga")) {
    return null;
  }
  const projectIdStr = window.localStorage.getItem("LatestGAProjectId");
  let projectId;
  try {
    projectId = projectIdStr && parseInt(projectIdStr);
  } catch (e) {}
  return projectId;
};

// 为了区分哪个 service 来的
export const getServiceText = () => {
  let serviceText = ""
  if (window.location.pathname.startsWith("/fga/pro")) {
    serviceText = "fga";
  }
  return serviceText;
}
