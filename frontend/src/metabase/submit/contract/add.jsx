/* eslint-disable react/prop-types */
/* eslint-disable curly */
import "./index.css";
import React, { useState } from "react";
import { Steps } from "antd";
import ContractAddress from "./components/ContractAddress";
import ContractDetails from "./components/ContractDetails";

const SubmitContractAdd = props => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({});

  return (
    <div className="SubmitContract">
      <div className="SubmitContract__add">
        <h1>Submit smart contracts for decoding</h1>
        <p>2 steps to add new contracts to Footprint</p>
        <Steps current={current} className="SubmitContract__steps">
          <Steps.Step title="Contract Address" />
          <Steps.Step title="Contract Details" />
        </Steps>
        {current === 0 ? (
          <ContractAddress
            onFinish={values => {
              setFormData(values);
              setCurrent(1);
            }}
          />
        ) : (
          <ContractDetails
            formData={formData}
            onFinish={() => {
              props.router.push("/submit/contract/success");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SubmitContractAdd;
