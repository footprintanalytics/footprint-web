/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { t } from "ttag";
import _ from "underscore";
import { columnSettings } from "metabase/visualizations/lib/settings/column";
import {
  dimensionSetting,
  fieldSetting,
} from "metabase/visualizations/lib/settings/utils";
import { reverse, sortBy, map } from "lodash";
import { formateCircleChartData } from "../../hoc/ChartDataFormatUtils";
import { formatValue } from "metabase/lib/formatting";
import { globalColors } from "../lib/colors";
import VizControls from "metabase/visualizations/hoc/VizControls";
import {
  commonEChartLegendSetting,
  commonEChartSeriesSetting,
} from "metabase/visualizations/lib/legend";

@VizControls
export default class Rose extends Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.option = null;
    this.oneI = null;
    this.dataI = null;
    this.showLegend = false;
    this.isSort = false;
    this.data = this.getData();
    this.id = React.createRef();
  }

  static uiName = t`Rose`;
  static identifier = "rose";
  static iconName = "rose";

  static isSensible = () => true;

  static settings = {
    ...columnSettings({ hidden: true }),
    ...dimensionSetting("rose.one", {
      section: t`Data`,
      title: t`Name`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...fieldSetting("rose.data", {
      section: t`Data`,
      title: t`Numerical Value`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    "rose.showLegend": {
      section: t`Display`,
      title: t`Show Legend`,
      widget: "radio",
      default: true,
      props: {
        options: [
          { name: t`yes`, value: true },
          { name: t`no`, value: false },
        ],
      },
    },
    "rose.isSort": {
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
    "rose.isEllipsis": {
      section: t`Display`,
      title: t`Is Ellipsis`,
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
      !settings["rose.one"] ||
      !settings["rose.data"] ||
      settings["rose.showLegend"] == null ||
      settings["rose.isSort"] == null ||
      settings["rose.isEllipsis"] == null
      // !settings["rose.four"]
    ) {
      return;
    }
    this.option = {
      color: globalColors(),
      tooltip: {
        trigger: "item",
        // formatter: "{a} <br/>{b} : {c} ({d}%)",
        // formatter: "{b}<br/>{c} ({d}%)",
        formatter: data => {
          const realName = data.data ? data.data.realName : "";
          return `${realName} ${formatValue(
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
          name: "Overview",
          type: "pie",
          radius: ["20%", "50%"],
          center: ["50%", "55%"],
          roseType: "area",
          // roseType: "radius",
          animationDurationUpdate: 1000,
          data: this.data,
          itemStyle: {
            borderRadius: 5,
          },
          ...commonEChartSeriesSetting(),
        },
      ],
    };
    this.chart.setOption(this.option);
  }, 500);

  getData() {
    const { settings } = this.props;
    if (
      !settings["rose.one"] ||
      !settings["rose.data"] ||
      settings["rose.showLegend"] == null ||
      settings["rose.isSort"] == null ||
      settings["rose.isEllipsis"] == null
    ) {
      return;
    }
    const { cols, rows } = this.props.data;
    this.oneI = cols.findIndex(item => item.name === settings["rose.one"]);
    this.dataI = cols.findIndex(item => item.name === settings["rose.data"]);
    this.showLegend = settings["rose.showLegend"];
    this.isSort = settings["rose.isSort"];
    this.isEllipsis = settings["rose.isEllipsis"];
    let res = formateCircleChartData(rows, [this.oneI], this.dataI);
    if (this.isSort) {
      res = reverse(sortBy(res, ["value"]));
    }

    const resTemp = res;
    map(resTemp, item => {
      item.realName = item.name;
      if (item.realName && item.realName.length > 10 && this.isEllipsis) {
        item.name =
          item.realName.substring(0, 4) +
          "***" +
          item.realName.substring(item.realName.length - 4);
      }
    });
    return resTemp;
  }

  render() {
    return (
      <div id="rose" ref={this.id} style={{ width: "100%", height: "100%" }} />
    );
  }
}
