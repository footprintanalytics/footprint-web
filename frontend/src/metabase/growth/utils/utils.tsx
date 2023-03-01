export function saveLatestGAProject(LatestGAProject: string) {
  localStorage.setItem("LatestGAProject", LatestGAProject);
}
export function getLatestGAProject() {
  return localStorage.getItem("LatestGAProject");
}
export function saveLatestGAMenuTag(LatestGAMenuTag: string) {
  localStorage.setItem("LatestGAMenuTag", LatestGAMenuTag);
}
export function getLatestGAMenuTag() {
  return localStorage.getItem("LatestGAMenuTag");
}

export function saveLatestGACampaigns(LatestGACampaigns: any) {
  localStorage.setItem("LatestGACampaigns", JSON.stringify(LatestGACampaigns));
}
export function getLatestGACampaigns() {
  return localStorage.getItem("LatestGACampaigns")
    ? JSON.parse(localStorage.getItem("LatestGACampaigns")!)
    : [];
}

export function saveGASearchHistory(item: any) {
  const temp: any[] = getGASearchHistory();
  if (temp.findIndex(i => i.value === item.value) === -1) {
    temp.push(item);
  }
  if (temp.length > 3) {
    temp.splice(0, 1);
  }
  localStorage.setItem("GASearchHistory", JSON.stringify(temp));
}
export function getGASearchHistory() {
  return localStorage.getItem("GASearchHistory")
    ? JSON.parse(localStorage.getItem("GASearchHistory")!)
    : [];
}

export function saveGAObject(key: string, item: any) {
  localStorage.setItem(key, JSON.stringify(item));
}

export function getGACurrent() {
  return localStorage.getItem("GASearchHistory")
    ? JSON.parse(localStorage.getItem("GASearchHistory")!)
    : [];
}
