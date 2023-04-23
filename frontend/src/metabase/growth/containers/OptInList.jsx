/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
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
  Tooltip,
} from "antd"
import { useQuery } from "react-query"
import dayjs from "dayjs"
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config"
import { getUser } from "metabase/selectors/user"
import LoadingSpinner from "metabase/components/LoadingSpinner"
import { getCampaign } from "metabase/new-service"
import { formatType, getGrowthProjectPath, valueFormat } from "../utils/utils";
import CreateCampaignModal from "../components/Modal/CreateCampaignModal";
import ViewOptInModal from "../components/Modal/ViewOptInModal";
import "../css/utils.css";

const OptInList = props => {
  const { router, location, project } = props;
  const [isModalOpen, setIsModalOpen] = useState({
    open: false,
    type: "",
  });
  const [dataSource, setDataSource] = useState([]);
  const { isLoading, data, refetch, isFetching } = useQuery(
    ["getCampaign", project?.id],
    async () => {
      return await getCampaign({ projectId: parseInt(project?.id) });
    },
    { ...QUERY_OPTIONS, enabled: !!project?.id },
  );
  useEffect(() => {
    if (data) {
      const dataSourceTemp = data?.list
        ?.filter(i => {
          // only show the campaign with channel: Discord bot or Tweet URL
          return (
            i.channels.findIndex(j =>
              ["Discord bot", "Tweet URL"].includes(j.channelName),
            ) !== -1
          );
        })
        ?.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      setDataSource(dataSourceTemp);
    }
  }, [data]);

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
              // return <Tag key={channel.id}>{channel.channelName}</Tag>
              return (
                <Tooltip
                  key={channel.id}
                  title={formatType(channel.channelName)}
                >
                  <Avatar
                    src={`https://footprint-imgs.oss-us-east-1.aliyuncs.com/${
                      channel.channelName === "Tweet URL"
                        ? "20220516201254"
                        : "20220516201343"
                    }.png`}
                    size={25}
                    className="bg-white mr1"
                  ></Avatar>
                </Tooltip>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Number of Wallet Address",
      dataIndex: "performanceDetails",
      align: "right",
      render: item => valueFormat(item?.numberOfWalletAddress),
    },
    {
      title: "Number of Twitter Name",
      dataIndex: "performanceDetails",
      align: "right",
      render: item => valueFormat(item?.numberOfTwitterName),
    },
    {
      title: "Number of Discord Name",
      dataIndex: "performanceDetails",
      align: "right",
      render: item => valueFormat(item?.numberOfDiscordName),
    },
    {
      title: "Number of Email",
      dataIndex: "performanceDetails",
      align: "right",
      render: item => valueFormat(item?.numberOfEmail),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            className="p0"
            onClick={() => {
              setIsModalOpen({
                open: true,
                type:
                  record?.channels?.[0]?.channelName === "Tweet URL"
                    ? "Twitter"
                    : "Discord",
                channel: record?.channels?.[0],
              });
            }}
          >
            View
          </Button>
          <Button
            type="link"
            disabled={true}
            className="p0"
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

          <Button className="p0" type="link" disabled={true}>
            Save as cohort
          </Button>
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
          <Col span={24} key="desc" className=" text-center">
            <Typography.Title level={4}>
              Use Footprint GA Opt-In Tool to speed up user information
              collection
            </Typography.Title>
            <Typography.Paragraph>
              Gain valuable insights about your customers and optimize your
              products and services. Easily track user behaviors and preferences
              for better products and services, making your business more
              competitive.
            </Typography.Paragraph>
          </Col>
          <Col sm={24} md={12} lg={8} xl={6} xxl={4} key="twitter">
            <Card
              hoverable
              className=" rounded"
              style={{ width: "100%" }}
              onClick={() => {
                setIsModalOpen({ open: true, type: "Twitter" });
              }}
            >
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
                <Button type="primary" className=" rounded mt1">
                  Set up now
                </Button>
              </div>
            </Card>
          </Col>
          <Col sm={24} md={12} lg={8} xl={6} xxl={4} key="discord">
            <Card
              className="rounded"
              hoverable
              style={{ width: "100%" }}
              onClick={() => {
                setIsModalOpen({ open: true, type: "Discord" });
              }}
            >
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

                <Button type="primary" className=" rounded mt1">
                  Set up now
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <Card title="Opt-In List" className="mt2">
        {isLoading || isFetching || !project?.id ? (
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
      {isModalOpen?.open && (
        <CreateCampaignModal
          open={isModalOpen?.open}
          optInType={isModalOpen?.type}
          channel={isModalOpen?.channel}
          location={location}
          project={project}
          router={router}
          onSuccess={() => {
            refetch();
            setIsModalOpen({ open: false });
          }}
          onCancel={() => {
            setIsModalOpen({ open: false });
          }}
        />
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(OptInList);
