/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  Table,
  Typography,
  Dropdown,
  Tag,
  Badge,
  Descriptions,
  Empty,
} from "antd";
import { SyncOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import { Link } from "react-router";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { getUser } from "metabase/selectors/user";
import { getCampaignDetail } from "metabase/new-service";
import CreateCampaign from "../components/buttons/CreateCampaign";
import UploadWallets from "../components/buttons/UploadWallets";
import { getGrowthProjectPath } from "../utils/utils";

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
  data?.channels?.map?.(channel => {
    if (channel?.details?.discordGuildId) {
      botInviteUrl = `https://discord.com/oauth2/authorize?client_id=1069198197441957979&scope=bot&permissions=0&guild_id=${data?.channel?.details?.discordGuildId}`;
    }
  });

  const items = [
    {
      key: "3",
      label: (
        <div
          onClick={() =>
            router?.push({
              pathname: getGrowthProjectPath(
                router?.params?.project,
                "CreateCampaign",
              ),
            })
          }
        >
          Create Campaign
        </div>
      ),
      // label: <CreateCampaign plain={true} />,
    },
    {
      key: "1",
      label: (
        <div
          onClick={() =>
            props.router?.push({
              pathname: getGrowthProjectPath(
                props.router?.params?.project,
                "Potential Users",
              ),
            })
          }
        >
          Filter Wallets
        </div>
      ),
    },
    {
      key: "2",
      label: <UploadWallets />,
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card
        title="Campaign Detail"
        extra={
          <Dropdown menu={{ items }}>
            <Button type="primary">Create</Button>
          </Dropdown>
        }
      >
        {isLoading ? (
          <LoadingSpinner message="Loading..." />
        ) : data ? (
          <Descriptions bordered>
            <Descriptions.Item label="Name">{data.title}</Descriptions.Item>
            <Descriptions.Item label="Campaign Type">
              {data?.campaignType}
            </Descriptions.Item>
            <Descriptions.Item label="Channel Type">
              {data?.channel?.channelName}
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
            {botInviteUrl && (
              <Descriptions.Item label="Discord bot step">
                {/* todo  guild_id 要真实从接口拿*/}
                Step 1 : Invite the bot to your server
                <br />
                <Link
                  target="_blank"
                  color="blue"
                  href={botInviteUrl}
                >{`https://discord.com/oauth2/authorize?client_id...`}</Link>
                <br />
                <br />
                Step 2 : send command to the channel{" "}
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
