/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Card, Button, Form, Input, Select, Drawer, Switch } from "antd";
import ConfigChannel from "../config_panel/ConfigChannel";
const { Option } = Select;
import { color } from "metabase/lib/colors";
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

const ConfigBasicInfo = props => {
  const { onNext, campaignTemplate } = props;
  const formRef = React.useRef(null);
  const [currentCampaign, setCurrentCampaign] = useState();
  const [currentChannel, setCurrentChannel] = useState();
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  const getChanelConfigDetail = currentChannel => {
    if (!currentChannel) {
      return <></>;
    }
    return (
      <div
        style={{
          borderRadius: 5,
          borderWidth: 1,
          borderColor: color("border"),
          borderStyle: "solid",
          marginBottom: 10,
          padding: 10,
        }}
      >
        <div className=" flex flex-row items-center justify-between">
          <div>Channel Config</div>
          <Button
            type="default"
            size="small"
            onClick={() => {
              showDrawer(currentChannel);
            }}
          >
            Edit
          </Button>
        </div>
        <div className="bg-light p2 my1">
          {currentChannel?.details?.map(i => {
            if (i.extend) {
              return <></>;
            }
            return (
              <Form.Item
                key={i.key}
                name={i.key}
                label={i.title}
                rules={[{ required: i.required }]}
              >
                <>
                  {i.type === "string" && (
                    <Input
                      defaultValue={i.value}
                      value={i.value}
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
                  )}
                </>
                <>
                  {i.type === "boolean" && (
                    <Switch
                      value={i.value}
                      defaultChecked={i.value}
                      disabled={i.notEdit}
                    />
                  )}
                </>
              </Form.Item>
            );
          })}
        </div>
      </div>
    );
  };
  const onFinish = values => {
    console.log(values);
    //todo 提交表单到 api，成功之后 onNext
    onNext();
  };

  const [openDrawer, setOpenDrawer] = useState({ show: false, channel: {} });
  const showDrawer = c => {
    setOpenDrawer({ show: true, channel: c });
  };
  const onCloseDrawer = () => {
    setOpenDrawer({ show: false });
  };
  const onChannelEditFinish = values => {
    console.log("config base get", values);
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
          <>{getChanelConfigDetail(currentChannel)}</>
          <Form.Item {...tailLayout}>
            <div className="flex w-full flex-row-reverse">
              <Button htmlType="button" onClick={onNext} className="ml-10">
                Skip & Save
              </Button>
              <Button type="primary" htmlType="submit" className=" bg-blue-500">
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
