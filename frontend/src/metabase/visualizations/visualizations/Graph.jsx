/* eslint-disable curly */
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
    this.option = {
      tooltip: {},
      legend: [
        {
          data: this.data.categories.map(c => c.name),
        },
      ],
      series: [
        {
          name: "Graph",
          type: "graph",
          layout: "circular",
          data: this.data.nodes,
          links: this.data.links,
          categories: this.data.categories,
          roam: true,
          label: {
            show: true,
            position: "right",
            formatter: "{b}",
          },
          edgeSymbol: ["circle", "arrow"],
          lineStyle: {
            color: "source",
            curveness: 0.3,
          },
        },
      ],
    };
    this.chart.setOption(this.option);
  }, 500);

  getData() {
    const data = { nodes: [], links: [], categories: [] };
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
    console.log(rows);
    rows.forEach(r => {
      if (!data.nodes.find(n => n.name === r[sourceIndex])) {
        data.nodes.push({
          name: r[sourceIndex],
          value: r[sizeIndex],
          symbolSize: r[sizeIndex],
        });
      }
      if (!data.nodes.find(n => n.name === r[targetIndex])) {
        data.nodes.push({
          name: r[targetIndex],
          value: r[sizeIndex],
          symbolSize: r[sizeIndex],
        });
      }
    });
    data.nodes = data.nodes.map((n, i) => ({ ...n, category: i }));
    data.categories = data.nodes.map(n => ({ name: n.name }));
    rows.forEach(r => {
      data.links.push({
        source: r[sourceIndex],
        target: r[targetIndex],
        value: r[valueIndex],
      });
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
