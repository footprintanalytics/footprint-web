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
  ScheduleOutlined,
  SmileOutlined,
  TagOutlined,
  TrademarkCircleOutlined,
} from "@ant-design/icons/lib/icons";
import { flattenDeep } from "lodash";
import Link from "metabase/core/components/Link/Link";
import SocialLayout from "metabase/components/GlobalContactPanel/components/SocialLayout";
import MetabaseSettings from "metabase/lib/settings";
import LogoBadge from "metabase/public/components/LogoBadge";
import Button from "metabase/core/components/Button/Button";
import Tooltip from "metabase/components/Tooltip";
import EmbedModal from "metabase/containers/home/components/EmbedModal";

const FeaturesSide = ({
  replace,
  defaultMenu,
  defaultSubMenu,
  type,
  classify,
  partner,
  researchData,
  isCustom,
  isPublic,
  location,
}) => {
  const partnerStr = partner ? `/${partner}` : "";
  const prefixPath = isPublic ? "/public" : "";
  const [embedModal, setEmbedModal] = useState({});
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
      if (item.subMenus) {
        return getItem(item.label, item.value, icons[index % icons.length], item.subMenus.map(i => getItem(i.label, i.value)))
      }
      return (
        getItem(item.label, item.value)
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
        selectedKeys={[defaultMenu, defaultSubMenu]}
        onOpenChange={onOpenChange}
        onSelect={item => {
          const menuData = researchData?.find(i => i.value === item.keyPath[1]);
          const subMenusData = menuData?.subMenus?.find(i => i.value === item.keyPath[0]);
          let keyString;
          if (item.keyPath.length === 2) {
            keyString = `${item.keyPath[1]}/${item.keyPath[0]}`
          } else {
            keyString = `${item.keyPath[0]}`
          }
          replace(`${prefixPath}/${type}/${classify}${partnerStr}/${keyString}${subMenusData?.search || ""}`);
        }}
        items={items}
      />

    );
  };

  const renderBrandInfo = () => {
    return (
      <div className="EmbedFrame-footer p1 md-p2 lg-p3 border-top flex-no-shrink flex align-center mp2" style={{ fontSize: 12 }}>
        {!MetabaseSettings.hideEmbedBranding() && (
          <LogoBadge dark="night" />
        )}
      </div>
    )
  }

  const getEmbedUrl = () => {
    return `${MetabaseSettings.get("site-url")}/public${location.pathname}`;
  }

  const renderNavButton = () => {
    return (
      <div className="feature-side__nav-button">
        {!isCustom && (<Link className="mb1" to={"/dashboards"} target={isPublic ? "_blank" : ""}><h5>{"Custom Analysis >>"}</h5></Link>)}
        {!isPublic && (
          <Tooltip tooltip="Embed Widget">
            <Button
              onlyIcon
              className="Question-header-btn my1"
              iconColor="#7A819B"
              icon="embed"
              iconSize={16}
              onClick={() => {
                setEmbedModal({ open: true, publicUrl: getEmbedUrl() })
              }}
            />
            <EmbedModal
              resource={embedModal}
              onClose={() => {
                setEmbedModal({ open: false })
              }}
            />

          </Tooltip>
        )}
        {!isPublic && <SocialLayout />}
        {isPublic && (renderBrandInfo())}
      </div>
    )
  }
  return (
    <div
      className="flex flex-column full-height overflow-auto Features-side__root Theme--night"
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
