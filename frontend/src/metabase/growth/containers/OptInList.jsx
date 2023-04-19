/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  Table,
  Typography,
  Tag,
  Col,
  Row,
  Avatar,
  Space,
} from "antd";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { getUser } from "metabase/selectors/user";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { getCampaign } from "metabase/new-service";
import {
  getGrowthProjectPath,
  getLatestGAProjectId,
  valueFormat,
} from "../utils/utils";
import CampaignStatus from "../components/CampaignStatus";

const OptInList = props => {
  const latestGAProjectId = getLatestGAProjectId();
  const { isLoading, data } = useQuery(
    ["getCampaign", latestGAProjectId],
    async () => {
      return await getCampaign({ projectId: parseInt(latestGAProjectId) });
    },
    { ...QUERY_OPTIONS, enabled: !!latestGAProjectId },
  );
  const dataSource = data?.list?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const columns = [
    {
      title: "Create Time",
      dataIndex: "createdAt",
      render: text => dayjs(text).format("YYYY-MM-DD HH:mm"),
    },
    // {
    //   title: "Title",
    //   render: (_, row) => (
    //     <Typography.Link
    //       onClick={() => {
    //         props.router?.push({
    //           pathname: getGrowthProjectPath(
    //             props.router?.params?.project,
    //             "CampaignDetail",
    //           ),
    //           hash: "#id=" + row.campaignId,
    //         });
    //       }}
    //     >
    //       {row.title}
    //     </Typography.Link>
    //   ),
    // },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   render: text => <CampaignStatus value={text} />,
    // },
    // {
    //   title: "Campaign Type",
    //   dataIndex: "campaignType",
    //   key: "campaignType",
    //   render: text => {
    //     return <Tag>{text}</Tag>;
    //   },
    // },
    {
      title: "Type",
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
      title: "Number of Wallet Address",
      dataIndex: "status",
      align: "right",
      render: text => valueFormat(0),
    },
    {
      title: "Number of Twitter Name",
      dataIndex: "status",
      align: "right",
      render: text => valueFormat(0),
    },
    {
      title: "Number of Discord Name",
      dataIndex: "status",
      align: "right",
      render: text => valueFormat(0),
    },
    {
      title: "Number of Email",
      dataIndex: "status",
      align: "right",
      render: text => valueFormat(0),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link">View</Button>
          <Button
            type="link"
            onClick={() => {
              props.router?.push({
                pathname: getGrowthProjectPath(
                  props.router?.params?.project,
                  "CampaignDetail",
                ),
                hash: "#id=" + record.campaignId,
              });
              // props.router?.push({
              //   pathname: `/growth/public/dashboard/55b1eb29-b15e-458f-9241-1862a0d19d3b?tag=${record.title}&cohort_title=${record.title}#from=Cohort`,
              // });
            }}
          >
            Detail
          </Button>

          <Button type="link">Save as cohort</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full" style={{ padding: 20 }}>
      <div className="w-full flex flex-row">
        <Row
          gutter={[15, 15]}
          className="w-full items-center"
          style={{ minHeight: 200 }}
        >
          <Col
            sm={24}
            md={24}
            lg={24}
            xl={10}
            xxl={8}
            key="desc"
            className=" text-center"
          >
            <Typography.Title level={4}>
              Use FGA tool to speed up user information collection
            </Typography.Title>
            <Typography.Paragraph>
              Gain valuable insights about your customers and optimize your
              products and services. Easily track user behaviors and preferences
              for better products and services, making your business more
              competitive.
            </Typography.Paragraph>
          </Col>
          <Col sm={24} md={12} lg={8} xl={6} xxl={4} key="twitter">
            <Card hoverable className=" rounded" style={{ width: "100%" }}>
              <div className=" flex flex-column items-center" style={{}}>
                <Avatar
                  src={
                    "https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201254.png"
                  }
                  size={45}
                  className="bg-white mb1"
                ></Avatar>
                <Typography.Text ellipsis={true}>
                  {"Twitter Tweet"}
                </Typography.Text>
              </div>
            </Card>
          </Col>
          <Col sm={24} md={12} lg={8} xl={6} xxl={4} key="discord">
            <Card className="rounded" hoverable style={{ width: "100%" }}>
              <div className=" flex flex-column items-center" style={{}}>
                <Avatar
                  src={
                    "https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201343.png"
                  }
                  size={45}
                  className="bg-white mb1"
                ></Avatar>
                <Typography.Text ellipsis={true}>
                  {"Discord Bot"}
                </Typography.Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <Card title="Opt-In List" className="mt2">
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

export default connect(mapStateToProps)(OptInList);
