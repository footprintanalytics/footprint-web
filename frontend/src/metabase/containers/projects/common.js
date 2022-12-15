export const getLandingInfo = () => {
  const data = {
    "/project": { type: "project", title: "Projects" },
    "/chain": { type: "chain", title: "Chains" },
  };
  let info;
  const { pathname } = location;
  if (pathname.startsWith("/project")) {
    info = data["/project"];
  } else if (pathname.startsWith("/chain")) {
    info = data["/chain"];
  } else {
    info = data["/unknown"];
  }
  return info;
};
