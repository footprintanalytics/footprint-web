/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-component-props */
import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import cx from "classnames";
import "./FpNavbar.css";
import PropTypes from "prop-types";
import { Drawer, message } from "antd";
import { getChannel } from "metabase/selectors/app";
import { logout } from "metabase/auth/actions";
import {
  getCancelFeedback,
  getCreateModalShow,
  getIsUserFeedbackBlock,
  getLoginModalRedirect,
  getLoginModalShow,
  getSubmitAddrZkspaceModal,
} from "metabase/selectors/control";
import {
  cancelFeedbackAction,
  createModalShowAction,
  loginModalShowAction,
  setIsCancelFeedbackBlockAction,
  setSubmitAddrZkspaceModal,
} from "metabase/redux/control";
import SearchBar from "metabase/nav/components/SearchBar";
import ProfileLink from "metabase/nav/components/ProfileLink";
import Link from "metabase/core/components/Link";
import LoginModal from "metabase/auth/containers/LoginModal";
import { zkspaceDate } from "metabase/lib/register-activity";
import { getOssUrl } from "metabase/lib/image";
import { trackStructEvent } from "metabase/lib/analytics";
import Modal from "metabase/components/Modal";
import { isDefi360 } from "metabase/lib/project_info";
import CreateActionModal from "metabase/components/CreateActionModal";
import { color } from "metabase/lib/colors";
import Icon from "metabase/components/Icon";
import UserCancelFeedbackModal from "metabase/components/UserCancelFeedbackModal";
import LogoIcon from "metabase/components/LogoIcon";
import ActivityZkspaceSubmitModal from "metabase/components/ActivityZkspaceSubmitModal";
import EntityMenu from "metabase/components/EntityMenu";
import UserAvatar from "metabase/components/UserAvatar";
import VipIcon from "metabase/components/VipIcon";
import { getContext, getPath, getUser } from "../selectors";

const mapStateToProps = (state, props) => ({
  path: getPath(state, props),
  context: getContext(state, props),
  user: getUser(state),
  loginModalShow: getLoginModalShow(state, props),
  loginModalRedirect: getLoginModalRedirect(state, props),
  createModalShow: getCreateModalShow(state, props),
  cancelFeedback: getCancelFeedback(state, props),
  getIsUserFeedbackBlock: getIsUserFeedbackBlock(state, props),
  getSubmitAddrZkspaceModal: getSubmitAddrZkspaceModal(state, props),
  channel: getChannel(state) || "homepage",
});

const mapDispatchToProps = {
  onChangeLocation: push,
  setLoginModalShow: loginModalShowAction,
  setCreateModalShow: createModalShowAction,
  cancelFeedbackAction,
  setIsCancelFeedbackBlockAction,
  setSubmitAddrZkspaceModal,
  logout,
};

const leftMenuData = [
  {
    title: "Analytics",
    icon: "menu_home",
    path: "/dashboards",
    auth: false,
  },
  {
    name: "Data API",
    icon: "protocols",
    menu: [
      {
        title: "Data API",
        desc: "Unified API for Web3 developers",
        link: "/data-api",
      },
      {
        title: "BingoNFT",
        desc: "A window into NFTs powered by Footprint Data API",
        link: "https://nft.footprint.network/",
        externalLink: true,
      },
      {
        title: "Footrace",
        desc: "A realtime alert platform powered by Footprint Data API",
        link: "https://footrace.io/",
        externalLink: true,
      },
    ],
  },
];

const rightMenuData = [
  // { url: "/moon-men", name: "Moon Men" },
  {
    name: "Learn",
    icon: "protocols",
    menu: [
      {
        title: "Blog",
        desc: "Analyze the trends of each domain in the Web3 industry",
        link: "/news/articles",
      },
      {
        title: "Academy",
        desc: "The premier Web3 education platform with industry leading courses",
        link: "/news/academy",
      },
      {
        title: "Data Overview",
        desc: "Check the data coverage of most comprehensive data provider",
        link: "/@Footprint/Footprint-Data-Overview",
      },
      {
        title: "Data Dictionary",
        desc: "Quick access to each data table definitions and metadata",
        link: "/@Footprint/Footprint-Datasets-Data-Dictionary",
      },
      {
        title: "YouTube",
        desc: "Unravel Web3 and learn how to do analysis and build dapps via Videos",
        link: "https://www.youtube.com/@FootprintAnalytics",
        externalLink: true,
      },
      {
        title: "GitHub",
        desc: "Open source community welcomes you to join and become a contributor",
        link: "https://github.com/footprintanalytics",
        externalLink: true,
      },
    ],
  },
  {
    url: "https://docs.footprint.network/docs",
    name: "Docs",
    open: true,
  },
  {
    url: "/pricing",
    name: "Pricing",
  },
];

const AdminNavItem = ({ name, path, currentPath }) => (
  <li>
    <Link
      to={path}
      data-metabase-event={`NavBar;${name}`}
      className={cx("NavItem py1 px2 no-decoration", {
        "is--selected": currentPath.startsWith(path),
      })}
    >
      {name}
    </Link>
  </li>
);

// @Database.loadList({
//   // set this to false to prevent a potential spinner on the main nav
//   loadingAndErrorWrapper: false,
// })
class FpNavbar extends Component {
  static propTypes = {
    context: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    channel: PropTypes.string.isRequired,
    user: PropTypes.object,
  };

  state = {
    sideNavModal: false,
    showZkspaceModal: true,
  };

  isActive(path) {
    return this.props.path === path;
  }

  renderModal() {
    const {
      createModalShow,
      setCreateModalShow,
      // onChangeLocation,
    } = this.props;

    return (
      createModalShow && (
        <Modal
          className="w-auto"
          ModalClass="z-index-top"
          onClose={() => setCreateModalShow({ show: false })}
        >
          <CreateActionModal
            showNewDashboard={() => {
              const newDashboardUrl = `${
                isDefi360() ? "/defi360" : ""
              }/dashboard/new`;
              window.open(newDashboardUrl);
            }}
            onClose={() => setCreateModalShow({ show: false })}
            onCloseSideBar={this.props.onClose}
          />
        </Modal>
      )
    );
  }

  renderEmptyNav() {
    return (
      // NOTE: DO NOT REMOVE `Nav` CLASS FOR NOW, USED BY MODALS, FULLSCREEN DASHBOARD, ETC
      // TODO: hide nav using state in redux instead?
      <nav className="Nav sm-py1 relative">
        <ul className="wrapper flex align-center">
          <li>
            <Link
              to="/"
              data-metabase-event={"Navbar;Logo"}
              className="NavItem cursor-pointer flex align-center"
              onClick={e => {
                e.preventDefault();
                this.goLink(e, "/");
              }}
            >
              <LogoIcon className="text-brand my2" />
            </Link>
          </li>
        </ul>
        {this.renderLoginModal()}
      </nav>
    );
  }
  needCancelFeedbackBlock = ({ afterSuccess }) => {
    if (this.props.getIsUserFeedbackBlock) {
      const { isBlock, scene } = this.props.getIsUserFeedbackBlock();
      if (isBlock) {
        this.props.cancelFeedbackAction({
          show: true,
          afterSuccess,
          type: "edit",
          scene,
          isLimit: true,
        });
        return true;
      }
    }
    return false;
  };
  renderSideNav() {
    const { user, setLoginModalShow } = this.props;
    return (
      <Drawer
        placement="left"
        onClose={() => this.setState({ sideNavModal: false })}
        open={this.state.sideNavModal}
      >
        <div className="Nav__side-menu">
          {leftMenuData.map((item, index) => {
            if (item.menu) {
              return (
                <div key={index}>
                  {this.renderNavEntityMenu({
                    item,
                    className: `Nav__menu-item text-brand-hover`,
                    fromDrawer: true,
                  })}
                </div>
              );
            }
            return (
              <div
                className="Nav__menu-item text-brand-hover"
                key={index}
                onClick={e => {
                  trackStructEvent(`navbar-click-${item.title}`);
                  if (item.comingSoon) {
                    message.info("Coming soon...");
                    return;
                  }
                  if (item.auth && !user) {
                    setLoginModalShow({ show: true, from: item.title });
                    this.setState({ sideNavModal: false });
                  } else {
                    this.goLink(e, item.path, item.open);
                  }
                }}
              >
                {/*<Icon name={item.icon} size={16} />*/}
                <span>{item.title}</span>
                {this.isActive(item.path) && (
                  <div className="Nav__menu-item--select" />
                )}
              </div>
            );
          })}
        </div>
        {this.renderLink({
          className: "Nav__side-menu links",
          fromDrawer: true,
        })}
      </Drawer>
    );
  }

  renderLoginModal() {
    const { location, loginModalShow, loginModalRedirect, setLoginModalShow } =
      this.props;

    return (
      <LoginModal
        isOpen={loginModalShow}
        onClose={() => setLoginModalShow({ show: false })}
        from={location.query.from}
        channel={location.query.channel || location.query.cnl}
        location={this.props.location}
        fromNav={true}
        redirect={loginModalRedirect}
      />
    );
  }

  renderSubmitAddrZkspaceModal() {
    const { setSubmitAddrZkspaceModal, getSubmitAddrZkspaceModal } = this.props;
    return (
      getSubmitAddrZkspaceModal && (
        <ActivityZkspaceSubmitModal
          onClose={() =>
            setSubmitAddrZkspaceModal({ submitAddrZkspaceModal: false })
          }
          onClick={() => {
            setSubmitAddrZkspaceModal({ submitAddrZkspaceModal: false });
          }}
        />
      )
    );
  }

  renderCancelFeedbackModal() {
    const { cancelFeedbackAction, cancelFeedback } = this.props;
    return (
      <UserCancelFeedbackModal
        visible={cancelFeedback.show}
        cancelFeedback={cancelFeedback}
        onClose={() => cancelFeedbackAction({ show: false })}
        onSubmit={() => {}}
      />
    );
  }

  goLink = (e, url, open = false) => {
    e.preventDefault();
    this.setState({ sideNavModal: false });
    const afterSuccess = () => {
      if (open) {
        window.open(url);
      } else {
        this.props.onChangeLocation(url);
      }
    };
    const block = this.needCancelFeedbackBlock({ afterSuccess });
    if (block) {
      return;
    }
    afterSuccess();
  };

  renderLink({ className = "", fromDrawer = false }) {
    const { user, setLoginModalShow, location } = this.props;

    return (
      <nav
        role="navigation"
        itemScope
        itemType="http://www.schema.org/SiteNavigationElement"
        className={`${className} Nav__right-menus`}
      >
        {rightMenuData.map((item, index) => {
          if (item.menu) {
            return (
              <div key={index}>
                {this.renderNavEntityMenu({
                  item,
                  className: `Nav__right-menu footprint-primary-text`,
                  fromDrawer,
                })}
              </div>
            );
          }
          return (
            <Link
              key={index}
              itemProp="url"
              to={item.url}
              onClick={e => {
                e.preventDefault();
                if (item.auth && !user) {
                  setLoginModalShow({ show: true, from: item.title });
                  this.setState({ sideNavModal: false });
                } else {
                  this.goLink(e, item.url, item.open);
                }

                trackStructEvent(`navbar-click-${item.name}`);
              }}
              className={`Nav__right-menu footprint-primary-text ${
                location.pathname === item.url ? "Nav__right-menu-select" : ""
              }`}
              target={item.open ? "_blank" : ""}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    );
  }

  renderNavEntityMenu({ item, className, fromDrawer }) {
    if (fromDrawer) {
      return (
        <div className="flex flex-column w-full">
          <div className={className}>
            {/*{item.icon && <Icon name={item.icon} size={16} />}*/}
            <span>{item.name}</span>
            <Icon className="ml1" name="search_arrow_up" size={12} />
          </div>
          <div>
            {item.menu.map((item, index) => {
              return (
                <Link
                  className={className}
                  key={index}
                  to={item.link}
                  target={item.externalLink ? "_blank" : null}
                  onClick={e => {
                    this.goLink(e, item.link, item.externalLink);
                    trackStructEvent(`navbar-click-${item.title}`);
                  }}
                >
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      );
    }
    return (
      <EntityMenu
        items={item.menu}
        triggerProps={{
          style: {
            color: "#5F6368",
            marginTop: 20,
          },
        }}
        hasArrow={true}
        hasBackground={true}
        menuShiftY={0}
        renderChildren={
          <div
            className={className}
            onClick={() => trackStructEvent(`navbar-click-${item.name}`)}
          >
            {/*{item.icon && <Icon name={item.icon} size={16} />}*/}
            <span>{item.name}</span>
            <Icon className="ml1" name="search_arrow_up" size={12} />
          </div>
        }
      />
    );
  }

  renderMainNav() {
    const {
      user,
      setLoginModalShow,
      setCreateModalShow,
      location,
      onChangeLocation,
    } = this.props;
    const rootDisplay = window.location.pathname.startsWith("/defi360")
      ? "none"
      : "flex";

    const MobileMenuIcon = () => {
      return (
        <div
          className="Nav__side-menu-icon"
          onClick={() => this.setState({ sideNavModal: true })}
        >
          <Icon name="menu" size={16} />
          <span>Menu</span>
        </div>
      );
    };

    const LeftMenu = () => {
      return (
        <nav
          className="Nav__menu footprint-primary-text"
          role="navigation"
          itemScope
          itemType="http://www.schema.org/SiteNavigationElement"
        >
          {leftMenuData.map((item, index) => {
            if (item.menu) {
              return (
                <div key={index}>
                  {this.renderNavEntityMenu({
                    item,
                    className: `text-brand-hover Nav__menu-item Nav__menu-item-color`,
                  })}
                </div>
              );
            }
            return (
              <Link
                itemProp="url"
                to={item.path}
                className={`text-brand-hover Nav__menu-item ${
                  this.isActive(item.path, item.subPath)
                    ? "Nav__menu-item-color--select"
                    : "Nav__menu-item-color"
                }`}
                key={index}
                onClick={e => {
                  e.preventDefault();
                  if (item.comingSoon) {
                    message.info("Coming soon...");
                    return;
                  }
                  if (item.auth && !user) {
                    setLoginModalShow({ show: true, from: item.title });
                    this.setState({ sideNavModal: false });
                  } else {
                    this.goLink(e, item.path, item.open);
                  }
                  trackStructEvent(`navbar-click-${item.title}`);
                }}
              >
                {/*<Icon name={item.icon} size={16} />*/}
                <span>{item.title}</span>
                {this.isActive(item.path, item.subPath) && (
                  <div className="Nav__menu-item--select" />
                )}
              </Link>
            );
          })}
        </nav>
      );
    };

    const RightMenuPad = () => {
      return (
        <div className="Nav__right-pad-icon">
          <Link to="https://docs.footprint.network/docs" target="_blank">
            <Icon name="docs" color={color("footprint-color-title")} />
          </Link>
          <Link to="/search">
            <Icon name="search" color={color("footprint-color-title")} />
          </Link>
          <Link onClick={onCreateAction}>
            <Icon name="add" size={12} />
          </Link>
        </div>
      );
    };

    const RightMenuMobile = () => {
      return (
        <div className="Nav__right-mobile-icon">
          <Link to="/search">
            <Icon name="search" color={color("footprint-color-title")} />
          </Link>
          <Link onClick={onCreateAction}>
            <Icon name="add" size={12} />
          </Link>
        </div>
      );
    };

    const CreateMenu = () => {
      return (
        <div
          className="bg-brand Nav__menu-create footprint-primary-text"
          onClick={onCreateAction}
        >
          <Icon name="plus" size={12} />
          <span>Create</span>
        </div>
      );
    };

    const onCreateAction = () => {
      trackStructEvent(`click Navbar Create`);
      const afterSuccess = () => setCreateModalShow({ show: true });
      const block = this.needCancelFeedbackBlock({ afterSuccess });
      if (block) {
        return;
      }
      console.log("onCreateAction");
      afterSuccess();
    };

    const RightMenu = () => {
      return (
        <div className="Nav__right">
          {this.renderLink({})}
          <CreateMenu />
          <React.Fragment>
            <RightMenuMobile />
            <RightMenuPad />
          </React.Fragment>
          {user ? (
            <ProfileLink
              {...this.props}
              onLogout={() => this.props.logout()}
              trigger={
                <div className="relative" style={{ padding: 10 }}>
                  <UserAvatar user={user} size={["2.5em", "2.5em"]} />
                  <div
                    className="absolute right bottom mb1"
                    style={{ marginRight: 2 }}
                  >
                    <VipIcon user={user} />
                  </div>
                </div>
              }
            />
          ) : (
            <Link
              className="Nav__sign-up"
              onClick={() => {
                trackStructEvent(`click Sign in`);
                setLoginModalShow({ show: true, from: "navbar_signin" });
              }}
            >
              Sign in
            </Link>
          )}
        </div>
      );
    };

    return (
      <div className="Nav" style={{ display: rootDisplay }}>
        <div className="Nav__left">
          <MobileMenuIcon />
          <Link
            className="Nav__logo"
            to="/"
            onClick={e => {
              e.preventDefault();
              trackStructEvent(`navbar-click-logo`);
              this.goLink(e, "/");
            }}
          >
            <img
              src={getOssUrl("img_nav_logo_v5.svg")}
              width={188}
              height={28}
              style={{ marginBottom: 2 }}
              alt="Footprint - One Step Closer to Blockchain Insights"
            />
          </Link>
          <LeftMenu />
        </div>
        <React.Fragment>
          <div className="Nav__search-bar">
            <SearchBar
              location={location}
              onChangeLocation={onChangeLocation}
            />
          </div>
          <div className="Nav__mobile-logo">
            <Link
              className="Nav__logo"
              to="/"
              onClick={e => {
                e.preventDefault();
                trackStructEvent(`navbar-click-logo`);
                this.goLink(e, "/");
              }}
            >
              <img
                src={getOssUrl("img_nav_logo_mobile.svg")}
                width={40}
                height={36}
                alt="Footprint - One Step Closer to Blockchain Insights"
              />
            </Link>
          </div>
        </React.Fragment>
        <RightMenu />
        {this.renderModal()}
        {zkspaceDate() && this.renderSubmitAddrZkspaceModal()}
        {this.renderSideNav()}
        {this.renderLoginModal()}
        {this.renderCancelFeedbackModal()}
      </div>
    );
  }

  render() {
    const { context } = this.props;

    switch (context) {
      case "auth":
        return null;
      case "none":
        return this.renderEmptyNav();
      case "setup":
        return null;
      default:
        return this.renderMainNav();
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FpNavbar);
