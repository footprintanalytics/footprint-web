/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useState } from "react";
import { Modal, Select, Button, Input, Form, message } from "antd";
import Link from "antd/lib/typography/Link";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { useQuery } from "react-query";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { CreateFgaProject, GetFgaProject } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";
import { top_protocols } from "../utils/data";
import {
  getGrowthProjectPath,
  saveLatestGAProject,
  saveLatestGAProjectId,
} from "../utils/utils";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

const CreateProjectModal = props => {
  const { open, onCancel, onSuccess, router, location, user } = props;
  const [form] = Form.useForm();
  // monitor datas
  const normalOptions = [];
  top_protocols.map(i =>
    normalOptions.push({
      ...i,
      value: i.protocol_slug,
      key: i.protocol_slug,
      label: i.protocol_name,
    }),
  );
  const [options, setOptions] = useState(normalOptions);

  async function createProject(projectName, protocol) {
    const hide = message.loading("Loading...", 10);
    const result = await CreateFgaProject({
      name: projectName.trim().replaceAll(" ", "-"),
      protocolSlug: protocol,
      nftContractAddress: [],
    });
    if (result) {
      saveLatestGAProject(result.protocolSlug);
      saveLatestGAProjectId(result.id);
      onSuccess?.();
      router?.push({
        pathname: getGrowthProjectPath(result.protocolSlug),
      });
    }
    hide();
    return true;
  }
  const onFinish = values => {
    createProject(values.projectName, values.protocol);
  };

  const handleProjectChange = (value, option) => {
    form.setFieldsValue({ projectName: option.label });
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
          name="protocol"
          label="Protocol"
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            // value={currentProject}
            onChange={handleProjectChange}
            placeholder="Search by protocol or nft collection address"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase()) ||
              (option?.collections_list ?? [])
                .join(",")
                .includes(input.toLowerCase())
            }
            options={options}
          />
        </Form.Item>
        <Form.Item
          hidden
          name="projectName"
          label="Project Name"
          rules={[{ required: true }]}
        >
          <Input />
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
        <Link href="growth/submit/contract/add">
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
