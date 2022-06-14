/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "./LoginModalSlider.css";
import { staticBucketUrl } from "metabase/env";

const LoginModalSlider = props => {
  const [project, setProject] = useState();
  useEffect(() => {
    if (props.project) {
      setProject(props.project);
    }
  }, [props.project]);
  return (
    <div
      className="login-modal-slider"
      style={{
        backgroundImage:
          project === "defi360"
            ? `
        url("${staticBucketUrl}/img_login_logo_defi.png"),
        url("${staticBucketUrl}/img_login_double1.png"),
        url("${staticBucketUrl}/img_login_double2.png"),
        url("${staticBucketUrl}/img_login_bg_v3.png")
      `
            : `
      url("${staticBucketUrl}/img_login_logo_v3.png"),
      url("${staticBucketUrl}/img_login_double1.png"),
      url("${staticBucketUrl}/img_login_double2.png"),
      url("${staticBucketUrl}/img_login_bg_v3.png")
    `,
      }}
    >
      <div className="login-modal-slider__slogan">
        {project === "defi360"
          ? "Google Analytics For DeFi"
          : "Footprint is an analysis platform to discover and visualize blockchain data."}
      </div>
    </div>
  );
};

export default React.memo(LoginModalSlider);
