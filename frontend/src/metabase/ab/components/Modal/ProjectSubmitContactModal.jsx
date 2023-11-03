/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { AutoComplete, Button, Divider, Form, message, Modal, Result, Spin, Tooltip, Typography } from "antd";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import Link from "metabase/core/components/Link";
import { getProtocolList, postProject } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";
import { getGrowthProjectPath, saveLatestGAProject, saveLatestGAProjectId } from "../../utils/utils";
import ContractDetailsV3 from "metabase/submit/contract/components/ContractDetailsV3";
import ContractDecoding from "metabase/submit/contract/components/ContractDecoding";
import { toLower } from "lodash";
import Icon from "metabase/components/Icon";
import { LoadingOutlined } from "@ant-design/icons";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

const ProjectSubmitContactModal = props => {
  const { open, onCancel, onSuccess, router, project, user, force } = props;
  const [form] = Form.useForm();
  const [loadingData, setLoadingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(2);
  const [submitProtocol, setSubmitProtocol] = useState();
  const [protocolList, setProtocolList] = useState();
  const [input, setInput] = useState();
  const [isDecodingProcessOpen, setDecodingProcessOpen] = useState({ open: false, param: null });

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

  const options = protocolList?.map(i => {
    return {
      ...i,
      value: i.protocolName,
      key: i.protocolSlug,
      label: i.protocolName,
      type: i.protocolType,
    };
  }) || [];

  function createProject(projectName) {
    const hide = message.loading("Loading...", 10);
    setLoading(true);
    const type = protocolList?.find(o => o.protocolName === input)?.type;
    const slug = protocolList?.find(o => o.protocolName === input)?.protocolSlug;
    postProject({
      projectName: input,
      protocolSlug: slug,
      protocolType: type,
    })
      .then(result => {
        console.log(result);
        saveLatestGAProject(result.protocolSlug);
        saveLatestGAProjectId(result.projectId);
        onSuccess?.();
        router.push(getGrowthProjectPath(result.protocolSlug, "project_summary"));
        return true;
      })
      .catch(error => {
        console.log(error);
        return false;
      })
      .finally(() => {
        setLoading(false);
        hide();
      });
  }

  const onFinish = values => {
    if (!input?.trim()) {
      message.info("Please enter your project name");
      return
    }
    if (isNewProject) {
      setState(2);
    } else {
      createProject(values.protocol);
    }
  };

  const handleProjectChange = (value, option) => {
    setInput(value);
  };

  const isNewProject = !protocolList?.find(i => i.protocolName === input);

  return (
    <Modal
      title="Create your project"
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
          projectName={project.protocolName}
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
            title="Project Info Submit Success!"
            extra={
              <div className="flex flex-col">
                {"You have successfully submitted your project's information. From now on, you can view your project summary in the platform."}
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
