/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  Table,
  Typography,
  Modal,
  Col,
  Row,
  Avatar,
  Space,
  Tooltip,
  Input,
  message,
  Divider,
} from "antd";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { getUser } from "metabase/selectors/user";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { getCampaign, createCampaignCohort } from "metabase/new-service";
import {
  checkIsNeedContactUs,
  formatType,
  getGrowthProjectPath,
  showCohortSuccessModal,
  valueFormat,
} from "../utils/utils";
import CreateCampaignModal from "../components/Modal/CreateCampaignModal";
import "../css/utils.css";

const SocialConnectList = props => {
  const { router, location, project } = props;
  const [isModalOpen, setIsModalOpen] = useState({
    open: false,
    type: "",
  });
  const [dataSource, setDataSource] = useState([]);
  const { isLoading, data, refetch, isFetching } = useQuery(
    ["getCampaign", project?.id],
    async () => {
      return await getCampaign({
        projectId: parseInt(project?.id),
        campaignType: "User Contact",
      });
    },
    { ...QUERY_OPTIONS, enabled: !!project?.id },
  );
  useEffect(() => {
    if (data) {
      const dataSourceTemp = data?.list
        ?.filter(
          i =>
            // only show the campaignType : User Contact
            i.campaignType === "User Contact",
        )
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
      render: item => valueFormat(item?.numberOfWalletAddress ?? 0),
    },
    {
      title: "Number of Twitter Name",
      dataIndex: "performanceDetails",
      align: "right",
      render: item => valueFormat(item?.numberOfTwitterName ?? 0),
    },
    {
      title: "Number of Discord Name",
      dataIndex: "performanceDetails",
      align: "right",
      render: item => valueFormat(item?.numberOfDiscordName ?? 0),
    },
    {
      title: "Number of Email",
      dataIndex: "performanceDetails",
      align: "right",
      render: item => valueFormat(item?.numberOfEmail ?? 0),
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
            className="p0"
            type="link"
            disabled={!(record?.performanceDetails?.numberOfWalletAddress > 0)}
            onClick={() => {
              checkIsNeedContactUs(
                modal,
                project,
                () => {
                  setOpenCreatingCohort({
                    open: true,
                    campaignId: record?.campaignId,
                    count: record?.performanceDetails?.numberOfWalletAddress,
                  });
                },
                () => {},
                true,
              );
            }}
          >
            Save as segment
          </Button>
          <Button
            type="link"
            disabled={true}
            className="p0"
            onClick={() => {
              props.router?.push({
                pathname: getGrowthProjectPath(
                  props.router?.params?.project,
                  "ActivationDetail",
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
        </Space>
      ),
    },
  ];
  //tool : Twitter Tweet/ Discord Bot
  const toolList = [
    {
      name: "Twitter Tweet",
      type: "Twitter",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201254.png",
      enabled: true,
    },
    {
      name: "Discord Bot",
      type: "Discord",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220516201343.png",
      enabled: true,
    },
  ];
  const [cohortName, setCohortName] = useState("");
  const [isCreatingCohort, setCreatingCohort] = useState(false);
  const [isOpenCreatingCohort, setOpenCreatingCohort] = useState({
    open: false,
    campaignId: null,
  });
  const modalProps = {
    title: "Save as segment",
    confirmLoading: isCreatingCohort,
    footer: null,
    open: isOpenCreatingCohort?.open,
    content: (
      <div>
        <Divider className="my2" />
        <h4>Segment Name</h4>
        <Input
          className="mt1 mb1"
          placeholder="Input segment name"
          onChange={event => {
            setCohortName(event.target.value);
            // title = event.target.value;
          }}
        />
        <h5>You have selected {isOpenCreatingCohort?.count} addresses.</h5>
        <div className="flex flex-row-reverse mt2">
          <Button
            type="primary"
            loading={isCreatingCohort}
            onClick={() => {
              if (!cohortName?.length > 0) {
                message.error("Please input segment name");
                return false;
              }
              setCreatingCohort(true);
              createCampaignCohort({
                campaignId: isOpenCreatingCohort?.campaignId,
                title: cohortName,
              })
                .then(result => {
                  setOpenCreatingCohort({ open: false });
                  showCohortSuccessModal(
                    modal,
                    result,
                    router,
                    "Social Connect",
                  );
                })
                .catch(error => {
                  console.log("toAddCohort error", error);
                })
                .finally(() => {
                  setCreatingCohort(false);
                });
            }}
          >
            {isCreatingCohort ? "Creating..." : "Create"}
          </Button>
          <Button
            className="mr1"
            onClick={() => setOpenCreatingCohort({ open: false })}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    closable: true,
    maskClosable: true,
    cancelText: "Cancel",
    okText: "Create",
    onCancel() {
      setCreatingCohort(false);
      setOpenCreatingCohort({ open: false });
    },
  };

  const [modal, contextHolder] = Modal.useModal();
  return (
    <div className="w-full" style={{ padding: 20 }}>
      {contextHolder}
      {isOpenCreatingCohort?.open && (
        <Modal {...modalProps}>{modalProps.content}</Modal>
      )}
      <div className="w-full flex flex-row">
        <Row
          gutter={[15, 15]}
          className="w-full items-center"
          style={{ minHeight: 200 }}
        >
          <Col span={24} key="desc" className=" text-center">
            <Typography.Title level={4}>
              Use Footprint GA Social Connect Tool to speed up user information
              collection
            </Typography.Title>
            <Typography.Paragraph>
              Gain valuable insights about your customers and optimize your
              products and services. Easily track user behaviors and preferences
              for better products and services, making your business more
              competitive.
            </Typography.Paragraph>
          </Col>
          {toolList.map(tool => {
            return (
              <Col sm={24} md={12} lg={8} xl={6} xxl={4} key={tool.type}>
                <Card
                  hoverable
                  className=" rounded"
                  style={{ width: "100%" }}
                  onClick={() => {
                    if (!tool.enabled) return;
                    checkIsNeedContactUs(
                      modal,
                      project,
                      () => {
                        setIsModalOpen({ open: true, type: tool.type });
                      },
                      () => {},
                      true,
                    );
                  }}
                >
                  <div className=" flex flex-column items-center" style={{}}>
                    <Avatar
                      src={tool.icon}
                      size={45}
                      className="bg-white mb1"
                    ></Avatar>
                    <Typography.Text ellipsis={true}>
                      {tool.name}
                    </Typography.Text>
                    <Button
                      type="primary"
                      className=" rounded mt1"
                      disabled={!tool.enabled}
                    >
                      {tool.enabled ? "Set up now" : "Coming soon"}
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
      <Card title="Social Connect" className="mt2">
        {isLoading || isFetching || !project?.id ? (
          <LoadingSpinner message="Loading..." />
        ) : (
          <Table
            rowKey="campaignId"
            loading={isLoading}
            minHeight={400}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
        )}
      </Card>
      {isModalOpen?.open && (
        <CreateCampaignModal
          open={isModalOpen?.open}
          socialType={isModalOpen?.type}
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

export default connect(mapStateToProps)(SocialConnectList);
