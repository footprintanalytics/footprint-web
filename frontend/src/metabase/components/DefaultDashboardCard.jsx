/* eslint-disable react/prop-types */

import React from "react";
import "./DefaultDashboardCard.css";
import { getOssUrl } from "metabase/lib/image";
import { Button } from "antd";
import { createModalShowAction } from "metabase/redux/control";
import connect from "react-redux/lib/connect/connect";
import { trackStructEvent } from "metabase/lib/analytics";

const DefaultDashboardCard = ({ height, setCreateModalShow }) => {
  return (
    <div className="default-dashboard-card__empty" style={{ height }}>
      <div
        className="default-dashboard-card__default-thumb"
        style={{
          backgroundImage: `url(${getOssUrl("default_thumb.png")})`,
        }}
      />
      <div className={"default-dashboard-card__empty-text"}>
        <Button
          type="primary"
          onClick={() => {
            setCreateModalShow({ show: true });
            trackStructEvent("Empty Detail", "Create Dashboard");
          }}
        >
          Create Dashboard
        </Button>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  setCreateModalShow: createModalShowAction,
};

export default connect(null, mapDispatchToProps)(DefaultDashboardCard);
