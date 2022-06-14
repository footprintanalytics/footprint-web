/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { push } from "react-router-redux";
import Card from "metabase/components/Card";
import { t } from "ttag";
import * as Urls from "metabase/lib/urls";
import ModalContent from "metabase/components/ModalContent";
import { Flex, Box } from "grid-styled";
import { Divider } from "antd";
import { getUser, getUserNativeQueryPermission } from "metabase/selectors/user";
import NeedPermissionModal from "./NeedPermissionModal";
import { getOssUrl } from "metabase/lib/image";
import { isPublicPath } from "metabase/lib/urls";
import { loginModalShowAction } from "metabase/redux/control";
import { isDemo, demoTip } from "../defi/utils/dashboard";
import { trackStructEvent } from "metabase/lib/analytics";
import "./CreateActionModal.css";

const mapStateToProps = state => {
  return {
    canNativeQuery: getUserNativeQueryPermission(state),
    user: getUser(state),
  };
};

const mapDispatchToProps = {
  onChangeLocation: push,
  setLoginModalShow: loginModalShowAction,
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class CreateActionModal extends Component {
  static propTypes = {
    onClose: PropTypes.func,
  };

  state = {
    showVip: false,
  };

  onSelect = n => {
    if (n.permission) {
      this.setState({ showVip: true });
      return;
    }
    // const { onClose, onChangeLocation, onCloseSideBar } = this.props;
    // onChangeLocation(n.to);
    // onClose && onClose();
    // onCloseSideBar && onCloseSideBar();
    window.open(n.to);
  };

  render() {
    const {
      onClose,
      showNewDashboard,
      canNativeQuery,
      user,
      setLoginModalShow,
    } = this.props;

    const isLogin = () => {
      if (user) {
        return true;
      } else {
        setLoginModalShow({ show: true, from: "Create Modal" });
        return false;
      }
    };

    const quetions = [
      {
        title: t`New Chart`,
        desc: t`Pick some data, view it, and easily filter, summarize, and visualize it.`,
        icon: getOssUrl("20210713145417.png"),
        to: Urls.newQuestion(),
      },
      // {
      //   title: t`Custom Query`,
      //   desc: t`Use the advanced notebook editor to join data, create custom columns, do math, and more.`,
      //   icon: getOssUrl("20210713145429.png"),
      //   style: { margin: "0 20px" },
      //   to: Urls.newQuestion({ mode: "notebook" }),
      // },
      {
        title: t`SQL Query`,
        desc: t`For more complicated queries, you can write your own SQL or native query.`,
        icon: getOssUrl("20210713145436.png"),
        to: Urls.newQuestion({ type: "native" }),
        permission: !canNativeQuery,
      },
    ];

    const renderModal = context => {
      return (
        context.state.showVip && (
          <NeedPermissionModal
            title="Upgrade your account to access Native query"
            onClose={() => context.setState({ showVip: false })}
            afterChangeLocation={() => {
              context.setState({ showVip: false });
              onClose && onClose();
            }}
          />
        )
      );
    };

    return (
      <ModalContent title="Create" onClose={onClose}>
        <div className="create-modal__wrap">
          <div className="create-modal__question-box">
            {quetions.map(n => (
              <Card
                className="create-modal__question-box-card"
                key={n.title}
                style={{ ...n.style }}
                onClick={() => {
                  trackStructEvent(`create-modal click ${n.title}`);
                  if (isDemo()) {
                    demoTip();
                    return;
                  }
                  if (isLogin()) {
                    !isPublicPath() && this.onSelect(n);
                  }
                }}
              >
                <Flex
                  p={20}
                  flexDirection="column"
                  alignItems="center"
                  style={{ maxWidth: 220 }}
                >
                  <img
                    className="create-modal__question-img"
                    src={n.icon}
                    style={{ width: 148, height: 104 }}
                  />
                  <Box className="create-modal__question-title">
                    <span
                      style={{
                        fontSize: 18,
                        color: "#505050",
                        fontWeight: 700,
                      }}
                    >
                      {n.title}
                    </span>
                  </Box>
                  <span style={{ fontSize: 12, color: "#97A2B9" }}>
                    {n.desc}
                  </span>
                </Flex>
              </Card>
            ))}
          </div>
          <Divider
            className="create-modal__question-divider"
            style={{ margin: "40px 0" }}
          />
          <Flex justifyContent="flex-end">
            <Card style={{ width: "100%", cursor: "pointer" }}>
              <Flex
                className="create-modal__dashboard"
                px={30}
                py={18}
                alignItems="center"
                onClick={() => {
                  trackStructEvent(`create-modal click New Dashboard}`);
                  if (isDemo()) {
                    demoTip();
                    return;
                  }
                  if (isLogin()) {
                    !isPublicPath() && showNewDashboard && showNewDashboard();
                  }
                }}
              >
                <img
                  className="create-modal__question-img"
                  src={getOssUrl("20210713153334.png")}
                  style={{ width: 80, marginRight: 18 }}
                />
                <span
                  style={{ fontSize: 16, color: "#505050", fontWeight: 700 }}
                >
                  New Dashboard
                </span>
              </Flex>
            </Card>
            {/* <Card style={{ width: 302 }}>
              <Flex
                px={30}
                py={18}
                alignItems="center"
                onClick={() => this.onSelect(Urls.newPulse())}
              >
                <img
                  src={getOssUrl("20210713153344.png")}
                  style={{ width: 80, marginRight: 18 }}
                />
                <span
                  style={{ fontSize: 16, color: "#505050", fontWeight: 700 }}
                >
                  New pulse
                </span>
              </Flex>
            </Card> */}
          </Flex>
        </div>
        {renderModal(this)}
      </ModalContent>
    );
  }
}
