/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
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
import { lowerCase, get } from "lodash";
import { withRouter } from "react-router";
import { Image, Select } from "antd";
import Meta from "metabase/components/Meta";
import { formatSectionTitle } from "metabase/lib/formatting";
import title from "metabase/hoc/Title";
import cx from "classnames";
import { getOssUrl } from "metabase/lib/image";

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
  let initChain = ""
  if (classify === 'token') {
    initChain = myData[classify]?.find(item => item.value === menu)?.subMenus?.find(subItem => subItem.value === subMenu)?.chain || "ethereum"
  }
  const [chain, setChain] = useState(initChain);
  const isPublic = window.location.pathname.startsWith("/public");
  const partnerStr = partner ? `/${partner}` : "";
  const prefixPath = isPublic ? "/public" : "";
  const isCustom = classify === "custom";
  const isShowChain = classify === "token";
  const metaInfo = myData["metaObject"][classify] || {};
  const type = "research";

  const getResearchData = () => {
    if (isCustom) {
      return myData[classify][partner]
    }
    if (classify === 'token') {

      return myData[classify].map(item => {
        return {
          ...item,
          subMenus: item.subMenus?.filter(subItem => subItem.chain === chain || !subItem.chain)
        }
      });
    }
    return myData[classify];
  }

  const researchData = getResearchData();

  useEffect(() => {
    //如果url上面的path在chain里面没有，就跳转到第一个
    const sameUrl = _.flatten(researchData).some(item => {
      if (item.subMenus) {
        if (item.subMenus.find(subItem => subItem.value === subMenu)) {
          return true
        }
      }
      return false;
    })
    if (!sameUrl) {
      replace(`${prefixPath}/${type}/${classify}${partnerStr}/${researchData[0].value}/${researchData[0].subMenus[0].value}`);
    }
  }, [chain]);

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
      return <ChartArea key={`${chain}${tempItem?.publicUuid}${tempItem?.search}`} location={location} item={tempItem} />
    }
    return <DashboardArea key={`${chain}${tempItem?.publicUuid}${tempItem?.search}`} location={location} item={tempItem} />
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
            [
              { value: "gamefi", label: "Games Research" },
              { value: "chain", label: "Chain Research" },
              { value: "token", label: "Token Research" },
              { value: "wallet", label: "Wallet Research" },
              { value: "defi", label: "DeFi Research" },
              { value: "nft", label: "NFT Research" },
            ]
          }
        />
      </div>
    )
  }

  const chainData = [
    {
      value: "ethereum",
      label: "Ethereum",
      icon: getOssUrl("fp-chains/ethereum.webp"),
    },
    {
      value: "bsc",
      label: "BNB Chain",
      icon: getOssUrl("fp-chains/bsc.webp"),
    },
  ]

  const renderChainSelect = () => {
    return (
      <div className="features-side__chains">
        <Select
          defaultValue={"ethereum"}
          onChange={value => {
            setChain(value)
          }}
          style={{ width: 200 }}
        >
          {chainData.map(n => (
            <Select.Option key={`${n.value}-${n.label}`} value={n.value}>
              <div className="features-side__chains-item">
                <Image src={n.icon} width={20} height={20} preview={false} />
                <span className="pl1">{n.label}</span>
              </div>
            </Select.Option>
          ))}
        </Select>
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
          <h1 style={{"display": "none"}}>{lowerCase(menu)} / {lowerCase(subMenu)}</h1>
          <div className="research-time-text">All times shown are in UTC timezone.</div>
          {!isCustom && renderSelectClassify()}
          {isShowChain && renderChainSelect()}
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
              showSeo={false}
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
