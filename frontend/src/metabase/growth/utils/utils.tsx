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
