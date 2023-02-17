/* eslint-disable react/prop-types */
import React from "react";
import { Card, Result, Button } from "antd";
import { SmileOutlined } from "@ant-design/icons";

const ConfigFinish = () => {
  return (
    <div
      className="flex flex-col w-full"
      style={{
        alignItems: "center",
      }}
    >
      <Card style={{ width: 600 }}>
        <Result
          icon={<SmileOutlined />}
          title="Great, we have done all the operations!"
          extra={<Button type="primary">View Data</Button>}
        />
      </Card>
    </div>
  );
};

export default ConfigFinish;
