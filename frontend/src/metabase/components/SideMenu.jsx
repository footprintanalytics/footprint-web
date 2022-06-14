/* eslint-disable react/prop-types */

import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Menu } from "antd";
import { Link } from "react-router";
import { getPlainNativeQuery } from "metabase/new_query/selectors";
import CreateActionModal from "metabase/components/CreateActionModal";
import SideBarCreateButton from "metabase/components/SideBarCreateButton";
import SvgHome from "metabase/components/icons/SvgHome";
import SvgUser from "metabase/components/icons/SvgUser";
import SvgAnalytics from "metabase/components/icons/SvgAnalytics";
import SvgDataBase from "metabase/components/icons/SvgDataBase";
import Modal from "metabase/components/Modal";
import { getUserPersonalCollectionId } from "metabase/selectors/user";
import { Box, Flex } from "grid-styled";
import CreateDashboardModal from "metabase/components/CreateDashboardModal";
const { Sider } = Layout;
import { color } from "metabase/lib/colors";
import Icon from "metabase/components/Icon";
import ExternalLink from "metabase/components/ExternalLink";
import { t } from "ttag";

const LinkMenuItem = ({ children, to, onClose, event, externalLink }) => (
  <Link
    to={to}
    target={externalLink ? "_blank" : null}
    onClick={onClose}
    data-metabase-event={event}
    style={{ display: "block" }}
  >
    {children}
  </Link>
);

const mapStateToProps = state => ({
  plainNativeQuery: getPlainNativeQuery(state),
  personalCollectionId: getUserPersonalCollectionId(state),
});

@connect(mapStateToProps)
class SideMenu extends Component {
  state = {
    modal: false,
    newDashboardModal: false,
  };

  renderModal() {
    const { modal } = this.state;
    return (
      modal && (
        <Modal
          className="w-auto"
          ModalClass="z-index-top"
          onClose={() => this.setState({ modal: false })}
        >
          <CreateActionModal
            showNewDashboard={this.showNewDashboard}
            onClose={() => this.setState({ modal: false })}
            onCloseSideBar={this.props.onClose}
          />
        </Modal>
      )
    );
  }

  renderNewDashboardModal() {
    const { newDashboardModal } = this.state;
    if (newDashboardModal) {
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
                onSavedOtherAction={() => {
                  this.setState({ modal: false });
                  // this.props.onClose && this.props.onClose();
                }}
                onClose={() => this.setState({ newDashboardModal: false })}
              />
            </div>
          </Modal>
        )
      );
    } else {
      return null;
    }
  }

  showNewDashboard = () => {
    this.setState({ newDashboardModal: true });
  };

  render() {
    const { personalCollectionId, sideMenuCollapse } = this.props;
    return (
      <Sider
        collapsible
        defaultCollapsed={sideMenuCollapse}
        collapsed={sideMenuCollapse}
        width={260}
        trigger={null}
        style={{
          top: this.props.top || 0,
          backgroundColor: "#fff",
          paddingTop: this.props.paddingTop || 0,
        }}
      >
        <SideBarCreateButton
          collapsed={sideMenuCollapse}
          onClick={() => {
            // this.props.onClose && this.props.onClose();
            this.setState({ modal: true });
          }}
        />
        <SideBarMenuPanel
          personalCollectionId={personalCollectionId}
          onClose={this.props.onClose}
        />
        <SideBarBottomButtonPanel
          onClose={this.props.onClose}
          collapsed={sideMenuCollapse}
        />
        {this.renderModal()}
        {this.renderNewDashboardModal()}
      </Sider>
    );
  }
}

const SideBarBottomButtonPanel = ({ collapsed }) => {
  return (
    <Flex
      className={"side-menu-bottom-button w-full"}
      align="center"
      justify="center"
      flexDirection={collapsed ? "column" : "row"}
    >
      <ExternalLink href={"https://discord.gg/3HYaR6USM7"} target="_blank">
        <Icon name="discord" size={20} color={color("svg-color")} />
      </ExternalLink>
      <Box ml={20} mt={15} />
      <ExternalLink
        href={"https://t.me/joinchat/4-ocuURAr2thODFh"}
        target="_blank"
      >
        <Icon name="telegram" size={20} color={color("svg-color")} />
      </ExternalLink>
      <Box ml={20} mt={15} />
      <ExternalLink
        href={"https://medium.com/@footprintofficial"}
        target="_blank"
      >
        <Icon name="medium" size={20} color={color("svg-color")} />
      </ExternalLink>
      <Box ml={20} mt={15} />
      <ExternalLink href={"https://twitter.com/Footprint_DeFi"} target="_blank">
        <Icon name="twitter" size={20} color={color("svg-color")} />
      </ExternalLink>
    </Flex>
  );
};

const SideBarMenuPanel = ({ personalCollectionId, onClose }) => {
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={["/"]}
      defaultOpenKeys={["analytics"]}
    >
      <Menu.Item
        key="/"
        icon={<SvgHome />}
        style={{ height: 46, lineHeight: "55px", color: color("text-dark") }}
      >
        <LinkMenuItem to="/home" onClose={onClose}>
          Home
        </LinkMenuItem>
      </Menu.Item>
      <Menu.Item
        key="analytics"
        icon={<SvgUser />}
        style={{ height: 46, lineHeight: "55px", color: color("text-dark") }}
      >
        <LinkMenuItem
          to={`/collection/${personalCollectionId}`}
          onClose={onClose}
        >
          My Analytics
        </LinkMenuItem>
      </Menu.Item>
      {/*<Menu.SubMenu*/}
      {/*  key="analytics"*/}
      {/*  icon={<SvgUser />}*/}
      {/*  title="My Analytics"*/}
      {/*  className={"sideBarSelectItem sideBarOpenItem"}*/}
      {/*>*/}
      {/*  <Menu.Item key="/all">*/}
      {/*    <LinkMenuItem to="/collection/1" onClose={this.props.onClose}>*/}
      {/*      All*/}
      {/*    </LinkMenuItem>*/}
      {/*  </Menu.Item>*/}
      {/*  <Menu.Item key="/dashboard">*/}
      {/*    <LinkMenuItem onClose={this.props.onClose}>*/}
      {/*      Dashboards*/}
      {/*    </LinkMenuItem>*/}
      {/*  </Menu.Item>*/}
      {/*  <Menu.Item key="/question">*/}
      {/*    <LinkMenuItem onClose={this.props.onClose}>*/}
      {/*      Questions*/}
      {/*    </LinkMenuItem>*/}
      {/*  </Menu.Item>*/}
      {/*</Menu.SubMenu>*/}
      <Menu.Item
        key="1"
        icon={<SvgAnalytics />}
        style={{ height: 46, lineHeight: "55px", color: color("text-dark") }}
      >
        <LinkMenuItem to="/collection/root" onClose={onClose}>
          {t`Public Analytics`}
        </LinkMenuItem>
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<SvgDataBase />}
        style={{ height: 46, lineHeight: "55px", color: color("text-dark") }}
      >
        <LinkMenuItem to="/browse/3" onClose={onClose}>
          Browse Data
        </LinkMenuItem>
      </Menu.Item>
    </Menu>
  );
};

export default SideMenu;
