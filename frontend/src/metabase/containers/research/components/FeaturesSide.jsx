/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { connect } from "react-redux";
import { push, replace } from "react-router-redux";
import { Layout, Menu } from "antd";
import { MailOutlined } from "@ant-design/icons";
import "./FeaturesSide.css";
import { getUser } from "metabase/selectors/user";
import { featuresSideHideAction, loginModalShowAction } from "metabase/redux/control";
import {
  MessageOutlined,
  PicCenterOutlined,
  PropertySafetyOutlined,
  ScheduleOutlined, SmileOutlined, TagOutlined, TrademarkCircleOutlined,
} from "@ant-design/icons/lib/icons";
import { flattenDeep, get } from "lodash";
import Link from "metabase/core/components/Link/Link";

const { Sider } = Layout;


const FeaturesSide = ({
  replace,
  defaultMenu,
  defaultSubMenu,
  type,
  classify,
  researchData,
}) => {
  // eslint-disable-next-line react/jsx-key
  const icons = [<MessageOutlined/>, <MailOutlined/>, <PicCenterOutlined/>, <PropertySafetyOutlined/>, <ScheduleOutlined/>, <SmileOutlined/>, <TagOutlined/>, <TrademarkCircleOutlined/>]
  const renderSeoData = () => {
    const links = flattenDeep(
      researchData &&
      researchData.map(a => {
        return [
          a && a.subMenus && a.subMenus.map(b => `/${type}/${classify}/${a.value}/${b.value}${b.search || ""}`),
        ];
      }),
    );
    return (
      <div style={{ display: "none" }}>
        {links.map(link => {
          return <a key={link} href={link} />;
        })}
      </div>
    );
  };
  const renderDataSet = () => {
    function getItem(label, key, icon, children, type) {
      return {
        key,
        icon,
        children,
        label,
        type,
      };
    }

    const items = researchData.map((item, index) => {
      return (
        getItem(item.label, item.value, icons[index % icons.length], item.subMenus.map(i => getItem(i.label, i.value)))
      );
    });
    const rootSubmenuKeys = researchData.map(item => item.value);
    const [openKeys, setOpenKeys] = useState([defaultMenu]);
    const onOpenChange = (keys) => {
      const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
      if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        setOpenKeys(keys);
      } else {
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
      }
    };
    return (
      <Menu
        style={{
          borderRight: "0px",
          width: "100%",
          flex: 1,
        }}
        theme="light"
        mode="inline"
        openKeys={openKeys}
        selectedKeys={[defaultSubMenu]}
        onOpenChange={onOpenChange}
        onSelect={item => {
          const menuData = researchData?.find(i => i.value === item.keyPath[1]);
          const subMenusData = menuData?.subMenus?.find(i => i.value === item.keyPath[0]);
          replace(`/${type}/${classify}/${item.keyPath[1]}/${item.keyPath[0]}${subMenusData?.search || ""}`);
        }}
        items={items}
      />

    );
  };

  const renderNavButton = () => {
    return (
      <div className="feature-side__nav-button">
        <Link to={"/dashboards"}><span>{"Custom Analysis >>"}</span></Link>
      </div>
    )
  }
  return (
    <div
      className="flex flex-column full-height overflow-auto Features-side__root"
      style={{
        width: 309,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        height: "100%",
        position: "fixed",
        marginBottom: 100,
        padding: "0 0 240px",
      }}
    >
      {renderDataSet()}
      {renderSeoData()}
      {renderNavButton()}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

const mapDispatchToProps = {
  replace,
  featuresSideHideAction,
  onChangeLocation: push,
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(FeaturesSide);
