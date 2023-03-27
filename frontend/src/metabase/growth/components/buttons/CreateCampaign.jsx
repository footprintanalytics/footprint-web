/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Modal,
  Input,
  message,
  Avatar,
  Button,
  Form,
  Radio,
  Segmented,
  Tooltip,
  Select,
  TimePicker,
  DatePicker,
} from "antd";
import { connect } from "react-redux";
import Icon from "metabase/components/Icon";
import quest from "assets/img/quest.svg";
import airdrop from "assets/img/airdrop.svg";
import message_icon from "assets/img/message.svg";
import {
  getLatestGAProjectId,
  getDashboardDatas,
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
  plain
}) => {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [timingType, setTimingType] = useState("now");
  const [notifyType, setNotifyType] = useState("email");
  const [formValues, setFormValues] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingCohort, setLoadingCohort] = useState(false);
  const [cohorts, setCohorts] = useState([]);

  useEffect(() => {
    if (isNotificationModalOpen) {
      setLoadingCohort(true);
      getDashboardDatas("1f158646-3dd1-440c-969c-45348b9390ee")
        .then(result => {
          const cohorts = [];
          result?.map(i => {
            cohorts.push({ label: i.title, value: i.cohort_id });
          });
          setCohorts(cohorts);
        })
        .finally(() => {
          setLoadingCohort(false);
          if (!getLatestGAProjectId()) {
            setCohorts([
              { label: "Airdrop White List", value: 1 },
              { label: "Top 500 of Project", value: 2 },
              { label: "Potential Users", value: 3 },
            ]);
          }
        });
    }
  }, [isNotificationModalOpen]);

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
    const projectId = getLatestGAProjectId();
    if (!projectId) {
      setIsNotificationModalOpen(false);
      message.warning("Please create your project before proceeding.");
      setCreateFgaProjectModalShowAction({ show: true });
      return;
    }
    console.log("formValues", formValues);
    setLoading(true);
    try {
      const result = getRequest(campaignType, formValues, projectId);
      if (result) {
        message.success("Create successfully");
        setIsNotificationModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const getRequest = async (type, formValues, projectId) => {
    switch (type) {
      case "Notification":
        return await CreateFgaCampaign({
          name: formValues?.campaignName,
          cohortIds: formValues?.targetCohort, // cohortId
          type: "email",
          projectId: parseInt(projectId, 10),
          email: {
            title: formValues?.emailTitle,
            content: formValues?.emailContent,
          },
        });
      case "Twitter":
        return { success: true };
      case "Discord":
        return { success: true };
    }
  };

  const getInputPanel = type => {
    switch (type) {
      case "email":
        return <ConfigEmail></ConfigEmail>;
      case "airdrop":
        return <ConfigAirdrop></ConfigAirdrop>;
    }
  };
  const campaignOptions = [
    {
      label: (
        <div style={{ padding: 4 }}>
          <Avatar src="https://footprint-imgs-hk.oss-cn-hongkong.aliyuncs.com/20220516201254.png" />
          <div>Twitter</div>
        </div>
      ),
      value: "Twitter",
    },
    {
      label: (
        <div style={{ padding: 4 }}>
          <Avatar src="https://footprint-imgs-hk.oss-cn-hongkong.aliyuncs.com/20220516201343.png" />
          <div>Discord</div>
        </div>
      ),
      value: "Discord",
    },
    {
      label: (
        <div style={{ padding: 4 }}>
          <Avatar src={message_icon} />
          <div>Notification</div>
        </div>
      ),
      value: "Notification",
    },
    {
      label: (
        <div style={{ padding: 4 }}>
          <Avatar src={airdrop} />
          <div>Airdrop</div>
        </div>
      ),
      value: "Airdrop",
      disabled: true,
    },
    {
      label: (
        <div style={{ padding: 4 }}>
          <Avatar src={quest}></Avatar>
          <div>Quest</div>
        </div>
      ),
      value: "Quest",
      disabled: true,
    },
  ];
  const [campaignType, setCampaignType] = useState(campaignOptions[0].value);
  return (
    <>
      {plain ? (
        <div onClick={() => setIsNotificationModalOpen(true)}>Create Campaign</div>
      ) : (
        <Button
          type="primary"
          style={style}
          onClick={() => setIsNotificationModalOpen(true)}
        >
          Create Campaign
        </Button>
      )}
      <Modal
        style={{ minHeight: 800, minWidth: 600 }}
        // open={isNotificationModalOpen}
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
                loading={loadingCohort}
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
            Next
          </Button>,
        ]}
        closable={false}
        title="Create Campaign"
      >
        <div className="">
          <Segmented
            style={{ padding: 5 }}
            block
            options={campaignOptions}
            defaultValue={campaignOptions[0].key}
            onChange={value => {
              console.log("Segmented onChange", value);
              setCampaignType(value);
            }}
          />
          <Form
            ref={formRef}
            className="mt2"
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
              name={"CampaignName"}
              label="Campaign Name"
            >
              <Input placeholder="Enter the campaign name" />
            </Form.Item>
            {campaignType === "Notification" && (
              <>
                <Form.Item
                  rules={[{ required: true }]}
                  name={"TargetCohort"}
                  label="Target Cohort"
                >
                  <Select
                    placeholder="Select a target cohort"
                    mode="multiple"
                    loading={loadingCohort}
                    options={cohorts}
                  />
                </Form.Item>
                {/* <Form.Item
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
            </Form.Item> */}
                {/* {timingType === "pickTime" && (
              <Form.Item rules={[{ required: true }]} label="Target time">
                <DatePicker name={"targetDate"} />
                <TimePicker name={"targetTime"} />
              </Form.Item>
            )} */}
                <Form.Item
                  // rules={[{ required: true }]}
                  name={"notifyType"}
                  label="Type"
                >
                  <Segmented
                    options={[
                      { label: "Email", value: "email" },
                      { label: "SMS", value: "sms", disabled: false },
                    ]}
                    value={notifyType}
                    onChange={setNotifyType}
                  />
                  {/* <Radio.Group
                    optionType="button"
                    size="small"
                    style={{ borderRadius: 5 }}
                    defaultValue={"email"}
                    onChange={e => {

                    }}
                    buttonStyle="solid"
                  >
                    <Radio value="email">Email</Radio>
                    <Radio value="sms" disabled>
                      SMS
                    </Radio>
                  </Radio.Group> */}
                </Form.Item>
                <>{getInputPanel(notifyType)}</>
              </>
            )}
            {campaignType === "Twitter" && (
              <>
                <Form.Item
                  rules={[{ required: true }]}
                  name={"TweetUrl"}
                  label={
                    <Tooltip
                      placement="topLeft"
                      title="Currently, only tweet tracking within the past 7 days is
                  supported."
                    >
                      <div className="flex flex-row items-center">
                        Tweet Url
                        <Icon name={"question"} className=" ml1" size={14} />
                      </div>
                    </Tooltip>
                  }
                >
                  <Input placeholder="Please provide the URL of the tweet you wish to track." />
                </Form.Item>
              </>
            )}
            {campaignType === "Discord" && (
              <>
                <Form.Item
                  rules={[{ required: true }]}
                  name={"GuildId"}
                  label={
                    <Tooltip
                      placement="topLeft"
                      title="The guild ID can be found in the first set of numbers within your guild's link."
                    >
                      <div className="flex flex-row items-center">
                        Guild Id
                        <Icon name={"question"} className=" ml1" size={14} />
                      </div>
                    </Tooltip>
                  }
                >
                  <Input
                    inputMode="numeric"
                    placeholder="Please provide the id of your targe guild."
                  />
                </Form.Item>
              </>
            )}
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
