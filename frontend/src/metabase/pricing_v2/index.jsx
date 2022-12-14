/* eslint-disable curly */
/* eslint-disable react/prop-types */
import "./index.css";
import React, { useState } from "react";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";
import { getSubscribeOptions } from "./config";
import { Modal } from "antd";
import { cancelSubscription } from "metabase/new-service";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { slack } from "metabase/lib/slack";
import PricingModal from "metabase/pricing_v2/components/PricingModal";
import PricingCompare from "metabase/pricing_v2/components/PricingCompare";
import PricingSelect from "metabase/pricing_v2/components/PricingSelect";

const Pricing = ({ user, setLoginModalShow }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="Pricing">
      <div className="Pricing__title">
        {/*<h1>Plans & Pricing</h1>*/}
        {/*<p>*/}
        {/*  Footprint is a one-stop analysis platform to visualize your discovery*/}
        {/*  in blockchain data.*/}
        {/*</p>*/}
      </div>
      <PricingModal
        user={user}
        sign={sign}
        subscribeOptions={getSubscribeOptions(user)}
        visible={visible}
        onClose={() => setVisible(false)}
      />
      <PricingSelect
        user={user}
        onSign={sign}
        onSubscribe={() => setVisible(true)}
        onCancelSubscription={onCancelSubscription}
      />
      <PricingCompare />
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
