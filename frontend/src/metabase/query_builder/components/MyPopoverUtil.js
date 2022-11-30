export function canAutoShowChartPopover() {
  return !localStorage.getItem("never-show-chart-popover", false);
}

export function setNeverShowChartPopover(enable) {
  localStorage.setItem("never-show-chart-popover", enable);
}
