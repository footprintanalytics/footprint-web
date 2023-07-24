/* eslint-disable react/prop-types */
import React, { Component } from "react";
import {
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Space,
  Tabs,
  Typography,
  message,
} from "antd";

import cx from "classnames";
import { t } from "ttag";
import { slugify } from "metabase/lib/formatting";
import ItemEmbed from "../../containers/dashboards/components/Recommendations/ItemEmbed";
import styles from "./Text/Text.css";
import "./MultiEmbed.css";
import MultiEmbedChild from "metabase/visualizations/visualizations/MultiEmbedChild";

export default class MultiEmbed extends Component {
  constructor(props) {
    super(props);
    const { text } = props.card?.visualization_settings;
    const itemsTab = text ? this.parseText(text) : [];
    this.state = {
      text: "",
      fontSize: 1,
      itemsTab: itemsTab,
      activeKey: itemsTab.length > 0 ? itemsTab[0].key : "",
      showAddModal: false,
      showConfigModal: false,
    };
  }

  static uiName = "MultiEmbed";
  static identifier = "multi_embed";
  static iconName = "embed";

  static disableSettingsConfig = false;
  static noHeader = true;
  static supportsSeries = false;
  static hidden = true;
  static supportPreviewing = true;

  static minSize = { width: 4, height: 4 };

  static checkRenderable() {
    // text can always be rendered, nothing needed here
  }

  static settings = {
    "card.title": {
      dashboard: false,
    },
    "card.description": {
      dashboard: false,
    },
    text: {
      value: "",
      default: "",
    },
    "dashcard.background": {
      section: t`Display`,
      title: t`Show background`,
      dashboard: true,
      widget: "toggle",
      default: true,
    },
  };

  handleTextChange(newPanes) {
    const text = JSON.stringify(
      newPanes.map(item => {
        return {
          label: item.label,
          key: item.key,
          url: item.children.props.item.mediaUrl,
        };
      }),
    );
    this.props.onUpdateVisualizationSettings({ text: text });
  }

  parseText = (text) => {
    if (!text) {
      return [];
    }
    try {
      let items = JSON.parse(text);
      if (items?.length <= 0) {
        return null;
      }
      items = items.map(item => {
        return {
          label: item.label,
          key: item.key,
          url: item.url,
          closable: true,
          children: (
            <ItemEmbed
              className="w-full flex-full"
              item={{ mediaUrl: item.url }}
            />
          ),
        };
      });
      return items;
    } catch (error) {
      console.log("renderEmbed error", error);
      return [];
    }
  }

  preventDragging = e => e.stopPropagation();

  onChange = newActiveKey => {
    this.setState({ ...this.state, activeKey: newActiveKey });
  };

  remove = targetKey => {
    let newActiveKey = this.state.activeKey;
    let lastIndex = -1;
    this.state.itemsTab.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = this.state.itemsTab.filter(item => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    this.handleTextChange(newPanes);
    this.setState({
      ...this.state,
      activeKey: newActiveKey,
      itemsTab: newPanes,
    });
  };

  add = (title, link) => {
    const newActiveKey = `${slugify(title)}-${Date.now()}`;
    const newPanes = [...this.state.itemsTab];
    newPanes.push({
      label: title,
      children: (
        <ItemEmbed className="w-full flex-full" item={{ mediaUrl: link }} />
      ),
      key: newActiveKey,
    });
    this.handleTextChange(newPanes);
    this.setState({
      ...this.state,
      activeKey: newActiveKey,
      itemsTab: newPanes,
    });
  };

  getConfigJson = newPanes => {
    const text = JSON.stringify(
      newPanes.map(item => {
        return {
          label: item.label,
          // key: item.key,
          url: item.children.props.item.mediaUrl,
        };
      }),
      null,
      2,
    );
    return text;
  };

  render() {
    const { className, settings, isEditing } = this.props;
    const onEdit = (
      targetKey,
      action, //'add' | 'remove'
    ) => {
      if (action === "add") {
        this.setState({ ...this.state, showAddModal: true });
      } else {
        this.remove(targetKey);
      }
    };

    const onFinish = values => {
      this.add(values.title, values.url);
      this.setState({ ...this.state, showAddModal: false });
    };

    const onEditConfigFinish = values => {
      const newPanes = [];
      JSON.parse(values.config)?.forEach(item => {
        const newActiveKey = `${slugify(item.label)}-${Date.now()}`;
        newPanes.push({
          label: item.label,
          children: (
            <ItemEmbed
              className="w-full flex-full"
              item={{ mediaUrl: item.url }}
            />
          ),
          key: newActiveKey,
        });
      });
      this.handleTextChange(newPanes);
      this.setState({
        ...this.state,
        activeKey: newPanes[0]?.key ?? null,
        itemsTab: newPanes,
        showConfigModal: false,
      });
    };

    const onFinishFailed = () => {
      message.error("Submit failed!");
    };

    const validateJsonString = (_, value) => {
      try {
        const obj = JSON.parse(value);
        if (!Array.isArray(obj)) {
          return Promise.reject(
            "Please enter a valid JSON string: Object should be Array",
          );
        }
        for (let item of obj) {
          if (!item.label || !item.url) {
            return Promise.reject(
              "Please enter a valid JSON string: Object item should have label and url",
            );
          }
        }
      } catch (error) {
        return Promise.reject("Please enter a valid JSON string");
      }
      return Promise.resolve();
    };

    if (isEditing) {
      return (
        <div
          className={cx(className, styles.Text, "MultiEmbed")}
          style={{ pointerEvents: "all" }}
        >
          {this.props.isPreviewing ? (
            <MultiEmbedChild settings={settings} onChange={this.onChange}/>
          ) : (
            <div
              className="full flex-full flex flex-column"
              style={{ pointerEvents: "all" }}
            >
              {this.state.itemsTab?.length > 0 ? (
                <Tabs
                  type="editable-card"
                  tabBarExtraContent={
                    <Button
                      type="link"
                      onClick={() =>
                        this.setState({ ...this.state, showConfigModal: true })
                      }
                    >
                      Advance config
                    </Button>
                  }
                  onChange={this.onChange}
                  activeKey={this.state.activeKey}
                  onEdit={onEdit}
                  items={this.state.itemsTab}
                />
              ) : (
                <div className="flex full h-full flex-column items-center justify-center">
                  <Empty description={"Click here to add the first tab."}>
                    <Button
                      type="primary"
                      onClick={() =>
                        this.setState({ ...this.state, showAddModal: true })
                      }
                    >
                      Add new tab
                    </Button>
                  </Empty>
                </div>
              )}
              {this.state.showAddModal && (
                <Modal
                  title="Add new tab"
                  maskClosable={false}
                  centered
                  open={this.state.showAddModal}
                  footer={null}
                  onCancel={() => {
                    this.setState({ ...this.state, showAddModal: false });
                  }}
                >
                  <Form
                    layout="vertical"
                    onMouseDown={this.preventDragging}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                  >
                    <Form.Item
                      label="Title"
                      name="title"
                      className=" mt3"
                      rules={[{ required: true }]}
                    >
                      <Input
                        placeholder="Please enter the title of the tab."
                        allowClear
                      />
                    </Form.Item>
                    <Form.Item
                      name="url"
                      className="mb0"
                      label="URL"
                      rules={[
                        { required: true },
                        { type: "url", warningOnly: true },
                      ]}
                    >
                      <Input
                        placeholder="Please provide the website url to the tab."
                        allowClear
                      />
                    </Form.Item>
                    <Typography.Text
                        style={{ fontSize: 10,marginBottom:20 }}
                        type="secondary"
                      >
                        Please provide a{' '}
                        <span style={{ color: '#696969' }}>
                          <strong>public embed link</strong>
                        </span>
                        {' '}for Footprint Dashboard or Chart.
                        <Typography.Link
                          style={{ fontSize: 10 }}
                          rel="noreferrer"
                          href="https://docs.footprint.network/docs/embed"
                          target="_blank"
                        >
                          {"Check how to get the link>>"}
                        </Typography.Link>
                      </Typography.Text>
                    <Form.Item>
                      <div className="flex flex-row-reverse w-full items-center">
                        <Button type="primary" htmlType="submit">
                          Comfirm
                        </Button>
                        <Button
                          htmlType="button"
                          className="mr2"
                          onClick={() => {
                            this.setState({
                              ...this.state,
                              showAddModal: false,
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form.Item>
                  </Form>
                </Modal>
              )}
              {this.state.showConfigModal && (
                <Modal
                  title="Edit advance config"
                  centered
                  maskClosable={false}
                  open={this.state.showConfigModal}
                  footer={null}
                  onCancel={() => {
                    this.setState({ ...this.state, showConfigModal: false });
                  }}
                >
                  <Form
                    layout="vertical"
                    onMouseDown={this.preventDragging}
                    onFinish={onEditConfigFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{
                      config: this.getConfigJson(this.state.itemsTab),
                    }}
                    autoComplete="off"
                  >
                    <Form.Item
                      label="Config Json"
                      name="config"
                      className="mt3"
                      rules={[
                        { required: true },
                        { validator: validateJsonString },
                      ]}
                    >
                      <Input.TextArea
                        placeholder="Please enter the config json of the embedded website."
                        allowClear
                        autoSize={{ minRows: 6, maxRows: 14 }}
                      />
                    </Form.Item>
                    <Form.Item>
                      <div className="flex flex-row-reverse w-full items-center">
                        <Button type="primary" htmlType="submit">
                          Save
                        </Button>
                        <Button
                          htmlType="button"
                          className="mr2"
                          onClick={() => {
                            this.setState({
                              ...this.state,
                              showConfigModal: false,
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form.Item>
                  </Form>
                </Modal>
              )}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          ref={r => (this.chartRef = r)}
          className={cx(className, "MultiEmbed", styles.Text, {
            /* if the card is not showing a background we should adjust the left
             * padding to help align the titles with the wrapper */
            pl0: !settings["dashcard.background"],
          })}
        >
          <MultiEmbedChild settings={settings} onChange={this.onChange}/>
        </div>
      );
    }
  }
}
