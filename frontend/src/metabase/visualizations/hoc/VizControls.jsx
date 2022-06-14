/* eslint-disable react/prop-types */
import React, { Component } from "react";
import hoistNonReactStatic from "hoist-non-react-statics";
import {
  isSameParam,
  isSameSeries,
  isSameSize,
} from "metabase/visualizations/lib/utils";

const createComponent = ComposedComponent => {
  class EnhancedComponent extends Component {
    shouldComponentUpdate(nextProps) {
      const sameSize = isSameSize(
        this.props.width,
        nextProps.width,
        this.props.height,
        nextProps.height,
      );
      const sameSeries = isSameSeries(this.props.series, nextProps.series);
      this.shouldClearChart = !sameSeries;
      const isSameParams = isSameParam(this.props, nextProps, ["hovered"]);
      return !(sameSize && sameSeries && isSameParams);
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          shouldClearChart={this.shouldClearChart}
        />
      );
    }
  }

  hoistNonReactStatic(EnhancedComponent, ComposedComponent);
  return EnhancedComponent;
};

export default (ComposedComponent: React.Class) =>
  createComponent(ComposedComponent);
