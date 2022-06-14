/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import _ from "underscore";

import ExplicitSize from "metabase/components/ExplicitSize";
import * as MetabaseAnalytics from "metabase/lib/analytics";
import { startTimer } from "metabase/lib/performance";

import { isSameSeries, isSameSize } from "metabase/visualizations/lib/utils";

import type { VisualizationProps } from "metabase-types/types/Visualization";

type DeregisterFunction = () => void;

type Props = VisualizationProps & {
  renderer: (element: Element, props: VisualizationProps) => DeregisterFunction,
  style?: any,
};

// We track this as part of the render loop.
// It's throttled to prevent pounding GA on every prop update.
const trackEventThrottled = _.throttle(
  MetabaseAnalytics.trackStructEvent,
  10000,
);

@ExplicitSize({ wrapped: true })
export default class CardRenderer extends Component {
  props: Props;

  static propTypes = {
    className: PropTypes.string,
    series: PropTypes.array.isRequired,
    renderer: PropTypes.func.isRequired,
    onRenderError: PropTypes.func.isRequired,
    isEditing: PropTypes.bool,
    isDashboard: PropTypes.bool,
  };

  _deregister: ?DeregisterFunction;

  shouldComponentUpdate(nextProps: Props) {
    // a chart only needs re-rendering when the result itself changes OR the chart type is different
    const sameSize = isSameSize(
      this.props.width,
      nextProps.width,
      this.props.height,
      nextProps.height,
    );
    const sameSeries = isSameSeries(this.props.series, nextProps.series);
    return !(sameSize && sameSeries);
  }

  initView() {
    // create a loading element
    this.loading = this.createLoading();

    // create a hidden loading text element
    this.hiddenLoadingText = this.createHiddenLoadingText();
  }

  componentDidMount() {
    this.initView();
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  componentWillUnmount() {
    this._deregisterChart();
  }

  _deregisterChart() {
    if (this._deregister) {
      // Prevents memory leak
      this._deregister();
      delete this._deregister;
    }
  }

  showRenderLoading() {
    return (
      this.props.series &&
      this.props.series.map(item => item.data.rows).flat().length > 2000
    );
  }

  showErrorPanel(parent, err) {
    const errorDiv = this.createDiv();
    errorDiv.appendChild(document.createTextNode(err));
    parent.appendChild(errorDiv);
  }

  createDiv() {
    const div = document.createElement("div");
    div.style.cssText =
      "display: flex;justify-content: center;align-items: center;height: 100%;font-size: 20px;white-space: pre-line;color: #888888";
    return div;
  }

  createLoading() {
    let loading = null;
    if (this.showRenderLoading()) {
      loading = this.createDiv();
      loading.appendChild(
        document.createTextNode("The chart is being rendered, please wait."),
      );
    }
    return loading;
  }

  createHiddenLoadingText() {
    const hiddenLoading = document.createElement("div");
    hiddenLoading.className = "waiting-rendered-div";
    hiddenLoading.style.cssText = "display: none;";
    return hiddenLoading;
  }

  renderChart = _.debounce(() => {
    const { width, height, isDashboard, isEditing, isSettings } = this.props;
    if (width == null || height == null) {
      return;
    }
    const loading = this.loading;
    const hiddenLoadingText = this.hiddenLoadingText;

    const parent = ReactDOM.findDOMNode(this);

    // deregister previous chart:
    this._deregisterChart();

    // reset the DOM:
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }

    // create a new container element
    const element = document.createElement("div");
    parent.appendChild(element);

    if (isDashboard && isEditing && !isSettings) {
      // If this card is a dashboard that's currently being edited, we cover the
      // content to prevent interaction with the chart. The !isSettings
      // exception is to handle modals that appear above a dashboard.
      const mouseBlocker = document.createElement("div");
      mouseBlocker.classList.add("spread");
      mouseBlocker.style.setProperty("pointer-events", "all");
      parent.appendChild(mouseBlocker);
    }

    try {
      const t = startTimer();
      loading && parent.appendChild(loading);
      hiddenLoadingText && parent.appendChild(hiddenLoadingText);
      setTimeout(() => {
        try {
          this._deregister = this.props.renderer(element, this.props);
        } catch (err) {
          this.showErrorPanel(parent, err.toString().replace("Error: ", ""));
          console.error(err);
        }
        loading && parent.removeChild(loading);
        hiddenLoadingText && parent.removeChild(hiddenLoadingText);
      }, 100);
      t(duration => {
        const { display } = this.props.card;
        trackEventThrottled("Visualization", "Render Card", display, duration);
      });
    } catch (err) {
      console.error(err);
      this.props.onRenderError(err.message || err);
    }
  }, 500);

  render() {
    return <div className={this.props.className} style={this.props.style} />;
  }
}
