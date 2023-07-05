/* eslint-disable react/prop-types */
import React, { Component } from "react";

import cx from "classnames";
import { t } from "ttag";

import ItemEmbed from "../../../metabase/containers/dashboards/components/Recommendations/ItemEmbed";
import styles from "./Text/Text.css";

export default class Embed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      fontSize: 1,
    };
  }

  static uiName = "Tableau";
  static identifier = "tableau";
  static iconName = "tableau";

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

  handleTextChange(text) {
    this.props.onUpdateVisualizationSettings({ text: text });
  }

  preventDragging = e => e.stopPropagation();

  renderEmbed = ({ settings }) => {
    if (!settings.text) {
      return null;
    }
    return (
      <tableau-viz id="tableauViz"
       src={settings.text}>
      </tableau-viz>
    )
  };

  render() {
    const { className, settings, isEditing } = this.props;

    if (isEditing) {
      return (
        <div className={cx(className, styles.Text)}>
          {this.props.isPreviewing ? (
            <React.Fragment>{this.renderEmbed({ settings })}</React.Fragment>
          ) : (
            <div className="full flex-full flex flex-column">
              <textarea
                className={cx(
                  "full flex-full flex flex-column bg-light bordered drag-disabled",
                  styles["text-card-textarea"],
                )}
                name="text"
                placeholder={t`Type or paste website url here, tableau public url are supported now, e.g. https://online.tableau.com/myworkspace/your-tableau-view-url`}
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
                Tableau
              </span>
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
          {this.renderEmbed({ settings })}
        </div>
      );
    }
  }
}
