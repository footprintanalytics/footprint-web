/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { withRouter } from "react-router";

import cx from "classnames";
import { IFRAMED, initializeIframeResizer } from "metabase/lib/dom";
import { parseHashOptions } from "metabase/lib/browser";

import MetabaseSettings from "metabase/lib/settings";

import TitleAndDescription from "metabase/components/TitleAndDescription";
import SyncedParametersList from "metabase/parameters/components/SyncedParametersList/SyncedParametersList";
import { getValuePopulatedParameters } from "metabase-lib/parameters/utils/parameter-values";

import LogoBadge from "./LogoBadge";
import "./EmbedFrame.css";

const DEFAULT_OPTIONS = {
  bordered: IFRAMED,
  titled: true,
};

class EmbedFrame extends Component {
  state = {
    innerScroll: true,
  };

  UNSAFE_componentWillMount() {
    initializeIframeResizer(() => this.setState({ innerScroll: false }));
  }

  render() {
    const {
      className,
      children,
      description,
      actionButtons,
      location,
      headerLayout,
      parameters,
      parameterValues,
      hideParameters,
      setParameterValue,
      hideTitle,
      hideFooter,
      isNightMode,
      innerClassName,
      allLoadOuter,
      hideAllParameters,
    } = this.props;
    const { innerScroll } = this.state;

    const { bordered, titled, theme, hide_parameters, hide_download_button, bg_color, all_load } = {
      ...DEFAULT_OPTIONS,
      ...parseHashOptions(location.hash),
    };

    const curTheme = isNightMode ? "night" : theme;

    const showFooter =
      !hideFooter &&
      (!MetabaseSettings.hideEmbedBranding() ||
        (!hide_download_button && actionButtons));

    const name = titled && !hideTitle ? this.props.name : null;

    const backgroundColor = bg_color === "black" ? "black": "";

    const coverOverflowY = allLoadOuter || all_load ? {overflowY: "auto"} : {}

    return (
      <div
        id="html2canvas-Dashboard"
        className={cx("EmbedFrame flex flex-column", className, {
          spread: innerScroll,
          "bordered rounded shadowed": bordered,
          [`Theme--${curTheme}`]: !!curTheme,
        })}
        style={{ backgroundColor: backgroundColor, ...coverOverflowY }}
      >
        <div
          className={cx("flex flex-column flex-full relative", innerClassName, {
            "scroll-y": innerScroll,
          })}
        >
          {headerLayout}
          {name || parameters?.length > 0 ? (
            <div className="EmbedFrame-header flex flex-column p1 sm-p2 lg-p3" style={{ backgroundColor: backgroundColor }}>
              {name && (
                <TitleAndDescription
                  title={name}
                  description={description}
                  className="my2"
                />
              )}
              {!hideAllParameters && parameters?.length > 0 ? (
                <div className="flex">
                  <SyncedParametersList
                    className="mt1"
                    isNightMode={isNightMode}
                    dashboard={this.props.dashboard}
                    parameters={getValuePopulatedParameters(
                      parameters,
                      parameterValues,
                    )}
                    setParameterValue={setParameterValue}
                    hideParameters={hideParameters ?? hide_parameters}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-column relative full flex-full">
            {children}
          </div>
        </div>
        {showFooter && (
          <div className="EmbedFrame-footer p1 md-p2 lg-p3 border-top flex-no-shrink flex align-center" style={{ backgroundColor: backgroundColor }}>
            {!MetabaseSettings.hideEmbedBranding() && (
              <LogoBadge dark={curTheme} />
            )}
            {actionButtons && (
              <div className="flex-align-right text-medium">
                {actionButtons}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(EmbedFrame);
