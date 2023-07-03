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

  if (!menu && !subMenu) {
    if (array[0].subMenus) {
      replace(`studio/${array[0].value}/${array[0]?.subMenus[0]?.value}`);
    } else {
      replace(`studio/${array[0].value}`);
    }
  }
  return (
    <>
      <div className={cx("bg-gray flex flex", isPublic ? "Features-public" : "Features")}>
        <div className="Features-side">
          <MyProfile user={user} name={user.name}/>

          <div className="flex flex-column p2">
            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    label: (
                      <div
                        className="mr2 flex align-center"
                        onClick={() => {
                          if (!user) {
                            setLoginModalShow({ show: true, from: "new chart" });
                            return ;
                          }
                          window.open(Urls.newQuestion({ type: "query" }))
                        }}
                      >
                        New Chart
                      </div>
                    )
                  },
                  {
                    key: "2",
                    label: (
                      <div
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
                        SQL Query
                      </div>
                    )
                  },
                  {
                    key: "3",
                    label: (
                      <div
                        className="flex align-center"
                        onClick={() => {
                          if (!user) {
                            setLoginModalShow({ show: true, from: "sql query" });
                            return ;
                          }
                          window.open("dashboard/new")
                        }}
                      >
                        New Dashboard
                      </div>
                    )
                  }
                ]
              }}
              placement="right"
            >
              <Button >
                <Icon name="plus" size={12} className="mr1"/> create
              </Button>
            </Dropdown>
            <Button className="mt1" onClick={() => {
              window.open(Urls.newQuestion({ type: "query" }))}
            }>
              Footprint Dataset
            </Button>
          </div>
          {menu && (
            <FeaturesSide
              defaultMenu={menu}
              defaultSubMenu={subMenu}
              type="studio"
              partner={partner}
              researchData={researchData}
              isCustom={false}
              isPublic={isPublic}
              location={location}
            />
          )}
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
