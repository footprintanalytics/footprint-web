/* eslint-disable react/prop-types */
import { Button, Radio } from "antd";
import React from "react";

const PaymentDecoding = ({onSuccess}) => {
  return (
    <div className="flex flex-col" style={{ padding: "20px 0" }}>
      <Radio.Group style={{ width: '100%' }} className="flex flex-col" defaultValue={"Standard Package $120"}>
        {['Standard Package $120'].map((item, index) => (
          <Radio key={index} value={item} >
            {item}
          </Radio>
        ))}
      </Radio.Group>
      <div className="flex justify-center pt-4">
        <Button onClick={() => onSuccess()} style={{ width: 120, marginTop: 40 }}>
          {"Pay Now"}
        </Button>
      </div>
    </div>
  )
}

export default PaymentDecoding
