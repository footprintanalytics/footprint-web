/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { Button, Card, Table, Dropdown, Space, Badge, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { getUser } from "metabase/selectors/user";
import { GetFgaCohort } from "metabase/new-service";
import Link from "metabase/core/components/Link/Link";
import UploadWallets from "../components/buttons/UploadWallets";
import { getGrowthProjectPath } from "../utils/utils";
import { cohortTips } from "../utils/data";

const CohortList = props => {
  const { isLoading, data, refetch } = useQuery(
    ["getCohort", props.project],
    GetFgaCohort,
    {
      refetchInterval: 5000,
    },
  );

  const dataSource = data?.list?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      render: text => {
        let tip =
          cohortTips.get(
            [
              `${props.project?.protocolName} Users`,
              `${props.project?.protocolSlug} users`,
            ].includes(text)
              ? "{project slug} Users"
              : text,
          ) ?? null;
        // TODO: Don't show the tooltip temporarily
        tip = null;
        return (
          <Tooltip placement="top" title={tip} arrow={true}>
            <Link
              to={`/growth/public/dashboard/55b1eb29-b15e-458f-9241-1862a0d19d3b?tag=${text}&cohort_title=${text}#from=Cohort`}
            >
              {text} {tip && <QuestionCircleOutlined />}
            </Link>
          </Tooltip>
        );
      },
    },
    {
      title: "Number of Wallets",
      dataIndex: "numberOfWallets",
      key: "numberOfWallets",
      render: text => {
        if (!Number(text)) {
          return <Badge status="processing" text="Loading" />;
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
          <Link
            to={`/growth/public/dashboard/55b1eb29-b15e-458f-9241-1862a0d19d3b?tag=${record.title}&cohort_title=${record.title}#from=Cohort`}
          >
            User Profile
          </Link>
          <Link
            to={`/growth/public/dashboard/dce33214-a079-4eb8-b53f-defaabde2eba?cohort_id=${record.cohortId}&cohort_title=${record.title}#from=Cohort`}
          >
            Wallet List
          </Link>
          {/*<Link
            to={getGrowthProjectPath(
              props.router?.params?.project,
              "CreateCampaign",
            )}
          >
            Create Campaign
          </Link>*/}
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
