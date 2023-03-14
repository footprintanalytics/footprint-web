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
import ConfigEmail from "metabase/growth/components/config_panel/ConfigEmail";
import ConfigAirdrop from "metabase/growth/components/config_panel/ConfigAirdrop";
import { CreateFgaCampaign } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";

const CreateCampaign = ({ style, user }) => {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [timingType, setTimingType] = useState("now");
  const [notifyType, setNotifyType] = useState("email");
  const [formValues, setFormValues] = useState();

  const [cohorts, setCohorts] = useState([
    { label: "Whales", value: "cohort id 1" },
    { label: "Top100", value: "cohort id 2" },
    { label: "Airdrop List", value: "cohort id 3" },
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
      message.warning("Please sign in before proceeding.");
      return;
    }
    const hide = message.loading("Loading... ", 0);
    const parms = {
      name: formValues?.campaignName,
      eligibility: [formValues?.targetCohort], // cohortId
      task: [
        {
          type: "message",
          timing: "", //if this campaign need to seed now, then don`t fill this fild
          detail: {
            title: formValues?.emailTitle,
            content: formValues?.emailContent,
          },
        },
      ],
    };
    const result = await CreateFgaCampaign(parms);
    if (result) {
      hide();
      message.success("Send successfully");
      setIsNotificationModalOpen(false);
    }
    // await axios.post(
    //   "https://app.internal.footprint.network/api/v0/task/notify",
    //   body,
    // );
    // setTimeout(() => {
    //   hide();
    //   message.success("Creating successfully");
    //   setIsNotificationModalOpen(false);
    // }, 2000);
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
        okText="Save"
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
              <Select placeholder="Select a target cohort" options={cohorts} />
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
                onChange={e => {
                  setTimingType(e.target.value);
                }}
              >
                <Radio value="now" defaultChecked>
                  Right now
                </Radio>
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
                onChange={e => {
                  setNotifyType(e.target.value);
                }}
                buttonStyle="solid"
              >
                <Radio value="email" defaultChecked>
                  Email
                </Radio>
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
const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(CreateCampaign);
