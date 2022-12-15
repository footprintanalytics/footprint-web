/* eslint-disable react/prop-types */
import React, { useState } from "react";
import PaymentCallbackModal from "metabase/pricing/compoment/PaymentCallbackModal";
import { Button, Checkbox, Modal } from "antd";
import { payProduct } from "metabase/new-service";
import { getOssUrl } from "metabase/lib/image";
import { slack } from "metabase/lib/slack";

const PricingModal = ({ user, sign, subscribeOptions, visible, onClose }) => {
  const [options, setOptions] = useState(subscribeOptions);
  const [loading, setLoading] = useState(false);
  const [callback, setCallback] = useState(false);
  const [auto, setAuto] = useState(true);
  const { disabledAuto } = options?.find(item => item.selected) || {};

  const onPay = async () => {
    if (!user?.id) {
      onClose();
      sign();
      return;
    }
    setLoading(true);
    try {
      const { productId, title } = options?.find(item => item.selected) || {};
      const paymentChannel = "stripe";
      const mode = auto && !disabledAuto ? "subscription" : "payment";
      const { paymentLink } = await payProduct({
        productId,
        paymentChannel,
        mode,
      });
      window.open(paymentLink);
      slack([
        { label: "Pay", value: user?.email },
        { label: "Mode", value: mode },
        { label: "Title", value: title },
      ]);
    } catch (e) {
    } finally {
      setLoading(false);
      onClose();
      setCallback(true);
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        closable={false}
        footer={null}
        onCancel={onClose}
      >
        <div className="Pricing_modal">
          <h3>Plans & Pricing</h3>
          <ul>
            {options?.map(item => (
              <li
                key={item.title}
                onClick={() => {
                  setOptions(
                    options?.map(o => ({
                      ...o,
                      selected: item.title === o.title,
                    })),
                  );
                }}
              >
                <img
                  width={16}
                  height={16}
                  src={getOssUrl(
                    item.selected ? "20220722141632.png" : "20220722141653.png",
                  )}
                />
                <div className="Pricing_modal-option">
                  <h4>{item.title}</h4>
                  {!!item.yearlyPrice && (
                    <span>
                      {item.yearlyPrice} per month,{" "}
                      <i>saving {item.yearlySaving}</i>
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <Button type="primary" size="large" onClick={onPay} loading={loading}>
            Subscribe Now
          </Button>
          {!disabledAuto && (
            <Checkbox checked={auto} onChange={e => setAuto(e.target.checked)}>
              Automatic Renewal
            </Checkbox>
          )}
        </div>
      </Modal>
      {callback && <PaymentCallbackModal onClose={() => setCallback(false)} />}
    </>
  );
};

export default PricingModal;
