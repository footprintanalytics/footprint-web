/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  Table,
  Dropdown,
  Space,
  Badge,
  Tooltip,
  Tag,
  Typography,
  Divider,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { getUser } from "metabase/selectors/user";
import { GetFgaCohort } from "metabase/new-service";
import Link from "metabase/core/components/Link/Link";
import UploadWallets from "../components/buttons/UploadWallets";
import { formatTag, getGrowthProjectPath } from "../utils/utils";
import {
  cohortTips,
  user_profile_link,
  wallet_profile_link,
} from "../utils/data";

const CohortList = props => {
  const { isLoading, data, refetch } = useQuery(
    ["getCohort", props.project],
    async () => {
      return GetFgaCohort({ projectId: props.project?.id });
    },
    {
      refetchInterval: 5000,
    },
  );

  const dataSource = data?.list
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    ?.filter(f => !["hhh", "all"].includes(f.title) && f.numberOfWallets > 0);

  console.log("cohort", data, dataSource);
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      render: (text, { createdBy, numberOfWallets, cohortId }) => {
        // only format tag for system cohorts
        const title = createdBy !== "user" ? formatTag(text) : text;
        return (
          <Link
            disabled={numberOfWallets === 0}
            to={`${user_profile_link}?cohort_id=${cohortId}&tag=${text}&cohort_title=${text}#from=Cohort`}
          >
            {title}
          </Link>
        );
      },
    },
    {
      title: "Number of Wallets",
      dataIndex: "numberOfWallets",
      key: "numberOfWallets",
      render: (text, { status }) => {
        if (!Number(text)) {
          switch (status) {
            case "Ready":
              return Number(text).toLocaleString();
            case "Init":
            case "Generating":
            case "Failed":
            default:
              return <Badge status="processing" text="Loading" />;
            // return <Badge status="processing" text="Initing" />;
            // case "Failed":
            //   return <Badge status="error" text="Failed" />;
          }
        }
        return Number(text).toLocaleString();
      },
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: text => {
        return <>{text === "user" ? "Admin" : "System"}</>;
      },
    },
    {
      title: "Created Time",
      dataIndex: "createdAt",
      render: text => dayjs(text).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link
            disabled={record.numberOfWallets === 0}
            to={`${user_profile_link}?cohort_id=${record.cohortId}&tag=${record.title}&cohort_title=${record.title}#from=Cohort`}
          >
            User Profile
          </Link>
          <Link
            disabled={record.numberOfWallets === 0}
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

  const tooltipTitle = Array.from(cohortTips).map(([key, value]) => (
    <div key={key} className="mb1">
      <Typography.Text style={{ display: "inline", whiteSpace: "nowrap" }}>
        {key === "{project slug} Users"
          ? `${props.project?.protocolName} Users`
          : key}{" "}
      </Typography.Text>
      <Typography.Text style={{ display: "block" }} type="secondary">
        {value}
      </Typography.Text>
    </div>
  ));

  return (
    <div style={{ padding: 20 }}>
      <Card
        title={
          <Tooltip
            placement="rightTop"
            trigger={["click", "hover"]}
            overlayClassName="my-tooltip"
            title={
              <div className="flex flex-col m1">
                <Typography.Title level={5}>
                  Cohort Description
                </Typography.Title>
                <Divider className="my1" />
                {tooltipTitle}
              </div>
            }
            arrow={true}
          >
            {"Cohort "}
            <QuestionCircleOutlined />
          </Tooltip>
        }
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
