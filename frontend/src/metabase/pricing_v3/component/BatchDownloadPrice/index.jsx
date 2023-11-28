/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import Button from "metabase/core/components/Button/Button";
import { loginModalShowAction } from "metabase/redux/control";
import CalPrice from "metabase/pricing_v3/component/BatchDownloadPrice/CalPrice";
import PriceTable from "metabase/pricing_v3/component/BatchDownloadPrice/PriceTable";
import Link from "metabase/core/components/Link";
import "./index.css";

const BatchDownloadPrice = ({ user, setLoginModalShow, onCancelSubscription }) => {

  return (
    <div className="Pricing flex flex-column align-center">
      <div style={{ marginTop: 40 }}/>
      <CalPrice />

      <div style={{ marginTop: 80 }}/>
      <PriceTable />

      <div className="flex align-center justify-between" style={{ height: 300, width: 1200 }}>
        <div className="flex flex-col" style={{ gap: 20 }}>
          <h2 style={{ fontSize: 24, color: "#303440" }}>Can not find the chain or data you are looking for?</h2>
          <span style={{ fontSize: 16, color: "#303440" }}>Get started with Footprint Analytics Enterprise and experience the benefits of<br/>reliable, flexible, and cost-effective multi-chain scaling.</span>
        </div>
        <div className="flex flex-col align-center justify-center" style={{ gap: 10, paddingRight: 20 }}>
          <Link target="_blank" href="mailto:sales@footprint.network">
            <Button primary>{`Speak with a solutions architect >`}</Button>
          </Link>
          <Link to="/batch-download">
            <Button borderless style={{color: "#3434b2"}}>{`Learn more about Batch Download >`}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(BatchDownloadPrice);
