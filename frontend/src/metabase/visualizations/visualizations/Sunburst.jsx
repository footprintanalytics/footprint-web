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
import { formateCircleChartData } from "../../hoc/ChartDataFormatUtils";
import { globalColors } from "../lib/colors";
import VizControls from "metabase/visualizations/hoc/VizControls";

@VizControls
export default class Sunburst extends Component {
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
    this.useCenter = false;
    this.data = this.getData();
    this.id = React.createRef();
  }

  static uiName = t`Sunburst`;
  static identifier = "sunburst";
  static iconName = "sunburst";

  static isSensible = () => true;

  static settings = {
    ...columnSettings({ hidden: true }),
    ...dimensionSetting("sunburst.one", {
      section: t`Data`,
      title: t`First Level`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...dimensionSetting("sunburst.two", {
      section: t`Data`,
      title: t`Second Level`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...dimensionSetting("sunburst.three", {
      section: t`Data`,
      title: t`Third Level`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...fieldSetting("sunburst.data", {
      section: t`Data`,
      title: t`Numerical Value`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    "sunburst.showNumerical": {
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
    "sunburst.showPercentage": {
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
    "sunburst.useCenter": {
      section: t`Display`,
      title: t`Use Center`,
      widget: "radio",
      default: false,
      props: {
        options: [
          { name: t`yes`, value: true },
          { name: t`no`, value: false },
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
      !settings["sunburst.one"] ||
      !settings["sunburst.two"] ||
      !settings["sunburst.data"] ||
      settings["sunburst.showNumerical"] == null ||
      settings["sunburst.showPercentage"] == null ||
      settings["sunburst.useCenter"] == null
    ) {
      return;
    }
    this.option = {
      color: globalColors(),
      series: [
        {
          name: "Overview",
          // type: "sunburst",
          type: "sunburst",
          radius: [this.useCenter ? "0%" : "20%", "90%"],
          animationDurationUpdate: 1000,
          data: this.data,
          leafDepth: 1,
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
              colorSaturation: [0.3, 0.6],
              itemStyle: {
                borderColorSaturation: 0.7,
                borderWidth: 2,
                gapWidth: 2,
              },
            },
            {
              colorSaturation: [0.3, 0.6],
              itemStyle: {
                borderColorSaturation: 0.7,
                gapWidth: 1,
              },
            },
            {
              colorSaturation: [0.3, 0.6],
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
      !settings["sunburst.one"] ||
      !settings["sunburst.two"] ||
      !settings["sunburst.data"] ||
      settings["sunburst.showNumerical"] == null ||
      settings["sunburst.showPercentage"] == null ||
      settings["sunburst.useCenter"] == null
    ) {
      return;
    }
    const { cols, rows } = this.props.data;
    this.oneI = cols.findIndex(item => item.name === settings["sunburst.one"]);
    this.twoI = cols.findIndex(item => item.name === settings["sunburst.two"]);
    this.threeI = cols.findIndex(
      item => item.name === settings["sunburst.three"],
    );
    this.dataI = cols.findIndex(
      item => item.name === settings["sunburst.data"],
    );
    this.showNumericalI = settings["sunburst.showNumerical"];
    this.showPercentageI = settings["sunburst.showPercentage"];
    this.useCenter = settings["sunburst.useCenter"];

    return formateCircleChartData(
      rows,
      [this.oneI, this.twoI, this.threeI],
      this.dataI,
    );
  }

  render() {
    return (
      <div
        id="sunburst"
        ref={this.id}
        style={{ width: "100%", height: "100%" }}
      />
    );
  }
}
