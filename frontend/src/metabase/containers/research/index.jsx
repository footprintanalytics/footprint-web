/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import "./index.css";
import FeaturesSide from "./components/FeaturesSide";
import { getFeaturesSideHide } from "metabase/selectors/control";
import DashboardArea from "./components/DashboardArea";
import ChartArea from "./components/ChartArea";
import ResourceBox from "./components/ResourceBox";
import { loginModalShowAction } from "metabase/redux/control";
import myData from "./utils/data";
import { push, replace } from "react-router-redux";
import _ from "underscore";
import { withRouter } from "react-router";
import { Select } from "antd";
import Meta from "metabase/components/Meta";
import { formatSectionTitle } from "metabase/lib/formatting";
import title from "metabase/hoc/Title";
import cx from "classnames";

const Index = props => {
  const {
    menu,
    subMenu,
    value,
    location,
    children,
    classify,
    partner,
    replace,
  } = props;
  const isPublic = window.location.pathname.startsWith("/public");
  const partnerStr = partner ? `/${partner}` : "";
  const prefixPath = isPublic ? "/public" : "";
  const isCustom = classify === "custom";
  const researchData = isCustom ? myData[classify][partner] : myData[classify];
  const metaInfo = myData["metaObject"][classify] || {};
  const type = "research";

  const findItemByData = ({ menu, subMenu }) => {
    const menuData = researchData?.find(item => item.value === menu);
    if (!menuData?.subMenus) {
      return menuData;
    }
    return menuData?.subMenus?.find(item => item.value === subMenu) || researchData[0]?.subMenus[0];
  }

  const item = findItemByData({ menu, subMenu, value });

  if (!menu && !subMenu) {
    if (researchData[0].subMenus) {
      replace(`${prefixPath}/${type}/${classify}${partnerStr}/${researchData[0].value}/${researchData[0]?.subMenus[0]?.value}`);
    } else {
      replace(`${prefixPath}/${type}/${classify}${partnerStr}/${researchData[0].value}`);
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
      return <ChartArea location={location} item={tempItem} />
    }
    return <DashboardArea location={location} item={tempItem} />
  }

  const renderSelectClassify = () => {
    return (
      <div className="features-side__classify">
        <Select
          defaultValue={classify}
          style={{ width: 200 }}
          onChange={value => {
            if (value !== classify) {
              replace(`${prefixPath}/${type}/${value}`)
            }
          }}
          options={
            [{ value: "nft", label: "NFT Research" }, { value: "gamefi", label: "GameFi Research" }, { value: "chain", label: "Chain Research" }]
          }
        />
      </div>
    )
  }

  const renderBack = () => {
    return (
      <div
        className="cursor-pointer"
        style={{ color: "#ffffffe0", padding: "10px 20px 0" }}
        onClick={() => {
          const lastIndex = location.pathname.lastIndexOf("/");
          replace(location.pathname.substr(0, lastIndex));
        }}
      >
        {"<- Back"}
      </div>
    )
  }


  return (
    <>
      <Meta description={metaInfo["description"] || ""} keywords={metaInfo["keywords"] || ""} title={metaInfo["title"] || ""} />
      <div className={cx("bg-gray flex flex", isPublic ? "Features-public" : "Features")}>
        <div className="Features-side">
          {!isCustom && renderSelectClassify()}
          {menu && (
            <FeaturesSide
              defaultMenu={menu}
              defaultSubMenu={subMenu}
              type="research"
              classify={classify}
              partner={partner}
              researchData={researchData}
              isCustom={isCustom}
              isPublic={isPublic}
              location={location}
            />
          )}
        </div>
        <div
          className="Features-main"
          style={{
            overflow: "hidden"
          }}
        >
          {value && (renderBack())}
          {renderArea(item)}
        </div>
        {children}
      </div>
    </>
  );
};

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
  replace,
  onChangeLocation: push,
};

const mapStateToProps = (state, props) => {
  return {
    partner: props.params.partner,
    menu: props.params.menu,
    subMenu: props.params.subMenu,
    value: props.params.value,
    hideSide: getFeaturesSideHide(state, props),
    user: state.currentUser,
  };
};

export default _.compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
  title(({ subMenu }) => subMenu && formatSectionTitle(subMenu))
)(Index);
