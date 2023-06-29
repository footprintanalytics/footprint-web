/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import "../../../search/index.css";
import "./list.css";
import "../../../dashboards/index.css";
import "../../../dashboards/components/Dashboards/index.css";
import { useQuery } from "react-query";
import SearchTabs from "metabase/containers/search/components/Tabs";
import { navigationNum } from "metabase/new-service";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { isFgaPath } from "metabase/growth/utils/utils";

const List = ({
  router,
  user,
  name,
  showTabs,
  defaultModel = "all",
  hideTabsBar,
}) => {
  const isFavoritesTab = router.location.query.model === "favorite";
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
    <div
      className="search"
      data-nosnippet
      style={{ background: isFgaPath() ? "#121728" : "" }}
    >
      <div
        className="search__wrap search__content"
        style={{ alignItems: "center" ,flexDirection: "column"}}
      >
        <SearchTabs
          router={router}
          user={user}
          name={name}
          data={navigationNumQuery?.data}
          model={model}
          location={router.location}
          showTabs={showTabs}
          hideTabsBar={hideTabsBar}
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
