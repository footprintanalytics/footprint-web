/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { t } from "ttag";
import ActionButton from "metabase/components/ActionButton";
import Button from "metabase/components/Button";
import Header from "metabase/components/Header";
// import Icon from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";

import { getDashboardActions } from "./DashboardActions";
// import { DashboardHeaderButton } from "./DashboardHeader.styled";
import ParametersPopover from "./ParametersPopover";
import Popover from "metabase/components/Popover";
import { trackStructEvent } from "metabase/lib/analytics";
import PopoverWithTrigger from "metabase/components/PopoverWithTrigger";
import { connect } from "react-redux";
// import cx from "classnames";
import type { LocationDescriptor, QueryParams } from "metabase-types/types";
import type { CardId } from "metabase-types/types/Card";
import type {
  Parameter,
  ParameterId,
  ParameterOption,
} from "metabase-types/types/Parameter";
import type {
  DashboardId,
  DashboardWithCards,
  DashCardId,
} from "metabase-types/types/Dashboard";
import { Link } from "react-router";
import Favorite from "metabase/containers/explore/components/Favorite";
import DashboardCardDisplayInfo from "metabase/components/DashboardCardDisplayInfo";
import { message } from "antd";
import { snapshot } from "metabase/dashboard/components/utils/snapshot";
import {
  loginModalShowAction,
  setSubmitAddrZkspaceModal,
} from "metabase/redux/control";
import { debounce } from "lodash";
import { isDefi360 } from "metabase/lib/project_info";
import TaggingModal from "metabase/components/TaggingModal";
import "./DashboardHeader.css";
import HomePriorityModal from "metabase/components/HomePriorityModal";
import QuestionSavedModal from "metabase/components/QuestionSavedModal";
import Modal from "metabase/components/Modal";
import ShareModal from "metabase/containers/home/components/ShareModal";
import { deviceInfo } from "metabase-lib/lib/Device";

type Props = {
  location: LocationDescriptor,

  dashboard: DashboardWithCards,
  dashboardBeforeEditing: ?DashboardWithCards,

  isAdmin: boolean,
  isEditable: boolean,
  isEditing: boolean,
  isFullscreen: boolean,
  isNightMode: boolean,

  refreshPeriod: ?number,
  setRefreshElapsedHook: Function,

  parametersWidget: React.Element,

  addCardToDashboard: ({ dashId: DashCardId, cardId: CardId }) => void,
  addTextDashCardToDashboard: ({ dashId: DashCardId }) => void,
  addImageDashCardToDashboard: ({ dashId: DashCardId }) => void,
  addVideoDashCardToDashboard: ({ dashId: DashCardId }) => void,
  fetchDashboard: (dashboardId: DashboardId, queryParams: ?QueryParams) => void,
  saveDashboardAndCards: () => Promise<void>,
  setDashboardAttribute: (attribute: string, value: any) => void,

  addParameter: (option: ParameterOption) => Promise<Parameter>,
  setEditingParameter: (parameterId: ?ParameterId) => void,
  isAddParameterPopoverOpen: boolean,
  showAddParameterPopover: () => void,
  hideAddParameterPopover: () => void,

  onEditingChange: (isEditing: false | DashboardWithCards) => void,
  onRefreshPeriodChange: (?number) => void,
  onNightModeChange: boolean => void,
  onFullscreenChange: boolean => void,

  onChangeLocation: string => void,

  onSharingClick: void => void,
};

type State = {
  modal: null | "parameters",
};

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser,
  };
};

const mapDispatchToProps = {
  setSubmitAddrZkspaceModal,
  setLoginModalShow: loginModalShowAction,
};

@connect(mapStateToProps, mapDispatchToProps)
export default class DashboardHeader extends Component {
  constructor(props: Props) {
    super(props);

    this.addQuestionModal = React.createRef();

    this.props.onHideAddQuestionSidebar();
    if (!props.dashboard.ordered_cards.length) {
      this.handleEdit(props.dashboard);
    }
  }

  state: State = {
    modal: null,
    showSeoTaggingModal: false,
    showHomePriorityModal: false,
    showMediaModal: false,
    showQuestionSavedModal: false,
    showShareModal: false,
  };

  static propTypes = {
    dashboard: PropTypes.object.isRequired,
    isEditable: PropTypes.bool.isRequired,
    isEditing: PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
      .isRequired,
    isFullscreen: PropTypes.bool.isRequired,
    isNightMode: PropTypes.bool.isRequired,

    refreshPeriod: PropTypes.number,
    setRefreshElapsedHook: PropTypes.func.isRequired,

    addCardToDashboard: PropTypes.func.isRequired,
    addTextDashCardToDashboard: PropTypes.func.isRequired,
    addImageDashCardToDashboard: PropTypes.func.isRequired,
    addVideoDashCardToDashboard: PropTypes.func.isRequired,
    fetchDashboard: PropTypes.func.isRequired,
    saveDashboardAndCards: PropTypes.func.isRequired,
    setDashboardAttribute: PropTypes.func.isRequired,

    onEditingChange: PropTypes.func.isRequired,
    onRefreshPeriodChange: PropTypes.func.isRequired,
    onNightModeChange: PropTypes.func.isRequired,
    onFullscreenChange: PropTypes.func.isRequired,

    onSharingClick: PropTypes.func,
    onEmbeddingClick: PropTypes.func,

    onCopyClick: PropTypes.func,
  };

  // componentDidMount() {
  //   const { location } = this.props;
  //   if (location?.state) {
  //     this.setState({ showQuestionSavedModal: true });
  //   }
  // }

  canUserReplace = () => {
    const { location } = this.props;
    return location && location.pathname && location.pathname.startsWith("/@");
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user && this.canUserReplace()) {
      const { user, dashboard } = nextProps;
      if (
        (user &&
          dashboard &&
          dashboard.creator &&
          user.id === dashboard.creator.id) ||
        user.is_superuser
      ) {
        // window.location.reload();
      }
    }
  }

  handleEdit(dashboard: DashboardWithCards) {
    this.props.onEditingChange(dashboard);
  }

  onAddTextBox() {
    this.props.addTextDashCardToDashboard({ dashId: this.props.dashboard.id });
  }

  onAddImageBox() {
    this.props.addImageDashCardToDashboard({ dashId: this.props.dashboard.id });
  }

  onAddVideoBox() {
    this.props.addVideoDashCardToDashboard({ dashId: this.props.dashboard.id });
  }

  onDoneEditing() {
    this.props.onEditingChange(false);
  }

  onRevert() {
    this.props.onRevert();
  }

  async onSave() {
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
    this.onRevert();
  }

  // getTagData = async () => {
  //   const tagList = await getEntityTag({
  //     entityId: `${this.props.dashboard.id}`,
  //     entityTypeNsName: "dashboard",
  //   });
  //   this.setState({
  //     tagEntityList: tagList,
  //   });
  // };

  getEditWarning(dashboard: DashboardWithCards) {
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
        onClick={() => {
          this.onCancel();
          trackStructEvent("click Cancel edit dashboard");
        }}
      >
        {t`Cancel`}
      </Button>,
      <ActionButton
        key="save"
        actionFn={debounce(() => this.onSave(), 3000, {
          leading: true,
          trailing: false,
        })}
        className="Button Button--primary Button--small"
        normalText={t`Save`}
        activeText={t`Saving…`}
        failedText={t`Save failed`}
        successText={t`Saved`}
      />,
    ];
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

  getHeaderButtons() {
    const {
      dashboard,
      parametersWidget,
      isAdmin,
      isEditing,
      isFullscreen,
      isEditable,
      location,
      onToggleAddQuestionSidebar,
      onHideAddQuestionSidebar,
      showAddQuestionSidebar,
      user,
      // onCopyClick,
    } = this.props;
    const { showMediaModal } = this.state;
    const isLoaded = !!dashboard;
    const canEdit =
      isLoaded &&
      isEditable &&
      user &&
      (user.is_superuser || user.id === dashboard?.creator_id);

    const showCopyButton = !isEditing;
    // user && (user.isAnalyst || user.is_superuser) && !isEditing;

    const hasCards = isLoaded && dashboard.ordered_cards.length > 0;
    const hasDataCards =
      hasCards &&
      dashboard.ordered_cards.some(
        dashCard =>
          dashCard.card.display !== "text" &&
          dashCard.card.display !== "image" &&
          dashCard.card.display !== "video",
      );

    const buttons = [];
    const extraButtons = [];

    if (isFullscreen && parametersWidget) {
      buttons.push(parametersWidget);
    }

    if (isEditing) {
      const addQuestionButtonHint = showAddQuestionSidebar
        ? t`Close sidebar`
        : t`Add queries`;

      buttons.push(
        <Tooltip tooltip={addQuestionButtonHint}>
          {/* <DashboardHeaderButton
            isActive={showAddQuestionSidebar}
            onClick={onToggleAddQuestionSidebar}
            data-metabase-event="Dashboard;Add Card Sidebar"
          >
            <Icon name="add" size={24} />
          </DashboardHeaderButton> */}

          <Button
            onlyIcon
            className={`ml1 Question-header-btn-new ${
              showAddQuestionSidebar ? "Question-header-btn--primary-new" : ""
            }`}
            iconColor="#7A819B"
            icon="add"
            iconSize={16}
            onClick={e => {
              onToggleAddQuestionSidebar();
              trackStructEvent("click Toggle Add Question Sidebar");
            }}
          >
            Add chart
          </Button>
        </Tooltip>,
      );

      /*// Add text card button
      buttons.push(
        <Tooltip key="add-a-text-box" tooltip={t`Add a text box`}>
          <Button
            onlyIcon
            className="ml1 Question-header-btn-new"
            iconColor="#7A819B"
            icon="string"
            iconSize={16}
            onClick={() => {
              this.onAddTextBox();
              trackStructEvent("click Add Text Box");
            }}
          >
            Add a text box
          </Button>
        </Tooltip>,
      );*/
      buttons.push(
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
          <Tooltip tooltip={t`Add a filter`}>
            {/* <a
              key="parameters"
              className={cx("text-brand-hover", {
                "text-brand": isAddParameterPopoverOpen,
              })}
              onClick={showAddParameterPopover}
            >
              <DashboardHeaderButton>
                <Icon name="dashboard_filter" size={22} />
              </DashboardHeaderButton>
            </a> */}
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
          </Tooltip>

          {isAddParameterPopoverOpen && (
            <Popover onClose={hideAddParameterPopover}>
              <ParametersPopover
                onAddParameter={option => {
                  onHideAddQuestionSidebar();
                  addParameter(option);
                }}
                onClose={hideAddParameterPopover}
              />
            </Popover>
          )}
        </span>,
      );

      extraButtons.push(
        <Tooltip key="revision-history" tooltip={t`Revision history`}>
          <Link
            to={location.pathname + "/history"}
            data-metabase-event={"Dashboard;Revisions"}
          >
            {t`Revision history`}
          </Link>
        </Tooltip>,
      );
    }
    if (!isFullscreen && !isEditing && canEdit) {
      buttons.push(
        <Tooltip key="edit-dashboard" tooltip={t`Edit dashboard`}>
          <Button
            key="edit"
            onlyIcon
            className={`ml1 Question-header-btn ${
              this.state.showEdit ? "Question-header-btn--primary" : ""
            }`}
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
      const extraButtonClassNames =
        "bg-brand-hover text-white-hover py2 px3 text-bold block cursor-pointer";
      if (canEdit) {
        extraButtons.push(
          <Link
            className={extraButtonClassNames}
            to={location.pathname + "/details"}
            data-metabase-event={"Dashboard;EditDetails"}
          >
            {t`Edit dashboard details`}
          </Link>,
        );
      }
      if (isAdmin) {
        extraButtons.push(
          <Link
            className={extraButtonClassNames}
            to={
              location.pathname +
              `/history?id=${dashboard.id}&uniqueName=${dashboard.uniqueName}`
            }
            data-metabase-event={"Dashboard;EditDetails"}
          >
            {t`Revision history`}
          </Link>,
        );
      }
      if (canEdit && isAdmin) {
        extraButtons.push(
          <div
            className={extraButtonClassNames}
            onClick={() => {
              this.setState({
                showSeoTaggingModal: true,
              });
            }}
          >
            Seo tagging
          </div>,
        );
      }
      if (canEdit && isAdmin) {
        extraButtons.push(
          <div
            className={extraButtonClassNames}
            onClick={() => {
              this.setState({
                showHomePriorityModal: true,
              });
            }}
          >
            Home priority
          </div>,
        );
      }
      if (canEdit && isAdmin) {
        extraButtons.push(
          <Link
            className={extraButtonClassNames}
            to={
              location.pathname +
              `/move?id=${dashboard.id}&uniqueName=${dashboard.uniqueName}`
            }
            data-metabase-event={"Dashboard;Move"}
          >
            {t`Move`}
          </Link>,
        );
      }
      if (canEdit) {
        extraButtons.push(
          <Link
            className={extraButtonClassNames}
            to={
              location.pathname +
              `/archive?id=${dashboard.id}&uniqueName=${dashboard.uniqueName}`
            }
            data-metabase-event={"Dashboard;Archive"}
          >
            {t`Delete`}
          </Link>,
        );
      }
    }

    if (!isEditing && !isDefi360()) {
      buttons.push(
        <Tooltip tooltip={t`Add to favorite list`}>
          <Favorite
            onlyIcon
            className="ml1 Question-header-btn-with-text"
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
            className="ml1 Question-header-btn-with-text"
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
            className="ml1 Question-header-btn-with-text"
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
              className={`ml1 Question-header-btn ${
                this.state.showEdit ? "Question-header-btn--primary" : ""
              }`}
              iconColor="#7A819B"
              icon="camera"
              iconSize={16}
              onClick={() => {
                trackStructEvent("click Download dashboard");
                console.log("this.props.dashboard", this.props.dashboard);
                if (user) {
                  const { public_uuid } = this.props.dashboard;
                  if (!public_uuid) {
                    message.warning("Please open share first to use snapshot.");
                    return;
                  }
                  snapshot({
                    public_uuid: public_uuid,
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

    buttons.push(...getDashboardActions(this, this.props, canEdit));

    if (extraButtons.length > 0 && !isEditing) {
      buttons.push(
        <PopoverWithTrigger
          targetOffsetY={10}
          triggerElement={
            // <DashboardHeaderButton>
            //   <Icon name="ellipsis" size={24} className="text-brand-hover" />
            // </DashboardHeaderButton>
            <Button
              onlyIcon
              className="ml1 Question-header-btn"
              iconColor="#7A819B"
              icon="more"
              iconSize={16}
            />
          }
        >
          <div className="py1">
            {extraButtons.map((b, i) => (
              <div key={i}>{b}</div>
            ))}
          </div>
        </PopoverWithTrigger>,
      );
    }
    return [buttons];
  }

  render() {
    const { dashboard, router } = this.props;
    const {
      showSeoTaggingModal,
      showHomePriorityModal,
      showQuestionSavedModal,
      showShareModal,
    } = this.state;
    return (
      <div className="dashboard-header flex flex-column">
        <Header
          router={router}
          headerClassName="wrapper"
          objectType="dashboard"
          analyticsContext="Dashboard"
          item={dashboard}
          isEditing={this.props.isEditing}
          hasBadge={!this.props.isEditing && !this.props.isFullscreen}
          isEditingInfo={this.props.isEditing}
          headerButtons={this.getHeaderButtons()}
          editWarning={this.getEditWarning(dashboard)}
          editingTitle={t`You're editing this dashboard.`}
          editingButtons={this.getEditingButtons()}
          setItemAttributeFn={this.props.setDashboardAttribute}
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
        {showSeoTaggingModal && (
          <TaggingModal
            onClose={() => this.setState({ showSeoTaggingModal: false })}
            id={dashboard.id}
            creatorId={dashboard.creator_id}
            type="dashboard"
          />
        )}
        {showHomePriorityModal && (
          <HomePriorityModal
            onClose={() => this.setState({ showHomePriorityModal: false })}
            id={dashboard.id}
            type="dashboard"
          />
        )}
        {showQuestionSavedModal && (
          <Modal
            normal
            onClose={() => this.setState({ showQuestionSavedModal: false })}
          >
            <QuestionSavedModal
              saveType="dashboard"
              onClose={() => this.setState({ showQuestionSavedModal: false })}
              showShareModal={() => {
                this.setState({
                  showQuestionSavedModal: false,
                  showShareModal: true,
                });
              }}
            />
          </Modal>
        )}
        {showShareModal && (
          <ShareModal
            resource={{
              open: true,
              type: "dashboard",
              ...dashboard,
            }}
            onAfterChangePublicUuid={() => {}}
            onClose={() => this.setState({ showShareModal: false })}
          />
        )}
      </div>
    );
  }
}
