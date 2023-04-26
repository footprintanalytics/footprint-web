/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { t } from "ttag";
import _ from "underscore";
import { columnSettings } from "metabase/visualizations/lib/settings/column";
import { dimensionSetting, fieldSetting } from "metabase/visualizations/lib/settings/utils";
import VizControls from "metabase/visualizations/hoc/VizControls";
import { union } from "lodash";
import DFS from "metabase/visualizations/lib/dfs";
import { ChartSettingsError } from "metabase/visualizations/lib/errors";

class Sankey extends Component {
  constructor(props) {
    super(props);
    this.data = this.getData();
    this.id = React.createRef();
  }

  static uiName = t`Sankey`;
  static identifier = "sankey";
  static iconName = "sankey";

  static isSensible = () => true;

  static checkPermisson = () => true;

  static checkRenderable(series, settings) {
    const [
      {
        data: { cols, rows },
      },
    ] = series;
    if (
      !settings["sankey.source"] ||
      !settings["sankey.target"] ||
      !settings["sankey.value"]
    ) {
      throw new ChartSettingsError(
        t`Which fields do you want to use?`,
        { section: t`Data` },
        t`Choose fields`,
      );
    }
    const sourceInx = cols.findIndex(item => item.name === settings["sankey.source"]);
    const targetInx = cols.findIndex(item => item.name === settings["sankey.target"]);
    const links = rows.map(row => {
      return {
        source: row[sourceInx],
        target: row[targetInx],
      }
    })
    const dfs = new DFS();
    const loop = dfs.isLoop(links);
    if (loop) {
      throw new ChartSettingsError(
        "The selected data forms a loop and cannot generate a Sankey visualization, please reselect the data.",
      );
    }
  }

  static settings = {
    ...columnSettings({ hidden: true }),
    ...dimensionSetting("sankey.source", {
      section: t`Data`,
      title: t`Source`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...dimensionSetting("sankey.target", {
      section: t`Data`,
      title: t`Target`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
    ...fieldSetting("sankey.value", {
      section: t`Data`,
      title: t`Value`,
      dashboard: false,
      useRawSeries: true,
      showColumnSetting: true,
    }),
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
    const option = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'sankey',
          data: this.data.data,
          links: this.data.links,
        }
      ]
    };

    this.chart.setOption(option);
  }, 500);

  getData() {
    const { settings, data: { cols, rows } } = this.props;

    const sourceInx = cols.findIndex(item => item.name === settings["sankey.source"]);
    const targetInx = cols.findIndex(item => item.name === settings["sankey.target"]);
    const valueInx = cols.findIndex(item => item.name === settings["sankey.value"]);
    const source = rows.map(row => row[sourceInx]);
    const target = rows.map(row => row[targetInx]);
    const data = union(source, target).map(value => { return { "name": value } });
    const links = rows.map(row => {
      return {
        source: row[sourceInx],
        target: row[targetInx],
        value: row[valueInx],
      }
    })
    const dfs = new DFS();
    const loop = dfs.isLoop(links);
    return { data, links, loop };
  }

  render() {
    return <div ref={this.id} style={{ width: "100%", height: "100%" }} />;
  }
}

export default VizControls(Sankey)
