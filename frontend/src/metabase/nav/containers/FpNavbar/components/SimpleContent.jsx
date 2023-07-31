/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-component-props */
import React from "react";
import { MainMenuFunction } from "metabase/nav/containers/FpNavbar/utils/function";

const SimpleContent = props => {
  const { title, menu } = props;
  const renderTabContent = () => {
    return (
      <div className="main-menu__inner-layout">
        {MainMenuFunction.renderVerticalMenu({data: { title, data: menu }})}
      </div>
    );
  };

  return (
    <div className="main-menu__single-content">
      <div className="main-menu__inner">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SimpleContent;
