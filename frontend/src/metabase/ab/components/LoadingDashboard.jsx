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

  const getConnector = () => {
    if ([
      "project_health",
      "project_overlap",
      "nft_summary",
      "nft_sales_mints",
      "listing",
      "gaming_overview",
      "gaming_user",
      "gaming_engagement",
      "gaming_spend",
      "nft_nft_holder",
      "user_profile",
      "project_health-platform",
    ].includes(current_tab)) {
      return "web3";
    }
    if ([
      "gaming_overview",
      "gaming_user",
      "gaming_engagement",
      "gaming_spend",
      "retention",
      "acquisition",
    ].includes(current_tab)) {
      return "web2";
    }
    if (["Funnel",'funnel'].includes(current_tab)) {
      return "Google Analytics";
    }
    return current_tab;
  }

  const connector = getConnector();

  const Setup = (
    <Button
      type="primary"
      onClick={() => {
        if (connector === "web3") {
          router.push("/fga/bind-game");
        } else if (connector === "web2") {
          router.push(getGrowthProjectPath(project.protocolSlug, "integration"));
        } else {
          router.push(getGrowthProjectPath(project.protocolSlug, "integration"));
        }
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
      case "twitter":
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
      case "discord":
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
    case "web3":
      message = `Connect on-chain Data`;
      description = (
        <>
          {Setup}
          <div className="mt2">
            <p>
              Get access to web3 project . Use this data to identify
              any obstacles to grow your business.
            </p>
            You can connect your on-chain Data
          </div>
        </>
      );
      break;
    case "web2":
      message = `Connect off-chain Data`;
      description = (
        <>
          {Setup}
          <div className="mt2">
            <p>
              Get access to web2 data . Use this data to identify
              any obstacles to grow your business.
            </p>
            You can connect your off-chain Data
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
          <Alert message={message} description={description} showIcon />
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
