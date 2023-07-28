/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-component-props */
import React, { useState } from "react";
import { Button } from "antd";
import { getOssUrl } from "metabase/lib/image";
import { MainMenuFunction } from "metabase/nav/containers/FpNavbar/utils/function";
import { ReactIcons } from "../utils/data";
import * as Urls from "../../../../lib/urls";

const ProductContent = props => {
  const { name, content } = props;
  const [select, setSelect] = useState("data-api");


  const tabs = [
    {
      name: "DATA API",
      value: "data-api",
      data: {
        dataApiDescData: {
          img: getOssUrl("studio/img-data-api-pic.png"),
          title: "Everything you need to build in Web3 can be found here. ",
        },
        restApiData: {
          topic: "REST API",
          desc: "One unified API for Web3 developers",
          data: [
            {
              title: "Balance API",
              desc: "Get native, token, and NFT balances by wallet address.",
              link: "https://docs.footprint.network/reference/get_v3-address-getwalletnativetokenbalance",
              icon: ReactIcons.balanceApiIcon,
              externalLink: true,
            },
            {
              title: "Transaction API",
              desc: "Get real-time transactions data for 27+ chains at your fingertips.",
              link: "https://docs.footprint.network/reference/get_v2-chain-transactions",
              icon: ReactIcons.transactionApiIcon,
              externalLink: true,
            },
            {
              title: "Transfer API",
              desc: "Get real-time token transfers data for 27+ chains with one line code.",
              link: "https://docs.footprint.network/reference/get_v2-token-transfers",
              icon: ReactIcons.transferApiIcon,
              externalLink: true,
            },
            {
              title: "Ownership API",
              desc: "Identify the owner of an NFT in just a single API call.",
              link: "https://docs.footprint.network/reference/get_v2-nft-collection-owners",
              icon: ReactIcons.ownershipApiIcon,
              externalLink: true,
            },
            {
              title: "NFT API",
              desc: "Get multichain NFT transfers, metadata,price and more.",
              link: "https://docs.footprint.network/reference/get_v2-nft-collection-info",
              icon: ReactIcons.nftApiIcon,
              externalLink: true,
            },
            {
              title: "Money Flow API",
              desc: "Coming soon",
              link: "",
              icon: ReactIcons.moneyFlowIcon,
            },
            {
              title: "Reference Data API",
              desc: "Coming soon",
              link: "",
              icon: ReactIcons.refDataApiIcon,
            },
          ],
        },
        sqlApiData: {
          topic: "SQL API",
          desc: "A flexible SQL API customization for robust requirements",
          link: "https://docs.footprint.network/reference/web-application-sql-api",
          externalLink: true,
        },
        batchDownloadData: {
          topic: "Batch Download",
          desc: "A flexible SQL API customization for robust requirements",
          link: "/batch-download",
        },
      },
    },
    {
      name: "Analytics Studio",
      value: "analytics-studio",
      data: {
        studioDescData: {
          img: getOssUrl("studio/img-studio-pic.png"),
          title: "0- coding analytics as Tableau for crypto.",
        },
        analyticsToolData: {
          topic: "Analytics Tool",
          data: [
            {
              title: "Footprint Datasets",
              icon: ReactIcons.fpDatasetIcon,
              link: "/studio/footprint-datasets",
            }
          ]
        },
        createData: {
          desc: "CREATE",
          data: [
            {
              title: "0-coding chart",
              icon: ReactIcons.codingChartIcon,
              link: Urls.newQuestion({ type: "query" }),
            },
            {
              title: "SQL chart",
              icon: ReactIcons.sqlChartIcon,
              link: Urls.newQuestion({ type: "native", creationType: "native_question" }),
            },
            {
              title: "New dashboard",
              icon: ReactIcons.newDashboardIcon,
              link: "dashboard/new#from=studio",
            },
          ]
        },
        myAnalysisData: {
          desc: "MY ANALYSIS",
          data: [
            {
              title: "My dashboards",
              icon: ReactIcons.myDashboardIcon,
              link: "/studio/my-analysis/dashboards",
            },
            {
              title: "My charts",
              icon: ReactIcons.myChartIcon,
              link: "/studio/my-analysis/charts",
            }
          ]
        },
        connectorData: {
          topic: "Data Connector",
          desc: "Coming soon",
          // link: "/studio/my-datasets/integration",
        },
        appBuilderData: {
          topic: "No-coding App Builder",
          desc: "Coming soon",
        },
      }
    }
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
                setSelect(item.value);
              }}
            >
              {item.name}
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
          <div className="main-menu__inner-data-api-left">
            {MainMenuFunction.renderStandardImageText({data: tabData?.dataApiDescData})}
          </div>
          <div className="ml4 main-menu__data-api-padding">
            {MainMenuFunction.renderVerticalMenu({data: tabData?.restApiData})}
          </div>
          <div className="ml3 main-menu__data-api-padding">
            {MainMenuFunction.renderVerticalMenu({data: tabData?.sqlApiData})}
            {MainMenuFunction.renderVerticalMenu({data: tabData?.batchDownloadData, className: "mt4"})}
          </div>
        </>
      );
    }
    if (tab === "analytics-studio") {
      return (
        <>
          <div className="main-menu__inner-data-api-left">
            {MainMenuFunction.renderStandardImageText({data: tabData?.studioDescData})}
          </div>
          <div className="ml4 main-menu__data-api-padding">
            {MainMenuFunction.renderVerticalMenu({data: tabData?.analyticsToolData})}
            {MainMenuFunction.renderVerticalMenu({data: tabData?.createData, className: "mt2"})}
            {MainMenuFunction.renderVerticalMenu({data: tabData?.myAnalysisData, className: "mt2"})}
          </div>
          <div className="ml3 main-menu__data-api-padding">
            {MainMenuFunction.renderVerticalMenu({data: tabData?.connectorData})}
            {MainMenuFunction.renderVerticalMenu({data: tabData?.appBuilderData, className: "mt4"})}
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
