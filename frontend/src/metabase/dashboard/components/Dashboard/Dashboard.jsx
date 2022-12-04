// TODO: merge with metabase/dashboard/containers/Dashboard.jsx
import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "underscore";

import { message } from "antd";
import { t } from "ttag";
import { throttle, get, has } from "lodash";
import DashboardHeader from "metabase/dashboard/containers/DashboardHeader";
import SyncedParametersList from "metabase/parameters/components/SyncedParametersList/SyncedParametersList";
import { getVisibleParameters } from "metabase/parameters/utils/ui";
import { ossPath } from "metabase/lib/ossPath";
import * as Urls from "metabase/lib/urls";
import ShareModal from "metabase/containers/home/components/ShareModal";
import DashboardCopyModal from "metabase/dashboard/components/DashboardCopyModal";
import RootOverviewControls from "metabase/dashboard/hoc/RootOverviewControls";
import Modal from "metabase/components/Modal";
import ConfirmContent from "metabase/components/ConfirmContent";
import TagsPanel from "metabase/query_builder/components/view/TagsPanel";
import MetaViewportControls from "metabase/dashboard/hoc/MetaViewportControls";
import { dashboardIdInfo } from "metabase/new-service";
import Meta from "metabase/components/Meta";
import CreateDashboardModal from "metabase/components/CreateDashboardModal";
import { getDescription } from "metabase/lib/formatting";
import { getOssUrl } from "metabase/lib/image";
import { getValuePopulatedParameters } from "metabase-lib/parameters/utils/parameter-values";
import DashboardGrid from "../DashboardGrid";
import { DashboardSidebars } from "../DashboardSidebars";
import DashboardControls from "../../hoc/DashboardControls";
import DashboardEmptyState from "./DashboardEmptyState/DashboardEmptyState";
import { createThumb } from "metabase/dashboard/components/utils/thumb";
import { zkspaceDate } from "metabase/lib/register-activity";
import {
  CardsContainer,
  DashboardBody,
  DashboardLoadingAndErrorWrapper,
  DashboardStyled,
  HeaderContainer,
  ParametersAndCardsContainer,
  ParametersWidgetContainer,
} from "./Dashboard.styled";
import MetabaseUtils from "metabase/lib/utils";

// const SCROLL_THROTTLE_INTERVAL = 1000 / 24;
const THROTTLE_PERIOD = 300;

// NOTE: move DashboardControls HoC to container

class Dashboard extends Component {
  state = {
    error: null,
    isParametersWidgetSticky: false,
    parametersListLength: 0,
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
    isNavbarOpen: PropTypes.bool.isRequired,
    isHeaderVisible: PropTypes.bool,
    isAdditionalInfoVisible: PropTypes.bool,

    dashboard: PropTypes.object,
    dashboardId: PropTypes.number,
    parameters: PropTypes.array,
    parameterValues: PropTypes.object,
    editingParameter: PropTypes.object,

    editingOnLoad: PropTypes.bool,
    addCardOnLoad: PropTypes.number,
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
    setParameterValue: PropTypes.func.isRequired,
    setEditingParameter: PropTypes.func.isRequired,
    setParameterIndex: PropTypes.func.isRequired,

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
    embedOptions: PropTypes.object,

    urlDashboardName: PropTypes.string,
    urlUserName: PropTypes.string,
    user: PropTypes.object,
    createDashboard: PropTypes.any,
    setSubmitAddrZkspaceModal: PropTypes.func,
    dashboardBeforeEditing: PropTypes.any,
    replace: PropTypes.func,
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

  static getDerivedStateFromProps({ parameters }, { parametersListLength }) {
    const visibleParameters = getVisibleParameters(parameters);
    return visibleParameters.length !== parametersListLength
      ? { parametersListLength: visibleParameters.length }
      : null;
  }

  //get cache option for admin to refresh cache of charts in dashboard
  getCacheOption() {
    const { user, location } = this.props;
    const isAdmin = user && user.is_superuser;
    const ignoreCache = get(location?.query, "ignore_cache");
    if (
      isAdmin &&
      has(location?.query, "ignore_cache") &&
      (!ignoreCache || ignoreCache === "true")
    ) {
      return { ignoreCache: true };
    }
    return null;
  }

  fetchDashboardCardData = () => {
    this.props.fetchDashboardCardData({
      reload: false,
      clear: true,
      ...this.getCacheOption(),
    });
  };

  fetchDashboardCardDataThrottle = throttle(
    this.fetchDashboardCardData,
    THROTTLE_PERIOD,
  );

/*  throttleParameterWidgetStickiness = _.throttle(
    () => updateParametersWidgetStickiness(this),
    SCROLL_THROTTLE_INTERVAL,
  );*/

  // NOTE: all of these lifecycle methods should be replaced with DashboardData HoC in container
  componentDidMount() {
    console.log("datashboard")
    const { dashboardId, urlDashboardName, urlUserName } = this.props;
    this.loadDashboard({
      dashboardId,
      urlDashboardName,
      urlUserName,
    });

    /*const main = getMainElement();
    main.addEventListener("scroll", this.throttleParameterWidgetStickiness, {
      passive: true,
    });
    main.addEventListener("resize", this.throttleParameterWidgetStickiness, {
      passive: true,
    });*/
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.dashboardId !== this.props.dashboardId ||
      prevProps.urlDashboardName !== this.props.urlDashboardName ||
      prevProps.urlUserName !== this.props.urlUserName
    ) {
      this.loadDashboard({
        dashboardId: this.props.dashboardId,
        urlDashboardName: this.props.urlDashboardName,
        urlUserName: this.props.urlUserName,
      });
    } else if (
      !_.isEqual(prevProps.parameterValues, this.props.parameterValues) ||
      !prevProps.dashboard
    ) {
      this.fetchDashboardCardDataThrottle();
    }
  }

  componentWillUnmount() {
    this.props.cancelFetchDashboardCardData();
    /*const main = getMainElement();
    main.removeEventListener("scroll", this.throttleParameterWidgetStickiness);
    main.removeEventListener("resize", this.throttleParameterWidgetStickiness);*/
  }

  async loadDashboard({ dashboardId, urlDashboardName, urlUserName }) {
    const {
      editingOnLoad,
      addCardOnLoad,
      addCardToDashboard,
      fetchDashboard,
      initialize,
      loadDashboardParams,
      location,
      setErrorPage,
      user,
    } = this.props;

    console.log("loadDashboard1", urlDashboardName, urlUserName)
    initialize();
    console.log("loadDashboard2")
    loadDashboardParams();
    console.log("loadDashboard3")

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
          if (!uuid) {
            throw new Error(
              "The dashboard has been set to private, please contact the owner.",
            );
          }
          dashboardId = uuid;
        }
      }

      await fetchDashboard(dashboardId, location.query);
      if (editingOnLoad) {
        this.setEditing(this.props.dashboard);
      }
      if (addCardOnLoad != null) {
        addCardToDashboard({ dashId: dashboardId, cardId: addCardOnLoad });
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

  saveAction = async props => {
    const { newDashboard } = props || {};
    const hide = message.loading("Saving...", 0);
    console.log("saveAction1")
    const {
      payload: { dashboard },
    } = await this.props.saveDashboardAndCards({ newDashboard });
    console.log("saveAction2")

    const { dashboardBeforeEditing, user, replace } = this.props;
    console.log("saveAction3")
    const { id, public_uuid } = dashboard;
    if (public_uuid) {
      createThumb({
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
    console.log("saveAction4")
    this.onDoneEditing();
    console.log("saveAction5")
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

  onDoneEditing = () => {
    this.setEditing(false);
  };

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

  onCancel = () => {
    // this.props.setSharing(false);
    this.setState({
      shareModalResource: {},
    });
  };

  onSharingClick = (params) => {
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

  onShowNewDashboardModal = () => {
    this.setState({
      newDashboardModal: true,
    });
  };

  onRefreshCache = async () => {
    message.info("Refresh cache now...", 2);
    await this.props.fetchDashboard(
      this.props.dashboard?.id,
      this.props.location.query,
      true,
    );
    this.props.fetchDashboardCardData({
      reload: true,
      clear: true,
      ignoreCache: true,
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
        showSeoTagEntityList={true}
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
      parameterValues,
      isNavbarOpen,
      editingParameter,
      setParameterValue,
      setParameterIndex,
      setEditingParameter,
      isHeaderVisible,
      embedOptions,
    } = this.props;

    const { error, isParametersWidgetSticky, shareModalResource } = this.state;

    const shouldRenderAsNightMode = isNightMode && isFullscreen;
    const dashboardHasCards = dashboard => dashboard.ordered_cards.length > 0;
    const visibleParameters = getVisibleParameters(parameters);

    const parametersWidget = (
      <SyncedParametersList
        parameters={getValuePopulatedParameters(parameters, parameterValues)}
        editingParameter={editingParameter}
        dashboard={dashboard}
        isFullscreen={isFullscreen}
        isNightMode={shouldRenderAsNightMode}
        isEditing={isEditing}
        setParameterValue={setParameterValue}
        setParameterIndex={setParameterIndex}
        setEditingParameter={setEditingParameter}
      />
    );

    const shouldRenderParametersWidgetInViewMode =
      !isEditing && !isFullscreen && visibleParameters.length > 0;

    const shouldRenderParametersWidgetInEditMode =
      isEditing && visibleParameters.length > 0;

    const cardsContainerShouldHaveMarginTop =
      !shouldRenderParametersWidgetInViewMode &&
      (!isEditing || isEditingParameter);

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
            {isHeaderVisible && (
              <HeaderContainer
                isFullscreen={isFullscreen}
                isNightMode={shouldRenderAsNightMode}
                isDataApp={false}
              >
                <DashboardHeader
                  {...this.props}
                  onEditingChange={this.setEditing}
                  setDashboardAttribute={this.setDashboardAttribute}
                  addParameter={addParameter}
                  parametersWidget={parametersWidget}
                  onSharingClick={this.onSharingClick}
                  onShowAddQuestionSidebar={this.onShowAddQuestionSidebar}
                  onHideAddQuestionSidebar={this.onHideAddQuestionSidebar}
                  onCopyClick={this.onCopyClick}
                  showNewDashboardModal={this.onShowNewDashboardModal}
                  saveAction={this.saveAction}
                  onRevert={this.onRevert}
                  onRefreshCache={this.onRefreshCache}
                />

                {shouldRenderParametersWidgetInEditMode && (
                  <ParametersWidgetContainer
                    data-testid="edit-dashboard-parameters-widget-container"
                    isEditing={isEditing}
                  >
                    {parametersWidget}
                  </ParametersWidgetContainer>
                )}
              </HeaderContainer>
            )}

            <DashboardBody isEditingOrSharing={isEditing || isSharing}>
              <ParametersAndCardsContainer
                data-testid="dashboard-parameters-and-cards"
                ref={element => (this.parametersAndCardsContainerRef = element)}
              >
                {shouldRenderParametersWidgetInViewMode && (
                  <ParametersWidgetContainer
                    data-testid="dashboard-parameters-widget-container"
                    ref={element => (this.parametersWidgetRef = element)}
                    isNavbarOpen={isNavbarOpen}
                    isSticky={isParametersWidgetSticky}
                    topNav={embedOptions?.top_nav}
                  >
                    {parametersWidget}
                  </ParametersWidgetContainer>
                )}

                <CardsContainer
                  addMarginTop={cardsContainerShouldHaveMarginTop}
                >
                  {dashboardHasCards(dashboard) ? (
                    <DashboardGrid
                      {...this.props}
                      isNightMode={shouldRenderAsNightMode}
                      onEditingChange={this.setEditing}
                    />
                  ) : (
                    <DashboardEmptyState
                      isDataApp={false}
                      isNightMode={shouldRenderAsNightMode}
                    />
                  )}
                </CardsContainer>
              </ParametersAndCardsContainer>

              <DashboardSidebars
                {...this.props}
                onCancel={this.onCancel}
                setDashboardAttribute={this.setDashboardAttribute}
              />
            </DashboardBody>
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

export default _.compose(
  RootOverviewControls,
  DashboardControls,
  MetaViewportControls,
)(Dashboard);
