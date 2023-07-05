/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { message } from "antd";

import cx from "classnames";
import { t } from "ttag";
import Button from "metabase/core/components/Button";

import ParametersPopover from "metabase/dashboard/components/ParametersPopover";
import TippyPopover from "metabase/components/Popover/TippyPopover";
import { createAction, createThunkAction } from "metabase/lib/redux";
import SyncedParametersList from "metabase/parameters/components/SyncedParametersList/SyncedParametersList";
import { SHOW_ADD_PARAMETER_POPOVER } from "metabase/dashboard/actions";
import { ParametersWidgetContainer } from "metabase/dashboard/components/Dashboard/Dashboard.styled";
import { trackStructEvent } from "metabase/lib/analytics";
import { getValuePopulatedParameters } from "metabase-lib/parameters/utils/parameter-values";
import styles from "./Text/Text.css";

export default class Filter extends Component {
  constructor(props) {
    super(props);
    if (props?.dashcard?.id < 1 && props?.dashboard?.id) {
      this.saveChart(props);
    }
    this.state = {
      text: "",
      fontSize: 1,
      isShowAddParameterPopover: false,
    };
  }

  async saveChart(props) {
    const hide = message.loading("Filter adding...", 0);
    const result = await props.saveDashboardAndCards?.(props?.dashboard?.id);
    hide();
  }

  static uiName = "Filter";
  static identifier = "filter";
  static iconName = "dashboard_filter";

  static disableSettingsConfig = false;
  static noHeader = true;
  static supportsSeries = false;
  static hidden = true;
  static supportPreviewing = false; // temporarily disable previewing

  static minSize = { width: 4, height: 1 };

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

  render() {
    const {
      className,
      settings,
      isEditing,
      addParameter,
      parameters,
      dashcard,
      editingParameter,
      isFullscreen,
      dashboard,
      hideParameters,
      setParameterIndex,
      shouldRenderAsNightMode,
      parameterValues,
      setEditingParameter,
      setParameterValue,
    } = this.props;
    const parametersWidget = () => {
      if (getValuePopulatedParameters(parameters, parameterValues)) {
        return (
          <SyncedParametersList
            parameters={getValuePopulatedParameters(
              parameters,
              parameterValues,
            )}
            hideParameters={hideParameters}
            editingParameter={editingParameter}
            dashboard={dashboard}
            dashcard={dashcard}
            isFullscreen={isFullscreen}
            // isNightMode={shouldRenderAsNightMode}
            isEditing={isEditing}
            setParameterValue={setParameterValue}
            setParameterIndex={setParameterIndex}
            setEditingParameter={setEditingParameter}
          />
        );
      } else {
        return null;
      }
    };

    const renderFilter = () => {
      return (
        <ParametersWidgetContainer
          data-testid="edit-dashboard-parameters-widget-container"
          isEditing={isEditing}
          isTransparency={true}
          // isNightMode={shouldRenderAsNightMode}
        >
          {parametersWidget()}
        </ParametersWidgetContainer>
      );
    };
    const renderAddParameterButton = () => {
      return (
        <span key="add-a-filter" style={{ maxWidth: "150px" }}>
          <TippyPopover
            placement="bottom-start"
            onClose={() => {
              this.setState({
                ...this.state,
                isShowAddParameterPopover: false,
              });
            }}
            visible={this.state.isShowAddParameterPopover}
            content={
              <ParametersPopover
                // onAddParameter={addParameter}
                onAddParameter={parameter => {
                  addParameter?.({
                    ...parameter,
                    dashcardId: dashcard?.id,
                  });
                }}
                onClose={() => {
                  this.setState({
                    ...this.state,
                    isShowAddParameterPopover: false,
                  });
                }}
              />
            }
          >
            <div>
              <Button
                key="parameters"
                onlyIcon
                className="Question-header-btn-new"
                iconColor="var(--color-brand)"
                icon="dashboard_filter"
                style={{
                  height: 40,
                  borderColor: "var(--color-brand)",
                  color: "var(--color-brand)",
                }}
                iconSize={16}
                onClick={e => {
                  this.setState({
                    ...this.state,
                    isShowAddParameterPopover: true,
                  });
                  trackStructEvent("click Add Fillter");
                }}
              >
                Add a filter
              </Button>
              <span style={{ fontSize: 18, fontWeight: 600 }}>{" :"}</span>
            </div>
          </TippyPopover>
        </span>
      );
    };

    if (isEditing) {
      return (
        <div className={cx(className, styles.Text)}>
          {this.props.isPreviewing ? (
            <React.Fragment>{renderFilter()}</React.Fragment>
          ) : (
            <div
              style={{ pointerEvents: "all" }}
              className="full flex flex-row items-center"
            >
              {renderAddParameterButton()}
              <ParametersWidgetContainer
                data-testid="edit-dashboard-parameters-widget-container"
                style={{ flex: 1, border: 0 }}
                isEditing={isEditing}
                isNightMode={shouldRenderAsNightMode}
              >
                {parametersWidget()}
              </ParametersWidgetContainer>
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
          {renderFilter()}
        </div>
      );
    }
  }
}
