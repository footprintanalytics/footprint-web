/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { Button, Empty, Form, Input, Modal, Space, Tabs, message } from "antd";

import cx from "classnames";
import { t } from "ttag";
import { slugify } from "metabase/lib/formatting";
import ItemEmbed from "../../containers/dashboards/components/Recommendations/ItemEmbed";
import styles from "./Text/Text.css";
import "./MultiEmbed.css";

export default class MultiEmbed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      fontSize: 1,
      itemsTab: [],
      activeKey: null,
      showAddModal: false,
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

  preventDragging = e => e.stopPropagation();

  onChange = newActiveKey => {
    // setActiveKey(newActiveKey);
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

  renderEmbed = ({ settings }) => {
    if (!settings.text) {
      return null;
    }
    try {
      let items = JSON.parse(settings.text);
      if (items?.length <= 0) {
        return null;
      }
      items = items.map(item => {
        return {
          label: item.label,
          key: item.key,
          closable: true,
          children: (
            <ItemEmbed
              className="w-full flex-full"
              item={{ mediaUrl: item.url }}
            />
          ),
        };
      });
      return (
        <div className="full flex-full flex flex-column h-full">
          <Tabs
            type="card"
            className="w-full h-full"
            onChange={this.onChange}
            items={items}
          />
        </div>
      );
    } catch (error) {
      console.log("renderEmbed error", error);
      return null;
    }
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

    const onFinishFailed = () => {
      message.error("Submit failed!");
    };

    if (isEditing) {
      return (
        <div
          className={cx(className, styles.Text, "MultiEmbed")}
          style={{ pointerEvents: "all" }}
        >
          {this.props.isPreviewing ? (
            <React.Fragment>{this.renderEmbed({ settings })}</React.Fragment>
          ) : (
            <div
              className="full flex-full flex flex-column"
              style={{ pointerEvents: "all" }}
            >
              {this.state.itemsTab?.length > 0 ? (
                <Tabs
                  type="editable-card"
                  onChange={this.onChange}
                  // addIcon = {<Button type='text' >Add new embed</Button>}
                  activeKey={this.state.activeKey}
                  onEdit={onEdit}
                  items={this.state.itemsTab}
                />
              ) : (
                <div className="flex full h-full flex-column items-center justify-center">
                  <Empty description={"Click here to add the first embed."}>
                    <Button
                      type="primary"
                      onClick={() =>
                        this.setState({ ...this.state, showAddModal: true })
                      }
                    >
                      Add new embed
                    </Button>
                  </Empty>
                </div>
              )}
              <Modal
                title="Add new embed"
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
                      placeholder="Please enter the title of the embedded website."
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item
                    name="url"
                    className=" mb3"
                    label="URL"
                    rules={[
                      { required: true },
                      { type: "url", warningOnly: true },
                    ]}
                  >
                    <Input
                      placeholder="Please provide the url to the embedded website."
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item>
                    <div className="flex flex-row-reverse w-full items-center">
                      <Button type="primary" htmlType="submit">
                        Comfirm
                      </Button>
                      <Button
                        htmlType="button"
                        className="mr2"
                        onClick={() => {
                          this.setState({ ...this.state, showAddModal: false });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form.Item>
                </Form>
              </Modal>
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
          {this.renderEmbed({ settings })}
        </div>
      );
    }
  }
}
