/* eslint-disable react/prop-types */
import React from "react";
import { relatedDashboard } from "metabase/new-service";
import { useQuery } from "react-query";
import "./RelatedDashboard.css";
import List from "metabase/containers/dashboards/components/Recommendations/List";
import "metabase/containers/dashboards/components/Recommendations/index.css";
import getIn from "redux-form/es/structure/plain/getIn";
import HotList from "metabase/containers/dashboards/components/Dashboards/HotList";

const RelatedDashboard = ({
  dashboardId,
  title,
  entityKey,
  router,
  type = "list",
}) => {
  const { data } = useQuery(
    "relatedDashboard",
    async () =>
      relatedDashboard({
        dashboardId,
      }),
    {
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  const getData = () => {
    return (
      getIn(data, [entityKey])?.map(item => {
        return {
          ...item,
          mode: "dashboard",
          modelId: item?.id,
        };
      }) || []
    );
  };

  if (getData().length === 0) {
    return null;
  }

  return (
    <div className="relative-dashboard__wrap">
      <h2 className="relative-dashboard__title">{title}</h2>
      {type === "box" && (
        <List
          recommends={getData()}
          target="_blank"
          gaCategory="related-dashboard"
        />
      )}
      {type === "list" && (
        <HotList
          router={router}
          data={{ data: getData() }}
          gaCategory="related-dashboard"
        />
      )}
    </div>
  );
};

export default RelatedDashboard;
