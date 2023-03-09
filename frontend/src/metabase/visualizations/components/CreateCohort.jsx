/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, message, Modal, Select } from "antd";

const CreateCohort = ({ state, style }) => {
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const result = state?.series[0];
  const addressIndex = result?.data?.cols?.findIndex(f => f?.name?.toLowerCase()?.includes("address"));
  const emailList = addressIndex >= 0 ? result?.data?.rows
    ?.map(f => f[addressIndex])
    ?.filter(f => !!f) : null;

  const onSend = async () => {
    message.loading("Loading...");
    setTimeout(() => {
      message.success("Create cohort success");
      setIsTagModalOpen(false);
    }, 2000);
  };
  const options = [{
    value: "high_profit_winner",
    label: "High Profit Winner",
  }, {
    value: "royal_holder",
    label: "Royal Holder",
  }, {
    value: "high_value_holder",
    label: "High Value Holder",
  }];
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <>
      <Button
        type="primary"
        style={style}
        onClick={() => setIsTagModalOpen(true)}
      >
        Create Cohort
      </Button>
      <Modal
        open={isTagModalOpen}
        onCancel={() => setIsTagModalOpen(false)}
        onOk={onSend}
        okText="create"
        closable={false}
        title="Create cohort"
      >
        {emailList && (
          <h3>You have selected {emailList?.length} wallet address.</h3>
        )}
        <div className="mt2" />
        <Select
          mode="tags"
          style={{
            width: "100%",
          }}
          placeholder="Tags"
          onChange={handleChange}
          options={options}
        />
      </Modal>
    </>
  );
};

export default CreateCohort;
