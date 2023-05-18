/* eslint-disable react/prop-types */
/* eslint-disable curly */
import "./index.css";
import React, { useState } from "react";
import { Steps } from "antd";
import ContractAddress from "./components/ContractAddress";
import ContractDetailsV2 from "./components/ContractDetailsV2";

const SubmitContractAdd = props => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({});

  return (
    <div className="SubmitContract">
      <div className="SubmitContract__add">
        <h1>Submit smart contracts for decoding</h1>
        <p>1 steps to add new contracts to Footprint</p>
        <ContractDetailsV2
          formData={formData}
          onFinish={() => {
            props.router.push("/submit/contract/success");
          }}
        />
      </div>
    </div>
  );
};

export default SubmitContractAdd;
