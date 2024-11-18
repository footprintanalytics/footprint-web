/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button, Form, message, Modal, Result } from "antd";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import _ from "lodash";
import { push, replace } from "react-router-redux";
import { loadFgaProjectList, setFgaDashboardKey } from "metabase/redux/control";
import { postProject, submitFGAContractForPro } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";
import { loadCurrentFgaProjectById } from "metabase/redux/user";
import CreateProjectContractDetails from "metabase/submit/contract/components/CreateProjectContractDetails";
import { getGrowthProjectPath, saveLatestGAProject, saveLatestGAProjectId } from "../../utils/utils";


const CreateProjectModalForDemo = props => {
  const { open, onCancel, onSuccess, router, loadFgaProjectList, force, setFgaDashboardKey, projectObject, loadCurrentFgaProjectById, isModal = true } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(1);
  const [input, setInput] = useState();
  const [projectResult, setProjectResult] = useState();
  useEffect(() => {
    if (open) {
    } else {
      setState(1);
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
        <div className="flex flex-column">
          {!projectObject && (<span className="mb2">You can create a new project to explore by entering key information, such as NFT or TOKEN, and we will help you generate a series of reports.</span>)}
          <CreateProjectContractDetails
            projectObject={projectObject}
            onClosed={(params) => {
              createProject(params);
            }}
          />
        </div>
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
  };
};

const mapDispatchToProps = {
  loadFgaProjectList: loadFgaProjectList,
  setFgaDashboardKey,
  loadCurrentFgaProjectById,
  onChangeLocation: push,
  replace
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateProjectModalForDemo));
