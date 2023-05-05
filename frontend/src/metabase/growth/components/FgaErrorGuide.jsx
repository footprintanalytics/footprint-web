/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { Button, Result, Avatar, Image, Alert } from "antd";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { useQuery } from "react-query";
import { getUser, getFgaProject } from "metabase/selectors/user";
import Link from "metabase/core/components/Link";
import { trackStructEvent } from "metabase/lib/analytics";
import { GetFgaConnectorJob } from "metabase/new-service";
import { getGrowthProjectPath } from "../utils/utils";

const FgaErrorGuide = ({
  router,
  project,
  menu,
  tips,
  projectObject,
  cardName,
  cardId,
  connectorType,
}) => {
  // status :  "succeeded" | "failed" | "running"
  // twitter : twitter_tweet_metrics | user_detail
  // google_analytics : events_daily
  // discord : members | messages
  const twitterMap = new Map();
  twitterMap.set("Twitter Followers", "user_detail");
  twitterMap.set("Twitter Followers Info", "follower_details");
  twitterMap.set("Current Followers", "user_detail");
  twitterMap.set("Net In Followers", "user_detail");
  twitterMap.set("Twitter Engagement Rate", "twitter_tweet_metrics");
  twitterMap.set("Twitter Engagement Acitivities", "twitter_tweet_metrics");

  const discordMap = new Map();
  discordMap.set("Current Discord members", "members");
  discordMap.set("Net Discord Members", "members");
  discordMap.set("Discord Engagement Rate", "messages");
  discordMap.set("Discord Daily Member Data", "members");
  discordMap.set("Discord Daily Engagement Data", "messages");
  discordMap.set("Discord Daily Retention", "members");
  discordMap.set("Discord Members Info", "members");

  const gaMap = new Map();
  gaMap.set("User Funnel", "events_daily");
  gaMap.set("User Flow", "events_daily");
  gaMap.set("GameFi - Weekly Retention Analysis - FGA", "events_daily");

  function getMap() {
    return connectorType === "twitter"
      ? twitterMap
      : connectorType === "discord"
      ? discordMap
      : gaMap;
  }

  const [fgaConnectorId, setFgaConnectorId] = React.useState(null);
  const [stream, setStream] = React.useState(null);

  useEffect(() => {
    if (projectObject) {
      const tempStream = getMap().get(cardName);
      setStream(tempStream);
      const tempFgaConnectorId = projectObject?.[connectorType]?.fgaConnectorId;
      if (tempFgaConnectorId) {
        setFgaConnectorId(tempFgaConnectorId);
      } else {
        setAlertDescription(
          <div className=" text-center items-center flex flex-col">
            <div style={{ paddingBottom: 10, textAlign: "center" }}>
              You have not configured the corresponding connector yet.
            </div>
            <Button
              size="small"
              type="primary"
              style={{ borderRadius: 4 }}
              onClick={() => {
                router.push(getGrowthProjectPath(project, "Connector"));
              }}
            >
              Set up now
            </Button>
          </div>,
        );
      }
    }
  }, [projectObject]);

  const { data } = useQuery(
    ["GetFgaConnectorJob", projectObject?.id, fgaConnectorId],
    async () =>
      GetFgaConnectorJob({ projectId: projectObject?.id, fgaConnectorId }),
    {
      refetchInterval: data =>
        getDataStatus(data) === "succeeded" || getDataStatus(data) === "failed"
          ? false
          : 10000,
      enabled: !!fgaConnectorId,
      staleTime: 9000,
    },
  );
  const [alertDescription, setAlertDescription] = React.useState(null);
  useEffect(() => {
    if (data) {
      console.log(
        "FgaErrorGuide data",
        { connectorType, stream, status: getDataStatus(data) },
        data,
      );
      switch (getDataStatus(data)) {
        case "succeeded":
          setAlertDescription(
            <div className=" text-center items-center flex flex-col">
              <div style={{ paddingBottom: 5, textAlign: "center" }}>
                Task execution successful, but it seems like there is no data.
                You can either wait for a while or contact the community support
                for further assistance.
              </div>
              <Link
                to="https://discord.gg/3HYaR6USM7"
                target="_blank"
                onClick={() => trackStructEvent(`error-guide-report-${cardId}`)}
              >
                Report to community
              </Link>
            </div>,
          );
          break;
        case "running":
          setAlertDescription(
            <div className=" text-center items-center flex flex-col">
              <div style={{ paddingBottom: 5, textAlign: "center" }}>
                This may take a few minutes or a few hours, depending on the
                amount of data. Thank you for your patience.
              </div>
              <Button size="small" type="text" loading={true}>
                Loading data, please wait...
              </Button>
            </div>,
          );
          break;
        case "failed":
        default:
          setAlertDescription(
            <div className=" text-center items-center flex flex-col">
              <div style={{ paddingBottom: 5, textAlign: "center" }}>
                Task execution failed. Please contact the administrator for
                assistance.
              </div>
              <Link
                to="https://discord.gg/3HYaR6USM7"
                target="_blank"
                onClick={() => trackStructEvent(`error-guide-report-${cardId}`)}
              >
                Report to community
              </Link>
            </div>,
          );
          break;
      }
    }
  }, [data]);

  function getDataStatus(data) {
    return data?.[connectorType]?.[stream]?.status;
  }

  return (
    <div
      style={{
        display: "flex",
        padding: 0,
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Alert
        description={alertDescription}
        // description="There is no data available. However, if you have configured the connector, you can gain valuable insights about your users."
        type="info"
        style={{
          maxWidth: 600,
          margin: "auto",
          // paddingTop: 20,
          // paddingBottom: 20,
          textAlign: "left",
        }}
        showIcon={false}
        // closable
      />
      {/* <Result
        style={{ margin: 0, padding: 1 }}
        icon={null}
        // icon={
        //   <Image
        //     preview={false}
        //     style={{
        //       height: "30%",
        //       width: "30%",
        //       minHeight: 15,
        //       minWidth: 25,
        //       maxHeight: 250,
        //       maxWidth: 300,
        //     }}
        //     src={
        //       "https://footprint-imgs.oss-us-east-1.aliyuncs.com/no-data01.svg"
        //     }
        //   />
        // }
        // title="There is currently no data available for this project."
        subTitle="There is no data available. However, if you have configured the connector, you can gain valuable insights about your users."
        extra={
          <Button
            type="primary"
            size="small"
            style={{ borderRadius: 4 }}
            onClick={() => {
              router.push(getGrowthProjectPath(project, "Connector"));
            }}
          >
            Set up now
          </Button>
        }
      /> */}
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectObject: getFgaProject(state),
    project: props.params.project,
    menu: props.params.menu,
  };
};

export default withRouter(connect(mapStateToProps)(FgaErrorGuide));
