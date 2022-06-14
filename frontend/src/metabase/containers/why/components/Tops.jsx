/* eslint-disable react/prop-types */

import React from "react";
import Button from "metabase/components/Button";
import { getOssUrl } from "metabase/lib/image";
import { getUser } from "metabase/selectors/user";
import connect from "react-redux/lib/connect/connect";
import { loginModalShowAction } from "metabase/redux/control";
import { staticBucketUrl } from "metabase/env";

const Tops = ({ user, setLoginModalShow }) => {
  return (
    <div
      className="tops tops__bg"
      style={{
        backgroundImage: `
          url("${staticBucketUrl}/img-why-top-bg-1.png"),
          url("${staticBucketUrl}/img-why-top-bg-2.png"),
          url("${staticBucketUrl}/img-why-top-bg-3.png"),
          url("${staticBucketUrl}/img-why-top-bg-4.png")
        `,
      }}
    >
      <div className="flex flex-row justify-center align-center p2">
        <div className="flex flex-column justify-center ">
          <h3 className=" footprint-title2">DEFI AND NFT ANALYTICS</h3>
          <h1
            className=" footprint-title1 footprint-mt-s"
            style={{ fontSize: "24px" }}
          >
            Footprint is an analysis platform to <br />
            discover and visualize blockchain data.
          </h1>
          <div className=" footprint-title2 tops__operate-data">
            3000+ Dashboards, 11000+ Charts, 35000+ Tags
          </div>
          {!user && (
            <Button
              className="tops__button"
              onClick={() => {
                setLoginModalShow({ show: true, from: "about us" });
              }}
            >
              Start a free trial {"->"}
            </Button>
          )}
        </div>
        <div>
          <img
            style={{ width: "100%", height: "auto" }}
            src={getOssUrl("img_why_top_center.png")}
            alt="Footprint analytics"
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state, props),
  };
};

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tops);
