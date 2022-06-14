/* eslint-disable no-color-literals */
/* eslint-disable react/prop-types */
import React, { Component } from "react";

import { connect } from "react-redux";
import { PLUGIN_SELECTORS } from "metabase/plugins";
import { getOssUrl } from "metabase/lib/image";

const mapStateToProps = (state, props) => ({
  showAuthScene: PLUGIN_SELECTORS.getShowAuthScene(state, props),
});

class AuthScene extends Component {
  render() {
    if (!this.props.showAuthScene) {
      return null;
    }

    return (
      <section
        className="absolute top bottom left right"
        style={{ marginTop: "-1px", marginLeft: "-1px", background: "#7645FA" }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            objectFit: "fill",
            background: "url('/app/img/img_login_bg.png') repeat",
          }}
        />

        <img
          src={getOssUrl("img_login_tag_12.png")}
          className="absolute left bottom"
        />
        <img
          src={getOssUrl("img_login_tag_21.png")}
          className="absolute right top"
        />

        <img
          src={getOssUrl("img_login_tag_11.png")}
          className="absolute left top"
        />
        <img
          src={getOssUrl("img_login_tag_22.png")}
          className="absolute right bottom"
        />
      </section>
    );
  }
}

export default connect(mapStateToProps)(AuthScene);
