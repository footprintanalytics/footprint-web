/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React, { useState, useEffect, useRef } from "react";
import { Divider, Modal } from "antd";
import ContractDetailsV3 from "../components/ContractDetailsV3";
import ContractDecoding from "./ContractDecoding"

const ContractStatusModel = ({ open, onClosed, param, setDecodingProcessOpen }) => {
  return (
    <Modal
      open={open}
      centered
      destroyOnClose={true}
      closable={true}
      maskClosable={false}
      width={700}
      footer={null}
      onCancel={() => onClosed?.()}
    >
      <div className="w-full flex flex-col">
        <h1>Submit contracts or protocols</h1>
        <p>One step to add new contracts or protocols to Footprint. You can resubmit protocols that have been included in Footprint, allowing you to make additions or changes to the information.</p>
        <Divider className=" my1"></Divider>
        <ContractDecoding
          param={param}
          onSuccess={() => {
            onClosed?.()
            setDecodingProcessOpen({ open: false, param: null });
          }}
        />
      </div>
    </Modal>
  );
};

export default ContractStatusModel;
