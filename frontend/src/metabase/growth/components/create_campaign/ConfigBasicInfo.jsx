/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Card, Button, Form, Input, Select, Collapse, Checkbox } from "antd";
import { SettingOutlined } from "@ant-design/icons";
const { Option } = Select;
// import { FormInstance } from 'antd/es/form'
const { Panel } = Collapse;
const { TextArea } = Input;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

const ConfigBasicInfo = props => {
  const { onNext } = props;
  const formRef = React.useRef(null);
  const [campaignType, setCampaignType] = useState("Mapping");

  const getCampaignDetail = campaignType => {
    console.log("getCampaignDetail", campaignType);
    switch (campaignType) {
      case "Mapping":
        return (
          <>
            <h4>Campaign Channel</h4>
            <Collapse
              className=" my2"
              defaultActiveKey={[]}
              onChange={values => {
                console.log("Collapse values", values);
              }}
            >
              <Panel
                header={
                  <Checkbox
                    onClick={event => {
                      event.stopPropagation();
                    }}
                    // checked={checked}
                    // onChange={onChange}
                  >
                    Twitter collection
                  </Checkbox>
                }
                key="Twitter"
                showArrow={false}
                extra={
                  <SettingOutlined
                    onClick={event => {
                      event.stopPropagation();
                    }}
                  />
                }
              >
                <div>
                  <div>
                    Enter the urls in the blew to collect twitter handler and
                    wallet address
                  </div>
                  <TextArea
                    // value={pasteValue}
                    style={{ marginTop: 10 }}
                    onChange={e => {
                      // setPasteValue(e.target.value);
                      // parseWalletAddress(e.target.value);
                    }}
                    placeholder="Please paste all the tweet url you wish to add to this new campaign, separated by line breaks ."
                    autoSize={{ minRows: 5, maxRows: 10 }}
                  />
                </div>
              </Panel>
              <Panel
                header={
                  <Checkbox
                    onClick={event => {
                      event.stopPropagation();
                    }}
                    // checked={checked}
                    // onChange={onChange}
                  >
                    Discord collection
                  </Checkbox>
                }
                showArrow={false}
                key="Discord"
                extra={
                  <SettingOutlined
                    onClick={event => {
                      // If you don't want click extra trigger collapse, you can prevent this:
                      event.stopPropagation();
                    }}
                  />
                }
              >
                <div>
                  {"Set the link in your Discord,will collect wallet mapping"}
                </div>
              </Panel>
            </Collapse>
          </>
        );
    }
  };
  const onFinish = values => {
    console.log(values);
    // todo 提交表单到 api,成功之后 onNext
    onNext();
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
          className=" bg-white rounded-md p-5"
          {...layout}
          labelWrap
          ref={formRef}
          layout="vertical"
          name="control-ref"
          onFinish={onFinish}
          style={{ maxWidth: 1000, minWidth: 500 }}
        >
          <Form.Item
            name="campaignName"
            label="Campaign Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="campaignType"
            label="Campaign Type"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select a campaign type"
              onChange={value => {
                setCampaignType(value);
              }}
            >
              <Option value="Mapping">Mapping</Option>
              <Option value="Quest" disabled={true}>
                Quest
              </Option>
              <Option value="Airdrop" disabled={true}>
                Airdrop
              </Option>
            </Select>
          </Form.Item>

          <>{getCampaignDetail(campaignType)}</>
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
    </div>
  );
};

export default ConfigBasicInfo;
