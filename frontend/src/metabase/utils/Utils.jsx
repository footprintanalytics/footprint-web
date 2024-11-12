/* eslint-disable react-hooks/rules-of-hooks */
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { cancelSubscription } from "metabase/new-service";
import React, {useState} from "react";

export function showCancelAutoRenewal({ productId, title, onSuccess}) { //"Do you want to cancel automatic renewal?"
  // const [loading, setLoading] = useState(false);
  Modal.confirm({
    title: title,
    icon: <ExclamationCircleOutlined />,
    // confirmLoading: loading,
    onOk: async () => {
      // setLoading(true);
      await cancelSubscription({ productId });
      // setLoading(false);
      // slack([{ label: "Cancel Subscription", value: user?.email }]);
      onSuccess?.();
    },
    onCancel: () => {},
  });
}
