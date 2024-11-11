/* eslint-disable react/prop-types */
import React, { useState } from "react";
import PricingModal from "metabase/pricing_v2/components/PricingModal";
import { FgaProductMock } from "metabase/ab/utils/data";
import PaymentCallbackModal from "metabase/pricing/compoment/PaymentCallbackModal";
import { Collapse, Modal } from "antd";

const FgaPricingLayout = (props) => {
  const { user, onSuccess, isModal = false, open, onClose, type = "standard" } = props
  const [current, setCurrent] = useState(0);
  const [activeKey, setActiveKey] = useState("payment");

  const onChange = (value) => {
    setActiveKey(value);
  };

  const items = [
    {
      key: 'payment',
      label: 'Select a Plan',
      children: (
        <div className="flex flex-column">
          <PricingModal
            isModal={false}
            showTitle={false}
            user={user}
            subscribeOptions={FgaProductMock.filter((item) => item.type === type)}
            onClose={() => {}}
            setCallback={(result) => {
              if (result) {
                setActiveKey("confirm");
              }
            }}
          />
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
            onCompletedClick={() => {
              // here mock the result
              onSuccess?.()
            }}
          />
        </div>
      ),
    },
  ];

  // <div className="flex flex-column">
  //               <Button onClick={() => {
  //                 onSuccess?.()
  //               }}>View Your Project</Button>
  //             </div>

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
