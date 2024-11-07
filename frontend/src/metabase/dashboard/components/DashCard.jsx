/* eslint-disable react/prop-types */
import React, { Component } from "react";
import styled from "@emotion/styled";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { get } from "lodash";
import { t } from "ttag";
import cx from "classnames";
import _ from "underscore";
import { getIn } from "icepick";
import { DatabaseOutlined, LockFilled } from "@ant-design/icons";
import visualizations, { getVisualizationRaw } from "metabase/visualizations";
import { mergeSettings } from "metabase/visualizations/lib/settings";
import Visualization, {
  ERROR_MESSAGE_GENERIC,
  ERROR_MESSAGE_PERMISSION,
} from "metabase/visualizations/components/Visualization";
import QueryDownloadWidget from "metabase/query_builder/components/QueryDownloadWidget";
import { SERVER_ERROR_TYPES } from "metabase/lib/errors";

import ModalWithTrigger from "metabase/components/ModalWithTrigger";
import { ChartSettingsWithState } from "metabase/visualizations/components/ChartSettings";
import WithVizSettingsData from "metabase/visualizations/hoc/WithVizSettingsData";

import Icon, { iconPropTypes } from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";

import { isVirtualDashCard } from "metabase/dashboard/utils";

import { IS_EMBED_PREVIEW } from "metabase/lib/embed";

import { isActionCard } from "metabase/writeback/utils";
import { deviceInfo } from "metabase-lib/lib/Device";
import Utils from "metabase/lib/utils";
import { getClickBehaviorDescription } from "metabase/lib/click-behavior";
import PublicMode from "metabase/modes/components/modes/PublicMode";
import { trackStructEvent } from "metabase/lib/analytics";
import TableChartInfo from "metabase/query_builder/components/TableChartInfo";
import { getParameterValuesBySlug } from "metabase-lib/parameters/utils/parameter-values";
import { DashCardRoot } from "./DashCard.styled";
import DashCardParameterMapper from "./DashCardParameterMapper";
import "./DashCard.css";
import QueryDownloadWidgetFP from "metabase/query_builder/components/QueryDownloadWidgetFP";
import {
  addTextDashCardToDashboard,
  toggleSidebar,
} from "metabase/dashboard/actions";
import QueryRealtimeButton from "metabase/query_builder/components/QueryRealtimeButton";
import { isRealtimeChart } from "metabase/dashboard/components/utils/realtime";
import { getRealtimeList } from "metabase/selectors/config";
import QueryStatusButton from "metabase/query_builder/components/QueryStatusButton";
import QueryRefreshButton from "metabase/query_builder/components/QueryRefreshButton";
import { isFgaPath } from "metabase/growth/utils/utils";
import { isABPath, isFGAVCPath } from "metabase/ab/utils/utils";
import { IFRAMED_IN_SELF } from "metabase/lib/dom";
import { Button, Form, Input, message, Modal, Radio, Spin } from "antd";
import { fgaPlanMapping } from "metabase/visualizations/util/data";
import FgaProResult from "metabase/visualizations/components/FgaProResult";
import FgaFlowUploadLayout from "metabase/visualizations/components/FgaFlowUploadLayout";
import { getFgaProject } from "metabase/selectors/user";
import { createFgaProjectModalShowAction, loginModalShowAction, setUserExtend } from "metabase/redux/control";
import {
  getFgaChartTypeMappingById, getWeb3TypeText,
  isAdvancedCard,
  isStandardCard,
  isWeb2Card,
  isWeb3Card, isWeb3DataCreated,
} from "metabase/ab/utils/mapping-utils";
import { getPeaToken, getUserExtend } from "metabase/selectors/control";
import FgaFlowCreateProject from "metabase/visualizations/components/FgaFlowCreateProject";

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

class DashCard extends Component {
  static propTypes = {
    dashcard: PropTypes.object.isRequired,
    gridItemWidth: PropTypes.number.isRequired,
    totalNumGridCols: PropTypes.number.isRequired,
    dashcardData: PropTypes.object.isRequired,
    slowCards: PropTypes.object.isRequired,
    parameterValues: PropTypes.object.isRequired,
    markNewCardSeen: PropTypes.func.isRequired,
    fetchCardData: PropTypes.func.isRequired,
    navigateToNewCardFromDashboard: PropTypes.func.isRequired,
    headerIcon: PropTypes.shape(iconPropTypes),
    isNightMode: PropTypes.bool,
  };


  constructor(props) {
    super(props);
    // const fgaFlowType = !userId ? "login" : !isPay ? 'pay': 'integration'

    this.state = {
      isPreviewingCard: false,
      isLoading: false,
      fgaFlowType: '',
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
          mainCard.display === "embed" ||
          mainCard.display === "multi_embed" ||
          mainCard.display === "tableau" ||
          mainCard.display === "filter" ||
          mainCard.display === "video"))
      ? ""
      : "";
  };

  extractErrorColumn = text => {
    const pattern = /Column '([^']+)'/;
    const matches = text.match(pattern);
    if (matches && matches.length >= 2) {
      return matches[1];
    } else {
      return null;
    }
  };

  mappingErrorColumn = text => {
    const map = {
      "footprint.token_daily_stats.token_unique_symbol":
        "token_daily_stats.token_symbol",
      "footprint.token_daily_stats.address": "token_daily_stats.token_slug",
      "footprint.token_daily_stats.coin_id": "token_daily_stats.token_slug",
      "token_daily_stats.day": "token_daily_stats.on_date",
      "gamefi_protocol_daily_stats.day": "gamefi_protocol_daily_stats.on_date",
      "footprint.nft_collection_daily_stats.protocol_slug":
        "nft_collection_daily_stats.collection_slug",
      "token_daily_stats.token_unique_symbol": "token_daily_stats.token_symbol",
      "token_daily_stats.symbol": "token_daily_stats.token_symbol",
      "footprint.nft_transactions.marketplace_name":
        "nft_transactions.marketplace_slug",
    };

    return map[text] || "";
  };

  mappingErrorTip = error => {
    if (!error || !_.isString(error)) {
      return error;
    }
    if (error.startsWith("Cannot determine the source table or query")) {
      return "Cannot determine the source or query. \nTip: Update the column of filter on the dashboard.";
    }
    if (error.indexOf("Column") && error.indexOf("cannot be resolved")) {
      const column = this.extractErrorColumn(error);
      const fixResult = this.mappingErrorColumn(column);
      if (fixResult) {
        return `The column cannot be resolved.\nTip: Use the field ${fixResult} instead of the field ${column} `;
      }
      const pattern = /\s\([^)]+\): line \d+:\d+/;
      return error.replace(pattern, "").replace("footprint.", "");
    }
    return error;
  };

  // eslint-disable-next-line complexity
  render() {
    const {
      dashcard,
      dashcardData,
      slowCards,
      isEditing,
      clickBehaviorSidebarDashcard,
      isEditingParameter,
      isFullscreen,
      isMobile,
      onAddSeries,
      onRemove,
      navigateToNewCardFromDashboard,
      metadata,
      dashboard,
      parameterValues,
      mode,
      headerIcon,
      isNightMode,
      user,
      clearWatermark,
      duplicateAction,
      previewAction,
      getDataViaSqlApiAction,
      chartStyle,
      realtimeList,
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

    const tableLastUpdateInfo = get(series, "[0].tableLastUpdateInfo")
    const chartUpdatedAt = get(series, "[0].updated_at") || get(series, "[0].started_at")

    const loading =
      !(series.length > 0 && _.every(series, s => s.data)) &&
      !isVirtualDashCard(dashcard) &&
      display !== "text" &&
      display !== "image" &&
      display !== "embed" &&
      display !== "multi_embed" &&
      display !== "tableau" &&
      display !== "filter" &&
      display !== "video";

    const expectedDuration = Math.max(
      ...series.map(s => s.card.query_average_duration || 0),
    );
    const usuallyFast = _.every(series, s => s.isUsuallyFast);
    const isSlow =
      loading &&
      _.some(series, s => s.isSlow) &&
      (usuallyFast ? "usually-fast" : "usually-slow");

    const isAccessRestricted = series.some(
      s =>
        s.error_type === SERVER_ERROR_TYPES.missingPermissions ||
        s.error?.status === 403,
    );
    const errors = series.map(s => s.error).filter(e => e);

    let errorMessage, errorIcon;

    const fpCustomError =
      errors?.length > 0 &&
      errors[0] &&
      errors[0].code === -1 &&
      errors[0].message;
    if (fpCustomError) {
      errorMessage = fpCustomError;
      errorIcon = "key";
    } else if (isAccessRestricted) {
      errorMessage = ERROR_MESSAGE_PERMISSION;
      errorIcon = "key";
    } else if (errors.length > 0) {
      errorMessage =
        this.mappingErrorTip((errors[0] && errors[0].data) || errors[0]) ||
        ERROR_MESSAGE_GENERIC;
      errorIcon = "warning";
    }

    const parameterValuesBySlug = getParameterValuesBySlug(
      dashboard.parameters,
      parameterValues,
    );
    const isTextDisplay = mainCard.display === "text";
    const isImageDisplay = mainCard.display === "image";
    const isVideoDisplay = mainCard.display === "video";
    const isEmbedDisplay = mainCard.display === "embed";
    const isMultiEmbedDisplay = mainCard.display === "multi_embed";
    const isTableauDisplay = mainCard.display === "tableau";
    const isFilterDisplay = mainCard.display === "filter";

    const isResearch = window.location.pathname.startsWith("/research");

    const isAction = isActionCard(mainCard);

    const hideBackground =
      !isEditing &&
      (mainCard.visualization_settings["dashcard.background"] === false ||
        mainCard.display === "list" ||
        isAction);

    const isEditingDashboardLayout =
      isEditing && clickBehaviorSidebarDashcard == null && !isEditingParameter;

    const gridSize = { width: dashcard.size_x, height: dashcard.size_y };

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
    const showEdit = isOwner && !!dashcard.card.id && !isABPath() && !isFGAVCPath();
    const isPublic = window.location.pathname.startsWith("/public")
      || isFgaPath()
      || window.location.pathname.startsWith("/data-api/statistics")
      || window.location.pathname.startsWith("/studio")
    ;

    const getOuterPathname = () => {
      let outerPathname = "";
      try {
        outerPathname = window.top.location.pathname;
      } catch (e) {
        outerPathname = document.referrer;
      }
      return outerPathname;
    };

    const isIframeShow = window.location.pathname.startsWith("/public")
      && IFRAMED_IN_SELF
      && !getOuterPathname()?.startsWith("/public")

    const singleDisplay = isTextDisplay || isImageDisplay || isVideoDisplay || isEmbedDisplay || isMultiEmbedDisplay || isTableauDisplay;

    const hideDuplicate = singleDisplay || isPublic || isABPath() || isFGAVCPath();

    const hideWatermark = clearWatermark || singleDisplay;

    const showPreview = !isABPath() && !isFGAVCPath() && !isPublic && !showEdit && !singleDisplay;

    const showGetDataViaSqlApi = showEdit || showPreview || isIframeShow;
    const showDownload = showEdit || showPreview || isIframeShow;
    const showChartInfo = false;
    const showChartRefresh = !isPublic && !singleDisplay;
    const showStatusButton = showChartRefresh;
    // const showProduceFullData = this.props.showNormalChartData;
    const showProduceFullData = this.props.userExtend?.web2Data;

    const editAction = card => {
      window.open(`/chart/${card.id}?editingOnLoad=true`);
    };

    const cardDomKey = `Card--${String(dashcard.id).replace(".", "")}`;

    const result = getIn(dashcardData, [dashcard.id, dashcard.card_id]);

    const wrappedVisualizationPadding = this.getWrappedVisualizationPadding({
      hideBackground,
      isEditing,
      mainCard,
    });

    // fga

    /*const getFgaFlowType = () => {
      // "normal"
      // "pay"
      // "integration"
      return this.state.fgaFlowType

    }*/
    const getFgaFlowType = (props, cardId) => {
      if (!cardId) {
        return null
      }
      const userId = props.user?.id
      if (!userId) {
        return "login"
      }
      // 如果 projectid 为空 创建一个 project
      if (!props.projectObject?.id) {
      // if (!props.userExtend?.project) {
        return "createProject"
      }
      // const isNotStandardUser = props.userExtend?.plan !== 'standard' && props.userExtend?.plan !== 'advanced'
      const isNotStandardUser = false
      const standardCard = isStandardCard(cardId)
      // 如果当前用户不是付费用户
      if (isNotStandardUser && standardCard) {
        return 'pay'
      }
      const isNotAdvancedUser = props.userExtend?.plan !== 'advanced'
      const advancedCard = isAdvancedCard(cardId)
      // 如果当前用户是standard付费用户 并且当前卡片是advanced卡片
      if (isNotAdvancedUser && advancedCard) {
        return 'advancedPay'
      }
      const web2Card = isWeb2Card(cardId)
      const isWeb2DataCreated = !!props.userExtend?.web2Data
      // 如果当前card是web2，web2 数据没有创建 {
      if (web2Card && !isWeb2DataCreated) {
        return 'integration'
      }
      const web3Card = isWeb3Card(cardId)
      const web3DataCreated = isWeb3DataCreated(cardId, this.props.projectObject)
      // // 如果当前card是web3，web3 数据没有创建 {
      if (web3Card && !web3DataCreated) {
        return 'submitProjectInfo'
      }
      if (web2Card && isWeb2DataCreated) {
        return 'normal'
      }
      return 'normal'
    }
    const changeFgaFlowType = (type) => {
      this.setState({fgaFlowType: type})
    }

    const isCustom = !['text', 'image', 'filter'].includes(series[0]?.card?.display) &&
      // !(this.props.showNormalChartData && (series[0]?.card?.id === 50934 || series[0]?.card?.id === 50935)) &&
      // !(this.props.showNormalChartData && (series[0]?.card?.id === 50934 || series[0]?.card?.id === 50935)) &&
      (
        window.location.pathname.startsWith("/fga/pro")
        && getFgaFlowType(this.props, series[0]?.card?.id) !== 'normal'
        // [186,10, 52, 37,25].includes(this.props?.user?.id) &&
        // window.location.pathname.includes("acquisition_users_pro") &&
        // (getFgaFlowType() === 'pay' || getFgaFlowType() === 'integration' || getFgaFlowType() === 'login' || getFgaFlowType() === 'loading')
      )

    const showIntegrationDialog = () => {
      const modalDestroy = Modal.info({
        width: 900,
        icon: null,
        content: (<FgaFlowUploadLayout
          projectObject={this.props.projectObject}
          onSuccess={() => {
          // changeFgaFlowType("loading")
          // changeFgaFlowType("normal")
            this.props.setUserExtend({
              ...(this.props.userExtend || {}),
              web2Data: true
            })
          modalDestroy.destroy()
          // this.props.fgaFlowInteractionSuccess?.()
        }}/>),
        okText: "OK",
        footer: null,
        onOk: () => {
          // changeFgaFlowType("loading")
          this.props.setUserExtend({
            ...(this.props.userExtend || {}),
            web2Data: true
          })
          // changeFgaFlowType("normal")
        },
      });
    }

    const renderFgaFlowTypeLayout = (type) => {
      if (type === "login") {
        return (
          <FgaProResult
            cardId={dashcard.card.id}
            height={this.props.height}
            width={this.props.gridItemWidth}
            subTitle={<div className={"text-white"}><LockFilled /> Login to access this data.<br/>This data is Only available for Footprint user</div>}
            extra={[
              <Button key='xxx' onClick={() => {
                this.props.setLoginModalShow({
                  show: true,
                  from: `FGA Pro`,
                })
              }}>
                Sign in
              </Button>
            ]}
          />
        )
      }
      if (type === "pay") {
        return (
          <FgaProResult
            cardId={dashcard.card.id}
            height={this.props.height}
            width={this.props.gridItemWidth}
            subTitle={<div className={"text-white"}><LockFilled />This data is Only available for standard plan</div>}
            extra={[
              <Button key='xxx' onClick={() => {
                Modal.info({
                  icon: null,
                  title: "Choose a plan",
                  content: (<div className="flex flex-col">
                    <Radio.Group style={{ width: '100%' }} className="flex flex-col" defaultValue={"Standard Package $120"}>
                      {['Standard Package $120'].map((item, index) => (
                        <Radio key={index} value={item} >
                          {item}
                        </Radio>
                      ))}
                    </Radio.Group>
                    {/*<Radio.Group style={{ width: '100%' }} className="flex flex-col" defaultValue={"Advanced Package $300"}>
                      {['Advanced Package $300', 'Community Package $400'].map((item, index) => (
                        <Radio key={index} value={item} >
                          {item}
                        </Radio>
                      ))}
                    </Radio.Group>*/}
                  </div>),
                  okText: "OK",
                  onOk: () => {
                    message.success("Subscribe successfully!");
                    // changeFgaFlowType("integration")
                    this.props.setUserExtend({
                      ...(this.props.userExtend || {}),
                      plan: 'standard'
                    })
                  },
                });
              }}>
                Subscribe
              </Button>
            ]}
          />
        )
      }
      if (type === "advancedPay") {
        return (
          <FgaProResult
            cardId={dashcard.card.id}
            height={this.props.height}
            width={this.props.gridItemWidth}
            subTitle={<div className={"text-white"}><LockFilled />your plan to unlock more exclusive insights</div>}
            extra={[
              <Button key='xxx' onClick={() => {
                Modal.info({
                  icon: null,
                  title: "Choose a plan",
                  content: (<div className="flex flex-col">
                    <Radio.Group style={{ width: '100%' }} className="flex flex-col" defaultValue={"Advanced Package $300"}>
                      {['Advanced Package $300', 'Community Package $400'].map((item, index) => (
                        <Radio key={index} value={item} >
                          {item}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </div>),
                  okText: "OK",
                  onOk: () => {
                    message.success("Subscribe successfully!");
                    // changeFgaFlowType("integration")
                    this.props.setUserExtend({
                      ...(this.props.userExtend || {}),
                      plan: 'advanced'
                    })
                  },
                });
              }}>
                Upgrade
              </Button>
            ]}
          />
        )
      }
      if (type === "integration") {
        return (
          <FgaProResult
            cardId={dashcard.card.id}
            height={this.props.height}
            width={this.props.width}
            subTitle={<div className={"text-white"}><LockFilled />your web2 data to view standard analysis</div>}
            extra={[
              <Button key='xxx' onClick={() => {
                showIntegrationDialog()
              }}>Upload</Button>
            ]}
          />

        )
      }
      if (type === "loading") {
        return (
          <FgaProResult
            icon={<Spin key="xxx"/>}
            cardId={dashcard.card.id}
            height={this.props.height}
            width={this.props.width}
            subTitle={<div className={"text-white"}>The data is being generated! <br />please wait a few minutes. <br />You can refresh the dashboard</div>}
          />

        )
      }
      if (type === "createProject") {
        return (
          <FgaProResult
            cardId={dashcard.card.id}
            height={this.props.height}
            width={this.props.gridItemWidth}
            subTitle={<div className={"text-white"}><LockFilled />Create Project to access this data.</div>}
            extra={[
              <Button key='xxx' onClick={() => {
                Modal.info({
                  icon: null,
                  title: "Create Project",
                  content: (<div className="flex flex-col">
                    <Form>
                      <Form.Item label="Project Name">
                        <Input placeholder={"please input your project name"}/>
                      </Form.Item>
                    </Form>
                  </div>),
                  okText: "OK",
                  onOk: () => {
                    message.success("Crate Project successfully!");
                    // changeFgaFlowType("normal")
                    this.props.setUserExtend({
                      ...(this.props.userExtend || {}),
                      project: true
                    })
                  },
                });
              }}>
                Create Project
              </Button>
            ]}
          />
        )
      }
      if (type === "submitProjectInfo") {
        return (
          <FgaProResult
            cardId={dashcard.card.id}
            height={this.props.height}
            width={this.props.gridItemWidth}
            subTitle={<div className={"text-white"}><LockFilled />Submit project web3 info</div>}
            extra={[
              <Button key='xxx' onClick={() => {
                this.props.setCreateFgaProjectModalShowAction({ show: true, projectObject: this.props.projectObject, submitButtonText: `Submit ${getWeb3TypeText(dashcard.card.id)}` });
                // Modal.info({
                //   icon: null,
                //   width: 600,
                //   title: "Submit NFT/Token Info",
                //   content: (<div className="flex flex-col">
                //    <FgaFlowCreateProject />
                //   </div>),
                //   okText: "OK",
                //   onOk: () => {
                //     message.success("Submit successfully!");
                //     // changeFgaFlowType("normal")
                //     this.props.setUserExtend({
                //       ...(this.props.userExtend || {}),
                //       web3Data: true
                //     })
                //   },
                // });
              }}>
                Submit {getWeb3TypeText(dashcard.card.id)}
              </Button>
            ]}
          />
        )
      }
    }

    const renderCustomLayout = () => {
      const type = getFgaFlowType(this.props, series[0]?.card?.id)
      const cardName = get(series[0]?.card, 'originalCardName') || get(series[0]?.card, 'name')
      // const card = this.props?.dashcard?.card
      // const fgaFlowType = this.getFgaFlowType(this.props, card?.id)
      return (
        <div className="flex flex-col w-full h-full align-top text-white">
          <div className="text-left mt1 ml1" style={{fontWeight: "bold"}}>{cardName}</div>
          <div className="flex-1 flex justify-center items-center h-full overflow-hidden" >
            {renderFgaFlowTypeLayout(type)}
            {/*{renderFgaFlowTypeLayout(this.props.showNormalChartData && (series[0]?.card?.id === 50934 || series[0]?.card?.id === 50935) ? "normal": type)}*/}
          </div>
        </div>
      )
    }

    // end fga

    const notShowReplacementContent =
      isImageDisplay ||
      isVideoDisplay ||
      isEmbedDisplay ||
      isMultiEmbedDisplay ||
      isTableauDisplay ||
      isFilterDisplay;
    const includeRealtimeTable = isRealtimeChart(dashcard, realtimeList);
    const isRealtimeUser = user?.id === 20103;
    const showReadTimeMode = !isPublic && !isTextDisplay && !isImageDisplay && !isVideoDisplay &&!isMultiEmbedDisplay && !isEmbedDisplay && !isTableauDisplay && result && !result.error
      && includeRealtimeTable
      && isRealtimeUser;
    const isGrowth = isFgaPath();
    const isAB = isABPath() || isFGAVCPath();
    const showButtons = !isGrowth || !isAB;

    return (
      <DashCardRoot
        id={id}
        className={cx(
          "Card rounded flex flex-column hover-parent hover--visibility",
          cardDomKey,
        )}
        style={
          hideBackground
            ? { border: 0, background: "transparent", boxShadow: "none" }
            : null
        }
        isNightMode={isNightMode}
        isUsuallySlow={isSlow === "usually-slow"}
      >
        {showButtons && (<div
          className="html2canvas-filter"
          style={{
            textAlign: "right",
            position: "absolute",
            right: 4,
            bottom: 4,
            zIndex: 2,
          }}
        >
          {/*{showReadTimeMode && (
            <QueryRealtimeButton dashcard={this.props.dashcard} refreshCardData={this.props.refreshCardData}/>
          )}*/}
          {showStatusButton && (
            <QueryStatusButton
              dashcard={this.props.dashcard}
              refreshCardData={this.props.refreshCardData}
              data={get(get(dashcardData, dashcard.id), dashcard.card_id)}
              loading={this.state.loading}
              setLoading={(loading) => {
                this.setState({ loading })
              }}
              chartUpdatedAt={chartUpdatedAt}
              tableLastUpdateInfo={tableLastUpdateInfo}
              user={user}
            />
          )}
        </div>)}
        {showButtons && (<div
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
                  previewAction && previewAction(dashcard.card.id);
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
          {showChartRefresh && (
            <Tooltip key="ChartRefresh" tooltip={t`Chart Refresh`}>
              <div
                className="html2canvas-filter dash-card__button"
                onClick={async () => {
                  trackStructEvent(`dashcard click to chart refresh`);
                  if (this.state.loading) {
                    return ;
                  }
                  this.setState({ loading: true })
                  await this.props.refreshCardData({ dashcard, card: dashcard.card, clear: false })
                  this.setState({ loading: false })
                }}>
                <Icon
                  name="refresh"
                  size={14}
                  color={"#9AA0AF"}
                />
              </div>
            </Tooltip>
          )}
          {showDownload &&
            QueryDownloadWidget.shouldRender({
              result,
              isResultDirty: false,
            }) && (
              <QueryDownloadWidgetFP
                className="html2canvas-filter dash-card__button-always"
                card={dashcard.card}
                result={result}
                iconColor={"#9AA0AF"}
                buttonClassName="dash-card__download-button"
              />
            )}
          {showGetDataViaSqlApi &&
            QueryDownloadWidget.shouldRender({
              result,
              isResultDirty: false,
            }) && (
              <Tooltip key="GetDataViaSqlApi" tooltip={t`Get data via SQL API`}>
                <a
                  className="html2canvas-filter dash-card__button-always"
                  onClick={() => {
                    getDataViaSqlApiAction &&
                      getDataViaSqlApiAction({
                        cardId: dashcard.card.id,
                        dashcardId: dashcard.id,
                        dashboardId: dashboard.entityId || dashboard.id,
                      });
                    trackStructEvent(`dashcard click to sql api`);
                  }}
                >
                  <Icon name={"getChartViaSql"} size={16} color={"#9AA0AF"} />
                </a>
              </Tooltip>
            )}
          {showProduceFullData && (
            <Tooltip key="produceFullData" tooltip={t`Produce Full Data`}>
              <DatabaseOutlined
                onClick={() => {
                  Modal.confirm(
                    {
                      width: 500,
                      title: "Is the data correct?",
                      content: (
                        <div>
                          Should we proceed with generating the full dataset?
                          <div className="mt-4" />
                          <br />Once generated, the data cannot be undone. The completion time is t-1. If it finish an email will be sent to your account.
                          <div className="mt-4" />
                        </div>
                      ),
                      cancelText: "Re-Upload Data",
                      okText: "Produce Full Dataset",
                      onCancel: () => {
                        showIntegrationDialog()
                      },
                      onOk: () => {
                        message.success("Data is being generated. If it finish an email will be sent to your account")
                      }
                    }
                  )
                }}
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
        </div>)}
        {isCustom && (
          <div className="flex-full p1 text-centered text-brand flex flex-column layout-centered absolute w-full h-full" style={{background: "#282828", zIndex: 2}}>
            {renderCustomLayout()}
          </div>
        )}
        {isEditingDashboardLayout ? (
          <DashboardCardActionsPanel onMouseDown={this.preventDragging}>
            <DashCardActionButtons
              card={mainCard}
              series={series}
              isLoading={loading}
              isVirtualDashCard={isVirtualDashCard(dashcard)}
              hasError={!!errorMessage}
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
              dashboard={dashboard}
            />
          </DashboardCardActionsPanel>
        ) : null}
        <WrappedVisualization
          {...this.props}
          className={cx("flex-full overflow-hidden", {
            "pointer-events-none": isEditingDashboardLayout,
          })}
          style={{
            position: "relative",
            zIndex: 1,
            padding: wrappedVisualizationPadding,
          }}
          showNormalChartData={this.props.showNormalChartData}
          fgaFlowInteractionSuccess={() => {
            this.props.fgaFlowInteractionSuccess()
          }}
          classNameWidgets={isEmbed && "text-light text-medium-hover"}
          error={errorMessage}
          headerIcon={headerIcon}
          errorIcon={errorIcon}
          isSlow={isSlow}
          isDataApp={false}
          expectedDuration={expectedDuration}
          rawSeries={series}
          showTitle
          isFullscreen={isFullscreen}
          isNightMode={isNightMode}
          isDashboard
          dispatch={this.props.dispatch}
          dashboard={dashboard}
          dashcard={dashcard}
          parameterValues={parameterValues}
          parameterValuesBySlug={parameterValuesBySlug}
          isEditing={isEditing}
          isPreviewing={this.state.isPreviewingCard}
          isEditingParameter={isEditingParameter}
          isMobile={isMobile}
          gridSize={gridSize}
          totalNumGridCols={this.props.totalNumGridCols}
          actionButtons={
            isEmbed ? (
              <QueryDownloadWidgetFP
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
            notShowReplacementContent ? null : clickBehaviorSidebarDashcard !=
                null && isVirtualDashCard(dashcard) ? (
              <div className="flex full-height align-center justify-center">
                <h4 className="text-medium">
                  {dashcard.visualization_settings.virtual_card.display ===
                  "text"
                    ? t`Text card`
                    : t`Action button`}
                </h4>
              </div>
            ) : isEditingParameter && !isAction ? (
              <DashCardParameterMapper
                dashcard={dashcard}
                isMobile={isMobile}
              />
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
          onChangeCardAndRun={
            navigateToNewCardFromDashboard
              ? ({ nextCard, previousCard, objectId }) => {
                  // navigateToNewCardFromDashboard needs `dashcard` for applying active filters to the query
                  navigateToNewCardFromDashboard({
                    nextCard,
                    previousCard,
                    dashcard,
                    objectId,
                  });
                }
              : null
          }
          onChangeLocation={this.props.onChangeLocation}
          dynamicParams={dashboard && dashboard.dynamicParams}
          chartStyle={chartStyle}
          hideWatermark={hideWatermark}
        />
      </DashCardRoot>
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
  card,
  series,
  isLoading,
  isVirtualDashCard,
  hasError,
  onRemove,
  onAddSeries,
  onReplaceAllVisualizationSettings,
  showClickBehaviorSidebar,
  onPreviewToggle,
  isPreviewing,
  dashboard,
}) => {
  const buttons = [];

  if (getVisualizationRaw(series).visualization.supportPreviewing) {
    buttons.push(
      <ToggleCardPreviewButton
        key="toggle-card-preview-button"
        isPreviewing={isPreviewing}
        onPreviewToggle={onPreviewToggle}
      />,
    );
  }

  if (!isLoading && !hasError) {
    if (
      onReplaceAllVisualizationSettings &&
      !getVisualizationRaw(series).visualization.disableSettingsConfig
    ) {
      buttons.push(
        <ChartSettingsButton
          key="chart-settings-button"
          series={series}
          onReplaceAllVisualizationSettings={onReplaceAllVisualizationSettings}
          dashboard={dashboard}
        />,
      );
    }
    if (!isVirtualDashCard || isActionCard(card)) {
      buttons.push(
        <Tooltip key="click-behavior-tooltip" tooltip={t`Click behavior`}>
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
          key="add-series-button"
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

const ChartSettingsButton = ({
  series,
  onReplaceAllVisualizationSettings,
  dashboard,
}) => (
  <ModalWithTrigger
    wide
    tall
    triggerElement={
      <Tooltip tooltip={t`Visualization options`}>
        <Icon
          name="palette"
          size={HEADER_ICON_SIZE}
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
      dashboard={dashboard}
    />
  </ModalWithTrigger>
);

const RemoveButton = ({ onRemove }) => (
  <a
    className="text-dark-hover drag-disabled"
    data-metabase-event="Dashboard;Remove Card Modal"
    onClick={onRemove}
    style={HEADER_ACTION_STYLE}
  >
    <Icon name="close" size={HEADER_ICON_SIZE} />
  </a>
);

const AddSeriesButton = ({ series, onAddSeries }) => (
  <a
    data-testid="add-series-button"
    data-metabase-event="Dashboard;Edit Series Modal;open"
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
      data-metabase-event="Dashboard;Text;edit"
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

const mapStateToProps = state => ({
  projectObject: getFgaProject(state),
  realtimeList: getRealtimeList(state),
  userExtend: getUserExtend(state)
});

const mapDispatchToProps = {
  toggleSidebar,
  addTextDashCardToDashboard,
  setLoginModalShow: loginModalShowAction,
  setUserExtend: setUserExtend,
  setCreateFgaProjectModalShowAction: createFgaProjectModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashCard);
