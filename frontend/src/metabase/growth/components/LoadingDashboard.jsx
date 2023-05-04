/* eslint-disable react/prop-types */
import React from "react";
import { Alert, Card, Typography, Button } from "antd";
import { useQuery } from "react-query";
import { GetFgaConnectorJob } from "metabase/new-service";
import { getGrowthProjectPath } from "../utils/utils";
// connector type : twitter, google_analytics, discord
const LoadingDashboard = ({
  fgaConnectorId,
  router,
  project,
  projectId,
  current_tab,
  children,
  type = "twitter",
}) => {
  // status :  "succeeded" | "failed" | "running"
  // twitter : twitter_tweet_metrics | user_details
  // google_analytics : google_analytics_metrics
  // discord : members | messages
  const { data } = useQuery(
    ["GetFgaConnectorJob", projectId, fgaConnectorId],
    async () => GetFgaConnectorJob({ projectId, fgaConnectorId }),
    {
      refetchInterval: data =>
        getDataStatus(data) === "succeeded" || getDataStatus(data) === "failed"
          ? false
          : 10000,
      enabled: !!fgaConnectorId,
    },
  );

  function getDataStatus(data) {
    switch (type) {
      case "twitter":
        return data?.twitter?.twitter_tweet_metrics?.status;
      case "discord":
        return data?.discord?.members?.status;
      case "funnel":
        // TODO: add funnel: need complete backend
        return data?.ga?.status;
    }
  }

  const connector = current_tab === "Funnel" ? "Google Analytics" : current_tab;

  const Setup = (
    <Button
      type="primary"
      onClick={() => {
        router.push(getGrowthProjectPath(project.protocolSlug, "Connector"));
      }}
    >
      Set up now
    </Button>
  );

  let message = ``;
  let description = ``;

  switch (connector) {
    case "Google Analytics":
      message = `Connect Google Analytics`;
      description = (
        <>
          {Setup}
          <div className="mt2">
            <p>
              Get access to the entire user journey. Use this data to identify
              any obstacles to grow your business.
            </p>
            When you connect your Google Analytics account, you can:
            <ul style={{ listStyle: "inside" }}>
              <li>See Google data in Footprint GA.</li>
              <li>
                See user funnel, from page view to connect wallet,optimize.
              </li>
              <li>
                Get a full user profile, track both off-chain behaviors and
                on-chain transactions.
              </li>
            </ul>
          </div>
        </>
      );
      break;
    case "Twitter":
      message = `Connect Twitter data`;
      description = (
        <>
          {Setup}
          <div className="mt2">
            <p>
              Get access to social media engagement. Use this data to identify
              any obstacles to grow your business.
            </p>
            When you connect your Twitter, you can:
            <ul style={{ listStyle: "inside" }}>
              <li>See Twitter followers data in Footprint GA.</li>
              <li>
                See Twitter engagement analysis, including followers, tweets.
              </li>
              <li>
                Gain insights into the impact of social media engagement on
                project operations and token / NFT prices.
              </li>
            </ul>
          </div>
        </>
      );
      break;
    case "Discord":
      message = `Connect Discord data`;
      description = (
        <>
          {Setup}
          <div className="mt2">
            <p>
              Get access to social media engagement. Use this data to identify
              any obstacles to grow your business.
            </p>
            When you connect your Discord, you can:
            <ul style={{ listStyle: "inside" }}>
              <li>See Discord members data in Footprint GA.</li>
              <li>
                See Discord engagement analysis, including active members,
                channels.
              </li>
              <li>
                Gain insights into the impact of social media engagement on
                project operations and token / NFT prices.
              </li>
            </ul>
          </div>
        </>
      );
      break;
    default:
      break;
  }

  if (!fgaConnectorId) {
    return (
      <div style={{ padding: 20 }}>
        <Card title={current_tab}>
          <Alert message={message} description={description} showIcon />
        </Card>
      </div>
    );
  } else if (fgaConnectorId && getDataStatus(data) === "failed") {
    <div style={{ padding: 20 }}>
      <Card title={current_tab}>
        <Alert
          message="Load data failed."
          description="Failed to load data, please check your connector config or contact us"
          type="error"
          showIcon
        />
      </Card>
    </div>;
  } else if (
    fgaConnectorId &&
    getDataStatus(data) !== "succeeded" &&
    project.twitter_handler !== "Footprint_Data"
  ) {
    return (
      <div style={{ padding: 20 }}>
        <Card title={current_tab}>
          <Alert
            message="Loading data, please wait..."
            description="This may take a few minutes or a few hours, depending on the amount of data. Thank you for your patience."
            type="info"
            showIcon
          />
        </Card>
      </div>
    );
  } else {
    return children;
  }
};

export default LoadingDashboard;
