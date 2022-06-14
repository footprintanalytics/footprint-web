/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { t } from "ttag";
import * as d3 from "d3-hierarchy";
import { color } from "metabase/lib/colors";
import _ from "underscore";
import { sumBy } from "lodash";
import { columnSettings } from "metabase/visualizations/lib/settings/column";
import {
  dimensionSetting,
  fieldSetting,
} from "metabase/visualizations/lib/settings/utils";
import { globalColors } from "metabase/visualizations/lib/colors";
import VizControls from "metabase/visualizations/hoc/VizControls";

@VizControls
export default class Circle extends Component {
  constructor(props) {
    super(props);
    this.data = this.getData();
    this.oneI = null;
    this.twoI = null;
    this.threeI = null;
    this.fourI = null;
    this.id = React.createRef();
  }

  static uiName = t`Circle`;
  static identifier = "circle";
  static iconName = "circle";

  static isSensible = () => true;

  static checkPermisson = () => true;

  static settings = {
    ...columnSettings({ hidden: true }),
    ...dimensionSetting("circle.one", {
      section: t`Data`,
      title: t`First Level`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...dimensionSetting("circle.two", {
      section: t`Data`,
      title: t`Second Level`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...dimensionSetting("circle.three", {
      section: t`Data`,
      title: t`Third Level`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...fieldSetting("circle.four", {
      section: t`Data`,
      title: t`Numerical Value`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    "circle.fontSize": {
      section: t`Display`,
      title: t`Font Size`,
      widget: "number",
      default: 14,
    },
    "circle.color": {
      section: t`Display`,
      title: t`Color`,
      widget: "color",
      colors: globalColors(),
      default: color("brand"),
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
    const { settings } = this.props;
    if (
      !settings["circle.one"] ||
      !settings["circle.two"] ||
      !settings["circle.four"]
    ) {
      return;
    }

    const seriesData = this.data;
    const maxDepth = 4;

    let displayRoot = stratify();

    function stratify() {
      return d3
        .stratify()
        .parentId(function(d) {
          return d.id.substring(0, d.id.lastIndexOf("."));
        })(seriesData)
        .sum(function(d) {
          return d.value || 0;
        })
        .sort(function(a, b) {
          return b.value - a.value;
        });
    }

    function overallLayout(params, api) {
      const context = params.context;
      d3
        .pack()
        .size([api.getWidth() - 2, api.getHeight() - 2])
        .padding(3)(displayRoot);

      context.nodes = {};
      displayRoot.descendants().forEach(function(node, index) {
        context.nodes[node.id] = node;
      });
    }

    function renderItem(params, api) {
      const context = params.context;

      // Only do that layout once in each time `setOption` called.
      if (!context.layout) {
        context.layout = true;
        overallLayout(params, api);
      }

      const nodePath = api.value("id");
      const node = context.nodes[nodePath];

      if (!node) {
        // Reder nothing.
        return;
      }

      const isLeaf = !node.children || !node.children.length;

      const focus = new Uint32Array(
        node.descendants().map(function(node) {
          return node.data.index;
        }),
      );

      const currentDepth = Math.min(
        ...Object.values(context.nodes).map(item => item.depth),
      );
      const maxDepth = Math.max(
        ...Object.values(context.nodes).map(item => item.depth),
      );
      const showNodeName =
        currentDepth === node.depth - 1 ||
        (currentDepth === node.depth && isLeaf);

      const nodeName = showNodeName
        ? nodePath
            .slice(nodePath.lastIndexOf(".") + 1)
            .split(/(?=[A-Z][^A-Z])/g)
            .join("\n")
        : "";

      let z2 = api.value("depth") * 4;
      if (currentDepth === node.depth - 1) {
        z2 = maxDepth * 4 - 1;
      }
      if (isLeaf) {
        z2 = maxDepth * 4 - 2;
      }

      return {
        type: "circle",
        focus: focus,
        shape: {
          cx: node.x,
          cy: node.y,
          r: node.r,
        },
        transition: ["shape"],
        z2: z2,
        textContent: {
          type: "text",
          style: {
            text: nodeName,
            fontFamily: "Arial",
            width: node.r * 1.3,
            overflow: "truncate",
            fontSize: (node.r / 50) * settings["circle.fontSize"],
          },
          emphasis: {
            style: {
              overflow: null,
              fontSize: (node.r / 50) * settings["circle.fontSize"],
            },
          },
        },
        textConfig: {
          position: "inside",
        },
        style: {
          fill: api.visual("color"),
        },
        emphasis: {
          style: {
            fontFamily: "Arial",
            fontSize: 12,
            shadowBlur: 20,
            shadowOffsetX: 3,
            shadowOffsetY: 5,
            shadowColor: "rgba(0,0,0,0.3)",
          },
        },
      };
    }

    const option = {
      dataset: {
        source: seriesData,
      },
      tooltip: {
        confine: true,
      },
      visualMap: {
        show: false,
        min: 0,
        max: maxDepth,
        dimension: "depth",
        inRange: {
          color: [settings["circle.color"], "#e0ffff"],
        },
      },
      hoverLayerThreshold: Infinity,
      series: {
        type: "custom",
        renderItem: renderItem,
        progressive: 0,
        coordinateSystem: "none",
        encode: {
          tooltip: "value",
          itemName: "id",
        },
      },
    };

    const myChart = this.chart;
    let currentNodeId = undefined;

    myChart.on("click", { seriesIndex: 0 }, params => {
      drillDown(params.data.id);
    });

    const drillDown = targetNodeId => {
      currentNodeId = targetNodeId;
      displayRoot = stratify();
      if (targetNodeId != null) {
        displayRoot = displayRoot.descendants().find(node => {
          return node.data.id === targetNodeId;
        });
      }
      // A trick to prevent d3-hierarchy from visiting parents in this algorithm.
      if (displayRoot) {
        displayRoot.parent = null;
      }

      myChart.setOption({
        dataset: {
          source: seriesData,
        },
      });
      myChart.dispatchAction({ type: "hideTip" });
      myChart.dispatchAction({ type: "highlight" });
      myChart.dispatchAction({ type: "downplay" });
    };

    myChart.getZr().on("click", event => {
      if (!event.target) {
        if (currentNodeId && currentNodeId.lastIndexOf(".") > 0) {
          drillDown(currentNodeId.slice(0, currentNodeId.lastIndexOf(".")));
        } else {
          drillDown();
        }
      }
    });

    this.chart.setOption(option);
  }, 500);

  getData() {
    const { settings } = this.props;
    if (
      !settings["circle.one"] ||
      !settings["circle.two"] ||
      !settings["circle.four"]
    ) {
      return;
    }
    const { cols, rows } = this.props.data;
    this.oneI = cols.findIndex(item => item.name === settings["circle.one"]);
    this.twoI = cols.findIndex(item => item.name === settings["circle.two"]);
    this.threeI = cols.findIndex(
      item => item.name === settings["circle.three"],
    );
    this.fourI = cols.findIndex(item => item.name === settings["circle.four"]);

    const res = [];
    res.push({ id: "data", value: undefined, depth: 0, index: 0 });

    const oneGroup = _.groupBy(rows, this.oneI);
    Object.keys(oneGroup).forEach(key => {
      const list = oneGroup[key];
      const value = sumBy(list, this.fourI);
      const oneId = `data.${key.replace(".", "_")}`;
      res.push({
        id: oneId,
        value: this.formatData(value),
        depth: 1,
      });

      const twoGroup = _.groupBy(list, this.twoI);
      Object.keys(twoGroup).forEach(twoKey => {
        const list = twoGroup[twoKey];
        const value = sumBy(list, this.fourI);
        const twoId = `${oneId}.${this.formatId(twoKey)}`;
        res.push({
          id: twoId,
          value: this.formatData(value),
          depth: 2,
        });

        if (this.threeI > 0) {
          const threeGroup = _.groupBy(list, this.threeI);
          Object.keys(threeGroup).forEach(threeKey => {
            const list = threeGroup[threeKey];
            const value = sumBy(list, this.fourI);
            const threeId = `${twoId}.${this.formatId(threeKey)}`;
            res.push({
              id: threeId,
              value: this.formatData(value),
              depth: 3,
            });
          });
        }
      });
    });
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
