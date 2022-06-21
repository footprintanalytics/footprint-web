// TODO: merge with metabase/dashboard/containers/Dashboard.jsx
/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "underscore";
import { throttle, get } from "lodash";

import DashboardControls from "../../hoc/DashboardControls";
import { DashboardSidebars } from "../DashboardSidebars";
import DashboardHeader from "../DashboardHeader";
import {
  CardsContainer,
  DashboardBody,
  DashboardLoadingAndErrorWrapper,
  DashboardStyled,
  HeaderContainer,
  ParametersAndCardsContainer,
  ParametersWidgetContainer,
} from "./Dashboard.styled";
import DashboardGrid from "../DashboardGrid";
import ParametersWidget from "./ParametersWidget/ParametersWidget";
import DashboardEmptyState from "./DashboardEmptyState/DashboardEmptyState";
// import { updateParametersWidgetStickiness } from "./stickyParameters";
import ShareModal from "metabase/containers/home/components/ShareModal";
import DashboardCopyModal from "metabase/dashboard/components/DashboardCopyModal";
import RootOverviewControls from "metabase/dashboard/hoc/RootOverviewControls";
import { DashboardLazyLoadContainer } from "./DashboardLazyLoadContainer";
import Modal from "metabase/components/Modal";
import CreateDashboardModal from "metabase/components/CreateDashboardModal";
import { message } from "antd";
import { createThumb } from "metabase/dashboard/components/utils/thumb";
import { zkspaceDate } from "metabase/lib/register-activity";
import { t } from "ttag";
import ConfirmContent from "metabase/components/ConfirmContent";
import * as Urls from "metabase/lib/urls";
import TagsPanel from "metabase/query_builder/components/view/TagsPanel";
import MetaViewportControls from "metabase/dashboard/hoc/MetaViewportControls";
import { dashboardIdInfo } from "metabase/new-service";
import MetabaseUtils from "metabase/lib/utils";
import { isDefi360 } from "metabase/lib/project_info";
import DashboardAd from "metabase/containers/news/components/DashboardAd";
import { parseHashOptions } from "metabase/lib/browser";
import { navigateToGuestQuery } from "metabase/guest/utils";
import Meta from "metabase/components/Meta";
import { getDescription } from "metabase/lib/formatting";
import { getOssUrl } from "metabase/lib/image";
import { ossPath } from "metabase/lib/ossPath";

// const SCROLL_THROTTLE_INTERVAL = 1000 / 24;
const THROTTLE_PERIOD = 300;

// NOTE: move DashboardControls HoC to container
@RootOverviewControls
@DashboardControls
@MetaViewportControls
export default class Dashboard extends Component {
  state = {
    error: null,
    isParametersWidgetSticky: false,
    showAddQuestionSidebar: false,
    shareModalResource: {},
    showDashboardCopyModal: false,
    newDashboardModal: false,
    cancelModal: false,
    id: null,
  };

  static propTypes = {
    loadDashboardParams: PropTypes.func,
    location: PropTypes.object,

    isFullscreen: PropTypes.bool,
    isNightMode: PropTypes.bool,
    isSharing: PropTypes.bool,
    isEditable: PropTypes.bool,
    isEditing: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
      .isRequired,
    isEditingParameter: PropTypes.bool.isRequired,

    dashboard: PropTypes.object,
    dashboardId: PropTypes.number,
    parameters: PropTypes.array,
    parameterValues: PropTypes.object,

    addCardOnLoad: PropTypes.func,
    addCardToDashboard: PropTypes.func.isRequired,
    addParameter: PropTypes.func,
    archiveDashboard: PropTypes.func.isRequired,
    cancelFetchDashboardCardData: PropTypes.func.isRequired,
    fetchDashboard: PropTypes.func.isRequired,
    fetchDashboardCardData: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    onRefreshPeriodChange: PropTypes.func,
    saveDashboardAndCards: PropTypes.func.isRequired,
    setDashboardAttributes: PropTypes.func.isRequired,
    setEditingDashboard: PropTypes.func.isRequired,
    setErrorPage: PropTypes.func,
    setSharing: PropTypes.func.isRequired,

    onUpdateDashCardVisualizationSettings: PropTypes.func.isRequired,
    onUpdateDashCardColumnSettings: PropTypes.func.isRequired,
    onReplaceAllDashCardVisualizationSettings: PropTypes.func.isRequired,

    onChangeLocation: PropTypes.func.isRequired,
    onSharingClick: PropTypes.func,
    onEmbeddingClick: PropTypes.any,
    sidebar: PropTypes.shape({
      name: PropTypes.string,
      props: PropTypes.object,
    }).isRequired,
    closeSidebar: PropTypes.func.isRequired,
    openAddQuestionSidebar: PropTypes.func.isRequired,
    showAddQuestionSidebar: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    isEditable: true,
    isSharing: false,
  };

  constructor(props) {
    super(props);
    this.parametersWidgetRef = React.createRef();
    this.parametersAndCardsContainerRef = React.createRef();
  }

  fetchDashboardCardData = () => {
    this.props.fetchDashboardCardData({ reload: false, clear: true });
  };

  fetchDashboardCardDataThrottle = throttle(
    this.fetchDashboardCardData,
    THROTTLE_PERIOD,
  );

  // NOTE: all of these lifecycle methods should be replaced with DashboardData HoC in container
  componentDidMount() {
    const { dashboardId, urlDashboardName, urlUserName } = this.props;
    this.loadDashboard({
      dashboardId,
      urlDashboardName,
      urlUserName,
    });

    // const throttleParameterWidgetStickiness = _.throttle(
    //   () => updateParametersWidgetStickiness(this),
    //   SCROLL_THROTTLE_INTERVAL,
    // );

    // window.addEventListener("scroll", throttleParameterWidgetStickiness, {
    //   passive: true,
    // });
    // window.addEventListener("resize", throttleParameterWidgetStickiness, {
    //   passive: true,
    // });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.props.dashboardId !== nextProps.dashboardId ||
      this.props.urlDashboardName !== nextProps.urlDashboardName ||
      this.props.urlUserName !== nextProps.urlUserName
    ) {
      this.loadDashboard({
        dashboardId: nextProps.dashboardId,
        urlDashboardName: nextProps.urlDashboardName,
        urlUserName: nextProps.urlUserName,
      });
    } else if (
      !_.isEqual(this.props.parameterValues, nextProps.parameterValues) ||
      !this.props.dashboard
    ) {
      this.fetchDashboardCardDataThrottle();
    }
  }

  componentWillUnmount() {
    this.props.cancelFetchDashboardCardData();

    // window.removeEventListener("scroll", updateParametersWidgetStickiness);
    // window.removeEventListener("resize", updateParametersWidgetStickiness);
  }

  async loadDashboard({ dashboardId, urlDashboardName, urlUserName }) {
    const {
      addCardOnLoad,
      defaultEdit,
      addCardToDashboard,
      fetchDashboard,
      initialize,
      loadDashboardParams,
      location,
      setErrorPage,
      user,
    } = this.props;

    initialize();

    loadDashboardParams();
    try {
      if (urlDashboardName && urlUserName) {
        const { uuid, id, metabaseId } = await dashboardIdInfo({
          dashboardName: encodeURIComponent(urlDashboardName),
          userName: urlUserName,
        });
        this.setState({ id });
        if (user && (metabaseId === user.id || user.is_superuser)) {
          dashboardId = id;
        } else {
          dashboardId = uuid;
        }
      }
      await fetchDashboard(dashboardId, location.query);
      if (addCardOnLoad != null) {
        // if we destructure this.props.dashboard, for some reason
        // if will render dashboards as empty
        this.setEditing(this.props.dashboard);
        addCardToDashboard({ dashId: dashboardId, cardId: addCardOnLoad });
      } else if (defaultEdit) {
        this.setEditing(this.props.dashboard);
      }
    } catch (error) {
      if (error.status === 404) {
        setErrorPage({ ...error, context: "dashboard" });
      } else {
        console.error(error);
        this.setState({ error });
      }
    }
  }

  setEditing = isEditing => {
    this.props.onRefreshPeriodChange(null);
    this.props.setEditingDashboard(isEditing);
  };

  setDashboardAttribute = (attribute, value) => {
    this.props.setDashboardAttributes({
      id: this.props.dashboard.id,
      attributes: { [attribute]: value },
    });
  };

  onToggleAddQuestionSidebar = () => {
    if (this.props.showAddQuestionSidebar) {
      this.props.closeSidebar();
    } else {
      this.props.openAddQuestionSidebar();
    }
  };

  onShowAddQuestionSidebar = () => {
    this.setState({ showAddQuestionSidebar: true });
  };

  onHideAddQuestionSidebar = () => {
    this.setState({ showAddQuestionSidebar: false });
  };

  onCancel = () => {
    // this.props.setSharing(false);
    this.setState({
      shareModalResource: {},
    });
  };

  onSharingClick = params => {
    // this.props.setSharing(true);
    const { dashboard } = this.props;
    this.setState({
      shareModalResource: {
        open: true,
        public_uuid: MetabaseUtils.isUUID(dashboard.id)
          ? dashboard.id
          : dashboard.public_uuid,
        type: "dashboard",
        name: dashboard.name,
        id: dashboard.id,
        creatorId: dashboard.creator_id,
        creator: dashboard.creator,
        uniqueName: dashboard.uniqueName,
        onlyEmbed: params?.onlyEmbed,
      },
    });
  };

  onEmbeddingClick = () => {};

  onCopyClick = () => {
    this.setState({
      showDashboardCopyModal: true,
    });
  };

  onAfterChangePublicUuid = ({ newUuid }) => {
    this.props.dashboard.public_uuid = newUuid;
  };

  renderNewDashboardModal = () => {
    const { newDashboardModal } = this.state;
    return (
      newDashboardModal && (
        <Modal
          className="w-auto"
          ModalClass="z-index-top"
          onClose={() => this.setState({ newDashboardModal: false })}
        >
          <div style={{ width: "50vw", maxWidth: 600 }}>
            <CreateDashboardModal
              createDashboard={this.props.createDashboard}
              onSavedOtherAction={dashboard => {
                this.saveAction({ newDashboard: dashboard });
              }}
              onClose={() => this.setState({ newDashboardModal: false })}
            />
          </div>
        </Modal>
      )
    );
  };

  onDoneEditing = () => {
    this.setEditing(false);
  };

  saveAction = async props => {
    const { newDashboard } = props || {};
    const hide = message.loading("Saving...", 0);
    const {
      payload: { dashboard },
    } = await this.props.saveDashboardAndCards({ newDashboard });
    const { dashboardBeforeEditing, user, replace } = this.props;
    const { id, public_uuid } = dashboard;
    if (public_uuid) {
      await createThumb({
        elementId: "#html2canvas-Dashboard",
        fileName: `dashboard/${id}.png`,
        type: "dashboard",
        publicUuid: public_uuid,
        captureElementHeight: "630px",
        cssAdjustments: [
          {
            selector: ".Dashboard",
            css: "width: 1200px",
          },
        ],
      });
    }
    this.onDoneEditing();

    hide();

    if (
      zkspaceDate() &&
      (!dashboardBeforeEditing ||
        (dashboardBeforeEditing &&
          dashboardBeforeEditing.ordered_cards.length === 0)) &&
      dashboard.ordered_cards.length > 0
    ) {
      this.props.setSubmitAddrZkspaceModal({
        submitAddrZkspaceModal: true,
        email: user && user.email,
      });
    }

    if (location.pathname.endsWith("/new")) {
      replace({
        pathname: Urls.dashboard({ ...dashboard, type: "dashboard" }),
        state: { new: true },
      });
    }
  };

  onShowNewDashboardModal = () => {
    this.setState({
      newDashboardModal: true,
    });
  };

  onRevert = () => {
    this.setState({
      cancelModal: true,
    });
  };

  handleRevertAction = () => {
    const { dashboard, onChangeLocation } = this.props;
    if (dashboard.id === "new") {
      onChangeLocation("/");
      return;
    }
    this.props.fetchDashboard(
      this.props.dashboard.id,
      this.props.location.query,
      true,
    );
  };

  renderCancelModal = () => {
    const isOpen = this.state.cancelModal;
    return (
      <Modal isOpen={isOpen}>
        {isOpen && (
          <ConfirmContent
            title={t`You have unsaved changes`}
            message={t`Do you want to leave this page and discard your changes?`}
            onClose={() => {
              this.setState({ cancelModal: false });
            }}
            onAction={() => {
              this.setState({ cancelModal: false });
              this.handleRevertAction();
              this.setEditing(false);
            }}
          />
        )}
      </Modal>
    );
  };

  tagPanel = () => {
    const { dashboard, isEditable, user } = this.props;
    const isLoaded = !!dashboard;
    const canEdit =
      isLoaded &&
      isEditable &&
      user &&
      (user.is_superuser || user.isMarket || user.id === dashboard?.creator_id);
    return (
      <TagsPanel
        tagEntityId={this.props.dashboard.entityId || this.props.dashboard.id}
        isEditPermission={!this.props.isEditing && canEdit}
        type="dashboard"
      />
    );
  };

  render() {
    const {
      addParameter,
      dashboard,
      isEditing,
      isEditingParameter,
      isFullscreen,
      isNightMode,
      isSharing,
      parameters,
      showAddQuestionSidebar,
    } = this.props;
    const { error, shareModalResource, isParametersWidgetSticky } = this.state;

    const shouldRenderAsNightMode = isNightMode && isFullscreen;
    const dashboardHasCards = dashboard => dashboard.ordered_cards.length > 0;

    const parametersWidget = (
      <ParametersWidget
        shouldRenderAsNightMode={shouldRenderAsNightMode}
        {...this.props}
      />
    );

    const shouldRenderParametersWidgetInViewMode =
      !isEditing && !isFullscreen && parameters.length > 0;

    const shouldRenderParametersWidgetInEditMode =
      isEditing && parameters.length > 0;

    const cardsContainerShouldHaveMarginTop =
      !shouldRenderParametersWidgetInViewMode &&
      (!isEditing || isEditingParameter);

    const { chart_style } = {
      ...parseHashOptions(location.hash),
    };

    return (
      <>
        {dashboard && (
          <Meta
            description={getDescription({
              description: dashboard.description,
              orderedCards: dashboard.ordered_cards,
            })}
            image={getOssUrl(
              ossPath(`dashboard/${dashboard.entityId || dashboard.id}.png`),
              { resize: true },
            )}
          />
        )}
        <DashboardLoadingAndErrorWrapper
          isFullHeight={isEditing || isSharing}
          isFullscreen={isFullscreen}
          isNightMode={shouldRenderAsNightMode}
          loading={!dashboard}
          error={error}
        >
          {() => (
            <DashboardStyled>
              <HeaderContainer
                isFullscreen={isFullscreen}
                isNightMode={shouldRenderAsNightMode}
              >
                <DashboardHeader
                  {...this.props}
                  onEditingChange={this.setEditing}
                  setDashboardAttribute={this.setDashboardAttribute}
                  addParameter={addParameter}
                  parametersWidget={parametersWidget}
                  onSharingClick={this.onSharingClick}
                  onToggleAddQuestionSidebar={this.onToggleAddQuestionSidebar}
                  onShowAddQuestionSidebar={this.onShowAddQuestionSidebar}
                  onHideAddQuestionSidebar={this.onHideAddQuestionSidebar}
                  showAddQuestionSidebar={showAddQuestionSidebar}
                  onCopyClick={this.onCopyClick}
                  showNewDashboardModal={this.onShowNewDashboardModal}
                  saveAction={this.saveAction}
                  onRevert={this.onRevert}
                />
              </HeaderContainer>
              <div className="flex">
                <DashboardLazyLoadContainer className="flex-full flex flex-column flex-basis-none">
                  <DashboardBody isEditingOrSharing={isEditing || isSharing}>
                    <ParametersAndCardsContainer
                      data-testid="dashboard-parameters-and-cards"
                      innerRef={element =>
                        (this.parametersAndCardsContainerRef = element)
                      }
                    >
                      <div className="TagWidgetContainer bg-white pl2 pr2 hove">
                        <div style={{ display: isEditing ? "none" : "flex" }}>
                          {this.tagPanel()}
                        </div>
                        {shouldRenderParametersWidgetInViewMode && (
                          <ParametersWidgetContainer
                            innerRef={element =>
                              (this.parametersWidgetRef = element)
                            }
                            isSticky={isParametersWidgetSticky}
                          >
                            {parametersWidget}
                          </ParametersWidgetContainer>
                        )}
                      </div>

                      <CardsContainer
                        className="CardsContainer"
                        addMarginTop={cardsContainerShouldHaveMarginTop}
                      >
                        {shouldRenderParametersWidgetInEditMode && (
                          <ParametersWidgetContainer isEditing={isEditing}>
                            {parametersWidget}
                          </ParametersWidgetContainer>
                        )}
                        {dashboardHasCards(dashboard) ? (
                          <DashboardGrid
                            {...this.props}
                            onEditingChange={this.setEditing}
                            hideWatermark={dashboard && dashboard.hideWatermark}
                            navigateToNewCardFromDashboard={dashboard => {
                              const user = this.props.user;
                              const dashcard = dashboard && dashboard.dashcard;
                              const isAdmin = user && user.is_superuser;
                              const isOwner =
                                user && user.id === get(dashcard, "creator.id");
                              if (isAdmin || isOwner) {
                                this.props.navigateToNewCardFromDashboard(
                                  dashboard,
                                );
                              } else {
                                navigateToGuestQuery(dashboard, this.props);
                              }
                            }}
                            chartStyle={chart_style}
                          />
                        ) : (
                          <DashboardEmptyState
                            isEditing={isEditing}
                            onToggleAddQuestionSidebar={
                              this.onToggleAddQuestionSidebar
                            }
                            isNightMode={shouldRenderAsNightMode}
                            {...this.props}
                          />
                        )}
                      </CardsContainer>
                    </ParametersAndCardsContainer>
                  </DashboardBody>
                  {!isEditing && !isDefi360() && (
                    <div style={{ padding: "0 18px" }}>
                      <DashboardAd
                        dashboardId={this.state.id || this.props.dashboardId}
                      />
                    </div>
                  )}
                </DashboardLazyLoadContainer>
                <DashboardSidebars
                  {...this.props}
                  onCancel={this.onCancel}
                  showAddQuestionSidebar={showAddQuestionSidebar}
                />
              </div>
            </DashboardStyled>
          )}
          <ShareModal
            resource={shareModalResource}
            onAfterChangePublicUuid={this.onAfterChangePublicUuid}
            onClose={() => this.setState({ shareModalResource: {} })}
          />
          <DashboardCopyModal
            isOpen={this.state.showDashboardCopyModal}
            onClose={() => this.setState({ showDashboardCopyModal: null })}
            dashboardId={this.props.dashboardId}
            fromRoute={false}
          />
          {this.renderNewDashboardModal()}
          {this.renderCancelModal()}
        </DashboardLoadingAndErrorWrapper>
      </>
    );
  }
}
