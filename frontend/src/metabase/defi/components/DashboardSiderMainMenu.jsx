/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/prop-types */
/* eslint-disable curly */
import React, { useContext } from "react";
import { MENU_LIST } from "../utils/dashboard";
import Icon from "metabase/components/Icon";
import { getOssUrl } from "../../lib/image";
import { StateContext } from "./StateProvider";
import { message } from "antd";

const DashboardSiderMainMenu = ({ userMenu, commonMenu, onClick }) => {
  const { isOpenSubMenu, setIsOpenSubMenu } = useContext(StateContext);

  const iconMap = {
    Stats: "menu_stats",
    Analysis: "menu_analysis",
    "Custom Analysis": "menu_custom_analysis",
    "Airdrop Tool": "tools",
  };

  const Item = ({ item }) => {
    const isActive =
      (commonMenu?.value || userMenu?.firstLevel?.value) === item.value;

    return (
      <li
        className={`defi-dashboard__sider-main-menu-top-item ${
          isActive ? "defi-dashboard__sider-main-menu-top-item--active" : ""
        }`}
        onClick={() => onClick({ firstLevelValue: item.label })}
      >
        <Icon name={iconMap[item.label] || "menu_stats"} size={24} />
        <h2>{item.label}</h2>
      </li>
    );
  };

  return (
    <div className="defi-dashboard__sider-main-menu">
      <ul className="defi-dashboard__sider-main-menu-top">
        {userMenu?.firstLevelList?.map(item => (
          <Item key={item.value} item={item} />
        ))}
        {MENU_LIST.map(item => (
          <Item key={item.value} item={item} />
        ))}
      </ul>
      <div className="defi-dashboard__sider-main-menu-bottom">
        <ul className="defi-dashboard__sider-main-menu-tool">
          <li>
            <a
              href="https://t.me/joinchat/4-ocuURAr2thODFh"
              target="_blank"
              rel="nofollow"
            >
              <Icon name="tool_telegram" color="#ACACB2" size={24} />
            </a>
          </li>
          <li onClick={() => message.info("Coming soon.")}>
            <a>
              <Icon name="tool_help" color="#ACACB2" size={24} />
            </a>
          </li>
          <li onClick={() => message.info("Coming soon.")}>
            <a>
              <Icon name="tool_docs" color="#ACACB2" width={23} height={26} />
            </a>
          </li>
          <li onClick={() => message.info("Coming soon.")}>
            <a>
              <Icon name="tool_setting" color="#ACACB2" size={24} />
            </a>
          </li>
        </ul>
        <div
          className={`defi-dashboard__sider-main-menu-toggle ${
            isOpenSubMenu ? "" : "defi-dashboard__sider-main-menu-toggle--right"
          }`}
          onClick={() => setIsOpenSubMenu(!isOpenSubMenu)}
        >
          <img src={getOssUrl("20220222170505.png")} alt="toggle menu" />
        </div>
      </div>
    </div>
  );
};

export default DashboardSiderMainMenu;
