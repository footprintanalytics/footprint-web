/* eslint-disable react/prop-types */
import React, { Component } from "react";
import hoistNonReactStatic from "hoist-non-react-statics";
import Meta from "metabase/components/Meta";

const createComponent = ComposedComponent => {
  class EnhancedComponent extends Component {
    render() {
      return (
        <React.Fragment>
          <Meta viewport={1} />
          <ComposedComponent {...this.props} />
        </React.Fragment>
      );
    }
  }

  hoistNonReactStatic(EnhancedComponent, ComposedComponent);
  return EnhancedComponent;
};

export default ComposedComponent => createComponent(ComposedComponent);
