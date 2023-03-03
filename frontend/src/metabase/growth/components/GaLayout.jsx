/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { getOssUrl } from "metabase/lib/image";
import Meta from "metabase/components/Meta";
import { StateProvider, StateContext } from "./StateProvider";
import "../css/index.css";

const GaLayout = props => {
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
        title="Footprint Growth Analytics"
        description="Unlock your growth potential in a Web3 world"
        image={getOssUrl("20230303142500.jpg")}
        imageWidth={1200}
        imageHeight={630}
        siteName="Footprint Growth Analytics"
      />
      <div
        className={`ga-layout h-full ${
          isOpenSubMenu ? "" : "ga-layout--hide-sub-menu"
        }`}
      >
        <div className="ga-layout__content  h-full">{props.children}</div>
      </div>
    </>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(GaLayout);
