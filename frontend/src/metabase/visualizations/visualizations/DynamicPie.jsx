/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { t } from "ttag";
import _ from "underscore";
import { columnSettings } from "metabase/visualizations/lib/settings/column";
import {
  dimensionSetting,
  fieldSetting,
} from "metabase/visualizations/lib/settings/utils";
import { globalColors } from "../lib/colors";
import { formatValue } from "metabase/lib/formatting";
import {
  axisLineStyles,
  xAxisLabelStyles,
  yAxisLabelStyles,
} from "metabase/static-viz/utils";
import {
  commonEChartGridSetting,
  commonEChartYAxisSetting,
} from "../lib/echart_common_setting";
import VizControls from "metabase/visualizations/hoc/VizControls";
import { commonEChartLegendSetting } from "metabase/visualizations/lib/legend";
import { deviceInfo } from "metabase-lib/lib/Device";

@VizControls
export default class DynamicPie extends Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.option = null;
    this.xAxisIndex = null;
    this.yAxisIndex = null;
    this.categoryIndex = null;
    this.data = this.getData();
    this.id = React.createRef();
  }

  static uiName = t`Dynamic Pie`;
  static identifier = "dynamicpie";
  static iconName = "dynamicpie";

  static isSensible = () => true;
  static checkPermisson = () => true;

  static settings = {
    ...columnSettings({ hidden: true }),
    ...dimensionSetting("dynamicpie.xAxis", {
      section: t`Data`,
      title: t`X-axis`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...fieldSetting("dynamicpie.yAxis", {
      section: t`Data`,
      title: t`Y-axis`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...dimensionSetting("dynamicpie.category", {
      section: t`Data`,
      title: t`Category`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
  };

  componentDidMount() {
    this.chart = window.echarts.init(this.id.current);
    this.chart.on("updateAxisPointer", event => {
      const {
        settings,
        series: [
          {
            data: { cols },
          },
        ],
      } = this.props;
      const xAxisInfo = event.axesInfo[0];
      if (xAxisInfo) {
        const dimension = xAxisInfo.value + 1;
        this.chart.setOption({
          series: {
            id: "pie",
            label: {
              // formatter: "{b}: {@[" + dimension + "]} ({d}%)",
              formatter: args => {
                const value = formatValue(
                  args.value[dimension],
                  settings.column(cols[this.yAxisIndex]),
                );
                return `${args.name}\n${value}\n${args.percent}%`;
              },
            },
            encode: {
              value: dimension,
              tooltip: dimension,
            },
          },
        });
      }
    });
    this.getChart();
  }

  componentDidUpdate() {
    this.data = this.getData();
    if (this.chart) {
      this.props.shouldClearChart && this.chart.clear();
      this.getChart();
      this.chart.resize();
    }
  }

  getChart = _.debounce(() => {
    if (!this.checkData()) {
      return;
    }
    const {
      settings,
      series: [
        {
          data: { cols },
        },
      ],
    } = this.props;

    this.option = {
      legend: commonEChartLegendSetting(),
      tooltip: {
        showContent: true,
      },
      color: globalColors(),
      dataset: {
        source: this.data.source,
      },
      xAxis: {
        type: "category",
        axisLabel: {
          ...xAxisLabelStyles(),
          formatter: value => {
            return formatValue(value, settings.column(cols[this.xAxisIndex]));
          },
        },
        axisLine: {
          lineStyle: {
            ...axisLineStyles(),
          },
        },
      },
      yAxis: {
        gridIndex: 0,
        axisLabel: {
          ...yAxisLabelStyles(),
          formatter: value => {
            return formatValue(value, settings.column(cols[this.yAxisIndex]));
          },
        },
        axisLine: {
          lineStyle: {
            ...axisLineStyles(),
          },
        },
        ...commonEChartYAxisSetting(),
      },
      grid: { top: "60%", bottom: 0, ...commonEChartGridSetting() },
      series: [
        {
          type: "pie",
          id: "pie",
          radius: "25%",
          color: globalColors(),
          center: ["50%", "25%"],
          emphasis: { focus: "data" },
          avoidLabelOverlap: false,
          top: 40,
          label: {
            // formatter: `{b}: {@[1]} ({d}%)`,
            fontSize: deviceInfo().isMobile ? 11 : 12,
            formatter: args => {
              const value = formatValue(
                args.value[args.value.length - 1] || 0,
                settings.column(cols[this.yAxisIndex]),
              );
              return `${args.name}\n${value}\n${args.percent}%`;
            },
          },
          encode: {
            itemName: this.data.itemName,
            value: this.data.defaultValue,
            tooltip: this.data.defaultValue,
          },
        },
        ...this.data.series,
      ],
    };
    this.chart.setOption(this.option);
  }, 500);

  checkData() {
    const { settings } = this.props;
    if (
      !settings["dynamicpie.xAxis"] ||
      !settings["dynamicpie.yAxis"] ||
      !settings["dynamicpie.category"]
    ) {
      return false;
    }
    return true;
  }

  getData() {
    if (!this.checkData()) {
      return;
    }

    const { settings } = this.props;
    const { cols, rows } = this.props.data;

    this.xAxisIndex = cols.findIndex(
      col => col.name === settings["dynamicpie.xAxis"],
    );
    this.yAxisIndex = cols.findIndex(
      col => col.name === settings["dynamicpie.yAxis"],
    );
    this.categoryIndex = cols.findIndex(
      col => col.name === settings["dynamicpie.category"],
    );

    const category = cols[this.categoryIndex]["name"];
    const xAxisList = [];
    const yAxisList = [];
    const titleList = [];

    rows.forEach(row => {
      if (!xAxisList.includes(row[this.xAxisIndex])) {
        xAxisList.push(row[this.xAxisIndex]);
      }
      const yAxisTitle = row[this.categoryIndex];
      if (!titleList.includes(yAxisTitle)) {
        titleList.push(yAxisTitle);
      }
    });

    titleList.forEach(y => {
      const values = [];
      xAxisList.map(x => {
        const res = rows.find(
          row => row[this.categoryIndex] === y && row[this.xAxisIndex] === x,
        );
        values.push(res ? res[this.yAxisIndex] : null);
      });

      yAxisList.push([y, ...values]);
    });

    const series = yAxisList.map(y => ({
      type: "line",
      smooth: true,
      seriesLayoutBy: "row",
      emphasis: { focus: "series" },
    }));
    return {
      itemName: category,
      defaultValue: [...xAxisList].pop(),
      source: [[category, ...xAxisList], ...yAxisList],
      series,
    };
  }

  render() {
    return (
      <div
        id="dynamicpie"
        ref={this.id}
        style={{ width: "100%", height: "100%" }}
      />
    );
  }
}
