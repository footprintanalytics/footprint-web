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
import { useGetProductInfo } from "metabase/pricing_v2/use";

const AccountInfo = props => {
  const { user, loadCurrentUserVipFGA } = props;
  const [fgaFlowPricingCallBackOpen, setFgaFlowPricingCallBackOpen] = useState(false);
  const [fgaFlowPricingOpen, setFgaFlowPricingOpen] = useState(false);
  console.log("fgaFlowPricingOpen", fgaFlowPricingOpen)
  const renderPaymentCallbackModal = () => {
    return (
      <PaymentCallbackModal
        open={fgaFlowPricingCallBackOpen}
        isModal={true}
        onCompletedClick={async () => {
          setFgaFlowPricingCallBackOpen(false)
          message.success("Payment success")
          loadCurrentUserVipFGA()
        }}
      />
    )
  }

  const renderFgaPriceModal = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isLoading, data } = useGetProductInfo("fga");
    const type = fgaFlowPricingOpen
    const fgaPaymentProducts = data?.filter((item) => item.productType === type) || []
    return (
      <PricingModal
        isModal={true}
        visible={fgaFlowPricingOpen}
        showTitle={true}
        user={user}
        subscribeOptions={fgaPaymentProducts}
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
            <h2>Email: {user.email}</h2>
          </div>
          <FgaVipInfoLayout upgradeOnclick={(type) => setFgaFlowPricingOpen(type)}/>
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
