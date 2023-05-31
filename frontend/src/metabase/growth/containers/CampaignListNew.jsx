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
  Image,
  Badge,
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
import CreateCampaignModalNew from "../components/Modal/CreateCampaignModalNew";
import "../css/utils.css";

const CampaignListNew = props => {
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
        campaignType: "Notification",
      });
    },
    { ...QUERY_OPTIONS, enabled: !!project?.id },
  );
  useEffect(() => {
    if (data) {
      const dataSourceTemp = data?.list
        ?.filter(
          i =>
            // only show the campaignType : Notification / Quest / Airdrop
            i.campaignType === "Notification" ||
            i.campaignType === "Quest" ||
            i.campaignType === "Airdrop",
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
                <>
                  <Tooltip
                    key={channel.id}
                    title={formatType(channel.campaignType)}
                  >
                    <Image
                      preview={false}
                      style={{ borderRadius: "50%" }}
                      src={toolIcons.get(channel.campaignType)}
                      width={25}
                      height={25}
                    ></Image>
                  </Tooltip>
                  <Tooltip
                    key={channel.id}
                    className="ml1"
                    title={formatType(channel.channelName)}
                  >
                    <Image
                      preview={false}
                      style={{ borderRadius: "50%" }}
                      src={channelIcons.get(channel.channelName)}
                      width={25}
                      height={25}
                    ></Image>
                  </Tooltip>
                </>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Total Number",
      dataIndex: "performanceDetails",
      align: "right",
      render: item => valueFormat(item?.numberOfTotal ?? 0),
    },
    {
      title: "Number of Success",
      dataIndex: "performanceDetails",
      align: "right",
      render: item => valueFormat(item?.numberOfSuccess ?? 0),
    },
    {
      title: "Number of Failed",
      dataIndex: "performanceDetails",
      align: "right",
      render: item => valueFormat(item?.numberOfFailed ?? 0),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* <Button
            type="link"
            className="p0"
            onClick={() => {
              setIsModalOpen({
                open: true,
                type: record?.campaignType,
                campaign: record,
              });
            }}
          >
            View
          </Button> */}
          <Button
            className="p0"
            type="link"
            disabled={!(record?.performanceDetails?.numberOfTotal > 0)}
            onClick={() => {
              checkIsNeedContactUs(
                modal,
                project,
                () => {
                  setOpenCreatingCohort({
                    open: true,
                    campaignId: record?.campaignId,
                    count: record?.performanceDetails?.numberOfTotal,
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
  const toolIcons = new Map([
    [
      "Notification",
      "https://static.footprint.network/campaign_notification_icon.svg",
    ],
    ["Quest", "https://static.footprint.network/campaign_quest_icon.svg"],
    ["Airdrop", "https://static.footprint.network/campaign_airdrop_icon.svg"],
  ]);
  // email, telegram, discord
  const channelIcons = new Map([
    ["Footprint GA Email", "https://static.footprint.network/icon_email2.png"],
    ["Email", "https://static.footprint.network/icon_email2.png"],
    ["FGA:Email", "https://static.footprint.network/icon_email2.png"],
    ["Telegram", "https://static.footprint.network/20220516201327.png"],
    ["Discord", "https://static.footprint.network/20220516201343.png"],
    ["Quest Flow", "https://static.footprint.network/Questflow.jpg"],
    ["Questflow", "https://static.footprint.network/Questflow.jpg"],
  ]);
  // tools : Notification/Quest/Aurdrop
  const toolList = [
    {
      name: "Notification",
      type: "Notification",
      icon: toolIcons.get("Notification"),
      enabled: true,
    },
    {
      name: "Quest",
      type: "Quest",
      icon: toolIcons.get("Quest"),
      enabled: false,
    },
    {
      name: "Airdrop",
      type: "Airdrop",
      icon: toolIcons.get("Airdrop"),
      enabled: false,
    },
  ];
  const [cohortName, setCohortName] = useState("");
  const [isCreatingCohort, setCreatingCohort] = useState(false);
  const [isOpenCreatingCohort, setOpenCreatingCohort] = useState({
    open: false,
    campaignId: null,
  });
  // save as cohort
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
                  console.log("toAddSegment error", error);
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

  const getChannel = item => {
    return (
      <Card
        hoverable
        className="rounded"
        style={{ width: "100%" }}
        onClick={() => {
          if (!item.enabled) return;
          checkIsNeedContactUs(
            modal,
            project,
            () => {
              if (item.type === "Notification") {
                router.push({
                  pathname: `/growth/campaign/${item.type}`,
                });
                return;
              }
              // setIsModalOpen({ open: true, type: item.type });
            },
            () => {},
            true,
          );
        }}
      >
        <div className=" flex flex-column items-center" style={{}}>
          <Image preview={false} src={item.icon} width={40} height={40}></Image>

          <Typography.Text className=" mt1" ellipsis={true}>
            {item.name}
          </Typography.Text>
          <Button
            type="primary"
            className=" rounded mt1"
            disabled={!item.enabled}
          >
            {item.enabled ? "Set up now" : "Coming soon"}
          </Button>
        </div>
      </Card>
    );
  };

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
          <Col span={24} key="desc" className="">
            <Typography.Title level={4}>
              Use Footprint GA Activation Tool to create new activation links to
              attribute acquired users
            </Typography.Title>
            <Typography.Paragraph>
              Curate incentive ativations, run superior quests, reward your
              community with token gating, manage allowlists & run targeted
              airdrops.
            </Typography.Paragraph>
          </Col>
          {toolList.map((item, index) => {
            return (
              <Col sm={24} md={12} lg={8} xl={6} xxl={4} key={item.type}>
                {index === 0 ? (
                  <Badge.Ribbon text={"Beta"} color="green">
                    {getChannel(item)}
                  </Badge.Ribbon>
                ) : (
                  getChannel(item)
                )}
              </Col>
            );
          })}
        </Row>
      </div>
      <Card title="Activation" className="mt2">
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
        <CreateCampaignModalNew
          open={isModalOpen?.open}
          campaignType={isModalOpen?.type}
          channel={isModalOpen?.channel}
          location={location}
          project={project}
          toolIcons={toolIcons}
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

export default connect(mapStateToProps)(CampaignListNew);
