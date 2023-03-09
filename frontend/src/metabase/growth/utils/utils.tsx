export function getGaMenuTabs(tabs_data: any[]) {
  const dashboardMap = new Map();
  const menuTabs: any[] = [];
  tabs_data?.map(item => {
    const temp = getGaMenuTabs(item.children);
    const children: any[] = temp.menuTabs;
    temp.dashboardMap.forEach((value, key, map) => {
      dashboardMap.set(key, value);
    });
    // dashboardMap = temp.dashboardMap;
    const disabled =
      children.length <= 0 &&
      !item.uuid &&
      [
        "Connector",
        "Campaign",
        "Project Info",
        "Template Gallery",
        "My Analysis",
      ].findIndex(i => i === item.name) === -1
        ? true
        : false;
    menuTabs.push({
      key: item.name,
      icon: item.icon,
      children: children.length > 0 ? children : null,
      disabled: disabled,
      label: item.name,
      dashboard_uuid: item.uuid ?? null,
    });
    if (item.uuid) {
      dashboardMap.set(item.name, item.uuid);
    }
  });
  return { menuTabs, dashboardMap };
}

export function clearGACache() {
  localStorage.removeItem("LatestGACampaigns");
  localStorage.removeItem("LatestGAMenuTag");
  localStorage.removeItem("GASearchHistory");
  localStorage.removeItem("GAFavoritedTemplate");
  localStorage.removeItem("LatestGAProjectId");
  localStorage.removeItem("LatestGAProject");
}

export function saveLatestGAProject(LatestGAProject: string) {
  localStorage.setItem("LatestGAProject", LatestGAProject);
}
export function getLatestGAProject() {
  return localStorage.getItem("LatestGAProject");
}

export function saveLatestGAProjectId(LatestGAProjectId: string) {
  localStorage.setItem("LatestGAProjectId", LatestGAProjectId);
}
export function getLatestGAProjectId() {
  const id = localStorage.getItem("LatestGAProjectId");
  return id === "undefined" ? null : id;
}

export function saveLatestGAMenuTag(LatestGAMenuTag: string) {
  localStorage.setItem("LatestGAMenuTag", LatestGAMenuTag);
}
export function getLatestGAMenuTag() {
  return localStorage.getItem("LatestGAMenuTag");
}

export function saveLatestGACampaigns(LatestGACampaigns: any) {
  saveGAObject("LatestGACampaigns", LatestGACampaigns);
}
export function getLatestGACampaigns() {
  return getGAObject("LatestGACampaigns")
    ? getGAObject("LatestGACampaigns")
    : [];
}

export function saveGASearchHistory(item: any) {
  if (item) {
    const temp: any[] = getGASearchHistory();
    if (temp.findIndex(i => i.value === item.value) === -1) {
      temp.push(item);
    }
    if (temp.length > 3) {
      temp.splice(0, 1);
    }
    localStorage.setItem("GASearchHistory", JSON.stringify(temp));
  } else {
    localStorage.setItem("GASearchHistory", JSON.stringify([]));
  }
}
export function getGASearchHistory() {
  return localStorage.getItem("GASearchHistory")
    ? JSON.parse(localStorage.getItem("GASearchHistory")!)
    : [];
}

export function saveGAObject(key: string, item: any) {
  localStorage.setItem(key, JSON.stringify(item));
}

export function getGAObject(key: string) {
  return JSON.parse(localStorage.getItem("key")!);
}

export function saveGAFavoritedTemplate(item: any, like: boolean) {
  const temp: any[] = getGAFavoritedTemplate();
  const index = temp.findIndex(i => i.No === item.No);
  if (like && index === -1) {
    temp.push(item);
  }
  if (!like && index !== -1) {
    temp.splice(index, 1);
  }
  localStorage.setItem("GAFavoritedTemplate", JSON.stringify(temp));
}
export function getGAFavoritedTemplate() {
  return localStorage.getItem("GAFavoritedTemplate")
    ? JSON.parse(localStorage.getItem("GAFavoritedTemplate")!)
    : [];
}
