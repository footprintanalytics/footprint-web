/* eslint-disable react/prop-types */
import React from "react";
import { useQuery } from "react-query";
import { publicDashboardChartData } from "metabase/new-service";
import { QUERY_OPTIONS_NORMAL } from "metabase/containers/dashboards/shared/config";
import ScalarRender from "metabase/containers/WidgetPublic/components/ScalarRender";
import LineRender from "metabase/containers/WidgetPublic/components/LineRender";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { get } from "lodash";

const ChartRender = ({ card, public_uuid }) => {
  const params = {};
  const cardId = card?.card_id || "";

  const name = get(get(card, "visualization_settings"), "card.title") || card?.card?.name
  
  const { isLoading, data } = useQuery(
    ["publicDashboard", public_uuid, cardId, params],
    async () => {
      return await publicDashboardChartData(public_uuid, cardId, params);
    },
    QUERY_OPTIONS_NORMAL,
  );

  const renderItem = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (card.card.display === "scalar") {
      return <ScalarRender data={data} />;
    }
    if (card.card.display === "line") {
      return <LineRender data={data} />;
    }
    if (card.card.display === "bar") {
      return <LineRender data={data} type="bar" />;
    }
  };

  return (
    <div className="min-widget__item">
      <span>{name}</span>
      <div className="min-widget__item-inner">{renderItem()}</div>
    </div>
  );
};

export default ChartRender;
