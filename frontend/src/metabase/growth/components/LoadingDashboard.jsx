/* eslint-disable react/prop-types */
import React from "react";
import { Alert, Card, Typography, Button } from "antd";
import { useQuery } from "react-query";
import { GetFgaConnectorJob } from "metabase/new-service";
import { getGrowthProjectPath } from "../utils/utils";

const LoadingDashboard = ({
  sourceDefinitionId,
  router,
  project,
  projectId,
  current_tab,
  children,
}) => {
  const { data } = useQuery(
    ["GetFgaConnectorJob", projectId, sourceDefinitionId],
    async () => GetFgaConnectorJob({ projectId, sourceDefinitionId }),
    {
      refetchInterval: data => (data?.status === "succeeded" ? false : 10000),
      enabled: !!sourceDefinitionId,
    },
  );

  const connector =
    current_tab === "User Funnel" ? "Google Analytics" : current_tab;

  const Setup = (
    <Button
      type="primary"
      onClick={() => {
        router.push(getGrowthProjectPath(project.protocolSlug, "Connector"));
      }}
    >
      Set up
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

  if (!sourceDefinitionId) {
    return (
      <div style={{ padding: 20 }}>
        <Card title={current_tab}>
          <Alert
            message={message}
            description={description}
            showIcon
          />
        </Card>
      </div>
    );
  } else if (
    sourceDefinitionId &&
    data?.status !== "succeeded" &&
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
