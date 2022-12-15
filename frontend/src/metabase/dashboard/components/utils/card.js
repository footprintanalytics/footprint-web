export const getOrderedCards = dashboard => {
  if (!dashboard.ordered_cards) {
    return dashboard.ordered_cards;
  }

  let thumbNumByCard = 0;
  let stopChartsNum = 0;
  const result = [];
  let stop = false;
  const simpleCharts = ["text", "scalar", "smartscalar", "table"];
  const stopCharts = ["area"];
  const maxComplexChartCount = 4;
  const maxStopChartCount = 2;
  for (const item of dashboard.ordered_cards) {
    const display = item.card.display;
    if (!simpleCharts.includes(display)) {
      thumbNumByCard++;
    }
    if (stopCharts.includes(display)) {
      stopChartsNum++;
    }
    if (
      thumbNumByCard > maxComplexChartCount ||
      stopChartsNum === maxStopChartCount
    ) {
      stop = true;
    }
    if (stop) {
      result.push({ ...item, thumbFilter: true });
    } else {
      result.push(item);
    }
  }
  return result;
};
