/* eslint-disable curly */
/* eslint-disable react/prop-types */
import "./index.css";
import React, { useState } from "react";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";
import { Skeleton } from "antd";
import PricingModal from "metabase/pricing_v2/components/PricingModal";
import PricingCompare from "metabase/pricing_v2/components/PricingCompare";
import PricingSelect from "metabase/pricing_v2/components/PricingSelect";
import { useGetPaymentSubscriptionDetail, useGetProductInfo } from "metabase/pricing_v2/use";
import PaymentCallbackModal from "metabase/pricing/compoment/PaymentCallbackModal";

const Pricing = ({ user, setLoginModalShow, onCancelSubscription }) => {
  const [visible, setVisible] = useState();
  const [callback, setCallback] = useState(false);

  const { isLoading, data } = useGetProductInfo();
  const { subscriptionDetailData } = useGetPaymentSubscriptionDetail(user, "footprint");

  const products = data?.groups?.find(item => item.type === visible)?.products;

  const sign = () => setLoginModalShow({ show: true, from: "handle_pay" });

  if (isLoading) {
    return (
      <div className="Pricing" style={{ width: 1200 }}>
        <Skeleton active />
      </div>
    );
  }

  return (
    <div className="Pricing">
      <div className="Pricing__title">
        {/*<h1>Plans & Pricing</h1>*/}
        {/*<p>*/}
        {/*  Footprint is a one-stop analysis platform to visualize your discovery*/}
        {/*  in blockchain data.*/}
        {/*</p>*/}
      </div>
      {products && products.length > 0 && (
        <PricingModal
          user={user}
          sign={sign}
          subscribeOptions={data?.groups?.find(item => item.type === visible)?.products}
          visible={!!visible}
          setCallback={setCallback}
          onClose={() => setVisible(null)}
        />
      )}
      <PaymentCallbackModal open={callback} onClose={() => setCallback(false)} />
      {data?.groups && (
        <>
          <PricingSelect
            user={user}
            subscriptionDetailList={subscriptionDetailData?.list}
            groups={data?.groups}
            onSign={sign}
            onSubscribe={(item) => {
              setVisible(item.value)
            }}
            onCancelSubscription={onCancelSubscription}
          />
          <PricingCompare
            user={user}
            subscriptionDetailList={subscriptionDetailData?.list}
            groups={data?.groups}
          />
        </>
      )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Pricing);
