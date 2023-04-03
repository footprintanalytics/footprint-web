/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { Button, Card, Table, Typography, Dropdown, Tag, Space } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { getUser } from "metabase/selectors/user";
import { GetFgaCohort } from "metabase/new-service";
import Link from "metabase/core/components/Link/Link";
import UploadWallets from "../components/buttons/UploadWallets";
import { getGrowthProjectPath } from "../utils/utils";

const CohortList = props => {
  const { isLoading, data, refetch } = useQuery(["getCohort"], GetFgaCohort);

  const dataSource = data?.list?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      render: text => (
        <Typography.Link
          href={`/growth/@rogerD/Cohort-User-Profile?tag=${text}`}
          target="_blank"
        >
          {text}
        </Typography.Link>
      ),
    },
    {
      title: "Number of Wallets",
      dataIndex: "numberOfWallets",
      key: "numberOfWallets",
      render: text => {
        if (!Number(text)) {
          return (
            <Tag icon={<SyncOutlined spin />} color="processing">
              Processing
            </Tag>
          );
        }
        return Number(text).toLocaleString();
      },
    },
    {
      title: "Create Time",
      dataIndex: "createdAt",
      render: text => dayjs(text).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            href={`/growth/@rogerD/Cohort-User-Profile?tag=${record.title}`}
            target="_blank"
          >
            User Profile
          </Typography.Link>
          {/* <Link>Wallet Detail</Link> */}
          <Link
            color="rgb(52, 52, 178)"
            to={getGrowthProjectPath(
              props.router?.params?.project,
              "CreateCampaign",
            )}
          >
            Create Campaign
          </Link>
        </Space>
      ),
    },
  ];

  const items = [
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
      label: <UploadWallets refetchData={refetch} />,
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card
        title="Cohort"
        extra={
          <Dropdown menu={{ items }}>
            <Button type="primary">Create Cohort</Button>
          </Dropdown>
        }
      >
        <Table
          rowKey="cohortId"
          loading={isLoading}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </Card>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(CohortList);
