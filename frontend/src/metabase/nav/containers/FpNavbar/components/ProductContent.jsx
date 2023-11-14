/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-component-props */
import React, { useState } from "react";
import { Button } from "antd";
import { getOssUrl } from "metabase/lib/image";
import { MainMenuFunction } from "metabase/nav/containers/FpNavbar/utils/function";
import { ReactIcons } from "../utils/data";
import * as Urls from "../../../../lib/urls";
import Icon from "../../../../components/Icon";
import "../MainMenu.css"

const ProductContent = props => {
  const { name, content } = props;
  const [select, setSelect] = useState("data-api");


  const tabs = [
    {
      name: "DATA API",
      value: "data-api",
      data: {
        // dataApiDescData: {
        //   img: getOssUrl("studio/img-data-api-pic.png"),
        //   title: "Everything you need to build in Web3 can be found here. ",
        // },
        restApiData: {
          topic: "REST API",
          desc: "Free API for Web3 developers",
          link: "https://docs.footprint.network/reference/introduction",
          externalLink: true,
          icon: ReactIcons.refDataApiIcon,
        },
        sqlApiData: {
          topic: "SQL API",
          desc: "A flexible SQL API customization for robust requirements",
          link: "https://docs.footprint.network/reference/web-application-sql-api",
          externalLink: true,
          icon: ReactIcons.nftApiIcon,
        },
        batchDownloadData: {
          topic: "Batch Download",
          desc: "Sync blockchain historical data in one batch",
          link: "/batch-download",
          icon: ReactIcons.transferApiIcon,
        },
      },
    },
    {
      name: "MetaMosaic",
      value: "meta-mosaic",
      data: {
        metamosaic: {
          topic: "MetaMosaic",
          desc: "One-stop turnkey solution for reference data",
          link: "https://www.metamosaic.io/",
          externalLink: true,
          icon: ReactIcons.transactionApiIcon,
          data: [
            {
              title: "Chain Analytics",
              icon: ReactIcons.balanceApiIcon,
              link: "https://www.metamosaic.io/Ethereum",
              externalLink: true,
              desc: "One-stop trusted ecosystem analysis dedicated to chains",
            },
            {
              title: "Contract Tracker",
              icon: ReactIcons.refDataApiIcon,
              link: "https://www.metamosaic.io/Ethereum/contract_tracker",
              externalLink: true,
              desc: "Track newest contracts on chain in minutes",
            }
          ]
        }
      }
    },
    {
      name: "Analytics",
      value: "analytics",
      data: {
        // studioDescData: {
        //   img: getOssUrl("studio/img-studio-pic.png"),
        //   title: "Zero-coding analytics as Tableau for crypto.",
        // },
        analyticsToolData: {
          topic: "Analytics Tool",
          icon: ReactIcons.solutionIcon,
          data: [
            {
              title: "Footprint Datasets",
              icon: ReactIcons.fpDatasetIcon,
              link: "/@Footprint/Footprint-Datasets-Data-Dictionary",
            },
            {
              title: "Create",
              icon: ReactIcons.codingChartIcon,
              link: "/studio/create",
            },
            {
              title: "My Analysis",
              icon: ReactIcons.myDashboardIcon,
              link: "/studio/my-analysis/dashboards",
            }
          ]
        },
        appBuilderData: {
          topic: "Footprint Growth Analytics",
          desc: "A turnkey solution to connect Web2 and Web3 data for enterprises",
          link: "/fga",
          icon: ReactIcons.ownershipApiIcon,
        },
        connectorData: {
          topic: "Data Connector",
          desc: "Seamlessly integrate Web3 and Web2 channels \nwith our data connectors",
          link: "/studio/my-datasets/integration",
          icon: ReactIcons.trendingIcon,
        },
      }
    },
    /*{
      name: "Moon men",
      value: "moon-men",
      link: "/moon-men",
    }*/
  ];

  const renderTabs = (data) => {
    return (
      <div className="main-menu__tabs">
        {data?.map(item => {
          return (
            <Button
              key={item.value}
              type={item.value === select ? "primary" : "text"}
              onClick={() => {
                if (item.value !== "moon-men") {
                  setSelect(item.value);
                  return;
                }
                window.open(item.link);
              }}
            >
              {item.name}
              {item.link ? <Icon name="arrow_right_up" size={16} color="white"/> : null}
            </Button>
          );
        })}
      </div>
    );
  };

  const renderTabContent = tab => {
    const tabData = tabs.find(i => i.value === tab)?.data;
    if (tab === "data-api") {
      return (
        <>
          <div className="ml4 main-menu__data-api-padding">
            {MainMenuFunction.renderVerticalMenu({data: tabData?.restApiData, className: "main-menu__vertical-menu2"})}
            {MainMenuFunction.renderVerticalMenu({data: tabData?.sqlApiData, className: "main-menu__vertical-menu2"})}
            {MainMenuFunction.renderVerticalMenu({data: tabData?.batchDownloadData, className: "main-menu__vertical-menu2"})}
          </div>
        </>
      );
    }
    if (tab === "analytics") {
      return (
        <>
          <div className="ml4 main-menu__data-api-padding">
            {MainMenuFunction.renderVerticalMenu({data: tabData?.analyticsToolData, className: "main-menu__vertical-menu"})}
          </div>
          <div className="ml4 main-menu__data-api-padding-bottom">
            {MainMenuFunction.renderVerticalMenu({data: tabData?.appBuilderData})}
          </div>
          <div className="ml4 main-menu__data-api-padding-bottom">
            {MainMenuFunction.renderVerticalMenu({data: tabData?.connectorData})}
          </div>
        </>
      );
    }
    if (tab === "meta-mosaic") {
      return (
        <>
          <div className="ml4 main-menu__data-api-padding">
            {MainMenuFunction.renderVerticalMenu({data: tabData?.metamosaic, className: "main-menu__vertical-menu main-menu__vertical-menu-single"})}
          </div>
        </>
      );
    }
  };

  return (
    <div className="main-menu__product-content">
      {renderTabs(tabs)}
      <div className="main-menu__line" />
      <div className="main-menu__inner">
        {renderTabContent(select)}
      </div>
    </div>
  );
};

export default ProductContent;
