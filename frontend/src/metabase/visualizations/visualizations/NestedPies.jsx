/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { t } from "ttag";
import _ from "underscore";
import { columnSettings } from "metabase/visualizations/lib/settings/column";
import {
  dimensionSetting,
  fieldSetting,
} from "metabase/visualizations/lib/settings/utils";
import { reverse, sortBy } from "lodash";
import { formateCircleChartData } from "../../hoc/ChartDataFormatUtils";
import { formatValue } from "metabase/lib/formatting";
import { globalColors } from "../lib/colors";
import VizControls from "metabase/visualizations/hoc/VizControls";
import { commonEChartLegendSetting } from "metabase/visualizations/lib/legend";

@VizControls
export default class NestedPies extends Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.option = null;
    this.innerI = null;
    this.outerI = null;

    this.innerName = null;
    this.outerName = null;
    this.dataI = null;
    this.showLegend = true;
    this.isSort = false;
    this.data = this.getData();
    this.id = React.createRef();
  }

  static uiName = t`Nested Pies`;
  static identifier = "nestedpies";
  static iconName = "nested_pies";

  static isSensible = () => true;

  static settings = {
    ...columnSettings({ hidden: true }),
    ...dimensionSetting("nestedpies.inner", {
      section: t`Data`,
      title: t`Inner Type`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...dimensionSetting("nestedpies.outer", {
      section: t`Data`,
      title: t`Outer Type`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...fieldSetting("nestedpies.data", {
      section: t`Data`,
      title: t`Numerical Value`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    "nestedpies.showLegend": {
      section: t`Display`,
      title: t`Show Legend`,
      widget: "radio",
      default: false,
      props: {
        options: [
          { name: t`yes`, value: true },
          { name: t`no`, value: false },
        ],
      },
    },
    "nestedpies.isSort": {
      section: t`Display`,
      title: t`Is Sort`,
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
    if (
      !settings["nestedpies.inner"] ||
      !settings["nestedpies.outer"] ||
      !settings["nestedpies.data"] ||
      settings["nestedpies.showLegend"] == null ||
      settings["nestedpies.isSort"] == null
      // !settings["nestedpies.four"]
    ) {
      return;
    }
    this.option = {
      tooltip: {
        trigger: "item",
        // formatter: "{a} <br/>{b} : {c} ({d}%)",
        // formatter: "{b}<br/>{c} ({d}%)",
        formatter: data => {
          return `${data.name}<br/>${formatValue(
            data.value,
            settings.column(cols[this.dataI]),
          )}`;
        },
      },
      legend: {
        show: this.showLegend,
        ...commonEChartLegendSetting(),
      },
      toolbox: {
        show: false,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: false },
        },
      },
      series: [
        {
          name: this.innerName,
          type: "pie",
          selectedMode: "single",
          radius: [0, "30%"],
          center: ["50%", "50%"],
          label: {
            position: "inner",
            fontSize: 12,
            fontFamily: "Arial,Lato, sans-serif",
          },
          labelLine: {
            show: false,
          },
          animationDurationUpdate: 1000,
          data: this.data.innerData,
        },
        {
          name: this.outerName,
          type: "pie",
          radius: ["55%", "80%"],
          center: ["50%", "50%"],
          labelLine: {
            length: 30,
          },
          label: {
            // formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ",
            formatter: data => {
              return `${data.name} ${formatValue(
                data.value,
                settings.column(cols[this.dataI]),
              )}`;
            },
            // backgroundColor: "#F6F8FC",
            // borderColor: "#8C8D8E",
            // borderWidth: 1,
            // borderRadius: 4,
            color: "#84848a",
            fontSize: 12,
            fontWeight: "normal",
            fontFamily: "Arial,Lato, sans-serif",
            rich: {
              a: {
                color: "#6E7079",
                lineHeight: 22,
                align: "center",
                fontFamily: "Arial,Lato, sans-serif",
              },
              hr: {
                borderColor: "#8C8D8E",
                width: "100%",
                borderWidth: 1,
                height: 0,
                fontFamily: "Arial,Lato, sans-serif",
              },
              b: {
                color: "#4C5058",
                fontSize: 14,
                fontWeight: "bold",
                lineHeight: 33,
                fontFamily: "Arial,Lato, sans-serif",
              },
              per: {
                color: "#fff",
                backgroundColor: "#4C5058",
                padding: [3, 4],
                borderRadius: 4,
              },
            },
          },
          data: this.data.outerData,
        },
      ],
      color: globalColors(),
    };
    this.chart.setOption(this.option);
  }, 500);

  getData() {
    const { settings } = this.props;
    if (
      !settings["nestedpies.inner"] ||
      !settings["nestedpies.outer"] ||
      !settings["nestedpies.data"] ||
      settings["nestedpies.showLegend"] == null ||
      settings["nestedpies.isSort"] == null
    ) {
      return;
    }
    const { cols, rows } = this.props.data;
    this.innerI = cols.findIndex(
      item => item.name === settings["nestedpies.inner"],
    );
    this.innerName = settings["nestedpies.inner"];
    this.outerI = cols.findIndex(
      item => item.name === settings["nestedpies.outer"],
    );
    this.outerName = settings["nestedpies.outer"];
    this.dataI = cols.findIndex(
      item => item.name === settings["nestedpies.data"],
    );
    this.showLegend = settings["nestedpies.showLegend"];
    this.isSort = settings["nestedpies.isSort"];
    let innerData = formateCircleChartData(rows, [this.innerI], this.dataI);
    let outerData = formateCircleChartData(rows, [this.outerI], this.dataI);
    if (this.isSort) {
      innerData = reverse(sortBy(innerData, ["value"]));
      outerData = reverse(sortBy(outerData, ["value"]));
    }
    return { innerData: innerData, outerData: outerData };
  }

  render() {
    return (
      <div
        id="nestedpies"
        ref={this.id}
        style={{ width: "100%", height: "100%" }}
      />
    );
  }
}
