/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { AutoComplete, Button, Divider, Form, Input, message, Modal, Result, Tooltip } from "antd";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import Link from "metabase/core/components/Link";
import { getProtocolList, postProject, submitFGAContractForPro } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";
import { getGrowthProjectPath, saveLatestGAProject, saveLatestGAProjectId } from "../../utils/utils";
import ContractDetailsV3 from "metabase/submit/contract/components/ContractDetailsV3";
import ContractDecoding from "metabase/submit/contract/components/ContractDecoding";
import { toLower } from "lodash";
import Icon from "metabase/components/Icon";
import LoadingSpinner from "metabase/components/LoadingSpinner/LoadingSpinner";
import { loadFgaProjectList, setUserExtend } from "metabase/redux/control";
import PaymentDecoding from "metabase/ab/components/Modal/PaymentDecoding";
import { getUserExtend } from "metabase/selectors/control";
import CreateProjectContractDetails from "metabase/submit/contract/components/CreateProjectContractDetails";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

const CreateProjectModalForDemo = props => {
  const { open, onCancel, onSuccess, router, location, user, force, loadFgaProjectList, setUserExtend, userExtend, projectObject } = props;
  const [form] = Form.useForm();
  const [loadingData, setLoadingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(1);
  const [submitProtocol, setSubmitProtocol] = useState();
  const [protocolList, setProtocolList] = useState();
  const [input, setInput] = useState();
  useEffect(() => {
    if (open) {
      setLoadingData(true);
      // old uuid 5276dcf1-0e5f-49d1-a49a-c405d2caa3d4
      // new uuid af524d7d-d565-429b-af91-d3028f5ee8ad
      getProtocolList()
        .then(result => {
          setProtocolList(result?.protocolList);
        })
        .finally(() => {
          setLoadingData(false);
        });
    } else {
      setState(1);
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

  async function createProject(params) {
    console.log("paramsparams", projectObject, params)
    const hide = message.loading("Loading...", 10);
    setLoading(true);
    let result = null
    if (params.projectName) {
      result = await postProject({
        projectName: params.projectName,
        // protocolSlug: slug,
        // protocolType: type,
      })
    }

    if (params.contracts) {
      await submitFGAContractForPro({
        projectId: result?.projectId || projectObject?.id,
        contractList: params.contracts,
      })
    }
    setLoading(false);
    hide();

    if (result) {
      saveLatestGAProject(result.projectName);
      saveLatestGAProjectId(result.projectId);
    }
    onSuccess?.();
    loadFgaProjectList({ from: "pro" });
    router.push(getGrowthProjectPath(result?.projectName || projectObject?.name, "asset_overview_pro"));

  }

  return (
    <Modal
      title={projectObject ? "Edit your project": "Add your project"}
      open={open}
      destroyOnClose
      footer={null}
      width={560}
      closable={!force}
      maskClosable={!force}
      // onOk={handleOk}
      onCancel={onCancel}
    >
      {state === 1 && (
        <CreateProjectContractDetails
          projectObject={projectObject}
          onClosed={(params) => {
            createProject(params);
          }}
        />

        /*<div className="flex flex-col">
          <Divider />
          <Form
            {...layout}
            labelAlign="left"
            colon={false}
            labelWrap
            form={form}
            name="control-hooks"
            onFinish={onFinish}
          >
            <Form.Item
              name="projectName"
              required={true}
              label={
                <>Project {" "}
                  {loadingData && (
                    <LoadingSpinner />
                  )}
                </>
              }
            >
              <div className="flex align-center">
                <AutoComplete
                  showSearch
                  placeholder={"Enter project name"}
                  dropdownStyle={{
                    background: "#1C1C1E",
                    color: "white",
                    border: "1px solid #ffffff30",
                  }}
                  onChange={handleProjectChange}
                />
              </div>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <div
                className="flex flex-column"
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyItems: "center",
                  marginTop: 20,
                }}
              >
                <Button type="primary" htmlType="submit" loading={loading} style={{ width: 120 }}>
                  {"Create Now"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>*/
      )}
      {state === 2 && (
        <ContractDetailsV3
          user={user}
          fromFgaAddProject={true}
          backAction={() => setState(1)}
          hideEmail={true}
          hideMoreOptions={true}
          hideProjectName={true}
          hideWebsite={true}
          hideProjectCategory={true}
          projectName={input}
          protocolCategoryList={[
            { value: "NFT", label: "NFT" },
            { value: "GameFi", label: "GameFi" },
            { value: "Marketplace", label: "Marketplace" },
            { value: "Others", label: "Others" },
          ]}
          onClosed={param => {
            // setDecodingProcessOpen({ open: true, param: param });
            setUserExtend({
              ...(userExtend || {}),
              web3Data: true
            })
            setState(3);
          }}
          onFinish={(param) => {
            // props.router.push("/submit/contract/success");
          }}
        />
      )}
      {state === 3 && (
        <PaymentDecoding
          onSuccess={(protocol) => {
            setState(4);
            setUserExtend({
              ...(userExtend || {}),
              plan: 'standard'
            })
            message.success("Payment is successfully.");
          }}
        />
      )}
      {state === 4 && (
        <div>
          <Result
            status="success"
            title="Your project is created successfully."
            extra={
              <div className="flex flex-col">
                <Link
                  className="mt3"
                  to={getGrowthProjectPath(submitProtocol, "project_summary")}
                  onClick={() => {
                    onCancel()
                  }}
                >
                  <Button onClick={() => {
                    setUserExtend({
                      ...(userExtend || {}),
                      project: {}
                    })
                    onSuccess?.()
                  }}>View Project Summary</Button>
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
    userExtend: getUserExtend(state),
  };
};

const mapDispatchToProps = {
  loadFgaProjectList: loadFgaProjectList,
  setUserExtend: setUserExtend,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateProjectModalForDemo));
