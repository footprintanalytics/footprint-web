/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  Drawer,
  Switch,
  message,
} from "antd";
import { color } from "metabase/lib/colors";
import { addCampaign } from "metabase/new-service";
import {
  getGrowthProjectPath,
  getLatestGAProjectId,
} from "metabase/growth/utils/utils";
import ConfigChannel from "../config_panel/ConfigChannel";
const { Option } = Select;

const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

const ConfigBasicInfo = props => {
  const {
    onNext,
    campaignTemplate,
    user,
    router,
    setCreateFgaProjectModalShowAction,
    setLoginModalShowAction,
    project,
    location,
  } = props;
  const formRef = React.useRef(null);
  const [currentCampaign, setCurrentCampaign] = useState();
  const [currentChannel, setCurrentChannel] = useState();
  const [currentParam, setCurrentParam] = useState();
  const [isSubmiting, setSubmiting] = useState(false);
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  useEffect(() => {
    if (currentChannel) {
      const initialValues = {};
      currentChannel?.details?.map(i => {
        initialValues[i.key] = i.value;
      });
      setCurrentParam(initialValues);
    }
  }, [currentChannel]);
  const getConfigDetail = (datas, type) => {
    if (!datas || !datas.details || datas?.details?.length <= 0) {
      return <></>;
    }
    const hasExtent = datas?.details?.findIndex(i => i.extend) !== -1;
    return (
      <div
        style={{
          borderRadius: 5,
          borderWidth: 1,
          borderColor: color("border"),
          borderStyle: "dashed",
          marginBottom: 10,
          padding: 10,
        }}
      >
        <div className=" flex flex-row items-center justify-between">
          <div>{type} Config</div>
          {hasExtent && (
            <Button
              type="default"
              size="small"
              onClick={() => {
                showDrawer(datas);
              }}
            >
              Edit
            </Button>
          )}
        </div>
        <div className="bg-light p2 my1">
          {datas?.details?.map(i => {
            if (i.extend) {
              return <></>;
            }
            return (
              <>
                {i.type === "string" && (
                  <Form.Item
                    key={i.key}
                    name={i.key}
                    label={i.title}
                    rules={[{ required: i.required }]}
                  >
                    <Input
                      allowClear
                      disabled={i.notEdit}
                      placeholder={`Input the ${i.title}.`}
                      type={
                        i.private
                          ? "password"
                          : i.type === "string"
                          ? "text"
                          : i.type
                      }
                    />
                  </Form.Item>
                )}

                {i.type === "boolean" && (
                  <Form.Item
                    key={i.key}
                    name={i.key}
                    valuePropName="checked"
                    label={i.title}
                    rules={[{ required: i.required }]}
                  >
                    <Switch disabled={i.notEdit} />
                  </Form.Item>
                )}
              </>
            );
          })}
        </div>
      </div>
    );
  };
  const onFinish = values => {
    //todo 提交表单到 api，成功之后 onNext
    if (currentCampaign?.campaignType === "mapping") {
      const param = { ...currentParam, ...values };
      console.log("onFinish param", param);
      setCurrentParam(param);
      toAddCampaign(param);
    } else {
      onNext();
    }
  };

  const toAddCampaign = param => {
    // 需要判断 登录 以及 project id
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
    currentChannel?.details?.map(i => {
      i.value = param[i.key];
    });
    currentChannel["channelId"] = currentChannel["id"];
    currentCampaign?.details?.map(i => {
      i.value = param[i.key];
    });
    const channelParam = {
      channelId: currentChannel.channelId,
      channelName: currentChannel.channelName,
      campaignType: currentChannel.campaignType,
      details: {},
    };
    currentChannel?.details?.map(i => {
      channelParam.details[i.key] = i.value;
    });
    const details = {};
    currentCampaign?.details?.map(i => {
      details[i.key] = i.value;
    });
    const requestParam = {
      projectId: parseInt(getLatestGAProjectId()),
      title: param["campaignName"],
      cohortIds: param["cohortIds"] ?? [],
      campaignType: currentCampaign.campaignType,
      details: details,
      channels: [channelParam],
    };
    console.log("toAddCampaign requestParam\n", requestParam);
    addCampaign(requestParam)
      .then(result => {
        console.log("toAddCampaign result", result);
        message.success("The campaign creation was successful.");
        router.push(getGrowthProjectPath(project, "Campaign"));
        //todo 还差展示 邀请机器人link 和 活动 link
      })
      .finally(() => {
        setSubmiting(false);
      });
  };

  const [openDrawer, setOpenDrawer] = useState({ show: false, channel: {} });
  const showDrawer = c => {
    setOpenDrawer({ show: true, channel: c });
  };
  const onCloseDrawer = () => {
    setOpenDrawer({ show: false });
  };
  const onChannelEditFinish = values => {
    onCloseDrawer();
    const param = { ...currentParam, ...values };
    console.log("config base get", param);
    setCurrentParam(param);
    const channel = currentChannel;
    channel?.details?.map(i => {
      i.value = values[i.key];
    });
    setCurrentChannel(channel);
  };
  return (
    <div
      className="flex flex-col w-full"
      style={{
        alignItems: "center",
      }}
    >
      <Card style={{ width: 600 }}>
        <Form
          className=" bg-white rounded-md p-5 w-full"
          {...layout}
          labelWrap
          initialValues={currentParam}
          ref={formRef}
          layout="horizontal"
          name="control-ref"
          onFinish={onFinish}
          style={{ maxWidth: 1000, minWidth: 500 }}
        >
          <Form.Item
            name="campaignName"
            label="Campaign Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Input the name of this new campaign" />
          </Form.Item>
          <Form.Item
            name="campaignType"
            label="Campaign Type"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a campaign type"
              onChange={(value, option) => {
                setCurrentCampaign(
                  campaignTemplate?.find(i => i.campaignType === value),
                );
              }}
            >
              {campaignTemplate.map(i => {
                return (
                  <Option key={i.campaignType} value={i.campaignType}>
                    {i.campaignType}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="channel"
            label="Channel"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a campaign channel"
              disabled={!currentCampaign}
              onChange={(value, option) => {
                setCurrentChannel(
                  currentCampaign?.channels?.find(i => i.channelName === value),
                );
              }}
            >
              {currentCampaign &&
                currentCampaign?.channels?.map(channel => {
                  // [].find(i=>i.)
                  return (
                    <Option
                      key={channel.channelName}
                      value={channel.channelName}
                    >
                      {channel.channelName}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
          <>{getConfigDetail(currentCampaign, "Campaign")}</>
          <>{getConfigDetail(currentChannel, "channel")}</>
          <Form.Item {...tailLayout}>
            <div className="flex w-full flex-row-reverse">
              <Button htmlType="button" onClick={onNext} className="ml-10">
                Skip & Save
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className=" bg-blue-500"
                loading={isSubmiting}
              >
                Next
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
      <Drawer
        title={`Config ${openDrawer?.channel?.channelName} channel`}
        placement="right"
        maskClosable={false}
        width={500}
        onClose={onCloseDrawer}
        open={openDrawer.show}
      >
        {openDrawer.channel && (
          <ConfigChannel
            channel={openDrawer.channel}
            onChannelEditFinish={onChannelEditFinish}
            setOpenDrawer={setOpenDrawer}
          ></ConfigChannel>
        )}
      </Drawer>
    </div>
  );
};

export default ConfigBasicInfo;
