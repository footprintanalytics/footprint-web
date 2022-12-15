/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { Space } from "antd";
import Logo from "./Logo";
import User from "./User";
import { StateProvider, StateContext } from "./StateProvider";
import Meta from "metabase/components/Meta";
import { getOssUrl } from "metabase/lib/image";
import "../css/index.css";

const Layout = props => {
  return (
    <StateProvider>
      <LayoutView {...props} />
    </StateProvider>
  );
};

const LayoutView = props => {
  const { isOpenSubMenu } = useContext(StateContext);

  return (
    <>
      <Meta
        title="Footprint Enterprise"
        description="Providing actionable data insight about TVL growth, user activity and retention monitoring on multiple chains. Covering Ethereum, Binance, Polygon, Fantom, Avalanche and Arbitrium."
        image={getOssUrl("202205121523524.jpg")}
        imageWidth={1200}
        imageHeight={630}
        siteName="Footprint Enterprise"
      />
      <div
        className={`defi-layout ${
          isOpenSubMenu ? "" : "defi-layout--hide-sub-menu"
        }`}
      >
        <div className="defi-layout__header">
          <div className="defi-layout__header-left">
            <Logo />
            {props.leftHeader}
          </div>
          <div className="defi-layout__header-right">
            <Space>
              {props.rightHeader}
              <User {...props} />
            </Space>
          </div>
        </div>
        <div className="defi-layout__content">{props.children}</div>
      </div>
    </>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(Layout);
