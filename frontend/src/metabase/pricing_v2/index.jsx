/* eslint-disable curly */
/* eslint-disable react/prop-types */
import "./index.css";
import React, { useState } from "react";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";
import { Modal, Skeleton } from "antd";
import { cancelSubscription } from "metabase/new-service";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { slack } from "metabase/lib/slack";
import PricingModal from "metabase/pricing_v2/components/PricingModal";
import PricingCompare from "metabase/pricing_v2/components/PricingCompare";
import PricingSelect from "metabase/pricing_v2/components/PricingSelect";
import { useGetProductInfo } from "metabase/pricing_v2/use";

const Pricing = ({ user, setLoginModalShow }) => {
  const [visible, setVisible] = useState();
  const [loading, setLoading] = useState(false);

  const { isLoading, data } = useGetProductInfo();

  const products = data?.groups?.find(item => item.type === visible)?.products;

  const sign = () => setLoginModalShow({ show: true, from: "handle_pay" });

  const onCancelSubscription = async () => {
    Modal.confirm({
      title: "Do you want to cancel automatic renewal?",
      icon: <ExclamationCircleOutlined />,
      confirmLoading: loading,
      onOk: async () => {
        setLoading(true);
        await cancelSubscription();
        setLoading(false);
        slack([{ label: "Cancel Subscription", value: user?.email }]);
        location.reload();
      },
      onCancel: () => {},
    });
  };

  if (isLoading) {
    return (
      <div className="Pricing">
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
          onClose={() => setVisible(null)}
        />
      )}
      {data?.groups && (
        <>
          <PricingSelect
            user={user}
            groups={data?.groups}
            onSign={sign}
            onSubscribe={(item) => {
              setVisible(item.value)
            }}
            onCancelSubscription={onCancelSubscription}
          />
          <PricingCompare
            user={user}
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
