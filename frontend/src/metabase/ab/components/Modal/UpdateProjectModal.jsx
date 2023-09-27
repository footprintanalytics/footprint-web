/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Modal,
  Select,
  Button,
  Input,
  Form,
  message,
  Divider,
  Typography,
} from "antd";
import Link from "antd/lib/typography/Link";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { UpdateFgaProject, GetAllProtocol } from "metabase/new-service";
import { getFgaProject, getUser } from "metabase/selectors/user";
import { loadCurrentFgaProject } from "metabase/redux/user";
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

const UpdateProjectModal = props => {
  const { open, onCancel, onSuccess, router, location, user, force,project } = props;
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoadingData(true);
      GetAllProtocol()
        .then(result => {
          console.log('GetAllProtocol', result);
          const normalOptions = [];
          result?.data?.map(i => {
            normalOptions.push({
              protocol_slug:i.protocolSlug,
              protocol_name:i.protocolName,
              value: i.protocolSlug,
              key: i.protocolSlug,
              label: i.protocolName,
            });
          });
          setOptions(normalOptions);
        })
        .finally(() => {
          setLoadingData(false);
        });
    }
  }, [open]);
  const loadProjectDetail = project_id => {
    props.dispatch(loadCurrentFgaProject(parseInt(project_id),true));
  };
  function updateProject(projectName, protocol) {
    const hide = message.loading("Loading...", 10);
    setLoading(true);
    UpdateFgaProject({
      projectId:project?.id,
      name: projectName.trim().replaceAll(" ", "-"),
      protocolSlug: protocol,
      protocolName: projectName,
      creatorId: user.id,
      nftContractAddress: [],
    })
      .then(result => {
        loadProjectDetail(project?.id)
        saveLatestGAProject(result.protocolSlug);
        saveLatestGAProjectId(result.id);
        onSuccess?.();
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
    updateProject(values.projectName, values.protocol);
  };

  const handleProjectChange = (value, option) => {
    form.setFieldsValue({ projectName: option.label });
  };
  return (
    <Modal
      title="Set up protocol"
      open={open}
      footer={null}
      closable={!force}
      maskClosable={!force}
      // onOk={handleOk}
      onCancel={onCancel}
    >
      <Divider />
      {force && (
        <div style={{ marginBottom: 20 }}>
          <Typography.Text type="warning">
            {
              "Before embarking on your magical FGA journey, please choose a project that you fancy."
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
            dropdownStyle={{
              background: "#1C1C1E",
              color: "white",
              border: "1px solid #ffffff30"
            }}
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
            <Button
              type="primary"
              htmlType="submit"
              loading={loading || loadingData}
            >
              Set up now
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
        <Link
          onClick={() => {
            router?.push({ pathname: "/fga/submit/contract/add" });
          }}
        >
          Can not find the protocol? Submit now!
        </Link>
      </div>
    </Modal>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
    project: getFgaProject(state),
  };
};

export default withRouter(connect(mapStateToProps)(UpdateProjectModal));
