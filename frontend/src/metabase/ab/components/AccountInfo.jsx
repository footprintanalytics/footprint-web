/* eslint-disable react/prop-types */
import React, { useState } from "react";
// import Link from "antd/lib/typography/Link";
import { connect } from "react-redux";
import { getFgaProject, getUser } from "metabase/selectors/user";
import "../css/index.css";
import FgaVipInfoLayout from "metabase/ab/components/FgaVipInfoLayout";
import Title from "antd/lib/typography/Title";
import { Card, message } from "antd";
import PaymentCallbackModal from "metabase/pricing/compoment/PaymentCallbackModal";
import PricingModal from "metabase/pricing_v2/components/PricingModal";
import { FgaProductMock } from "metabase/ab/utils/data";
import { loadCurrentUserVipFGA } from "metabase/redux/user";

const AccountInfo = props => {
  const { user, loadCurrentUserVipFGA } = props;
  const [fgaFlowPricingCallBackOpen, setFgaFlowPricingCallBackOpen] = useState(false);
  const [fgaFlowPricingOpen, setFgaFlowPricingOpen] = useState(false);
  const renderPaymentCallbackModal = () => {
    return (
      <PaymentCallbackModal
        open={fgaFlowPricingCallBackOpen}
        isModal={true}
        onCompletedClick={async () => {
          // here mock the result
          window.localStorage.setItem("FGAVipInfo", JSON.stringify({
            "level": 2,
            "type": "advanced",
            "validEndDate": "2024-11-22T07:46:40.901Z"
          }))
          setFgaFlowPricingCallBackOpen(false)
          message.success("Payment success")
          loadCurrentUserVipFGA()
        }}
      />
    )
  }

  const renderFgaPriceModal = () => {
    return (
      <PricingModal
        isModal={true}
        visible={fgaFlowPricingOpen}
        showTitle={true}
        user={user}
        subscribeOptions={FgaProductMock.filter((item) => item.type === "advanced")}
        onClose={() => {setFgaFlowPricingOpen(false)}}
        setCallback={(result) => {
          setFgaFlowPricingCallBackOpen(true)
          setFgaFlowPricingOpen(false)
        }}
      />
    )
  }
  return (
    <div className="flex flex-col w-full items-center">
      <div
        className=" flex flex-column items-center"
        style={{
          width: 800,
          // backgroundColor: "white",
          borderRadius: 10,
          padding: 20,
          marginTop: 20,
          minHeight: 800,
        }}
      >
        <div className=" flex flex-row justify-between w-full mb2" >
          <Title width={"100%"} level={4} style={{ marginBottom: 0 }}>
            Account Info
          </Title>
        </div>
        <Card
          style={{
            width: "100%",
            minHeight: 600,
            margin: 20,
            borderRadius: 10,
          }}
        >
          <div className={""}>
            <h2>Name: {user.name}</h2>
          </div>
          <FgaVipInfoLayout upgradeOnclick={() => setFgaFlowPricingOpen(true)}/>
        </Card>
      </div>
      {renderFgaPriceModal()}
      {renderPaymentCallbackModal()}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
    project: getFgaProject(state),
  };
};

const mapDispatchToProps = {
  loadCurrentUserVipFGA,
};
export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);
