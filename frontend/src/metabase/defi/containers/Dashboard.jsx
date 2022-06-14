/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { Space } from "antd";
import { useQuery } from "@apollo/client";
import {
  // QUERY_OPTIONS,
  USER_DASHBOARD,
} from "../../gql";
import { trackStructEvent } from "metabase/lib/analytics";
import {
  MENU_LIST,
  DEMO_PROTOCOL_LIST,
  formatUserDashboard,
  getMenuPath,
  isDemo,
} from "../utils/dashboard";
import Layout from "../components/Layout";
import DashboardContent from "../components/DashboardContent";
import DashboardSelectProtocol from "../components/DashboardSelectProtocol";
import DashboardSubmitProtocol from "../components/DashboardSubmitProtocol";
import DashboardSiderMainMenu from "../components/DashboardSiderMainMenu";
import DashboardSiderSubMenu from "../components/DashboardSiderSubMenu";

const Dashboard = props => {
  const { params, router, location, user } = props;

  const [userMenu, setUserMenu] = useState();
  const [userId, setUserId] = useState();

  useEffect(() => {
    if (isDemo()) {
      if (params.protocolName) {
        const demoItem = DEMO_PROTOCOL_LIST.find(
          item => item.protocolName === params.protocolName,
        );
        setUserId(demoItem.userId);
      } else {
        setUserId(DEMO_PROTOCOL_LIST[0].userId);
      }
    } else {
      setUserId(user?.id + "");
    }
  }, [params.protocolName, user?.id]);

  const [commonMenu, setCommonMenu] = useState();
  const [commonSubMenu, setCommonSubMenu] = useState();

  const findUserDashboard = useQuery(USER_DASHBOARD.find, {
    // ...QUERY_OPTIONS,
    variables: { user_id: userId },
    skip: !userId,
  });

  useEffect(() => {
    if (!findUserDashboard.data) return;

    try {
      const { protocolName, firstLevel, secondLevel, thirdLevel } = params;
      let matchCommonMenu = MENU_LIST.find(item => item.value === firstLevel);

      if (!findUserDashboard.data.indicator_user_dashboard.length) {
        matchCommonMenu = matchCommonMenu || MENU_LIST[0];
        setCommonMenu(matchCommonMenu);
        const matchCommonSubMenu = matchCommonMenu.children.find(
          item => item.value === thirdLevel,
        );
        setCommonSubMenu(matchCommonSubMenu || matchCommonMenu.children[0]);
        return;
      }

      if (matchCommonMenu) {
        setCommonMenu(matchCommonMenu);
        setCommonSubMenu(
          thirdLevel
            ? matchCommonMenu.children.find(item => item.value === thirdLevel)
            : matchCommonMenu.children[0],
        );
        const res = formatUserDashboard({
          list: findUserDashboard.data.indicator_user_dashboard,
          protocolNameValue: protocolName,
        });
        setUserMenu(res);
      } else {
        setCommonMenu(undefined);
        setCommonSubMenu(undefined);
        const res = formatUserDashboard({
          list: findUserDashboard.data.indicator_user_dashboard,
          protocolNameValue: protocolName,
          firstLevelValue: firstLevel,
          secondLevelValue: secondLevel,
          thirdLevelValue: thirdLevel,
        });
        setUserMenu(res);
      }
    } catch (error) {
      window.location.href = "/defi360/protocol-dashboard";
    }
  }, [findUserDashboard.data, params]);

  const handleSelectProtocolChange = protocolNameValue => {
    router.replace(getMenuPath([protocolNameValue]));
  };

  const hanldeSiderMainMenuClick = ({ firstLevelValue }) => {
    const path = getMenuPath([userMenu.protocolName.value, firstLevelValue]);
    router.replace(path);
    trackStructEvent("Footprint Enterprise", firstLevelValue);
  };

  const hanldeSiderSubMenuClick = ({ secondLevelValue, thirdLevelValue }) => {
    let action = "";
    let path = "";
    if (commonMenu) {
      path = getMenuPath([
        userMenu?.protocolName?.value || "_",
        commonMenu.value,
        "_",
        secondLevelValue,
      ]);
      action = `${commonMenu.value} - ${secondLevelValue}`;
    } else {
      path = getMenuPath([
        userMenu.protocolName.value,
        userMenu.firstLevel.value,
        secondLevelValue,
        thirdLevelValue,
      ]);
      action = `${secondLevelValue} - ${thirdLevelValue}`;
    }
    router.replace(path);
    trackStructEvent("Footprint Enterprise", action);
  };

  return (
    <div className="defi-dashboard">
      <Layout
        router={router}
        location={location}
        rightHeader={
          <Space>
            <DashboardSubmitProtocol />
            <DashboardSelectProtocol
              userMenu={userMenu}
              onChange={handleSelectProtocolChange}
            />
          </Space>
        }
      >
        <div className="defi-dashboard__sider">
          {!findUserDashboard.loading && (
            <DashboardSiderMainMenu
              userMenu={userMenu}
              commonMenu={commonMenu}
              onClick={hanldeSiderMainMenuClick}
            />
          )}
          <DashboardSiderSubMenu
            userMenu={userMenu}
            commonMenu={commonMenu}
            commonSubMenu={commonSubMenu}
            onClick={hanldeSiderSubMenuClick}
          />
        </div>
        <div className="defi-dashboard__content">
          <DashboardContent
            router={router}
            userId={userId}
            commonSubMenu={commonSubMenu}
            userMenu={userMenu}
            findUserDashboard={findUserDashboard}
            location={location}
          />
        </div>
      </Layout>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(Dashboard);
