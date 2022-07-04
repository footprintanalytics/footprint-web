/* eslint-disable react/prop-types */
import React from "react";
import { push } from "react-router-redux";
import connect from "react-redux/lib/connect/connect";
import { getChannel } from "metabase/selectors/app";
import "../index.css";
import "../../academy/index.css";
import "../../dashboards/components/Recommendations/index.css";
import Box from "metabase/containers/academy/components/Box";
import ArticleHot from "metabase/containers/news/components/ArticleHot";

const Index = ({ router }) => {
  const selectCategory = {
    label: "Reports",
    value: "Reports",
    subMenus: [
      { label: "Daily News", value: "Daily News" },
      { label: "Weekly Reports", value: "Weekly Reports" },
      { label: "Monthly Reports", value: "Monthly Reports" },
      { label: "Yearly Reports", value: "Yearly Reports" },
    ],
  };
  return (
    <div className="news-articles__container news-report__container">
      <Box router={router} selectCategory={selectCategory} />
      <ArticleHot />
    </div>
  );
};
``;

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser,
    channel: getChannel(state, props),
  };
};

const mapDispatchToProps = {
  onChangeLocation: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
