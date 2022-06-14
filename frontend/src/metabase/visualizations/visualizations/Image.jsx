/* eslint-disable react/prop-types */
import React, { Component } from "react";
import styles from "./Text.css";
import "./Image.css";
import cx from "classnames";
import { t } from "ttag";
import type { VisualizationProps } from "metabase-types/types/Visualization";
import { Upload, Button, message, Image as AntdImage } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { ossPath } from "metabase/lib/ossPath";
import { uploadFile } from "metabase/lib/oss";
import { getSuffix } from "metabase/containers/news/util/handle";
import { staticBucketUrlDefault } from "metabase/env";

type State = {
  isShowingRenderedOutput: boolean,
  text: string,
};

export default class Image extends Component {
  props: VisualizationProps;
  state: State;

  constructor(props: VisualizationProps) {
    super(props);

    this.state = {
      text: "",
      fontSize: 1,
      uploadLoading: false,
      uploadProps: {
        accept: ".png, .jpg, .jpeg, .gif, .webp",
        showUploadList: false,
        beforeUpload: async file => {
          if (file.size > 1024 * 1024 * 2) {
            message.warning("Max size of 2MB");
            return false;
          }
          this.setState({ uploadLoading: true });
          const fileName = `card_images/${uuidv4()}${getSuffix(file.name)}`;
          try {
            await uploadFile({ fileName, file });
            const fileUrl = `${staticBucketUrlDefault}/${ossPath(fileName)}`;
            this.handleTextChange(fileUrl);
          } catch (error) {
          } finally {
            this.setState({ uploadLoading: false });
          }
        },
      },
    };
  }

  static uiName = "Image";
  static identifier = "image";
  static iconName = "image";

  static disableSettingsConfig = false;
  static noHeader = true;
  static supportsSeries = false;
  static hidden = true;
  static supportPreviewing = true;

  static minSize = { width: 2, height: 1 };

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

  handleTextChange(text: string) {
    this.props.onUpdateVisualizationSettings({ text: text });
  }

  preventDragging = e => e.stopPropagation();

  renderImage = ({ settings }) => {
    if (!settings.text) {
      return null;
    }
    return (
      <AntdImage
        src={settings.text}
        alt="Footprint Analytics"
        crossOrigin="Anonymous"
      />
    );
  };

  render() {
    const { className, settings, isEditing } = this.props;
    const { uploadLoading, uploadProps } = this.state;

    if (isEditing) {
      return (
        <div className={cx(className, styles.Text)}>
          {this.props.isPreviewing ? (
            <React.Fragment>{this.renderImage({ settings })}</React.Fragment>
          ) : (
            <div className="Image-wrap">
              <div className="Image-wrap-upload">
                <Upload {...uploadProps}>
                  <Button
                    loading={uploadLoading}
                    icon={<UploadOutlined />}
                    type="primary"
                  >
                    Click to upload
                  </Button>
                </Upload>
                or put your image URL here 👇
              </div>
              <div className="full flex-full flex flex-column Image-wrap-input">
                <textarea
                  className={cx(
                    "full flex-full flex flex-column bg-light bordered drag-disabled",
                    styles["text-card-textarea"],
                  )}
                  name="text"
                  placeholder={t`e.g. https://example.com/image.png`}
                  value={settings.text}
                  onChange={e => this.handleTextChange(e.target.value)}
                  // Prevents text cards from dragging when you actually want to select text
                  // See: https://github.com/metabase/metabase/issues/17039
                  onMouseDown={this.preventDragging}
                />
                <span
                  className="absolute footprint-secondary-text2"
                  style={{ bottom: 10, right: 20 }}
                >
                  Image
                </span>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          ref={r => (this.chartRef = r)}
          className={cx(className, styles.Text, {
            /* if the card is not showing a background we should adjust the left
             * padding to help align the titles with the wrapper */
            pl0: !settings["dashcard.background"],
          })}
        >
          {this.renderImage({ settings })}
        </div>
      );
    }
  }
}
