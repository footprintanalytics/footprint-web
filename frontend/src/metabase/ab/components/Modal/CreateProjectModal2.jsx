/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Modal, AutoComplete, Button, Input, Form, message, Divider, Typography, Tooltip, Result, Spin } from "antd";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import Link from "metabase/core/components/Link";
import { CreateFgaProject, getProtocolList, postProject } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";
import {
  getDashboardDatas,
  getGrowthProjectPath,
  saveLatestGAProject,
  saveLatestGAProjectId,
} from "../../utils/utils";
import ContractDetailsV3 from "metabase/submit/contract/components/ContractDetailsV3";
import ContractDecoding from "metabase/submit/contract/components/ContractDecoding";
import { toLower } from "lodash";
import Icon from "metabase/components/Icon";
import { LoadingOutlined } from "@ant-design/icons";
import LoadingSpinner from "metabase/components/LoadingSpinner/LoadingSpinner";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

const CreateProjectModal2 = props => {
  const { open, onCancel, onSuccess, router, location, user, force } = props;
  const [form] = Form.useForm();
  const [loadingData, setLoadingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(1);
  const [submitProtocol, setSubmitProtocol] = useState();
  const [protocolList, setProtocolList] = useState();
  const [input, setInput] = useState();
  const [projectTip, setProjectTip] = useState();
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
      setState(1);
      setSubmitProtocol();
      setInput();
    }
  }, [open]);

  useEffect(() => {
    console.log("useEffectuseEffectuseEffectuseEffect", state, input)
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
      title="Add your project"
      open={open}
      destroyOnClose
      footer={null}
      width={560}
      closable={!force}
      maskClosable={!force}
      // onOk={handleOk}
      onCancel={onCancel}
    >
      {state === 1 && (<div className="flex flex-col">
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
              name="protocol"
              label={
                <>Project {" "}
                  {loadingData && (
                    <LoadingSpinner />
                  )}
                </>
              }
              // rules={[{ required: true }]}
            >
              <div className="flex align-center">
                <AutoComplete
                  showSearch
                  placeholder={"Enter project name"}
                  // disabled={loadingData}
                  dropdownStyle={{
                    background: "#1C1C1E",
                    color: "white",
                    border: "1px solid #ffffff30",
                  }}
                  dropdownRender={menu =>
                    loadingData ? (
                      <div className="p2">Loading...</div>
                    ) : (
                      menu
                    )
                  }
                  onChange={handleProjectChange}
                  optionFilterProp="children"
                  filterOption={(inputValue, option) =>
                    toLower(option.label)
                      .trim()
                      .replace(" ", "")
                      .indexOf(toLower(inputValue).trim().replace(" ", "")) !== -1
                  }
                  options={options}
                />
                {input?.trim() && (
                  <Tooltip className="ml1"
                           title={isNewProject ? "The project doesn't exist in the platform." : "The project already exists in the platform."}>
                    <Icon size={16} color={isNewProject ? "#ff0000": "#00ff00"} name={isNewProject ? "info" : "table_info"} />
                  </Tooltip>)
                }
              </div>
            </Form.Item>
            {input?.trim() &&
              <div>{isNewProject ? "The project you entered is not included yet. Please click \"Next\" to submit your project information." : " "}</div>}

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
                  {isNewProject ? "Next" : "Create Now"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      )}
      {state === 2 && (
        <ContractDetailsV3
          user={user}
          fromFgaAddProject={true}
          backAction={() => setState(1)}
          hideEmail={true}
          hideMoreOptions={true}
          hideProjectName={true}
          projectName={input}
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
      {state === 3 && (
        <ContractDecoding
          param={isDecodingProcessOpen?.param}
          fromFgaAddProject={true}
          backAction={() => setState(2)}
          onSuccess={(protocol) => {
            setState(4);
            setSubmitProtocol(protocol);
            setDecodingProcessOpen({ open: false, param: null });
          }}
        />
      )}
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

export default withRouter(connect(mapStateToProps)(CreateProjectModal2));
