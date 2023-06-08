/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";

import PublicNotFound from "metabase/public/components/PublicNotFound";
import PublicError from "metabase/public/components/PublicError";
import cx from "classnames";
import getThemeConfig from "metabase/theme-helper";
import { ConfigProvider } from "antd";
import { isDark } from "../../../../../resources/frontend_client/app/dist/public_components_widgets_EmbedModalContent_jsx.bundle.91ad8b8ea199aef7b63a";

const mapStateToProps = (state, props) => ({
  errorPage: state.app.errorPage,
});

class PublicApp extends Component {
  render() {
    const { children, errorPage } = this.props;
    if (errorPage) {
      if (errorPage.status === 404) {
        return <PublicNotFound />;
      } else {
        return <PublicError />;
      }
    } else {
      return (
        <ConfigProvider theme={getThemeConfig()}>
          <div className={cx({ "dark": isDark() })}>
            {children}
          </div>
        </ConfigProvider>
      );
    }
  }
}

export default connect(mapStateToProps)(PublicApp);
