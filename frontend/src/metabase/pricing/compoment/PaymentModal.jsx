/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import Modal from "metabase/components/Modal";
import ModalContent from "metabase/components/ModalContent";
import "./PaymentModal.css";
import cx from "classnames";
import Button from "metabase/components/Button";
import flatten from "underscore/modules/_flatten";
import { Select } from "antd";
import { trackStructEvent } from "metabase/lib/analytics";

const PaymentModal = ({ options, item, pay, paymentMethods, onClose }) => {
  const [coin, setCoin] = useState();
  const [coins, setCoins] = useState();
  const [current, setCurrent] = useState(options[0]);

  useEffect(() => {
    if (paymentMethods) {
      const coins = flatten(
        Object.keys(paymentMethods).map(key => {
          return paymentMethods[key].coins.map(coin => {
            return {
              id: `${coin.key}-${coin.value}`,
              chain: key,
              ...coin,
            };
          });
        }),
      );
      setCoins(coins);
      setCoin(coins[0]);
    } else {
      setCoins(undefined);
    }
  }, [paymentMethods]);

  const renderCoinBase = () => {
    if (!paymentMethods) {
      return <div />;
    }

    return (
      <div className="payment-model__select">
        <Select
          size="large"
          placeholder="Please select your coin"
          onChange={value =>
            setCoin(coins.find(option => option.value === value))
          }
          defaultValue={coins[0].value}
          style={{ width: "100%" }}
        >
          {coins.map(coin => {
            return (
              <Select.Option key={coin.id} value={coin.value}>
                <div className="payment-model__select-option">
                  <div>
                    <img
                      className="payment-model__select-icon"
                      src={coin.icon}
                      alt={coin.label}
                    />
                    <span className="payment-model__select-name">
                      {coin.label}
                    </span>
                  </div>
                  <span className="payment-model__select-chain">
                    {coin.chain}
                  </span>
                </div>
              </Select.Option>
            );
          })}
        </Select>
      </div>
    );
  };

  return (
    <Modal ModalClass="payment-model">
      <ModalContent
        onClose={onClose}
        className="payment-model__root"
        formModal={false}
      >
        <div>
          <div className="payment-model__title">Payment method</div>
          <div className="payment-model__category">
            {options.map((option, index) => {
              return (
                <div
                  key={option.name}
                  className={cx("payment-model__button", {
                    "payment-model__button-selected":
                      current.name === option.name,
                  })}
                  onClick={() => {
                    trackStructEvent("pricing modal select " + option.name);
                    setCurrent(option);
                  }}
                >
                  <span>{option.name}</span>
                  {option.recommend && (
                    <span className="payment-model__recommend">
                      {option.recommend}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {current.value === "coinbase" && renderCoinBase()}
          <div className="payment-model__price-panel">
            <div className="payment-model__price-amount">${item.price}</div>
            <div className="payment-model__price-name">
              Footprint {item.name}
            </div>
          </div>
          <div className="payment-model__pay-button">
            <Button
              primary
              onClick={() => {
                if (current.value === "coinbase") {
                  trackStructEvent("pricing modal click coinbase");
                  pay({
                    paymentChannel: coin.paymentMethod,
                    payCurrency: coin.value,
                  });
                  return;
                }
                trackStructEvent("pricing modal click stripe");
                pay({ paymentChannel: current.value });
              }}
            >
              Pay Now
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default PaymentModal;
