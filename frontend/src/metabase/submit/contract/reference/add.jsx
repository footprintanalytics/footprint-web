/* eslint-disable react/prop-types */
/* eslint-disable curly */
import "../index.css";
import React, { useState } from "react";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import ContractAddress from "../components/ContractAddress";
import ContractDetailsV3 from "../components/ContractDetailsV3";

const RefSubmitContractAdd = props => {
  const { onClosed } = props;
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({});

  return (
    <div className="SubmitContract">
      <div className="SubmitContract__add">
        <h1>Submit smart contracts for decoding</h1>
        <p>One step to add new contracts to Footprint</p>
        <ContractDetailsV3
          formData={formData}
          user={props.user}
          onClosed={onClosed}
          onFinish={() => {
            props.router.push("/submit/contract/success");
          }}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  user: getUser(state),
});

export default connect(mapStateToProps)(RefSubmitContractAdd);
