/* eslint-disable react/prop-types */
/* eslint-disable curly */
import "./index.css";
import React, { useState } from "react";
import { Button, Divider, Modal } from "antd";
import Link from "metabase/core/components/Link/Link";
import ContractDetailsV4 from "metabase/submit/contract/components/ContractDetailsV4";
import ContractDecoding from "metabase/submit/contract/components/ContractDecoding";
import { replace } from "react-router-redux";
import _ from "underscore";
import { connect } from "react-redux";

const SubmitContractAddV3 = props => {
  const {user, replace} = props;
  const [isDecodingProcessOpen, setDecodingProcessOpen] = useState({open:false,param:null});

  return (
    <div className="SubmitContract__add-v3">
      <div className="SubmitContract__add">
        <h1>Welcome to submit more contracts or protocols to help us better display the data you need. </h1>
        <p>
          You can resubmit protocols that have already been included in Footprint, allowing you to make additions or changes to the information.
          <br/>
          Submissions typically take just a few minutes to process.
          <br/>
          If you have any questions, please {" "}
          <Link className="text-underline text-underline-hover" to={"https://docs.footprint.network/docs/smart-contracts-decoding"} target={"_blank"}>check out our tutorial</Link>
          {" "}or{" "}
          <Link className="text-underline text-underline-hover" to={"https://t.me/joinchat/4-ocuURAr2thODFh"} target={"_blank"}>contact the team on Telegram</Link>
          .
        </p>
        <Link to={"/submit/contract/mine"}>
          <Button type="primary" htmlType="submit">
            My Contracts
          </Button>
        </Link>
        <Divider className=" my1"></Divider>
        <ContractDetailsV4
          user={user}
          onClosed={param => {
            setDecodingProcessOpen({ open: true, param: param });
          }}
          onFinish={(param) => {
            // props.router.push("/submit/contract/success");
          }}
        />
        {isDecodingProcessOpen?.open && (
          <Modal
            title="Submit contracts or protocols"
            open={true}
            onOk={false}
            onCancel={() => setDecodingProcessOpen({ open: false, param: null })}
            footer={null}
            closable={false}
            maskClosable={false}
            width={600}
          >
            <ContractDecoding
              param={isDecodingProcessOpen?.param}
              toMyContracts={() => {
                setDecodingProcessOpen({ open: false, param: null });
                replace("/submit/contract/mine")
              }}
              onSuccess={() => {
                setDecodingProcessOpen({ open: false, param: null });
                replace("/submit/contract/mine")
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default _.compose(
  connect(null, {
    replace: replace,
  }),
)(SubmitContractAddV3);
