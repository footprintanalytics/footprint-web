/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, message, Modal, Result, Select, Steps, Table } from "antd";
import { withRouter } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { connect } from "react-redux";
import { getFgaProject, getUser } from "metabase/selectors/user";
import { loadFgaProjectList, setFgaDashboardKey, setUserExtend } from "metabase/redux/control";
import { getUserExtend } from "metabase/selectors/control";
import { loadCurrentFgaProjectById, loadCurrentUserVipFGA } from "metabase/redux/user";
import { push, replace } from "react-router-redux";
import { CHAIN_LIST } from "metabase/submit/contract/components/ContractDetailsV4";
import { LoadingOutlined } from "@ant-design/icons";
import _, { get } from "lodash";
import { findContractMatchByName, postProject, submitFGAContractForPro } from "metabase/new-service";
import { saveLatestGAProject, saveLatestGAProjectId } from "metabase/ab/utils/utils";
import "metabase/pricing_v2/index.css";
import FgaPricingLayout from "metabase/ab/components/FgaPricingLayout";


const { Option } = Select
const CreateProjectModalForFgaPro = props => {
  const { force, isModal = false, open, onCancel, onSuccess, loadCurrentUserVipFGA, loadFgaProjectList, loadCurrentFgaProjectById, setFgaDashboardKey, projectObject, submitButtonText, user, isOnboard, replace } = props;
  const [form] = Form.useForm();
  const isProFgaBeta = window.location.pathname.startsWith("/fga/pro_beta")
  const steps = [
    {
      title: 'Input your Project Name',
      content: 'First-content',
    },
    {
      title: 'Confirm Project Info',
      content: 'Second-content',
    },
    !isModal && isProFgaBeta && {
      title: 'Plans & Pricing',
      content: 'third-content',
    },
  ].filter(Boolean);
  const [current, setCurrent] = useState(0);
  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  const [loading, setLoading] = useState(!isModal);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [data, setData] = useState([]);
  const [projectId, setProjectId] = useState();
  const [contractResult, setContractResult] = useState([]);
  const [projectName, setProjectName] = useState();

  useEffect(() => {
    console.log("projectObject", projectObject)
    if (isOnboard && (projectObject && projectObject?.id !== 1) && isProFgaBeta) {
      setCurrent(2)
    }
  }, [projectObject])

  useEffect(() => {
    if (!open) {
      setData([])
    }
  }, [open]);

  const renderCreateProject = () => {
    return (
      <Form
        form={form}
        layout="vertical"
        initialValues={{}}
        onFinish={async values => {
          setCurrent(1)
          setProjectName(values.projectName)
          getProjectInfo(values);
        }}
      >
        <Form.Item
          label="Project Name (e.g., Mocaverse)"
          name="projectName"
          required={true}
          rules={[{ required: true, message: 'Please input your project name!' }]}
          style={{marginBottom: 20}}
        >
          <Input
            placeholder="Input your project"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item>
          <div className="w-full flex flex-row-reverse justify-between align-center">
            <div className="flex align-center gap-2 mt4">
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </div>
          </div>
        </Form.Item>
      </Form>
    )
  }

  const getProjectInfo = async (values) => {
    setLoading(true);
    const contractResult = await findContractMatchByName(values)
    setContractResult(contractResult)
    setData(contractResult.map((item, inx) => {
      return {
        ...item,
        key: uuidv4(),
        checked: true
      }
    }))
    setLoading(false);
  }

  const handleAdd = () => {
    setData([{ key: uuidv4(), address: '', standard: submitButtonText?.includes('Token') ? 'ERC20': 'ERC1155', chain: 'Ethereum', checked: true }, ...data]);
  };

  const handleDelete = (key) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleInputChange = (value, key) => {
    setData(data.map(item => (item.key === key ? { ...item, address: value } : item)));
  };

  const handleSelectChange = (field, value, key) => {
    setData(data.map(item => (item.key === key ? { ...item, [field]: value } : item)));
  };

  const handleCheckChange = (checked, key) => {
    setData(data.map(item => (item.key === key ? { ...item, checked } : item)));
  };

  const columns = [
    {
      title: '',
      dataIndex: 'check',
      width: 30,
      render: (_, record) => (
        <Checkbox
          checked={record.checked}
          onChange={(e) => handleCheckChange(e.target.checked, record.key)}
        />
      ),
    },
    {
      title: '#',
      dataIndex: 'index',
      width: 40,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: 260,
      render: (_, record) => (
        <Input
          value={record.address}
          maxLength={42}
          style={{ fontSize: 12 }}
          onChange={(e) => handleInputChange(e.target.value, record.key)}
        />
      ),
    },
    {
      title: 'Chain',
      dataIndex: 'chain',
      width: 110,
      render: (_, record) => (
        <Select
          value={record.chain}
          onChange={(value) => handleSelectChange('chain', value, record.key)}
          style={{ width: 110, fontSize: 12 }}
        >
          {CHAIN_LIST.map(chain => (
            <Option key={chain.value} value={chain.value}>
              {chain.label}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Standard',
      dataIndex: 'standard',
      width: 110,
      render: (_, record) => (
        <Select
          value={record.standard}
          onChange={(value) => handleSelectChange('standard', value, record.key)}
          style={{ width: 110, fontSize: 12 }}
        >
          <Option value="ERC1155">ERC1155</Option>
          <Option value="ERC721">ERC721</Option>
          <Option value="ERC20">ERC20</Option>
        </Select>
      ),
    },
    /*{
      title: '',
      dataIndex: 'action',
      width: 60,
      render: (_, record) => (
        <Button type="link" onClick={() => handleDelete(record.key)}>
          <DeleteOutlined />
        </Button>
      ),
    },*/
  ];

  const isValidAddress = contractAddress => {
    const regex = /^(0x)?[0-9a-fA-F]{40,}$/;
    const array = contractAddress.split("\n");
    return array.every(address => regex.test(get(address.split(","),"[0]")));
  };

  async function createProject() {
    const contractData = data.filter(item => item.checked);
    const emptyInputs = contractData
      .map((item, index) => ({ ...item, index: data.indexOf(item) + 1 }))
      .filter(item => item.address.trim() === '');

    if (emptyInputs.length > 0) {
      const errorMessage = `Please fill in all input fields for checked items at row(s): ${emptyInputs.map(item => item.index).join(', ')}`;
      message.error(errorMessage);
      return;
    }

    const invalidAddresses = data.filter(item => !isValidAddress(item.address));

    if (invalidAddresses.length > 0) {
      const errorMessage = `Invalid address at row(s): ${invalidAddresses.map(item => item.key).join(', ')}`;
      message.error(errorMessage);
      return;
    }

    const hide = message.loading("Loading...", 60);
    setSubmitLoading(true);
    let result = null
    if (projectName) {
      result = await postProject({
        projectName: projectName,
      })
    }

    if (!_.isEmpty(contractData)) {
      await submitFGAContractForPro({
        projectId: result?.projectId || projectObject?.id,
        contractList: contractData,
      })
    }
    setSubmitLoading(false);
    hide();

    if (result) {
      saveLatestGAProject(result.projectName);
      saveLatestGAProjectId(result.projectId);
    }
    onSuccess?.();
    setProjectId(result?.projectId);
    setCurrent(current + 1)
  }

  const handleSuccessSkip = async () => {
    await loadFgaProjectList({ from: "pro" });
    await loadCurrentFgaProjectById(projectId, "edit-project")
    setFgaDashboardKey({ key: "pro" });
    await loadCurrentUserVipFGA()
    // window.location.reload();
  }

  const renderProjectInfo = () => {
    return (
      <div>
        {loading ? (
          <Result
            icon={<LoadingOutlined />}
            title="Loading Project Info..."
          >
          </Result>
        ) : (
          <div>
            <h2>Project: {projectName || projectObject?.name}</h2>
            {!projectObject && (<div style={{ marginBottom: 16 }}>
              <h4>{contractResult?.length > 0 ? "The system has matched the following contracts through AI. Please select your contract for submission." : "No project info found. Please add your contact."}</h4>
            </div>)}
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              rowKey="key"
              scroll={{ y: 300 }}
              sticky
              style={{ overflow: 'hidden' }}
            />
            <style>
              {`
            .ant-table-body::-webkit-scrollbar {
              width: 8px;
            }
            .ant-table-body::-webkit-scrollbar-thumb {
              background-color: rgba(0, 0, 0, 0.5);
              border-radius: 4px;
            }
          `}
            </style>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
              <Button onClick={handleAdd} style={{ marginRight: 8 }}>
                Add a Contract
              </Button>
              <Button type="primary" onClick={() => createProject(data)} loading={submitLoading}>
                {`${isModal ? "Submit" : "Submit Project Info"}`}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const renderPricing = () => {
    // FgaProductMock
    return (
      <div className="flex flex-column" style={{gap: 10}}>
        <h3>{"After purchasing the Standard package, you'll gain access to the standard dashboard analysis feature"}</h3>
        <FgaPricingLayout
          user={user}
          onSuccess={() => {
            window.localStorage.setItem("FGAVipInfo", JSON.stringify({
              "level": 1,
              "type": "standard",
              "validEndDate": "2024-11-21T07:46:40.901Z"
            }))
            message.success("Payment success")
            setTimeout(() => {
              handleSuccessSkip()
            }, 1000)
          }}
        />
      </div>
    )
  }

  const renderContent = () => {
    if (isModal) {
      return renderProjectInfo()
    }
    return (
      <div className="flex flex-column" style={{ width: "100%", gap: 20 }}>
        <h2>Create Project</h2>
        <Steps current={current} items={items} onChange={(index) => {
          if (index === 0 && current === 1) {
            setCurrent(index)
          }
        }}/>
        <div className="flex flex-column pt2">
          {current === 0 && (renderCreateProject())}
          {current === 1 && (renderProjectInfo())}
          {current === 2 && (renderPricing())}
        </div>
      </div>
    );
  };

  if (!isModal) {
    return renderContent();
  }

  return (
    <Modal
      title={`Submit More Contact`}
      open={open}
      destroyOnClose
      footer={null}
      width={960}
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
    projectObject: getFgaProject(state),
  };
};

const mapDispatchToProps = {
  loadFgaProjectList: loadFgaProjectList,
  setUserExtend: setUserExtend,
  setFgaDashboardKey,
  loadCurrentFgaProjectById,
  onChangeLocation: push,
  replace,
  loadCurrentUserVipFGA,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateProjectModalForFgaPro));
