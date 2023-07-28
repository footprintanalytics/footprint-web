/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import "./index.css";
import "../research/index.css";
import cx from "classnames";
import FeaturesSide from "metabase/containers/research/components/FeaturesSide";
import myData from "./utils/data";
import { Button, Dropdown } from "antd";
import Icon from "metabase/components/Icon";
import * as Urls from "metabase/lib/urls";
import { logout } from "metabase/auth/actions";
import { replace } from "react-router-redux";
import MyProfile from "metabase/containers/myStudio/Component/MyProfile";
import { loginModalShowAction } from "metabase/redux/control";
import flatten from "underscore/modules/_flatten";
import ResourceBox from "metabase/containers/research/components/ResourceBox";
import ChartArea from "metabase/containers/research/components/ChartArea";
import DashboardArea from "metabase/containers/research/components/DashboardArea";

const MyStudio = props => {
  const isPublic = window.location.pathname.startsWith("/public");
  const {
    menu,
    subMenu,
    value,
    location,
    router,
    children,
    classify,
    partner,
    replace,
    params,
    user,
    logout,
    setLoginModalShow,
  } = props;
  const type = "studio";
  const researchData = myData["getMyStudioData"]({ params, router, user, name: user.name, onLogout: logout });
  const array = [
    ...flatten(researchData?.filter(f => f.itemType === "group")?.map(i => i.subMenus)),
    ...researchData.filter(f => f.itemType !== "group"),
  ]
  const findItemByData = ({ menu, subMenu }) => {
    const menuData = array?.find(item => item.value === menu);
    if (!menuData?.subMenus) {
      return menuData;
    }
    return menuData?.subMenus?.find(item => item.value === subMenu) || array[0]?.subMenus[0];
  }

  const item = findItemByData({ menu, subMenu, value });
  console.log("item", item)
  if (!menu && !subMenu) {
    if (array[0].subMenus) {
      replace(`studio/${array[0].value}/${array[0]?.subMenus[0]?.value}`);
    } else {
      replace(`studio/${array[0].value}`);
    }
  }

  const renderArea = (item) => {
    let tempItem = item;
    if (value) {
      tempItem = item?.resources?.find(i => i.value === value);
    }
    if (tempItem?.resources) {
      return (
        <ResourceBox
          location={location}
          item={tempItem}
          type={type}
          classify={classify}
          menu={menu}
          subMenu={subMenu}
        />
      )
    }
    if (tempItem?.type === "chart") {
      return <ChartArea key={`${tempItem?.publicUuid}${tempItem?.search}`} location={location} item={tempItem} />
    }
    return <DashboardArea key={`${tempItem?.publicUuid}${tempItem?.search}`} location={location} item={tempItem} />
  }

  return (
    <>
      <div className={cx("bg-gray flex flex my-studio", isPublic ? "Features-public" : "Features")}>
        <div className="Features-side">
          {menu && (
            <FeaturesSide
              defaultMenu={menu}
              defaultSubMenu={subMenu}
              type="studio"
              partner={partner}
              researchData={researchData}
              isCustom={false}
              showSocial={false}
              isPublic={isPublic}
              location={location}
              user={user}
              showMyProfile
            />
          )}
        </div>
        <div
          className="Features-main"
          style={{
            overflow: "auto"
          }}
        >
          {item?.component || renderArea(item)}
        </div>
        {children}
      </div>
    </>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser,
    menu: props.params.menu,
    subMenu: props.params.subMenu,
  };
};

const mapDispatchToProps = {
  logout,
  replace,
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyStudio);
