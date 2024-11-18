/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { cancelSubscription } from "metabase/new-service";

export function showCancelAutoRenewal({ modal = Modal, productId, title, onSuccess}) { //"Do you want to cancel automatic renewal?"
  // const [loading, setLoading] = useState(false);
  modal.confirm({
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
