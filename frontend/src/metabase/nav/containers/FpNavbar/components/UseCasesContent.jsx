/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-component-props */
import React, { useState } from "react";
import { MainMenuFunction } from "metabase/nav/containers/FpNavbar/utils/function";
import { ReactIcons } from "../utils/data";

const UseCasesContent = props => {
  const { name, content } = props;
  const [select, setSelect] = useState("data-api");


  const tabs = [
    {
      chain: {
        title: "Chain",
        data: [
          {
            title: "Chain Ecosystem Monitor Solution",
            link: "https://docs.google.com/presentation/d/1vKXAHaKqp7oUBnQP1qxmr84WpFX1pmXChGIl6R9Fle4/edit#slide=id.g128e0ee6714_0_0",
            icon: ReactIcons.chainOverviewIcon,
            externalLink: true,
          },
        ],
      },
      gamefiData: {
        title: "Crypto Games",
        data: [
          {
            title: "Crypto Games Solution",
            link: "https://docs.google.com/presentation/d/1G1E6MYAEo6X2KUXC4GBaJFcwH-fxmqGt9xjSIO6XxuE/edit#slide=id.g25866ee599b_0_215",
            externalLink: true,
            icon: ReactIcons.solutionIcon2,
          },
          {
            title: "Crypto Games Use Cases",
            link: "https://docs.footprint.network/docs/how-to-build-a-gamefi-analytics-app",
            externalLink: true,
            icon: ReactIcons.useCaseIcon,
          },
          {
            title: "Onboard Your Game",
            link: "https://docs.footprint.network/docs/game-developer-onboard",
            externalLink: true,
            icon: ReactIcons.onBoardIcon,
          },
        ],
      },
      researchData: {
        title: "Research",
        data: [
          {
            title: "Analyst Solution",
            link: "https://docs.google.com/presentation/d/1ScCt50CX9vVkD-pl5Rzg7g25LSz0ugaIToXzG9WI2B8/edit#slide=id.g25c23df782d_0_0",
            externalLink: true,
            icon: ReactIcons.solutionIcon2,
          },
        ],
      },
      growthData: {
        title: "Growth Tools",
        data: [
          {
            title: "Growth Tools Solution",
            link: "https://docs.google.com/presentation/d/1UXiE1dvMIKhsUHwwVpzixc4v7lVHJNzG3WIYgpfw0AU/edit#slide=id.g25c23df782d_0_0",
            externalLink: true,
            icon: ReactIcons.solutionIcon2,
          },
        ],
      },
    },
  ];

  const renderTabContent = () => {
    const tabData = tabs[0];
    return (
      <>
        <div className="main-menu__inner-layout">
          {MainMenuFunction.renderVerticalMenu({ data: tabData?.chain })}
          {MainMenuFunction.renderVerticalMenu({ data: tabData?.gamefiData })}
          {MainMenuFunction.renderVerticalMenu({ data: tabData?.researchData })}
          {MainMenuFunction.renderVerticalMenu({ data: tabData?.growthData })}
        </div>
      </>
    );
  };

  return (
    <div className="main-menu__use-cases-content">
      <div className="main-menu__inner">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default UseCasesContent;
