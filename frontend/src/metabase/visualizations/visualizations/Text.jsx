/* eslint-disable react/prop-types */
import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./Text.css";

import cx from "classnames";
import { t } from "ttag";

import type { VisualizationProps } from "metabase-types/types/Visualization";
import ResizeObserver from "resize-observer-polyfill";
import { debounce, mapKeys } from "lodash";
import queryString from "query-string";

type State = {
  isShowingRenderedOutput: boolean,
  text: string,
};

const getSettingsStyle = settings => ({
  "align-center": settings["text.align_horizontal"] === "center",
  "align-end": settings["text.align_horizontal"] === "right",
  "justify-center": settings["text.align_vertical"] === "middle",
  "justify-end": settings["text.align_vertical"] === "bottom",
});

const REMARK_PLUGINS = [remarkGfm];

export default class Text extends Component {
  props: VisualizationProps;
  state: State;

  constructor(props: VisualizationProps) {
    super(props);

    this.state = {
      text: "",
      fontSize: 1,
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

  handleTextChange(text: string) {
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
    const { className, gridSize, settings, isEditing } = this.props;
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

    if (isEditing) {
      return (
        <div className={cx(className, styles.Text)}>
          {this.props.isPreviewing ? (
            <ReactMarkdown
              remarkPlugins={REMARK_PLUGINS}
              className={cx(
                "full flex-full flex flex-column text-card-markdown",
                styles["text-card-markdown"],
                getSettingsStyle(settings),
              )}
            >
              {settings.text}
            </ReactMarkdown>
          ) : (
            <textarea
              className={cx(
                "full flex-full flex flex-column bg-light bordered drag-disabled",
                styles["text-card-textarea"],
              )}
              name="text"
              placeholder={t`Write here, and use Markdown if you'd like`}
              value={settings.text}
              onChange={e => this.handleTextChange(e.target.value)}
              // Prevents text cards from dragging when you actually want to select text
              // See: https://github.com/metabase/metabase/issues/17039
              onMouseDown={this.preventDragging}
            />
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
