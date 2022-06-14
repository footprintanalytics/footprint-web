/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import "../../../search/index.css";
import "./list.css";
import "../../../dashboards/index.css";
import "../../../dashboards/components/Dashboards/index.css";
import SearchTabs from "metabase/containers/search/components/Tabs";

const List = ({ router, user, name }) => {
  const model = router.location.query.model || "dashboard";

  const navigationNumQuery = null;

  return (
    <div className="search" data-nosnippet>
      <div className="search__wrap search__content">
        <SearchTabs
          router={router}
          user={user}
          name={name}
          data={navigationNumQuery?.data}
          model={model}
          location={router.location}
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

export default connect(mapStateToProps)(List);
