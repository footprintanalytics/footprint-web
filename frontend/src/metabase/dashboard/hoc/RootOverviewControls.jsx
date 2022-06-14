/* eslint-disable react/prop-types */
import React, { Component } from "react";
import hoistNonReactStatic from "hoist-non-react-statics";

const createComponent = ComposedComponent => {
  class EnhancedComponent extends Component {
    componentDidMount() {
      this.bodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    componentWillUnmount() {
      document.body.style.overflow = this.bodyOverflow;
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  hoistNonReactStatic(EnhancedComponent, ComposedComponent);
  return EnhancedComponent;
};

export default (ComposedComponent: React.Class) =>
  createComponent(ComposedComponent);
