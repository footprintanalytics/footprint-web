/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  Descriptions,
  Empty,
  Alert,
  message,
  Typography,
  Breadcrumb,
  Space,
} from "antd";
import dayjs from "dayjs";
import CopyToClipboard from "react-copy-to-clipboard";
import { useQuery } from "react-query";
import PublicDashboard from "metabase/public/containers/PublicDashboard";
import "../css/utils.css";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { getUser } from "metabase/selectors/user";
import { getCampaignDetail } from "metabase/new-service";
import { parseHashOptions } from "metabase/lib/browser";
import CampaignStatus from "../components/CampaignStatus";
import { getGrowthProjectPath } from "../utils/utils";

const CampaignDetail = props => {
  const { location, router, project, projectPath } = props;
  const id = parseHashOptions(location.hash).id;
  const { isLoading, data } = useQuery(
    ["getCampaignDetail", id],
    async () => {
      if (id) {
        return await getCampaignDetail({ id });
      }
    },
    QUERY_OPTIONS,
  );
  const preProtocolSlug = useRef(null);
  useEffect(() => {
    if (
      projectPath &&
      preProtocolSlug.current &&
      preProtocolSlug.current !== projectPath
    ) {
      router?.push({
        pathname: getGrowthProjectPath(projectPath, "Campaign"),
      });
    }
    preProtocolSlug.current = projectPath;
  }, [projectPath]);

  let botInviteUrl = null;
  let botInitCmd = null;
  let tweetTrackingURL = null;
  let channel_type = [];
  data?.channels?.map?.(channel => {
    channel_type.push(channel?.channelName);
    if (channel?.details?.botInviteUrl) {
      botInviteUrl = channel?.details?.botInviteUrl;
    }
    if (channel?.details?.botInitCmd) {
      botInitCmd = channel?.details?.botInitCmd;
    }
    if (channel?.details?.twitterUri) {
      tweetTrackingURL = channel?.details?.twitterUri;
    }
  });

  const Header = () => {
    return (
      <>
        <Breadcrumb
          className="p2"
          items={[
            {
              title: (
                <a
                  onClick={() => {
                    router.push({
                      pathname: getGrowthProjectPath(
                        project?.protocolSlug,
                        "Campaign",
                      ),
                    });
                  }}
                >
                  Campaign
                </a>
              ),
            },
            {
              title: "Campaign Detail",
            },
          ]}
        />
        <Card>
          {isLoading ? (
            <LoadingSpinner message="Loading..." />
          ) : data ? (
            <Descriptions bordered>
              <Descriptions.Item label="Name">{data.title}</Descriptions.Item>
              <Descriptions.Item label="Campaign Type">
                {data?.campaignType}
              </Descriptions.Item>
              <Descriptions.Item label="Channel Type">
                {channel_type.join(", ")}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {dayjs(data.createdAt).format("YYYY-MM-DD HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label="Updated At">
                {dayjs(data.updatedAt).format("YYYY-MM-DD HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={3}>
                <CampaignStatus value={data.status} />
              </Descriptions.Item>
              {tweetTrackingURL && (
                <Descriptions.Item label="Tweet tracking URL">
                  <Typography.Link
                    target="_blank"
                    underline
                    href={tweetTrackingURL}
                  >
                    {tweetTrackingURL}
                  </Typography.Link>
                </Descriptions.Item>
              )}
              {botInviteUrl && (
                <Descriptions.Item label="Discord bot step">
                  <Typography.Text mark>Step 1</Typography.Text> Add the FGA
                  discord bot to your server.
                  <br />
                  <Typography.Link
                    target="_blank"
                    underline
                    href={botInviteUrl}
                  >
                    {botInviteUrl}
                  </Typography.Link>
                  <br />
                  <br />
                  <Typography.Text mark>Step 2</Typography.Text> Dispatch the
                  active command to your Discord channel.
                  <br />
                  <Typography.Paragraph>
                    <Space>
                      <pre>{botInitCmd}</pre>
                      <CopyToClipboard
                        text={botInitCmd}
                        onCopy={() => message.success("Copied!")}
                      >
                        <Button type="primary">Copy</Button>
                      </CopyToClipboard>
                    </Space>
                  </Typography.Paragraph>
                </Descriptions.Item>
              )}
              {data?.details && (
                <Descriptions.Item label="Details" span={3}>
                  <>
                    {Object.entries(data?.details).map?.((detail, index) => {
                      return (
                        <div key={index}>
                          <div>
                            <Typography.Text
                              style={{ whiteSpace: "pre-wrap" }}
                              className=" text-bold"
                            >
                              {detail?.[0]}
                            </Typography.Text>
                          </div>
                          <div>
                            <Typography.Paragraph
                              style={{ whiteSpace: "pre-wrap" }}
                              className=" text-light"
                            >
                              {detail?.[1]}
                            </Typography.Paragraph>
                          </div>
                        </div>
                      );
                    })}
                  </>
                </Descriptions.Item>
              )}
            </Descriptions>
          ) : (
            <Empty description="No data" />
          )}
        </Card>
      </>
    );
  };

  return (
    <div className="flex flex-col" style={{ padding: 20 }}>
      {!isLoading && data?.title ? (
        <div>
          {data.status === "init" ? (
            <>
              {Header()}
              <div style={{ marginTop: 10 }}>
                <Card>
                  <Alert
                    message="Your campaign is waiting to be started..."
                    description="Please make sure you have completed the campaign steps above and the data will be presented after the steps are completed."
                    type="info"
                    showIcon
                  />
                </Card>
              </div>
            </>
          ) : (
            <PublicDashboard
              params={{ uuid: "6cc6c56f-b265-4ab1-a2a0-300efde7f319" }}
              // params={{ uuid: "b46fc872-c97d-4300-a83e-45fa61760ad2" }}
              header={Header()}
              hideTitle={true}
              location={location}
              hideAllParams={true}
              project={{ ...project, campaignTitle: data?.title }}
              isFullscreen={false}
              // className="ml-250 mt-60"
              key={project?.protocolSlug}
              hideFooter
            />
          )}
        </div>
      ) : (
        <LoadingSpinner message="Loading..." />
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(CampaignDetail);
