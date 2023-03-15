/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Modal,
  Input,
  message,
  Button,
  Form,
  Radio,
  Select,
  TimePicker,
  DatePicker,
} from "antd";
import { connect } from "react-redux";
import axios from "axios";
import Toggle from "metabase/core/components/Toggle";
import Icon from "metabase/components/Icon";
import {
  saveLatestGACampaigns,
  getLatestGACampaigns,
} from "metabase/growth/utils/utils";
import {
  loginModalShowAction,
  createFgaProjectModalShowAction,
} from "metabase/redux/control";
import ConfigEmail from "metabase/growth/components/config_panel/ConfigEmail";
import ConfigAirdrop from "metabase/growth/components/config_panel/ConfigAirdrop";
import { CreateFgaCampaign } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";

const CreateCampaign = ({
  style,
  user,
  setLoginModalShowAction,
  setCreateFgaProjectModalShowAction,
}) => {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [timingType, setTimingType] = useState("now");
  const [notifyType, setNotifyType] = useState("email");
  const [formValues, setFormValues] = useState();
  const [loading, setLoading] = useState(false);

  const [cohorts, setCohorts] = useState([
    { label: "Whales", value: 1 },
    { label: "Top100", value: 2 },
    { label: "Airdrop List", value: 3 },
  ]);

  const formRef = React.useRef(null);
  const onSave = () => {
    formRef?.current
      .validateFields()
      .then(() => {
        formRef?.current.submit();
      })
      .catch(errorInfo => {
        console.log("validate fail:", errorInfo);
      });
  };
  const onCreate = async () => {
    if (!user) {
      setIsNotificationModalOpen(false);
      message.warning("Please sign in before proceeding.");
      setLoginModalShowAction({
        show: true,
        from: "CreateCampaign",
        redirect: location.pathname,
        channel: "FGA",
      });
      return;
    }
    console.log("formValues", formValues);
    setLoading(true);
    const hide = message.loading("Loading... ", 0);
    const parms = {
      name: formValues?.campaignName,
      cohortIds: formValues?.targetCohort, // cohortId
      type: "email",
      email: {
        title: formValues?.emailTitle,
        content: formValues?.emailContent,
      },
    };
    // console.log("formValues parms", parms);
    try {
      const result = await CreateFgaCampaign(parms);
      if (result) {
        message.success("Create successfully");
        setIsNotificationModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    hide();
  };

  const getInputPanel = type => {
    switch (type) {
      case "email":
        return <ConfigEmail></ConfigEmail>;
      case "airdrop":
        return <ConfigAirdrop></ConfigAirdrop>;
    }
  };

  return (
    <>
      <Button
        type="primary"
        style={style}
        onClick={() => setIsNotificationModalOpen(true)}
      >
        Create Campaign
      </Button>
      <Modal
        style={{ minHeight: 800, minWidth: 600 }}
        open={isNotificationModalOpen}
        onCancel={() => setIsNotificationModalOpen(false)}
        onOk={onSave}
        // okText="Save"
        footer={[
          <Button key="back" onClick={() => setIsNotificationModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={onSave}
          >
            Create
          </Button>,
        ]}
        closable={false}
        title="Create Campaign"
      >
        <div className="bordered rounded bg-white p2">
          <Form
            ref={formRef}
            onFinish={onCreate}
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            noValidate={false}
            layout="horizontal"
            onValuesChange={(changedValues, allValues) => {
              setFormValues(allValues);
            }}
          >
            <Form.Item
              rules={[{ required: true }]}
              name={"campaignName"}
              label="Campaign Name"
            >
              <Input placeholder="Enter the campaign name" />
            </Form.Item>
            <Form.Item
              rules={[{ required: true }]}
              name={"targetCohort"}
              label="Target Cohort"
            >
              <Select
                placeholder="Select a target cohort"
                mode="multiple"
                options={cohorts}
              />
            </Form.Item>
            {/* <Form.Item label="Chekbox" name="disabled" valuePropName="checked">
              <Checkbox>Checkbox</Checkbox>
            </Form.Item> */}
            <Form.Item
              // rules={[{ required: true }]}
              name={"timingType"}
              label="Timing"
            >
              <Radio.Group
                defaultValue={"now"}
                onChange={e => {
                  setTimingType(e.target.value);
                }}
              >
                <Radio value="now">Right now</Radio>
                <Radio value="pickTime" disabled>
                  Pick a date&time{" "}
                </Radio>
              </Radio.Group>
            </Form.Item>
            {timingType === "pickTime" && (
              <Form.Item rules={[{ required: true }]} label="Target time">
                <DatePicker name={"targetDate"} />
                <TimePicker name={"targetTime"} />
              </Form.Item>
            )}
            <Form.Item
              // rules={[{ required: true }]}
              name={"notifyType"}
              label="Type"
            >
              <Radio.Group
                optionType="button"
                size="small"
                defaultValue={"email"}
                onChange={e => {
                  setNotifyType(e.target.value);
                }}
                buttonStyle="solid"
              >
                <Radio value="email">Email</Radio>
                <Radio value="airdrop" disabled>
                  Airdrop
                </Radio>
                <Radio value="quest" disabled>
                  Quest
                </Radio>
              </Radio.Group>
            </Form.Item>
            <>{getInputPanel(notifyType)}</>
            {/* <Form.Item label="Button">
          <Button>Button</Button>
        </Form.Item> */}
          </Form>
        </div>
      </Modal>
    </>
  );
};

const mapDispatchToProps = {
  setLoginModalShowAction: loginModalShowAction,
  setCreateFgaProjectModalShowAction: createFgaProjectModalShowAction,
};
const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateCampaign);
