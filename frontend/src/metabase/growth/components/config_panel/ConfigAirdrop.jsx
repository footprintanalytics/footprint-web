/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Card, Result, Button, Input } from "antd";
import { SmileOutlined } from "@ant-design/icons";

const ConfigEmail = () => {
  const [channel, setChannels] = useState();
  return (
    <div
      className="flex flex-col w-full bg-light p2"
      style={{
        alignItems: "left",
      }}
    >
      <h4>Airdrop</h4>
      <div className="mt2" />
      <h5>Coming soon~</h5>
    </div>
  );
};

export default ConfigEmail;
