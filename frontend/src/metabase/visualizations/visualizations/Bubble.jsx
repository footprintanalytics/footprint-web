/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { t } from "ttag";
import _ from "underscore";
import { sumBy } from "lodash";
import { columnSettings } from "metabase/visualizations/lib/settings/column";
import {
  dimensionSetting,
  fieldSetting,
} from "metabase/visualizations/lib/settings/utils";
import { globalColors } from "metabase/visualizations/lib/colors";
import { formatValue } from "metabase/lib/formatting";
import {
  axisLineStyles,
  xAxisLabelStyles,
  yAxisLabelStyles,
} from "metabase/static-viz/utils";
import {
  commonEChartXAxisSetting,
  commonEChartYAxisSetting,
} from "../lib/echart_common_setting";
import VizControls from "metabase/visualizations/hoc/VizControls";
import { commonEChartLegendSetting } from "metabase/visualizations/lib/legend";

@VizControls
export default class Bubble extends Component {
  constructor(props) {
    super(props);
    this.data = this.getData();
    this.xIndex = null;
    this.yIndex = null;
    this.sizeIndex = null;
    this.titleIndex = null;
    this.seriesIndex = null;
    this.multiply = 1;
    this.colors = [];
    this.xAxisName = "";
    this.yAxisName = "";
    this.id = React.createRef();
  }

  static uiName = t`Bubble`;
  static identifier = "bubble";
  static iconName = "bubble";

  static isSensible = () => true;

  static checkPermisson = () => true;

  static settings = {
    ...columnSettings({ hidden: true }),
    ...dimensionSetting("Bubble.name", {
      section: t`Data`,
      title: t`Name`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...dimensionSetting("Bubble.series", {
      section: t`Data`,
      title: t`Series`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...fieldSetting("Bubble.x", {
      section: t`Data`,
      title: t`X`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...fieldSetting("Bubble.y", {
      section: t`Data`,
      title: t`Y`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...fieldSetting("Bubble.size", {
      section: t`Data`,
      title: t`Size`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
  };

  componentDidMount() {
    this.chart = window.echarts.init(this.id.current);
    this.componentDidUpdate();
    // this.createColors();
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
    const {
      settings,
      series: [
        {
          data: { cols },
        },
      ],
    } = this.props;
    if (
      !settings["Bubble.x"] ||
      !settings["Bubble.y"] ||
      !settings["Bubble.size"] ||
      !settings["Bubble.series"] ||
      !settings["Bubble.name"]
    ) {
      return;
    }

    const data = this.data;
    const multiply = this.multiply;

    const series = data.map(item => {
      return {
        name: item[0][4],
        data: item,
        type: "scatter",
        symbolSize: function(data) {
          return Math.sqrt(data[2] * multiply);
        },
        emphasis: {
          focus: "series",
          label: {
            show: true,
            formatter: function(param) {
              return `${param.data[3]}`;
            },
            position: "top",
          },
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(120, 36, 50, 0.5)",
          shadowOffsetY: 5,
        },
      };
    });

    const legends = data
      .map(item => {
        return item[0][4];
      })
      .sort();

    const option = {
      backgroundColor: "#ffffff",
      legend: {
        ...commonEChartLegendSetting(),
        data: legends,
      },
      color: globalColors(),
      grid: {
        left: "8%",
        top: "15%",
      },
      xAxis: {
        name: settings["Bubble.x"],
        splitLine: {
          lineStyle: {
            type: "line",
          },
        },
        axisLabel: {
          ...xAxisLabelStyles(),
          formatter: value => {
            return formatValue(value, settings.column(cols[this.xIndex]));
          },
        },
        axisLine: {
          lineStyle: {
            ...axisLineStyles(),
          },
        },
        ...commonEChartXAxisSetting(),
      },
      yAxis: {
        name: settings["Bubble.y"],
        splitLine: {
          lineStyle: {
            type: "line",
          },
        },
        axisLabel: {
          ...yAxisLabelStyles(),
          formatter: value => {
            return formatValue(value, settings.column(cols[this.yIndex]));
          },
        },
        axisLine: {
          lineStyle: {
            ...axisLineStyles(),
          },
        },
        scale: true,
        ...commonEChartYAxisSetting(),
      },
      series: series,
    };

    this.chart.setOption(option);
  }, 500);

  getData() {
    const { settings } = this.props;
    if (
      !settings["Bubble.x"] ||
      !settings["Bubble.y"] ||
      !settings["Bubble.size"] ||
      !settings["Bubble.series"] ||
      !settings["Bubble.name"]
    ) {
      return;
    }
    const { cols, rows } = this.props.data; //x,y,size,name,series
    this.xIndex = cols.findIndex(item => item.name === settings["Bubble.x"]);
    this.yIndex = cols.findIndex(item => item.name === settings["Bubble.y"]);
    this.seriesIndex = cols.findIndex(
      item => item.name === settings["Bubble.series"],
    );
    this.sizeIndex = cols.findIndex(
      item => item.name === settings["Bubble.size"],
    );
    this.nameIndex = cols.findIndex(
      item => item.name === settings["Bubble.name"],
    );

    const rowsData = rows.filter(item => {
      return item[this.xIndex] && item[this.yIndex] && item[this.sizeIndex];
    });

    const res = [];
    const sizeArray = [];

    const seriesGroup = _.groupBy(rowsData, this.seriesIndex);
    Object.keys(seriesGroup).forEach(key => {
      const list = seriesGroup[key];
      const nameGroup = _.groupBy(list, this.nameIndex);
      const tempArray = [];
      Object.keys(nameGroup).forEach(key => {
        const list = nameGroup[key];
        const array = [
          sumBy(list, this.xIndex),
          sumBy(list, this.yIndex),
          sumBy(list, this.sizeIndex),
          list[0][this.nameIndex],
          list[0][this.seriesIndex],
        ];
        sizeArray.push(array[2]);
        tempArray.push(array);
      });
      res.push(tempArray);
    });
    const maxValueSize = _.max(sizeArray);
    this.multiply = 10000 / maxValueSize;
    return res;
  }

  formatId = key => {
    return key.replace(".", "_");
  };

  formatData = value => {
    return value ? value.toFixed(0) : 0;
  };

  render() {
    return <div ref={this.id} style={{ width: "100%", height: "100%" }} />;
  }
}
