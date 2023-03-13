/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import TemplateGallery from "./TemplateGallery";
import MyFavoriteTemplate from "./MyFavoriteTemplate";

const CustomAnalysis = props => {
  const { router, location, children, user } = props;
  const tabs = [
    {
      label: `Template Gallery`,
      key: `TemplateGallery`,
    },
    {
      label: `My Favorite`,
      key: `MyFavorite`,
    },
  ];
  const [currentTab, setCurrentTab] = useState("TemplateGallery");
  const getTabPanel = tab => {
    switch (tab) {
      case "TemplateGallery":
        return (
          <TemplateGallery
            currentTab={currentTab}
            location={location}
            router={router}
          ></TemplateGallery>
        );
      case "MyFavorite":
        return (
          <MyFavoriteTemplate
            currentTab={currentTab}
            location={location}
            router={router}
          ></MyFavoriteTemplate>
        );
    }
  };
  return (
    <div className="flex flex-column items-center">
      {/* <Tabs
        defaultActiveKey={currentTab}
        centered
        style={{ width: 800 }}
        items={tabs}
        onChange={value => {
          console.log("Tabs onchange", value);
          setCurrentTab(value);
        }}
      /> */}
      {getTabPanel(currentTab)}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(CustomAnalysis);
