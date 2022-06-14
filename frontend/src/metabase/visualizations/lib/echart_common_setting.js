export function commonEChartYAxisSetting() {
  return {
    splitNumber: 5,
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: true,
      interval: 0,
      inside: false,
      hideOverlap: true,
      margin: 12,
      fontFamily: "Arial",
      fontWeight: "normal",
      fontSize: 12,
      align: "right",
      color: "rgba(0, 0, 0, 0.45)",
    },
    axisPointer: {
      show: false,
      type: "line",
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: "dashed",
        color: "rgba(0, 0, 0, 0.15)",
      },
    },
    axisTick: {
      lineStyle: {
        type: "solid",
        color: "rgba(0, 0, 0, 0.15)",
      },
    },
  };
}

export function commonEChartXAxisSetting() {
  return {
    axisLabel: {
      fontFamily: "Arial",
      fontWeight: "normal",
      fontSize: 12,
      margin: 12,
      color: "rgba(0, 0, 0, 0.45)",
    },
    axisPointer: {
      show: false,
      type: "shadow",
    },
    lineStyle: {
      type: "solid",
      color: "rgba(0, 0, 0, 0.15)",
    },
    splitLine: {
      lineStyle: {
        type: "dashed",
        color: "rgba(0, 0, 0, 0.15)",
      },
    },
  };
}

export function commonEChartGridSetting() {
  return { right: "0%", left: "0%", containLabel: true };
}
