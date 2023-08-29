/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-component-props */
import React from "react";
import { MainMenuFunction } from "metabase/nav/containers/FpNavbar/utils/function";

const SimpleContent = props => {
  const { title, menu, rootClassName, innerClassName, verticalMenuClassName } = props;
  const renderTabContent = () => {
    return (
      <div className={innerClassName || "main-menu__inner-layout"}>
        {MainMenuFunction.renderVerticalMenuSimple({data: { title, data: menu }, className: verticalMenuClassName })}
      </div>
    );
  };

  return (
    <div className={rootClassName || "main-menu__single-content"}>
      <div className="main-menu__inner">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SimpleContent;
