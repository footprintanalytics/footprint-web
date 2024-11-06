/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Form, Input, Select } from "antd";

const FgaFlowSubmitContact = () => {
  const [data, setData] = useState([{}]);
  return (
    <Form>
      <Form.Item label="Project category">
        <Select
          defaultValue="NFT"
          style={{ width: 120 }}
          options={[
            { value: "NFT", label: "NFT" },
            { value: "GameFi", label: "GameFi" },
            { value: "Marketplace", label: "Marketplace" },
            { value: "Others", label: "Others" },
          ]}
          />
      </Form.Item>
      <Form.Item label="Website">
        <Input placeholder={"please input your website"} />
      </Form.Item>
    </Form>
  );
};

export default FgaFlowSubmitContact;
