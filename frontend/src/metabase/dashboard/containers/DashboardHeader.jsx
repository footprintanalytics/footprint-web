/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import PropTypes from "prop-types";
import { t } from "ttag";
import _ from "underscore";

import { message } from "antd";
import { debounce } from "lodash";
import { getIsNavbarOpen } from "metabase/redux/app";

import ActionButton from "metabase/components/ActionButton";
import Button from "metabase/core/components/Button";
import Tooltip from "metabase/components/Tooltip";
import EntityMenu from "metabase/components/EntityMenu";

import { getDashboardActions } from "metabase/dashboard/components/DashboardActions";
import { trackStructEvent } from "metabase/lib/analytics";
import { snapshot } from "metabase/dashboard/components/utils/snapshot";
import ParametersPopover from "metabase/dashboard/components/ParametersPopover";
import TippyPopover from "metabase/components/Popover/TippyPopover";
import { getIsShowDashboardInfoSidebar } from "metabase/dashboard/selectors";
import Favorite from "metabase/containers/explore/components/Favorite";
import { getUser } from "metabase/selectors/user";
import DashboardCardDisplayInfo from "metabase/components/DashboardCardDisplayInfo";
import Popover from "metabase/components/Popover";
import { deviceInfo } from "metabase-lib/lib/Device";
import { toggleSidebar } from "../actions";

import Header from "../components/DashboardHeader";
import { SIDEBAR_NAME } from "../constants";
import "./DashboardHeader.css";
import MetabaseUtils from "metabase/lib/utils";

const mapStateToProps = (state, props) => {
  const isDataApp = false;
  const isShowingDashboardInfoSidebar =
    !isDataApp && getIsShowDashboardInfoSidebar(state);
  return {
    // isBookmarked: getIsBookmarked(state, props),
    isNavBarOpen: getIsNavbarOpen(state),
    isShowingDashboardInfoSidebar,
    user: getUser(state),
  };
};

const mapDispatchToProps = {
  // createBookmark: ({ id }) =>
  //   Bookmark.actions.create({ id, type: "dashboard" }),
  // deleteBookmark: ({ id }) =>
  //   Bookmark.actions.delete({ id, type: "dashboard" }),
  onChangeLocation: push,
  toggleSidebar,
};

let lastRefreshTime = null;

class DashboardHeader extends Component {
  constructor(props) {
    super(props);

    this.addQuestionModal = React.createRef();
    // this.handleToggleBookmark = this.handleToggleBookmark.bind(this);
  }

  state = {
    modal: null,
    showMediaModal: false,
  };

  static propTypes = {
    dashboard: PropTypes.object.isRequired,
    isEditable: PropTypes.bool.isRequired,
    isEditing: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
      .isRequired,
    isFullscreen: PropTypes.bool.isRequired,
    isNavBarOpen: PropTypes.bool.isRequired,
    isNightMode: PropTypes.bool.isRequired,
    isAdditionalInfoVisible: PropTypes.bool,

    refreshPeriod: PropTypes.number,
    setRefreshElapsedHook: PropTypes.func.isRequired,

    addCardToDashboard: PropTypes.func.isRequired,
    addTextDashCardToDashboard: PropTypes.func.isRequired,
    addImageDashCardToDashboard: PropTypes.func.isRequired,
    addVideoDashCardToDashboard: PropTypes.func.isRequired,
    addActionDashCardToDashboard: PropTypes.func.isRequired,
    fetchDashboard: PropTypes.func.isRequired,
    saveDashboardAndCards: PropTypes.func.isRequired,
    setDashboardAttribute: PropTypes.func.isRequired,

    onEditingChange: PropTypes.func.isRequired,
    onRefreshPeriodChange: PropTypes.func.isRequired,
    onNightModeChange: PropTypes.func.isRequired,
    onFullscreenChange: PropTypes.func.isRequired,

    onSharingClick: PropTypes.func.isRequired,

    onChangeLocation: PropTypes.func.isRequired,

    toggleSidebar: PropTypes.func.isRequired,
    sidebar: PropTypes.string.isRequired,
    setSidebar: PropTypes.func.isRequired,
    closeSidebar: PropTypes.func.isRequired,

    user: PropTypes.func,
  };

  handleEdit(dashboard) {
    this.props.onEditingChange(dashboard);
  }

  // handleToggleBookmark() {
  //   const { createBookmark, deleteBookmark, isBookmarked } = this.props;
  //
  //   const toggleBookmark = isBookmarked ? deleteBookmark : createBookmark;
  //
  //   toggleBookmark(this.props.dashboardId);
  // }

  onAddTextBox() {
    this.props.addTextDashCardToDashboard({ dashId: this.props.dashboard.id });
  }

  onAddImageBox() {
    this.props.addImageDashCardToDashboard({ dashId: this.props.dashboard.id });
  }

  onAddVideoBox() {
    this.props.addVideoDashCardToDashboard({ dashId: this.props.dashboard.id });
  }

  onAddAction() {
    this.props.addActionDashCardToDashboard({
      dashId: this.props.dashboard.id,
    });
  }

  onDoneEditing() {
    this.props.onEditingChange(false);
  }

  onRevert() {
    this.props.onRevert();
  }

  async onSave() {
    // await this.props.saveDashboardAndCards(this.props.dashboard.id);
    // this.onDoneEditing();
    trackStructEvent(`click Save edit dashboard`);
    const { dashboard, showNewDashboardModal, saveAction } = this.props;
    const { ordered_cards } = dashboard;
    if (dashboard.id === "new") {
      if (!ordered_cards || ordered_cards.length === 0) {
        message.info(
          "Dashboard cannot be empty , please add a chart to save it !",
        );
        return;
      }
      showNewDashboardModal();
      return;
    }
    await saveAction();
  }

  async onCancel() {
    // this.onRevert();
    this.onDoneEditing();
  }

  getEditWarning(dashboard) {
    if (dashboard.embedding_params) {
      const currentSlugs = Object.keys(dashboard.embedding_params);
      // are all of the original embedding params keys in the current
      // embedding params keys?
      if (
        this.props.isEditing &&
        this.props.dashboardBeforeEditing &&
        Object.keys(this.props.dashboardBeforeEditing.embedding_params).some(
          slug => !currentSlugs.includes(slug),
        )
      ) {
        return t`You've updated embedded params and will need to update your embed code.`;
      }
    }
  }

  getEditingButtons() {
    return [
      <Button
        data-metabase-event="Dashboard;Cancel Edits"
        key="cancel"
        className="Button Button--small mr1"
        onClick={() => this.onCancel()}
      >
        {t`Cancel`}
      </Button>,
      <ActionButton
        key="save"
        actionFn={() => this.onSave()}
        className="Button Button--primary Button--small"
        normalText={t`Save`}
        activeText={t`Saving…`}
        failedText={t`Save failed`}
        successText={t`Saved`}
      />,
    ];
  }

  getHeaderButtons() {
    const {
      dashboard,
      parametersWidget,
      // isBookmarked,
      isEditing,
      isFullscreen,
      isEditable,
      location,
      // onFullscreenChange,
      // createBookmark,
      // deleteBookmark,
      sidebar,
      // setSidebar,
      toggleSidebar,
      // isShowingDashboardInfoSidebar,
      // closeSidebar,
      isEmpty,
      onRefreshCache,
      user,
      onSharingClick,
    } = this.props;

    const { showMediaModal } = this.state;

    const isDataAppPage = false;
    const isLoaded = !!dashboard;
    const canEdit = dashboard.can_write && isEditable && !!dashboard &&
      user && (user.is_superuser || user.id === dashboard?.creator_id);
    const isAdmin = user && user.is_superuser;

    const hasCards = isLoaded && dashboard.ordered_cards.length > 0;
    const hasDataCards =
      hasCards &&
      dashboard.ordered_cards.some(
        dashCard =>
          dashCard.card.display !== "text" &&
          dashCard.card.display !== "image" &&
          dashCard.card.display !== "video",
      );

    const showCopyButton = !isEditing;
    const buttons = [];
    const extraButtons = [];

    if (isFullscreen && parametersWidget) {
      buttons.push(parametersWidget);
    }

    if (isEditing) {
      const activeSidebarName = sidebar.name;
      const addQuestionButtonHint =
        activeSidebarName === SIDEBAR_NAME.addQuestion
          ? t`Close sidebar`
          : t`Add questions`;

      buttons.push(
        // <Tooltip tooltip={addQuestionButtonHint}>
          /*<DashboardHeaderButton
            icon="add"
            isActive={activeSidebarName === SIDEBAR_NAME.addQuestion}
            onClick={() => toggleSidebar(SIDEBAR_NAME.addQuestion)}
            data-metabase-event="Dashboard;Add Card Sidebar"
          />*/
          <Button
            onlyIcon
            className={`ml1 Question-header-btn-new ${
              activeSidebarName === SIDEBAR_NAME.addQuestion ? "Question-header-btn--primary-new" : ""
            }`}
            iconColor="#7A819B"
            icon="add"
            iconSize={16}
            onClick={e => {
              toggleSidebar(SIDEBAR_NAME.addQuestion);
              trackStructEvent("click Toggle Add Question Sidebar");
            }}
          >
            Add chart
          </Button>
        // </Tooltip>,
      );

      // Add text card button
      buttons.push(
        /*<Tooltip key="add-a-text-box" tooltip={t`Add a text box`}>
          <a
            data-metabase-event="Dashboard;Add Text Box"
            key="add-text"
            className="text-brand-hover cursor-pointer"
            onClick={() => this.onAddTextBox()}
          >
            <DashboardHeaderButton>
              <Icon name="string" size={18} />
            </DashboardHeaderButton>
          </a>
        </Tooltip>,*/
        <span>
          <Button
            onlyIcon
            className="ml1 Question-header-btn-new"
            iconColor="#7A819B"
            icon="string"
            iconSize={16}
            onClick={() => {
              this.setState({ showMediaModal: true });
              trackStructEvent("click Add Media Box");
            }}
          >
            Add a media box
          </Button>
          {showMediaModal && this.renderMediaPopover()}
        </span>,
      );

      const {
        isAddParameterPopoverOpen,
        showAddParameterPopover,
        hideAddParameterPopover,
        addParameter,
      } = this.props;

      // Parameters
      buttons.push(
        <span key="add-a-filter">
          <TippyPopover
            placement="bottom-start"
            onClose={hideAddParameterPopover}
            visible={isAddParameterPopoverOpen}
            content={
              <ParametersPopover
                onAddParameter={addParameter}
                onClose={hideAddParameterPopover}
              />
            }
          >
            <div>
              {/*<Tooltip tooltip={t`Add a filter`}>*/}
                {/*<DashboardHeaderButton
                  key="parameters"
                  onClick={showAddParameterPopover}
                >
                  <Icon name="filter" />
                </DashboardHeaderButton>*/}
                <Button
                  key="parameters"
                  onlyIcon
                  className="ml1 Question-header-btn-new"
                  iconColor="#7A819B"
                  icon="dashboard_filter"
                  iconSize={16}
                  onClick={e => {
                    showAddParameterPopover();
                    trackStructEvent("click Add Fillter");
                  }}
                >
                  Add a filter
                </Button>
              {/*</Tooltip>*/}
            </div>
          </TippyPopover>
        </span>,
      );

      /*extraButtons.push({
        title: t`Revision history`,
        icon: "history",
        link: `${location.pathname}/history`,
        event: "Dashboard;Revisions",
      });*/
    }

    if (!isFullscreen && !isEditing && canEdit) {
      buttons.push(
        <Tooltip key="edit-dashboard" tooltip={t`Edit dashboard`}>
          <Button
            key="edit"
            onlyIcon
            className={`Question-header-btn`}
            iconColor="#7A819B"
            icon="pencil"
            iconSize={16}
            onClick={() => {
              this.handleEdit(dashboard);
              trackStructEvent("click Edit dashboard");
            }}
          />
        </Tooltip>,
      );
    }

    if (!isFullscreen && !isEditing) {
      /*extraButtons.push({
        title: t`Enter fullscreen`,
        icon: "expand",
        action: e => onFullscreenChange(!isFullscreen, !e.altKey),
        event: `Dashboard;Fullscreen Mode;${!isFullscreen}`,
      });*/

      /*extraButtons.push({
        title: t`Duplicate`,
        icon: "clone",
        link: `${location.pathname}/copy`,
        event: "Dashboard;Copy",
      });*/

      if (canEdit) {
        extraButtons.push({
          title: t`Edit dashboard details`,
          icon: "edit",
          link: `${location.pathname}/details`,
          event: "Dashboard;EditDetails",
        });

        if (isAdmin) {
          extraButtons.push({
            title: t`Move`,
            icon: "move",
            link: `${location.pathname}/move`,
            event: "Dashboard;Move",
          });
        }

        extraButtons.push({
          title: t`Delete`,
          icon: "view_archive",
          link: `${location.pathname}/archive`,
          event: "Dashboard;Archive",
        });
      }
    }

    if (!isEditing && !isEmpty && canEdit) {
      buttons.push(
        <Tooltip
          key="refreshCache"
          tooltip={
            <div className="align-center" style={{ margin: "0 auto" }}>
              Refresh cache <br />
              (Once in a minute)
            </div>
          }
        >
          <Button
            onlyIcon
            className="Question-header-btn"
            iconColor="#7A819B"
            icon={"refresh"}
            iconSize={16}
            onClick={debounce(
              () => {
                trackStructEvent("dashboard-click-refresh-cache");
                if (
                  !lastRefreshTime ||
                  new Date().getTime() - lastRefreshTime > 60000
                ) {
                  onRefreshCache();
                  lastRefreshTime = new Date().getTime();
                } else {
                  message.info("Refresh cache once one minute...", 2);
                }
              },
              1000,
              {
                leading: true,
                trailing: false,
              },
            )}
          />
        </Tooltip>,
      );
    }

    if (!isEditing) {
      buttons.push(
        <Tooltip tooltip={t`Add to favorite list`}>
          <Favorite
            onlyIcon
            className="Question-header-btn-with-text"
            like={
              // -1
              dashboard && dashboard.statistics && dashboard.statistics.favorite
            }
            isLike={dashboard && dashboard.isFavorite}
            type={"dashboard"}
            id={dashboard && dashboard.id}
            uuid={dashboard && dashboard.public_uuid}
          />
        </Tooltip>,
      );
      /*buttons.push(
        <Tooltip key="duplicate-dashboard" tooltip={t`Duplicate dashboard`}>
          <Button
            key="duplicate"
            onlyIcon
            className="Question-header-btn-with-text"
            iconColor="#7A819B"
            icon="duplicate"
            iconSize={16}
            onClick={onCopyClick}
          >
            {dashboard &&
              dashboard.statistics &&
              `${dashboard.statistics.copy}`}
          </Button>
        </Tooltip>,
      );*/
    }
    if (showCopyButton && !deviceInfo().isMobile) {
      buttons.push(
        <Tooltip key="duplicate-dashboard" tooltip={t`Duplicate dashboard`}>
          <Button
            key="duplicate"
            onlyIcon
            className="Question-header-btn-with-text"
            iconColor="#7A819B"
            icon="duplicate"
            iconSize={16}
            onClick={() => {
              if (!user) {
                this.props.setLoginModalShow({
                  show: true,
                  from: `duplicate-dashboard`,
                });
                return;
              }
              this.props.router.push(location.pathname + `/copy`);
              trackStructEvent("click Duplicate dashboard");
            }}
          >
            {dashboard &&
            dashboard.statistics &&
            `${dashboard.statistics.copy}`}
          </Button>
        </Tooltip>,
      );
    }

    if (hasDataCards) {
      if (!isEditing) {
        buttons.push(
          <Tooltip key="download-dashboard" tooltip={t`Snapshot`}>
            <Button
              key="download"
              onlyIcon
              className={`Question-header-btn`}
              iconColor="#7A819B"
              icon="camera"
              iconSize={16}
              onClick={() => {
                console.log("this.props.dashboard", this.props.dashboard)
                trackStructEvent("click Download dashboard");
                if (user) {
                  const { id, public_uuid } = this.props.dashboard;
                  const uuid = MetabaseUtils.isUUID(id) ? id : public_uuid;
                  if (!uuid ) {
                    message.warning("Please open share first to use snapshot.");
                    return;
                  }
                  snapshot({
                    public_uuid: uuid,
                    isDashboard: true,
                    user,
                  });
                } else {
                  this.props.setLoginModalShow({
                    show: true,
                    from: `dashboard-snapshot`,
                  });
                }
              }}
            />
          </Tooltip>,
        );
      }
    }

    if (!isEditing && !isEmpty) {
      // const extraButtonClassNames =
      //   "bg-brand-hover text-white-hover py2 px3 text-bold block cursor-pointer";

      buttons.push(
        <Tooltip tooltip="Embed Widget">
          <Button
            onlyIcon
            className="Question-header-btn"
            iconColor="#7A819B"
            icon="embed"
            iconSize={16}
            onClick={() => onSharingClick({ onlyEmbed: true })}
          />
        </Tooltip>,
      );
    }
    buttons.push(...getDashboardActions(this, this.props));

    if (extraButtons.length > 0 && !isEditing) {
      buttons.push(
        ...[
        /* <DashboardHeaderActionDivider key="dashboard-button-divider" />,
         <DashboardBookmark
           key="dashboard-bookmark-button"
           dashboard={dashboard}
           onCreateBookmark={createBookmark}
           onDeleteBookmark={deleteBookmark}
           isBookmarked={isBookmarked}
         />,
         !isDataAppPage && (
           <Tooltip key="dashboard-info-button" tooltip={t`More info`}>
             <DashboardHeaderButton
               icon="info"
               isActive={isShowingDashboardInfoSidebar}
               onClick={() =>
                 isShowingDashboardInfoSidebar
                   ? closeSidebar()
                   : setSidebar({ name: SIDEBAR_NAME.info })
               }
             />
           </Tooltip>
         ),*/
          <EntityMenu
            key="dashboard-action-menu-button"
            items={extraButtons}
            triggerIcon="ellipsis"
            tooltip={t`More...`}
          />,
        ].filter(Boolean),
      );
    }

    return buttons;
  }

  renderMediaPopoverItem = (type, onclick) => {
    return (
      <div
        className="dashboard-header__media-popover-item cursor-pointer brand-hover"
        onClick={onclick}
      >
        {type}
      </div>
    );
  };

  renderMediaPopover = () => {
    const mediaData = [
      {
        type: "Text",
        onclick: () => {
          this.onAddTextBox();
        },
      },
      {
        type: "Image",
        onclick: () => {
          this.onAddImageBox();
        },
      },
      {
        type: "Video",
        onclick: () => {
          this.onAddVideoBox();
        },
      },
    ];
    return (
      <Popover
        onClose={() => this.setState({ showMediaModal: false })}
        verticalAttachments={["top", "bottom"]}
      >
        <li className="dashboard-header__media-popover">
          {mediaData.map(data => {
            return this.renderMediaPopoverItem(data.type, () => {
              data.onclick();
              this.setState({ showMediaModal: false });
              trackStructEvent(`click Add ${data.type} Box`);
            });
          })}
        </li>
      </Popover>
    );
  };

  render() {
    const {
      dashboard,
      isEditing,
      isFullscreen,
      isAdditionalInfoVisible,
      setDashboardAttribute,
      setSidebar,
    } = this.props;

    const isDataAppPage = false;
    const hasLastEditInfo = dashboard["last-edit-info"] != null;

    return (
      <Header
        headerClassName="wrapper"
        objectType="dashboard"
        analyticsContext="Dashboard"
        dashboard={dashboard}
        isEditing={isEditing}
        isBadgeVisible={!isEditing && !isFullscreen && isAdditionalInfoVisible}
        isLastEditInfoVisible={
          // !isDataAppPage && hasLastEditInfo && isAdditionalInfoVisible
          false
        }
        isEditingInfo={isEditing}
        isNavBarOpen={this.props.isNavBarOpen}
        headerButtons={this.getHeaderButtons()}
        editWarning={this.getEditWarning(dashboard)}
        editingTitle={t`You're editing this dashboard.`}
        editingButtons={this.getEditingButtons()}
        setDashboardAttribute={setDashboardAttribute}
        onLastEditInfoClick={() => setSidebar({ name: SIDEBAR_NAME.info })}
        onSave={() => this.onSave()}
        titleRightPanel={
          !this.props.isEditing ? (
            <DashboardCardDisplayInfo
              authorName={
                dashboard && dashboard.creator && dashboard.creator.name
              }
              date={
                dashboard && (dashboard.created_at || dashboard.createdAt)
              }
              read={
                dashboard && dashboard.statistics && dashboard.statistics.view
              }
            />
          ) : null
        }
      />
    );
  }
}

export default _.compose(
  // Bookmark.loadList(),
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardHeader);
