/* eslint-disable react/prop-types */
import React, { useState } from "react";
import PricingModal from "metabase/pricing_v2/components/PricingModal";
import PaymentCallbackModal from "metabase/pricing/compoment/PaymentCallbackModal";
import { Collapse, message, Modal } from "antd";
import { useGetProductInfo } from "metabase/pricing_v2/use";
import { getVipInfoV2 } from "metabase/new-service";
import { debounce } from "lodash";

const FgaPricingLayout = (props) => {
  const { user, onSuccess, isModal = false, open, onClose, type = "fga_standard" } = props
  const [activeKey, setActiveKey] = useState("payment");
  const { data } = useGetProductInfo("fga");
  const [isCompleteLoading, setCompleteLoading] = useState(false);
  const onChange = (value) => {
    setActiveKey(value);
  };
  const fgaPaymentProducts = data?.filter((item) => item.productType === type) || []

  const checkPaymentStatus = async () => {
    setCompleteLoading(true)
    const fgaVipInfoResult = await getVipInfoV2("fga")
    setCompleteLoading(false)
    const hasStandardPay = fgaVipInfoResult?.find(vipInfo => vipInfo.type === "fga_standard" && !vipInfo.isExpire)
    if (hasStandardPay) {
      onSuccess?.()
    } else {
      message.info("Payment is not completed yet, please try again later.")
    }
  }

  const checkPaymentStatusDebounce = debounce(data => {
    checkPaymentStatus()
  }, 1000)

  const items = [
    {
      key: 'payment',
      label: 'Select a Plan',
      children: (
        <div className="flex flex-column">
          {fgaPaymentProducts && (<PricingModal
            isModal={false}
            showTitle={false}
            user={user}
            subscribeOptions={fgaPaymentProducts}
            onClose={() => {}}
            setCallback={(result) => {
              if (result) {
                setActiveKey("confirm");
              }
            }}
          />)}
        </div>
      ),
    },
    {
      key: 'confirm',
      label: 'Confirm Payment',
      children: (
        <div className="flex flex-column">
          <PaymentCallbackModal
            isModal={false}
            isCompletedLoading={isCompleteLoading}
            onCompletedClick={() => {
              checkPaymentStatusDebounce()
            }}
          />
        </div>
      ),
    },
  ];

  const renderContent = () => {
    return (
      <Collapse
        items={items}
        defaultActiveKey={["payment"]}
        activeKey={activeKey}
        onChange={onChange}
        accordion
      />
    )
  }

  if (!isModal) {
    return renderContent()
  }

  return (
    <>
      <Modal
        open={open}
        closable={true}
        footer={null}
        onCancel={onClose}
      >
        {renderContent()}
      </Modal>
    </>
  );
};

export default FgaPricingLayout;
