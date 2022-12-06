/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { t } from "ttag";
import _ from "underscore";
import { columnSettings } from "metabase/visualizations/lib/settings/column";
import { fieldSetting } from "metabase/visualizations/lib/settings/utils";
import VizControls from "metabase/visualizations/hoc/VizControls";

class Graph1 extends Component {
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
    ...fieldSetting("graph.sourceField", {
      section: t`Data`,
      title: t`Source Field`,
      dashboard: false,
      showColumnSetting: true,
    }),
    ...fieldSetting("graph.targetField", {
      section: t`Data`,
      title: t`Target Field`,
      dashboard: false,
      showColumnSetting: true,
    }),
    ...fieldSetting("graph.valueField", {
      section: t`Data`,
      title: t`Value Field`,
      dashboard: false,
      showColumnSetting: true,
    }),
    ...fieldSetting("graph.sizeField", {
      section: t`Data`,
      title: t`Size Field`,
      dashboard: false,
      showColumnSetting: true,
    }),
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
    const { settings } = this.props;
    const { cols, rows } = this.props.data;
    const sourceIndex = cols.findIndex(
      c => c.name === settings["graph.sourceField"],
    );
    const sizeIndex = cols.findIndex(
      c => c.name === settings["graph.sizeField"],
    );
    const valueIndex = cols.findIndex(
      c => c.name === settings["graph.valueField"],
    );
    const targetIndex = cols.findIndex(
      c => c.name === settings["graph.targetField"],
    );
    if (sourceIndex < 0 || sizeIndex < 0 || valueIndex < 0 || targetIndex < 0) {
      return data;
    }
    rows.forEach((r, i) => {
      data.push({
        id: i,
        name: r[sourceIndex],
        symbolSize: r[sizeIndex],
        value: r[valueIndex],
        source: i,
        sourceRaw: r[sourceIndex],
        targetRaw: r[targetIndex],
      });
    });
    data.forEach(d => {
      d.target = data.find(dd => dd.name === d.targetRaw)?.id;
    });
    console.log(data);
    return data;
  }

  render() {
    return (
      <div id="graph" ref={this.id} style={{ width: "100%", height: "100%" }} />
    );
  }
}

export default VizControls(Graph1);
