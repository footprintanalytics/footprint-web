/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React from "react";
import { Card, Empty, Skeleton } from "antd";
import LazyLoad from "../../routesLazyLoad";
import { ExploreNoCache } from "metabase/containers/explore";
import My from "metabase/containers/my";
import DashboardUploadData from "./DashboardUploadData";
import { isDemo } from "../utils/dashboard";

const DashboardContent = ({
  router,
  userId,
  commonSubMenu,
  userMenu,
  findUserDashboard,
  location,
}) => {
  if (commonSubMenu) {
    if (commonSubMenu.type === "mine") {
      return isDemo() ? (
        <ExploreNoCache location={location} q="undefined" hideSearch={true} />
      ) : (
        <My location={location} />
      );
    }
    if (commonSubMenu.type === "explore") {
      // const q = userMenu?.protocolName?.value || "";
      return (
        <ExploreNoCache location={location} q="undefined" hideSearch={true} />
      );
    }
    if (commonSubMenu.type === "upload") {
      return <DashboardUploadData router={router} userId={userId} />;
    }
  }

  const { loading, data } = findUserDashboard;
  if (loading || !data) return <Skeleton active />;

  return (
    <Card
      className="defi-full-content"
      bodyStyle={{ padding: 0 }}
      bordered={false}
    >
      {!data || !data.indicator_user_dashboard.length || !userMenu ? (
        <div className="defi-empty">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : (
        <LazyLoad.PublicDashboard
          params={{ uuid: userMenu.secondAndThirdLevel?.uuid }}
          location={{
            ...location,
            query: userMenu?.secondAndThirdLevel?.params
              ? JSON.parse(
                  userMenu.secondAndThirdLevel.params.replaceAll("=", ":"),
                )
              : {},
          }}
          key={userMenu.secondAndThirdLevel?.uuid}
        />
      )}
    </Card>
  );
};

export default DashboardContent;
