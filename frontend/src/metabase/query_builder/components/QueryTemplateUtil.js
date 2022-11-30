export function canAutoShowTemplateChart() {
  return !localStorage.getItem("never-show-template-chart", false);
}

export function setNeverShowTemplateChart(enable) {
  localStorage.setItem("never-show-template-chart", enable);
}
