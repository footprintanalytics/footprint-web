/* eslint-disable react/prop-types */
import { Link } from "react-router";
import { SettingOutlined } from "@ant-design/icons";
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
import {
  getCampaignTemplate,
  GetFgaCohort,
  addCampaign,
} from "metabase/new-service";
import { getUser } from "metabase/selectors/user";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import {
  loginModalShowAction,
  createFgaProjectModalShowAction,
} from "metabase/redux/control";
import "../css/utils.css";
import { getGrowthProjectPath, getLatestGAProjectId } from "../utils/utils";
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmiting, setSubmiting] = useState(false);
  const [steps, setSteps] = useState([]);
  const [channelSelectedValue, setChannelSelectedValue] = useState([]);
  const [cohortDataOptions, setCohortDataOptions] = useState([]);
  const [cohortSelectedValue, setCohortSelectedValue] = useState([]);
  const [campaignTemplates, setCampaignTemplates] = useState();
  const [channelTemplates, setChannelTemplates] = useState();
  const [campaignSelected, setCampaignSelected] = useState(null);
  const formRef = React.useRef(null);

  const { isLoading, data } = useQuery(
    ["getCampaignTemplate"],
    getCampaignTemplate,
    QUERY_OPTIONS,
  );

  const { isLoading: isLoadingCohort, data: cohortData } = useQuery(
    ["getCohort", campaignSelected?.campaignType],
    async () => {
      if (campaignSelected?.cohortRequired) {
        return await GetFgaCohort();
      } else {
        return;
      }
    },
  );

  useEffect(() => {
    if (cohortData) {
      const options = [];
      cohortData?.list?.forEach(item => {
        options.push(
          <Option key={item.cohortId} label={item.title} value={item.cohortId}>
            <div className="flex flex-row items-center justify-between">
              <div>{item.title}</div>
              <div style={{ color: "GrayText" }}>
                {item.numberOfWallets} wallets
              </div>
            </div>
          </Option>,
        );
      });
      setCohortDataOptions(options);
    }
  }, [cohortData]);

  useEffect(() => {
    if (!isLoading) {
      const templates = [];
      data?.list?.forEach(item => {
        templates.push({
          key: item.campaignType,
          label: item.campaignName ?? item.campaignType,
          // description: item.description,
          value: item.campaignType,
          disabled: item.status !== "enable",
          ...item,
        });
      });
      setCampaignTemplates(templates);
      if (!campaignSelected) {
        setCampaignSelected(templates[0]);
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (campaignSelected) {
      const templates = [];
      campaignSelected?.channels?.forEach(item => {
        templates.push({
          key: item.channelName,
          label: item.channelName,
          value: item.channelName,
          disabled: item.disabled,
          ...item,
        });
      });
      setChannelTemplates(templates);
      setSteps(
        campaignSelected?.cohortRequired
          ? [
              {
                title: "Content",
                key: "Campaign",
              },
              {
                title: "Cohort",
                key: "Cohort",
              },
              {
                title: "Channel",
                key: "Channel",
              },
            ]
          : [
              {
                title: "Content",
                key: "Campaign",
              },
              {
                title: "Channel",
                key: "Channel",
              },
            ],
      );
    }
  }, [campaignSelected]);

  useEffect(() => {
    if (channelSelectedValue?.length > 0) {
      setCurrentStep(steps?.findIndex(item => item.key === "Channel") + 1);
    } else if (cohortSelectedValue?.length > 0) {
      setCurrentStep(steps?.findIndex(item => item.key === "Cohort") + 1);
    } else {
      setCurrentStep(1);
    }
  }, [currentStep, channelSelectedValue, cohortSelectedValue]);

  const getChannelConfigPanel = details => {
    return (
      <>
        {details?.map(detail => {
          if (detail.type === "checkbox") {
            const options = [];
            const defaultValue = [];
            detail.options?.forEach(item => {
              if (item.value === true) {
                defaultValue.push(item.key);
              }
              options.push({
                label: item.title,
                value: item.key,
                // key: item.key,
                disabled: item.notEdit,
              });
            });
            return (
              <>
                <div className="mt1">
                  {detail.title}
                  {detail.required && <span className="text-red">*</span>}
                </div>
                <Form.Item
                  key={detail.key}
                  name={detail.key}
                  {...tailLayout}
                  initialValue={defaultValue}
                  valuePropName="value"
                  // label={detail.title}
                  rules={[{ required: detail.required }]}
                >
                  <Checkbox.Group className="mt1" options={options} />
                </Form.Item>
              </>
            );
          } else if (detail.type === "string") {
            return (
              <>
                <Form.Item
                  key={detail.key}
                  name={detail.key}
                  layout={tailLayout}
                  initialValue={detail.value}
                  valuePropName="value"
                  label={detail.title}
                  rules={[{ required: detail.required }]}
                >
                  <Input
                    allowClear
                    disabled={detail.notEdit}
                    placeholder={`Input the ${detail.title}.`}
                    type={
                      detail.private
                        ? "password"
                        : detail.type === "string"
                        ? "text"
                        : detail.type
                    }
                  />
                </Form.Item>
              </>
            );
          }
        })}
      </>
    );
  };

  const onFinish = param => {
    console.log("onFinish values", param);
    if (!user) {
      message.warning("Kindly log in before proceeding.");
      setLoginModalShowAction({
        show: true,
        from: "create campaign",
        redirect: location.pathname,
        channel: "FGA",
      });
      return;
    }
    if (!getLatestGAProjectId()) {
      message.warning("Initially, you must create your personal project!");
      setCreateFgaProjectModalShowAction({ show: true });
      return;
    }
    setSubmiting(true);
    // 组装 campaign 的参数
    const campaignDetails = {};
    campaignSelected?.details?.map(detail => {
      if (detail.type === "checkbox") {
        // 把 checkbox 的选中项的 key 放到 details 里
        detail.options?.map(detailOption => {
          campaignDetails[detailOption.key] = param[detail.key]?.includes(
            detailOption.key,
          );
        });
      } else {
        campaignDetails[detail.key] = param[detail.key];
      }
    });
    // 组装 channel 的参数
    const channelsParam = [];
    channelSelectedValue?.map(channel => {
      const channelParam = {
        id: channel.id,
        channelName: channel.channelName,
        campaignType: channel.campaignType,
        details: {},
      };
      channel?.details?.map(channelDetailItem => {
        if (channelDetailItem.type === "checkbox") {
          // 把 checkbox 的选中项的 key 放到 details 里
          channelDetailItem.options?.map(detailOption => {
            channelParam.details[detailOption.key] = param[
              channelDetailItem.key
            ]?.includes(detailOption.key);
          });
        } else {
          channelParam.details[channelDetailItem.key] =
            param[channelDetailItem.key];
        }
      });
      channelsParam.push(channelParam);
    });
    // 组装 request 的参数
    const requestParam = {
      projectId: parseInt(getLatestGAProjectId()),
      title: param["campaignName"],
      cohortIds: param["TargetCohort"] ?? [],
      campaignType: campaignSelected.campaignType,
      details: campaignDetails,
      channels: channelsParam,
    };
    console.log("toAddCampaign requestParam\n", requestParam);
    addCampaign(requestParam)
      .then(result => {
        console.log("toAddCampaign result", result);
        message.success("The campaign creation was successful.");
        // router.push(getGrowthProjectPath(project?.projectName, "Campaign"));
        router.push({
          pathname: getGrowthProjectPath(
            project?.projectName,
            "CampaignDetail",
          ),
          hash: "#id=" + result?.campaignId,
        });
        //todo 还差展示 邀请机器人link 和 活动 link
      })
      .finally(() => {
        setSubmiting(false);
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
        {isLoading || !campaignSelected ? (
          <LoadingSpinner message="Loading..." />
        ) : (
          <div className="flex flex-row mt3 bg-white rounded p3 full-width">
            <Steps
              current={currentStep ? currentStep - 1 : 0}
              // className="mt-5 px-10"
              className="full-height"
              direction="vertical"
              size="small"
              style={{ padding: 0, width: "20%", marginTop: 20 }}
              items={steps}
            />
            <div
              style={{ height: "100%", width: "80%" }}
              className="flex flex-column pl2 border-left"
            >
              <Form
                className=" bg-white rounded-md w-full"
                {...layout}
                labelWrap
                initialValues={{
                  campaignType: campaignSelected?.campaignType,
                }}
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
                    valuePropName="value"
                    rules={[{ required: true }]}
                  >
                    <Segmented
                      style={{ padding: 5 }}
                      name="campaignType2"
                      // value={campaignSelected?.value}
                      onChange={value => {
                        setCampaignSelected(
                          campaignTemplates.find(item => item.value === value),
                        );
                      }}
                      options={campaignTemplates}
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
                {/* 需要改成 后端控制 */}
                {campaignSelected?.campaignType === "Notification" && (
                  <>
                    <div className="bg-light rounded p1 mt1 pt3">
                      <div className="mb1">Notification content</div>
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
                {campaignSelected?.cohortRequired && (
                  <>
                    <div className="flex flex-row items-center justify-between mt2">
                      <Title level={5}>{`Cohort`}</Title>
                      <Button
                        target="_blank"
                        href={getGrowthProjectPath(
                          project?.projectName,
                          "Cohort",
                        )}
                        // size="small"
                        icon={<SettingOutlined />}
                        type="text"
                      >
                        Create cohort
                      </Button>
                    </div>
                    <div className="bg-light rounded p1 mt1  pt3">
                      <Form.Item
                        rules={[{ required: true }]}
                        name={"TargetCohort"}
                        label="Target Cohort"
                      >
                        <Select
                          placeholder="Select a target cohort"
                          mode="multiple"
                          loading={isLoadingCohort}
                          optionLabelProp="label"
                          onChange={value => {
                            setCohortSelectedValue(value);
                          }}
                        >
                          {cohortDataOptions}
                        </Select>
                      </Form.Item>
                    </div>
                  </>
                )}
                <div className="flex flex-row items-center justify-between mt2">
                  <Title level={5}>{`Channel`}</Title>
                  <Button
                    target="_blank"
                    href={getGrowthProjectPath(project?.projectName, "Channel")}
                    // size="small"
                    icon={<SettingOutlined />}
                    type="text"
                  >
                    Config channel
                  </Button>
                </div>
                <div className="bg-light rounded p1 mt1 pt3">
                  <Form.Item
                    rules={[{ required: true }]}
                    name={"TargetChannel"}
                    label="Target Channel"
                  >
                    <Select
                      placeholder="Select a target channel"
                      // mode="multiple"
                      onChange={value => {
                        const channels = [];
                        const values = Array.isArray(value) ? value : [value];
                        values?.map(v => {
                          channels.push(
                            channelTemplates.find(item => item.value === v),
                          );
                        });
                        setChannelSelectedValue(channels);
                      }}
                      // loading={loadingCohort}
                      options={channelTemplates}
                    />
                  </Form.Item>
                </div>
                {channelSelectedValue?.map(channel => {
                  return (
                    <>
                      <div className="bg-light rounded p1 mt1 mb1">
                        <div className="mt1 text-bold">
                          {channel.channelName}
                        </div>
                        <Divider className=" my1"></Divider>
                        {getChannelConfigPanel(channel.details)}
                      </div>
                    </>
                  );
                })}

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
