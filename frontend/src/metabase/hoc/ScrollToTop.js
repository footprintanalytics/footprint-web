/* eslint-disable react/prop-types */
import React from "react";
import { withRouter } from "react-router";
import { isScrollWhiteList } from "metabase/hoc/utils";

class ScrollToTopInner extends React.Component {
  componentDidUpdate(prevProps) {
    // Compare location.pathame to see if we're on a different URL. Do this to ensure
    // that query strings don't cause a scroll to the top
    if (this.props.location.pathname !== prevProps.location.pathname) {
      if (isScrollWhiteList(this.props.location.pathname)) {
        document?.getElementById('app-content')?.scrollTo(0, 0);
      }
      window.scrollTo(0, 0);
    }
  }
  render() {
    return this.props.children;
  }
}

const ScrollToTop = withRouter(ScrollToTopInner);

export default ScrollToTop;
