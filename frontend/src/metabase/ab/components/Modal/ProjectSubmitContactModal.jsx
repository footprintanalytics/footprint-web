/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Result } from "antd";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import Link from "metabase/core/components/Link";
import { getUser } from "metabase/selectors/user";
import { getGrowthProjectPath } from "../../utils/utils";
import ContractDetailsV3 from "metabase/submit/contract/components/ContractDetailsV3";
import ContractDecoding from "metabase/submit/contract/components/ContractDecoding";

const ProjectSubmitContactModal = props => {
  const { open, onCancel, onSuccess, router, project, user, force } = props;
  const [form] = Form.useForm();
  const [state, setState] = useState(2);
  const [submitProtocol, setSubmitProtocol] = useState();
  const [input, setInput] = useState();
  const [isDecodingProcessOpen, setDecodingProcessOpen] = useState({ open: false, param: null });

  useEffect(() => {
    if (open) {
    } else {
      setState(2);
      setSubmitProtocol();
      setInput();
    }
  }, [open]);

  useEffect(() => {
    if (state === 1) {
      form.setFieldsValue({
        protocol: input,
      })
    }
  }, [state])

  return (
    <Modal
      title="Submit contract"
      open={open}
      destroyOnClose
      footer={null}
      width={560}
      closable={!force}
      maskClosable={!force}
      // onOk={handleOk}
      onCancel={onCancel}
    >
      {state === 2 && (
        <ContractDetailsV3
          user={user}
          fromFgaAddProject={true}
          hideEmail={true}
          hideMoreOptions={true}
          hideProjectName={true}
          projectId={project?.id}
          projectName={project?.protocolName}
          protocolCategoryList={[
            { value: "NFT", label: "NFT" },
            { value: "GameFi", label: "GameFi" },
            { value: "Marketplace", label: "Marketplace" },
            { value: "Others", label: "Others" },
          ]}
          onClosed={param => {
            setDecodingProcessOpen({ open: true, param: param });
            setState(3);
          }}
          onFinish={(param) => {
            // props.router.push("/submit/contract/success");
          }}
        />
      )}
      {state === 3 && (<ContractDecoding
        param={isDecodingProcessOpen?.param}
        fromFgaAddProject={true}
        backAction={() => setState(2)}
        onSuccess={(protocol) => {
          setState(4);
          setSubmitProtocol(protocol);
          setDecodingProcessOpen({ open: false, param: null });
        }}
      ></ContractDecoding>)}
      {state === 4 && (
        <div>
          <Result
            status="success"
            title="Your project is submitted successfully."
            extra={
              <div className="flex flex-col">
                <Link
                  className="mt3"
                  to={getGrowthProjectPath(submitProtocol, "project_summary")}
                  onClick={() => {
                    onCancel()
                  }}
                >
                  <Button>View Project Summary</Button>
                </Link>
              </div>
            }
          />
        </div>
      )}
    </Modal>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default withRouter(connect(mapStateToProps)(ProjectSubmitContactModal));
