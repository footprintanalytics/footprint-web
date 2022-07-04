/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-component-props */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { PLUGIN_ADMIN_NAV_ITEMS } from "metabase/plugins";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import cx from "classnames";
import { t } from "ttag";
import MetabaseSettings from "metabase/lib/settings";
import Icon from "metabase/components/Icon";
import Link from "metabase/components/Link";
import LogoIcon from "metabase/components/LogoIcon";
import ProfileLink from "metabase/nav/components/ProfileLink";
import SearchBar from "metabase/nav/components/SearchBar";
import { getContext, getPath, getUser } from "../selectors";
import CreateActionModal from "metabase/components/CreateActionModal";
import Modal from "metabase/components/Modal";
import "./Navbar.css";
import { getChannel } from "metabase/selectors/app";
import { zkspaceDate } from "metabase/lib/register-activity";

import { trackStructEvent } from "metabase/lib/analytics";
import {
  getCancelFeedback,
  getCreateModalShow,
  getIsUserFeedbackBlock,
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
import { Drawer } from "antd";
import LoginModal from "metabase/auth/containers/LoginModal";
import { getOssUrl } from "metabase/lib/image";
import UserCancelFeedbackModal from "metabase/components/UserCancelFeedbackModal";
import StoreLink from "metabase/nav/components/StoreLink";
import ActivityZkspaceSubmitModal from "metabase/components/ActivityZkspaceSubmitModal";
import { isDefi360 } from "metabase/lib/project_info";
import { color } from "metabase/lib/colors";
import EntityMenu from "metabase/components/EntityMenu";

const mapStateToProps = (state, props) => ({
  path: getPath(state, props),
  context: getContext(state, props),
  user: getUser(state),
  loginModalShow: getLoginModalShow(state, props),
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
};

const menus = [
  {
    title: "Home",
    icon: "menu_home",
    path: "/dashboards",
    auth: false,
  },
  {
    name: "Data",
    icon: "protocols",
    menu: [
      {
        title: "Data Overview",
        link:
          "https://www.footprint.network/@Footprint/Footprint-Data-Overview",
      },
      {
        title: "Data Dictionary",
        link:
          "https://www.footprint.network/@Footprint/Footprint-Datasets-Data-Dictionary",
      },
      {
        title: "CSV Upload",
        link: "https://www.footprint.network/chart/custom-upload",
      },
      {
        title: "API Upload",
        link: "https://docs.footprint.network/api",
        externalLink: true,
      },
    ],
  },
  // {
  //   title: "Explore",
  //   path: "/explore",
  //   icon: "menu_explore",
  //   auth: false,
  // },
  /*{
    title: "Browse Data",
    path: "/browse",
    icon: "menu_data",
    auth: true,
  },*/
  /*{
    title: "My Analytics",
    path: "/mine",
    icon: "menu_my",
    auth: true,
  },*/
  // {
  //   title: "DeFi360",
  //   path: "/defi360",
  //   icon: "menu_home",
  //   auth: false,
  // },
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
@connect(mapStateToProps, mapDispatchToProps)
export default class Navbar extends Component {
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

  isActive(path, subPath) {
    const propsPaths = this.props.path.split("/");
    if (propsPaths.length > 1) {
      const target = `/${propsPaths[1]}`;
      return target === path || target === subPath;
    }
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

  renderAdminNav() {
    return (
      // NOTE: DO NOT REMOVE `Nav` CLASS FOR NOW, USED BY MODALS, FULLSCREEN DASHBOARD, ETC
      // TODO: hide nav using state in redux instead?
      <nav className={"Nav AdminNav sm-py1"}>
        <div className="sm-pl4 flex align-center pr1">
          <div className="NavTitle flex align-center">
            <Icon name={"gear"} className="AdminGear" size={22} />
            <span className="NavItem-text ml1 hide sm-show text-bold">{t`Metabase Admin`}</span>
          </div>

          <ul className="sm-ml4 flex flex-full">
            <AdminNavItem
              name={t`Settings`}
              path="/admin/settings"
              currentPath={this.props.path}
              key="admin-nav-settings"
            />
            <AdminNavItem
              name={t`People`}
              path="/admin/people"
              currentPath={this.props.path}
              key="admin-nav-people"
            />
            <AdminNavItem
              name={t`Data Model`}
              path="/admin/datamodel"
              currentPath={this.props.path}
              key="admin-nav-datamodel"
            />
            <AdminNavItem
              name={t`Databases`}
              path="/admin/databases"
              currentPath={this.props.path}
              key="admin-nav-databases"
            />
            <AdminNavItem
              name={t`Permissions`}
              path="/admin/permissions"
              currentPath={this.props.path}
              key="admin-nav-permissions"
            />
            {PLUGIN_ADMIN_NAV_ITEMS.map(({ name, path }) => (
              <AdminNavItem
                name={name}
                path={path}
                currentPath={this.props.path}
                key={`admin-nav-${name}`}
              />
            ))}
            <AdminNavItem
              name={t`Troubleshooting`}
              path="/admin/troubleshooting"
              currentPath={this.props.path}
              key="admin-nav-troubleshooting"
            />
          </ul>

          {!MetabaseSettings.isPaidPlan() && <StoreLink />}
          <ProfileLink {...this.props} />
        </div>
        {this.renderLoginModal()}
      </nav>
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
        visible={this.state.sideNavModal}
      >
        <div className="Nav__side-menu">
          {menus.map(item => {
            if (item.menu) {
              return this.renderNavEntityMenu({
                item,
                className: `Nav__menu-item text-brand-hover`,
                fromDrawer: true,
              });
            }
            return (
              <div
                className="Nav__menu-item text-brand-hover"
                key={item.title}
                onClick={e => {
                  trackStructEvent(`navbar-click-${item.title}`);
                  if (item.auth && !user) {
                    setLoginModalShow({ show: true, from: item.title });
                    this.setState({ sideNavModal: false });
                  } else {
                    this.goLink(e, item.path);
                  }
                }}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.title}</span>
                {this.isActive(item.path, item.subPath) && (
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
    const { location, loginModalShow, setLoginModalShow } = this.props;
    return (
      <LoginModal
        isOpen={loginModalShow}
        onClose={() => setLoginModalShow({ show: false })}
        from={location.query.from}
        channel={location.query.channel || location.query.cnl}
        location={this.props.location}
        fromNav={true}
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
    const links = [
      { url: "/news/featured", name: "Research" },
      // { url: "/about", name: "Why Footprint" },
      // { url: "/tutorials/visualizations", name: "Tutorials" },
      // {
      //   url: "https://insights.footprint.network/",
      //   name: "Insights",
      //   open: true,
      // },
      { url: "https://docs.footprint.network/", name: "Docs", open: true },
      { url: `/@${user?.name}`, name: "My Profile", auth: true },
      // { url: "/widget", name: "Widget" },
    ];

    return (
      <nav
        role="navigation"
        itemScope
        itemType="http://www.schema.org/SiteNavigationElement"
        className={`${className} Nav__right-menus`}
      >
        {links.map(item => {
          if (item.menu) {
            return this.renderNavEntityMenu({
              item,
              className: `Nav__right-menu footprint-primary-text`,
              fromDrawer,
            });
          }
          return (
            <Link
              key={item.name}
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
            {item.icon && <Icon name={item.icon} size={16} />}
            <span>{item.name}</span>
          </div>
          <div>
            {item.menu.map(item => {
              return (
                <Link
                  className={className}
                  key={item.title}
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
        offsetY={-10}
        renderChildren={
          <div
            className={className}
            onClick={() => trackStructEvent(`navbar-click-${item.name}`)}
          >
            {item.icon && <Icon name={item.icon} size={16} />}
            <span>{item.name}</span>
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
          {menus.map(item => {
            if (item.menu) {
              return this.renderNavEntityMenu({
                item,
                className: `text-brand-hover Nav__menu-item Nav__menu-item-color`,
              });
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
                key={item.title}
                onClick={e => {
                  e.preventDefault();
                  if (item.auth && !user) {
                    setLoginModalShow({ show: true, from: item.title });
                    this.setState({ sideNavModal: false });
                  } else {
                    this.goLink(e, item.path);
                  }
                  trackStructEvent(`navbar-click-${item.title}`);
                }}
              >
                <Icon name={item.icon} size={16} />
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
          <Link to="https://docs.footprint.network/" target="_blank">
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
            <ProfileLink {...this.props} />
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
            to="/about"
            onClick={e => {
              e.preventDefault();
              trackStructEvent(`navbar-click-logo`);
              this.goLink(e, "/about");
            }}
          >
            <img
              src={getOssUrl("img_nav_logo_v5.svg")}
              width={188}
              height={28}
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
              to="/about"
              onClick={e => {
                e.preventDefault();
                trackStructEvent(`navbar-click-logo`);
                this.goLink(e, "/about");
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
    const { context, path } = this.props;
    if (["/about"].includes(path)) {
      return null;
    }
    switch (context) {
      case "admin":
        return this.renderAdminNav();
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
