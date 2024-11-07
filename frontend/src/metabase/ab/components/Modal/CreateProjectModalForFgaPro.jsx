/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, message, Modal, Result, Select, Steps, Table } from "antd";
import { withRouter } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { loadFgaProjectList, setFgaDashboardKey, setUserExtend } from "metabase/redux/control";
import { getUserExtend } from "metabase/selectors/control";
import { loadCurrentFgaProjectById } from "metabase/redux/user";
import { push, replace } from "react-router-redux";
import { CHAIN_LIST } from "metabase/submit/contract/components/ContractDetailsV4";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import _, { get } from "lodash";
import { findContractMatchByName, postProject, submitFGAContractForPro } from "metabase/new-service";
import { saveLatestGAProject, saveLatestGAProjectId } from "metabase/ab/utils/utils";
const { Option } = Select
const CreateProjectModalForFgaPro = props => {
  const { force, isModal, onCancel, onSuccess, loadFgaProjectList, loadCurrentFgaProjectById, setFgaDashboardKey } = props;
  const [form] = Form.useForm();
  const steps = [
    {
      title: 'Input your Project Name',
      content: 'First-content',
    },
    {
      title: 'Confirm Project Info',
      content: 'Second-content',
    },
  ];
  const [current, setCurrent] = useState(0);
  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [data, setData] = useState([]);
  const [projectName, setProjectName] = useState('');

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
          label="Project Name. E.g. Mocaverse"
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
    setData([...data, { key: uuidv4(), address: '', select: 'ERC1155', chain: 'Ethereum', checked: true }]);
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
      width: 100,
      render: (_, record) => (
        <Select
          value={record.chain}
          onChange={(value) => handleSelectChange('chain', value, record.key)}
          style={{ width: 100, fontSize: 12 }}
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
      width: 100,
      render: (_, record) => (
        <Select
          value={record.standard}
          onChange={(value) => handleSelectChange('select', value, record.key)}
          style={{ width: 100, fontSize: 12 }}
        >
          <Option value="ERC1155">ERC1155</Option>
          <Option value="ERC721">ERC721</Option>
          <Option value="ERC20">ERC20</Option>
        </Select>
      ),
    },
    {
      title: '',
      dataIndex: 'action',
      width: 60,
      render: (_, record) => (
        <Button type="link" onClick={() => handleDelete(record.key)}>
          <DeleteOutlined />
        </Button>
      ),
    },
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
        projectId: result?.projectId,
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
    await loadFgaProjectList({ from: "pro" });
    await loadCurrentFgaProjectById(result?.projectId, "edit-project")
    setFgaDashboardKey({ key: "pro" });
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
        ) : data.length > 0 ? (
          <div>
            <h2>Project: {projectName}</h2>
            <div style={{ marginBottom: 16 }}>
              <h4>The system has matched the following contracts through AI. Please select your contract for submission.</h4>
            </div>
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
              <Button onClick={handleAdd} type="primary" style={{ marginRight: 8 }}>
                Add a Contract
              </Button>
              <Button onClick={() => createProject(data)} loading={submitLoading} type="default">
                Submit Project Info
              </Button>
            </div>
          </div>
        ) : (
          <div>No project info found. Please add your contact.</div>
        )}
      </div>
    );
  }

  const renderContent = () => {
    return (
      <div className="flex flex-column" style={{ width: "100%", gap: 20 }}>
        <h2>Create Project</h2>
        <Steps current={current} items={items} />
        <div className="flex flex-column pt2">
          {current === 0 && (renderCreateProject())}
          {current === 1 && (renderProjectInfo())}
        </div>
      </div>
    );
  };

  if (!isModal) {
    return renderContent();
  }

  return (
    <Modal
      title={"Create your project"}
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
  replace,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateProjectModalForFgaPro));
