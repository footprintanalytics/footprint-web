/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { t } from "ttag";
import _ from "underscore";
import { columnSettings } from "metabase/visualizations/lib/settings/column";
import { dimensionSetting } from "metabase/visualizations/lib/settings/utils";
import { globalColors } from "metabase/visualizations/lib/colors";
import { formatValue } from "metabase/lib/formatting";
import {
  axisLineStyles,
  xAxisLabelStyles,
  yAxisLabelStyles,
} from "metabase/static-viz/utils";
import { sumBy, sum, zipWith, unzipWith } from "lodash";
import VizControls from "metabase/visualizations/hoc/VizControls";
import { commonEChartLegendSetting } from "metabase/visualizations/lib/legend";
import {
  commonEChartXAxisSetting,
  commonEChartYAxisSetting,
} from "../lib/echart_common_setting";

@VizControls
export default class BarStack extends Component {
  constructor(props) {
    super(props);
    this.data = null;
    this.xIndex = null;
    this.stackIndex = null;
    this.yIndex = null;
    this.id = React.createRef();
  }

  static uiName = t`Bar Stack`;
  static identifier = "barstack";
  static iconName = "barstack";

  static isSensible = () => true;

  static checkPermisson = () => true;

  static settings = {
    ...columnSettings({ hidden: true }),
    ...dimensionSetting("barstack.x", {
      section: t`Data`,
      title: t`X`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...dimensionSetting("barstack.stack", {
      section: t`Data`,
      title: t`STACK`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...dimensionSetting("barstack.y", {
      section: t`Data`,
      title: t`Y`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    "barstack.stack_type": {
      section: t`Display`,
      title: t`Stacking`,
      widget: "radio",
      props: {
        options: [
          { name: t`Don't stack`, value: null },
          { name: t`Stack`, value: "stacked" },
          { name: t`Stack - 100%`, value: "normalized" },
        ],
      },
      getDefault: "stacked",
    },
    "barstack.stack_display": {
      section: t`Display`,
      title: t`Stacked chart type`,
      widget: "segmentedControl",
      props: {
        options: [
          { icon: "area", value: "area" },
          { icon: "bar", value: "bar" },
        ],
      },
      getDefault: "bar",
      getHidden: (series, settings) => settings["barstack.stack_type"] === null,
    },
    "graph.show_values": {
      section: t`Display`,
      title: t`Show values on data points`,
      widget: "toggle",
      getHidden: (series, vizSettings) =>
        vizSettings["barstack.stack_type"] !== "stacked",
      default: false,
    },
  };

  componentDidMount() {
    this.chart = window.echarts.init(this.id.current);
    this.componentDidUpdate();
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
      !settings["barstack.x"] ||
      !settings["barstack.stack"] ||
      !settings["barstack.y"]
    ) {
      return;
    }

    const { xAxisData, series, yAxisMaxObject } = this.data;

    const valueColor = globalColors();

    const option = {
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "shadow",
        },
        formatter: params => {
          return `${settings["barstack.x"]}:${formatValue(
            params.name,
            settings.column(cols[this.xIndex]),
          )}
            <br />
            ${settings["barstack.stack"]}:${formatValue(
            params.seriesName,
            settings.column(cols[this.stackIndex]),
          )}
            <br />
            ${settings["barstack.y"]}:${formatValue(
            params.value,
            settings.column(cols[this.yIndex]),
          )}`;
        },
      },
      legend: commonEChartLegendSetting(),
      grid: {
        left: "0%",
        right: "0%",
        bottom: "3%",
        top: "15%",
        containLabel: true,
      },
      color: valueColor,
      xAxis: [
        {
          type: "category",
          data: xAxisData,
          nameLocation: "middle",
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
      ],
      yAxis: [
        {
          type: "value",
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
          ...yAxisMaxObject,
        },
        ...commonEChartYAxisSetting(),
      ],
      series: series,
    };

    this.chart.setOption(option);
  }, 500);

  getData() {
    const { settings } = this.props;
    if (
      !settings["barstack.x"] ||
      !settings["barstack.stack"] ||
      !settings["barstack.y"]
    ) {
      return;
    }

    const { cols, rows } = this.props.data; //x,y,size,name,series

    const res = {};

    this.xIndex = cols.findIndex(item => item.name === settings["barstack.x"]);
    this.stackIndex = cols.findIndex(
      item => item.name === settings["barstack.stack"],
    );
    this.yIndex = cols.findIndex(item => item.name === settings["barstack.y"]);

    const data = rows.filter(item => {
      return item[this.xIndex] && item[this.stackIndex] && item[this.yIndex];
    });

    const xGroup = _.groupBy(data, this.xIndex);
    const xAxisData = Object.keys(xGroup);
    const totalYList = xAxisData.map(x => {
      return sumBy(xGroup[x], this.yIndex);
    });

    let series = [];

    let type = "bar";
    let areaStyleObject = {};
    if (
      settings["barstack.stack_type"] &&
      settings["barstack.stack_display"] === "area"
    ) {
      type = "line";
      areaStyleObject = { areaStyle: {} };
    }
    let yAxisMaxObject = {};
    if (settings["barstack.stack_type"] === "normalized") {
      yAxisMaxObject = { max: 1 };
    }
    const stackGroup = _.groupBy(data, this.stackIndex);
    const stackGroupKeys = Object.keys(stackGroup);
    stackGroupKeys.forEach((key, index) => {
      const list = stackGroup[key];
      const xGroupFromList = _.groupBy(list, this.xIndex);
      series.push({
        name: key,
        type: type,
        label: {
          show:
            settings["barstack.stack_type"] === "stacked" &&
            settings["graph.show_values"] &&
            index === stackGroupKeys.length - 1,
          position: "top",
          formatter: param => {
            const totalY = totalYList[param.dataIndex];
            return formatValue(totalY, settings.column(cols[this.yIndex]));
          },
        },
        emphasis: {
          focus: "series",
        },
        stack: settings["barstack.stack_type"] ? "***" : key,
        ...areaStyleObject,
        data: xAxisData.map(value => {
          const findList = xGroupFromList[value];
          return findList ? sumBy(findList, this.yIndex) : 0;
        }),
      });
    });

    if (settings["barstack.stack_type"] === "normalized") {
      const datas = series.map(item => item.data);
      const totalArray = unzipWith(datas, (...a) => sum(a));
      series = series.map(item => {
        return {
          ...item,
          data: zipWith(item.data, totalArray, (a, b) => (b === 0 ? 0 : a / b)),
        };
      });
    }

    res.xAxisData = xAxisData;
    res.series = series;
    res.yAxisMaxObject = yAxisMaxObject;

    return res;
  }

  render() {
    return <div ref={this.id} style={{ width: "100%", height: "100%" }} />;
  }
}
