/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useQuery } from "react-query";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { getUser } from "metabase/selectors/user";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { dashboardIdInfo } from "metabase/new-service";
import { parseHashOptions } from "metabase/lib/browser"

const WrapDashboard = props => {
  const { router, location, children, user, name, dashboardName } = props;
  const type = parseHashOptions(location.hash).type;

  const { isLoading, data } = useQuery(
    ["dashboardIdInfo", name, dashboardName],
    async () => {
      return await dashboardIdInfo({
        dashboardName: encodeURIComponent(dashboardName),
        userName: name,
      });
    },
    {...QUERY_OPTIONS,enabled: type !== "dashboard"},
  );
  useEffect(() => {
    if (!isLoading && data?.uuid) {
      router.replace({
        pathname: `/ab/public/dashboard/${data?.uuid}`,
        query: router?.location?.query,
      });
    }
  }, [isLoading]);

  if(type === "dashboard") {
    location.pathname = location.pathname.replace("/ab", "/ab/dashboard");
    console.log('WrapDashboard to dashboard',location);
    router.replace(location);
    return <></>
  }
  return (
    <div className="flex flex-column items-center">
      <LoadingSpinner message="Loading..." />
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    dashboardName: props.params.dashboardName,
    name: props.params.name,
  };
};

export default connect(mapStateToProps)(WrapDashboard);
