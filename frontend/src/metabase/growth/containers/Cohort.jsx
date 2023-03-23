/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { Button, Card, Table, Typography, Dropdown, Tag } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { getUser } from "metabase/selectors/user";
import { GetFgaCohort } from "metabase/new-service";
import CreateCampaign from "../components/buttons/CreateCampaign";
import UploadWallets from "../components/buttons/UploadWallets";
import { getGrowthProjectPath } from "../utils/utils";

const Cohort = props => {
  const { isLoading, data } = useQuery(["getCohort"], GetFgaCohort);

  const dataSource = data?.list?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      render: text => (
        <Typography.Link
          href={`https://www.footprint.network/@rogerD/Cohort-User-Profile?tag=${text}`}
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
      label: <UploadWallets />,
    },
    {
      key: "3",
      label: <CreateCampaign plain={true} />,
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Card
        title="Cohort"
        extra={
          <Dropdown menu={{ items }}>
            <Button type="primary">Create</Button>
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

export default connect(mapStateToProps)(Cohort);
