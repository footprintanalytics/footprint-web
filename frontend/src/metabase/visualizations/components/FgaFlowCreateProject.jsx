/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Form, Input, Select } from "antd";

const FgaFlowCreateProject = () => {
  const [data, setData] = useState([{}]);
  const [type, setType] = useState("step1");
  return (
    <div className="flex flex-col">
      {type === "step1" && (<Form>
      <Button onClick={() => {
        setData([...data, {}]);
      }}>Add</Button>
      {
        data?.map((item, index) => {
          return (
            <Form.Item label="Address" key={index}>
              <div className="flex">
                <Input placeholder={"please input your address"}/>
                <Select
                  defaultValue="NFT"
                  style={{ width: 120 }}
                  options={[{ value: 'NFT', label: 'NFT' }, { value: 'token', label: 'Token' }]}
                />
              </div>
            </Form.Item>
          )
        })
      }
    </Form>
        )}
      {type !== 'step1' && (<Form>
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
    </Form>)}
      {type === 'step1' && <Button onClick={() => setType("step2")}>Toggle</Button>}
    </div>
  );
};

export default FgaFlowCreateProject;
