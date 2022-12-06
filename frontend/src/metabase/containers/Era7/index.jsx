/* eslint-disable react/prop-types */
import React from "react";
import "./index.css";
import { useQuery } from "react-query";
import { publicDashboard } from "metabase/new-service";
import { QUERY_OPTIONS_NORMAL } from "metabase/containers/dashboards/shared/config";
import ChartRender from "metabase/containers/Era7/components/ChartRender";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { connect } from "react-redux";

const Era7 = ({ uuid }) => {
  const public_uuid = uuid;

  const params = {};
  const { isLoading, data, error } = useQuery(
    ["publicDashboard", public_uuid, params],
    async () => {
      return await publicDashboard(public_uuid, params);
    },
    QUERY_OPTIONS_NORMAL,
  );

  if (!uuid || error) {
    return (
      <div className="flex justify-center mt4">
        Url error, please contact the administrator
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <div className="min-widget">
      {data?.ordered_cards
        ?.sort((a, b) => a.col - b.col)
        ?.map(card => {
          return <ChartRender key={card?.id} card={card} public_uuid={public_uuid}/>;
        })}
      <img
        src="https://statichk.footprint.network/img_nav_logo_v5.svg"
        width={188}
        height={28}
      />
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    uuid: props.params.uuid,
  };
};

export default connect(mapStateToProps, null)(Era7);
