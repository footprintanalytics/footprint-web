/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import "./index.css";
import "../research/index.css";
import cx from "classnames";
import FeaturesSide from "metabase/containers/research/components/FeaturesSide";
import myData from "./utils/data";
import { Button } from "antd";
import Icon from "metabase/components/Icon";
import * as Urls from "metabase/lib/urls";
import { logout } from "metabase/auth/actions";
import { replace } from "react-router-redux";
import MyProfile from "metabase/containers/myStudio/Component/MyProfile";
import { loginModalShowAction } from "metabase/redux/control";

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
  const researchData = myData["getMyStudioData"]({ params, router, user, name: params.name, onLogout: logout });

  const findItemByData = ({ menu, subMenu }) => {
    const menuData = researchData?.find(item => item.value === menu);
    console.log("menuData", menuData, menu, subMenu)
    if (!menuData?.subMenus) {
      return menuData;
    }
    return menuData?.subMenus?.find(item => item.value === subMenu) || researchData[0]?.subMenus[0];
  }

  const item = findItemByData({ menu, subMenu, value });
  console.log("menu", menu, params.name, researchData[0].value)
  if (!menu) {
    if (researchData[0].subMenus) {
      if (params.name) {
        replace(`my-studio/@${params.name}/${researchData[0].value}/${researchData[0]?.subMenus[0]?.value}`);
      }
    } else {
      if (params.name) {
        console.log("xxx", `my-studio/@${params.name}/${researchData[0].value}`)
        replace(`my-studio/@${params.name}/${researchData[0].value}`);
      }
    }
  }
  return (
    <>
      <div className={cx("bg-gray flex flex", isPublic ? "Features-public" : "Features")}>
        <div className="Features-side">
          <MyProfile user={user} name={params.name}/>
          <div className="my-studio_top-buttons">
            <Button
              type="primary"
              className="mr2 flex align-center"
              onClick={() => {
                if (!user) {
                  setLoginModalShow({ show: true, from: "new chart" });
                  return ;
                }
                window.open(Urls.newQuestion({ type: "query" }))
              }}
            >
              <Icon name="plus" size={12} className="mr1"/>
              New Chart
            </Button>
            <Button
              className="flex align-center"
              onClick={() => {
                if (!user) {
                  setLoginModalShow({ show: true, from: "sql query" });
                  return ;
                }
                window.open(Urls.newQuestion({
                  type: "native",
                  creationType: "native_question",
                }))
              }}
            >
              <Icon name="plus" size={12} className="mr1"/>
              SQL Query
            </Button>
          </div>
          <FeaturesSide
            defaultMenu={menu}
            defaultSubMenu={subMenu}
            type="my-studio"
            classify={`@${params.name}`}
            partner={partner}
            researchData={researchData}
            isCustom={false}
            isPublic={isPublic}
            location={location}
            menuMode="vertical"
          />
        </div>
        <div
          className="Features-main"
          style={{
            overflow: "auto"
          }}
        >
          {item?.component}
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
