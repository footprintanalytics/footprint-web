/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { Button, Card, Table, Typography, Tag, Badge } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { getUser } from "metabase/selectors/user";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { getCampaign } from "metabase/new-service";
import { getGrowthProjectPath, getLatestGAProjectId } from "../utils/utils";

const CampaignList = props => {
  const { isLoading, data } = useQuery(
    ["getCampaign", getLatestGAProjectId()],
    async () => {
      return await getCampaign({ projectId: parseInt(getLatestGAProjectId()) });
    },
    QUERY_OPTIONS,
  );
  const dataSource = data?.list?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const columns = [
    {
      title: "Title",
      render: (_, row) => (
        <Typography.Link
          onClick={() => {
            props.router?.push({
              pathname: getGrowthProjectPath(
                props.router?.params?.project,
                "CampaignDetail",
              ),
              hash: "#id=" + row.campaignId,
            });
          }}
        >
          {row.title}
        </Typography.Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: text => {
        return (
          <>
            {["init"].includes(text) ? (
              <Tag icon={<SyncOutlined spin />} color="processing">
                {text}
              </Tag>
            ) : (
              <Badge status="success" text={text} />
            )}
          </>
        );
      },
    },
    {
      title: "Campaign Type",
      dataIndex: "campaignType",
      key: "campaignType",
      render: text => {
        return <Tag>{text}</Tag>;
      },
    },
    {
      title: "Channel Type",
      dataIndex: "channels",
      key: "channelType",
      render: channels => {
        return (
          <div>
            {channels.map(channel => {
              return <Tag key={channel.id}>{channel.channelName}</Tag>;
            })}
          </div>
        );
      },
    },
    {
      title: "Create Time",
      dataIndex: "createdAt",
      render: text => dayjs(text).format("YYYY-MM-DD HH:mm"),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card
        title="Campaigns"
        extra={
          // <Dropdown menu={{ items }}>
          <Button
            type="primary"
            onClick={() =>
              props.router?.push({
                pathname: getGrowthProjectPath(
                  props.router?.params?.project,
                  "CreateCampaign",
                ),
              })
            }
          >
            Create Campaign
          </Button>
          // </Dropdown>
        }
      >
        {isLoading ? (
          <LoadingSpinner message="Loading..." />
        ) : (
          <Table
            rowKey="campaignId"
            loading={isLoading}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
        )}
      </Card>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(CampaignList);
