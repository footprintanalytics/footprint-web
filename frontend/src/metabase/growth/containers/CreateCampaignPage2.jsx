/* eslint-disable react/prop-types */
import { Link } from "react-router";
import React, { useEffect, useState } from "react";
import {
  Divider,
  Steps,
  Checkbox,
  Select,
  Button,
  Form,
  Dropdown,
  Input,
  Segmented,
  Switch,
  message,
} from "antd";
import { connect } from "react-redux";
import { useQuery } from "react-query";
import Title from "antd/lib/typography/Title";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { getCampaignTemplate } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import {
  loginModalShowAction,
  createFgaProjectModalShowAction,
} from "metabase/redux/control";
import UploadWallets from "../components/buttons/UploadWallets";
import "../css/utils.css";
import { getGrowthProjectPath } from "../utils/utils";
const steps = [
  // {
  //   title: "Start",
  //   key: "Start",
  //   // description: "Start to Config campaign",
  // },
  {
    title: "Content",
    key: "Campaign",
    // description: "Config your campaign basic info",
  },
  {
    title: "Cohort",
    key: "Cohort",
    // description: "Config the cohort of this campaign",
  },
  {
    title: "Channel",
    key: "Channel",
    // description: "Setup the notification of this campaign",
  },
  // {
  //   title: "Finish",
  //   key: "Finish",
  //   // description: "Campaign config successfully",
  // },
];
const { Option } = Select;
const { TextArea } = Input;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};
const CreateCampaignPage2 = props => {
  const {
    router,
    location,
    children,
    project,
    user,
    setLoginModalShowAction,
    setCreateFgaProjectModalShowAction,
  } = props;
  const [current, setCurrent] = useState(1);
  const [isSubmiting, setSubmiting] = useState(false);
  const [cohortOption, setCorhortOption] = useState(false);
  const [channelOption, setChannelOption] = useState(false);
  const [channelOptionValue, setChannelOptionValue] = useState();
  const [campaignType, setCampaignType] = useState("User contact");
  const formRef = React.useRef(null);

  const { isLoading, data } = useQuery(
    ["getCampaignTemplate"],
    getCampaignTemplate,
    QUERY_OPTIONS,
  );

  const items = [
    {
      key: "1",
      label: (
        <Link
          href={getGrowthProjectPath(project?.projectName, "Potential Users")}
          target="_blank"
        >
          Filter Wallets
        </Link>
      ),
    },
    {
      key: "2",
      label: <UploadWallets />,
    },
  ];

  useEffect(() => {
    if (!isLoading) {
      console.log("getCampaignTemplate data", data);
    }
  }, [isLoading]);

  useEffect(() => {
    if (channelOption) {
      setCurrent(3);
    } else if (cohortOption) {
      setCurrent(2);
    } else {
      setCurrent(1);
    }
  }, [current, channelOption, cohortOption]);

  const onFinish = values => {
    //todo 提交表单到 api，成功之后 onNext
    // if (currentCampaign?.campaignType === "mapping") {
    //   const param = { ...currentParam, ...values };
    //   console.log("onFinish param", param);
    //   setCurrentParam(param);
    //   toAddCampaign(param);
    // } else {
    //   onNext();
    // }
    message.success("Create campaign successfully");
    router.push({
      pathname: getGrowthProjectPath(project?.projectName, "CampaignDetail"),
      query: { id: 1 },
    });
  };

  return (
    <div className=" flex flex-column items-center">
      <div
        style={{
          width: 800,
          // backgroundColor: "white",
          borderRadius: 10,
          padding: 20,
          marginTop: 20,
          minHeight: 800,
        }}
      >
        <div className=" flex flex-row justify-between w-full">
          <Title width={"100%"} level={4} style={{ marginBottom: 0 }}>
            Create Campaign
          </Title>
        </div>
        <Divider></Divider>
        {isLoading ? (
          <LoadingSpinner message="Loading..." />
        ) : (
          <div className="flex flex-row mt3 bg-white rounded p3 full-width">
            <Steps
              current={current ? current - 1 : 0}
              // className="mt-5 px-10"
              className="full-height"
              direction="vertical"
              size="small"
              style={{ padding: 0, width: "20%", marginTop: 20 }}
              items={steps}
            />
            {/* <Divider className=" full-height" type="vertical" /> */}
            <div
              style={{ height: "100%", width: "80%" }}
              className="flex flex-column pl2 border-left"
            >
              <Form
                className=" bg-white rounded-md w-full"
                {...layout}
                labelWrap
                // initialValues={currentParam}
                ref={formRef}
                scrollToFirstError={true}
                layout="horizontal"
                name="control-ref"
                labelAlign="left"
                onFinish={onFinish}
                style={{ width: "100%" }}
              >
                <div className="flex flex-row items-center justify-between">
                  <Title level={5}>{"Content"}</Title>
                </div>
                <div className="bg-light rounded p1 mt1 pt3">
                  <Form.Item
                    name="campaignType"
                    label="Campaign Type"
                    rules={[{ required: true }]}
                  >
                    <Segmented
                      style={{ padding: 5 }}
                      onChange={value => {
                        setCampaignType(value);
                      }}
                      options={[
                        "User contact",
                        {
                          label: "Notification",
                          value: "Notification",
                          disabled: false,
                        },
                        { label: "Airdrop", value: "Airdrop", disabled: true },
                        { label: "Quest", value: "Quest", disabled: true },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    name="campaignName"
                    label="Campaign Name"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Input the name of this new campaign" />
                  </Form.Item>
                </div>
                {campaignType === "Notification" && (
                  <>
                    <div className="mt1">
                      1 step to setup notification content
                    </div>
                    <div className="bg-light rounded p1 mt1  pt3">
                      <Form.Item
                        name="messageTitle"
                        label="Title"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Input the title of message" />
                      </Form.Item>
                      <Form.Item
                        name="messageContent"
                        label="Content"
                        rules={[{ required: true }]}
                      >
                        <TextArea
                          // value={pasteValue}
                          style={{ marginTop: 0 }}
                          onChange={e => {
                            // setPasteValue(e.target.value);
                          }}
                          placeholder="Input the content of message"
                          autoSize={{ minRows: 5, maxRows: 10 }}
                        />
                      </Form.Item>
                    </div>
                  </>
                )}
                <div className="flex flex-row items-center justify-between mt2">
                  <Title level={5}>{`Cohort ${
                    campaignType === "User contact" ? "(optional)" : "(require)"
                  }`}</Title>
                  <Switch
                    defaultChecked={cohortOption}
                    onChange={checked => {
                      setCorhortOption(checked);
                    }}
                  />
                </div>
                {cohortOption && (
                  <div className="bg-light rounded p1 mt1  pt3">
                    <Form.Item
                      rules={[{ required: true }]}
                      name={"TargetCohort"}
                      label="Target Cohort"
                    >
                      <Select
                        placeholder="Select a target cohort"
                        mode="multiple"
                        // loading={loadingCohort}
                        options={[
                          { label: "Airdrop White List", value: 1 },
                          { label: "Top 500 of Project", value: 2 },
                          { label: "Potential Users", value: 3 },
                        ]}
                      />
                    </Form.Item>
                    <div className="flex flex-row-reverse">
                      <Dropdown menu={{ items }}>
                        <Button size="small" type="dashed">
                          Create cohort
                        </Button>
                      </Dropdown>
                    </div>
                  </div>
                )}
                <div className="flex flex-row items-center justify-between mt2">
                  <Title level={5}>{`Channel ${
                    campaignType === "User contact" ? "(optional)" : "(require)"
                  }`}</Title>
                  <Switch
                    defaultChecked={cohortOption}
                    onChange={checked => {
                      setChannelOption(checked);
                    }}
                  />
                </div>
                {channelOption && (
                  <div className="bg-light rounded p1 mt1  pt3">
                    <Form.Item
                      rules={[{ required: true }]}
                      name={"TargetChannel"}
                      label="Target Channel"
                    >
                      <Select
                        placeholder="Select a target channel"
                        mode="multiple"
                        onChange={value => {
                          setChannelOptionValue(value);
                        }}
                        // loading={loadingCohort}
                        options={
                          campaignType === "User contact"
                            ? [
                                { label: "Discord bot", value: "discordBot" },
                                { label: "Tweet URL", value: "tweetURL" },
                                {
                                  label: "Webpage",
                                  value: "webpage",
                                  disabled: true,
                                },
                              ]
                            : [
                                { label: "Discord", value: "discord" },
                                { label: "Tweet", value: "tweet" },
                                {
                                  label: "Email",
                                  value: "Email",
                                  disabled: false,
                                },
                                {
                                  label: "SMS",
                                  value: "SMS",
                                  disabled: true,
                                },
                              ]
                        }
                      />
                    </Form.Item>
                    <div className="flex flex-row-reverse">
                      <Button
                        target="_blank"
                        href={getGrowthProjectPath(
                          project?.projectName,
                          "Channel",
                        )}
                        size="small"
                        type="dashed"
                      >
                        Config more channel
                      </Button>
                    </div>
                  </div>
                )}
                {channelOptionValue?.includes("discordBot") && (
                  <>
                    <div className="mt1">1 step to setup discord bot</div>
                    <div className="bg-light rounded p1 mt1">
                      <div className="mt1">
                        Which user contact you want to collect?
                      </div>
                      <Checkbox.Group
                        className="mt1"
                        options={[
                          {
                            label: "Wallet address",
                            value: "WalletAddress",
                            disabled: true,
                          },
                          {
                            label: "Discord hanlder",
                            value: "DiscordHanlder",
                            disabled: true,
                          },
                          { label: "Twitter handler", value: "TwitterHandler" },
                          { label: "Email", value: "Email" },
                        ]}
                        defaultValue={["WalletAddress", "DiscordHanlder"]}
                        onChange={value => {
                          console.log(value);
                        }}
                      />
                    </div>
                  </>
                )}
                {channelOptionValue?.includes("tweetURL") && (
                  <>
                    <div className="mt1">1 step to setup tweet URL</div>
                    <div className="bg-light rounded p1 mt1  pt3">
                      <Form.Item
                        name="TweetURL"
                        label="Tweet URL"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Input the URL of tweet which you want to tracking." />
                      </Form.Item>
                    </div>
                  </>
                )}
                <Form.Item {...tailLayout} className="mt3 mb0">
                  <div className="flex w-full flex-row-reverse">
                    <Button
                      htmlType="button"
                      // onClick={onNext}
                      className="ml-10"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className=" bg-blue-500"
                      loading={isSubmiting}
                    >
                      Create
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
      </div>
    </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateCampaignPage2);
