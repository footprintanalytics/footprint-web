/* eslint-disable react/prop-types */
/* eslint-disable curly */
import "./index.css";
import React, { useState } from "react";
import { Steps } from "antd";
import ContractAddress from "./components/ContractAddress";
import ContractDetailsV2 from "./components/ContractDetailsV2";
import Icon from "metabase/components/Icon";
import Link from "metabase/core/components/Link/Link";

const SubmitContractAdd = props => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({});

  return (
    <div className="SubmitContract">
      <div className="SubmitContract__add">
        <Link className="SubmitContract__back" to="/submit/contract">
          <Icon name="collapse_arrow_left" size={14}/>
          <span className="footprint-primary-text">My Contracts</span>
        </Link>
        <h1>Submit smart contracts for decoding</h1>
        <p>One step to add new contracts to Footprint</p>
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
