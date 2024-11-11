/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button, Form, message, Modal, Result } from "antd";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import Link from "metabase/core/components/Link";
import { getProtocolList, postProject, submitFGAContractForPro } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";
import { getGrowthProjectPath, saveLatestGAProject, saveLatestGAProjectId } from "../../utils/utils";
import _ from "lodash";
import { loadFgaProjectList, setFgaDashboardKey, setUserExtend } from "metabase/redux/control";
import PaymentDecoding from "metabase/ab/components/Modal/PaymentDecoding";
import { getUserExtend } from "metabase/selectors/control";
import CreateProjectContractDetails from "metabase/submit/contract/components/CreateProjectContractDetails";
import { loadCurrentFgaProjectById } from "metabase/redux/user";
import { push, replace } from "react-router-redux";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

const CreateProjectModalForDemo = props => {
  const { open, onCancel, onSuccess, router, replace, loadFgaProjectList, force, setFgaDashboardKey, setUserExtend, userExtend, projectObject, loadCurrentFgaProjectById, isModal = true, submitButtonText } = props;
  const [form] = Form.useForm();
  const [loadingData, setLoadingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(1);
  const [submitProtocol, setSubmitProtocol] = useState();
  const [protocolList, setProtocolList] = useState();
  const [input, setInput] = useState();
  const [projectResult, setProjectResult] = useState();
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
      })
    }

    if (!_.isEmpty(params.contracts)) {
      console.log("params.contracts", params.contracts)
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
      setProjectResult(result);
    }
    onSuccess?.();
    if (!projectObject) {
      await loadFgaProjectList({ from: "pro" });
      await loadCurrentFgaProjectById(result?.projectId || projectObject?.id, "edit-project")
      router.push(getGrowthProjectPath(result?.projectName || projectObject?.name, "asset_overview_pro"));
      // window.location.reload();
    } else {
      await loadFgaProjectList({ from: "pro" });
      await loadCurrentFgaProjectById(result?.projectId || projectObject?.id, "edit-project")
      setFgaDashboardKey({ key: "pro" });
    }
  }
  const refreshData = async () => {
    setLoading(true);
    await loadFgaProjectList({ from: "pro" });
    setLoading(false)
  }

  const renderContent = () => {
    return (
      <div className="flex flex-column" style={{ width: "100%" }}>
        {state === 1 && (
          <div className="flex flex-column">
            {!projectObject && (<span className="mb2">You can create a new project to explore by entering key information, such as NFT or TOKEN, and we will help you generate a series of reports.</span>)}
            <CreateProjectContractDetails
              projectObject={projectObject}
              submitButtonText={submitButtonText}
              onClosed={(params) => {
                createProject(params);
              }}
            />
          </div>
        )}
        {state === 2 && (
          <div className="flex flex-column justify-center">
            <Result
              status="success"
              title={`${projectResult?.projectName} is created successfully.`}
              extra={
                <div className="flex justify-center" style={{ gap: 20 }}>
                  <div
                    loading={loading}
                    className="mt3"
                    onClick={async () => {
                      await refreshData();
                    }}
                  >
                    <Button>View Dashboard Overview</Button>
                  </div>
                </div>
              }
            />
          </div>
        )}
      </div>
    )
  }

  if (!isModal) {
    return renderContent();
  }

  return (
    <Modal
      title={projectObject ? "Edit your project": "Create your project"}
      open={open}
      destroyOnClose
      footer={null}
      width={560}
      closable={!force}
      maskClosable={!force}
      // onOk={handleOk}
      onCancel={onCancel}
    >
      {renderContent()}
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
  setFgaDashboardKey,
  loadCurrentFgaProjectById,
  onChangeLocation: push,
  replace
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateProjectModalForDemo));
