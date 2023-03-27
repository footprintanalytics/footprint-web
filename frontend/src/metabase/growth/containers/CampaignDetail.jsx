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
      return await getCampaignDetail({ id });
    },
    QUERY_OPTIONS,
  );

  const items = [
    {
      key: "3",
      label: <CreateCampaign plain={true} />,
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
        title="Campaign Dateil"
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
            {/* <Descriptions.Item label="Detail info">
              {data.details}
            </Descriptions.Item> */}
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
