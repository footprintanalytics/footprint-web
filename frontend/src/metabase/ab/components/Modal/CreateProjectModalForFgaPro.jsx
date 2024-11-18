/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal, Result, Select, Steps, Table } from "antd";
import { withRouter } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { connect } from "react-redux";
import { push, replace } from "react-router-redux";
import { LoadingOutlined } from "@ant-design/icons";
import _, { get } from "lodash";
import { getFgaProject, getUser } from "metabase/selectors/user";
import { loadFgaProjectList, setFgaDashboardKey } from "metabase/redux/control";
import { getFgaProjectList } from "metabase/selectors/control";
import { loadCurrentFgaProjectById, loadCurrentUserVipFGA } from "metabase/redux/user";
import { CHAIN_LIST } from "metabase/submit/contract/components/ContractDetailsV4";
import { findContractMatchByName, postProject, submitFGAContractForPro } from "metabase/new-service";
import { saveLatestGAProject, saveLatestGAProjectId } from "metabase/ab/utils/utils";
import "metabase/pricing_v2/index.css";
import FgaPricingLayout from "metabase/ab/components/FgaPricingLayout";


const { Option } = Select
const CreateProjectModalForFgaPro = props => {
  const { force, isModal = false, open, onCancel, onSuccess, loadCurrentUserVipFGA, loadFgaProjectList, loadCurrentFgaProjectById, setFgaDashboardKey, projectObject, submitButtonText, user, fgaProjectList } = props;
  const [form] = Form.useForm();
  const isPayStandard = !!user?.vipInfoFga?.find(vipInfo => vipInfo.type === "fga_standard" && !vipInfo.isExpire);
  const steps = [
    {
      title: 'Input your Project Name',
      content: 'First-content',
    },
    {
      title: 'Confirm Project Info',
      content: 'Second-content',
    },
    !isModal && {
      title: 'Plans & Pricing',
      content: 'third-content',
    },
  ].filter(Boolean);
  const [current, setCurrent] = useState(!isPayStandard && fgaProjectList?.length > 1 ? 2 : 0); // 0: create project, 1: confirm project info, 2: pricing 如果用户已经创建 project，则在2，否则在0
  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  const [loading, setLoading] = useState(!isModal);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [data, setData] = useState([]);
  const [projectId, setProjectId] = useState();
  const [contractResult, setContractResult] = useState([]);
  const [projectName, setProjectName] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [addressForm] = Form.useForm()

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
    const addressResult = await findContractMatchByName(values)
    setContractResult(addressResult)
    const addressData = addressResult.map((item) => {
      return {
        ...item,
        key: uuidv4(),
      }
    })
    setData(addressData);
    setSelectedRowKeys(addressData.map((item) => item.key)); //选中
    setLoading(false);
  }

  const handleAdd = () => {
    const key = uuidv4()
    setData([{ key: key, address: '', standard: submitButtonText?.includes('Token') ? 'ERC20': 'ERC1155', chain: 'Ethereum' }, ...data]);
    setSelectedRowKeys((pre) => [...pre, key]);
  };

  const handleAddressChange = (value, key) => {
    setData(data.map(item => (item.key === key ? { ...item, address: value } : item)));
  };

  const handleChainChange = (field, value, key) => {
    setData(data.map(item => (item.key === key ? { ...item, [field]: value } : item)));
  };

  const columns = [
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
          onChange={(e) => handleAddressChange(e.target.value, record.key)}
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
          onChange={(value) => handleChainChange('chain', value, record.key)}
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
          onChange={(value) => handleChainChange('standard', value, record.key)}
          style={{ width: 110, fontSize: 12 }}
        >
          <Option value="ERC1155">ERC1155</Option>
          <Option value="ERC721">ERC721</Option>
          <Option value="ERC20">ERC20</Option>
        </Select>
      ),
    },
  ];

  const isValidAddress = contractAddress => {
    const regex = /^(0x)?[0-9a-fA-F]{40,}$/;
    const array = contractAddress.split("\n");
    return array.every(address => regex.test(get(address.split(","),"[0]")));
  };

  const createProject = async (data) => {
    const contractData = data.filter(item => selectedRowKeys.includes(item.key));
    const emptyInputs = contractData
      .map((item, index) => ({ ...item, index: contractData.indexOf(item) + 1 }))
      .filter(item => item.address.trim() === '');

    if (emptyInputs.length > 0) {
      const errorMessage = `Please fill in all input fields for checked items at row(s): ${emptyInputs.map(item => item.index).join(', ')}`;
      message.error(errorMessage);
      return;
    }

    const invalidAddresses = contractData.filter(item => !isValidAddress(item.address));

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
    onSuccess?.(result?.projectId || projectObject?.id);
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

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
          <Form
            form={addressForm}
            onFinish={() => createProject(data)}
          >
            <Form.Item label="Project Name" name="projectName" >
              <h2>{projectName || projectObject?.name}</h2>
            </Form.Item>
            {!projectObject && (<div style={{ marginBottom: 16 }}>
              <h4>{contractResult?.length > 0 ? "The system has matched the following contracts through AI. Please select your contract for submission." : "No project info found. Please add your contact."}</h4>
            </div>)}
            <Form.Item label="" name="table">
              <Table
                className="dark-scrollbar"
                columns={columns}
                dataSource={data}
                rowSelection={rowSelection}
                pagination={false}
                rowKey="key"
                scroll={{ y: 300 }}
                sticky
                style={{ overflow: 'hidden' }}
              />
            </Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
              <Button onClick={handleAdd} style={{ marginRight: 8 }}>
                Add a Contract
              </Button>
              <Button type="primary" htmlType="submit" loading={submitLoading} >
                {`${isModal ? "Submit" : "Submit Project Info"}`}
              </Button>
            </div>
          </Form>
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
          isPayStandard={isPayStandard}
          onSuccess={() => {
            message.success("Welcome to Footprint Growth Analytics")
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
        <h2>{"Welcome. Let's get started"}</h2>
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
    projectObject: getFgaProject(state),
    fgaProjectList: getFgaProjectList(state),
  };
};

const mapDispatchToProps = {
  loadFgaProjectList: loadFgaProjectList,
  setFgaDashboardKey,
  loadCurrentFgaProjectById,
  onChangeLocation: push,
  replace,
  loadCurrentUserVipFGA,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateProjectModalForFgaPro));
