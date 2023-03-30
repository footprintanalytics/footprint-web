/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { Button, Card, Tag, Badge, Descriptions, Empty } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import { Link } from "react-router";
import "../css/utils.css";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { getUser } from "metabase/selectors/user";
import { getCampaignDetail } from "metabase/new-service";

const CampaignDetail = props => {
  const { location, router } = props;
  const id = location.query.id;
  const { isLoading, data } = useQuery(
    ["getCampaignDetail", id],
    async () => {
      if (id) {
        return await getCampaignDetail({ id });
      }
    },
    QUERY_OPTIONS,
  );

  let botInviteUrl = null;
  let tweetTrackingURL = null;
  let channel_type = [];
  data?.channels?.map?.(channel => {
    channel_type.push(channel?.channelName);
    if (channel?.details?.discordGuildId) {
      botInviteUrl = `https://discord.com/oauth2/authorize?client_id=1069198197441957979&scope=bot&permissions=0&guild_id=${data?.channel?.details?.discordGuildId}`;
    }
    if (channel?.details?.twitterUri) {
      tweetTrackingURL = channel?.details?.twitterUri;
    }
  });

  return (
    <div style={{ padding: 20 }}>
      <Card title="Campaign Dateil">
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
              {data.createdAt}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {data.updatedAt}
            </Descriptions.Item>
            {/* {} */}
            <Descriptions.Item label="Status" span={3}>
              {data.status === "pending" ? (
                <Tag icon={<SyncOutlined spin />} color="processing">
                  pending
                </Tag>
              ) : (
                <Badge status="success" text={data.status} />
              )}
            </Descriptions.Item>
            {tweetTrackingURL && (
              <Descriptions.Item label="Tweet tracking URL">
                <Link target="_blank" color="blue" href={tweetTrackingURL}>
                  {tweetTrackingURL}
                </Link>
              </Descriptions.Item>
            )}
            {botInviteUrl && (
              <Descriptions.Item label="Discord bot step">
                {/* todo  guild_id 要真实从接口拿*/}
                <span style={{ color: "red" }}>Step 1</span> : Invite the bot to
                your server
                <br />
                <Link
                  target="_blank"
                  color="blue"
                  href={botInviteUrl}
                >{`https://discord.com/oauth2/authorize?client_id...`}</Link>
                <br />
                <br />
                <span style={{ color: "red" }}>Step 2</span> : send command to
                the channel{" "}
                <Button size="small" type="primary">
                  copy
                </Button>
              </Descriptions.Item>
            )}
          </Descriptions>
        ) : (
          <Empty description="No data" />
        )}
      </Card>
      {/* 可能这里要嵌入一个 dashboard */}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(CampaignDetail);
