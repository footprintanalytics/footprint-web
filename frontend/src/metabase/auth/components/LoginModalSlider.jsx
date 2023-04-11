/* eslint-disable react/prop-types */
import React from "react";
import "./LoginModalSlider.css";
import { staticBucketUrl } from "metabase/env";
import { isDark } from "metabase/dashboard/components/utils/dark";

const LoginModalSlider = () => {
  return (
    <div
      className="login-modal-slider"
    >
      <div className="login-modal-slider__slogan">
        {"Footprint is an analysis platform to discover and visualize blockchain data."}
      </div>
    </div>
  );
};

export default React.memo(LoginModalSlider);
