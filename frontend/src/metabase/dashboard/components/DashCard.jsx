/* eslint-disable react/prop-types */
import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { t } from "ttag";
import visualizations, { getVisualizationRaw } from "metabase/visualizations";
import { mergeSettings } from "metabase/visualizations/lib/settings";
import Visualization, {
  ERROR_MESSAGE_GENERIC,
  ERROR_MESSAGE_PERMISSION,
} from "metabase/visualizations/components/Visualization";
import QueryDownloadWidget from "metabase/query_builder/components/QueryDownloadWidget";

import ModalWithTrigger from "metabase/components/ModalWithTrigger";
import { ChartSettingsWithState } from "metabase/visualizations/components/ChartSettings";
import WithVizSettingsData from "metabase/visualizations/hoc/WithVizSettingsData";

import Icon, { iconPropTypes } from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";

import { isVirtualDashCard } from "metabase/dashboard/utils";
import DashCardParameterMapper from "./DashCardParameterMapper";

import { IS_EMBED_PREVIEW } from "metabase/lib/embed";
import { getClickBehaviorDescription } from "metabase/lib/click-behavior";

import cx from "classnames";
import _ from "underscore";
import { getIn } from "icepick";
import { getParameterValuesBySlug } from "metabase/meta/Parameter";
import Utils from "metabase/lib/utils";
// import moment from "moment";
// import PublicMode from "metabase/modes/components/modes/PublicMode";
import "./DashCard.css";
import { deviceInfo } from "metabase-lib/lib/Device";
import { loginModalShowAction } from "metabase/redux/control";
import { trackStructEvent } from "metabase/lib/analytics";
import { AddToolPopover } from "./Dashboard/DashboardEmptyState/DashboardEmptyState";
// import { snapshot } from "./utils/snapshot";
import * as dashboardActions from "metabase/dashboard/actions";
import { replaceTemplateCardUrl } from "metabase/guest/utils";
import TableChartInfo from "metabase/query_builder/components/TableChartInfo";
import PublicMode from "metabase/modes/components/modes/PublicMode";

const DATASET_USUALLY_FAST_THRESHOLD = 15 * 1000;

const HEADER_ICON_SIZE = 16;

const HEADER_ACTION_STYLE = {
  padding: 4,
};

// This is done to add the `getExtraDataForClick` prop.
// We need that to pass relevant data along with the clicked object.
const WrappedVisualization = WithVizSettingsData(
  connect(null, dispatch => ({ dispatch }))(Visualization),
);

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
  ...dashboardActions,
};

@connect(mapStateToProps, mapDispatchToProps)
export default class DashCard extends Component {
  static propTypes = {
    dashcard: PropTypes.object.isRequired,
    gridItemWidth: PropTypes.number.isRequired,
    dashcardData: PropTypes.object.isRequired,
    slowCards: PropTypes.object.isRequired,
    parameterValues: PropTypes.object.isRequired,
    markNewCardSeen: PropTypes.func.isRequired,
    fetchCardData: PropTypes.func.isRequired,
    navigateToNewCardFromDashboard: PropTypes.func.isRequired,
    duplicateAction: PropTypes.func,
    headerIcon: PropTypes.shape(iconPropTypes),
  };

  constructor(props) {
    super(props);

    this.state = {
      isPreviewingCard: false,
    };
  }

  async componentDidMount() {
    const { dashcard, markNewCardSeen } = this.props;

    // HACK: way to scroll to a newly added card
    if (dashcard.justAdded) {
      const element = ReactDOM.findDOMNode(this);
      if (element && element.scrollIntoView) {
        element.scrollIntoView({ block: "nearest" });
      }
      markNewCardSeen(dashcard.id);
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.visibilityTimer);
  }

  handlePreviewToggle = () => {
    this.setState(prevState => ({
      isPreviewingCard: !prevState.isPreviewingCard,
    }));
  };

  preventDragging = e => {
    e.stopPropagation();
  };

  getWrappedVisualizationPadding = ({
    hideBackground,
    isEditing,
    mainCard,
  }) => {
    if (deviceInfo().isMobile) {
      return "6px";
    }
    return hideBackground ||
      (isEditing &&
        (mainCard.display === "text" ||
          mainCard.display === "image" ||
          mainCard.display === "video"))
      ? ""
      : "18px 24px";
  };

  render() {
    const {
      dashcard,
      dashcardData,
      slowCards,
      isEditing,
      clickBehaviorSidebarDashcard,
      isEditingParameter,
      isFullscreen,
      onAddSeries,
      onRemove,
      navigateToNewCardFromDashboard,
      metadata,
      dashboard,
      parameterValues,
      mode,
      user,
      clearWatermark,
      duplicateAction,
      chartStyle,
      headerIcon,
    } = this.props;
    const mainCard = {
      ...dashcard.card,
      visualization_settings: mergeSettings(
        dashcard.card.visualization_settings,
        dashcard.visualization_settings,
      ),
    };
    const cards = [mainCard].concat(dashcard.series || []);
    const dashboardId = dashcard.dashboard_id;
    const display = (dashcard.card || {}).display;
    const isEmbed = Utils.isJWT(dashboardId);
    const series = cards.map(card => ({
      ...getIn(dashcardData, [dashcard.id, card.id]),
      card: card,
      isSlow: slowCards[card.id],
      isUsuallyFast:
        card.query_average_duration &&
        card.query_average_duration < DATASET_USUALLY_FAST_THRESHOLD,
    }));

    const loading =
      !(series.length > 0 && _.every(series, s => s.data)) &&
      display !== "text" &&
      display !== "image" &&
      display !== "video";
    const expectedDuration = Math.max(
      ...series.map(s => s.card.query_average_duration || 0),
    );
    const usuallyFast = _.every(series, s => s.isUsuallyFast);
    const isSlow =
      loading &&
      _.some(series, s => s.isSlow) &&
      (usuallyFast ? "usually-fast" : "usually-slow");
    const errors = series.map(s => s.error).filter(e => e);

    let errorMessage, errorIcon;
    if (_.any(errors, e => e && e.status === 403)) {
      errorMessage = ERROR_MESSAGE_PERMISSION;
      errorIcon = "key";
    } else if (errors.length > 0) {
      if (IS_EMBED_PREVIEW) {
        errorMessage = (errors[0] && errors[0].data) || ERROR_MESSAGE_GENERIC;
      } else {
        errorMessage = ERROR_MESSAGE_GENERIC;
      }
      errorIcon = "warning";
    }

    const parameterValuesBySlug = getParameterValuesBySlug(
      dashboard.parameters,
      parameterValues,
    );

    const isTextDisplay = mainCard.display === "text";
    const isImageDisplay = mainCard.display === "image";
    const isVideoDisplay = mainCard.display === "video";

    const hideBackground =
      !isEditing &&
      mainCard.visualization_settings["dashcard.background"] === false;

    const isEditingDashboardLayout =
      isEditing && clickBehaviorSidebarDashcard == null && !isEditingParameter;

    const id = `html2canvas-${dashcard.card.name}-${dashcard.card.id}`;
    // const fileName = `Footprint-${dashcard.card.name}-${moment().format(
    //   "MM/DD/YYYY",
    // )}`;
    const isOwner =
      user && (user.is_superuser || user.id === dashcard?.card?.creator_id);
    // const hideDownload =
    //   (mode && mode.name === PublicMode.name) ||
    //   mainCard.display === "text" ||
    //   mainCard.display === "image" ||
    //   mainCard.display === "video";
    const showEdit = isOwner && !!dashcard.card.id;

    const hideDuplicate = isTextDisplay || isImageDisplay || isVideoDisplay;

    const hideWatermark =
      clearWatermark || isTextDisplay || isImageDisplay || isVideoDisplay;

    const isPublic = mode && mode.name === PublicMode.name;

    const showPreview =
      !isPublic &&
      !showEdit &&
      !isTextDisplay &&
      !isImageDisplay &&
      !isVideoDisplay;

    const showChartInfo =
      !isPublic && !isTextDisplay && !isImageDisplay && !isVideoDisplay;

    const wrappedVisualizationPadding = this.getWrappedVisualizationPadding({
      hideBackground,
      isEditing,
      mainCard,
    });

    const editAction = card => {
      window.open(`/chart/${card.id}?defaultEdit=true`);
    };

    const cardDomKey = `Card--${String(dashcard.id).replace(".", "")}`;

    return (
      <div
        id={id}
        className={cx(
          "Card bordered rounded flex flex-column hover-parent hover--visibility",
          {
            "Card--slow": isSlow === "usually-slow",
            thumbFilter: dashcard.thumbFilter,
          },
          cardDomKey,
        )}
        style={
          hideBackground
            ? {
                border: 0,
                background: "transparent",
                boxShadow: "none",
                paddingBottom: 0,
              }
            : { paddingBottom: 0 }
        }
      >
        <div
          style={{
            textAlign: "right",
            position: "absolute",
            right: 8,
            top: 8,
            zIndex: 2,
          }}
        >
          {showEdit && editAction && (
            <Tooltip key="ChartEdit" tooltip={t`Edit`}>
              <a
                className="html2canvas-filter dash-card__button"
                onClick={() => {
                  editAction && editAction(dashcard.card);
                  trackStructEvent(`dashcard click to edit`);
                }}
              >
                <Icon name={"pencil"} size={14} color={"#9AA0AF"} />
              </a>
            </Tooltip>
          )}
          {showPreview && (
            <Tooltip key="ChartPreview" tooltip={t`Preview`}>
              <a
                className="html2canvas-filter dash-card__button"
                onClick={() => {
                  replaceTemplateCardUrl(this.props, dashcard.card.id);
                  trackStructEvent(`dashcard click to preview`);
                }}
              >
                <Icon name={"chart_preview"} size={14} color={"#9AA0AF"} />
              </a>
            </Tooltip>
          )}
          {!hideDuplicate && duplicateAction && (
            <Tooltip key="ChartDuplicate" tooltip={t`Duplicate`}>
              <a
                className="html2canvas-filter dash-card__button"
                onClick={() => {
                  duplicateAction && duplicateAction(dashcard.card);
                  trackStructEvent(`dashcard click to copy`);
                }}
              >
                <Icon name={"duplicate"} size={14} color={"#9AA0AF"} />
              </a>
            </Tooltip>
          )}
          {showChartInfo && (
            <Tooltip key="ChartInfo" tooltip={t`Chart Info`}>
              <TableChartInfo
                dashboard={dashboard}
                card={dashcard?.card}
                dashcard={dashcard}
                tableName={dashcard?.card?.table_name}
                tableId={dashcard?.card?.table_id}
              />
            </Tooltip>
          )}
          {/* {!hideDownload && (
            <a
              className="html2canvas-filter"
              style={{
                display: "inline",
                position: "relative",
                cursor: "pointer",
                margin: "0px 10px",
              }}
              onClick={() => {
                snapshot({
                  public_uuid: dashcard.public_uuid,
                  isDashboard: false,
                  user
                })
                trackStructEvent(`dashcard click to download`);
              }}
            >
              <Icon name={"camera"} size={14} color={"#9AA0AF"} />
            </a>
          )} */}
        </div>
        {isEditingDashboardLayout ? (
          <DashboardCardActionsPanel onMouseDown={this.preventDragging}>
            <DashCardActionButtons
              loading={loading}
              series={series}
              hasError={!!errorMessage}
              isVirtualDashCard={isVirtualDashCard(dashcard)}
              onRemove={onRemove}
              onAddSeries={onAddSeries}
              onReplaceAllVisualizationSettings={
                this.props.onReplaceAllVisualizationSettings
              }
              showClickBehaviorSidebar={() =>
                this.props.showClickBehaviorSidebar(dashcard.id)
              }
              isPreviewing={this.state.isPreviewingCard}
              onPreviewToggle={this.handlePreviewToggle}
            />
          </DashboardCardActionsPanel>
        ) : null}
        <AddToolPopover
          onToggleAddQuestionSidebar={this.props.openAddQuestionSidebar}
          visible={
            isEditingDashboardLayout &&
            dashboard.id === "new" &&
            dashcard.id ===
              dashboard.ordered_cards[dashboard.ordered_cards.length - 1].id
          }
          getPopupContainer={() => document.querySelector("." + cardDomKey)}
          {...this.props}
        >
          <WrappedVisualization
            className={cx("flex-full overflow-hidden", {
              "pointer-events-none": isEditingDashboardLayout,
            })}
            style={{
              position: "relative",
              zIndex: 1,
              padding: wrappedVisualizationPadding,
            }}
            classNameWidgets={isEmbed && "text-light text-medium-hover"}
            error={errorMessage}
            headerIcon={headerIcon}
            errorIcon={errorIcon}
            isSlow={isSlow}
            expectedDuration={expectedDuration}
            rawSeries={series}
            showTitle
            isFullscreen={isFullscreen}
            isDashboard
            dispatch={this.props.dispatch}
            dashboard={dashboard}
            parameterValuesBySlug={parameterValuesBySlug}
            isEditing={isEditing}
            clickable={isOwner}
            hideWatermark={hideWatermark}
            isPreviewing={this.state.isPreviewingCard}
            gridSize={
              this.props.isMobile
                ? undefined
                : { width: dashcard.sizeX, height: dashcard.sizeY }
            }
            actionButtons={
              isEmbed ? (
                <QueryDownloadWidget
                  className="m1 text-brand-hover text-light"
                  classNameClose="hover-child"
                  card={dashcard.card}
                  params={parameterValuesBySlug}
                  dashcardId={dashcard.id}
                  token={dashcard.dashboard_id}
                  icon="download"
                />
              ) : null
            }
            onUpdateVisualizationSettings={
              this.props.onUpdateVisualizationSettings
            }
            replacementContent={
              (clickBehaviorSidebarDashcard != null || isEditingParameter) &&
              isVirtualDashCard(dashcard) ? (
                <div className="flex full-height align-center justify-center">
                  <h4 className="text-medium">{t`Text card`}</h4>
                </div>
              ) : isEditingParameter ? (
                <DashCardParameterMapper dashcard={dashcard} />
              ) : clickBehaviorSidebarDashcard != null ? (
                <ClickBehaviorSidebarOverlay
                  dashcard={dashcard}
                  dashcardWidth={this.props.gridItemWidth}
                  dashboard={dashboard}
                  showClickBehaviorSidebar={this.props.showClickBehaviorSidebar}
                  isShowingThisClickBehaviorSidebar={
                    clickBehaviorSidebarDashcard.id === dashcard.id
                  }
                />
              ) : null
            }
            metadata={metadata}
            mode={mode}
            onChangeCardAndRun={arg => {
              const { unAuth, nextCard, previousCard } = arg;
              const enable = unAuth || isOwner;
              if (enable && navigateToNewCardFromDashboard) {
                // navigateToNewCardFromDashboard needs `dashcard` for applying active filters to the query
                navigateToNewCardFromDashboard({
                  nextCard,
                  previousCard,
                  dashcard,
                });
              }
            }}
            onChangeLocation={this.props.onChangeLocation}
            dynamicParams={dashboard && dashboard.dynamicParams}
            chartStyle={chartStyle}
            dashcard={dashcard}
          />
        </AddToolPopover>
      </div>
    );
  }
}

const DashboardCardActionsPanel = styled.div`
  padding: 0.125em 0.25em;
  position: absolute;
  background: white;
  transform: translateY(-50%);
  top: 0;
  right: 20px;
  border-radius: 8px;
  box-shadow: 0px 1px 3px rgb(0 0 0 / 13%);
  z-index: 3;
  cursor: default;
  transition: opacity 200ms;
  opacity: 0;
  pointer-events: none;

  .Card:hover & {
    opacity: 1;
    pointer-events: all;
  }

  .Dash--dragging & {
    display: none;
  }
`;

const DashCardActionButtons = ({
  loading,
  series,
  isVirtualDashCard,
  hasError,
  onRemove,
  onAddSeries,
  onReplaceAllVisualizationSettings,
  showClickBehaviorSidebar,
  onPreviewToggle,
  isPreviewing,
}) => {
  const buttons = [];

  if (getVisualizationRaw(series).visualization.supportPreviewing) {
    buttons.push(
      <ToggleCardPreviewButton
        key="ToggleCardPreviewButton"
        isPreviewing={isPreviewing}
        onPreviewToggle={onPreviewToggle}
      />,
    );
  }

  if (!hasError) {
    if (
      !loading &&
      onReplaceAllVisualizationSettings &&
      !getVisualizationRaw(series).visualization.disableSettingsConfig
    ) {
      buttons.push(
        <ChartSettingsButton
          key="ChartSettingsButton"
          series={series}
          onReplaceAllVisualizationSettings={onReplaceAllVisualizationSettings}
        />,
      );
    }
    if (!isVirtualDashCard) {
      buttons.push(
        <Tooltip key="ClickBehavior" tooltip={t`Click behavior`}>
          <a
            className="text-dark-hover drag-disabled mr1"
            data-metabase-event="Dashboard;Open Click Behavior Sidebar"
            onClick={showClickBehaviorSidebar}
            style={HEADER_ACTION_STYLE}
          >
            <Icon name="click" />
          </a>
        </Tooltip>,
      );
    }

    if (getVisualizationRaw(series).visualization.supportsSeries) {
      buttons.push(
        <AddSeriesButton
          key="AddSeriesButton"
          series={series}
          onAddSeries={onAddSeries}
        />,
      );
    }
  }

  return (
    <span className="flex align-center text-medium" style={{ lineHeight: 1 }}>
      {buttons}
      <Tooltip tooltip={t`Remove`}>
        <RemoveButton className="ml1" onRemove={onRemove} />
      </Tooltip>
    </span>
  );
};

const ChartSettingsButton = ({ series, onReplaceAllVisualizationSettings }) => (
  <ModalWithTrigger
    wide
    tall
    triggerElement={
      <Tooltip tooltip={t`Visualization options`}>
        <Icon
          name="palette"
          // size={HEADER_ICON_SIZE}
          size={20}
          style={HEADER_ACTION_STYLE}
        />
      </Tooltip>
    }
    triggerClasses="text-dark-hover cursor-pointer flex align-center flex-no-shrink mr1 drag-disabled"
    enableMouseEvents
  >
    <ChartSettingsWithState
      className="spread"
      series={series}
      onChange={onReplaceAllVisualizationSettings}
      isDashboard
    />
  </ModalWithTrigger>
);

const RemoveButton = ({ onRemove }) => (
  <a
    className="text-dark-hover drag-disabled"
    data-metabase-event="Dashboard;Remove Card Modal"
    onClick={onRemove}
    style={{ ...HEADER_ACTION_STYLE, display: "flex", alignItems: "center" }}
  >
    <Icon name="close" size={HEADER_ICON_SIZE} />
  </a>
);

const AddSeriesButton = ({ series, onAddSeries }) => (
  <a
    data-metabase-event={"Dashboard;Edit Series Modal;open"}
    className="text-dark-hover cursor-pointer h3 flex-no-shrink relative mr1 drag-disabled"
    onClick={onAddSeries}
    style={HEADER_ACTION_STYLE}
  >
    <Tooltip tooltip={series.length > 1 ? t`Edit series` : t`Add series`}>
      <span className="flex align-center">
        <span className="flex">
          <Icon
            className="absolute"
            name="add"
            style={{ top: 0, left: 1 }}
            size={HEADER_ICON_SIZE / 2}
          />
          <Icon name={getSeriesIconName(series)} size={HEADER_ICON_SIZE - 2} />
        </span>
      </span>
    </Tooltip>
  </a>
);

const ToggleCardPreviewButton = ({ isPreviewing, onPreviewToggle }) => {
  return (
    <a
      data-metabase-event={"Dashboard;Text;edit"}
      className="text-dark-hover cursor-pointer h3 flex-no-shrink relative mr1 drag-disabled"
      onClick={onPreviewToggle}
      style={HEADER_ACTION_STYLE}
    >
      <Tooltip tooltip={isPreviewing ? t`Edit` : t`Preview`}>
        <span className="flex align-center">
          <span className="flex" style={{ width: 18 }}>
            {isPreviewing ? (
              <Icon name="edit_document" size={HEADER_ICON_SIZE} />
            ) : (
              <Icon name="eye" size={18} />
            )}
          </span>
        </span>
      </Tooltip>
    </a>
  );
};

function getSeriesIconName(series) {
  try {
    const display = series[0].card.display;
    return visualizations.get(display === "scalar" ? "bar" : display).iconName;
  } catch (e) {
    return "bar";
  }
}

const MIN_WIDTH_FOR_ON_CLICK_LABEL = 330;

const ClickBehaviorSidebarOverlay = ({
  dashcard,
  dashcardWidth,
  showClickBehaviorSidebar,
  isShowingThisClickBehaviorSidebar,
}) => {
  return (
    <div className="flex align-center justify-center full-height">
      <div
        className={cx("text-bold flex py1 px2 mb2 rounded cursor-pointer", {
          "bg-brand text-white": isShowingThisClickBehaviorSidebar,
          "bg-light text-medium": !isShowingThisClickBehaviorSidebar,
        })}
        onClick={() =>
          showClickBehaviorSidebar(
            isShowingThisClickBehaviorSidebar ? null : dashcard.id,
          )
        }
      >
        <Icon
          name="click"
          className={cx("mr1", {
            "text-light": !isShowingThisClickBehaviorSidebar,
          })}
        />
        {dashcardWidth > MIN_WIDTH_FOR_ON_CLICK_LABEL && (
          <div className="mr2">{t`On click`}</div>
        )}
        <div
          className={cx({ "text-brand": !isShowingThisClickBehaviorSidebar })}
        >
          {getClickBehaviorDescription(dashcard)}
        </div>
      </div>
    </div>
  );
};
