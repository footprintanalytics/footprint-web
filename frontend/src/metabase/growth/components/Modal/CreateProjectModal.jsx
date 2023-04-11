/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Modal, Select, Button, Input, Form, message,Divider,Typography } from "antd";
import Link from "antd/lib/typography/Link";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { CreateFgaProject } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";
import {
  getDashboardDatas,
  getGrowthProjectPath,
  saveLatestGAProject,
  saveLatestGAProjectId,
} from "../../utils/utils";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

const CreateProjectModal = props => {
  const { open, onCancel, onSuccess, router, location, user,force } = props;
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoadingData(true);
      // old uuid 5276dcf1-0e5f-49d1-a49a-c405d2caa3d4
      // new uuid af524d7d-d565-429b-af91-d3028f5ee8ad
      getDashboardDatas("5276dcf1-0e5f-49d1-a49a-c405d2caa3d4")
        .then(result => {
          const normalOptions = [];
          result?.map(i => {
            normalOptions.push({
              ...i,
              value: i.protocol_slug,
              key: i.protocol_slug,
              label: i.protocol_name,
            });
          });
          setOptions(normalOptions);
        })
        .finally(() => {
          setLoadingData(false);
        });
    }
  }, [open]);

  async function createProject(projectName, protocol) {
    const hide = message.loading("Loading...", 10);
    setLoading(true);
    try {
      const result = await CreateFgaProject({
        name: projectName.trim().replaceAll(" ", "-"),
        protocolSlug: protocol,
        protocolName: projectName,
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
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
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
      <Divider />
      {force && (
        <div style={{ marginBottom: 20 }}>
          <Typography.Text mark>
            {
              "Before embarking on your magical FGA journey, please choose a project that you fancy"
            }
          </Typography.Text>
        </div>
      )}
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
          label="Protocol"
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            loading={loadingData}
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
            <Button type="primary" htmlType="submit" loading={loading}>
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
