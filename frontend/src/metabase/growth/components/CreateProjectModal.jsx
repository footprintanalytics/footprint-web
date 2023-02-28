/* eslint-disable react/prop-types */
import React, { createContext, useEffect } from "react";
import { Modal, Select, Button, Input, Form, message } from "antd";
import Link from "antd/lib/typography/Link";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { useQuery } from "react-query";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { CreateFgaProject, GetFgaProject } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

const CreateProjectModal = props => {
  const { open, onCancel } = props;
  const [form] = Form.useForm();
  // monitor datas
  const normalOptions = [
    {
      value: "BAYC",
      key: "BAYC",
      label: "BAYC",
    },
    {
      value: "Moonbird",
      key: "Moonbird",
      label: "Moonbird",
    },
    {
      value: "AlienWar",
      key: "AlienWar",
      label: "AlienWar",
    },
    {
      value: "Decentraland",
      key: "Decentraland",
      label: "Decentraland",
    },
    {
      value: "FootprintNFT",
      key: "FootprintNFT",
      label: "FootprintNFT",
    },
    {
      value: "Era7",
      key: "Era7",
      label: "Era7",
    },
    {
      value: "the-sandbox",
      key: "the-sandbox",
      label: "The Sandbox",
    },
    {
      value: "sunflower-farmers",
      key: "sunflower-farmers",
      label: "Sunflower Farmers",
    },
  ];

  // const { isLoading, data } = useQuery(
  //   ["GetFgaProject"],
  //   async () => {
  //     return await GetFgaProject();
  //   },
  //   QUERY_OPTIONS,
  // );
  // useEffect(() => {
  //   if (!isLoading) {
  //     console.log("project", data);
  //   }
  // }, [isLoading]);

  async function createProject(projectName, protocol) {
    console.log(projectName, protocol);
    const hide = message.loading("Loading...", 0);
    const result = await CreateFgaProject({
      name: projectName,
      protocolSlug: protocol,
      nftContractAddress: [],
    });
    console.log("result", result);
    hide();
    return true;
  }
  const onFinish = values => {
    // values = {
    //    "projectName": "sasa",
    //    "protocol": "the-sandbox2"
    //  }
    console.log(values);
    createProject(values.projectName, values.protocol);
  };

  return (
    <Modal
      title="Create your own project"
      open={open}
      footer={null}
      // onOk={handleOk}
      onCancel={onCancel}
    >
      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item
          name="projectName"
          label="Project Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="protocol"
          label="Protocol"
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            // value={currentProject}
            // onChange={handleProjectChange}
            placeholder="Select the protocol of your project"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={normalOptions}
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <div
            className="flex flex-column"
            style={{
              width: "100%",
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            <Button type="primary" htmlType="submit">
              Create Now
            </Button>
          </div>
        </Form.Item>
      </Form>
      <div
        className="flex flex-column"
        style={{
          width: "100%",
          alignItems: "center",
          justifyItems: "center",
          marginTop: 10,
        }}
      >
        <Link href="submit/contract/add">
          Can not find the protocol? Submit now!
        </Link>
      </div>
    </Modal>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default withRouter(connect(mapStateToProps)(CreateProjectModal));
