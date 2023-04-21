/* eslint-disable react/prop-types */
import Icon, { SettingOutlined, CheckCircleTwoTone } from "@ant-design/icons"
import React, { useEffect, useState } from "react"
import {
  Avatar,
  Checkbox,
  Select,
  Button,
  Form,
  Modal,
  Input,
  Switch,
  message,
  Typography,
} from "antd"
import { connect } from "react-redux"
import { useQuery } from "react-query"
import Title from "antd/lib/typography/Title"
import CopyToClipboard from "react-copy-to-clipboard"
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config"
import {
  getCampaignTemplate,
  GetFgaCohort,
  addCampaign,
} from "metabase/new-service"
import { getUser } from "metabase/selectors/user"
import LoadingSpinner from "metabase/components/LoadingSpinner"
import {
  loginModalShowAction,
  createFgaProjectModalShowAction,
} from "metabase/redux/control"
import "../../css/utils.css"
import { Link } from "react-router"
const { Option } = Select
const { TextArea } = Input
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}
const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
}
const CreateCampaignModal = props => {
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
    optInType,
  } = props
  const [isSubmiting, setSubmiting] = useState(false)
  const [channelSelectedValue, setChannelSelectedValue] = useState(
     [],
  )
  console.log("channelSelectedValue", channelSelectedValue)
  const [campaignSelected, setCampaignSelected] = useState(null)
  const [showDiscordStep3, setShowDiscordStep3] = useState({
    show: false,
    command: "",
  })
  const formRef = React.useRef(null)

  const { isLoading, data } = useQuery(
    ["getCampaignTemplate"],
    getCampaignTemplate,
    QUERY_OPTIONS,
  )

  useEffect(() => {
    if (!isLoading) {
      data?.list?.forEach(item => {
        if (item.campaignType === "User Contact") {
          const opt_in_campaign = {
            key: item.campaignType,
            label: item.campaignName ?? item.campaignType,
            // description: item.description,
            value: item.campaignType,
            disabled: item.status !== "enable",
            ...item,
          }
          setCampaignSelected(opt_in_campaign)
          optInType && setupOptInType(opt_in_campaign)
          return
        }
      })
    }
  }, [isLoading])

  useEffect(() => {
    if (optInType && campaignSelected) {
      setupOptInType(campaignSelected)
    }
  }, [optInType])

  const setupOptInType = campaign => {
    const channelType =
      optInType === "Twitter"
        ? "Tweet URL"
        : optInType === "Discord"
        ? "Discord bot"
        : ""
    const channelTemp = campaign?.channels?.find(
      item => item.channelName === channelType,
    )
    if (channelTemp) {
      setChannelSelectedValue([channelTemp])
    }
  }

  const getChannelConfigPanel = details => {
    return (
      <>
        {details?.map((detail, index) => {
          const isTwtterUri =
            optInType === "Twitter" && detail.key === "twitterUri"
          if (isTwtterUri) {
            detail.type = "textArea"
          }
          if (detail.type === "checkbox") {
            const options = []
            const defaultValue = []
            detail.options?.forEach(item => {
              if (item.value === true) {
                defaultValue.push(item.key)
              }
              options.push({
                label: item.title,
                value: item.key,
                // key: item.key,
                disabled: item.notEdit,
              })
            })
            return (
              <>
                <div className="mt1">
                  {index + 1 + ". "}
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
            )
          }
          if (detail.type === "string") {
            return (
              <>
                <Form.Item
                  key={detail.key}
                  name={detail.key}
                  layout={tailLayout}
                  style={{ marginBottom: 0 }}
                  initialValue={detail.value}
                  valuePropName="value"
                  label={isTwtterUri ? "" : `${index + 1}. ${detail.title}`}
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
            )
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
                  label={isTwtterUri ? "" : `${index + 1}. ${detail.title}`}
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
            )
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
            )
          }
        })}
      </>
    )
  }

  const onFinish = param => {
    // setShowDiscordStep3({
    //   show: true,
    //   botInitCmd: "/connect campaign_id:15 twitter_handler:enable email:enable",
    //   botInviteUrl:
    //     "https://discord.com/api/oauth2/authorize?client_id=1089756391889178745&permissions=268435456&scope=bot",
    // })
    // return;
    if (!user) {
      message.warning("Kindly log in before proceeding.")
      setLoginModalShowAction({
        show: true,
        from: "create campaign",
        redirect: location.pathname,
        channel: "FGA",
      })
      return
    }
    if (!project?.id) {
      message.warning("Initially, you must create your personal project!")
      setCreateFgaProjectModalShowAction({ show: true })
      return
    }
    setSubmiting(true)
    // 组装 campaign 的参数
    const campaignDetails = {}
    campaignSelected?.details?.map(detail => {
      if (detail.type === "checkbox") {
        // 把 checkbox 的选中项的 key 放到 details 里
        detail.options?.map(detailOption => {
          campaignDetails[detailOption.key] = param[detail.key]?.includes(
            detailOption.key,
          )
        })
      } else {
        campaignDetails[detail.key] = param[detail.key]
      }
    })
    // 组装 channel 的参数
    const channelsParam = []
    channelSelectedValue?.map(channel => {
      const channelParam = {
        id: channel.id,
        channelName: channel.channelName,
        campaignType: channel.campaignType,
        details: {},
      }
      channel?.details?.map(channelDetailItem => {
        if (channelDetailItem.type === "checkbox") {
          // 把 checkbox 的选中项的 key 放到 details 里
          channelDetailItem.options?.map(detailOption => {
            channelParam.details[detailOption.key] = param[
              channelDetailItem.key
            ]?.includes(detailOption.key)
          })
        } else {
          channelParam.details[channelDetailItem.key] =
            param[channelDetailItem.key]
        }
      })
      channelsParam.push(channelParam)
    })
    // 组装 request 的参数
    const requestParam = {
      projectId: parseInt(project?.id),
      title: `${optInType} Opt-In tool`,
      cohortIds: [],
      campaignType: campaignSelected.campaignType,
      details: campaignDetails,
      channels: channelsParam,
    }
    console.log("toAddCampaign requestParam\n", requestParam)
    addCampaign(requestParam)
      .then(result => {
        console.log("add opt-in result", result)
        message.success("The campaign creation was successful.")
        if (optInType === "Discord") {
          //  /connect campaign_id:2 twitter_handler:enable email:enable
          setShowDiscordStep3({
            show: true,
            botInitCmd: result?.channels?.[0]?.details?.botInitCmd,
            botInviteUrl: result?.channels?.[0]?.details?.botInviteUrl,
          })
          return
        }
        onSuccess?.()
        // router.push(getGrowthProjectPath(project?.protocolSlug, "Campaign"));
        // router.push({
        //   pathname: getGrowthProjectPath(
        //     project?.protocolSlug,
        //     "CampaignDetail",
        //   ),
        //   hash: "#id=" + result?.campaignId,
        // });
      })
      .finally(() => {
        setSubmiting(false)
      })
  }

  return (
    <Modal
      // title={`Create ${optInType} Opt-In`}
      title={
        <div className="text-bold text-center">
          <Avatar
            src={`https://footprint-imgs.oss-us-east-1.aliyuncs.com/${
              optInType === "Twitter" ? "20220516201254" : "20220516201343"
            }.png`}
            size={25}
            className="bg-white mr1"
          ></Avatar>
          {optInType === "Twitter"
            ? "Enter the Tweet URL in the below"
            : "Invite the Discord Bot"}
        </div>
      }
      width={600}
      open={open}
      footer={null}
      afterClose={() => {
        setShowDiscordStep3({ show: false })
      }}
      // onOk={handleOk}
      onCancel={onCancel}
    >
      {showDiscordStep3?.show ? (
        <div className="rounded p1 mt2" style={{ background: "#182034" }}>
          <div className="flex flex-col mt2 items-center">
            <img
              src="https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220317121550.png"
              style={{ width: 100, height: 100 }}
            />
            <Typography.Title level={4} className="mt1">
              Creating Discord bot successfully!
            </Typography.Title>
            <Typography.Text>
              But you still have one final step to complete.
            </Typography.Text>
            <Typography.Text mark>
              Send the command to your channel
            </Typography.Text>
            <CopyToClipboard
              text={showDiscordStep3?.botInitCmd}
              onCopy={() => {
                onSuccess?.()
              }}
            >
              <Button
                type={"primary"}
                className="mt3 mb1"
                style={{ borderRadius: 4 }}
              >
                Copy Command
              </Button>
            </CopyToClipboard>
            <Typography.Text className="mb2 text-center mx3">
              {`If you still haven't `}
              <a
                href={showDiscordStep3?.botInviteUrl}
                target="_blank"
                rel="noreferrer"
              >
                invited our Discord bot to your server
              </a>
              {`, please do so before proceeding.`}
            </Typography.Text>
          </div>
        </div>
      ) : (
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
                }}
                ref={formRef}
                scrollToFirstError={true}
                layout="horizontal"
                name="control-ref"
                labelAlign="left"
                onFinish={onFinish}
                style={{ width: "100%" }}
              >
                <div
                  className="rounded p1 mt1"
                  style={{ background: "#182034" }}
                >
                  {channelSelectedValue?.map(channel => {
                    if (channel.details && channel.details.length > 0) {
                      return (
                        <>
                          <div>
                            {getChannelConfigPanel(channel.details)}
                            {optInType === "Discord" && (
                              <div className="mb2">
                                <div className="flex flex-row mt3 items-center">
                                  <div>
                                    {channel.details.length + 1}. Invite the bot
                                    to your server
                                  </div>
                                  <Button
                                    type="primary"
                                    size="small"
                                    className="ml2"
                                    onClick={() => {
                                      window.open(
                                        "https://discord.com/api/oauth2/authorize?client_id=1089756391889178745&permissions=268435456&scope=bot",
                                        "_blank",
                                      )
                                    }}
                                    style={{ fontSize: 10, borderRadius: 4 }}
                                  >
                                    Invite Now
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )
                    }
                  })}
                </div>
                <Form.Item
                  {...tailLayout}
                  className="mt2"
                  style={{ marginBottom: !0 }}
                >
                  <div className="flex w-full flex-row-reverse">
                    <Button
                      htmlType="button"
                      onClick={() => {
                        onCancel?.()
                      }}
                      className="ml-10 rounded"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className=" bg-blue-500 rounded"
                      loading={isSubmiting}
                    >
                      Create
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}

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
)(CreateCampaignModal);
