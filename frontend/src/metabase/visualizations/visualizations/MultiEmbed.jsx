/* eslint-disable react/prop-types */
import React, { Component } from "react";

import cx from "classnames";
import { t } from "ttag";

import ItemEmbed from "../../containers/dashboards/components/Recommendations/ItemEmbed";
import styles from "./Text/Text.css";
import "./MultiEmbed.css";
import { Button, Empty, Modal, Tabs } from "antd";

export default class MultiEmbed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      fontSize: 1,
      itemsTab: this.initialItems,
      activeKey: "1",
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
  initialItems = [
    {
      label: "Tab 1",
      children: (
        <ItemEmbed
          className="w-full flex-full"
          item={{
            mediaUrl:
              "https://www.footprint.network/public/dashboard/Test-fliter-fp-be3285ec-2f53-48ce-9f2f-62fbee115eba?greater_than_or_equal_to=100&series_text=hello%20world&text_starts_with=0x",
          }}
        />
      ),
      key: "1",
    },
    {
      label: "Tab 2",
      children: (
        <ItemEmbed
          className="w-full flex-full"
          item={{
            mediaUrl:
              "https://www.footprint.network/@alpha/Test-fliter?greater_than_or_equal_to=100&series_text=hello%20world&text_starts_with=0x",
          }}
        />
      ),
      key: "2",
    },
    {
      label: "Tab 3",
      children: (
        <ItemEmbed
          className="w-full flex-full"
          item={{ mediaUrl: "https://huaban.com/" }}
        />
      ),
      key: "3",
      closable: true,
    },
  ];
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

  handleTextChange(text) {
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
    console.log("remove", newActiveKey, newPanes);
    this.setState({
      ...this.state,
      activeKey: newActiveKey,
      itemsTab: newPanes,
    });
    // setItems(newPanes);
    // setActiveKey(newActiveKey);
  };
  add = () => {
    const newActiveKey = `newTab`;
    const newPanes = [...this.state.itemsTab];
    newPanes.push({
      label: "New Tab",
      children: <div> {"Content of new Tab"}</div>,
      key: newActiveKey,
    });
    // setItems(newPanes);
    // setActiveKey(newActiveKey);
    console.log("add", newActiveKey, newPanes);
    this.setState({
      ...this.state,
      activeKey: newActiveKey,
      itemsTab: newPanes,
    });
  };
  renderEmbed = ({ settings }) => {
    // if (!settings.text) {
    //   return null;
    // }
    // return <ItemEmbed item={{ mediaUrl: settings.text }} />;
    return (
      <div className="full flex-full flex flex-column h-full">
        <Tabs
          type="card"
          className="w-full h-full"
          onChange={this.onChange}
          items={this.state.itemsTab}
        />
      </div>
    );
  };

  render() {
    const { className, settings, isEditing } = this.props;
    console.log("render", this.state);
    const onEdit = (
      targetKey,
      action, //'add' | 'remove'
    ) => {
      console.log("onEdit", targetKey, action);
      if (action === "add") {
        // this.add();
        this.setState({ ...this.state, showAddModal: true });
      } else {
        this.remove(targetKey);
      }
    };
    if (isEditing) {
      return (
        <div className={cx(className, styles.Text, "MultiEmbed")}>
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
                onOk={() => {
                  this.setState({ ...this.state, showAddModal: false });
                }}
                onCancel={() => {
                  this.setState({ ...this.state, showAddModal: false });
                }}
              >
                <p>some contents...</p>
                <p>some contents...</p>
                <p>some contents...</p>
              </Modal>
              {/* <textarea
                className={cx(
                  "full flex-full flex flex-column bg-light bordered drag-disabled",
                  styles["text-card-textarea"],
                )}
                name="text"
                placeholder={t`Type or paste website url here, tableau public url are supported now, e.g. https://public.tableau.com/views/your-tableau-view-url`}
                value={settings.text}
                onChange={e => this.handleTextChange(e.target.value)}
                // Prevents text cards from dragging when you actually want to select text
                // See: https://github.com/metabase/metabase/issues/17039
                onMouseDown={this.preventDragging}
              /> */}
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
