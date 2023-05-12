/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Checkbox,
  Select,
  Button,
  Divider,
  Segmented,
  Form,
  Modal,
  Input,
  Switch,
  message,
  Typography,
} from "antd";
import { connect } from "react-redux";
import { useQuery } from "react-query";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import {
  getCampaignTemplate,
  addCampaign,
  GetFgaCohort,
} from "metabase/new-service";
import { getUser } from "metabase/selectors/user";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import {
  loginModalShowAction,
  createFgaProjectModalShowAction,
} from "metabase/redux/control";
import "../../css/utils.css";
const { Option } = Select;
const { TextArea } = Input;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const horizontalLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};
const CreateCampaignModalNew = props => {
  const {
    router,
    location,
    children,
    project,
    user,
    setLoginModalShowAction,
    setCreateFgaProjectModalShowAction,
    open,
    onCancel,
    onSuccess,
    toolIcons,
    campaignType,
    campaign, //view channel detail
  } = props;
  const [isSubmiting, setSubmiting] = useState(false);
  const [isShow, setShow] = useState(false);
  const [channelSelectedValue, setChannelSelectedValue] = useState([]);
  const [previewCampaign, setPreviewCampaign] = useState(null);
  const [campaignSelected, setCampaignSelected] = useState(null);
  const [cohortDataOptions, setCohortDataOptions] = useState([]);
  const [channelTemplates, setChannelTemplates] = useState();
  const [cohortSelectedValue, setCohortSelectedValue] = useState([]);
  const [showDiscordStep3, setShowDiscordStep3] = useState({
    show: false,
    command: "",
  });
  const [isEditable, setEditable] = useState(false);
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
        return await GetFgaCohort({ projectId: project?.id });
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
      data?.list?.forEach(item => {
        if (item.campaignType === campaignType) {
          const nitification_campaign = {
            key: item.campaignType,
            label: item.campaignName ?? item.campaignType,
            // description: item.description,
            value: item.campaignType,
            disabled: false,
            // disabled: item.status !== "enable",
            ...item,
          };
          setCampaignSelected(nitification_campaign);
          campaignType &&
            setupSelectedChannel(campaignType, nitification_campaign);
          const templates = [];
          nitification_campaign?.channels?.forEach((item, index) => {
            templates.push({
              key: item.channelName,
              label: item.channelName,
              value: item.channelName,
              disabled: index === 0 ? false : true,
              ...item,
            });
          });
          setChannelTemplates(templates);
          return;
        }
      });
    }
  }, [isLoading]);

  useEffect(() => {
    if (open) {
      setupPreviewChannel(campaign);
    }
    setShow(open);
  }, [open]);

  // view channel detail
  const setupPreviewChannel = channel => {
    if (channel) {
      let tempChannel = null;
      if (campaignType === "Notification") {
        tempChannel = [
          {
            ...channel,
            details: [],
          },
        ];
      }
      setEditable(false);
      setPreviewCampaign(tempChannel);
    } else {
      setEditable(true);
      setPreviewCampaign(null);
    }
  };

  const setupSelectedChannel = (socialType, campaign) => {
    setChannelSelectedValue([campaign?.channels?.[0]]);
  };

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
          }
          if (detail.type === "string") {
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
                    placeholder={
                      detail.placeholder ?? `Input the ${detail.title}.`
                    }
                    type={
                      detail.private
                        ? "password"
                        : ["textArea", "string"].includes(detail.type)
                        ? "text"
                        : detail.type
                    }
                  />
                </Form.Item>
              </>
            );
          }
          if (detail.type === "textArea") {
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
                  <TextArea
                    allowClear
                    // value={pasteValue}
                    disabled={detail.notEdit}
                    placeholder={
                      detail.placeholder ?? `Input the ${detail.title}.`
                    }
                    type={
                      detail.private
                        ? "password"
                        : ["textArea", "string"].includes(detail.type)
                        ? "text"
                        : detail.type
                    }
                    autoSize={{ minRows: 5, maxRows: 10 }}
                  />
                </Form.Item>
              </>
            );
          }
          if (detail.type === "boolean") {
            return (
              <Form.Item
                key={detail.key}
                name={detail.key}
                layout={tailLayout}
                initialValue={detail.value}
                valuePropName="checked"
                label={detail.title}
                rules={[{ required: detail.required }]}
              >
                <Switch />
              </Form.Item>
            );
          }
        })}
      </>
    );
  };

  const onFinish = param => {
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
    if (!project?.id) {
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
        id: channel?.id,
        channelName: channel?.channelName,
        campaignType: channel?.campaignType,
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
      projectId: parseInt(project?.id),
      title: `${campaignType} Social Connect tool`,
      cohortIds: param["TargetCohort"] ?? [],
      campaignType: campaignSelected.campaignType,
      details: campaignDetails,
      channels: channelsParam,
    };
    addCampaign(requestParam)
      .then(result => {
        message.success("The campaign creation was successful.");
        if (campaignType === "Discord") {
          //  /connect campaign_id:2 twitter_handler:enable email:enable
          setShowDiscordStep3({
            show: true,
            botInitCmd: result?.channels?.[0]?.details?.botInitCmd,
            botInviteUrl: result?.channels?.[0]?.details?.botInviteUrl,
          });
          return;
        }
        onSuccess?.();
      })
      .finally(() => {
        setSubmiting(false);
      });
  };

  const [modal, contextHolder] = Modal.useModal();
  return (
    <>
      {contextHolder}
      <Modal
        // title={`Create ${socialType} Opt-In`}
        title={
          <div className="text-bold text-center">
            <Avatar
              src={toolIcons?.get(campaignType)}
              size={25}
              className="mr1"
            ></Avatar>
            {campaignType}
          </div>
        }
        width={600}
        open={isShow}
        footer={null}
        afterClose={() => {
          setShowDiscordStep3({ show: false });
          setEditable(true);
          setPreviewCampaign([]);
          setChannelSelectedValue([]);
        }}
        // onOk={handleOk}
        onCancel={onCancel}
      >
        <Divider className="my2" />
        <>
          {isLoading || !campaignSelected ? (
            <LoadingSpinner message="Loading..." />
          ) : (
            <div
              style={{ height: "100%", width: "100%" }}
              className="flex flex-column w-full"
            >
              <Form
                className="w-full"
                {...layout}
                colon={false}
                labelWrap
                initialValues={{
                  campaignType: campaignSelected?.campaignType,
                  TargetChannel: campaignSelected?.channels?.[0]?.channelName,
                }}
                ref={formRef}
                scrollToFirstError={true}
                layout="horizontal"
                name="control-ref"
                labelAlign="left"
                onFinish={onFinish}
                style={{ width: "100%" }}
              >
                <div className="rounded mt1">
                  <Form.Item
                    name="TargetChannel"
                    label="Type"
                    {...horizontalLayout}
                    valuePropName="value"
                    rules={[{ required: true }]}
                  >
                    <Segmented
                      style={{ padding: 5, width: "100%" }}
                      name="TargetChannel2"
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
                      options={channelTemplates}
                    />
                  </Form.Item>
                </div>
                {channelSelectedValue?.map(channel => {
                  if (channel?.details && channel?.details?.length > 0) {
                    return (
                      <>
                        <div className="rounded p1 mt1 mb1">
                          <div className="mt1 text-bold mb1">
                            {channel.channelName}
                          </div>
                          {getChannelConfigPanel(channel.details)}
                        </div>
                      </>
                    );
                  }
                })}
                {campaignSelected?.cohortRequired && (
                  <>
                    <div className="rounded mt1">
                      <Form.Item
                        rules={[{ required: true }]}
                        {...horizontalLayout}
                        name={"TargetCohort"}
                        label="Cohort"
                      >
                        <Select
                          placeholder="Select a cohort"
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
                <div
                  className="rounded p1 mt1"
                  style={{ background: "#182034" }}
                >
                  {campaignSelected?.details?.length > 0 && (
                    <div>{getChannelConfigPanel(campaignSelected.details)}</div>
                  )}
                </div>
                <Form.Item
                  {...tailLayout}
                  className="mt2"
                  style={{ marginBottom: !0 }}
                >
                  <div className="flex w-full flex-row-reverse">
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={!isEditable}
                      className="ml-10  bg-blue-500 rounded"
                      loading={isSubmiting}
                    >
                      Create
                    </Button>
                    <Button
                      htmlType="button"
                      onClick={() => {
                        onCancel?.();
                      }}
                      className="rounded"
                    >
                      Cancel
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </div>
          )}
        </>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateCampaignModalNew);
