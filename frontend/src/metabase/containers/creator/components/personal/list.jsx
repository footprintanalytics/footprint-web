/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import "../../../search/index.css";
import "./list.css";
import "../../../dashboards/index.css";
import "../../../dashboards/components/Dashboards/index.css";
import SearchTabs from "metabase/containers/search/components/Tabs";
import { useQuery } from "react-query";
import { navigationNum } from "metabase/new-service";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";

const List = ({ router, user, name }) => {
  const isFavoritesTab = router.location.query.model === "favorites";
  const defaultModel = "all";
  const model =
    user || !isFavoritesTab
      ? router.location.query.model || defaultModel
      : defaultModel;

  const navigationNumQuery = useQuery(
    ["navigationNum", name],
    async () => {
      return await navigationNum({
        project: "footprint",
        qs: [],
        name: name,
      });
    },
    { ...QUERY_OPTIONS, retry: 0 },
  );

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
