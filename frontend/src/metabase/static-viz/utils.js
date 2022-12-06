export function leftAxisTickStyles(layout) {
  return {
    fontFamily: "Lato, sans-serif",
    fill: layout.colors.axis.label.fill,
    fontSize: 11,
    textAnchor: "end",
  };
}

export function bottomAxisTickStyles(layout) {
  return {
    fontFamily: "Arial,Lato, sans-serif",
    fill: layout.colors.axis.label.fill,
    fontSize: 11,
    textAnchor: "middle",
  };
}

export function yAxisLabelStyles() {
  return {
    fontFamily: "Arial,Lato, sans-serif",
    fontSize: 12,
    fontWeight: 200,
    color: "#949aab",
  };
}

export function xAxisLabelStyles() {
  return {
    fontFamily: "Arial,Lato, sans-serif",
    fontSize: 12,
    fontWeight: 200,
    color: "#949aab",
  };
}

export function axisLineStyles() {
  return {
    color: "#b8bbc3",
  };
}
