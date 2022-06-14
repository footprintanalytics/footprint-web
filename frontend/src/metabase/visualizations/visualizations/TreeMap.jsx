/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { t } from "ttag";
import _ from "underscore";
import { columnSettings } from "metabase/visualizations/lib/settings/column";
import { dimensionSetting } from "metabase/visualizations/lib/settings/utils";
import { formatValue } from "metabase/lib/formatting";
import { formateCircleChartData } from "../../hoc/ChartDataFormatUtils";
import { globalColors } from "../lib/colors";
import VizControls from "metabase/visualizations/hoc/VizControls";

@VizControls
export default class TreeMap extends Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.option = null;
    this.oneI = null;
    this.twoI = null;
    this.threeI = null;
    this.dataI = null;
    this.showNumericalI = true;
    this.showPercentageI = true;
    this.data = this.getData();
    this.id = React.createRef();
  }

  static uiName = t`Tree Map`;
  static identifier = "treemap";
  static iconName = "pivot_table";

  static isSensible = () => true;

  static settings = {
    ...columnSettings({ hidden: true }),
    ...dimensionSetting("treemap.one", {
      section: t`Data`,
      title: t`First Level`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...dimensionSetting("treemap.two", {
      section: t`Data`,
      title: t`Second Level`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...dimensionSetting("treemap.three", {
      section: t`Data`,
      title: t`Third Level`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...dimensionSetting("treemap.data", {
      section: t`Data`,
      title: t`Numerical Value`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    "treemap.showNumerical": {
      section: t`Display`,
      title: t`Show Numerical`,
      widget: "radio",
      default: true,
      props: {
        options: [
          { name: t`show`, value: true },
          { name: t`hidden`, value: false },
        ],
      },
    },
    "treemap.showPercentage": {
      section: t`Display`,
      title: t`Show Percentage`,
      widget: "radio",
      default: true,
      props: {
        options: [
          { name: t`show`, value: true },
          { name: t`hidden`, value: false },
        ],
      },
    },
  };

  static checkPermisson = () => true;

  componentDidMount() {
    this.chart = window.echarts.init(this.id.current);
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
    const { settings } = this.props;
    const { cols } = this.props.data;
    const dataI = this.dataI;
    const showNumericalI = this.showNumericalI;
    const showPercentageI = this.showPercentageI;
    if (
      !settings["treemap.one"] ||
      !settings["treemap.two"] ||
      !settings["treemap.data"] ||
      settings["treemap.showNumerical"] == null ||
      settings["treemap.showPercentage"] == null
    ) {
      return;
    }
    this.option = {
      color: globalColors(),
      series: [
        {
          name: "Overview",
          type: "treemap",
          animationDurationUpdate: 1000,
          data: this.data,
          leafDepth: 1,
          width: "100%",
          height: "100%",
          drillDownIcon: "",
          label: {
            normal: {
              position: "inside",
              formatter(params) {
                return `${params.name} ${
                  showPercentageI
                    ? (
                        (params.value /
                          params.treePathInfo[params.treePathInfo.length - 2]
                            .value) *
                        100
                      ).toFixed(2) + "%"
                    : ""
                }${
                  showNumericalI
                    ? "\n" +
                      formatValue(params.value, settings.column(cols[dataI]))
                    : ""
                }`;
              },
            },
          },
          levels: [
            {
              itemStyle: {
                borderColor: "#555",
                borderWidth: 4,
                gapWidth: 4,
              },
            },
            {
              colorSaturation: [0.6, 0.3],
              itemStyle: {
                borderColorSaturation: 0.7,
                borderWidth: 2,
                gapWidth: 2,
              },
            },
            {
              colorSaturation: [0.6, 0.3],
              itemStyle: {
                borderColorSaturation: 0.7,
                gapWidth: 1,
              },
            },
            {
              colorSaturation: [0.6, 0.3],
              itemStyle: {
                borderColorSaturation: 0.7,
                gapWidth: 0.5,
              },
            },
          ],
        },
      ],
    };
    this.chart.setOption(this.option);
  }, 500);

  getData() {
    const { settings } = this.props;
    if (
      !settings["treemap.one"] ||
      !settings["treemap.two"] ||
      !settings["treemap.data"] ||
      settings["treemap.showNumerical"] == null ||
      settings["treemap.showPercentage"] == null
    ) {
      return;
    }
    const { cols, rows } = this.props.data;
    this.oneI = cols.findIndex(item => item.name === settings["treemap.one"]);
    this.twoI = cols.findIndex(item => item.name === settings["treemap.two"]);
    this.threeI = cols.findIndex(
      item => item.name === settings["treemap.three"],
    );
    this.dataI = cols.findIndex(item => item.name === settings["treemap.data"]);
    this.showNumericalI = settings["treemap.showNumerical"];
    this.showPercentageI = settings["treemap.showPercentage"];

    return formateCircleChartData(
      rows,
      [this.oneI, this.twoI, this.threeI],
      this.dataI,
    );
  }

  render() {
    return (
      <div
        id="treemap"
        ref={this.id}
        style={{ width: "100%", height: "100%" }}
      />
    );
  }
}
