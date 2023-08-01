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
      gamefiData: {
        title: "GameFi Data as a Service",
        data: [
          {
            title: "Solution",
            link: "https://docs.google.com/presentation/d/1HO_wAM2835yOoHdib1nAS9Qrf4XR15pm8VHOUBl-SGE/edit#slide=id.g25866ee599b_0_215",
            externalLink: true,
            icon: ReactIcons.solutionIcon2,
          },
          {
            title: "Use case",
            link: "https://docs.footprint.network/docs/how-to-build-a-gamefi-analytics-app",
            externalLink: true,
            icon: ReactIcons.useCaseIcon,
          },
          {
            title: "How to onboard",
            link: "https://docs.footprint.network/docs/game-developer-onboard",
            externalLink: true,
            icon: ReactIcons.onBoardIcon,
          },
        ],
      },
      researchData: {
        title: "Research Data as a Service",
        data: [
          {
            title: "Solution",
            link: "https://docs.google.com/presentation/d/1ScCt50CX9vVkD-pl5Rzg7g25LSz0ugaIToXzG9WI2B8/edit#slide=id.g25c23df782d_0_0",
            externalLink: true,
            icon: ReactIcons.solutionIcon2,
          },
        ],
      },
      growthData: {
        title: "Growth Tool Data Solution",
        data: [
          {
            title: "Solution",
            link: "https://docs.google.com/presentation/d/1HO_wAM2835yOoHdib1nAS9Qrf4XR15pm8VHOUBl-SGE/edit#slide=id.g25866ee599b_0_215",
            externalLink: true,
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
          {MainMenuFunction.renderVerticalMenu({ data: tabData?.gamefiData })}
          {MainMenuFunction.renderVerticalMenu({ data: tabData?.researchData })}
          {/*{MainMenuFunction.renderVerticalMenu({ data: tabData?.growthData })}*/}
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
