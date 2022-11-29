/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { t } from "ttag";
import _ from "underscore";
import { columnSettings } from "metabase/visualizations/lib/settings/column";
import VizControls from "metabase/visualizations/hoc/VizControls";

@VizControls
export default class Graph1 extends Component {
  constructor(props) {
    super(props);
    this.data = this.getData();
    this.id = React.createRef();
  }

  static uiName = t`Graph`;
  static identifier = "graph";
  static iconName = "graph";

  static isSensible = () => true;

  static settings = {
    ...columnSettings({ hidden: true }),
    // "graph.sourceField": {
    //   section: t`Display`,
    //   title: t`Source field`,
    //   widget: "input",
    //   default: "source",
    // },
    // "graph.sizeField": {
    //   section: t`Display`,
    //   title: t`Size field`,
    //   widget: "input",
    //   default: "size",
    // },
    // "graph.valueField": {
    //   section: t`Display`,
    //   title: t`Value field`,
    //   widget: "input",
    //   default: "value",
    // },
    // "graph.targetField": {
    //   section: t`Display`,
    //   title: t`Target field`,
    //   widget: "input",
    //   default: "target",
    // },
    "graph.repulsion": {
      section: t`Display`,
      title: t`Repulsion`,
      widget: "number",
      default: 2000,
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
    this.option = {
      tooltip: {},
      series: [
        {
          name: "Graph",
          type: "graph",
          layout: "force",
          data: this.data,
          links: this.data,
          roam: true,
          label: {
            show: true,
            position: "right",
            formatter: "{b}",
          },
          force: {
            repulsion: settings["graph.repulsion"],
          },
          // edgeSymbol: ["arrow"],
        },
      ],
    };
    this.chart.setOption(this.option);
  }, 500);

  getData() {
    const data = [];
    const { cols, rows } = this.props.data;
    const sourceIndex = cols.findIndex(c => c.name === "source");
    const sizeIndex = cols.findIndex(c => c.name === "size");
    const valueIndex = cols.findIndex(c => c.name === "value");
    const targetIndex = cols.findIndex(c => c.name === "target");
    rows.forEach(r => {
      data.push({
        name: r[sourceIndex],
        symbolSize: r[sizeIndex],
        value: r[valueIndex],
        source: r[sourceIndex],
        target: r[targetIndex],
      });
    });
    return data;
  }

  render() {
    return (
      <div id="graph" ref={this.id} style={{ width: "100%", height: "100%" }} />
    );
  }
}
