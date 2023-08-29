/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React, { useState, useEffect, useRef } from "react";
import { Divider, Modal } from "antd";
import ContractDetailsV3 from "../components/ContractDetailsV3";
import ContractDecoding from "./ContractDecoding"

const ContractAddModel = ({ user,open,onClosed}) => {
  const [isDecodingProcessOpen, setDecodingProcessOpen] = useState({open:false,param:null});
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
        <p>One step to add new contracts or protocols to Footprint</p>
        <Divider className=" my1"></Divider>
        {!isDecodingProcessOpen?.open&& <ContractDetailsV3
          user={user}
          onClosed={param => {
            setDecodingProcessOpen({ open: true, param: param });
          }}
          onFinish={(param) => {
            // props.router.push("/submit/contract/success");
          }}
        />}
        {isDecodingProcessOpen?.open&& (<ContractDecoding
          param={isDecodingProcessOpen?.param}
          onSuccess={() => {
            onClosed?.()
            setDecodingProcessOpen({ open: false, param: null });
          }}
        ></ContractDecoding>)}
      </div>
    </Modal>
  );
};

export default ContractAddModel;
