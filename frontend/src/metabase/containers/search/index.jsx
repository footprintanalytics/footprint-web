/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import "./index.css";
import "../dashboards/index.css";
import "../dashboards/components/Dashboards/index.css";
import "../dashboards/components/News/index.css";
import { compose } from "underscore";
import HotDashboard from "metabase/containers/news/components/HotDashboard";
import MetaViewportControls from "metabase/dashboard/hoc/MetaViewportControls";
import SearchTabs from "./components/Tabs";
import SearchHeader from "./components/SearchHeader";

const Index = ({ router, user }) => {
  const model = router.location.query.model || "dashboard";

  const navigationNumQuery = null;

  return (
    <div className="search">
      <SearchHeader router={router} />
      <div className="search__wrap search__content">
        <SearchTabs
          router={router}
          user={user}
          data={navigationNumQuery?.data}
          model={model}
          location={router.location}
        />
        <div className="search__hot">{<HotDashboard />}</div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

export default compose(connect(mapStateToProps), MetaViewportControls)(Index);
