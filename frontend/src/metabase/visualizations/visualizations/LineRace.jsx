/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { t } from "ttag";
import _ from "underscore";
import { columnSettings } from "metabase/visualizations/lib/settings/column";
import {
  dimensionSetting,
  fieldSetting,
} from "metabase/visualizations/lib/settings/utils";
import { formatValue } from "metabase/lib/formatting";
import { globalColors } from "../lib/colors";
import {
  axisLineStyles,
  xAxisLabelStyles,
  yAxisLabelStyles,
} from "metabase/static-viz/utils";
import VizControls from "metabase/visualizations/hoc/VizControls";

@VizControls
export default class LineRace extends Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.option = null;
    this.xAxisIndex = null;
    this.yAxisIndex = null;
    this.lineIndex = null;
    this.data = this.getData();
    this.id = React.createRef();
  }

  static uiName = t`Line Race`;
  static identifier = "linerace";
  static iconName = "linerace";

  static isSensible = () => true;
  static checkPermisson = () => true;

  static settings = {
    ...columnSettings({ hidden: true }),

    ...dimensionSetting("linerace.xAxis", {
      section: t`Data`,
      title: t`X-axis`,
      dashboard: false,
      showColumnSetting: true,
    }),
    ...fieldSetting("linerace.yAxis", {
      section: t`Data`,
      title: t`Y-axis`,
      dashboard: false,
      showColumnSetting: true,
    }),
    ...dimensionSetting("linerace.line", {
      section: t`Data`,
      title: t`Line`,
      dashboard: false,
      showColumnSetting: false,
    }),
  };

  componentDidMount() {
    this.chart = window.echarts.init(this.id.current);
    this.getChart();
  }

  componentDidUpdate() {
    this.data = this.getData();
    if (this.chart) {
      this.chart.clear();
      this.getChart();
      this.chart.resize();
    }
  }

  getChart = _.debounce(async () => {
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

    console.log(this.data);

    this.option = {
      color: globalColors(),
      animationDuration: 20000,
      dataset: [
        {
          id: "dataset_raw",
          source: this.data.datasetSource,
        },
      ].concat(this.data.datasetWithFilters),
      tooltip: {
        order: "valueDesc",
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        nameLocation: "middle",
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
        name: settings["linerace.yAxis"],
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
      },
      grid: {
        // right: 300,
      },
      series: this.data.seriesList,
    };

    this.chart.setOption(this.option);
  }, 500);

  checkData() {
    const { settings } = this.props;
    if (
      !settings["linerace.xAxis"] ||
      !settings["linerace.yAxis"] ||
      !settings["linerace.line"]
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
      col => col.name === settings["linerace.xAxis"],
    );
    this.yAxisIndex = cols.findIndex(
      col => col.name === settings["linerace.yAxis"],
    );
    this.lineIndex = cols.findIndex(
      col => col.name === settings["linerace.line"],
    );

    const res = {
      datasetSource: [cols.map(col => col.name), ...rows],
      datasetWithFilters: [],
      seriesList: [],
    };

    const lines = [];

    rows.forEach(row => {
      if (!lines.includes(row[this.lineIndex])) {
        lines.push(row[this.lineIndex]);
      }
    });

    lines.forEach(line => {
      const datasetId = "dataset_" + line;

      res.datasetWithFilters.push({
        id: datasetId,
        fromDatasetId: "dataset_raw",
        transform: {
          type: "filter",
          config: {
            and: [{ dimension: settings["linerace.line"], "=": line }],
          },
        },
      });

      res.seriesList.push({
        type: "line",
        datasetId: datasetId,
        showSymbol: false,
        name: line,
        endLabel: {
          show: true,
          align: "right",
          // fontSize: 14,
          // fontFamily: "Arial,monospace",
          formatter: params => {
            return (
              params.value[this.lineIndex] +
              ": " +
              formatValue(
                params.value[this.yAxisIndex],
                settings.column(cols[this.yAxisIndex]),
              )
            );
          },
        },
        labelLayout: {
          moveOverlap: "shiftY",
        },
        emphasis: {
          focus: "series",
        },
        encode: {
          x: settings["linerace.xAxis"],
          y: settings["linerace.yAxis"],
          label: [settings["linerace.line"], settings["linerace.yAxis"]],
          itemName: settings["linerace.xAxis"],
          tooltip: [settings["linerace.yAxis"]],
        },
      });
    });

    return res;
  }

  render() {
    return (
      <div
        id="linerace"
        ref={this.id}
        style={{ width: "100%", height: "100%" }}
      />
    );
  }
}
