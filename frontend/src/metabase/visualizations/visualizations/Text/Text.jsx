/* eslint-disable react/prop-types */
import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import _ from "underscore";
import cx from "classnames";
import { t } from "ttag";


import ResizeObserver from "resize-observer-polyfill";
import { debounce, mapKeys } from "lodash";
import queryString from "query-string";
import { CaretDownOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import { withInstanceLanguage, siteLocale } from "metabase/lib/i18n";
import { substitute_tags } from "cljs/metabase.shared.parameters.parameters";
import styles from "./Text.css";

const getSettingsStyle = settings => ({
  "align-center": settings["text.align_horizontal"] === "center",
  "align-end": settings["text.align_horizontal"] === "right",
  "justify-center": settings["text.align_vertical"] === "middle",
  "justify-end": settings["text.align_vertical"] === "bottom",
});

const REMARK_PLUGINS = [remarkGfm];

const MARKDOWN_LIST = [
  { type: "Bold", example: <b>**text**</b> },
  { type: "Italic", example: <i>_text_</i> },
  {
    type: "Heading 1",
    example: <span style={{ fontSize: 16 }}># Text</span>,
  },
  {
    type: "Heading 2",
    example: <span style={{ fontSize: 14 }}>## Text</span>,
  },
  {
    type: "Heading 3",
    example: <span>### Text</span>,
  },
  {
    type: "Link",
    example: (
      <>
        [Link](
        <a
          href="https://www.footprint.network/"
          target="_blank"
          rel="noreferrer"
        >
          https://www.footprint.network/
        </a>
        )
      </>
    ),
  },
  {
    type: "Image or GIF",
    example: (
      <>
        ![image](
        <a
          href="https://static.footprint.network/favicon.ico"
          target="_blank"
          rel="noreferrer"
        >
          https://static.footprint.network/favicon.ico
        </a>
        )
      </>
    ),
  },
  { type: "Inline code", example: "`code`" },
  {
    type: "Code block",
    example: (
      <>
        <div>```</div>
        <div>code</div>
        <div>```</div>
      </>
    ),
  },
  { type: "Horizontal rule", example: "---" },
  {
    type: "Ordered list",
    example: (
      <ol style={{ listStyle: "decimal", listStylePosition: "inside" }}>
        <li>First item</li>
        <li>Second item</li>
        <li>Third item</li>
      </ol>
    ),
  },
  {
    type: "List",
    example: (
      <ul>
        <li>- First item</li>
        <li>- Second item</li>
        <li>- Third item</li>
      </ul>
    ),
  },
];

export default class Text extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
    };
  }

  static uiName = "Text";
  static identifier = "text";
  static iconName = "text";

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
      default: t`Text card`,
    },
    "card.description": {
      dashboard: false,
    },
    text: {
      value: "",
      default: "",
    },
    "text.align_vertical": {
      section: t`Display`,
      title: t`Vertical Alignment`,
      widget: "select",
      props: {
        options: [
          { name: t`Top`, value: "top" },
          { name: t`Middle`, value: "middle" },
          { name: t`Bottom`, value: "bottom" },
        ],
      },
      default: "top",
    },
    "text.align_horizontal": {
      section: t`Display`,
      title: t`Horizontal Alignment`,
      widget: "select",
      props: {
        options: [
          { name: t`Left`, value: "left" },
          { name: t`Center`, value: "center" },
          { name: t`Right`, value: "right" },
        ],
      },
      default: "left",
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

  changeScaleHandler = debounce(val => {
    this.setState({
      fontSize: val,
    });
  }, 300);

  handlerTextScreenAdapter() {
    if (this.chartRef) {
      const { gridSize } = this.props;
      this._ro = new ResizeObserver((entries, observer) => {
        const gridWidth = 71 * gridSize.width;
        const { width } = entries[0].contentRect;
        const temp = Math.min((width / gridWidth) * 3.5, 4);
        const scale = (1 - (4 - temp) * 0.15).toFixed(2);
        if (Math.abs(this.state.fontSize - scale) > 0.02) {
          this.changeScaleHandler(scale);
        }
      });
      this._ro.observe(this.chartRef);
    }
  }

  componentDidMount() {
    this.handlerTextScreenAdapter();
  }

  componentWillUnmount() {
    if (this._ro && this.chartRef) {
      this._ro.unobserve(this.chartRef);
      this._ro.disconnect();
      this._ro = null;
    }
  }

  getLocationQueryDynamicParams = () => {
    const search = window?.location?.search;
    if (!search) {
      return null;
    }
    return {
      ...mapKeys(
        queryString.parse(search),
        (_, key) => `location.query.${key}`,
      ),
    };
  };

  render() {
    const {
      className,
      dashboard,
      dashcard,
      gridSize,
      settings,
      isEditing,
      isPreviewing,
      parameterValues,
    } = this.props;
    const isSingleRow = gridSize && gridSize.height === 1;

    const dynamicParams = this.props.dynamicParams;
    const locationQueryDynamicParams = this.getLocationQueryDynamicParams();

    const interpolate = (origin, params) => {
      if (!params) {
        return origin;
      }
      return origin.replace(/{(.*?)}/g, (match, key) => {
        // eslint-disable-next-line no-prototype-builtins
        return params.hasOwnProperty(key) ? params[key] : match;
      });
    };

    let parametersByTag = {};
    if (dashcard && dashcard.parameter_mappings) {
      parametersByTag = dashcard.parameter_mappings.reduce((acc, mapping) => {
        const tagId = mapping.target[1];
        const parameter = dashboard.parameters.find(
          p => p.id === mapping.parameter_id,
        );
        if (parameter) {
          const parameterValue = parameterValues[parameter.id];
          return {
            ...acc,
            [tagId]: { ...parameter, value: parameterValue },
          };
        } else {
          return acc;
        }
      }, {});
    }

    let content = settings["text"];
    if (!_.isEmpty(parametersByTag)) {
      // Temporarily override language to use site language, so that all viewers of a dashboard see parameter values
      // translated the same way.
      content = withInstanceLanguage(() =>
        substitute_tags(content, parametersByTag, siteLocale()),
      );
    }

    if (isEditing) {
      return (
        <div
          className={cx(className, styles.Text, {
            "padded": !isPreviewing,
          })}
        >
          {isPreviewing ? (
            <ReactMarkdown
              remarkPlugins={REMARK_PLUGINS}
              className={cx(
                "full flex-full flex flex-column text-card-markdown",
                styles["text-card-markdown"],
                getSettingsStyle(settings),
              )}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <div className="Text-wrap">
              <div className="full flex-full flex flex-column">
              <textarea
                className={cx(
                  "full flex-full flex flex-column bg-light bordered drag-disabled",
                  styles["text-card-textarea"],
                )}
                name="text"
                placeholder={t`You can use Markdown here, and include variables {{like_this}}`}
                value={settings.text}
                onChange={e => this.handleTextChange(e.target.value)}
                // Prevents text cards from dragging when you actually want to select text
                // See: https://github.com/metabase/metabase/issues/17039
                onMouseDown={this.preventDragging}
              />
              </div>
              <div className={styles["Text-wrap-tip"]}>
                <Popover
                  placement="bottomLeft"
                  content={
                    <ul className="Text-wrap-tip-list">
                      {MARKDOWN_LIST.map(item => (
                        <li key={item.type} className="Text-wrap-tip-item">
                          <b>{item.type}</b>
                          <div>{item.example}</div>
                        </li>
                      ))}
                    </ul>
                  }
                  trigger="hover"
                >
                  Some markdown is supported <CaretDownOutlined />
                </Popover>
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
            "Text--single-row": isSingleRow,
          })}
          style={{
            fontSize: `${this.state.fontSize}em`,
          }}
        >
          <ReactMarkdown
            remarkPlugins={REMARK_PLUGINS}
            linkTarget="_blank"
            className={cx(
              "flex-full flex flex-column",
              styles["text-card-markdown"],
              getSettingsStyle(settings),
            )}
          >
            {interpolate(
              interpolate(settings.text, locationQueryDynamicParams),
              dynamicParams,
            )}
          </ReactMarkdown>
        </div>
      );
    }
  }
}
